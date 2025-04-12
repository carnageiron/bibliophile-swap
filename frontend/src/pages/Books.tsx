
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const Books: React.FC = () => {
  const { books } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [availability, setAvailability] = useState('all');
  
  const uniqueGenres = Array.from(
    new Set(books.flatMap(book => book.genre))
  ).sort();
  
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || book.genre.includes(selectedGenre);
    const matchesAvailability = availability === 'all' || 
                               (availability === 'available' && book.available) ||
                               (availability === 'unavailable' && !book.available);
    
    return matchesSearch && matchesGenre && matchesAvailability;
  });
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 md:col-span-2">
          <Label htmlFor="search" className="mb-2 block">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div>
          <Label htmlFor="genre" className="mb-2 block">Genre</Label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger id="genre" className="w-full">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {uniqueGenres.map(genre => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="availability" className="mb-2 block">Availability</Label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger id="availability" className="w-full">
              <SelectValue placeholder="Filter by availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Books;
