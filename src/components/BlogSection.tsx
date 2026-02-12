import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image?: string;
}

const BlogSection = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("rss-feed");
      if (error) throw error;
      return data as BlogPost[];
    },
    staleTime: 1000 * 60 * 10, // 10 min cache
  });

  return (
    <section id="blog" className="border-t border-border/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Latest from the Blog</h2>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <a
                key={i}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <h3 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-3">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.pubDate).toLocaleDateString("sv-SE")}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No blog posts available right now.</p>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
