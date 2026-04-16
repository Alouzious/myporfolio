import { Calendar, Building2, Circle, MapPin } from 'lucide-react';

const fallbackExperience = [
  {
    id: 1,
    company: 'Tech Company',
    role: 'Senior Developer',
    description: 'Led development of key features and mentored junior developers.',
    start_date: '2022-01-01',
    end_date: null,
    is_current: true,
    location: 'Remote',
    category: 'Work',
  },
  {
    id: 2,
    company: 'Startup Inc.',
    role: 'Full Stack Developer',
    description: 'Built and maintained web applications from the ground up.',
    start_date: '2020-03-01',
    end_date: '2021-12-31',
    is_current: false,
    location: 'Remote',
    category: 'Work',
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
    <section id="experience" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Experience</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          {data.map((item) => (
            <div key={item.id} className="relative flex items-start mb-10 pl-16">
              {/* Dot */}
              <div className="absolute left-6 -translate-x-1/2 z-10 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow" />
              </div>

              {/* Card */}
              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-blue-600 text-sm font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(item.start_date)} — {item.is_current ? 'Present' : formatDate(item.end_date)}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-slate-400 text-sm">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </span>
                  )}
                  {item.category && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {item.category}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{item.role}</h3>

                <p className="flex items-center gap-1.5 text-slate-500 text-sm mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  {item.company}
                </p>

                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>

                {item.is_current && (
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Circle className="w-2 h-2 fill-emerald-500" />
                    Current Position
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
