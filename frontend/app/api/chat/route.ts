import { NextRequest, NextResponse } from 'next/server';

const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

type ChatMessage = { role?: string; text?: string };
type PriceSnapshot = { BTC?: number; BTC_CHANGE?: number; ETH?: number };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages?: ChatMessage[]; prices?: PriceSnapshot };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const prices = body.prices;
    const key = process.env.GROQ_API_KEY;

    // Extra coins - CoinPaprika
    let extra = '';
    try {
      const ids = ['matic-matic', 'bnb-binance-coin', 'sol-solana'];
      const parts: string[] = [];
      for (const id of ids) {
        const r = await fetch(`https://api.coinpaprika.com/v1/tickers/${id}`);
        const j = await r.json();
        if (j?.quotes?.USD) parts.push(`${j.symbol}: $${j.quotes.USD.price}`);
      }
      if (parts.length) extra = ' | ' + parts.join(', ');
    } catch {}

    // Live BTC/ETH - Binance WebSocket se
    const live = prices?.BTC
      ? ` LIVE PRICES (USD): BTC: $${prices.BTC} (${(prices.BTC_CHANGE || 0).toFixed(2)}% 24h), ETH: $${prices.ETH}`
      : '';

    const system =
      `You are CryptoAI, a friendly crypto expert assistant created by Abbas Hussain.` +
      live +
      extra +
      `. Answer concisely (max 150 words). Reply in the same language style the user uses (Roman Urdu or English). If asked about your developer, mention Abbas Hussain - 16-year-old self-taught developer from Pakistan who built you on a mobile phone.`;

    const msgs = [
      { role: 'system', content: system },
      ...messages.map((m: ChatMessage) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      })),
    ];

    let lastError = '';
    for (const model of MODELS) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({ model, messages: msgs }),
        });
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return NextResponse.json({ reply: text });
        lastError = data?.error?.message || 'HTTP ' + res.status;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e.message : 'Unknown provider error';
      }
    }

    return NextResponse.json({ reply: '⚠️ AI Error: ' + lastError });
  } catch (e: unknown) {
    return NextResponse.json({ reply: 'Error: ' + (e instanceof Error ? e.message : 'server issue') }, { status: 500 });
  }
}
