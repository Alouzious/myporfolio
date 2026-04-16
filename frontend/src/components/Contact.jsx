import { useState } from 'react';
import { Send, Mail, User, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { postApi } from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'sending' | 'success' | 'error'

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');

    const result = await postApi('/api/contact', form);
    if (result) {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
    }
    setTimeout(() => setStatus(null), 5000);
  }

  return (
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-4" />
          <p className="text-slate-500 max-w-md mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
        >
          {/* Name */}
          <div className="mb-5">
            <label htmlFor="name" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <User className="w-4 h-4 text-blue-600" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="your@email.com"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="flex items-center gap-2 text-slate-700 text-sm font-medium mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              placeholder="Your message..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-sm"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status messages */}
          {status === 'success' && (
            <p className="flex items-center justify-center gap-2 mt-4 text-emerald-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Message sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-center justify-center gap-2 mt-4 text-red-600 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              Failed to send. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
