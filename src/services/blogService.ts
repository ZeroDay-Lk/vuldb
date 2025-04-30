
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
        author_id: authors[0].id
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

// Create a sample blog post about XSS vulnerabilities
export async function createSamplePost(): Promise<string | null> {
  const samplePost = {
    title: "Understanding Cross-Site Scripting (XSS) Vulnerabilities",
    excerpt: "XSS attacks are among the most common web application vulnerabilities. Learn how they work and how to prevent them in your applications.",
    content: `# Understanding Cross-Site Scripting (XSS) Vulnerabilities

Cross-Site Scripting (XSS) is one of the most prevalent web application security vulnerabilities. This attack occurs when malicious scripts are injected into trusted websites, allowing attackers to execute scripts in victims' browsers.

## Types of XSS Attacks

There are three main types of XSS attacks:

- **Reflected XSS**: Where the malicious script comes from the current HTTP request
- **Stored XSS**: Where the malicious script comes from the website's database
- **DOM-based XSS**: Where the vulnerability exists in client-side code

## Example of an XSS Vulnerability

Here's a simple example of a vulnerable code snippet:

\`\`\`javascript
// Vulnerable code
const userInput = document.getElementById('userInput').value;
document.getElementById('output').innerHTML = userInput;
\`\`\`

The above code directly inserts user input into the DOM without sanitization, allowing attackers to inject scripts.

## Prevention Techniques

To prevent XSS attacks, follow these best practices:

- Always validate and sanitize user inputs
- Implement Content Security Policy (CSP)
- Use modern frameworks that automatically escape potentially dangerous characters
- Apply the principle of least privilege when including external scripts

Remember: Security is a continuous process, not a one-time implementation.`,
    category: "Web Security",
    imageSrc: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    readTime: "7 min read",
    featured: true
  };

  return createBlogPost(samplePost);
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
