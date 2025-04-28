
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog-posts';
import CategoryBadge from '@/components/CategoryBadge';
import BlogPostCard from '@/components/BlogPostCard';
import CodeBlock from '@/components/CodeBlock';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { postId } = useParams<{ postId: string }>();
  const post = blogPosts.find(p => p.id === postId);
  
  // Get related posts based on category (excluding current post)
  const relatedPosts = blogPosts
    .filter(p => p.id !== postId && p.category === post?.category)
    .slice(0, 3);
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <p className="mb-4">The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="text-vulnscribe-purple hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  // Function to parse and render content with code blocks
  const renderContent = (content: string) => {
    const parts = content.split('```');
    
    return parts.map((part, index) => {
      // Even indices are regular markdown text
      if (index % 2 === 0) {
        // Simple markdown parsing for headings and paragraphs
        return part
          .split('\n')
          .map((line, lineIndex) => {
            if (line.startsWith('# ')) {
              return <h1 key={lineIndex} className="text-3xl font-bold mt-8 mb-4 prose-headings">{line.substring(2)}</h1>;
            } else if (line.startsWith('## ')) {
              return <h2 key={lineIndex} className="text-2xl font-bold mt-6 mb-3 prose-headings">{line.substring(3)}</h2>;
            } else if (line.startsWith('### ')) {
              return <h3 key={lineIndex} className="text-xl font-bold mt-5 mb-2 prose-headings">{line.substring(4)}</h3>;
            } else if (line.trim().length > 0) {
              return <p key={lineIndex} className="my-4 text-gray-700">{line}</p>;
            }
            return null;
          });
      } else {
        // Odd indices are code blocks
        const codeLines = part.split('\n');
        let language = 'javascript';
        let code = part;
        
        // Extract language if specified
        if (codeLines.length > 0) {
          language = codeLines[0].trim();
          code = codeLines.slice(1).join('\n');
        }
        
        return <CodeBlock key={index} language={language}>{code}</CodeBlock>;
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-vulnscribe-purple hover:text-vulnscribe-lightpurple mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
          
          {/* Post header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <CategoryBadge category={post.category} />
              <span className="text-gray-500">
                {post.date} · {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 text-vulnscribe-dark">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-4">
              <img 
                src={post.author.avatar}
                alt={post.author.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-gray-500">Security Researcher</p>
              </div>
            </div>
          </div>
          
          {/* Featured image */}
          {post.imageSrc && (
            <div className="mb-10">
              <img
                src={post.imageSrc}
                alt={post.title}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            </div>
          )}
          
          {/* Post content */}
          <div className="max-w-3xl mx-auto">
            <article className="mb-16">
              {renderContent(post.content)}
            </article>
          </div>
          
          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t pt-12">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogPostCard
                    key={relatedPost.id}
                    id={relatedPost.id}
                    title={relatedPost.title}
                    excerpt={relatedPost.excerpt}
                    category={relatedPost.category}
                    date={relatedPost.date}
                    readTime={relatedPost.readTime}
                    imageSrc={relatedPost.imageSrc}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
