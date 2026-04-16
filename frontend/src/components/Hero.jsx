import { ArrowRight, Download, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const RESUME_URL = import.meta.env.VITE_RESUME_URL || '#';

export default function Hero({ about }) {
  const name = about?.name || 'Developer';
  const profession = about?.profession || 'Full Stack Developer';

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white pt-16"
    >
      {/* Subtle background decoration */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 font-medium px-4 py-1.5 rounded-full text-sm mb-6 border border-blue-100">
          <Briefcase className="w-3.5 h-3.5" />
          Available for new opportunities
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {name}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-4 font-light">{profession}</p>
        <p className="text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed text-lg">
          I build intelligent systems, scalable apps, and modern digital products using AI, Rust,
          React, backend engineering, and Web3 technologies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
          >
            View Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={RESUME_URL}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: '3+', label: 'Years Building' },
            { value: '20+', label: 'Projects Shipped' },
            { value: '5+', label: 'Tech Domains' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
