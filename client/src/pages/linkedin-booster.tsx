import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles, Loader2, Copy, Check, LinkedinIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { linkedInProfileSchema, type LinkedInProfileFormData } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function LinkedInBooster() {
  const { toast } = useToast();
  const [optimizedResult, setOptimizedResult] = useState<{
    optimizedHeadline: string;
    optimizedSummary: string;
    suggestions: string[];
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const form = useForm<LinkedInProfileFormData>({
    resolver: zodResolver(linkedInProfileSchema),
    defaultValues: {
      headline: "",
      summary: "",
      skills: [],
      currentRole: "",
    },
  });

  const optimizeMutation = useMutation({
    mutationFn: async (data: LinkedInProfileFormData & { targetRole?: string }) => {
      const response = await apiRequest(
        "POST",
        "/api/linkedin-profile/optimize",
        {
          headline: data.headline,
          summary: data.summary,
          skills: data.skills,
          targetRole: data.currentRole,
        }
      );
      return await response.json() as {
        optimizedHeadline: string;
        optimizedSummary: string;
        suggestions: string[];
      };
    },
    onSuccess: (data) => {
      setOptimizedResult(data);
      toast({
        title: "Profile Optimized!",
        description: "Your LinkedIn profile has been enhanced with AI suggestions.",
      });
    },
    onError: () => {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOptimize = (data: LinkedInProfileFormData) => {
    optimizeMutation.mutate(data);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  return (
    <div className="p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <LinkedinIcon className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-4xl font-heading font-bold">LinkedIn Profile Booster</h1>
            <p className="text-lg text-muted-foreground">
              Optimize your LinkedIn profile with AI-powered suggestions
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Current Profile</CardTitle>
              <CardDescription>
                Enter your current LinkedIn information to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOptimize)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currentRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Role</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Full Stack Developer, Data Scientist"
                            {...field}
                            data-testid="input-target-role"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="headline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Headline</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your professional headline"
                            {...field}
                            data-testid="input-headline"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/220 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="summary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your professional summary..."
                            className="min-h-[150px]"
                            {...field}
                            data-testid="input-summary"
                          />
                        </FormControl>
                        <p className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/2600 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Skills</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter skills separated by commas"
                            value={field.value?.join(", ") || ""}
                            onChange={(e) => {
                              const skills = e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean);
                              field.onChange(skills);
                            }}
                            data-testid="input-skills"
                          />
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((skill, index) => (
                            <Badge key={index} variant="secondary" data-testid={`badge-skill-${index}`}>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={optimizeMutation.isPending}
                    data-testid="button-optimize"
                  >
                    {optimizeMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Optimize with AI
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {optimizedResult ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Optimized Headline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-medium" data-testid="text-optimized-headline">
                      {optimizedResult.optimizedHeadline}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() =>
                      copyToClipboard(optimizedResult.optimizedHeadline, "headline")
                    }
                    data-testid="button-copy-headline"
                  >
                    {copiedField === "headline" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Headline
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Optimized Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-4 bg-muted rounded-md max-h-[300px] overflow-y-auto">
                    <p className="whitespace-pre-wrap" data-testid="text-optimized-summary">
                      {optimizedResult.optimizedSummary}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() =>
                      copyToClipboard(optimizedResult.optimizedSummary, "summary")
                    }
                    data-testid="button-copy-summary"
                  >
                    {copiedField === "summary" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Summary
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {optimizedResult.suggestions.map((suggestion, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-muted rounded-md"
                        data-testid={`text-suggestion-${index}`}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{suggestion}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-heading font-bold mb-2">
                  Ready to Optimize?
                </h3>
                <p className="text-muted-foreground">
                  Fill in your current profile information and click "Optimize with AI" to
                  get personalized suggestions
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
