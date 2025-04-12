
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  joined: string;
  credits: number;
  booksOffered: number;
  booksReceived: number;
  rating: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  isbn: string;
  description: string;
  pageCount: number;
  genre: string[];
  publishedDate: string;
  condition: 'New' | 'Like New' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  ownerId: string;
  available: boolean;
}

export interface TradeRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  bookRequestedId: string;
  bookRequestedTitle: string;
  bookRequestedCover: string;
  isbnRequested?: string;
  authorRequested?: string;
  bookOfferedId?: string;
  bookOfferedTitle?: string;
  bookOfferedCover?: string;
  isbnOffered?: string;
  authorOffered?: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  tradeRequestId?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizerId: string;
  organizerName: string;
  attendees: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  memberIds: string[]; // Added memberIds array to track club membership
  createdBy: string;
  createdAt: string;
}

export interface Discussion {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  date: string;
  replies: number;
  lastReply: string;
  messages: DiscussionMessage[];
  clubId: string; // Added clubId to link discussions to specific clubs
}

export interface DiscussionMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}
