
import React from 'react';
import { Link } from 'react-router-dom';
import { TradeRequest } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { MessageSquare, Clock, Check, X, BookOpen, Repeat } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TradeRequestCardProps {
  tradeRequest: TradeRequest;
  isOwner: boolean;
}

const TradeRequestCard: React.FC<TradeRequestCardProps> = ({ tradeRequest, isOwner }) => {
  const { acceptTradeRequest, rejectTradeRequest, sendMessage } = useApp();
  const { toast } = useToast();
  
  const handleAccept = async () => {
    try {
      await acceptTradeRequest(tradeRequest.id);
      toast({
        title: "Success",
        description: "Trade request accepted successfully",
      });
    } catch (error) {
      console.error("Error accepting trade request:", error);
      toast({
        title: "Error",
        description: "Failed to accept trade request",
        variant: "destructive",
      });
    }
  };
  
  const handleReject = async () => {
    try {
      await rejectTradeRequest(tradeRequest.id);
      toast({
        title: "Success",
        description: "Trade request rejected successfully",
      });
    } catch (error) {
      console.error("Error rejecting trade request:", error);
      toast({
        title: "Error",
        description: "Failed to reject trade request",
        variant: "destructive",
      });
    }
  };
  
  const handleMessage = () => {
    // In a real implementation, this would navigate to a chat or open a chat dialog
    sendMessage({
      senderId: isOwner ? tradeRequest.ownerId : tradeRequest.requesterId,
      senderName: isOwner ? tradeRequest.ownerName : tradeRequest.requesterName,
      senderAvatar: isOwner ? tradeRequest.ownerAvatar : tradeRequest.requesterAvatar,
      recipientId: isOwner ? tradeRequest.requesterId : tradeRequest.ownerId,
      content: `I'd like to discuss the trade for "${tradeRequest.bookRequestedTitle}"`,
      tradeRequestId: tradeRequest.id
    });
    
    toast({
      title: "Message Sent",
      description: "Message has been sent successfully",
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-500';
      case 'accepted': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'completed': return 'bg-blue-500';
      default: return '';
    }
  };
  
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all">
      <div className="h-1 bg-gradient-to-r from-primary to-secondary"></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage 
                src={isOwner ? tradeRequest.requesterAvatar : tradeRequest.ownerAvatar} 
                alt={isOwner ? tradeRequest.requesterName : tradeRequest.ownerName} 
              />
              <AvatarFallback className="bg-primary/10 text-primary">
                {isOwner 
                  ? tradeRequest.requesterName.split(' ').map(n => n[0]).join('') 
                  : tradeRequest.ownerName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {isOwner ? tradeRequest.requesterName : tradeRequest.ownerName}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(tradeRequest.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge
            className={`
              ${getStatusColor(tradeRequest.status)}
              text-white
            `}
          >
            {tradeRequest.status.charAt(0).toUpperCase() + tradeRequest.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium text-muted-foreground flex items-center justify-center md:justify-start">
              <BookOpen className="h-3 w-3 mr-1" />
              Requested Book:
            </p>
            <div className="mt-2 flex flex-col items-center md:flex-row md:items-start gap-2">
              <div className="w-20 h-28 overflow-hidden rounded-md shrink-0 border border-border/50 shadow-sm">
                <img 
                  src={tradeRequest.bookRequestedCover} 
                  alt={tradeRequest.bookRequestedTitle} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium line-clamp-2">{tradeRequest.bookRequestedTitle}</p>
                {tradeRequest.authorRequested && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    by {tradeRequest.authorRequested}
                  </p>
                )}
                {tradeRequest.isbnRequested && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ISBN: {tradeRequest.isbnRequested}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 text-center">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Repeat className="h-3 w-3 mr-1" />
              Exchange
            </Badge>
          </div>
          
          {tradeRequest.bookOfferedId ? (
            <div className="flex-1 text-center md:text-right">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center md:justify-end">
                Offered Book:
                <BookOpen className="h-3 w-3 ml-1" />
              </p>
              <div className="mt-2 flex flex-col items-center md:flex-row-reverse md:items-start gap-2">
                <div className="w-20 h-28 overflow-hidden rounded-md shrink-0 border border-border/50 shadow-sm">
                  <img 
                    src={tradeRequest.bookOfferedCover} 
                    alt={tradeRequest.bookOfferedTitle} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-right">
                  <p className="font-medium line-clamp-2">{tradeRequest.bookOfferedTitle}</p>
                  {tradeRequest.authorOffered && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      by {tradeRequest.authorOffered}
                    </p>
                  )}
                  {tradeRequest.isbnOffered && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ISBN: {tradeRequest.isbnOffered}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 text-center md:text-right">
              <p className="text-sm font-medium text-muted-foreground">Type:</p>
              <div className="mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Direct Request
                </Badge>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 bg-muted/30 p-3 rounded-md border border-border/30">
          <p className="text-sm italic">{tradeRequest.message || "No message provided."}</p>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 mt-4">
        {isOwner && tradeRequest.status === 'pending' && (
          <>
            <Button variant="outline" onClick={handleReject} className="flex items-center">
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleAccept} className="bg-primary hover:bg-primary/90 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </>
        )}
        
        {tradeRequest.status === 'accepted' && (
          <Button onClick={handleMessage} className="bg-secondary hover:bg-secondary/90">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
        )}
        
        {!isOwner && tradeRequest.status === 'pending' && (
          <Button variant="outline" disabled className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Awaiting Response
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TradeRequestCard;
