'use client';
import { useEffect, useRef, useState } from 'react';
import { Bot, Send, Loader2, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

interface Msg {
  role: 'user' | 'ai';
  text: string;
  timestamp?: Date;
}

interface CoinData {
  symbol: string;
  price: number;
  change: number;
  name: string;
  icon: string;
}

const SUGGESTIONS = [
  'BTC ka current price?',
  'Ethereum kya hai?',
  'Beginners crypto kaise seekhein?',
  'Solana vs Ethereum',
  'Best altcoins 2024',
  'Crypto wallets kya hain?'
];

const POPULAR_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'from-orange-500 to-yellow-600' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: 'from-blue-500 to-cyan-600' },
  { symbol: 'BNB', name: 'Binance Coin', icon: 'B', color: 'from-yellow-500 to-orange-600' },
  { symbol: 'SOL', name: 'Solana', icon: 'S', color: 'from-purple-500 to-pink-600' },
  { symbol: 'XRP', name: 'XRP', icon: 'X', color: 'from-blue-500 to-indigo-600' },
  { symbol: 'ADA', name: 'Cardano', icon: 'A', color: 'from-teal-500 to-blue-600' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'D', color: 'from-amber-500 to-orange-600' },
  { symbol: 'DOT', name: 'Polkadot', icon: '•', color: 'from-pink-500 to-purple-600' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'ai',
      text: 'Assalam-o-Alaikum! Main CryptoAI hoon 🤖 - aapka personal crypto assistant. Live prices, explanations, guidance - sab kuch poochein!',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [btc, setBtc] = useState<number | null>(null);
  const [eth, setEth] = useState<number | null>(null);
  const [sol, setSol] = useState<number | null>(null);
  const [bnb, setBnb] = useState<number | null>(null);
  const [btcChange, setBtcChange] = useState(0);
  const [ethChange, setEthChange] = useState(0);
  const [solChange, setSolChange] = useState(0);
  const [bnbChange, setBnbChange] = useState(0);
  const [coinPrices, setCoinPrices] = useState<Record<string, CoinData>>({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeCoin, setActiveCoin] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Binance WebSocket - live prices for multiple coins
  useEffect(() => {
    const streams = ['btcusdt@miniTicker', 'ethusdt@miniTicker', 'solusdt@miniTicker', 'bnbbtc@miniTicker'];
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams.join('/')}`);
    
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const stream = data.stream;
        const d = data.data;
        
        const updateCoin = (symbol: string, price: number, change: number) => {
          setCoinPrices(prev => ({
            ...prev,
            [symbol]: {
              symbol,
              price,
              change,
              name: symbol === 'BTC' ? 'Bitcoin' : symbol === 'ETH' ? 'Ethereum' : symbol === 'SOL' ? 'Solana' : 'Binance Coin',
              icon: symbol === 'BTC' ? '₿' : symbol === 'ETH' ? 'Ξ' : symbol === 'SOL' ? 'S' : 'B'
            }
          }));
        };
        
        if (stream === 'btcusdt@miniTicker') {
          setBtc(parseFloat(d.c));
          setBtcChange(parseFloat(d.P));
          updateCoin('BTC', parseFloat(d.c), parseFloat(d.P));
        }
        if (stream === 'ethusdt@miniTicker') {
          setEth(parseFloat(d.c));
          setEthChange(parseFloat(d.P));
          updateCoin('ETH', parseFloat(d.c), parseFloat(d.P));
        }
        if (stream === 'solusdt@miniTicker') {
          setSol(parseFloat(d.c));
          setSolChange(parseFloat(d.P));
          updateCoin('SOL', parseFloat(d.c), parseFloat(d.P));
        }
        if (stream === 'bnbbtc@miniTicker') {
          // Convert BNB/BTC to USD using BTC price
          const bnbBtcPrice = parseFloat(d.c);
          if (btc) {
            const bnbUsdPrice = bnbBtcPrice * btc;
            setBnb(bnbUsdPrice);
            setBnbChange(parseFloat(d.P));
            updateCoin('BNB', bnbUsdPrice, parseFloat(d.P));
          }
        }
      } catch {}
    };
    
    return () => ws.close();
  }, [btc]);

  // Fetch additional coin data from CoinPaprika
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const coins = ['matic-matic', 'xrp-xrp', 'ada-cardano', 'doge-dogecoin'];
        const results: Record<string, CoinData> = {};
        
        for (const coin of coins) {
          try {
            const response = await fetch(`https://api.coinpaprika.com/v1/tickers/${coin}`);
            const data = await response.json();
            if (data?.quotes?.USD) {
              results[data.symbol] = {
                symbol: data.symbol,
                price: data.quotes.USD.price,
                change: data.quotes.USD.percent_change_24h,
                name: data.name,
                icon: data.symbol[0]
              };
            }
          } catch (error) {
            console.error(`Error fetching ${coin}:`, error);
          }
        }
        
        setCoinPrices(prev => ({ ...prev, ...results }));
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    };
    
    fetchCoinData();
    const interval = setInterval(fetchCoinData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput('');
    const history = [...messages, { role: 'user' as const, text: q, timestamp: new Date() }];
    setMessages(history);
    setLoading(true);
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          prices: {
            BTC: btc,
            ETH: eth,
            SOL: sol,
            BNB: bnb,
            BTC_CHANGE: btcChange,
            ETH_CHANGE: ethChange,
            SOL_CHANGE: solChange,
            BNB_CHANGE: bnbChange,
            ...Object.fromEntries(Object.entries(coinPrices).map(([k, v]) => [k, v.price]))
          },
        }),
      });
      const json = await res.json();
      setMessages(m => [...m, { role: 'ai', text: json.reply, timestamp: new Date() }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: '⚠️ Network error - dobara try karein.', timestamp: new Date() }]);
    }
    setLoading(false);
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Loading...';
    if (price > 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(4)}`;
  };

  const getPriceColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,41,59,0.3)_0%,rgba(2,6,23,0)_70%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-cyan-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/10 blur-3xl rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
                <div className="w-5 h-0.5 bg-white rounded-full"></div>
                <div className="w-5 h-0.5 bg-white rounded-full"></div>
                <div className="w-5 h-0.5 bg-white rounded-full"></div>
              </div>
            </button>
            
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold tracking-tight text-sm">CryptoAI</h1>
                <p className="text-[10px] text-white/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Groq AI • Live Data
                </p>
              </div>
            </Link>
          </div>
          
          {/* Live Prices Bar */}
          <div className="hidden md:flex items-center gap-2">
            {btc && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer" onClick={() => setActiveCoin('BTC')}>
                <span className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">₿</span>
                <span className="font-mono font-bold text-sm">{formatPrice(btc)}</span>
                <span className={`text-xs font-medium ${getPriceColor(btcChange)}`}>
                  {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(2)}%
                </span>
              </div>
            )}
            {eth && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer" onClick={() => setActiveCoin('ETH')}>
                <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">Ξ</span>
                <span className="font-mono font-bold text-sm">{formatPrice(eth)}</span>
                <span className={`text-xs font-medium ${getPriceColor(ethChange)}`}>
                  {ethChange >= 0 ? '+' : ''}{ethChange.toFixed(2)}%
                </span>
              </div>
            )}
            {sol && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer" onClick={() => setActiveCoin('SOL')}>
                <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold text-xs">S</span>
                <span className="font-mono font-bold text-sm">{formatPrice(sol)}</span>
                <span className={`text-xs font-medium ${getPriceColor(solChange)}`}>
                  {solChange >= 0 ? '+' : ''}{solChange.toFixed(2)}%
                </span>
              </div>
            )}
            {bnb && (
              <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer" onClick={() => setActiveCoin('BNB')}>
                <span className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold text-xs">B</span>
                <span className="font-mono font-bold text-sm">{formatPrice(bnb)}</span>
                <span className={`text-xs font-medium ${getPriceColor(bnbChange)}`}>
                  {bnbChange >= 0 ? '+' : ''}{bnbChange.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/" className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <span className="text-xs font-medium">Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* Sidebar - Coin List */}
        <aside className={`fixed lg:relative z-30 lg:z-10 top-0 left-0 h-full w-72 bg-[#020617]/95 lg:bg-[#020617]/80 backdrop-blur-xl border-r border-white/[0.06] transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 lg:duration-0`}>
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Market Overview</h2>
              <button onClick={toggleSidebar} className="lg:hidden p-1 rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
            <p className="text-xs text-white/40 mb-4">Popular Coins - Live Prices</p>
            
            {POPULAR_COINS.map((coin) => {
              const coinData = coinPrices[coin.symbol];
              const price = coinData?.price ?? (coin.symbol === 'BTC' ? btc : coin.symbol === 'ETH' ? eth : coin.symbol === 'SOL' ? sol : coin.symbol === 'BNB' ? bnb : null);
              const change = coinData?.change ?? (coin.symbol === 'BTC' ? btcChange : coin.symbol === 'ETH' ? ethChange : coin.symbol === 'SOL' ? solChange : coin.symbol === 'BNB' ? bnbChange : 0);
              
              return (
                <div 
                  key={coin.symbol}
                  className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors cursor-pointer ${activeCoin === coin.symbol ? 'bg-white/[0.08] border-white/[0.12]' : ''}`}
                  onClick={() => setActiveCoin(activeCoin === coin.symbol ? null : coin.symbol)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${coin.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {coin.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{coin.name}</div>
                        <div className="text-xs text-white/60">{coin.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-sm">{price !== null ? formatPrice(price) : 'Loading...'}</div>
                      <div className={`text-xs font-medium ${getPriceColor(change)}`}>
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Additional coins from CoinPaprika */}
            {Object.entries(coinPrices).map(([symbol, data]) => {
              if (!POPULAR_COINS.some(c => c.symbol === symbol)) {
                return (
                  <div 
                    key={symbol}
                    className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors cursor-pointer"
                    onClick={() => setActiveCoin(activeCoin === symbol ? null : symbol)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white font-bold text-sm">
                          {data.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{data.name}</div>
                          <div className="text-xs text-white/60">{symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm">{formatPrice(data.price)}</div>
                        <div className={`text-xs font-medium ${getPriceColor(data.change)}`}>
                          {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">
              {messages.length === 1 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to CryptoAI</h2>
                  <p className="text-white/60 mb-6">Ask me anything about cryptocurrency!</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.slice(0, 3).map(s => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex gap-3 ${m.role === 'ai' ? '' : 'justify-end'}`}
                >
                  {m.role === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div 
                    className={`max-w-[85%] px-5 py-3 rounded-2xl ${m.role === 'ai' 
                      ? 'rounded-tl-md bg-white/[0.04] border border-white/[0.07]' 
                      : 'rounded-tr-md bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20'}
                    `}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                    {m.timestamp && (
                      <div className="mt-2 flex justify-end">
                        <span className="text-[10px] text-white/30">{m.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-md px-5 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/[0.06] bg-[#020617]/80 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto px-4 py-4">
              {/* Quick Suggestions */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    disabled={loading}
                    className="flex-shrink-0 px-4 py-2 rounded-full text-sm text-white/60 bg-white/[0.03] border border-white/[0.08] hover:text-blue-300 hover:border-blue-500/40 transition disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-5 py-3 focus-within:border-blue-500/50 transition">
                <input
                  type="text"
                  placeholder={loading ? "Thinking..." : "Crypto se related kuch poochein..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  disabled={loading}
                  className="flex-1 bg-transparent py-2 text-sm focus:outline-none placeholder:text-white/30 disabled:opacity-50"
                />
                <button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              
              <p className="text-center text-[10px] text-white/25 mt-4">
                CryptoAI ghalti kar sakta hai - important info verify karein
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {showSidebar && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
