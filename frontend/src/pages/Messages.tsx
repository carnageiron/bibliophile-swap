
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const Messages: React.FC = () => {
  const { user, messages, sendMessage } = useApp();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Get unique contacts
  const contacts = Array.from(
    new Set([
      ...messages
        .filter(msg => msg.senderId === user.id)
        .map(msg => msg.recipientId),
      ...messages
        .filter(msg => msg.recipientId === user.id)
        .map(msg => msg.senderId)
    ])
  );
  
  const selectedContactMessages = messages
    .filter(msg => 
      (msg.senderId === user.id && msg.recipientId === selectedContact) ||
      (msg.recipientId === user.id && msg.senderId === selectedContact)
    )
    .sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  
  const getContactName = (contactId: string) => {
    const contactMessage = messages.find(msg => 
      msg.senderId === contactId || msg.recipientId === contactId
    );
    
    return contactMessage?.senderId === contactId 
      ? contactMessage.senderName 
      : contactMessage?.recipientId === contactId 
        ? user.name 
        : 'Unknown';
  };
  
  const getContactAvatar = (contactId: string) => {
    const contactMessage = messages.find(msg => 
      msg.senderId === contactId || msg.recipientId === contactId
    );
    
    return contactMessage?.senderId === contactId 
      ? contactMessage.senderAvatar 
      : user.avatar;
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact || !newMessage.trim()) return;
    
    sendMessage({
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: selectedContact,
      content: newMessage,
    });
    
    setNewMessage('');
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-card rounded-lg shadow-sm h-[calc(80vh-8rem)] flex flex-col">
              <div className="p-4 font-medium">Contacts</div>
              <Separator />
              <div className="overflow-y-auto flex-grow">
                {contacts.map(contactId => {
                  const contactName = getContactName(contactId);
                  const contactAvatar = getContactAvatar(contactId);
                  const unreadCount = messages.filter(
                    msg => msg.senderId === contactId && msg.recipientId === user.id && !msg.read
                  ).length;
                  
                  return (
                    <div 
                      key={contactId}
                      className={`
                        p-4 flex items-center gap-3 cursor-pointer transition-colors
                        ${selectedContact === contactId ? 'bg-muted' : 'hover:bg-muted/50'}
                      `}
                      onClick={() => setSelectedContact(contactId)}
                    >
                      <Avatar>
                        <AvatarImage src={contactAvatar} alt={contactName} />
                        <AvatarFallback>
                          {contactName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-medium">{contactName}</p>
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-[calc(80vh-8rem)] flex flex-col">
              {selectedContact ? (
                <>
                  <div className="p-4 flex items-center gap-3 border-b">
                    <Avatar>
                      <AvatarImage 
                        src={getContactAvatar(selectedContact)} 
                        alt={getContactName(selectedContact)} 
                      />
                      <AvatarFallback>
                        {getContactName(selectedContact).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{getContactName(selectedContact)}</p>
                    </div>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {selectedContactMessages.length > 0 ? (
                      selectedContactMessages.map((msg, index) => {
                        const isUser = msg.senderId === user.id;
                        const showDate = index === 0 || 
                          formatDate(msg.timestamp) !== formatDate(selectedContactMessages[index - 1].timestamp);
                        
                        return (
                          <React.Fragment key={msg.id}>
                            {showDate && (
                              <div className="flex justify-center my-4">
                                <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                                  {formatDate(msg.timestamp)}
                                </span>
                              </div>
                            )}
                            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                              <div className={`
                                max-w-[80%] rounded-lg px-4 py-2
                                ${isUser 
                                  ? 'bg-primary text-primary-foreground' 
                                  : 'bg-secondary text-secondary-foreground'}
                              `}>
                                <p>{msg.content}</p>
                                <p className={`
                                  text-xs mt-1
                                  ${isUser 
                                    ? 'text-primary-foreground/80' 
                                    : 'text-secondary-foreground/80'}
                                `}>
                                  {formatTime(msg.timestamp)}
                                </p>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Send a message to start a conversation.</p>
                      </div>
                    )}
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Select a contact to start messaging</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<MessageCircle size={40} />}
          title="You have no messages"
          description="When you have messages, they will appear here."
        />
      )}
    </div>
  );
};

export default Messages;
