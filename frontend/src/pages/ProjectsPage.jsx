import { Link } from 'react-router-dom';
import Projects from '../components/Projects';
import { ArrowLeft } from 'lucide-react';

export default function ProjectsPage({ projects }) {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Projects</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            A curated showcase of my work spanning AI/ML, blockchain, and web development.
            Each project reflects my commitment to building scalable, impactful software.
          </p>
        </div>
      </div>
      <Projects projects={projects} />
    </main>
  );
}
