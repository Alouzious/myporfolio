import { useEffect, useState } from 'react';
import { fetchApi, deleteApi } from '../api';
import { Trash2, Loader, AlertCircle, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      const data = await fetchApi('/api/contact');
      if (data) setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    setError('');
    setSuccess('');
    try {
      await deleteApi(`/api/contact/${id}`);
      setSuccess('Message deleted');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Contact Messages</h1>
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
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-8"><Loader className="w-6 h-6 text-cyan-400 animate-spin" /></div>
        ) : items.length === 0 ? (
          <p className="text-gray-400 text-center p-8">No messages yet.</p>
        ) : (
          <div className="divide-y divide-gray-800">
            {items.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-800/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium text-white">{item.name || 'Unknown'}</span>
                      <span className="text-sm text-gray-500">{item.email || ''}</span>
                    </div>
                    {item.subject && <p className="text-sm font-medium text-gray-300 mb-1">{item.subject}</p>}
                    <p className="text-sm text-gray-400">{item.message}</p>
                    {item.created_at && <p className="text-xs text-gray-600 mt-2">{new Date(item.created_at).toLocaleString()}</p>}
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
