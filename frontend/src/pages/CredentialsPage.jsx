import { Award, Download, ExternalLink, BookOpen, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const RESUME_URL = import.meta.env.VITE_RESUME_URL || '#';

const fallbackAchievements = [
  {
    id: 1,
    title: 'AWS Certified Developer',
    description: 'Demonstrated expertise in developing and maintaining AWS-based applications.',
    date_achieved: '2023-06-01',
    certificate_url: '#',
    type: 'Certification',
    issuer: 'Amazon Web Services',
  },
  {
    id: 2,
    title: 'Full-Stack Web Development',
    description: 'Comprehensive course covering React, Node.js, databases, and deployment.',
    date_achieved: '2022-12-01',
    certificate_url: '#',
    type: 'Course',
    issuer: 'freeCodeCamp',
  },
  {
    id: 3,
    title: 'Blockchain Developer Certification',
    description: 'Certified in developing smart contracts and decentralized applications on Stellar.',
    date_achieved: '2023-09-01',
    certificate_url: '#',
    type: 'Certification',
    issuer: 'Stellar Development Foundation',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const typeColors = {
  Certification: 'bg-blue-50 text-blue-700 border-blue-200',
  Course: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Achievement: 'bg-amber-50 text-amber-700 border-amber-200',
  Award: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function CredentialsPage({ achievements }) {
  const data = achievements?.length ? achievements : fallbackAchievements;

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <Award className="w-4 h-4" />
            Credentials & Achievements
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Credentials</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Certifications, courses, and achievements that demonstrate my expertise and commitment
            to continuous learning across AI, blockchain, and full-stack development.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Resume download card */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-16 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Download My Resume</h2>
              <p className="text-blue-100">
                Get a comprehensive overview of my experience, skills, and achievements in one document.
              </p>
            </div>
            <a
              href={RESUME_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </a>
          </div>
        </div>

        {/* Credentials grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Certificates & Achievements</h2>
          <p className="text-slate-500">
            {data.length} credential{data.length !== 1 ? 's' : ''} earned
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {data.map((item) => {
            const colorClass = typeColors[item.type] || typeColors.Achievement;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  {item.type && (
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}
                    >
                      {item.type}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>

                {item.issuer && (
                  <p className="text-sm text-blue-600 font-medium mb-2">{item.issuer}</p>
                )}

                {item.date_achieved && (
                  <p className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.date_achieved)}
                  </p>
                )}

                <p className="text-slate-500 text-sm leading-relaxed flex-1">{item.description}</p>

                {item.certificate_url && item.certificate_url !== '#' && (
                  <a
                    href={item.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Certificate
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Technical writing section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Technical Writing</h2>
              <p className="text-slate-500 text-sm">Articles and insights on AI, blockchain, and engineering</p>
            </div>
          </div>
          <p className="text-slate-600 mb-6">
            I write about AI, machine learning, blockchain technology, backend engineering, and modern
            web development. My articles aim to share practical insights and deep technical knowledge.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Read My Articles
          </a>
        </div>
      </div>
    </main>
  );
}
