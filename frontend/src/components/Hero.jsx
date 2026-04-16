import { ArrowDown, FileText, Send } from 'lucide-react';

export default function Hero({ about }) {
  const name = about?.name || 'Developer';
  const profession = about?.profession || 'Full Stack Developer';

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Gradient background effects */}
      <div className="absolute inset-0 bg-gray-950" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <p className="text-cyan-400 font-medium mb-4 tracking-wide uppercase text-sm">
          Welcome to my portfolio
        </p>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6 leading-tight">
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {name}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-4 font-light">{profession}</p>
        <p className="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Crafting elegant digital experiences with clean code and modern technologies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
          >
            <Send className="w-4 h-4" />
            Get In Touch
          </a>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 font-medium px-8 py-3 rounded-lg transition-all duration-300"
          >
            <FileText className="w-4 h-4" />
            View Projects
          </a>
        </div>

        <a
          href="#about"
          className="inline-block mt-16 text-gray-600 hover:text-cyan-400 transition-colors animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-6 h-6" />
        </a>
      </div>
    </section>
  );
}
