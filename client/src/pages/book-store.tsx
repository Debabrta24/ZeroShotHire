import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Star, ShoppingCart, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  description: string;
  coverColor: string;
  relevance: string;
}

const careerBooks: Book[] = [
  {
    id: 1,
    title: "The Lean Startup",
    author: "Eric Ries",
    category: "Entrepreneurship",
    price: 24.99,
    rating: 4.5,
    description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    coverColor: "bg-blue-500",
    relevance: "Essential for startup founders and product managers"
  },
  {
    id: 2,
    title: "Cracking the Coding Interview",
    author: "Gayle Laakmann McDowell",
    category: "Technical Interview",
    price: 39.99,
    rating: 4.8,
    description: "189 programming questions and solutions to help you ace your technical interview.",
    coverColor: "bg-green-500",
    relevance: "Must-read for software engineers"
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Improvement",
    price: 19.99,
    rating: 4.9,
    description: "An easy & proven way to build good habits & break bad ones.",
    coverColor: "bg-purple-500",
    relevance: "Build career success through small habits"
  },
  {
    id: 4,
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    price: 22.99,
    rating: 4.6,
    description: "Rules for focused success in a distracted world.",
    coverColor: "bg-indigo-500",
    relevance: "Maximize your productivity and output"
  },
  {
    id: 5,
    title: "The Design of Everyday Things",
    author: "Don Norman",
    category: "Design",
    price: 27.99,
    rating: 4.7,
    description: "Fundamental principles of design for both designers and non-designers.",
    coverColor: "bg-pink-500",
    relevance: "Essential for UX/UI designers"
  },
  {
    id: 6,
    title: "Soft Skills",
    author: "John Sonmez",
    category: "Career Development",
    price: 21.99,
    rating: 4.4,
    description: "The software developer's life manual covering career, productivity, and personal finance.",
    coverColor: "bg-orange-500",
    relevance: "Complete career guide for developers"
  },
  {
    id: 7,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    category: "System Design",
    price: 49.99,
    rating: 4.9,
    description: "The big ideas behind reliable, scalable, and maintainable systems.",
    coverColor: "bg-red-500",
    relevance: "Critical for backend engineers"
  },
  {
    id: 8,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Software Craftsmanship",
    price: 44.99,
    rating: 4.7,
    description: "A handbook of agile software craftsmanship.",
    coverColor: "bg-teal-500",
    relevance: "Write better, maintainable code"
  },
  {
    id: 9,
    title: "The Manager's Path",
    author: "Camille Fournier",
    category: "Leadership",
    price: 32.99,
    rating: 4.6,
    description: "A guide for tech leaders navigating growth and change.",
    coverColor: "bg-cyan-500",
    relevance: "For aspiring engineering managers"
  },
  {
    id: 10,
    title: "Think Like a Programmer",
    author: "V. Anton Spraul",
    category: "Problem Solving",
    price: 29.99,
    rating: 4.5,
    description: "An introduction to creative problem solving.",
    coverColor: "bg-yellow-500",
    relevance: "Improve problem-solving skills"
  },
  {
    id: 11,
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    category: "Software Development",
    price: 42.99,
    rating: 4.8,
    description: "Your journey to mastery in software development.",
    coverColor: "bg-emerald-500",
    relevance: "Timeless advice for all developers"
  },
  {
    id: 12,
    title: "Never Split the Difference",
    author: "Chris Voss",
    category: "Negotiation",
    price: 18.99,
    rating: 4.7,
    description: "Negotiating as if your life depended on it.",
    coverColor: "bg-violet-500",
    relevance: "Master salary negotiations"
  }
];

export default function BookStore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { toast } = useToast();

  const categories = ["All", ...Array.from(new Set(careerBooks.map(book => book.category)))];

  const filteredBooks = careerBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (book: Book) => {
    toast({
      title: "Added to cart!",
      description: `"${book.title}" has been added to your reading list.`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookOpen className="h-10 w-10 text-primary" />
          Career Book Store
        </h1>
        <p className="text-lg text-muted-foreground">
          Handpicked books to accelerate your career growth
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find the perfect book for your career goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-books"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover-elevate"
                onClick={() => setSelectedCategory(category)}
                data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover-elevate" data-testid={`card-book-${book.id}`}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`${book.coverColor} rounded-md h-24 w-16 flex-shrink-0 flex items-center justify-center`}>
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{book.category}</Badge>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {book.description}
              </p>
              <p className="text-xs text-primary font-medium">
                📚 {book.relevance}
              </p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-2xl font-bold">${book.price}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://www.amazon.com/s?k=${encodeURIComponent(book.title)}`, '_blank')}
                    data-testid={`button-view-${book.id}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(book)}
                    data-testid={`button-add-to-cart-${book.id}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No books found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
