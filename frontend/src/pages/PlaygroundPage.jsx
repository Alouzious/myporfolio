import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw } from 'lucide-react';
import { postApi } from '../api';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm an AI assistant that knows all about this portfolio. Ask me anything about skills, projects, experience, or how I can help with your next project!",
};

function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-slate-100 border border-gray-200'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-slate-600" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-tr-sm'
            : 'bg-white border border-gray-200 text-slate-700 rounded-tl-sm shadow-sm'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function PlaygroundPage({ about }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { id: Date.now(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await postApi('/api/chat', {
        message: text,
        history: messages.filter((m) => m.id !== 'welcome').slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content:
          result?.reply ||
          "I'm here to help! I can tell you about my skills, projects, experience, and more. What would you like to know?",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "Sorry, I couldn't process that right now. Please try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMessages([WELCOME_MESSAGE]);
  }

  const suggestions = [
    'What are your main skills?',
    'Tell me about your projects',
    'What blockchain technologies do you use?',
    'What AI/ML experience do you have?',
  ];

  return (
    <main className="pt-16 min-h-screen bg-gray-50">
      {/* Page header */}
      <section className="bg-white border-b border-gray-200 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-purple-100">
            <Sparkles className="w-4 h-4" />
            AI Playground
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Playground</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Chat with an AI assistant that knows{' '}
            <span className="font-medium text-slate-700">{about?.name || "this portfolio"}</span>&apos;s background,
            projects, skills, and experience. Ask anything!
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Chat container */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Portfolio Assistant</p>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Reset conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 flex flex-col gap-4 bg-gray-50/50">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-gray-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-slate-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5 items-center h-4">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-slate-400 mb-2 font-medium">Suggested questions</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="flex gap-3 p-4 border-t border-gray-100 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask me anything about the portfolio..."
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Info note */}
        <p className="text-center text-xs text-slate-400 mt-4">
          This AI assistant is powered by portfolio data and may not always have perfect answers.
        </p>
      </div>
    </main>
  );
}
