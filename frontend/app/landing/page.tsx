'use client';
import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, TrendingUp, MessageSquare, Users, Zap, Star, Coins, Rocket, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [btcChange, setBtcChange] = useState<number>(0);
  const [ethChange, setEthChange] = useState<number>(0);
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Fetch live prices from Binance WebSocket
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@miniTicker/ethusdt@miniTicker/solusdt@miniTicker');
    
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const stream = data.stream;
        const d = data.data;
        
        if (stream === 'btcusdt@miniTicker') {
          setBtcPrice(parseFloat(d.c));
          setBtcChange(parseFloat(d.P));
        }
        if (stream === 'ethusdt@miniTicker') {
          setEthPrice(parseFloat(d.c));
          setEthChange(parseFloat(d.P));
        }
        if (stream === 'solusdt@miniTicker') {
          setSolPrice(parseFloat(d.c));
        }
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket connection error:', error);
    };
    
    return () => ws.close();
  }, []);

  // Stats for the landing page
  const stats = [
    { label: 'Real-Time Data', value: 'Live', icon: Zap, color: 'text-blue-400' },
    { label: 'AI Models', value: 'Llama 3.3', icon: Rocket, color: 'text-purple-400' },
    { label: 'Coins Tracked', value: '100+', icon: Coins, color: 'text-orange-400' },
    { label: 'Response Time', value: '<1s', icon: TrendingUp, color: 'text-green-400' },
  ];

  const features = [
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Ask anything about crypto in English or Roman Urdu. Get instant, accurate answers.',
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
    },
    {
      icon: TrendingUp,
      title: 'Live Market Data',
      description: 'Real-time prices from Binance WebSocket. Always up-to-date with the market.',
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/20',
    },
    {
      icon: Users,
      title: 'Built for You',
      description: 'Created by Abbas Hussain, a 16-year-old self-taught developer from Pakistan.',
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/20',
    },
    {
      icon: Sparkles,
      title: 'Smart Insights',
      description: 'AI-powered analysis with live price context. Make informed decisions.',
      gradient: 'from-orange-500 to-yellow-500',
      glow: 'shadow-orange-500/20',
    },
  ];

  const testimonials = [
    {
      quote: 'CryptoAI has transformed how I track crypto prices. The AI understands my questions perfectly!',
      name: 'Ali R.',
      role: 'Crypto Enthusiast',
    },
    {
      quote: 'Being able to ask in Roman Urdu and get instant answers with live prices is amazing!',
      name: 'Fatima K.',
      role: 'Investor',
    },
    {
      quote: 'The real-time data integration is seamless. Highly recommended for any crypto trader.',
      name: 'Ahmed S.',
      role: 'Trader',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,41,59,0.4)_0%,rgba(2,6,23,0)_70%)]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        {/* Particle Effect */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">CryptoAI</h1>
              <p className="text-xs text-white/40">Your Personal Crypto Assistant</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/chat" className="px-4 py-2 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all group">
              <span className="text-sm font-medium">Start Chatting</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm text-white/60">Live Crypto Data</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              The Future of
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Crypto Intelligence
            </span>
          </h1>
          
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            AI-powered crypto assistant with real-time market data. Ask anything, get instant answers with live prices from Binance.
          </p>
          
          {/* Live Prices Display */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-sm font-bold">₿</span>
                </div>
                <span className="font-semibold">Bitcoin</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${btcPrice?.toLocaleString() || 'Loading...'}</span>
                <span className={`text-sm ${btcChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-bold">Ξ</span>
                </div>
                <span className="font-semibold">Ethereum</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${ethPrice?.toLocaleString() || 'Loading...'}</span>
                <span className={`text-sm ${ethChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {ethChange >= 0 ? '+' : ''}{ethChange.toFixed(2)}%
                </span>
              </div>
            </div>
            
            <div className="px-6 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                  <span className="text-sm font-bold">S</span>
                </div>
                <span className="font-semibold">Solana</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">${solPrice?.toLocaleString() || 'Loading...'}</span>
                <span className="text-sm text-gray-400">Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/chat" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 group">
              <span className="font-semibold">Start Free Chat</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
              <span className="font-semibold">Learn More</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="px-6 py-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center hover:scale-105 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-white/60">Everything you need for crypto intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:scale-102 transition-transform group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg ${feature.glow} group-hover:scale-105 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                What Users Say
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star, i) => (
                      <Star key={i} className="w-5 h-5" fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-white/80 mb-6 italic">{testimonial.quote}</p>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-white/60">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 md:p-16 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                CryptoAI?
              </span>
            </h2>
            <p className="text-xl text-white/60 mb-10">
              Start chatting now and get instant crypto insights with live market data.
            </p>
            <Link href="/chat" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 group">
              <span className="font-semibold">Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">CryptoAI</h3>
                <p className="text-sm text-white/60">Your Personal Crypto Assistant</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/chat" className="hover:text-white transition-colors">Chat</Link>
              <a href="https://github.com/AbbasFullstack/cryptoai" target="_blank" className="hover:text-white transition-colors flex items-center gap-1">
                GitHub <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
            <p>Built with ❤️ by Abbas Hussain - 16-year-old self-taught developer from Pakistan</p>
            <p className="mt-2">Disclaimer: CryptoAI provides information for educational purposes only. Not financial advice.</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <Link 
        href="/chat"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-105 transition-transform"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </Link>
    </div>
  );
}
