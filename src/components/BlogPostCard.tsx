
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export interface BlogPostProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  imageSrc?: string;
  featured?: boolean;
}

const BlogPostCard: React.FC<BlogPostProps> = ({
  id,
  title,
  excerpt,
  category,
  date,
  readTime,
  imageSrc,
  featured = false,
}) => {
  return (
    <Card className={`overflow-hidden card-hover-effect ${featured ? 'border-vulnscribe-purple' : ''}`}>
      {imageSrc && (
        <div className="h-48 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-vulnscribe-softpurple text-vulnscribe-purple">
            {category}
          </Badge>
          <div className="text-sm text-gray-500">
            {date} · {readTime}
          </div>
        </div>
        <Link to={`/blog/${id}`}>
          <h3 className={`font-bold ${featured ? 'text-2xl' : 'text-xl'} text-vulnscribe-dark hover:text-vulnscribe-purple mt-2 transition-colors`}>
            {title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" asChild className="text-vulnscribe-purple hover:text-vulnscribe-purple hover:bg-vulnscribe-softpurple px-0">
          <Link to={`/blog/${id}`} className="flex items-center gap-2">
            Read more <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
