import { useState } from 'react';
import { FlaskConical, BookOpen, Search, Tag, ExternalLink, Brain, Cpu, Globe } from 'lucide-react';

const fallbackResearch = [
  {
    id: 1,
    title: 'Large Language Models in Production',
    description: 'Exploring practical techniques for deploying and fine-tuning LLMs for real-world applications.',
    category: 'AI/ML',
    paper_url: null,
  },
  {
    id: 2,
    title: 'Zero-Knowledge Proofs',
    description: 'Understanding ZK-proof systems and their applications in privacy-preserving blockchain protocols.',
    category: 'Blockchain',
    paper_url: null,
  },
  {
    id: 3,
    title: 'Rust for Systems Programming',
    description: 'Deep dive into Rust memory safety model, ownership, and async runtimes like Tokio.',
    category: 'Systems',
    paper_url: null,
  },
  {
    id: 4,
    title: 'Distributed System Patterns',
    description: 'CAP theorem, eventual consistency, and architectural patterns for large-scale distributed systems.',
    category: 'Architecture',
    paper_url: null,
  },
];

const fallbackReadings = [
  {
    id: 1,
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    description: 'The definitive guide to modern distributed systems and data engineering.',
    category: 'Engineering',
  },
  {
    id: 2,
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    description: 'Timeless wisdom and practical techniques for software craftspeople.',
    category: 'Engineering',
  },
  {
    id: 3,
    title: 'Zero to One',
    author: 'Peter Thiel',
    description: 'Notes on startups, innovation, and how to build the future.',
    category: 'Entrepreneurship',
  },
  {
    id: 4,
    title: 'Attention Is All You Need',
    author: 'Vaswani et al.',
    description: 'The original transformer paper that revolutionized NLP and AI.',
    category: 'Research Paper',
  },
];

const labTopics = [
  { Icon: Brain, label: 'AI & ML', desc: 'LLMs, neural networks, prompt engineering, AI agents' },
  { Icon: Cpu, label: 'Systems Engineering', desc: 'Rust, async runtimes, performance optimization' },
  { Icon: Globe, label: 'Web3 & DeFi', desc: 'Stellar, Soroban, smart contracts, tokenomics' },
  { Icon: FlaskConical, label: 'Distributed Systems', desc: 'Consensus algorithms, scalability, reliability' },
];

const categoryColors = {
  'AI/ML': 'bg-purple-100 text-purple-700',
  Blockchain: 'bg-orange-100 text-orange-700',
  Systems: 'bg-slate-100 text-slate-700',
  Architecture: 'bg-blue-100 text-blue-700',
  Engineering: 'bg-emerald-100 text-emerald-700',
  Entrepreneurship: 'bg-amber-100 text-amber-700',
  'Research Paper': 'bg-pink-100 text-pink-700',
};

export default function MyLabPage({ research, readings }) {
  const researchData = research?.length ? research : fallbackResearch;
  const readingsData = readings?.length ? readings : fallbackReadings;

  const [searchQuery, setSearchQuery] = useState('');

  const allItems = [
    ...researchData.map((r) => ({ ...r, type: 'Research' })),
    ...readingsData.map((r) => ({ ...r, type: 'Reading' })),
  ];

  const filtered = searchQuery
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.author || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-emerald-100">
            <FlaskConical className="w-4 h-4" />
            Research & Learning
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">My Lab</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            A curated intellectual space for research interests, books I'm reading, concepts I'm
            exploring, and technologies I'm curious about. This is where ideas live.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Topics I explore */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Areas of Exploration</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {labTopics.map((topic) => {
              const TopicIcon = topic.Icon;
              return (
                <div
                  key={topic.label}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                    <TopicIcon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-sm">{topic.label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{topic.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Search */}
        <div className="mb-10">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search research, books, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Search results */}
        {filtered && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((item) => (
                <LabCard key={`${item.type}-${item.id}`} item={item} />
              ))}
            </div>
          </div>
        )}

        {!filtered && (
          <>
            {/* Research interests */}
            <section className="mb-14">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Research Interests</h2>
                  <p className="text-slate-500 text-sm">Topics I'm actively studying and exploring</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {researchData.map((item) => (
                  <LabCard key={item.id} item={{ ...item, type: 'Research' }} />
                ))}
              </div>
            </section>

            {/* Reading list */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Reading List</h2>
                  <p className="text-slate-500 text-sm">Books and papers shaping my thinking</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                {readingsData.map((item) => (
                  <LabCard key={item.id} item={{ ...item, type: 'Reading' }} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function LabCard({ item }) {
  const categoryColor =
    categoryColors[item.category] || 'bg-gray-100 text-gray-700';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-3 gap-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}
        >
          {item.category || item.type}
        </span>
        <span className="text-xs text-slate-400 font-medium">{item.type}</span>
      </div>

      <h3 className="font-semibold text-slate-900 mb-1 text-sm leading-snug">{item.title}</h3>

      {item.author && (
        <p className="text-xs text-blue-600 font-medium mb-2">by {item.author}</p>
      )}

      {item.description && (
        <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-3">
          {item.description}
        </p>
      )}

      {(item.paper_url || item.book_url) && (
        <a
          href={item.paper_url || item.book_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Learn More
        </a>
      )}
    </div>
  );
}
