import Experience from '../components/Experience';
import { Briefcase } from 'lucide-react';

export default function ExperiencePage({ experience }) {
  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-blue-100">
            <Briefcase className="w-4 h-4" />
            Professional Journey
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Experience</h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            My professional journey spanning software engineering, developer advocacy, speaking
            engagements, and community leadership.
          </p>
        </div>
      </section>
      <Experience experience={experience} />
    </main>
  );
}
