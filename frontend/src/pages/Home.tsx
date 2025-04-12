
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import BookCard from '@/components/BookCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const { books, user, events } = useApp();
  const navigate = useNavigate();
  
  // Get latest books
  const latestBooks = [...books]
    .sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    )
    .slice(0, 6);
  
  // Get a selection of genres with their counts
  const genres = books.flatMap(book => book.genre);
  const genreCounts = genres.reduce<Record<string, number>>((acc, genre) => {
    acc[genre] = (acc[genre] || 0) + 1;
    return acc;
  }, {});
  
  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  
  return (
    <div>
      {/* Hero section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Trade Books, Share Stories, Connect with Readers
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Join our community of book lovers to exchange books, discover new reads, 
            and connect with fellow bibliophiles.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/books')}
            >
              Browse Books
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/trades')}
            >
              Start Trading
            </Button>
          </div>
        </div>
      </section>
      
      {/* Books section */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Latest Books</h2>
          <Button variant="ghost" onClick={() => navigate('/books')} className="group">
            View All 
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {latestBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>
      
      {/* User stats */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Your Book Journey</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-5xl font-bold">{user.credits}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl">Credits Available</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-5xl font-bold">{user.booksOffered}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl">Books Offered</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-5xl font-bold">{user.booksReceived}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xl">Books Received</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Popular categories and upcoming events */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 gap-4">
              {topGenres.map(([genre, count]) => (
                <Card key={genre} className="hover:bg-muted cursor-pointer transition-colors">
                  <CardContent className="p-4 flex justify-between items-center">
                    <p className="font-medium">{genre}</p>
                    <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                      {count} books
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map(event => (
                  <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm font-medium">
                          {new Date(event.date).toLocaleDateString()} • {event.time}
                        </p>
                        <span className="text-sm text-muted-foreground">
                          {event.attendees.length} attending
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="ghost" onClick={() => navigate('/events')} className="group w-full">
                  View All Events
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">No current events</p>
                  <Button onClick={() => navigate('/events')}>Create an Event</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
