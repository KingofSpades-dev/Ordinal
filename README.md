<div align="center">

![ORDO Banner](./public/ordo-banner.png)

# ORDINAL (ORDO)

**Selective Reputation & Verification Layer for Autonomous Web3 AI Agents**

*Screen the contract. Verify the telemetry. Audit the code. Award the Keys.*

[![Standard](https://img.shields.io/badge/Standard-ERC--8004%20·%20x402-38C172?style=flat-square&labelColor=0A0F0C)](#-metrics--telemetry-tiers)
[![Runtime](https://img.shields.io/badge/Runtime-React%2019%20·%20Vite%208%20·%20NestJS%20·%20TypeScript-E9E4D6?style=flat-square&labelColor=0A0F0C)](#-tech-stack)
[![Animations](https://img.shields.io/badge/Animations-Framer%20Motion%2012-FF4081?style=flat-square&labelColor=0A0F0C)](#-frontend-features)
[![Rubric](https://img.shields.io/badge/Rubric-Michelin%20Standard-E0A82E?style=flat-square&labelColor=0A0F0C)](#-the-ordo-key-rubric)
[![X (Twitter)](https://img.shields.io/badge/X-@OrdoKeyRank-000000?style=flat-square&logo=x&logoColor=white)](https://x.com/OrdoKeyRank)
[![GitHub](https://img.shields.io/badge/GitHub-KingofSpades--dev/OrdoKey-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/KingofSpades-dev/OrdoKey)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square&labelColor=0A0F0C)](#-license)

</div>

---

ORDINAL (ORDO) is an institutional-grade reputation, rating, and dossier verification engine built specifically for autonomous AI agents on-chain. 

Inspired by the **Michelin Guide** model: registration is permissionless and open to all agents, but earning an **ORDO Key** (1, 2, or 3 Keys) is exceptionally rare — governed by automated telemetry verification, multi-factor scoring rubrics, wash-trade filtered settlement metrics, and a strict human editorial gate.

---

## 🏛️ Core Value Proposition

In an ecosystem flooded with thousands of autonomous AI agents, tokenized bots, and automated liquidity managers, users and capital protocols face severe information asymmetry. Traditional listing directories track raw transaction counts and social metrics — both of which are trivially looped or purchased.

ORDINAL solves this by establishing an objective, institutional verification tier:

* **Permissionless Registration, Selective Rating:** Any developer can submit an agent contract (`0 Key - Registered`), but earning 1, 2, or 3 Keys requires passing quantitative verification thresholds.
* **x402 Qualified Settlement Filtering:** Algorithmic wash-trade filtering to distinguish organic commercial demand from self-funded loop transactions.
* **ERC-8004 Identity & Capability Audit:** On-chain resolution of `agentId` and `tokenURI` declarations versus actual executed contract bytecode.
* **Append-Only Public Build Log:** Complete transparency across all parameter recalibrations, system deployments, and telemetry corrections.

---

## 🖥️ Pages & Application Views

The frontend web application provides a comprehensive suite of views built with **React 19**, **TypeScript**, and **Framer Motion**:

1. **The Index (Home Page):**
   - Continuous 360° rotating dial visual backdrop loop in the hero section.
   - Live Count-Up stats ledger (`0` $\rightarrow$ `53` agents, `0%` $\rightarrow$ `13%` watchlisted, `$0` paid placements).
   - "The Next 30" (Class of 2026) featured honorees grid with 3D tilt hover physics.
   - Interactive Agent Detail Dossier Modal with animated score meters.

2. **Rankings Leaderboard (`/rankings`):**
   - Full live database coverage with filter controls (*★ The Under 30*, *Verified*, *Top Movers*, *Watchlist*, *Newly Indexed*).
   - Real-time search by agent name, chain, category, or blurb.
   - Staggered entrance animations on table rows and interactive hover highlights.

3. **Get Listed Evaluation Pipeline (`/apply`):**
   - Live provisional rating calculator across the 4 audit dimensions.
   - Instant contract telemetry diagnostics & submit form.
   - Animated submission confirmation alert banner (`AnimatePresence`).

4. **Audit Rubric & Methodology (`/methodology`):**
   - Breakdown of the 4 weighted audit criteria.
   - Key Awards Tier System details (3 Keys Benchmark Grade, 2 Keys Exemplary, 1 Key Notable).

5. **Public Build Log (`/log`):**
   - Append-only audit trail recording chronological system deployments and parameter recalibrations.
   - Count-Up metrics for total logged deployments and corrections.

6. **Qualified Volume Specification (`/qualified`):**
   - Institutional telemetry specification for wash-trade filtering.
   - Interactive roadmap tracking pipeline development stages from Stage 01 to Stage 06.

7. **Dossier Reports Catalog (`/reports`):**
   - Deep-dive risk research dossiers with key verification badges and risk registers.

---

## 🔑 The ORDO Key Rubric

Agents are evaluated across 4 quantitative dimensions (scaled 0 – 100):

| Dimension | Max Weight | Key Verification Focus |
|---|---|---|
| **Disclosure Completeness** | 30% | Published strategy, custody model, and permission scope before holding funds |
| **On-Chain Consistency** | 35% | Transaction history matching stated strategy and risk limits over time |
| **Incident Response** | 20% | Operator speed, transparency, and mitigation handling during past exploits or bugs |
| **Independence of Code** | 15% | Auditable logic distinct from a black-box wrapper around an undocumented prompt |

### Key Tier Distribution (Michelin Model)

```
Score: 90 - 100  ──►  🔑🔑🔑 3 Keys   (Industry Benchmark Grade)
Score: 80 - 89   ──►  🔑🔑   2 Keys   (Exemplary Quality)
Score: 65 - 79   ──►  🔑     1 Key    (Notable Achievement)
Score: < 65      ──►  ⚪     0 Keys   (Registered Only)
```

---

## 📁 Repository Structure

```
├── backend/                    # NestJS Backend API & Worker Engine
│   ├── src/
│   │   ├── agents/             # Agent service, ingest pipeline & scoring logic
│   │   ├── editorial/          # Dossier synthesizer & editorial gate workflow
│   │   ├── prisma/             # Prisma ORM schema & migrations
│   │   └── queue/              # Redis / BullMQ background ingest queue
│   └── package.json
├── src/                        # React + Vite + TypeScript Frontend Application
│   ├── components/
│   │   ├── AgentAvatar.tsx     # Dynamic favicon & Web3 high-res logo resolver with spring scale
│   │   ├── CountUpNumber.tsx   # Framer Motion 0-to-target count-up number animation component
│   │   └── OrdinalNavbar.tsx   # Top masthead navigation with active tab indicator & hover gestures
│   ├── views/
│   │   ├── RankingsView.tsx    # Live Leaderboard table with filter tabs & search
│   │   ├── GetListedView.tsx   # Agent submission & live rating calculator pipeline
│   │   ├── MethodologyView.tsx # 4-part audit rubric & 3-key tier standards
│   │   ├── BuildLogView.tsx    # Append-only public change register & deployments log
│   │   └── QualifiedNoticeView.tsx # Wash-trade filter pipeline & telemetry specification
│   ├── editorial/
│   │   └── ReportDetailView.tsx# Comprehensive research dossier catalog & risk audit breakdown
│   ├── data/
│   │   └── agentDatabase.ts    # Hybrid database layer with local persistence & API sync
│   ├── App.tsx                 # Main application router & homepage cover story
│   ├── index.css               # Custom Editorial CSS design system & typography tokens
│   └── main.tsx                # Client mounting point
├── public/                     # Static assets, chain icons, & project banner image
├── docs/                       # System architecture & PM brief documentation
└── README.md                   # Project documentation
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19, Vite 8, TypeScript
- **Animations:** Framer Motion (Smooth page transitions, rotating hero backdrop dial, 0-to-target CountUp numbers, and dynamic score meters)
- **Styling:** Custom Editorial CSS Design System (Glassmorphism, High-Contrast Serif & Monospace Typography)
- **Icons & Visuals:** Custom SVG Badges, Google Favicons & DuckDuckGo Favicon Fallback Resolver

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

ORDINAL provides real-time SVG badges for agent developers to embed directly in their documentation or GitHub repos:

```markdown
![ORDINAL Verified](https://ordokey.tech/api/badge/moltbook)
```

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
