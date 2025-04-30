
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

// Create a new blog post
export async function createBlogPost(blogPost: Omit<BlogPostData, 'id' | 'author' | 'date'>): Promise<string | null> {
  try {
    // Get the default author
    const { data: authors, error: authorError } = await supabase
      .from("authors")
      .select("id")
      .limit(1);

    if (authorError || !authors || authors.length === 0) {
      console.error("Error fetching default author:", authorError);
      throw authorError;
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        category: blogPost.category,
        image_src: blogPost.imageSrc || '/placeholder.svg',
        read_time: blogPost.readTime || "5 min read",
        featured: blogPost.featured || false,
        author_id: authors[0].id
      })
      .select();

    if (error) {
      console.error("Error creating blog post:", error);
      return null;
    }

    return data[0].id;
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return null;
  }
}

// Update a blog post
export async function updateBlogPost(id: string, blogPost: Partial<BlogPostData>): Promise<boolean> {
  try {
    const updateData: Record<string, any> = {};
    
    if (blogPost.title) updateData.title = blogPost.title;
    if (blogPost.excerpt) updateData.excerpt = blogPost.excerpt;
    if (blogPost.content) updateData.content = blogPost.content;
    if (blogPost.category) updateData.category = blogPost.category;
    if (blogPost.imageSrc) updateData.image_src = blogPost.imageSrc;
    if (blogPost.readTime) updateData.read_time = blogPost.readTime;
    if (blogPost.featured !== undefined) updateData.featured = blogPost.featured;
    
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating blog post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return false;
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return false;
  }
}
