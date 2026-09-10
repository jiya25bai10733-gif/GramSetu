# GramSetu — Antigravity Team Workspace Guidelines

Welcome to the **GramSetu (Awaaz se Samadhan)** project!
This file (`AGENTS.md`) is automatically read by **Google Antigravity** whenever any team member opens this workspace. It instructs Antigravity on project conventions, architecture, and collaboration rules.

---

## 1. Project Overview & Architecture

GramSetu is a unified citizen & official civic grievance redressal system for rural and semi-urban panchayats.

- **Frontend Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` + `@import "tailwindcss";`)
- **Icons**: `lucide-react`
- **GIS Maps**: `leaflet` + `react-leaflet` (with OpenStreetMap and ESRI World Satellite imagery layers)
- **Audio & Speech**: Web Audio API (`AudioContext`, `AnalyserNode`), `MediaRecorder`, and Web Speech API (`SpeechRecognition`)
- **State Management**: React Context API (`src/context/AppContext.tsx`) backed by `localStorage` persistence

---

## 2. Directory Structure

```
src/
├── components/
│   ├── auth/
│   │   └── CommonLogin.tsx            # Unified login with Citizen/Official switcher
│   ├── citizen/
│   │   ├── CitizenHome.tsx            # Citizen dashboard + live microphone recording
│   │   ├── CitizenReportIssue.tsx     # Voice dictation & Leaflet GPS pin-dropping
│   │   ├── CitizenMap.tsx             # Interactive GIS Ward Community Map
│   │   ├── CitizenIssueTracking.tsx   # 6-step resolution timeline & verification
│   │   └── CitizenProfile.tsx         # Citizen user credentials & statistics
│   ├── official/
│   │   ├── OfficialDashboard.tsx      # Panchayat Command & GIS telemetry feed
│   │   ├── OfficialMap.tsx            # Full GIS Jurisdictional Telemetry Map
│   │   ├── OfficialIssueDetail.tsx    # Incident dossier (#1245) & field verification
│   │   ├── OfficialActivity.tsx       # Live audit stream & blockchain ledger
│   │   ├── OfficialCommunityIssues.tsx# AI similarity clustering engine
│   │   ├── OfficialEscalations.tsx    # 4-tier administrative hierarchy
│   │   └── OfficialProfile.tsx        # Ramesh Sharma credentials & jurisdiction
│   └── common/
│       ├── Header.tsx                 # Top navigation banner with role switcher
│       └── BottomNav.tsx              # Citizen mobile bottom navigation bar
├── context/
│   └── AppContext.tsx                 # Central reactive data store & AI matcher
├── data/
│   └── mockData.ts                    # Real coordinates & district telemetry data
├── types/
│   └── index.ts                       # TypeScript interfaces and data contracts
├── App.tsx                            # Root application routing
└── main.tsx                           # React 19 DOM entry point
```

---

## 3. Team Collaboration & Git Conventions

When working as a group on Antigravity:
1. **Never work directly on `main`**: Always create a feature branch:
   - `git checkout -b feature/your-feature-name`
2. **Run build check before pushing**:
   - Always run `npm run build` to confirm **zero TypeScript/Vite errors**.
3. **Keep Antigravity in the Loop**:
   - Ask Antigravity to review your changes before committing:
     *"Antigravity, check if my changes pass `npm run build` and follow the project design."*

---

## 4. Engineering Rules for Agents & Developers

- **Maintain Real Hardware APIs**: Never replace live microphone (`navigator.mediaDevices.getUserMedia`) or real GPS (`navigator.geolocation`) with static/mocked values.
- **Maintain Tailwind v4 Compatibility**: Do not add legacy `tailwind.config.js` unless migrating deliberately.
- **Strict Typing**: Always update `src/types/index.ts` if extending data models.
