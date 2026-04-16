import { Calendar, Building2, Circle } from 'lucide-react';

const fallbackExperience = [
  {
    id: 1,
    company: 'Tech Company',
    role: 'Senior Developer',
    description: 'Led development of key features and mentored junior developers.',
    start_date: '2022-01-01',
    end_date: null,
    is_current: true,
  },
  {
    id: 2,
    company: 'Startup Inc.',
    role: 'Full Stack Developer',
    description: 'Built and maintained web applications from the ground up.',
    start_date: '2020-03-01',
    end_date: '2021-12-31',
    is_current: false,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return 'Present';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Experience({ experience }) {
  const data = experience?.length ? experience : fallbackExperience;

  return (
    <section id="experience" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Experience</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-800" />

          {data.map((item, index) => (
            <div
              key={item.id}
              className={`relative flex flex-col md:flex-row items-start mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div className="w-4 h-4 rounded-full bg-cyan-500 border-4 border-gray-950 shadow-lg shadow-cyan-500/30" />
              </div>

              {/* Card */}
              <div
                className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? 'md:mr-auto md:pr-0 md:pl-0' : 'md:ml-auto md:pl-0 md:pr-0'
                }`}
              >
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium mb-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(item.start_date)} — {item.is_current ? 'Present' : formatDate(item.end_date)}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-100 mb-1">{item.role}</h3>

                  <p className="flex items-center gap-1.5 text-gray-400 text-sm mb-3">
                    <Building2 className="w-3.5 h-3.5" />
                    {item.company}
                  </p>

                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>

                  {item.is_current && (
                    <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-green-400">
                      <Circle className="w-2 h-2 fill-green-400" />
                      Current Position
                    </span>
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
