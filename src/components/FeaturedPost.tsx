
import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPostData } from '@/data/blog-posts';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

interface FeaturedPostProps {
  post: BlogPostData;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-white rounded-lg overflow-hidden border">
      <div className="lg:col-span-2 h-64 lg:h-auto">
        {post.imageSrc && (
          <img 
            src={post.imageSrc} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="lg:col-span-3 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <CategoryBadge category={post.category} />
            <span className="text-sm text-gray-500">{post.date} · {post.readTime}</span>
          </div>
          
          <Link to={`/blog/${post.id}`}>
            <h2 className="text-3xl font-bold mb-4 text-vulnscribe-dark hover:text-vulnscribe-purple transition-colors">
              {post.title}
            </h2>
          </Link>
          
          <p className="text-gray-600 text-lg mb-6">
            {post.excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{post.author.name}</span>
          </div>
          
          <Button asChild className="bg-vulnscribe-purple hover:bg-vulnscribe-lightpurple">
            <Link to={`/blog/${post.id}`} className="flex items-center gap-2">
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;
