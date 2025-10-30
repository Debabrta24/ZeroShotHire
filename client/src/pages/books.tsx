import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Filter,
  ExternalLink,
  Calendar,
  User,
  FileText
} from "lucide-react";
import type { Book } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("programming");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showReader, setShowReader] = useState(false);
  const { toast } = useToast();

  // Fetch books from API
  const { data: booksData, isLoading } = useQuery({
    queryKey: ["/api/books/search", searchQuery, selectedSubject],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("q", searchQuery);
      if (selectedSubject !== "all") {
        params.append("subject", selectedSubject);
      }
      params.append("limit", "20");
      
      const response = await fetch(`/api/books/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch books");
      return response.json();
    },
  });

  // Fetch bookmarks
  const { data: bookmarksData } = useQuery({
    queryKey: ["/api/bookmarks"],
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: async (book: Book) => {
      const response = await apiRequest("POST", "/api/bookmarks", { bookData: book });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Book bookmarked",
        description: "Book added to your bookmarks",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to bookmark",
        description: error.message || "Could not bookmark this book",
        variant: "destructive",
      });
    },
  });

  // Remove bookmark mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: async (bookmarkId: string) => {
      const response = await apiRequest("DELETE", `/api/bookmarks/${bookmarkId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookmarks"] });
      toast({
        title: "Bookmark removed",
        description: "Book removed from your bookmarks",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to remove bookmark",
        description: error.message || "Could not remove bookmark",
        variant: "destructive",
      });
    },
  });

  const books = booksData?.books || [];
  const bookmarks = (bookmarksData as any)?.bookmarks || [];

  // Check if a book is bookmarked
  const isBookBookmarked = (bookId: string) => {
    return bookmarks.some((b: any) => b.bookId === bookId);
  };

  // Get bookmark ID for a book
  const getBookmarkId = (bookId: string) => {
    const bookmark = bookmarks.find((b: any) => b.bookId === bookId);
    return bookmark?.id;
  };

  const handleBookmarkToggle = (book: Book) => {
    if (isBookBookmarked(book.id)) {
      const bookmarkId = getBookmarkId(book.id);
      if (bookmarkId) {
        removeBookmarkMutation.mutate(bookmarkId);
      }
    } else {
      bookmarkMutation.mutate(book);
    }
  };

  const handleReadBook = (book: Book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  const programmingSubjects = [
    "all",
    "javascript",
    "python",
    "java",
    "react",
    "web development",
    "data science",
    "machine learning",
    "algorithms",
    "databases",
    "artificial intelligence",
    "mobile development",
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-heading font-bold">Free Programming Books</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover thousands of free programming books to accelerate your learning
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for programming books..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-books"
                />
              </div>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-full md:w-56" data-testid="select-subject">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programmingSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject.charAt(0).toUpperCase() + subject.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Available Books", value: booksData?.total?.toLocaleString() || "0", color: "text-primary" },
          { label: "Your Bookmarks", value: bookmarks.length.toString(), color: "text-success" },
          { label: "Free to Read", value: books.length.toString(), color: "text-warning" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold font-mono ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-48 bg-muted rounded-md mb-4"></div>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book: Book, index: number) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="hover-elevate overflow-visible h-full flex flex-col">
                <CardHeader className="flex-1">
                  {book.coverUrl && (
                    <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-muted">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleBookmarkToggle(book)}
                      data-testid={`button-bookmark-${book.id}`}
                    >
                      {isBookBookmarked(book.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription className="flex flex-col gap-2 mt-2">
                    {book.author.length > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        <span className="line-clamp-1">{book.author.join(", ")}</span>
                      </div>
                    )}
                    {book.publishYear && (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        <span>{book.publishYear}</span>
                      </div>
                    )}
                    {book.pageCount && (
                      <div className="flex items-center gap-1 text-sm">
                        <FileText className="h-3 w-3" />
                        <span>{book.pageCount} pages</span>
                      </div>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {book.subjects && book.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.slice(0, 3).map((subject, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {book.subjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{book.subjects.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 gap-2"
                      onClick={() => handleReadBook(book)}
                      data-testid={`button-read-${book.id}`}
                    >
                      <BookOpen className="h-4 w-4" />
                      Read Now
                    </Button>
                    {book.readUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => window.open(book.readUrl, "_blank")}
                        data-testid={`button-external-${book.id}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No books found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Book Reader Dialog */}
      <Dialog open={showReader} onOpenChange={setShowReader}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription>
              {selectedBook?.author.join(", ")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedBook?.readUrl && (
              <iframe
                src={selectedBook.readUrl}
                className="w-full h-full border-0 rounded-md"
                title={`Read ${selectedBook.title}`}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
