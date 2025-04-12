
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Book, TradeRequest, Message, Event } from '../types';
import { currentUser, books, messages as initialMessages, events as initialEvents } from '../data/mockData';
import { createTradeRequest as createTradeRequestApi, fetchTradeRequests, updateTradeRequestStatus } from '@/utils/supabaseUtils';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  user: User;
  books: Book[];
  tradeRequests: TradeRequest[];
  messages: Message[];
  events: Event[];
  createTradeRequest: (tradeRequestData: Omit<TradeRequest, 'id' | 'createdAt'>) => Promise<void>;
  acceptTradeRequest: (tradeRequestId: string) => Promise<void>;
  rejectTradeRequest: (tradeRequestId: string) => Promise<void>;
  sendMessage: (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => void;
  markMessageAsRead: (messageId: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const useApp = () => {
  return useContext(AppContext);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>(currentUser);
  const [booksList] = useState<Book[]>(books);
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [events] = useState<Event[]>(initialEvents);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadTradeRequests = useCallback(async () => {
    try {
      console.log("Fetching trade requests...");
      const requests = await fetchTradeRequests();
      console.log("Trade requests fetched:", requests);
      
      if (requests.length === 0 && !isInitialized) {
        console.log("No trade requests fetched from database, using mock data for development");
        // Add some mock trade requests for development
        const mockTradeRequests: TradeRequest[] = [
          {
            id: "mock-id-1",
            requesterId: "user2",
            requesterName: "Jane Smith",
            requesterAvatar: "https://i.pravatar.cc/150?img=5",
            bookRequestedId: "book1",
            bookRequestedTitle: "The Great Gatsby",
            bookRequestedCover: "https://covers.openlibrary.org/b/id/7222973-L.jpg",
            authorRequested: "F. Scott Fitzgerald",
            isbnRequested: "9780743273565",
            bookOfferedId: "book2",
            bookOfferedTitle: "1984",
            bookOfferedCover: "https://covers.openlibrary.org/b/id/8575099-L.jpg",
            authorOffered: "George Orwell",
            isbnOffered: "9780451524935",
            message: "I'd love to trade for this classic!",
            status: 'pending',
            createdAt: new Date().toISOString(),
            ownerId: user.id,
            ownerName: user.name,
            ownerAvatar: user.avatar
          }
        ];
        setTradeRequests(mockTradeRequests);
      } else {
        setTradeRequests(requests);
      }
      
      setIsInitialized(true);
    } catch (error) {
      console.error("Error in loadTradeRequests:", error);
      if (!isInitialized) {
        // Use mock data if fetching fails and we haven't initialized yet
        const mockTradeRequests: TradeRequest[] = [
          {
            id: "mock-id-1",
            requesterId: "user2",
            requesterName: "Jane Smith",
            requesterAvatar: "https://i.pravatar.cc/150?img=5",
            bookRequestedId: "book1",
            bookRequestedTitle: "The Great Gatsby",
            bookRequestedCover: "https://covers.openlibrary.org/b/id/7222973-L.jpg",
            authorRequested: "F. Scott Fitzgerald",
            isbnRequested: "9780743273565",
            bookOfferedId: "book2",
            bookOfferedTitle: "1984",
            bookOfferedCover: "https://covers.openlibrary.org/b/id/8575099-L.jpg",
            authorOffered: "George Orwell",
            isbnOffered: "9780451524935",
            message: "I'd love to trade for this classic!",
            status: 'pending',
            createdAt: new Date().toISOString(),
            ownerId: user.id,
            ownerName: user.name,
            ownerAvatar: user.avatar
          }
        ];
        setTradeRequests(mockTradeRequests);
        setIsInitialized(true);
        
        toast({
          title: "Database Error",
          description: "Could not connect to database, showing mock data instead",
          variant: "destructive",
        });
      }
    }
  }, [user.id, user.name, user.avatar, isInitialized]);

  useEffect(() => {
    // Fetch trade requests from Supabase on component mount
    loadTradeRequests();
  }, [loadTradeRequests]);

  const createTradeRequest = async (tradeRequestData: Omit<TradeRequest, 'id' | 'createdAt'>) => {
    try {
      console.log("Creating trade request with data:", tradeRequestData);
      
      const newTradeRequest = await createTradeRequestApi({
        ...tradeRequestData,
      });
      
      if (newTradeRequest) {
        console.log("Trade request created:", newTradeRequest);
        setTradeRequests(prev => [newTradeRequest, ...prev]);
        
        toast({
          title: "Success",
          description: "Trade request created successfully",
        });
      } else {
        throw new Error("Failed to create trade request");
      }
    } catch (error) {
      console.error('Error creating trade request:', error);
      toast({
        title: "Error",
        description: "Failed to create trade request",
        variant: "destructive",
      });
      throw error; // Re-throw to allow the component to handle it
    }
  };

  const acceptTradeRequest = async (tradeRequestId: string) => {
    try {
      const success = await updateTradeRequestStatus(tradeRequestId, 'accepted');
      
      if (success) {
        setTradeRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === tradeRequestId 
              ? { ...request, status: 'accepted' } 
              : request
          )
        );
        return;
      }
      
      throw new Error("Failed to accept trade request");
    } catch (error) {
      console.error('Error accepting trade request:', error);
      toast({
        title: "Error",
        description: "Failed to accept trade request",
        variant: "destructive",
      });
      throw error;
    }
  };

  const rejectTradeRequest = async (tradeRequestId: string) => {
    try {
      const success = await updateTradeRequestStatus(tradeRequestId, 'rejected');
      
      if (success) {
        setTradeRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === tradeRequestId 
              ? { ...request, status: 'rejected' } 
              : request
          )
        );
        return;
      }
      
      throw new Error("Failed to reject trade request");
    } catch (error) {
      console.error('Error rejecting trade request:', error);
      toast({
        title: "Error",
        description: "Failed to reject trade request",
        variant: "destructive",
      });
      throw error;
    }
  };

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderAvatar: messageData.senderAvatar,
      recipientId: messageData.recipientId,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      read: false,
      tradeRequestId: messageData.tradeRequestId
    };
    setMessages(prevMessages => [newMessage, ...prevMessages]);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId ? { ...message, read: true } : message
      )
    );
  };

  const contextValue: AppContextType = {
    user,
    books: booksList,
    tradeRequests,
    messages,
    events,
    createTradeRequest,
    acceptTradeRequest,
    rejectTradeRequest,
    sendMessage,
    markMessageAsRead,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
