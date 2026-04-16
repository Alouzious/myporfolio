import { Code2, UserCircle, MessageCircle, Globe, Heart, Link as LinkIcon } from 'lucide-react';

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

export default function Footer({ socialLinks, name }) {
  const links = socialLinks?.length ? socialLinks : fallbackLinks;
  const displayName = name || 'Developer';
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 px-6 bg-gray-900/50 border-t border-gray-800/50">
      <div className="max-w-6xl mx-auto text-center">
        {/* Social links */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {links.map((link) => {
            const IconComponent = iconMap[(link.icon || link.platform || '').toLowerCase()] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all duration-300"
              >
                <IconComponent className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        <p className="flex items-center justify-center gap-1 text-gray-500 text-sm">
          Built with <Heart className="w-3.5 h-3.5 text-red-500" /> by {displayName}
        </p>
        <p className="text-gray-600 text-xs mt-2">
          &copy; {year} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
