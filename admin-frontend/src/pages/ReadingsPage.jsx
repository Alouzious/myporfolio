import { useEffect, useState } from 'react';
import { fetchApi, postApi, deleteApi } from '../api';
import { Plus, Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';

const emptyForm = { title: '', author: '', description: '', book_url: '', read_date: '' };

export default function ReadingsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      const data = await fetchApi('/api/myreadings');
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
      await postApi('/api/myreadings', form);
      setForm(emptyForm);
      setSuccess('Reading created successfully');
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
      await deleteApi(`/api/myreadings/${id}`);
      setSuccess('Reading deleted');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Readings</h1>
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
        <h2 className="text-lg font-semibold text-white mb-4">Add Reading</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <input placeholder="Book URL" value={form.book_url} onChange={(e) => setForm({ ...form, book_url: e.target.value })} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
          <div>
            <label className="block text-sm text-gray-400 mb-1">Read Date</label>
            <input type="date" value={form.read_date} onChange={(e) => setForm({ ...form, read_date: e.target.value })} className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="md:col-span-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none" />
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Reading'}
            </button>
          </div>
        </form>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8"><Loader className="w-6 h-6 text-cyan-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center p-8">No readings yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-400">Title</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Author</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400 hidden md:table-cell">Read Date</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-400 w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-3 text-white">{item.title}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.author}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{item.read_date}</td>
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
