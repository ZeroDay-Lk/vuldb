
import { supabase } from "@/integrations/supabase/client";
import type { BlogPostData } from "@/data/blog-posts";

// Fetch all blog posts
export async function getAllBlogPosts(): Promise<BlogPostData[]> {
  try {
    const { data: blogPosts, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        authors:author_id (
          name,
          avatar
        )
      `)
      .order('featured', { ascending: false })
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching blog posts:", error);
      throw error;
    }

    // Transform the data to match the BlogPostData interface
    return blogPosts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: post.read_time,
      imageSrc: post.image_src,
      featured: post.featured,
      author: {
        name: post.authors.name,
        avatar: post.authors.avatar
      }
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

// Get a single blog post by ID
export async function getBlogPostById(id: string): Promise<BlogPostData | null> {
  try {
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(`
        *,
        authors:author_id (
          name,
          avatar
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching blog post:", error);
      return null;
    }

    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      date: new Date(post.date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      readTime: post.read_time,
      imageSrc: post.image_src,
      featured: post.featured,
      author: {
        name: post.authors.name,
        avatar: post.authors.avatar
      }
    };
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}
