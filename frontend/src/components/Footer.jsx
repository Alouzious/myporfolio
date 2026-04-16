import { Code2, UserCircle, MessageCircle, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap = {
  github: Code2,
  linkedin: UserCircle,
  twitter: MessageCircle,
  x: MessageCircle,
  website: Globe,
};

const fallbackLinks = [
  { id: 1, platform: 'GitHub', url: '#', icon: 'github' },
  { id: 2, platform: 'LinkedIn', url: '#', icon: 'linkedin' },
  { id: 3, platform: 'Twitter', url: '#', icon: 'twitter' },
];

const footerLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Credentials', to: '/credentials' },
  { label: 'Experience', to: '/experience' },
  { label: 'Skills', to: '/skills' },
  { label: 'Playground', to: '/playground' },
  { label: 'My Lab', to: '/my-lab' },
];

export default function Footer({ socialLinks, name }) {
  const links = socialLinks?.length ? socialLinks : fallbackLinks;
  const displayName = name || 'Developer';
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Code2 className="w-5 h-5" />
            <span>{displayName}</span>
          </Link>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-500 hover:text-blue-600 text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {links.map((link) => {
              const IconComponent = iconMap[(link.icon || link.platform || '').toLowerCase()] || Globe;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 border border-gray-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="flex items-center justify-center gap-1 text-slate-400 text-sm">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by {displayName}
          </p>
          <p className="text-slate-300 text-xs mt-1">
            &copy; {year} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
