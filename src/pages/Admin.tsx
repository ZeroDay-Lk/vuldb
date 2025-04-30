
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2, LogOut, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogPostData } from "@/data/blog-posts";
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  createSamplePost
} from '@/services/blogService';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the form schema for blog posts
const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  imageSrc: z.string().optional(),
  readTime: z.string().optional().default("5 min read"),
  featured: z.boolean().optional().default(false),
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

const Admin = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPostData | null>(null);
  const [isCreatingSample, setIsCreatingSample] = useState(false);
  const [samplePostNumber, setSamplePostNumber] = useState<number>(1);
  const [isSampleDialogOpen, setIsSampleDialogOpen] = useState(false);
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      toast.error("Failed to fetch blog posts");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create form
  const createForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      imageSrc: "",
      readTime: "5 min read",
      featured: false,
    },
  });
  
  // Edit form
  const editForm = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      imageSrc: "",
      readTime: "5 min read",
      featured: false,
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleCreatePost = async (data: BlogPostFormValues) => {
    try {
      console.log("Creating post with data:", data);
      const newPostId = await createBlogPost({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        imageSrc: data.imageSrc,
        readTime: data.readTime || "5 min read",
        featured: data.featured || false,
      });

      if (newPostId) {
        await fetchPosts(); // Refetch posts to get the new one
        setIsCreateDialogOpen(false);
        createForm.reset();
        toast.success("Blog post created successfully");
      } else {
        toast.error("Failed to create blog post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating the post");
    }
  };

  const handleCreateSamplePost = async () => {
    try {
      setIsCreatingSample(true);
      setIsSampleDialogOpen(false);
      const newPostId = await createSamplePost(samplePostNumber);
      
      if (newPostId) {
        await fetchPosts(); // Refetch posts to get the new one
        toast.success(`Sample blog post #${samplePostNumber} created successfully`);
      } else {
        toast.error("Failed to create sample blog post");
      }
    } catch (error) {
      console.error("Error creating sample post:", error);
      toast.error("An error occurred while creating the sample post");
    } finally {
      setIsCreatingSample(false);
    }
  };
  
  const handleEditClick = (post: BlogPostData) => {
    setCurrentPost(post);
    editForm.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      imageSrc: post.imageSrc || "",
      readTime: post.readTime,
      featured: post.featured,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleEditPost = async (data: BlogPostFormValues) => {
    if (!currentPost) return;

    try {
      const success = await updateBlogPost(currentPost.id, {
        ...data,
      });

      if (success) {
        await fetchPosts(); // Refetch posts to get the updated one
        setIsEditDialogOpen(false);
        toast.success("Blog post updated successfully");
      } else {
        toast.error("Failed to update blog post");
      }
    } catch (error) {
      toast.error("An error occurred while updating the post");
    }
  };
  
  const handleDeleteClick = (post: BlogPostData) => {
    setCurrentPost(post);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeletePost = async () => {
    if (!currentPost) return;

    try {
      const success = await deleteBlogPost(currentPost.id);

      if (success) {
        setPosts(posts.filter(post => post.id !== currentPost.id));
        setIsDeleteDialogOpen(false);
        toast.success("Blog post deleted successfully");
      } else {
        toast.error("Failed to delete blog post");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the post");
    }
  };

  const samplePosts = [
    "XSS Vulnerabilities",
    "SQL Injection Attacks",
    "CSRF Attacks",
    "Broken Authentication",
    "Insecure Direct Object References",
    "Security Headers",
    "Secure File Upload",
    "Server-Side Request Forgery",
    "API Security",
    "OWASP Top 10"
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts Admin</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="mb-6 flex gap-4">
        <Button 
          className="bg-vulnscribe-purple hover:bg-vulnscribe-lightpurple"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add New Post
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsSampleDialogOpen(true)}
          disabled={isCreatingSample}
        >
          <PlusCircle className="h-4 w-4" />
          {isCreatingSample ? "Creating..." : "Add Sample Post"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vulnscribe-purple"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-500"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No blog posts found. Create your first post!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Fill in the details for your new blog post.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreatePost)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter post category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a short excerpt" 
                        className="min-h-[80px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter post content" 
                        className="min-h-[200px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="imageSrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this post as featured on the homepage
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Post</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the details for this blog post.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditPost)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[80px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="min-h-[200px]" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="imageSrc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Mark this post as featured on the homepage
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentPost && (
            <div className="py-4">
              <p className="font-medium">{currentPost.title}</p>
              <p className="text-sm text-gray-500">{currentPost.category}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeletePost}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sample Post Dialog */}
      <Dialog open={isSampleDialogOpen} onOpenChange={setIsSampleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sample Blog Post</DialogTitle>
            <DialogDescription>
              Select which sample blog post you would like to create.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <FormLabel>Sample Post</FormLabel>
              <Select 
                value={samplePostNumber.toString()} 
                onValueChange={(value) => setSamplePostNumber(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sample post" />
                </SelectTrigger>
                <SelectContent>
                  {samplePosts.map((post, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {index + 1}. {post}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsSampleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleCreateSamplePost}
              disabled={isCreatingSample}
            >
              {isCreatingSample ? "Creating..." : "Create Sample Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
