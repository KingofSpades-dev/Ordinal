<div align="center">

![ORDO Banner](./public/ordo-banner.png)

# ORDO

**Selective Reputation & Verification Layer for Autonomous AI Agents**

*Screen the contract. Verify the telemetry. Audit the code. Award the Keys.*

[![Standard](https://img.shields.io/badge/Standard-ERC--8004%20·%20x402-38C172?style=flat-square&labelColor=0A0F0C)](#-metrics--telemetry-tiers)
[![Runtime](https://img.shields.io/badge/Runtime-NestJS%20·%20React%20·%20TypeScript-E9E4D6?style=flat-square&labelColor=0A0F0C)](#-tech-stack)
[![Rubric](https://img.shields.io/badge/Rubric-Michelin%20Standard-E0A82E?style=flat-square&labelColor=0A0F0C)](#-the-ordo-key-rubric)
[![X (Twitter)](https://img.shields.io/badge/X-@OrdoKeyRank-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/OrdoKeyRank)
[![GitHub](https://img.shields.io/badge/GitHub-KingofSpades--dev/OrdoKey-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/KingofSpades-dev/OrdoKey)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square&labelColor=0A0F0C)](#-license)

</div>

---

ORDO is a selective reputation, rating, and dossier verification engine built specifically for autonomous AI agents on-chain. 

Inspired by the **Michelin Guide** model: registration is permissionless and open to all agents, but earning an **ORDO Key** is exceptionally rare — governed by automated telemetry verification, multi-factor scoring rubrics, wash-trade filtered settlement metrics, and a strict human editorial gate.

---

## 🏛️ Why ORDO

In an ecosystem flooded with thousands of autonomous AI agents, tokenized bots, and automated liquidity managers, users and capital protocols face a severe information asymmetry. Traditional listing directories track raw transaction counts and social metrics — both of which are trivially looped or purchased.

ORDO solves this by establishing an objective, institutional verification tier:

* **Permissionless Registration, Selective Rating:** Any developer can register an agent contract (`0 Key - Registered`), but earning 1, 2, or 3 Keys requires passing quantitative verification thresholds.
* **x402 Qualified Settlement Filtering:** Algorithmic wash-trade filtering to distinguish organic commercial demand from self-funded loop transactions.
* **ERC-8004 Identity & Capability Audit:** On-chain resolution of `agentId` and `tokenURI` declarations versus actual executed contract bytecode.
* **Anti-Collusion Editorial Gate:** Automated detection of conflict logs and editorial review boundaries before any dossier goes live.

---

## 📐 Architecture & Pipeline

ORDO operates as a multi-stage data ingestion, verification, and editorial pipeline:

```
[Agent Submission] ──> [Sanity Verifier] ──> [Data Ingestion Pipeline]
                                                    │
                                                    ▼
[ORDO Key Badge] <── [Human Editorial] <── [Versioned Scoring Engine]
   (Live SVG)            Gate (Veto)           (4 Rubric Dimensions)
```

### Core Components

| Component | Function |
|---|---|
| **Sanity Verifier** | Instant on-chain contract validation, signature verification, and social handle resolution |
| **Ingestion Pipeline** | Automated snapshots of GitHub commits, active address telemetry, and x402 settlement events |
| **Scoring Engine** | Versioned quantitative rubric measuring Security Posture, Developer Maintenance, Telemetry, & Identity |
| **Dossier Synthesizer** | Automated LLM-assisted assembly of comprehensive Markdown dossiers from verifiable evidence |
| **Editorial Gate** | Human editorial review with automated conflict-of-interest detection and 48-hour Right of Reply tracking |
| **Dynamic Badge Server** | Real-time SVG badge generator (`/api/badge/:agentSlug`) rendering instant verification status |

---

## 🔑 The ORDO Key Rubric

Agents are evaluated across 4 quantitative dimensions (scaled 0 – 100):

| Dimension | Max Weight | Key Verification Focus |
|---|---|---|
| **Security Posture** | 25 pts | Audits, multisig timelocks, admin key retention, and proxy upgradeability |
| **Developer Maintenance** | 25 pts | 30d/90d repository commit activity, issue responsiveness, and active maintainers |
| **On-Chain Telemetry** | 25 pts | Qualified x402 settlement volume, deduplicated active addresses, and 90-day retention |
| **Identity & Standards** | 25 pts | ERC-8004 compliance, URI declaration parity, and verified operator metadata |

### Key Tier Distribution (Michelin Model)

```
Score: 90 - 100  ──►  🔑🔑🔑 3 Keys   (Industry Benchmark)
Score: 80 - 89   ──►  🔑🔑   2 Keys   (Exemplary Quality)
Score: 65 - 79   ──►  🔑     1 Key    (Notable Achievement)
Score: < 65      ──►  ⚪     0 Keys   (Registered Only)
```

---

## 📊 Metrics & Telemetry Tiers

To prevent manipulation, ORDO ranks data signals strictly by their cost to fake:

* **Tier 1 (Heavy Weight — Expensive to Fake):** Qualified x402 settlement volume (2-hop treasury trace & circular flow filtered), 30d/90d deduplicated active addresses, and monthly cohort retention.
* **Tier 2 (Moderate Weight — Verifiable):** ERC-8004 `tokenURI` capability parity, developer commit cadence, audit verification logs.
* **Tier 3 (Zero Weight — Display Only):** Social media follower counts, Telegram/Discord size, and unverified reputation posts.

---

## 📁 Repository Structure

```
├── backend/            # NestJS Backend API & Worker Engine
│   ├── src/
│   │   ├── agents/     # Agent service, ingest pipeline & scoring logic
│   │   ├── editorial/  # Dossier synthesizer & editorial gate workflow
│   │   ├── prisma/     # Prisma ORM schema & migrations
│   │   └── queue/      # Redis / BullMQ background ingest queue
│   └── package.json
├── src/                # React + Vite + TypeScript Frontend Application
│   ├── App.tsx         # Main application router & ratings view
│   ├── RatingAgents.tsx# Interactive Dossier Modal & Ratings Grid
│   └── index.css       # Design system & dark-mode styling
├── public/             # Static assets, chain icons, & project banner
├── docs/               # System architecture & PM brief documentation
└── README.md           # Project documentation
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19, Vite 8, TypeScript
- **Animations:** Framer Motion (Smooth page transitions, rotating hero backdrop dial, 0-to-target CountUp numbers, and dynamic score meters)
- **Styling:** Custom Editorial CSS Design System (Glassmorphism & High-Contrast Typography)
- **Icons & Visuals:** Custom SVG Badges, Dynamic Favicon Resolver

### Backend
- **Framework:** NestJS (Node.js TypeScript)
- **Database:** PostgreSQL with Prisma ORM
- **Async Queue:** Redis + BullMQ
- **Blockchain Interop:** Viem (EVM Chain RPC) & Ethers v6
- **AI Synthesis:** OpenAI Node.js SDK

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Redis (v6+)

### Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/KingofSpades-dev/OrdoKey.git
   cd OrdoKey
   ```

2. **Setup Frontend:**
   ```bash
   npm install
   npm run dev
   ```

3. **Setup Backend:**
   ```bash
   cd backend
   npm install
   ```

4. **Configure Environment (`backend/.env`):**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5400/ordo?schema=public"
   REDIS_URL="redis://localhost:6379"
   OPENAI_API_KEY="your-openai-api-key"
   GITHUB_PAT="your-github-personal-access-token"
   ```

5. **Run Migrations & Start Backend:**
   ```bash
   npx prisma migrate dev
   npm run start:dev
   ```

---

## 🛡️ Dynamic Verification Badges

ORDO provides real-time SVG badges for agent developers to embed directly in their documentation or GitHub repos:

```markdown
![ORDO Verified](https://ordokey.tech/api/badge/moltbook)
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
