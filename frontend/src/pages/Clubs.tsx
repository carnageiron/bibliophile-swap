import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Users, MessageSquare, Calendar, Trophy, Star } from 'lucide-react';
import { ClubIcon } from 'lucide-react'; // Renamed to ClubIcon to avoid conflict
import EmptyState from '@/components/EmptyState';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Import Club and Discussion types from types file
import { Club, Discussion, DiscussionMessage } from '@/types';

const Clubs: React.FC = () => {
  const { user } = useApp();
  
  const [activeTab, setActiveTab] = useState<string>('discussions');
  const [newMessage, setNewMessage] = useState('');
  const [activeDiscussionId, setActiveDiscussionId] = useState<string | null>(null);
  
  // Mock data for clubs
  const [clubs, setClubs] = useState<Club[]>([
    {
      id: "club1",
      name: "Science Fiction Readers",
      description: "For fans of sci-fi literature and discussions about the genre.",
      members: 24,
      memberIds: ["user1", "user2"],
      createdBy: "user2",
      createdAt: "2024-01-15T12:00:00Z"
    },
    {
      id: "club2",
      name: "Classic Literature",
      description: "Discuss timeless works of literature from authors throughout history.",
      members: 18,
      memberIds: ["user3"],
      createdBy: "user3",
      createdAt: "2024-01-20T15:30:00Z"
    },
    {
      id: "club3",
      name: "Mystery & Thriller",
      description: "Exploring the best mystery and thriller novels.",
      members: 35,
      memberIds: ["user1"],
      createdBy: "user5",
      createdAt: "2024-02-10T09:15:00Z"
    },
    {
      id: "club4",
      name: "Fantasy Book Club",
      description: "For lovers of magical worlds and epic adventures.",
      members: 42,
      memberIds: ["user2", "user3"],
      createdBy: "user4",
      createdAt: "2024-01-05T14:30:00Z"
    }
  ]);
  
  // Mock data for discussions
  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: "discussion1",
      title: "Thoughts on Dune's world-building?",
      author: {
        id: "user2",
        name: "Mark Bookman",
        avatar: "https://i.pravatar.cc/150?img=8"
      },
      date: "2024-03-01T10:00:00Z",
      replies: 8,
      lastReply: "2024-03-10T14:25:00Z",
      messages: [
        {
          id: "msg1",
          userId: "user2",
          userName: "Mark Bookman",
          userAvatar: "https://i.pravatar.cc/150?img=8",
          content: "I just finished reading Dune and I'm amazed at the depth of the world Frank Herbert created. What are your thoughts?",
          timestamp: "2024-03-01T10:00:00Z"
        },
        {
          id: "msg2",
          userId: "user1",
          userName: "Jane Reader",
          userAvatar: "https://i.pravatar.cc/150?img=5",
          content: "It's definitely one of the most detailed fictional universes ever created. The political, religious, and ecological systems are incredibly well thought out.",
          timestamp: "2024-03-02T15:30:00Z"
        }
      ],
      clubId: "club1"
    },
    {
      id: "discussion2",
      title: "Jane Austen's influence on modern romance novels",
      author: {
        id: "user3",
        name: "Emily Literary",
        avatar: "https://i.pravatar.cc/150?img=3"
      },
      date: "2024-02-15T11:30:00Z",
      replies: 5,
      lastReply: "2024-02-20T09:45:00Z",
      messages: [
        {
          id: "msg3",
          userId: "user3",
          userName: "Emily Literary",
          userAvatar: "https://i.pravatar.cc/150?img=3",
          content: "I've been thinking about how Jane Austen's novels have shaped the romance genre even today. What elements do you see in modern books?",
          timestamp: "2024-02-15T11:30:00Z"
        }
      ],
      clubId: "club2"
    },
    {
      id: "discussion3",
      title: "Best detective characters in mystery novels",
      author: {
        id: "user1",
        name: "Jane Reader",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      date: "2024-03-05T16:20:00Z",
      replies: 12,
      lastReply: "2024-03-12T13:10:00Z",
      messages: [
        {
          id: "msg4",
          userId: "user1",
          userName: "Jane Reader",
          userAvatar: "https://i.pravatar.cc/150?img=5",
          content: "Who are your favorite detective characters and why? I'm particularly fond of Hercule Poirot for his methodical approach.",
          timestamp: "2024-03-05T16:20:00Z"
        }
      ],
      clubId: "club3"
    }
  ]);
  
  // Function to join or leave a club
  const handleJoinLeaveClub = (clubId: string) => {
    setClubs(prevClubs => 
      prevClubs.map(club => {
        if (club.id === clubId) {
          const isCurrentlyMember = club.memberIds.includes(user.id);
          let updatedMemberIds = [...club.memberIds];
          
          if (isCurrentlyMember) {
            // Remove user from club
            updatedMemberIds = updatedMemberIds.filter(id => id !== user.id);
            toast({
              title: "Left Club",
              description: `You have left ${club.name}`,
            });
          } else {
            // Add user to club
            updatedMemberIds.push(user.id);
            toast({
              title: "Joined Club",
              description: `You have joined ${club.name}`,
            });
          }
          
          return {
            ...club,
            memberIds: updatedMemberIds,
            members: isCurrentlyMember ? club.members - 1 : club.members + 1
          };
        }
        return club;
      })
    );
  };
  
  // Function to submit a new message to a discussion
  const handleSubmitMessage = (e: React.FormEvent, discussionId: string) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const discussion = discussions.find(d => d.id === discussionId);
    if (!discussion) return;
    
    const newMsg: DiscussionMessage = {
      id: `msg${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setDiscussions(prevDiscussions => 
      prevDiscussions.map(d => {
        if (d.id === discussionId) {
          return {
            ...d,
            messages: [...d.messages, newMsg],
            replies: d.replies + 1,
            lastReply: new Date().toISOString()
          };
        }
        return d;
      })
    );
    
    toast({
      title: "Message Sent",
      description: "Your message has been posted to the discussion",
    });
    
    setNewMessage('');
  };
  
  const myClubs = clubs.filter(club => club.memberIds.includes(user.id));
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const isClubMember = (clubId: string) => {
    return clubs.find(club => club.id === clubId)?.memberIds.includes(user.id) || false;
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Book Clubs</h1>
          <p className="text-muted-foreground">Connect with readers, join discussions, and share your thoughts on your favorite books</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="p-3 rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clubs.length}</p>
                  <p className="text-sm text-muted-foreground">Active Clubs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="p-3 rounded-full bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{discussions.length}</p>
                  <p className="text-sm text-muted-foreground">Discussions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <div className="p-3 rounded-full bg-accent/10">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{myClubs.length}</p>
                  <p className="text-sm text-muted-foreground">Your Memberships</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      
        <Tabs defaultValue="discussions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-3 md:w-auto">
            <TabsTrigger value="clubs" className="flex items-center space-x-1">
              <ClubIcon className="h-4 w-4 mr-1" />
              <span>All Clubs</span>
            </TabsTrigger>
            <TabsTrigger value="my-clubs" className="flex items-center space-x-1">
              <Users className="h-4 w-4 mr-1" />
              <span>My Clubs</span>
              {myClubs.length > 0 && (
                <span className="ml-1.5 flex items-center justify-center rounded-full bg-primary w-5 h-5 text-xs text-white">
                  {myClubs.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Discussions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clubs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map(club => (
                <Card key={club.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  <CardHeader className="pb-2 bg-gradient-to-b from-muted/20 to-transparent">
                    <CardTitle className="line-clamp-1">{club.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{club.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{club.members} members</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span className="text-xs">Since {formatDate(club.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex -space-x-2 overflow-hidden mb-4">
                      {Array.from({ length: Math.min(4, club.members) }).map((_, idx) => (
                        <Avatar key={idx} className="border-2 border-card inline-block h-8 w-8">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${(idx + 8) % 70}`} />
                          <AvatarFallback>U{idx}</AvatarFallback>
                        </Avatar>
                      ))}
                      {club.members > 4 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-card bg-muted text-xs font-medium">
                          +{club.members - 4}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/10 pt-4">
                    <Button 
                      variant={isClubMember(club.id) ? "outline" : "default"} 
                      className={`w-full ${isClubMember(club.id) ? 'border-primary/50 text-primary' : ''}`}
                      onClick={() => handleJoinLeaveClub(club.id)}
                    >
                      {isClubMember(club.id) ? "Leave Club" : "Join Club"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-clubs" className="space-y-6">
            {myClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myClubs.map(club => (
                  <Card key={club.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/30">
                    <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1">{club.name}</CardTitle>
                          <CardDescription className="line-clamp-2">{club.description}</CardDescription>
                        </div>
                        <Badge className="bg-primary hover:bg-primary/80">Member</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          <span>{club.members} members</span>
                        </div>
                        <div className="flex items-center">
                          <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                          <span className="text-xs">Active Member</span>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3 mb-2">
                        <h4 className="text-sm font-medium mb-1">Recent Activity</h4>
                        <p className="text-xs text-muted-foreground">
                          {discussions.filter(d => d.clubId === club.id).length} active discussions
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/10 pt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-muted-foreground"
                        onClick={() => setActiveTab("discussions")}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        View Discussions
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                        onClick={() => handleJoinLeaveClub(club.id)}
                      >
                        Leave Club
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<ClubIcon className="h-12 w-12 text-muted-foreground" />}
                title="No clubs joined yet"
                description="Join book clubs to connect with readers who share your interests."
              />
            )}
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-6">
            {discussions.map(discussion => {
              const relatedClub = clubs.find(club => club.id === discussion.clubId);
              const isMember = relatedClub ? isClubMember(relatedClub.id) : false;
              
              return (
                <Card key={discussion.id} className="mb-6 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-muted/20 to-transparent">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{discussion.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                            <AvatarFallback>{discussion.author.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          Started by {discussion.author.name} on {formatDate(discussion.date)}
                        </div>
                        {relatedClub && (
                          <div className="mt-2 flex items-center">
                            <Badge 
                              variant="outline" 
                              className={`bg-muted/20 hover:bg-muted/30 ${isMember ? 'border-primary/30 text-primary' : ''}`}
                            >
                              <BookOpen className="h-3 w-3 mr-1" />
                              {relatedClub.name}
                            </Badge>
                            {!isMember && (
                              <span className="ml-2 text-xs text-muted-foreground italic">
                                (Not a member)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-col items-end">
                        <Badge variant="outline" className="mb-1 bg-secondary/10 border-secondary/20">
                          {discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}
                        </Badge>
                        <span className="text-xs">
                          Last activity: {formatDate(discussion.lastReply)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {discussion.messages.map(message => (
                        <div 
                          key={message.id} 
                          className={`flex space-x-4 p-4 rounded-lg ${
                            message.userId === user.id ? 'bg-primary/5 border border-primary/10' : 'bg-secondary/10 border border-secondary/10'
                          }`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.userAvatar} alt={message.userName} />
                            <AvatarFallback>{message.userName.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">
                                {message.userName}
                                {message.userId === user.id && (
                                  <span className="ml-2 text-xs text-primary">(You)</span>
                                )}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                            <p className="mt-1">{message.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {isMember ? (
                      <form 
                        onSubmit={(e) => handleSubmitMessage(e, discussion.id)} 
                        className="mt-6"
                      >
                        <div className="bg-card p-4 rounded-lg border border-border">
                          <div className="mb-2 flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.name}</span>
                          </div>
                          <Textarea
                            placeholder="Add your thoughts to the discussion..."
                            value={activeDiscussionId === discussion.id ? newMessage : ''}
                            onChange={(e) => {
                              setActiveDiscussionId(discussion.id);
                              setNewMessage(e.target.value);
                            }}
                            className="mb-2 focus:border-primary"
                          />
                          <div className="flex justify-end">
                            <Button 
                              type="submit" 
                              disabled={activeDiscussionId !== discussion.id || !newMessage.trim()}
                              className="transition-all duration-200"
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Post Reply
                            </Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-6 p-6 bg-muted/10 rounded-lg border border-border flex flex-col items-center text-center">
                        <div className="rounded-full bg-muted/20 p-3 mb-3">
                          <ClubIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">
                          You must be a member of <span className="font-medium">{relatedClub?.name}</span> to participate in this discussion.
                        </p>
                        <Button 
                          variant="default" 
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => relatedClub && handleJoinLeaveClub(relatedClub.id)}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Join Club to Participate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
        `}
      </style>
    </div>
  );
};

export default Clubs;
