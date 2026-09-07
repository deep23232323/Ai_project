<div align="center">

# 🌌 Multiverse AI

### One platform. Every AI superpower.

A full-stack AI workspace like ChatGPT — but combined with document generation, image creation, real-time web search, and an autonomous coding agent, all in a single seamless experience.

[![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[Live Demo](https://multiverseai-self.vercel.app/) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Overview

**Multiverse AI** brings together the tools people usually need five different apps for — chat, document creation, image generation, web search, and coding help — into one unified, ChatGPT-style interface. Instead of switching tabs, users switch *modes* within the same conversation.

## 🚀 Features

- 💬 **Conversational AI Chat** — ChatGPT-style interface with context-aware, multi-turn conversations
- 📊 **PPT Generator** — Turn a prompt or outline into a ready-to-download presentation
- 📄 **PDF Generator** — Generate structured, styled PDF documents from text or data
- 🎨 **Image Generator** — Create AI-generated images from natural language prompts
- 🔎 **Web Search** — Real-time, up-to-date answers pulled live from the web
- 🤖 **Coding Agent** — An autonomous agent that can write, explain, and debug code
- 🔐 **Secure Authentication** — Protected user sessions and API access
- 💳 **Billing** — Subscription/payment handling (🧪 currently in test mode — no live transactions yet)
- ⚡ **Fast & Responsive UI** — Built with Next.js for a smooth, modern experience

## 🖼️ Screenshots

<div align="center">

**Dashboard**
<img src="./images/dashboard.png" width="800" alt="Multiverse AI Dashboard" />

**Artifact / Generation View**
<img src="./images/artifact.png" width="800" alt="Multiverse AI Artifact View" />

**Billing (Test Mode)**
<img src="./images/Billing.png" width="800" alt="Multiverse AI Billing Page" />

</div>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React |
| **Backend** | Node.js / Express — Microservices architecture |
| **Database** |  MongoDB  |
| **AI/LLM Integration** |  OpenAI API / Groq API / blackbox API / |
| **Deployment** | Vercel / Render | 

## 🧩 Architecture

Multiverse AI's backend follows a **microservices architecture**, fronted by a single API Gateway that routes requests to independent services.

```
                        ┌────────────────────┐
                        │   Next.js Frontend  │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌────────────────────┐
                        │    API Gateway      │
                        └──────────┬──────────┘
                                   │
        ┌───────────────┬─────────┴─────────┬───────────────┐
        ▼               ▼                   ▼               ▼
┌───────────────┐┌───────────────┐┌───────────────┐┌───────────────┐
│  Auth Service ││ Chat Service  ││ Agent Service ││ Billing Service│
│               ││               ││ (coding agent,││  🧪 Test Mode  │
│  Login/JWT/   ││ Chat, PPT,    ││  web search,  ││  (not live yet)│
│  Sessions     ││ PDF, image    ││  automation)  ││                │
│               ││ generation    ││               ││                │
└───────────────┘└───────────────┘└───────────────┘└───────────────┘
```

- **API Gateway** — single entry point for the frontend; handles routing, and can also manage cross-cutting concerns like rate limiting and auth verification
- **Auth Service** — user registration, login, JWT issuance/verification, session management
- **Chat Service** — core conversational AI, plus PPT/PDF/image generation and web search
- **Agent Service** — the autonomous coding agent and related tool-use workflows
- **Billing Service** — subscription/payment handling — ⚠️ **currently in test mode**, not yet processing real transactions

Each service can be developed, deployed, and scaled independently.

## 📂 Project Structure

```
multiverse-ai/
├── frontend/                  # Next.js client application
│   ├── components/
│   ├── pages/ or app/
│   ├── public/
│   └── package.json
├── backend/
│   ├── gateway/                # API Gateway — routes requests to services
│   ├── services/
│   │   ├── auth-service/        # Authentication & session management
│   │   ├── chat-service/        # Chat, PPT/PDF/image generation, web search
│   │   ├── agent-service/       # Coding agent
│   │   └── billing-service/     # Billing (🧪 test mode)
│   └── package.json
├── .gitignore
└── README.md
```

## 🌐 Live Demo

👉 **[https://multiverseai-self.vercel.app/](https://multiverseai-self.vercel.app/)**

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- API keys for the AI/services you're integrating (see [Environment Variables](#-environment-variables))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/multiverse-ai.git
   cd multiverse-ai
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install dependencies for each backend service**
   ```bash
   cd backend/gateway && npm install
   cd ../services/auth-service && npm install
   cd ../chat-service && npm install
   cd ../agent-service && npm install
   cd ../billing-service && npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `frontend/` directory, and one in each backend service directory (gateway + each of the four services) — see below.

5. **Run the services**

   Each service runs independently, so start them each in their own terminal (or use a process manager / `docker-compose` — see [Roadmap](#-roadmap)):

   ```bash
   # Gateway
   cd backend/gateway && npm run dev

   # Auth service
   cd backend/services/auth-service && npm run dev

   # Chat service
   cd backend/services/chat-service && npm run dev

   # Agent service
   cd backend/services/agent-service && npm run dev

   # Billing service (test mode)
   cd backend/services/billing-service && npm run dev
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app. The frontend talks only to the **API Gateway**, which routes to the appropriate service.

## 🔑 Environment Variables

> ⚠️ Never commit your `.env` files. Each service directory and the frontend should have its own `.env`, and **all** of them must be listed in `.gitignore`.

**Gateway `.env`**
```env
PORT=8000
AUTH_SERVICE_URL=
CHAT_SERVICE_URL=
AGENT_SERVICE_URL=
BILLING_SERVICE_URL=
FRONTEND_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=
```

**Auth Service `.env`**
```env
MONGODB_URI=
PORT=8001
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=
```

**Chat Service `.env`**
```env
MONGODB_URI=
PORT=8001
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=
```

**Agent Service `.env`**
```env
MONGODB_URI=
PORT=8003
GROQ_API_KEY=
GOOGLE_API_KEY=
AUTH_SERVICE=
CHAT_SERVICE=
TAVILY_API_KEY=
OPENROUTER_API_KEY=]
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
POLLEN_API_KEY=
HF_API_KEY=
QDRANT_API_KEY=
QDRANT_URL==
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_URL=
```

**Billing Service `.env`** — 🧪 *test mode*
```env
PORT=5004
BILLING_PROVIDER_MODE=test
BILLING_PROVIDER_TEST_KEY=your_test_mode_api_key
```
> Billing is currently running against a test/sandbox key only. No real transactions are processed yet — switch `BILLING_PROVIDER_MODE` to `live` and swap in production keys once ready to go live.

**Frontend `.env`**
```env
MONGODB_URI=
PORT=8004
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
AUTH_SERVICE=
```

## 🧭 Roadmap

- [ ] Move billing service from test mode to live payments
- [ ] Docker Compose setup to spin up gateway + all services together
- [ ] Voice input/output support
- [ ] Multi-user collaboration on documents
- [ ] Plugin system for custom AI tools
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📬 Contact

**Your Name** — your.email@example.com

Project Link: [https://github.com/your-username/multiverse-ai](https://github.com/your-username/multiverse-ai)

---

<div align="center">
Made with ❤️ and a lot of AI models
</div>
