import {
  Layout,
  Server,
  Database,
  Brain,
  Link as LinkIcon,
  Code2,
  Wrench,
  Cloud,
  Plug,
  Layers,
} from 'lucide-react';

const categoryIcons = {
  Frontend: Layout,
  Backend: Server,
  Databases: Database,
  'AI/ML': Brain,
  'Web3/Blockchain': LinkIcon,
  Languages: Code2,
  Tools: Wrench,
  DevOps: Cloud,
  APIs: Plug,
  Other: Layers,
};

const categoryColors = {
  Frontend: 'bg-blue-50 text-blue-700 border-blue-200',
  Backend: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Databases: 'bg-amber-50 text-amber-700 border-amber-200',
  'AI/ML': 'bg-purple-50 text-purple-700 border-purple-200',
  'Web3/Blockchain': 'bg-orange-50 text-orange-700 border-orange-200',
  Languages: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Tools: 'bg-slate-50 text-slate-700 border-slate-200',
  DevOps: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  APIs: 'bg-pink-50 text-pink-700 border-pink-200',
  Other: 'bg-gray-50 text-gray-700 border-gray-200',
};

const fallbackSkills = [
  { id: 1, name: 'React', category: 'Frontend', proficiency: 90 },
  { id: 2, name: 'TypeScript', category: 'Frontend', proficiency: 85 },
  { id: 3, name: 'Tailwind CSS', category: 'Frontend', proficiency: 88 },
  { id: 4, name: 'JavaScript', category: 'Frontend', proficiency: 90 },
  { id: 5, name: 'Node.js', category: 'Backend', proficiency: 80 },
  { id: 6, name: 'Python', category: 'Backend', proficiency: 85 },
  { id: 7, name: 'Rust', category: 'Backend', proficiency: 75 },
  { id: 8, name: 'Django', category: 'Backend', proficiency: 78 },
  { id: 9, name: 'PostgreSQL', category: 'Databases', proficiency: 80 },
  { id: 10, name: 'Neon', category: 'Databases', proficiency: 75 },
  { id: 11, name: 'TensorFlow', category: 'AI/ML', proficiency: 70 },
  { id: 12, name: 'AI Integration', category: 'AI/ML', proficiency: 80 },
  { id: 13, name: 'Stellar', category: 'Web3/Blockchain', proficiency: 72 },
  { id: 14, name: 'Soroban', category: 'Web3/Blockchain', proficiency: 68 },
  { id: 15, name: 'Solidity', category: 'Web3/Blockchain', proficiency: 65 },
  { id: 16, name: 'Python', category: 'Languages', proficiency: 85 },
  { id: 17, name: 'Rust', category: 'Languages', proficiency: 75 },
  { id: 18, name: 'JavaScript', category: 'Languages', proficiency: 90 },
  { id: 19, name: 'Docker', category: 'DevOps', proficiency: 75 },
  { id: 20, name: 'Vercel', category: 'DevOps', proficiency: 85 },
  { id: 21, name: 'Git', category: 'Tools', proficiency: 90 },
  { id: 22, name: 'REST APIs', category: 'APIs', proficiency: 88 },
];

export default function Skills({ skills }) {
  const data = skills?.length ? skills : fallbackSkills;

  const grouped = data.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Skills & Technologies</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-500 max-w-xl mx-auto">
            A comprehensive overview of my technical toolkit across multiple domains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([category, items]) => {
            const Icon = categoryIcons[category] || Layers;
            const colorClass = categoryColors[category] || categoryColors.Other;

            return (
              <div
                key={category}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <div key={skill.id} className="group relative">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${colorClass} cursor-default`}
                      >
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Proficiency bar for the category (average) */}
                {items.some((s) => s.proficiency) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                      <span>Avg. proficiency</span>
                      <span>
                        {Math.round(items.reduce((s, i) => s + (i.proficiency || 0), 0) / items.length)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-700"
                        style={{
                          width: `${Math.round(items.reduce((s, i) => s + (i.proficiency || 0), 0) / items.length)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
