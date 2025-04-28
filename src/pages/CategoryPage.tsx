
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/BlogPostCard';
import { blogPosts } from '@/data/blog-posts';
import { ArrowLeft } from 'lucide-react';

const getCategoryName = (slug: string): string => {
  switch (slug) {
    case 'xss':
      return 'Cross-Site Scripting (XSS)';
    case 'sql-injection':
      return 'SQL Injection';
    case 'csrf':
      return 'Cross-Site Request Forgery (CSRF)';
    case 'idor':
      return 'Insecure Direct Object References (IDOR)';
    default:
      return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
};

const getCategoryDescription = (slug: string): string => {
  switch (slug) {
    case 'xss':
      return 'Cross-Site Scripting (XSS) attacks are a type of injection where malicious scripts are injected into trusted websites. Learn how to identify and prevent these vulnerabilities.';
    case 'sql-injection':
      return 'SQL Injection is a code injection technique that exploits security vulnerabilities in an application\'s software by inserting malicious SQL statements into entry fields for execution.';
    case 'csrf':
      return 'Cross-Site Request Forgery (CSRF) is an attack that forces authenticated users to execute unwanted actions on a web application in which they are currently logged in.';
    case 'idor':
      return 'Insecure Direct Object References (IDOR) occur when an application provides direct access to objects based on user-supplied input without proper authorization checks.';
    default:
      return 'Explore our articles on this important security topic.';
  }
};

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  if (!categorySlug) {
    return null;
  }
  
  const categoryName = getCategoryName(categorySlug);
  const categoryDescription = getCategoryDescription(categorySlug);
  
  // Filter posts by category
  const categoryPosts = blogPosts.filter(post => {
    const postCategorySlug = post.category.toLowerCase().replace(' ', '-');
    return postCategorySlug === categorySlug;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-vulnscribe-softpurple py-16">
          <div className="container">
            <Link to="/" className="inline-flex items-center gap-2 text-vulnscribe-purple hover:text-vulnscribe-lightpurple mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to homepage
            </Link>
            
            <h1 className="text-3xl font-bold mb-4 text-vulnscribe-dark">{categoryName}</h1>
            <p className="text-lg text-gray-700 max-w-3xl">
              {categoryDescription}
            </p>
          </div>
        </div>
        
        <div className="container py-16">
          {categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryPosts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category}
                  date={post.date}
                  readTime={post.readTime}
                  imageSrc={post.imageSrc}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                We haven't published any articles in this category yet. Check back soon!
              </p>
              <Link 
                to="/" 
                className="text-vulnscribe-purple hover:text-vulnscribe-lightpurple underline"
              >
                Return to homepage
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
