import { Link } from 'react-router-dom';
import { Heart, Sparkles, Share2, MessageSquare, Video, Globe } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Explore Recipes', path: '/explore' },
    { label: 'My Kitchen', path: '/kitchen' },
    { label: 'Import Recipe', path: '/import' },
    { label: 'Cook Mode', path: '/cook/1' },
  ],
  company: [
    { label: 'About Us', path: '#' },
    { label: 'How It Works', path: '#' },
    { label: 'Careers', path: '#' },
    { label: 'Blog', path: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', path: '#' },
    { label: 'Terms of Service', path: '#' },
    { label: 'Cookie Policy', path: '#' },
  ],
  support: [
    { label: 'Help Center', path: '#' },
    { label: 'Contact Us', path: '#' },
    { label: 'FAQ', path: '#' },
  ],
};

const socialLinks = [
  { icon: MessageSquare, label: 'Community', href: '#' },
  { icon: Share2, label: 'Share', href: '#' },
  { icon: Video, label: 'Videos', href: '#' },
  { icon: Globe, label: 'Website', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-warm-100 dark:bg-charcoal-900 border-t border-warm-200 dark:border-charcoal-800" role="contentinfo">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-charcoal-900 dark:text-warm-100 mb-4" aria-label="CookFlow Home">
              <span className="text-3xl" aria-hidden="true">🍳</span>
              <span>CookFlow</span>
            </Link>
            <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mb-6 max-w-xs">
              From scroll to plate. Turn food inspiration into recipes you can actually cook.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-600 hover:bg-warm-200 dark:hover:bg-charcoal-800 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Product</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.product.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-charcoal-500 dark:text-charcoal-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Company</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-charcoal-500 dark:text-charcoal-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Legal</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-charcoal-500 dark:text-charcoal-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal-900 dark:text-warm-100 mb-4">Support</h3>
            <ul className="space-y-3" role="list">
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-charcoal-500 dark:text-charcoal-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-warm-200 dark:border-charcoal-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-charcoal-500 dark:text-charcoal-400">
              © {new Date().getFullYear()} CookFlow. Made with <Heart className="h-4 w-4 text-red-500 fill-current inline" aria-hidden="true" /> for food lovers everywhere.
            </p>
            <div className="flex items-center gap-6 text-sm text-charcoal-500 dark:text-charcoal-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary-500" aria-hidden="true" />
                Part 1 - Frontend Foundation
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}