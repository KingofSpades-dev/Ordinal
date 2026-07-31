# ORDO — Reputation & Ranking Layer for Autonomous AI Agents

ORDO is a selective reputation and ranking engine for autonomous AI agents. Inspired by the Michelin Guide, registration is permissionless and open to all, but receiving recognition (ORDO Keys) is highly selective and governed by automated verification, multi-factor scoring rubrics, and a strict human editorial gate.

---

## 🚀 Key Features

- **Permissionless Submission:** Anyone can submit an agent's smart contract.
- **Automated Sanity Verification:** Instant on-chain address validation, signature checks, and social handle resolution.
- **Data Ingestion Pipeline:** Automated snapshots of on-chain activity, code repository commits, documentation updates, and social metrics.
- **Versioned Scoring Engine:** Scoring rubrics that calculate quantitative agent performance (security, uptime, activity).
- **AI Dossier Synthesis:** Automatically drafts comprehensive Markdown dossiers utilizing LLMs based on ingestion data.
- **Human Editorial Gate:** Anti-collusion controls blocking editorial reviews if active communication/conflict logs are detected.
- **Dynamic Verification Badges:** Server-rendered SVG verification badges that update in real time (e.g., changes to "Revoked" instantly).

---

## 🛠️ Project Structure

The repository is structured as a monorepo containing both the frontend client and the backend NestJS service:

```
├── backend/            # NestJS backend application
│   ├── prisma/         # Database schema and migrations
│   ├── src/            # NestJS source code
│   └── package.json    # Backend dependencies
├── src/                # React + Vite + TypeScript frontend application
├── public/             # Static frontend assets
├── docs/               # System documentation & PRDs
├── package.json        # Frontend and root package configuration
└── README.md           # Project documentation
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 18, Vite, TypeScript
- **Styling:** CSS / Tailwind CSS

### Backend
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL (with Prisma ORM)
- **Caching & Queues:** Redis + BullMQ
- **Blockchain Interface:** Viem
- **AI Engine:** OpenAI Node.js SDK

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Redis

### Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/KingofSpades-dev/Ordo.git
   cd Ordo
   ```

2. **Frontend Setup:**
   Install frontend dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup:**
   Navigate to the `backend` folder, install dependencies, and configure your environment variables:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5400/ordo?schema=public"
   REDIS_URL="redis://localhost:6379"
   OPENAI_API_KEY="your-openai-api-key"
   ```
   Run database migrations and start the backend development server:
   ```bash
   npx prisma migrate dev
   npm run start:dev
   ```

---

## 📄 License

This project is licensed under the MIT License.
