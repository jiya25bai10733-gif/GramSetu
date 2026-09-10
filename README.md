# GramSetu — Awaaz se Samadhan (आवाज़ से समाधान)

> **Unified Citizen Grievance Redressal & Panchayat Command System**
> Built with React 19, TypeScript, Tailwind CSS v4, Leaflet GIS, Web Speech API, and Google Antigravity.

---

## 👥 Group Project & Team Setup

This repository is configured so that **all team members can collaborate seamlessly using Google Antigravity**.

### Quick Start for Team Members

1. **Clone the Repository**:
   ```bash
   git clone <YOUR-GITHUB-REPO-URL>
   cd GRAMSARTHI
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. **Verify TypeScript & Production Build**:
   ```bash
   npm run build
   ```

---

## 🤖 Working Together on Google Antigravity

Every team member using **Google Antigravity** benefits from shared workspace intelligence:

### 1. Auto-Configured Workspace (`AGENTS.md`)
- When any team member opens this folder in Google Antigravity, the AI automatically reads [AGENTS.md](./AGENTS.md).
- Antigravity will already understand the codebase architecture, UI design standards, Leaflet GIS integrations, and microphone handling without any repetitive prompting.

### 2. Recommended Git Branching Workflow
To prevent merge conflicts when collaborating in Antigravity:
```bash
# 1. Ensure you have the latest code
git pull origin main

# 2. Create your personal feature branch
git checkout -b feature/your-name-feature-title

# 3. Work on your feature with Antigravity
# (e.g., prompt Antigravity to build or refine a module)

# 4. Verify build before committing
npm run build

# 5. Commit and push to GitHub
git add .
git commit -m "feat: implement feature title"
git push origin feature/your-name-feature-title

# 6. Create a Pull Request (PR) on GitHub for your teammates to review
```

### 3. Suggested Group Work Breakdown

| Member | Module Focus | Key Files |
|---|---|---|
| **Member 1** | **Voice & Multilingual SpeechRedressal** | `CitizenHome.tsx`, `CitizenReportIssue.tsx` |
| **Member 2** | **GIS Maps & Live Telemetry** | `CitizenMap.tsx`, `OfficialMap.tsx` |
| **Member 3** | **Official Dossier & Incident Redressal** | `OfficialDashboard.tsx`, `OfficialIssueDetail.tsx` |
| **Member 4** | **AI Similarity Consolidation & Audit** | `OfficialCommunityIssues.tsx`, `OfficialActivity.tsx` |

---

## 🚀 Key Platform Features

- **Common Login**: Unified portal with role switcher for Citizens and Officials (`CommonLogin.tsx`).
- **Real-Time Microphone Recording**: Live Web Audio visualizer, Web Speech recognition, and `MediaRecorder` voice playback (`CitizenHome.tsx`).
- **Live GIS Telemetry**: Interactive Leaflet maps with satellite imagery (ESRI World Imagery) and device GPS detection (`CitizenMap.tsx`, `OfficialMap.tsx`).
- **Panchayat Command**: Ward-level metrics, SLA countdowns, and automated escalation hierarchies (`OfficialDashboard.tsx`, `OfficialEscalations.tsx`).
- **AI Community Similarity**: Normalizes regional dialects (e.g. Bundeli/Hindi) to cluster duplicate issues (`OfficialCommunityIssues.tsx`).

---

## 🛠️ Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Maps**: Leaflet + `react-leaflet` + ESRI Satellite Tiles + OpenStreetMap
- **Icons**: `lucide-react`
- **Audio**: Web Audio API (`AudioContext`, `AnalyserNode`) + Web Speech API
- **AI Pair Programming**: Google Antigravity
