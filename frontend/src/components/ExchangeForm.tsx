
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '@/types';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookCopy, Repeat, MessageSquare, ArrowRight } from 'lucide-react';

interface ExchangeFormProps {
  bookRequested: Book;
  ownerName: string;
  ownerAvatar: string;
}

const ExchangeForm: React.FC<ExchangeFormProps> = ({ 
  bookRequested, 
  ownerName, 
  ownerAvatar 
}) => {
  const navigate = useNavigate();
  const { user, books, createTradeRequest } = useApp();
  const { toast } = useToast();
  const [bookOfferedId, setBookOfferedId] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [exchangeType, setExchangeType] = useState<'trade' | 'request'>('trade');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const userBooks = books.filter(book => book.ownerId === user.id && book.available);
  
  const handleSubmitTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exchangeType === 'trade' && !bookOfferedId) {
      toast({
        title: "Missing selection",
        description: "Please select a book to offer for trade",
        variant: "destructive",
      });
      return;
    }
    
    if (!message.trim()) {
      toast({
        title: "Missing message",
        description: "Please add a message to the book owner",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Creating trade request...");
      
      let tradeData: any = {
        requesterId: user.id,
        requesterName: user.name,
        requesterAvatar: user.avatar,
        bookRequestedId: bookRequested.id,
        bookRequestedTitle: bookRequested.title,
        bookRequestedCover: bookRequested.cover,
        message,
        ownerId: bookRequested.ownerId,
        ownerName,
        ownerAvatar
      };
      
      if (exchangeType === 'trade' && bookOfferedId) {
        const bookOffered = books.find(book => book.id === bookOfferedId);
        
        if (bookOffered) {
          tradeData = {
            ...tradeData,
            bookOfferedId: bookOffered.id,
            bookOfferedTitle: bookOffered.title,
            bookOfferedCover: bookOffered.cover,
          };
        }
      }
      
      console.log("Trade data:", tradeData);
      
      await createTradeRequest(tradeData);
      
      toast({
        title: "Success!",
        description: "Your trade request has been sent successfully",
      });
      
      // Navigate to trades page after request is created
      navigate('/trades');
    } catch (error) {
      console.error("Error creating trade request:", error);
      toast({
        title: "Error",
        description: "Failed to create trade request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="border-primary/20 overflow-hidden shadow-sm hover:shadow-md transition-all">
      <div className="h-1.5 bg-gradient-to-r from-primary to-secondary"></div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Request Exchange</CardTitle>
        <CardDescription>Choose how you'd like to exchange this book</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="trade" 
          onValueChange={(value) => setExchangeType(value as 'trade' | 'request')} 
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-6 bg-muted/30">
            <TabsTrigger value="trade" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Repeat className="h-4 w-4" />
              Trade a Book
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-1.5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="h-4 w-4" />
              Direct Request
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmitTrade} className="space-y-4">
            <TabsContent value="trade" className="space-y-4">
              <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                <Label htmlFor="bookOffered" className="text-base font-medium flex items-center mb-2">
                  <BookCopy className="h-4 w-4 mr-2 text-primary" />
                  Choose a book to offer
                </Label>
                
                {userBooks.length > 0 ? (
                  <div className="space-y-3">
                    <Select value={bookOfferedId} onValueChange={setBookOfferedId} required>
                      <SelectTrigger className="w-full bg-card border-input/70">
                        <SelectValue placeholder="Select a book to offer" />
                      </SelectTrigger>
                      <SelectContent>
                        {userBooks.map(book => (
                          <SelectItem key={book.id} value={book.id} className="flex items-center">
                            <span className="line-clamp-1">{book.title}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {bookOfferedId && (
                      <div className="flex items-center p-3 bg-background rounded-lg border border-border/30">
                        <div className="h-16 w-12 overflow-hidden rounded mr-3">
                          <img
                            src={books.find(b => b.id === bookOfferedId)?.cover}
                            alt="Selected book"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium line-clamp-1">{books.find(b => b.id === bookOfferedId)?.title}</p>
                          <p className="text-xs text-muted-foreground">by {books.find(b => b.id === bookOfferedId)?.author}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-destructive/10 p-4 rounded-lg text-center">
                    <p className="text-sm text-destructive font-medium">You don't have any available books to offer</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setExchangeType('request')}
                    >
                      Switch to Direct Request
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-center">
                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-muted/20 rounded-lg border border-border/50">
                <div className="h-16 w-12 overflow-hidden rounded mr-3">
                  <img
                    src={bookRequested.cover}
                    alt={bookRequested.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium line-clamp-1">{bookRequested.title}</p>
                  <p className="text-xs text-muted-foreground">by {bookRequested.author}</p>
                  <p className="text-xs text-muted-foreground mt-1">Owned by {ownerName}</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="request">
              <div className="bg-muted/20 p-5 rounded-lg border border-border/50 mb-4">
                <div className="flex items-center mb-3">
                  <div className="h-16 w-12 overflow-hidden rounded mr-3">
                    <img
                      src={bookRequested.cover}
                      alt={bookRequested.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium line-clamp-1">{bookRequested.title}</p>
                    <p className="text-xs text-muted-foreground">by {bookRequested.author}</p>
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-4 text-sm">
                  <p>You're requesting <span className="font-medium">{bookRequested.title}</span> from {ownerName} without offering a specific book in exchange.</p>
                  <p className="mt-2 text-muted-foreground text-xs">The owner can accept, suggest another book, or reject your request.</p>
                </div>
              </div>
            </TabsContent>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-base font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-primary" />
                Message to {ownerName}
              </Label>
              <Textarea
                id="message"
                placeholder="Tell them why you want this book or any additional information..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="resize-none border-input/70 focus-visible:ring-primary"
              />
            </div>
            
            <CardFooter className="px-0 pb-0 pt-2">
              <Button 
                type="submit" 
                disabled={
                  isSubmitting ||
                  !message || 
                  (exchangeType === 'trade' && (!bookOfferedId || userBooks.length === 0))
                }
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                {isSubmitting ? "Submitting..." : 
                  exchangeType === 'trade' ? 'Request Trade' : 'Request Book'}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExchangeForm;
