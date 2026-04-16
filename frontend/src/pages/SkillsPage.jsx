import Skills from '../components/Skills';
import { Cpu } from 'lucide-react';

export default function SkillsPage({ skills }) {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-50 text-cyan-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-cyan-100">
            <Cpu className="w-4 h-4" />
            Technical Expertise
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Skills</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            My comprehensive technical toolkit across frontend, backend, AI/ML, blockchain,
            and everything in between.
          </p>
        </div>
      </section>
      <Skills skills={skills} />
    </main>
  );
}
