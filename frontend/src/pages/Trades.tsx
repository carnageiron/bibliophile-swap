
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TradeRequestCard from '@/components/TradeRequestCard';
import EmptyState from '@/components/EmptyState';
import { MessageSquare, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { fetchTradeRequests } from '@/utils/supabaseUtils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Trades: React.FC = () => {
  const { user, tradeRequests } = useApp();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const incomingRequests = tradeRequests.filter(tr => tr.ownerId === user.id);
  const outgoingRequests = tradeRequests.filter(tr => tr.requesterId === user.id);
  
  const displayedRequests = activeTab === 'incoming' 
    ? incomingRequests 
    : activeTab === 'outgoing' 
      ? outgoingRequests 
      : tradeRequests;
  
  useEffect(() => {
    // Initial load of trade requests
    refreshTradeRequests();
  }, []);
  
  const refreshTradeRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const requests = await fetchTradeRequests();
      console.log("Fetched trade requests:", requests);
      
      if (requests.length === 0) {
        console.log("No trade requests found in database");
      }
      
      // Note: We don't need to update state here as the AppContext will handle it
      toast({
        title: "Success",
        description: "Trade requests refreshed successfully",
      });
    } catch (err) {
      console.error("Error refreshing trade requests:", err);
      setError("Failed to refresh trade requests. Please try again.");
      toast({
        title: "Error",
        description: "Failed to refresh trade requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Trade Requests</h1>
        <Button 
          variant="outline" 
          onClick={refreshTradeRequests} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>
      
      {error && (
        <Card className="bg-destructive/10 border-destructive/20 mb-6">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All
            {tradeRequests.length > 0 && (
              <span className="ml-2 bg-secondary/20 px-2 py-0.5 rounded-full text-xs">
                {tradeRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="incoming" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Incoming
            {incomingRequests.length > 0 && (
              <span className="ml-2 bg-secondary/20 px-2 py-0.5 rounded-full text-xs">
                {incomingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="outgoing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Outgoing
            {outgoingRequests.length > 0 && (
              <span className="ml-2 bg-secondary/20 px-2 py-0.5 rounded-full text-xs">
                {outgoingRequests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading trade requests...</span>
            </div>
          ) : displayedRequests.length > 0 ? (
            displayedRequests.map(request => (
              <TradeRequestCard 
                key={request.id} 
                tradeRequest={request} 
                isOwner={request.ownerId === user.id}
              />
            ))
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12 text-muted" />}
              title="No trade requests"
              description="You don't have any trade requests yet. Browse books and request trades to get started."
            />
          )}
        </TabsContent>
        
        <TabsContent value="incoming" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading incoming requests...</span>
            </div>
          ) : incomingRequests.length > 0 ? (
            incomingRequests.map(request => (
              <TradeRequestCard 
                key={request.id} 
                tradeRequest={request} 
                isOwner={true}
              />
            ))
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12 text-muted" />}
              title="No incoming requests"
              description="You don't have any incoming trade requests yet."
            />
          )}
        </TabsContent>
        
        <TabsContent value="outgoing" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading outgoing requests...</span>
            </div>
          ) : outgoingRequests.length > 0 ? (
            outgoingRequests.map(request => (
              <TradeRequestCard 
                key={request.id} 
                tradeRequest={request} 
                isOwner={false}
              />
            ))
          ) : (
            <EmptyState
              icon={<MessageSquare className="h-12 w-12 text-muted" />}
              title="No outgoing requests"
              description="You haven't sent any trade requests yet. Browse books to find ones you'd like to request."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trades;
