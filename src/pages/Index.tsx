
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPostCard from '@/components/BlogPostCard';
import FeaturedPost from '@/components/FeaturedPost';
import { blogPosts } from '@/data/blog-posts';
import { Shield } from 'lucide-react';

const Index = () => {
  const featuredPost = blogPosts.find(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured).slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-r from-vulnscribe-dark to-vulnscribe-purple py-16 text-white">
          <div className="container">
            <div className="flex items-center justify-between flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Demystifying Web Security Vulnerabilities</h1>
                <p className="text-lg opacity-90 mb-8">
                  Dive deep into XSS, SQL injections, CSRF attacks, and more with our expert explanations and practical examples.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Shield className="h-5 w-5" />
                  <span>Updated with latest security research</span>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-end">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-white/20 w-full md:max-w-md">
                  <h3 className="font-semibold text-xl mb-4">Popular Vulnerability Categories</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span>Cross-Site Scripting (XSS)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>SQL Injection</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>Cross-Site Request Forgery (CSRF)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Insecure Direct Object References (IDOR)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured post section */}
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-vulnscribe-dark">Featured Article</h2>
            
            {featuredPost && <FeaturedPost post={featuredPost} />}
          </div>
        </section>
        
        {/* Recent posts section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8 text-vulnscribe-dark">Recent Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
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
          </div>
        </section>
        
        {/* Call to action section */}
        <section className="py-16 bg-vulnscribe-softpurple">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4 text-vulnscribe-dark">Stay Updated with Security Insights</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
              Subscribe to our newsletter to receive the latest articles and updates on web security vulnerabilities.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-md w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vulnscribe-purple"
              />
              <button className="px-6 py-3 bg-vulnscribe-purple text-white rounded-md font-medium hover:bg-vulnscribe-lightpurple transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
