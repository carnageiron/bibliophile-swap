
import React, { useState } from 'react';
import { Book } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TradeRequestFormProps {
  bookRequested: Book;
  ownerName: string;
  ownerAvatar: string;
}

const TradeRequestForm: React.FC<TradeRequestFormProps> = ({ 
  bookRequested, 
  ownerName, 
  ownerAvatar 
}) => {
  const { user, books, createTradeRequest } = useApp();
  const [bookOfferedId, setBookOfferedId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  
  const userBooks = books.filter(book => book.ownerId === user.id && book.available);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookOffered = books.find(book => book.id === bookOfferedId);
    
    if (!bookOffered) return;
    
    createTradeRequest({
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      bookRequestedId: bookRequested.id,
      bookRequestedTitle: bookRequested.title,
      bookRequestedCover: bookRequested.cover,
      bookOfferedId: bookOffered.id,
      bookOfferedTitle: bookOffered.title,
      bookOfferedCover: bookOffered.cover,
      message,
      ownerId: bookRequested.ownerId,
      ownerName,
      ownerAvatar,
      status: 'pending'  // Added the missing status property
    });
    
    setIsOpen(false);
    setBookOfferedId('');
    setMessage('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Request Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Trade</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="bookOffered">Choose a book to offer</Label>
            <Select value={bookOfferedId} onValueChange={setBookOfferedId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a book to offer" />
              </SelectTrigger>
              <SelectContent>
                {userBooks.length > 0 ? (
                  userBooks.map(book => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    You don't have any available books to offer
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message to {ownerName}</Label>
            <Textarea
              id="message"
              placeholder="Tell them why you want this book or any additional information..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!bookOfferedId || !message || userBooks.length === 0}
            >
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TradeRequestForm;
