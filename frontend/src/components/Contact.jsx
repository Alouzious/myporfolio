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
    <section id="contact" className="py-20 px-6 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 max-w-md mx-auto">
            Have a project in mind or just want to say hello? Feel free to reach out.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto bg-gray-900 border border-gray-800 rounded-xl p-8"
        >
          {/* Name */}
          <div className="mb-6">
            <label htmlFor="name" className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
              <User className="w-4 h-4 text-cyan-400" />
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="flex items-center gap-2 text-gray-300 text-sm font-medium mb-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors resize-none"
              placeholder="Your message..."
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-gray-950 font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40"
          >
            <Send className="w-4 h-4" />
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status messages */}
          {status === 'success' && (
            <p className="flex items-center justify-center gap-2 mt-4 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Message sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="flex items-center justify-center gap-2 mt-4 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              Failed to send. Please try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
