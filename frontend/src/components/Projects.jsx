import { useState } from 'react';
import { ExternalLink, Code2, FolderOpen, Star } from 'lucide-react';

const fallbackProjects = [
  {
    id: 1,
    title: 'AI Portfolio Assistant',
    description: 'An intelligent chatbot grounded in portfolio data to answer questions about skills, experience, and projects.',
    technologies: ['React', 'Rust', 'OpenAI', 'PostgreSQL'],
    category: 'AI/ML',
    featured: true,
    github_url: '#',
    live_url: '#',
  },
  {
    id: 2,
    title: 'Stellar DeFi App',
    description: 'Decentralized finance application built on Stellar blockchain with Soroban smart contracts.',
    technologies: ['Stellar', 'Soroban', 'React', 'TypeScript'],
    category: 'Blockchain',
    featured: true,
    github_url: '#',
    live_url: '#',
  },
  {
    id: 3,
    title: 'Full Stack Dashboard',
    description: 'Modern analytics dashboard with real-time data, authentication, and responsive design.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    category: 'Web Development',
    github_url: '#',
    live_url: '#',
  },
];

const categoryColors = {
  'AI/ML': 'bg-purple-100 text-purple-700',
  Blockchain: 'bg-orange-100 text-orange-700',
  'Web Development': 'bg-blue-100 text-blue-700',
  Other: 'bg-slate-100 text-slate-700',
};

export default function Projects({ projects, compact = false }) {
  const raw = projects?.length ? projects : fallbackProjects;

  // Normalize technologies field (can be string or array)
  const data = raw.map((p) => ({
    ...p,
    technologies:
      typeof p.technologies === 'string'
        ? p.technologies.split(',').map((t) => t.trim())
        : Array.isArray(p.technologies)
        ? p.technologies
        : [],
    category: p.category || 'Other',
  }));

  const allCategories = ['All', ...Array.from(new Set(data.map((p) => p.category)))];
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? data : data.filter((p) => p.category === activeFilter);
  const display = compact ? filtered.filter((p) => p.featured).slice(0, 3) : filtered;

  return (
    <section id="projects" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {compact ? 'Featured Projects' : 'Projects'}
          </h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-4" />
          {!compact && (
            <p className="text-slate-500 max-w-xl mx-auto">
              A selection of projects spanning AI, blockchain, and web development.
            </p>
          )}
        </div>

        {/* Filter tabs */}
        {!compact && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((project) => (
            <div
              key={project.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Image or placeholder */}
              {project.image_url ? (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
                  <FolderOpen className="w-10 h-10 text-blue-200 group-hover:text-blue-300 transition-colors" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        categoryColors[project.category] || categoryColors.Other
                      }`}
                    >
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <Star className="w-3 h-3 fill-amber-500" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-slate-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-slate-400">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  {project.github_url && project.github_url !== '#' && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm transition-colors font-medium"
                    >
                      <Code2 className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {project.live_url && project.live_url !== '#' && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 text-sm transition-colors font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
