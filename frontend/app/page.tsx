'use client';
import { useEffect, useRef, useState } from 'react';
import { Bot, Send, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface Msg {
  role: 'user' | 'ai';
  text: string;
}

const SUGGESTIONS = ['BTC ka current price?', 'Ethereum kya hai?', 'Beginners crypto kaise seekhein?'];

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', text: 'Assalam-o-Alaikum! Main CryptoAI hoon 🤖 - aapka personal crypto assistant. Live prices, explanations, guidance - sab kuch poochein!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [btc, setBtc] = useState<number | null>(null);
  const [eth, setEth] = useState<number | null>(null);
  const [btcChange, setBtcChange] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // Binance WebSocket - live prices
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker');
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data).data;
        if (d.s === 'BTCUSDT') {
          setBtc(parseFloat(d.c));
          setBtcChange(parseFloat(d.P));
        }
        if (d.s === 'ETHUSDT') setEth(parseFloat(d.c));
      } catch {}
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    const history = [...messages, { role: 'user' as const, text: q }];
    setMessages(history);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          prices: { BTC: btc, ETH: eth, BTC_CHANGE: btcChange },
        }),
      });
      const json = await res.json();
      setMessages(m => [...m, { role: 'ai', text: json.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Network error - dobara try karein.' }]);
    }
    setLoading(false);
  };

  return (
    <main className="h-screen bg-[#0a0a0a] text-white flex flex-col relative">
      {/* Carbon background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/[0.06] blur-[130px] rounded-full" />
        <div className="absolute bottom-0 -right-40 w-[400px] h-[300px] bg-violet-600/[0.05] blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold tracking-tight text-sm">CryptoAI</h1>
              <p className="text-[10px] text-white/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Groq AI · Live Data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {btc && (
              <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold">
                BTC ${btc.toLocaleString()}
                {btcChange >= 0 ? (
                  <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 text-red-400" />
                )}
              </span>
            )}
            {eth && (
              <span className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono font-bold">
                ETH ${eth.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {messages.map((m, i) =>
            m.role === 'ai' ? (
              <div key={i} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md bg-white/[0.04] border border-white/[0.07] text-sm leading-relaxed whitespace-pre-wrap">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={i} className="flex justify-end">
                <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md bg-blue-600/15 border border-blue-500/20 text-sm leading-relaxed">
                  {m.text}
                </div>
              </div>
            )
          )}
          {loading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-md px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10 border-t border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] text-white/50 bg-white/[0.03] border border-white/[0.08] hover:text-blue-300 hover:border-blue-500/40 transition"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-2 focus-within:border-blue-500/50 transition">
            <input
              type="text"
              placeholder="Crypto se related kuch poochein..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-white/30"
            />
            <button
              onClick={() => send()}
              disabled={loading}
              className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-center text-[10px] text-white/25 mt-3">
            CryptoAI ghalti kar sakta hai - important info verify karein
          </p>
        </div>
      </div>
    </main>
  );
}
