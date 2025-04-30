
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryBadge from '@/components/CategoryBadge';
import CodeBlock from '@/components/CodeBlock';
import { getBlogPostById } from '@/services/blogService';
import { toast } from 'sonner';
import { BlogPostData } from '@/data/blog-posts';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const fetchedPost = await getBlogPostById(postId);
        setPost(fetchedPost);
        
        if (!fetchedPost) {
          toast.error('Blog post not found');
        }
      } catch (err) {
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [postId]);
  
  const renderContent = (content: string) => {
    const parts = content.split('```');
    
    return parts.map((part, index) => {
      // Code blocks are the odd-indexed parts after splitting by triple backticks
      if (index % 2 === 1) {
        // Extract language if specified after first backtick
        const languageMatch = part.match(/^([a-zA-Z]+)\n/);
        const language = languageMatch ? languageMatch[1] : 'text';
        const codeContent = languageMatch ? part.substring(languageMatch[0].length) : part;
        
        return <CodeBlock key={index} language={language}>{codeContent}</CodeBlock>;
      }
      
      // Regular text - split by newlines and create paragraphs
      return part.split('\n\n').map((paragraph, pIndex) => {
        // Handle headers
        if (paragraph.startsWith('# ')) {
          return <h1 key={`${index}-${pIndex}`} className="text-3xl font-bold mt-8 mb-4">{paragraph.substring(2)}</h1>;
        } else if (paragraph.startsWith('## ')) {
          return <h2 key={`${index}-${pIndex}`} className="text-2xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>;
        } else if (paragraph.startsWith('### ')) {
          return <h3 key={`${index}-${pIndex}`} className="text-xl font-bold mt-5 mb-2">{paragraph.substring(4)}</h3>;
        }
        
        // Handle bullet points
        if (paragraph.includes('\n- ')) {
          const listItems = paragraph.split('\n- ');
          const intro = listItems.shift(); // Get text before the list
          
          return (
            <div key={`${index}-${pIndex}`}>
              {intro && intro !== '' && <p className="mb-4">{intro}</p>}
              <ul className="list-disc pl-6 mb-4 space-y-2">
                {listItems.map((item, lIndex) => (
                  <li key={`${index}-${pIndex}-${lIndex}`}>{item}</li>
                ))}
              </ul>
            </div>
          );
        }
        
        // Regular paragraph
        return paragraph ? (
          <p key={`${index}-${pIndex}`} className="mb-4">{paragraph}</p>
        ) : null;
      });
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-16">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vulnscribe-purple"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-16">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="mb-8">The post you're looking for doesn't exist or has been removed.</p>
            <Link to="/" className="text-vulnscribe-purple hover:underline flex items-center justify-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header section with featured image */}
        {post?.imageSrc && (
          <div className="w-full h-80 md:h-96 relative">
            <img 
              src={post.imageSrc} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          </div>
        )}
        
        <div className={`container ${post?.imageSrc ? '-mt-32 relative z-10' : 'mt-8'} mb-16`}>
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-10">
            <Link to="/" className="inline-flex items-center text-vulnscribe-purple hover:underline mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to all articles
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post?.category && <CategoryBadge category={post.category} />}
              <span className="text-sm text-gray-500">{post?.date} · {post?.readTime}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-vulnscribe-dark">{post?.title}</h1>
            
            {post?.author && (
              <div className="flex items-center gap-3 mb-8 pb-8 border-b">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-medium">{post.author.name}</span>
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              {post?.content && renderContent(post.content)}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
