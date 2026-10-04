import { NextRequest, NextResponse } from 'next/server';

const MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

type ChatMessage = { role?: string; text?: string };
type PriceSnapshot = {
  BTC?: number;
  ETH?: number;
  SOL?: number;
  BNB?: number;
  BTC_CHANGE?: number;
  ETH_CHANGE?: number;
  SOL_CHANGE?: number;
  BNB_CHANGE?: number;
  [key: string]: number | undefined;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { messages?: ChatMessage[]; prices?: PriceSnapshot };
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const prices = body.prices || {};
    
    // Use the provided Groq API key from environment variables
    const key = process.env.GROQ_API_KEY;
    
    if (!key) {
      return NextResponse.json({
        reply: '⚠️ API Error: GROQ_API_KEY is not configured. Please add it to your environment variables.'
      }, { status: 400 });
    }

    // Format live prices for the system prompt
    const livePrices: string[] = [];
    
    if (prices.BTC !== undefined) {
      livePrices.push(`BTC: $${prices.BTC?.toFixed(2)} (${(prices.BTC_CHANGE || 0).toFixed(2)}% 24h)`);
    }
    if (prices.ETH !== undefined) {
      livePrices.push(`ETH: $${prices.ETH?.toFixed(2)} (${(prices.ETH_CHANGE || 0).toFixed(2)}% 24h)`);
    }
    if (prices.SOL !== undefined) {
      livePrices.push(`SOL: $${prices.SOL?.toFixed(2)} (${(prices.SOL_CHANGE || 0).toFixed(2)}% 24h)`);
    }
    if (prices.BNB !== undefined) {
      livePrices.push(`BNB: $${prices.BNB?.toFixed(2)} (${(prices.BNB_CHANGE || 0).toFixed(2)}% 24h)`);
    }
    
    // Add other coins from CoinPaprika
    Object.entries(prices).forEach(([symbol, price]) => {
      if (price !== undefined && !['BTC', 'ETH', 'SOL', 'BNB', 'BTC_CHANGE', 'ETH_CHANGE', 'SOL_CHANGE', 'BNB_CHANGE'].includes(symbol)) {
        livePrices.push(`${symbol}: $${price.toFixed(4)}`);
      }
    });

    const live = livePrices.length > 0 ? ` LIVE PRICES (USD): ${livePrices.join(', ')}` : '';

    // Fetch additional coins from CoinPaprika for more context
    let extra = '';
    try {
      const ids = ['matic-matic', 'bnb-binance-coin', 'sol-solana', 'xrp-xrp', 'ada-cardano', 'doge-dogecoin'];
      const parts: string[] = [];
      
      // Fetch in parallel with timeout
      const promises = ids.map(async (id) => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 2000);
          const r = await fetch(`https://api.coinpaprika.com/v1/tickers/${id}`, {
            signal: controller.signal
          });
          clearTimeout(timeout);
          const j = await r.json();
          if (j?.quotes?.USD) {
            return `${j.symbol}: $${j.quotes.USD.price} (${j.quotes.USD.percent_change_24h?.toFixed(2) || 0}% 24h)`;
          }
        } catch {
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      results.forEach(result => {
        if (result) parts.push(result);
      });
      
      if (parts.length) extra = ' | ' + parts.join(', ');
    } catch {
      // Silently handle CoinPaprika errors
    }

    // Enhanced system prompt with better instructions
    const system =
      `You are CryptoAI, a friendly, helpful, and knowledgeable crypto expert assistant created by Abbas Hussain, a 16-year-old self-taught developer from Pakistan.` +
      live +
      extra +
      `

RESPONSE GUIDELINES:
1. ALWAYS include the most relevant live price data from above in your answers when users ask about prices
2. Reply in the SAME language the user uses (Roman Urdu or English)
3. Be concise but informative (max 200 words for short questions, longer for detailed explanations)
4. If asked about your developer, proudly mention Abbas Hussain - 16-year-old self-taught developer from Pakistan who built you entirely on a mobile phone
5. For price questions, ALWAYS include the current price with percentage change
6. Explain crypto concepts clearly for beginners
7. Use emojis sparingly but appropriately
8. If you don't know something, say so honestly
9. Format numbers nicely with commas
10. Be encouraging and positive

CURRENT DATE: ${new Date().toISOString().split('T')[0]}
`;

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
          body: JSON.stringify({
            model,
            messages: msgs,
            temperature: 0.7,
            max_tokens: 500,
          }),
        });
        
        const data = await res.json();
        
        if (res.status === 401) {
          lastError = 'Invalid API key. Please check your GROQ_API_KEY environment variable.';
          continue;
        }
        
        const text = data?.choices?.[0]?.message?.content;
        if (text) {
          return NextResponse.json({ reply: text });
        }
        
        lastError = data?.error?.message || 'HTTP ' + res.status;
      } catch (e: unknown) {
        lastError = e instanceof Error ? e.message : 'Unknown provider error';
      }
    }

    return NextResponse.json({
      reply: '⚠️ AI Error: ' + lastError + '\n\nPlease ensure your GROQ_API_KEY is valid and you have internet access.'
    });
  } catch (e: unknown) {
    return NextResponse.json({
      reply: 'Error: ' + (e instanceof Error ? e.message : 'server issue')
    }, { status: 500 });
  }
}

// GET method for testing
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'ok', message: 'CryptoAI API is running' });
}
