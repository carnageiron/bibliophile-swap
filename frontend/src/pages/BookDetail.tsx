
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import NotFound from './NotFound';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { books, user } = useApp();
  
  const book = books.find(b => b.id === id);
  
  if (!book) {
    return <NotFound />;
  }
  
  const isOwner = book.ownerId === user.id;
  
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="aspect-[2/3] w-full">
              <img 
                src={book.cover} 
                alt={book.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {!isOwner && book.available && (
            <div className="mt-6 space-y-3">
              <Link to={`/exchange/${book.id}`} className="block">
                <Button className="w-full">Request Exchange</Button>
              </Link>
            </div>
          )}
          
          {isOwner && (
            <div className="mt-6">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg">Book Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span>Available for exchange</span>
                    <Badge variant={book.available ? "default" : "outline"}>
                      {book.available ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {book.available ? "Mark as Unavailable" : "Mark as Available"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-muted-foreground mb-4">by {book.author}</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {book.genre.map((g, i) => (
              <Badge key={i} variant="outline">{g}</Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
              <p>{new Date(book.publishedDate).getFullYear()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ISBN</h3>
              <p>{book.isbn}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Pages</h3>
              <p>{book.pageCount}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Condition</h3>
              <p>{book.condition}</p>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p className="text-muted-foreground whitespace-pre-line">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
