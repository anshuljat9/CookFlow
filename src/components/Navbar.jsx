import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart, User, Sun, Moon, ChevronDown } from 'lucide-react';
import Button from './Button';
import SearchBar from './SearchBar';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/kitchen', label: 'My Kitchen' },
  { path: '/import', label: 'Import Recipe' },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-charcoal-950/90 backdrop-blur-md shadow-card' : 'bg-transparent'}`}>
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-charcoal-900 dark:text-warm-100" aria-label="CookFlow Home">
            <span className="text-2xl" aria-hidden="true">🍳</span>
            <span>CookFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={(q) => q && console.log('Search:', q)}
              placeholder="Search recipes..."
              autoFocus={false}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/explore?favorites=true" className="hidden sm:flex p-2 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800 transition-colors duration-200" aria-label="Favorites">
              <Heart className="h-5 w-5" />
            </Link>

            <Link to="/profile" className="hidden sm:flex p-2 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800 transition-colors duration-200" aria-label="Profile">
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-warm-200 dark:border-charcoal-800 animate-slide-up">
            <div className="mb-4">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={(q) => q && console.log('Search:', q)}
                placeholder="Search recipes..."
              />
            </div>
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Link to="/explore?favorites=true" className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800">
                <Heart className="h-5 w-5" />
                <span>Favorites</span>
              </Link>
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-charcoal-600 hover:bg-warm-100 dark:text-warm-300 dark:hover:bg-charcoal-800">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}