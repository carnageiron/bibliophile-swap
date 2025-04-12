
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from '@/types';
import { Badge } from "@/components/ui/badge";
import { Repeat } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="aspect-[2/3] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
        <img
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Badge variant="secondary" className="bg-primary/90 text-white">
            {book.condition}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/exchange/${book.id}`}>
            <Button size="sm" variant="secondary" className="bg-secondary/90 text-white">
              <Repeat className="mr-1 h-3 w-3" />
              Exchange
            </Button>
          </Link>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium line-clamp-1 mb-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{book.author}</p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {book.genre.slice(0, 2).map((g, i) => (
            <Badge key={i} variant="outline" className="text-xs bg-primary/5">
              {g}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
