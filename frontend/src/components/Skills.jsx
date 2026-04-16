import { Layers } from 'lucide-react';

const fallbackSkills = [
  { id: 1, name: 'React', category: 'Frontend', proficiency: 90 },
  { id: 2, name: 'JavaScript', category: 'Frontend', proficiency: 85 },
  { id: 3, name: 'Node.js', category: 'Backend', proficiency: 80 },
  { id: 4, name: 'Python', category: 'Backend', proficiency: 75 },
  { id: 5, name: 'Docker', category: 'DevOps', proficiency: 70 },
];

export default function Skills({ skills }) {
  const data = skills?.length ? skills : fallbackSkills;

  // Group by category
  const grouped = data.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Skills</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div
              key={category}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-300"
            >
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-100 mb-6">
                <Layers className="w-5 h-5 text-cyan-400" />
                {category}
              </h3>
              <div className="space-y-4">
                {items.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-sm font-medium">{skill.name}</span>
                      <span className="text-gray-500 text-sm">{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
