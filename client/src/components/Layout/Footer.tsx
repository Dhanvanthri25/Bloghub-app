import React from 'react';
import { Heart, Edit3 } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Description */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center space-x-2 text-xl font-bold text-primary-600 dark:text-primary-400">
              <Edit3 className="h-6 w-6" />
              <span>BlogApp</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center md:text-left">
              Share your stories with the world
            </p>
          </div>

          {/* Copyright */}
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 text-sm">
            <span>© {currentYear} BlogApp. Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>using MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;