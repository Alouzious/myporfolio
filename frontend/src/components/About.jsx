import { User, Briefcase, Cpu, Globe, Code2 } from 'lucide-react';

const focusAreas = [
  { Icon: Cpu, title: 'AI / Machine Learning', desc: 'Building intelligent systems and integrating AI into applications' },
  { Icon: Globe, title: 'Blockchain / Web3', desc: 'Stellar, Soroban smart contracts, and decentralized apps' },
  { Icon: Code2, title: 'Backend Systems', desc: 'Rust, Python, Node.js — scalable and reliable server-side engineering' },
  { Icon: Briefcase, title: 'Full-Stack Web', desc: 'React frontends paired with robust APIs and modern databases' },
];

export default function About({ about }) {
  const name = about?.name || 'Developer';
  const profession = about?.profession || 'Full Stack Developer';
  const description =
    about?.description ||
    'Passionate developer with a love for building modern web applications and solving complex problems with elegant solutions.';
  const imageUrl = about?.image_url;

  return (
    <section id="about" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Me</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Image / Avatar */}
          <div className="flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-72 h-72 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-72 h-72 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-lg">
                <User className="w-24 h-24 text-slate-300" />
              </div>
            )}
          </div>

          {/* Text content */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{name}</h3>
            <p className="flex items-center gap-2 text-blue-600 font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              {profession}
            </p>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line text-base">{description}</p>
          </div>
        </div>

        {/* Focus Areas */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-8 text-center">Focus Areas</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area) => {
              const FocusIcon = area.Icon;
              return (
                <div
                  key={area.title}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                    <FocusIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm">{area.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{area.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
