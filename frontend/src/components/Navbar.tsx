
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MessageSquare, BookPlus, LogOut, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Navbar: React.FC = () => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { user, messages } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const unreadMessages = messages?.filter(msg => !msg.read && msg.recipientId === user?.id)?.length || 0;
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };
  
  const navigateToAuth = (tab: 'login' | 'register' = 'login') => {
    navigate(`/auth?tab=${tab}`);
  };
  
  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Bibliophile Swap</Link>
        
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-secondary-foreground transition-colors">Home</Link>
          <Link to="/books" className="hover:text-secondary-foreground transition-colors">Books</Link>
          <Link to="/trades" className="hover:text-secondary-foreground transition-colors">Trades</Link>
          <Link to="/clubs" className="hover:text-secondary-foreground transition-colors">Clubs</Link>
          <Link to="/events" className="hover:text-secondary-foreground transition-colors">Events</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
              </Button>
              
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare size={20} />
                  {unreadMessages > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                      {unreadMessages}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              <Link to="/exchange">
                <Button variant="ghost" size="icon" className="relative">
                  <BookPlus size={20} />
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={authUser?.avatar} alt={authUser?.name} />
                      <AvatarFallback>
                        {authUser?.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block">{authUser?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button onClick={() => navigateToAuth('login')} variant="ghost">
                Sign In
              </Button>
              <Button onClick={() => navigateToAuth('register')} className="flex items-center gap-1">
                <UserPlus size={18} />
                <span>Register</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
