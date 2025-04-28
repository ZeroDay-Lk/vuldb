
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blog-posts';
import { Shield } from 'lucide-react';

interface CategoryData {
  name: string;
  slug: string;
  count: number;
  description: string;
  icon: React.ReactNode;
}

const Categories = () => {
  // Get all categories from blog posts
  const categoryCounts: Record<string, number> = {};
  
  blogPosts.forEach(post => {
    const category = post.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  
  const categories: CategoryData[] = [
    {
      name: 'Cross-Site Scripting (XSS)',
      slug: 'xss',
      count: categoryCounts['XSS'] || 0,
      description: 'Learn about vulnerabilities that allow attackers to inject malicious scripts into web pages viewed by users.',
      icon: <Shield className="h-8 w-8 text-red-500" />
    },
    {
      name: 'SQL Injection',
      slug: 'sql-injection',
      count: categoryCounts['SQL Injection'] || 0,
      description: 'Explore techniques that exploit vulnerabilities in database layer code to gain unauthorized access.',
      icon: <Shield className="h-8 w-8 text-blue-500" />
    },
    {
      name: 'Cross-Site Request Forgery (CSRF)',
      slug: 'csrf',
      count: categoryCounts['CSRF'] || 0,
      description: 'Discover how attackers can force users to execute unwanted actions on web applications.',
      icon: <Shield className="h-8 w-8 text-orange-500" />
    },
    {
      name: 'Insecure Direct Object References (IDOR)',
      slug: 'idor',
      count: categoryCounts['IDOR'] || 0,
      description: 'Learn about vulnerabilities that occur when applications expose references to internal implementation objects.',
      icon: <Shield className="h-8 w-8 text-green-500" />
    },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header section */}
        <section className="bg-vulnscribe-dark text-white py-16">
          <div className="container">
            <h1 className="text-4xl font-bold mb-6">Vulnerability Categories</h1>
            <p className="text-lg max-w-2xl opacity-90">
              Browse our comprehensive collection of articles organized by security vulnerability types.
              Each category focuses on specific attack vectors, prevention methods, and real-world examples.
            </p>
          </div>
        </section>
        
        {/* Categories grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <Link 
                  key={category.slug} 
                  to={`/category/${category.slug}`}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">{category.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-vulnscribe-purple transition-colors">
                        {category.name}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({category.count} {category.count === 1 ? 'article' : 'articles'})
                        </span>
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Additional categories info */}
            <div className="mt-16 bg-vulnscribe-softpurple p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">More Categories Coming Soon</h2>
              <p className="text-gray-700 mb-6">
                We're constantly expanding our library with new vulnerability types and security topics.
                Check back soon for additional categories including:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  Authentication Flaws
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  XML External Entities (XXE)
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  Security Misconfigurations
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  Sensitive Data Exposure
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  Broken Access Control
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-vulnscribe-purple"></div>
                  Server-Side Request Forgery
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Categories;
