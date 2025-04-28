
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Search } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-white py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-vulnscribe-purple" />
          <span className="text-xl font-bold text-vulnscribe-dark">VulnScribe</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-vulnscribe-purple transition-colors">Home</Link>
            <Link to="/categories" className="text-gray-600 hover:text-vulnscribe-purple transition-colors">Categories</Link>
            <Link to="/about" className="text-gray-600 hover:text-vulnscribe-purple transition-colors">About</Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button className="bg-vulnscribe-purple hover:bg-vulnscribe-lightpurple">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
