import { User, Briefcase } from 'lucide-react';

export default function About({ about }) {
  const name = about?.name || 'Developer';
  const profession = about?.profession || 'Full Stack Developer';
  const description =
    about?.description ||
    'Passionate developer with a love for building modern web applications and solving complex problems with elegant solutions.';
  const imageUrl = about?.image_url;

  return (
    <section id="about" className="py-20 px-6 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image / Avatar */}
          <div className="flex justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-72 h-72 rounded-2xl object-cover border-2 border-gray-800 shadow-2xl shadow-cyan-500/10"
              />
            ) : (
              <div className="w-72 h-72 rounded-2xl bg-gray-900 border-2 border-gray-800 flex items-center justify-center shadow-2xl shadow-cyan-500/10">
                <User className="w-24 h-24 text-gray-700" />
              </div>
            )}
          </div>

          {/* Text content */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-100 mb-2">{name}</h3>
            <p className="flex items-center gap-2 text-cyan-400 font-medium mb-6">
              <Briefcase className="w-4 h-4" />
              {profession}
            </p>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
