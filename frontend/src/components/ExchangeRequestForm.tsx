
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Book, Upload, X } from 'lucide-react';
import { Book as BookType } from '@/types';
import { supabase } from "@/integrations/supabase/client";

// Props for the ExchangeRequestForm component
interface ExchangeRequestFormProps {
  selectedBook?: BookType; // Optional pre-selected book to request
  ownerId?: string; // Optional owner ID if we know who owns the book
  ownerName?: string; // Optional owner name
  ownerAvatar?: string; // Optional owner avatar
}

const ExchangeRequestForm: React.FC<ExchangeRequestFormProps> = ({ 
  selectedBook, 
  ownerId,
  ownerName,
  ownerAvatar
}) => {
  const navigate = useNavigate();
  const { user, createTradeRequest } = useApp();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for requested book
  const [requestedTitle, setRequestedTitle] = useState(selectedBook?.title || '');
  const [requestedAuthor, setRequestedAuthor] = useState(selectedBook?.author || '');
  const [requestedIsbn, setRequestedIsbn] = useState(selectedBook?.isbn || '');
  const [requestedImage, setRequestedImage] = useState<File | null>(null);
  const [requestedImageUrl, setRequestedImageUrl] = useState<string>(selectedBook?.cover || '');
  
  // Form state for offered book
  const [offeredTitle, setOfferedTitle] = useState('');
  const [offeredAuthor, setOfferedAuthor] = useState('');
  const [offeredIsbn, setOfferedIsbn] = useState('');
  const [offeredImage, setOfferedImage] = useState<File | null>(null);
  const [offeredImageUrl, setOfferedImageUrl] = useState<string>('');
  const [message, setMessage] = useState('');

  // Handle image upload for requested book
  const handleRequestedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRequestedImage(file);
      setRequestedImageUrl(URL.createObjectURL(file));
    }
  };

  // Handle image upload for offered book
  const handleOfferedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOfferedImage(file);
      setOfferedImageUrl(URL.createObjectURL(file));
    }
  };

  // Remove uploaded image
  const removeRequestedImage = () => {
    setRequestedImage(null);
    if (!selectedBook) {
      setRequestedImageUrl('');
    } else {
      setRequestedImageUrl(selectedBook.cover);
    }
  };

  const removeOfferedImage = () => {
    setOfferedImage(null);
    setOfferedImageUrl('');
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('book_covers')
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('book_covers')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      // Return a default image in case of error
      return 'https://covers.openlibrary.org/b/id/10958382-L.jpg';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestedTitle || !requestedAuthor || !offeredTitle || !offeredAuthor) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload images if provided
      let requestedCoverUrl = requestedImageUrl;
      let offeredCoverUrl = 'https://covers.openlibrary.org/b/id/12645114-L.jpg'; // Default cover
      
      if (requestedImage && !selectedBook) {
        requestedCoverUrl = await uploadImage(requestedImage);
      }
      
      if (offeredImage) {
        offeredCoverUrl = await uploadImage(offeredImage);
      }
      
      // Create trade request
      await createTradeRequest({
        requesterId: user.id,
        requesterName: user.name,
        requesterAvatar: user.avatar,
        bookRequestedId: selectedBook?.id || `manual-${Date.now()}`,
        bookRequestedTitle: requestedTitle,
        bookRequestedCover: requestedCoverUrl,
        authorRequested: requestedAuthor,
        isbnRequested: requestedIsbn,
        bookOfferedId: `offered-${Date.now()}`,
        bookOfferedTitle: offeredTitle,
        bookOfferedCover: offeredCoverUrl,
        authorOffered: offeredAuthor,
        isbnOffered: offeredIsbn,
        message: message,
        status: 'pending',
        ownerId: ownerId || 'unknown', // If owner is unknown, use placeholder
        ownerName: ownerName || 'Book Owner',
        ownerAvatar: ownerAvatar || 'https://i.pravatar.cc/150?img=3'
      });
      
      toast({
        title: "Success!",
        description: "Your exchange request has been sent",
      });
      
      // Navigate to trades page
      navigate('/trades');
    } catch (error) {
      console.error("Error creating exchange request:", error);
      toast({
        title: "Error",
        description: "Failed to create exchange request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Book className="h-6 w-6 text-primary" />
          Request a Book Exchange
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Book You're Requesting</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="requestedTitle">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="requestedTitle"
                  value={requestedTitle}
                  onChange={(e) => setRequestedTitle(e.target.value)}
                  required
                  readOnly={!!selectedBook}
                  className={selectedBook ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requestedAuthor">Author <span className="text-red-500">*</span></Label>
                <Input
                  id="requestedAuthor"
                  value={requestedAuthor}
                  onChange={(e) => setRequestedAuthor(e.target.value)}
                  required
                  readOnly={!!selectedBook}
                  className={selectedBook ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="requestedIsbn">ISBN (optional)</Label>
                <Input
                  id="requestedIsbn"
                  value={requestedIsbn}
                  onChange={(e) => setRequestedIsbn(e.target.value)}
                  readOnly={!!selectedBook}
                  className={selectedBook ? "bg-muted" : ""}
                />
              </div>

              {!selectedBook && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="requestedImage">Book Cover (optional)</Label>
                  <div className="flex items-center gap-4">
                    {requestedImageUrl ? (
                      <div className="relative w-24 h-32">
                        <img
                          src={requestedImageUrl}
                          alt="Book cover preview"
                          className="w-24 h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={removeRequestedImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-24 h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                        <label htmlFor="requestedImageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Upload</span>
                          <input
                            id="requestedImageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleRequestedImageChange}
                          />
                        </label>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      <p>Max size: 2MB</p>
                      <p>Formats: JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Book You're Offering</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="offeredTitle">Title <span className="text-red-500">*</span></Label>
                <Input
                  id="offeredTitle"
                  value={offeredTitle}
                  onChange={(e) => setOfferedTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offeredAuthor">Author <span className="text-red-500">*</span></Label>
                <Input
                  id="offeredAuthor"
                  value={offeredAuthor}
                  onChange={(e) => setOfferedAuthor(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="offeredIsbn">ISBN (optional)</Label>
                <Input
                  id="offeredIsbn"
                  value={offeredIsbn}
                  onChange={(e) => setOfferedIsbn(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="offeredImage">Book Cover (optional)</Label>
                <div className="flex items-center gap-4">
                  {offeredImageUrl ? (
                    <div className="relative w-24 h-32">
                      <img
                        src={offeredImageUrl}
                        alt="Book cover preview"
                        className="w-24 h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeOfferedImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-24 h-32 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                      <label htmlFor="offeredImageUpload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Upload</span>
                        <input
                          id="offeredImageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleOfferedImageChange}
                        />
                      </label>
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    <p>Max size: 2MB</p>
                    <p>Formats: JPG, PNG, WebP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a message to explain why you want this book or provide additional details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !requestedTitle || !requestedAuthor || !offeredTitle || !offeredAuthor}
          >
            {isSubmitting ? "Submitting..." : "Submit Exchange Request"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ExchangeRequestForm;
