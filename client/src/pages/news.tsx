// ==================== CAREER NEWS PAGE ====================
// Curated industry news and trends relevant to user's career interests
// Personalized news feed to stay updated with latest developments

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Newspaper, Clock, Bookmark, Search, TrendingUp, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@shared/schema";

// Sample news articles
const SAMPLE_NEWS: NewsArticle[] = [
  {
    id: "1",
    title: "AI Revolution: How Machine Learning is Transforming Software Development",
    summary: "Explore the latest AI tools and frameworks that are changing how developers write code, from GitHub Copilot to ChatGPT integrations.",
    content: "Full article content would go here...",
    author: "Sarah Chen",
    source: "TechCrunch",
    category: ["Technology", "AI", "Development"],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readTime: 8,
    tags: ["AI", "Machine Learning", "Development", "Tools"],
    views: 1234,
    isBookmarked: false,
  },
  {
    id: "2",
    title: "Remote Work Trends 2025: What Tech Companies Are Planning",
    summary: "Analysis of remote work policies at major tech companies and insights into the future of distributed teams.",
    content: "Full article content...",
    author: "Michael Roberts",
    source: "Forbes",
    category: ["Career", "Remote Work"],
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    readTime: 6,
    tags: ["Remote Work", "Career", "Tech Industry"],
    views: 892,
    isBookmarked: false,
  },
  {
    id: "3",
    title: "Salary Survey 2025: Software Engineer Compensation by Location",
    summary: "Comprehensive analysis of software engineering salaries across different cities and experience levels in 2025.",
    content: "Full article...",
    author: "Emily Johnson",
    source: "Stack Overflow",
    category: ["Career", "Salary"],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    readTime: 10,
    tags: ["Salary", "Career", "Survey"],
    views: 2156,
    isBookmarked: false,
  },
  {
    id: "4",
    title: "The Rise of No-Code Tools: Impact on Developer Jobs",
    summary: "How no-code and low-code platforms are changing the software development landscape and what it means for developers.",
    content: "Article content...",
    author: "David Kim",
    source: "Medium",
    category: ["Technology", "Career"],
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readTime: 7,
    tags: ["No-Code", "Development", "Future of Work"],
    views: 543,
    isBookmarked: false,
  },
];

export default function CareerNews() {
  // ===== STATE =====
  const [news, setNews] = useState<NewsArticle[]>([]);  // All news articles
  const [searchQuery, setSearchQuery] = useState("");             // Search input
  const [selectedCategory, setSelectedCategory] = useState("all"); // Filter category
  const { toast } = useToast();

  // ===== FETCH NEWS FROM API =====
  const { data: newsData, isLoading, isError, error } = useQuery<{ articles: NewsArticle[] }>({
    queryKey: ['/api/news'],
  });

  // Update local news state when data is fetched
  useEffect(() => {
    if (newsData?.articles) {
      setNews(newsData.articles);
    }
  }, [newsData]);

  // ===== HANDLERS =====
  // Toggle bookmark on article
  const handleToggleBookmark = (articleId: string) => {
    setNews(news.map(article => {
      if (article.id === articleId) {
        const newBookmarked = !article.isBookmarked;
        if (newBookmarked) {
          toast({
            title: "Article Saved",
            description: "Added to your bookmarks",
          });
        }
        return { ...article, isBookmarked: newBookmarked };
      }
      return article;
    }));
  };

  // ===== COMPUTED VALUES =====
  // Get all unique categories from news
  const categories = ["all", ...Array.from(new Set(news.flatMap(n => n.category)))];

  // Filter news based on search and category
  const filteredNews = news.filter(article => {
    const matchesSearch = searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "all" ||
      article.category.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Get bookmarked articles
  const bookmarkedNews = news.filter(article => article.isBookmarked);

  // ===== HELPER FUNCTIONS =====
  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // ===== RENDER =====
  return (
    <div className="p-6">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          Career News
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Stay updated with the latest trends, insights, and opportunities in your industry
        </p>
      </motion.div>

      {/* Error State */}
      {isError && (
        <Card className="mb-6 border-destructive">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">Failed to load news</h3>
                <p className="text-sm text-muted-foreground">
                  {error instanceof Error ? error.message : 'Unable to fetch career news. Please try again later.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Loading latest career news...</p>
        </div>
      )}

      {/* Search and filters - only show when not loading */}
      {!isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-news"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              data-testid={`button-category-${category}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>
      )}

      {/* Tabs for all news vs bookmarked - only show when not loading */}
      {!isLoading && (
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All News ({filteredNews.length})
          </TabsTrigger>
          <TabsTrigger value="bookmarked">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved ({bookmarkedNews.length})
          </TabsTrigger>
        </TabsList>

        {/* All news tab */}
        <TabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover-elevate flex flex-col">
                  <CardHeader>
                    {/* Article categories */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-2 flex-wrap">
                        {article.category.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleBookmark(article.id)}
                        data-testid={`button-bookmark-${article.id}`}
                      >
                        <Bookmark className={`h-4 w-4 ${article.isBookmarked ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    <CardTitle className="text-lg line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Article meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min read
                        </span>
                        <span>{timeAgo(article.publishedAt)}</span>
                      </div>

                      {/* Author and source */}
                      <div className="text-sm">
                        <span className="font-medium">{article.author}</span>
                        <span className="text-muted-foreground"> • {article.source}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Read more button */}
                    <Button 
                      className="w-full mt-4 gap-2" 
                      variant="outline" 
                      data-testid={`button-read-${article.id}`}
                      onClick={() => article.url && window.open(article.url, '_blank')}
                      disabled={!article.url}
                    >
                      Read Article
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {filteredNews.length === 0 && (
            <Card className="p-12">
              <div className="text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Bookmarked news tab */}
        <TabsContent value="bookmarked" className="mt-6">
          {bookmarkedNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedNews.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full hover-elevate">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{article.category[0]}</Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleBookmark(article.id)}
                          data-testid={`button-unbookmark-${article.id}`}
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>{article.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full gap-2" 
                        variant="outline" 
                        data-testid={`button-read-saved-${article.id}`}
                        onClick={() => article.url && window.open(article.url, '_blank')}
                        disabled={!article.url}
                      >
                        Read Article
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Saved Articles</h3>
                <p className="text-muted-foreground mb-4">
                  Bookmark articles to read them later
                </p>
                <Button data-testid="button-browse-news">Browse News</Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      )}

      {/* Trending topics - only show when not loading */}
      {!isLoading && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["AI & ML", "Remote Work", "Career Growth", "Salary Trends", "Tech Skills", "Leadership"].map((topic) => (
                <Badge key={topic} variant="outline" className="cursor-pointer hover-elevate">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      )}
    </div>
  );
}
