
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'xss':
      return 'bg-red-100 text-red-700 hover:bg-red-200';
    case 'sql injection':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
    case 'csrf':
      return 'bg-orange-100 text-orange-700 hover:bg-orange-200';
    case 'idor':
      return 'bg-green-100 text-green-700 hover:bg-green-200';
    default:
      return 'bg-vulnscribe-softpurple text-vulnscribe-purple hover:bg-vulnscribe-purple/20';
  }
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const categoryColor = getCategoryColor(category);
  
  return (
    <Link to={`/category/${category.toLowerCase().replace(' ', '-')}`}>
      <span 
        className={cn(
          "px-3 py-1 rounded-full text-xs font-medium transition-colors",
          categoryColor,
          className
        )}
      >
        {category}
      </span>
    </Link>
  );
};

export default CategoryBadge;
