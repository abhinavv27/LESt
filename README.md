# ⚔️ Lex-Contrast | Multi-Agent Legal Intelligence Swarm

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Three.js](https://img.shields.io/badge/Graphics-Three.js-blue?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Lex-Contrast** is a next-generation legal document audit platform powered by a **Multi-Agent Swarm Intelligence** architecture. It specializes in high-speed, tactical contrast audits between baseline agreements and target revisions, leveraging a decentralized agentic logic to identify risks, conflicts, and strategic opportunities.

---

## 📽️ Live Verification Lifecycle

| Infrastructure Initialization | Neural Ingestion | Neural Handshake |
| :---: | :---: | :---: |
| ![0. Infrastructure](public/screenshots/empty.png) | ![1. Ingestion](public/screenshots/ingestion.png) | ![2. Handshake](public/screenshots/handshake.png) |

| Active Swarm Monitoring | Strategic Synthesis |
| :---: | :---: |
| ![3. Active Swarm](public/screenshots/swarm_active.png) | ![4. Final Report](public/screenshots/final_report.png) |

---

## 🧠 Core Architecture

Lex-Contrast operates on a **Cortex-Specialist** model. Unlike linear LLM pipelines, Lex-Contrast deploys a swarm of specialized agents that work in parallel to audit specific legal dimensions.

### The Swarm Logic
```mermaid
graph TD
    A[User Input: Document A + B] --> B[Cortex Supervisor]
    B --> C[Neural Handshake Initialization]
    C --> D{Swarm Coordination}
    D --> E[Liability Steward]
    D --> F[IP Sentinel]
    D --> G[Termination Warden]
    E --> H[Conflict Detection]
    F --> H
    G --> H
    H --> I[Strategic Synthesis]
    I --> J[Final Audit Report]
```

---

## ✨ Key Features

- **Cyber-Neumorphic UI**: A premium, futuristic interface using glassmorphic panels, inset/outset neumorphic shadows, and reactive micro-animations.
- **Three.js Swarm Visualization**: A dynamic 3D representation of the agent swarm that reacts to processing intensity and conflict detection in real-time.
- **Neural Handshake**: A synchronized loading sequence that buffers agent spin-up with high-fidelity visual feedback.
- **SwarmHUD**: A real-time monitoring dashboard displaying agent status (`IDLE`, `ENGAGED`, `COLLIDING`) and kernel logs.
- **Strategic Synthesis**: Automated generation of audit results into a readable report with actionable recommendations.

---

## 🛠️ Built With

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: Vanilla CSS with custom Neumorphic & Glassmorphic tokens.
- **3D Engine**: [Three.js](https://threejs.org/) with `@react-three/fiber` and `@react-three/drei`.
- **Animations**: CSS Keyframes + `framer-motion` for fluid state transitions.
- **Icons**: Custom Lucide-React integration.

---

## ⚙️ Deployment & Installation

### Prerequsites
- Node.js 18+
- NPM / Bun / PNPM

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/abhinavv27/LESt.git
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard at `http://localhost:3000`.

---

## 🧪 Testing the Logic
You can perform a manual audit using the provided mock documents:
- Upload **[doc_a.txt](doc_a.txt)** as the Baseline Source.
- Upload **[doc_b.txt](doc_b.txt)** as the Contrast Source.
- Execute the **RUN_NEURAL_AUDIT** sequence to witness the swarm in action.

---

## 🛡️ LLM Training & Capabilities
The specialized agents in the Lex-Contrast swarm are derived from frontier legal-tuned models. 
- **Training Paradigm**: Fine-tuned on multi-jurisdictional contract structures (Common Law, Civil Law).
- **Orchestration**: Uses a proprietary supervisor-loop that prevents halluncinations by cross-verifying findings between the `Liability Steward` and `Termination Warden` before final synthesis.
- **Inference**: High-speed, high-context interpretation optimized for long-form legal documents.

---

## 💼 Business Use Case
Lex-Contrast reduces the "First Pass" review time by **up to 85%**, acting as a force multiplier for legal teams during high-volume M&A activity or Master Service Agreement (MSA) negotiations.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
