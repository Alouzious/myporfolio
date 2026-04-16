import { ExternalLink, Code2, FolderOpen } from 'lucide-react';

const fallbackProjects = [
  {
    id: 1,
    title: 'Project One',
    description: 'A modern web application built with cutting-edge technologies.',
    technologies: 'React, Node.js, PostgreSQL',
    github_url: '#',
    live_url: '#',
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'An innovative solution for everyday problems.',
    technologies: 'Python, FastAPI, Docker',
    github_url: '#',
    live_url: '#',
  },
];

export default function Projects({ projects }) {
  const data = projects?.length ? projects : fallbackProjects;

  return (
    <section id="projects" className="py-20 px-6 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Projects</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((project) => {
            const techs = project.technologies
              ? project.technologies.split(',').map((t) => t.trim())
              : [];

            return (
              <div
                key={project.id}
                className="group bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5"
              >
                {/* Image or placeholder */}
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-800/50 flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-gray-700 group-hover:text-cyan-500/30 transition-colors" />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  {techs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-800">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                      >
                        <Code2 className="w-4 h-4" />
                        Code
                      </a>
                    )}
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
