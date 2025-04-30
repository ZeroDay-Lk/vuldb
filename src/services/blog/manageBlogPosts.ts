
import { supabase } from "@/integrations/supabase/client";
import type { BlogPostData } from "@/data/blog-posts";

// Create a new blog post
export async function createBlogPost(blogPost: Omit<BlogPostData, 'id' | 'author' | 'date'>): Promise<string | null> {
  try {
    console.log("Creating blog post with data:", blogPost);
    
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
        author_id: authors[0].id,
        date: new Date().toISOString() // Add current date
      })
      .select();

    if (error) {
      console.error("Error creating blog post:", error);
      return null;
    }

    console.log("Blog post created successfully:", data);
    return data[0].id;
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return null;
  }
}

// Update an existing blog post
export async function updateBlogPost(id: string, blogPost: Partial<BlogPostData>): Promise<boolean> {
  try {
    // Convert any date objects to ISO strings
    const updatedData: Record<string, any> = {
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      category: blogPost.category,
      image_src: blogPost.imageSrc,
      featured: blogPost.featured,
      read_time: blogPost.readTime,
      updated_at: new Date().toISOString()
    };
    
    // Remove any undefined values
    Object.keys(updatedData).forEach(key => {
      if (updatedData[key] === undefined) {
        delete updatedData[key];
      }
    });
    
    const { error } = await supabase
      .from("blog_posts")
      .update(updatedData)
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
