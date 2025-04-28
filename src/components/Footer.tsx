
import React from 'react';
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-vulnscribe-dark text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-vulnscribe-lightpurple" />
              <span className="text-xl font-bold text-white">VulnScribe</span>
            </Link>
            <p className="mt-4 text-gray-300">
              Exploring the world of cybersecurity vulnerabilities with in-depth analysis and simplified explanations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/category/xss" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">XSS</Link></li>
              <li><Link to="/category/sql-injection" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">SQL Injection</Link></li>
              <li><Link to="/category/csrf" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">CSRF</Link></li>
              <li><Link to="/category/idor" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">IDOR</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-vulnscribe-lightpurple transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} VulnScribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
