// ==================== AI CAREER COACH PAGE ====================
// This page provides an interactive AI chatbot for personalized career guidance
// Users can ask questions and get real-time advice with streaming responses

// Import React hooks for state and effects
import { useState, useRef, useEffect } from "react";
// Import framer-motion for smooth animations
import { motion, AnimatePresence } from "framer-motion";
// Import UI components from shadcn library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// Import icons for visual elements
import { Send, Sparkles, User, Loader2, MessageSquare, Trash2 } from "lucide-react";
// Import custom toast hook for notifications
import { useToast } from "@/hooks/use-toast";
// Import type definition for chat messages
import type { ChatMessage } from "@shared/schema";

// Main AI Coach component
export default function AICoach() {
  // ===== STATE MANAGEMENT =====
  // Store all chat messages in conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",                                    // Unique ID for this message
      role: "assistant",                                // AI assistant message
      content: "Hello! I'm your AI Career Coach. I'm here to help you with career advice, job search strategies, skill development, and more. What would you like to discuss today?", // Welcome message
      timestamp: new Date().toISOString(),              // Current timestamp
    },
  ]);
  
  // Store the current input text from user
  const [input, setInput] = useState("");
  
  // Track whether AI is currently responding (loading state)
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference to scroll area for auto-scrolling to latest message
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Toast notification hook for user feedback
  const { toast } = useToast();

  // ===== EFFECTS =====
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      // Smooth scroll to the bottom of the chat
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); // Run whenever messages array changes

  // ===== HANDLERS =====
  // Handle sending a new message
  const handleSend = async () => {
    // Validation: Don't send empty messages
    if (!input.trim()) return;
    
    // Validation: Don't send if already waiting for response
    if (isLoading) return;

    // Create user message object
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,          // Unique ID using timestamp
      role: "user",                      // Mark as user message
      content: input.trim(),             // User's input text
      timestamp: new Date().toISOString(), // Current timestamp
    };

    // Add user message to chat immediately (optimistic update)
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input field for next message
    setInput("");
    
    // Set loading state while waiting for AI response
    setIsLoading(true);

    try {
      // Simulate AI response (in production, would call OpenAI API)
      // Using setTimeout to simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate AI response based on user's question
      const aiResponse = generateAIResponse(input.trim());

      // Create AI assistant message object
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,   // Unique ID using timestamp
        role: "assistant",                // Mark as AI assistant message
        content: aiResponse,              // Generated response text
        timestamp: new Date().toISOString(), // Current timestamp
      };

      // Add AI response to chat
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Error handling: show error toast notification
      toast({
        title: "Error",                                           // Toast title
        description: "Failed to get response. Please try again.", // Error message
        variant: "destructive",                                   // Red error styling
      });
    } finally {
      // Always turn off loading state when done
      setIsLoading(false);
    }
  };

  // Handle Enter key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (new line)
      handleSend();       // Send the message
    }
  };

  // Clear all chat messages and start fresh
  const handleClearChat = () => {
    // Reset to initial welcome message only
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm your AI Career Coach. I'm here to help you with career advice, job search strategies, skill development, and more. What would you like to discuss today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    
    // Show confirmation toast
    toast({
      title: "Chat Cleared",                      // Toast title
      description: "Starting a new conversation", // Success message
    });
  };

  // ===== RENDER =====
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Page header with title and description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}    // Start invisible and below
        animate={{ opacity: 1, y: 0 }}     // Fade in and slide up
        className="mb-6"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            {/* Main title with icon */}
            <h1 className="text-4xl font-heading font-bold flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              AI Career Coach
            </h1>
            {/* Subtitle description */}
            <p className="text-lg text-muted-foreground mt-2">
              Get personalized career guidance powered by AI
            </p>
          </div>
          
          {/* Clear chat button */}
          <Button
            variant="outline"              // Outline style button
            onClick={handleClearChat}      // Clear conversation on click
            className="gap-2"
            data-testid="button-clear-chat"
          >
            <Trash2 className="h-4 w-4" />
            Clear Chat
          </Button>
        </div>
      </motion.div>

      {/* Main chat interface card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}         // Slight delay for stagger effect
        className="flex-1 flex flex-col min-h-0"
      >
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Chat
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col min-h-0 p-0">
            {/* Scrollable chat messages area */}
            <ScrollArea className="flex-1 px-6" ref={scrollRef}>
              <div className="space-y-4 py-4">
                {/* Animate each message individually */}
                <AnimatePresence mode="popLayout">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}      // Start invisible and below
                      animate={{ opacity: 1, y: 0 }}       // Fade in and slide up
                      exit={{ opacity: 0, scale: 0.95 }}   // Fade out when removed
                      transition={{ delay: index * 0.05 }} // Stagger animation
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                      data-testid={`message-${message.role}`}
                    >
                      {/* Avatar for assistant messages (left side) */}
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Sparkles className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto" // User: right-aligned, primary color
                            : "bg-muted"                                    // Assistant: left-aligned, muted color
                        }`}
                      >
                        {/* Message text with preserved line breaks */}
                        <p className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </p>
                        
                        {/* Timestamp in small text */}
                        <p className="text-xs opacity-70 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>

                      {/* Avatar for user messages (right side) */}
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-secondary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator while waiting for AI response */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-4">
                      {/* Animated dots to show thinking */}
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input area at the bottom */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                {/* Text input for user message */}
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)} // Update input state
                  onKeyDown={handleKeyPress}                 // Handle Enter key
                  placeholder="Ask me anything about your career..." // Placeholder text
                  className="min-h-[60px] resize-none"       // Fixed height, no resize
                  disabled={isLoading}                        // Disable while loading
                  data-testid="input-chat-message"
                />
                
                {/* Send button */}
                <Button
                  onClick={handleSend}                        // Send on click
                  disabled={!input.trim() || isLoading}       // Disable if empty or loading
                  size="icon"                                 // Icon-only button
                  className="h-[60px] w-[60px]"              // Square button size
                  data-testid="button-send-message"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" /> // Show spinner when loading
                  ) : (
                    <Send className="h-5 w-5" />                 // Show send icon normally
                  )}
                </Button>
              </div>
              
              {/* Helper text */}
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
// Generate AI response based on user input (simulated)
// In production, this would call OpenAI API
function generateAIResponse(userInput: string): string {
  // Convert input to lowercase for easier matching
  const input = userInput.toLowerCase();

  // Pattern matching to provide relevant responses
  if (input.includes("resume") || input.includes("cv")) {
    return "Great question about resumes! Here are some key tips:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs and quantifiable achievements\n3. Tailor it to each job application\n4. Include relevant skills and keywords from the job description\n5. Proofread carefully for errors\n\nWould you like specific help with any section of your resume?";
  }

  if (input.includes("interview")) {
    return "Interview preparation is crucial! Here's how to excel:\n\n1. Research the company thoroughly\n2. Practice common interview questions\n3. Prepare STAR method examples (Situation, Task, Action, Result)\n4. Prepare thoughtful questions for the interviewer\n5. Dress professionally and arrive early\n6. Follow up with a thank-you email\n\nWould you like to practice specific interview questions?";
  }

  if (input.includes("salary") || input.includes("negotiate")) {
    return "Salary negotiation is an important skill! Here are key strategies:\n\n1. Research market rates for your role and location\n2. Know your minimum acceptable salary before negotiating\n3. Let them make the first offer when possible\n4. Consider total compensation (benefits, equity, bonuses)\n5. Be professional and confident, not aggressive\n6. Get everything in writing\n\nWhat specific aspect of salary negotiation would you like to explore?";
  }

  if (input.includes("skill") || input.includes("learn")) {
    return "Continuous learning is essential for career growth! Here's my advice:\n\n1. Identify in-demand skills in your target industry\n2. Use online platforms (Coursera, Udemy, LinkedIn Learning)\n3. Build projects to apply what you learn\n4. Network with professionals in your field\n5. Stay updated with industry trends\n\nCheck out our Skill Assessments and Learning Path features to get started!";
  }

  if (input.includes("career change") || input.includes("switch")) {
    return "Career changes can be exciting! Here's how to approach it:\n\n1. Identify transferable skills from your current role\n2. Research your target industry thoroughly\n3. Network with people in your desired field\n4. Consider taking courses or certifications\n5. Start with informational interviews\n6. Be prepared to start at a lower level if necessary\n\nWhat field are you considering moving into?";
  }

  // Default response if no patterns match
  return "That's an interesting question! I can help you with:\n\n• Resume and cover letter writing\n• Interview preparation\n• Career planning and transitions\n• Skill development\n• Job search strategies\n• Salary negotiation\n• Work-life balance\n\nCould you tell me more about what specific aspect you'd like to focus on?";
}
