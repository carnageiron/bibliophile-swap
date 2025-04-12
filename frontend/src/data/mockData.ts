
import { User, Book, TradeRequest, Message, Event } from "../types";

export const currentUser: User = {
  id: "user1",
  name: "Jane Reader",
  email: "jane@example.com",
  avatar: "https://i.pravatar.cc/150?img=5",
  bio: "Avid reader and collector of classic literature and contemporary fiction.",
  location: "Seattle, WA",
  joined: "2023-01-15",
  credits: 5,
  booksOffered: 12,
  booksReceived: 8,
  rating: 4.8
};

export const users: User[] = [
  currentUser,
  {
    id: "user2",
    name: "Mark Bookman",
    email: "mark@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    bio: "Fantasy and sci-fi enthusiast with a growing collection.",
    location: "Portland, OR",
    joined: "2023-02-10",
    credits: 7,
    booksOffered: 15,
    booksReceived: 6,
    rating: 4.5
  },
  {
    id: "user3",
    name: "Sarah Page",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Mystery and thriller lover. Always looking for the next page-turner.",
    location: "San Francisco, CA",
    joined: "2023-03-05",
    credits: 10,
    booksOffered: 20,
    booksReceived: 12,
    rating: 4.9
  }
];

export const books: Book[] = [
  {
    id: "book1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "https://covers.openlibrary.org/b/id/8759364-L.jpg",
    isbn: "9780061120084",
    description: "The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.",
    pageCount: 336,
    genre: ["Classic", "Fiction", "Historical"],
    publishedDate: "1960-07-11",
    condition: "Good",
    ownerId: "user2",
    available: true
  },
  {
    id: "book2",
    title: "1984",
    author: "George Orwell",
    cover: "https://covers.openlibrary.org/b/id/8575708-L.jpg",
    isbn: "9780451524935",
    description: "A masterpiece of rebellion and imprisonment, where war is peace, freedom is slavery, and Big Brother is watching.",
    pageCount: 328,
    genre: ["Classic", "Dystopian", "Fiction"],
    publishedDate: "1949-06-08",
    condition: "Very Good",
    ownerId: "user2",
    available: true
  },
  {
    id: "book3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "https://covers.openlibrary.org/b/id/8741951-L.jpg",
    isbn: "9780743273565",
    description: "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
    pageCount: 180,
    genre: ["Classic", "Fiction"],
    publishedDate: "1925-04-10",
    condition: "Like New",
    ownerId: "user3",
    available: true
  },
  {
    id: "book4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    cover: "https://covers.openlibrary.org/b/id/8477751-L.jpg",
    isbn: "9780141439518",
    description: "A classic tale of love and values in the class-conscious England of the late eighteenth century.",
    pageCount: 432,
    genre: ["Classic", "Romance", "Fiction"],
    publishedDate: "1813-01-28",
    condition: "Good",
    ownerId: "user3",
    available: true
  },
  {
    id: "book5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    cover: "https://covers.openlibrary.org/b/id/8405171-L.jpg",
    isbn: "9780547928227",
    description: "The journey of Bilbo Baggins to help Thorin Oakenshield and his band of dwarves reclaim their treasure from the dragon Smaug.",
    pageCount: 366,
    genre: ["Fantasy", "Fiction", "Adventure"],
    publishedDate: "1937-09-21",
    condition: "Fair",
    ownerId: "user2",
    available: true
  },
  {
    id: "book6",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    cover: "https://covers.openlibrary.org/b/id/8280438-L.jpg",
    isbn: "9780590353427",
    description: "The story of a young wizard, Harry Potter, and his adventures at Hogwarts School of Witchcraft and Wizardry.",
    pageCount: 309,
    genre: ["Fantasy", "Fiction", "Young Adult"],
    publishedDate: "1997-06-26",
    condition: "Good",
    ownerId: "user1",
    available: true
  },
  {
    id: "book7",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    cover: "https://covers.openlibrary.org/b/id/8231432-L.jpg",
    isbn: "9780316769488",
    description: "The story of Holden Caulfield's experiences following his expulsion from prep school.",
    pageCount: 277,
    genre: ["Classic", "Fiction", "Coming of Age"],
    publishedDate: "1951-07-16",
    condition: "Very Good",
    ownerId: "user1",
    available: true
  },
  {
    id: "book8",
    title: "Lord of the Flies",
    author: "William Golding",
    cover: "https://covers.openlibrary.org/b/id/8091016-L.jpg",
    isbn: "9780571056866",
    description: "A group of boys stranded on an uninhabited island who create their own disastrous society.",
    pageCount: 224,
    genre: ["Classic", "Fiction", "Dystopian"],
    publishedDate: "1954-09-17",
    condition: "Good",
    ownerId: "user1",
    available: true
  }
];

export const tradeRequests: TradeRequest[] = [
  {
    id: "trade1",
    requesterId: "user1",
    requesterName: "Jane Reader",
    requesterAvatar: "https://i.pravatar.cc/150?img=5",
    bookRequestedId: "book1",
    bookRequestedTitle: "To Kill a Mockingbird",
    bookRequestedCover: "https://covers.openlibrary.org/b/id/8759364-L.jpg",
    bookOfferedId: "book6",
    bookOfferedTitle: "Harry Potter and the Sorcerer's Stone",
    bookOfferedCover: "https://covers.openlibrary.org/b/id/8280438-L.jpg",
    message: "I've been wanting to read this classic for ages! I can offer my copy of Harry Potter in exchange.",
    status: "pending",
    createdAt: "2024-04-01T14:30:00Z",
    ownerId: "user2",
    ownerName: "Mark Bookman",
    ownerAvatar: "https://i.pravatar.cc/150?img=8"
  },
  {
    id: "trade2",
    requesterId: "user3",
    requesterName: "Sarah Page",
    requesterAvatar: "https://i.pravatar.cc/150?img=9",
    bookRequestedId: "book7",
    bookRequestedTitle: "The Catcher in the Rye",
    bookRequestedCover: "https://covers.openlibrary.org/b/id/8231432-L.jpg",
    bookOfferedId: "book3",
    bookOfferedTitle: "The Great Gatsby",
    bookOfferedCover: "https://covers.openlibrary.org/b/id/8741951-L.jpg",
    message: "Would love to swap classics! My copy of The Great Gatsby is in excellent condition.",
    status: "pending",
    createdAt: "2024-04-05T09:15:00Z",
    ownerId: "user1",
    ownerName: "Jane Reader",
    ownerAvatar: "https://i.pravatar.cc/150?img=5"
  }
];

export const messages: Message[] = [
  {
    id: "msg1",
    senderId: "user2",
    senderName: "Mark Bookman",
    senderAvatar: "https://i.pravatar.cc/150?img=8",
    recipientId: "user1",
    content: "Hi Jane, I saw you have 'The Catcher in the Rye'. Would you be interested in trading for my copy of '1984'?",
    timestamp: "2024-04-02T10:30:00Z",
    read: true
  },
  {
    id: "msg2",
    senderId: "user1",
    senderName: "Jane Reader",
    senderAvatar: "https://i.pravatar.cc/150?img=5",
    recipientId: "user2",
    content: "Hey Mark, that sounds great! I've been wanting to read '1984' for a while now.",
    timestamp: "2024-04-02T11:45:00Z",
    read: true
  }
];

export const events: Event[] = [
  {
    id: "event1",
    title: "Science Fiction Book Club",
    description: "Join us for our monthly discussion on 'Dune' by Frank Herbert.",
    date: "2024-05-15",
    time: "19:00",
    location: "Virtual Meeting",
    organizerId: "user2",
    organizerName: "Mark Bookman",
    attendees: [
      {
        id: "user1",
        name: "Jane Reader",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      {
        id: "user3",
        name: "Sarah Page",
        avatar: "https://i.pravatar.cc/150?img=9"
      }
    ]
  }
];
