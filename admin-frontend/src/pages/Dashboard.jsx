import { useEffect, useState } from 'react';
import { fetchApi } from '../api';
import {
  FolderKanban,
  Cpu,
  Briefcase,
  Mail,
  Link2,
  FlaskConical,
  BookOpen,
  Trophy,
  Loader,
  AlertCircle,
} from 'lucide-react';

const resources = [
  { key: 'projects', label: 'Projects', endpoint: '/api/projects', icon: FolderKanban, color: 'text-blue-400' },
  { key: 'skills', label: 'Skills', endpoint: '/api/skills', icon: Cpu, color: 'text-green-400' },
  { key: 'experience', label: 'Experience', endpoint: '/api/experience', icon: Briefcase, color: 'text-purple-400' },
  { key: 'contact', label: 'Messages', endpoint: '/api/contact', icon: Mail, color: 'text-yellow-400' },
  { key: 'socialLinks', label: 'Social Links', endpoint: '/api/social-links', icon: Link2, color: 'text-pink-400' },
  { key: 'research', label: 'Research', endpoint: '/api/research', icon: FlaskConical, color: 'text-orange-400' },
  { key: 'readings', label: 'Readings', endpoint: '/api/myreadings', icon: BookOpen, color: 'text-indigo-400' },
  { key: 'achievements', label: 'Achievements', endpoint: '/api/achievements', icon: Trophy, color: 'text-amber-400' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.allSettled(
          resources.map((r) => fetchApi(r.endpoint))
        );
        const c = {};
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            c[resources[i].key] = result.value.length;
          } else {
            c[resources[i].key] = 0;
          }
        });
        setCounts(c);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      {error && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((r) => (
          <div
            key={r.key}
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg bg-gray-800 ${r.color}`}>
              <r.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{counts[r.key] ?? 0}</p>
              <p className="text-sm text-gray-400">{r.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
