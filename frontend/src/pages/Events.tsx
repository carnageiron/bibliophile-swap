
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarDays } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const Events: React.FC = () => {
  const { events } = useApp();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Book Events</h1>
      
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <Card key={event.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{event.description}</p>
                
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-muted-foreground" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })} at {event.time}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Organized by</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {event.organizerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{event.organizerName}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Attendees ({event.attendees.length})</p>
                  <div className="flex -space-x-2">
                    {event.attendees.map(attendee => (
                      <Avatar key={attendee.id} className="border-2 border-background">
                        <AvatarImage src={attendee.avatar} alt={attendee.name} />
                        <AvatarFallback>
                          {attendee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <Separator />
              
              <CardFooter className="p-4">
                <Button variant="outline" className="w-full">Join Event</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays size={40} />}
          title="No current events"
          description="There are no upcoming book events at the moment."
          action={<Button className="mt-2">Create an Event</Button>}
        />
      )}
    </div>
  );
};

export default Events;
