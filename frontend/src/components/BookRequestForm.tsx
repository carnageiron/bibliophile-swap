
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BookRequestFormProps {
  bookRequested: Book;
  ownerName: string;
  ownerAvatar: string;
}

const BookRequestForm: React.FC<BookRequestFormProps> = ({ 
  bookRequested, 
  ownerName, 
  ownerAvatar 
}) => {
  const { user, createTradeRequest } = useApp();
  const [message, setMessage] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createTradeRequest({
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      bookRequestedId: bookRequested.id,
      bookRequestedTitle: bookRequested.title,
      bookRequestedCover: bookRequested.cover,
      message,
      ownerId: bookRequested.ownerId,
      ownerName,
      ownerAvatar,
      status: 'pending'  // Added the missing status property
    });
    
    setIsOpen(false);
    setMessage('');
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2">Request Book</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request a Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              You're requesting <span className="font-medium">{bookRequested.title}</span> from {ownerName} without offering a specific book in exchange.
            </p>
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
              disabled={!message}
            >
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookRequestForm;
