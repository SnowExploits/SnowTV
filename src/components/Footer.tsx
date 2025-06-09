import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="text-xl font-bold text-white flex items-center">
              <span className="mr-1">❄️</span>
              <span>Snow<span className="text-gray-300">TV</span></span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Ad-free movie and TV experience</p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex items-center mb-2">
              <span className="text-gray-400 text-sm mr-2">Made with</span>
              <Heart size={16} className="text-white fill-white" />
            </div>
            <p className="text-gray-500 text-xs">© {currentYear} SnowTV. All rights reserved.</p>
            <p className="text-gray-600 text-xs mt-1">This site does not store any files on its server.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
