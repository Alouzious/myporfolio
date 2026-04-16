import { useEffect, useState } from 'react';
import { fetchApi, postApi, deleteApi } from '../api';
import { Plus, Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const emptyForm = { platform: '', url: '', icon: '' };

export default function SocialLinksPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      const data = await fetchApi('/api/social-links');
      if (data) setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await postApi('/api/social-links', form);
      setForm(emptyForm);
      setSuccess('Social link created successfully');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    setSuccess('');
    try {
      await deleteApi(`/api/social-links/${id}`);
      setSuccess('Social link deleted');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Social Links</h1>
      {error && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-red-600/10 border border-red-600/30 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 mb-4 p-3 bg-green-600/10 border border-green-600/30 rounded-lg text-green-400 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" />{success}
        </div>
      )}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Social Link</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Platform (e.g., GitHub)" required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <input placeholder="URL" required value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Icon name" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <div className="md:col-span-3">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Link'}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8"><Loader className="w-6 h-6 text-cyan-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center p-8">No social links yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Platform</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">URL</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-white">{item.platform}</td>
                  <td className="px-4 py-3 text-cyan-400 hidden md:table-cell">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline truncate block max-w-xs">{item.url}</a>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
