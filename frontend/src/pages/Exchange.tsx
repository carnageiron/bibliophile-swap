
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Book, UserCheck, BookCopy, ShieldCheck, Calendar, RefreshCw } from 'lucide-react';
import ExchangeRequestForm from '@/components/ExchangeRequestForm';
import NotFound from './NotFound';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Exchange: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { books, user } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // If we have a book ID, fetch the book details
  const book = id ? books.find(b => b.id === id) : undefined;
  
  // If a book ID was provided but the book doesn't exist, show 404
  if (id && !book) {
    return <NotFound />;
  }
  
  // Book owner information (would be fetched from your database in a real app)
  const bookOwner = book ? {
    id: book.ownerId,
    name: "Book Owner", // This would be fetched from your database
    avatar: "https://i.pravatar.cc/150?img=2", // This would be fetched from your database
    rating: 4.8,
    exchanges: 23,
    joined: "2024-01-15T12:00:00Z"
  } : undefined;
  
  // Prevent users from requesting their own books
  if (book && book.ownerId === user.id) {
    return (
      <div className="container mx-auto py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card className="overflow-hidden border-border/50 shadow-md max-w-md mx-auto">
          <div className="h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
          <CardContent className="py-8 text-center">
            <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <BookCopy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-semibold mb-4">You cannot request your own book</h1>
            <p className="text-muted-foreground mb-6">This book is already in your collection.</p>
            <Button 
              onClick={() => navigate('/books')}
              className="bg-primary hover:bg-primary/90"
            >
              Browse Other Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          {book ? `Request Exchange: ${book.title}` : 'Create Exchange Request'}
        </h1>
        <p className="text-muted-foreground">
          {book 
            ? `Offer one of your books in exchange for ${book.title} by ${book.author}`
            : 'Create a new exchange request by specifying the book you want and the book you\'re offering'
          }
        </p>
      </div>
      
      <ExchangeRequestForm 
        selectedBook={book} 
        ownerId={book?.ownerId}
        ownerName={bookOwner?.name}
        ownerAvatar={bookOwner?.avatar}
      />
    </div>
  );
};

export default Exchange;
