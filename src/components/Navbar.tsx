import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${searchQuery}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-gradient-to-b from-black to-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <NavLink to="/" className="text-2xl font-bold text-white flex items-center">
            <span className="mr-1">❄️</span> 
            <span>Snow<span className="text-gray-300">TV</span></span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
            <NavLink to="/movies" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              Movies
            </NavLink>
            <NavLink to="/tv" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              TV Shows
            </NavLink>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input w-64"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <NavLink 
                to="/"
                className={({isActive}) => `py-2 ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/movies"
                className={({isActive}) => `py-2 ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </NavLink>
              <NavLink 
                to="/tv"
                className={({isActive}) => `py-2 ${isActive ? 'text-white font-semibold' : 'text-gray-300'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                TV Shows
              </NavLink>
              <form onSubmit={handleSearch} className="pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input w-full"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
