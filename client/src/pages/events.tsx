// ==================== NETWORKING EVENTS PAGE ====================
// Browse and register for career networking events from Eventbrite API
// Helps users discover real networking opportunities and professional events

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  MapPin,
  Search,
  ExternalLink,
  Wifi,
  Building2,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import type { EventbriteEvent } from "@shared/schema";

export default function NetworkingEvents() {
  // ===== STATE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineFilter, setOnlineFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // ===== DATA FETCHING =====
  const { data, isLoading } = useQuery<{ events: EventbriteEvent[], cached?: boolean, demo?: boolean }>({
    queryKey: ['/api/events', searchQuery, onlineFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (onlineFilter !== 'all') params.append('online', onlineFilter);
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      
      const url = `/api/events${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`);
      }
      
      return response.json();
    },
  });

  const events = data?.events || [];

  // ===== HELPERS =====
  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <Calendar className="h-8 w-8 text-primary" />
          Networking Events
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Discover career events, workshops, and networking opportunities
        </p>
        {data?.demo && (
          <Badge variant="secondary" className="mt-2">
            Demo Mode - Sample Events
          </Badge>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-events"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={onlineFilter} onValueChange={setOnlineFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-location-filter">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="true">Online Only</SelectItem>
              <SelectItem value="false">In-Person Only</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Networking">Networking</SelectItem>
              <SelectItem value="Career Development">Career Development</SelectItem>
              <SelectItem value="Job Fair">Job Fair</SelectItem>
            </SelectContent>
          </Select>

          {(searchQuery || onlineFilter !== "all" || categoryFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setOnlineFilter("all");
                setCategoryFilter("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2" data-testid="text-no-events">
              No events found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find more events
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground" data-testid="text-event-count">
            Showing {events.length} event{events.length !== 1 ? 's' : ''}
            {data?.cached && ' (cached)'}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="flex flex-col h-full hover-elevate" data-testid={`card-event-${event.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-lg line-clamp-2" data-testid={`text-event-name-${event.id}`}>
                        {event.name}
                      </CardTitle>
                      {event.isOnline ? (
                        <Badge variant="secondary" className="shrink-0">
                          <Wifi className="h-3 w-3 mr-1" />
                          Online
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="shrink-0">
                          <Building2 className="h-3 w-3 mr-1" />
                          In-Person
                        </Badge>
                      )}
                    </div>
                    
                    {event.category && (
                      <Badge variant="outline" className="w-fit" data-testid={`badge-category-${event.id}`}>
                        {event.category}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    <CardDescription className="line-clamp-3">
                      {stripHtml(event.description)}
                    </CardDescription>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span className="truncate" data-testid={`text-event-date-${event.id}`}>
                          {formatEventDate(event.start)}
                        </span>
                      </div>

                      {event.venue && (event.venue.city || event.venue.name) && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {event.venue.name && `${event.venue.name}, `}
                            {event.venue.city}
                            {event.venue.region && `, ${event.venue.region}`}
                          </span>
                        </div>
                      )}

                      {event.organizerName && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 shrink-0" />
                          <span className="truncate">{event.organizerName}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between gap-2 pt-4 border-t">
                    <Badge variant={event.isFree ? "default" : "secondary"}>
                      {event.isFree ? "Free" : "Paid"}
                    </Badge>
                    <Button
                      size="sm"
                      asChild
                      data-testid={`button-register-${event.id}`}
                    >
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        Register
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
