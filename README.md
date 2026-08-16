![Header](https://capsule-render.vercel.app/api?type=waving&height=230&section=header&text=CryptoAI&fontSize=70&fontColor=ffffff&animation=twinkling&desc=Your%20Personal%20AI%20Crypto%20Assistant&descAlignY=72&color=gradient&customColorList=20)

<div align="center">

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=24&pause=1000&color=8B5CF6&center=true&vCenter=true&width=700&lines=AI-Powered+Crypto+Assistant;Live+Prices+via+Binance+WebSocket;Ultra-Fast+Inference+by+Groq" alt="Typing SVG"/>

**A real-time AI crypto assistant that answers with live market data - built with Next.js, Groq (Llama 3.3 70B) and Binance WebSocket streams.**

[![LIVE DEMO](https://img.shields.io/badge/🚀_LIVE_DEMO-cryptoai.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://cryptoai.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge)](https://groq.com)
[![Binance](https://img.shields.io/badge/Binance-WebSocket-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](https://binance.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ Features

<div align="center">

[![🤖 AI Chat](https://img.shields.io/badge/🤖_AI_Chat-Llama_3.3_70B-purple?style=for-the-badge)](#)
[![📡 Live Data](https://img.shields.io/badge/📡_Live_Data-Binance_WebSocket-yellow?style=for-the-badge)](#)
[![💰 Multi-Coin](https://img.shields.io/badge/💰_Context-BTC_ETH_POL_BNB_SOL-orange?style=for-the-badge)](#)

[![🧠 Memory](https://img.shields.io/badge/🧠_Memory-Full_Conversation_Context-green?style=for-the-badge)](#)
[![🌐 Bilingual](https://img.shields.io/badge/🌐_Bilingual-English_+_Roman_Urdu-teal?style=for-the-badge)](#)
[![🎨 UI](https://img.shields.io/badge/🎨_UI-Carbon_Glass_Design-slate?style=for-the-badge)](#)

</div>

---

## 🏗️ Architecture

```text
Browser ──WebSocket──► Binance (live BTC / ETH tickers)
   │
   └──chat──► /api/chat (Next.js API Route)
                    │
                    ├──► CoinPaprika (extra coin prices)
                    │
                    └──► Groq API (Llama 3.3 70B)
                              │
                              ▼
                     AI reply with live-price context
```

Every user message is enriched with **real-time market prices** before reaching the LLM - so the assistant always answers with **current, accurate data**.

---

## 🛠️ Tech Stack

<div align="center">

[![Next.js 16](https://img.shields.io/badge/Next.js-App_Router_+_API_Routes-black?style=for-the-badge&logo=next.js)](#)
[![Groq](https://img.shields.io/badge/Groq-Ultra--Fast_LLM_Inference-F55036?style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Type_Safety-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Binance WebSocket](https://img.shields.io/badge/Binance-Real--Time_Streams-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](#)
[![CoinPaprika](https://img.shields.io/badge/CoinPaprika-Market_Data-teal?style=for-the-badge)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Carbon_Glass_UI-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

</div>

---

## 💬 Example Conversation

```text
User: What's the current price of BTC?
AI:   BTC is trading at $63,064 (-1.2% in the last 24h).
      ETH is at $1,881 right now...

User: Who built you?
AI:   I was created by Abbas Hussain - a 16-year-old self-taught
      developer from Pakistan who built me entirely on a mobile phone!
```

---

## 📦 Installation

```bash
git clone https://github.com/AbbasFullstack/cryptoai.git
cd cryptoai/frontend
npm install
npm run dev
```

> 🔑 Add your free Groq API key to `.env.local`:
> `GROQ_API_KEY=your_key_here` (get one at console.groq.com)

---

## ⚠️ Disclaimer

CryptoAI provides information for **educational purposes only** - not financial advice. Always do your own research (DYOR)!

---

## 👨‍ About the Developer

<div align="center">

<img src="https://github.com/AbbasFullstack.png" width="120" height="120" alt="Abbas Hussain"/>

### **Abbas Hussain**
*Full-Stack · Web3 · AI Developer*

[![GitHub](https://img.shields.io/badge/GitHub-AbbasFullstack-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AbbasFullstack)
[![Email](https://img.shields.io/badge/abbaswebdevelopers@gmail.com-Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abbaswebdevelopers@gmail.com)

> 🎯 Self-taught developer building production-ready AI, Web3 & full-stack apps
> ⛓️ Next.js • TypeScript • Groq • ethers.js • Supabase • WebSocket APIs
> 📱 **Fun fact:** this AI assistant was built entirely on a mobile phone!

### 📊 Development Activity

![Contribution Graph](https://ghchart.rshah.org/8B5CF6/AbbasFullstack)

</div>

---

## 📄 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

**Made with ❤️ by Abbas Hussain**

⭐ *Star this repo if you find it helpful!*

</div>

![Footer](https://capsule-render.vercel.app/api?type=wave&height=110&section=footer&color=gradient&customColorList=20)