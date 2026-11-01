# MEMORA AI — Explainable AI-Based Adaptive Cognitive Gaming & Memory Assistance Platform

> **Mandatory Medical Disclaimer:** MEMORA AI is a supportive cognitive engagement tool and memory aid. It is not a medical device and does not diagnose, treat, or measure clinical dementia progression.

---

## 🌟 Executive Overview
**MEMORA AI** is an accessible, dignified web platform engineered specifically for older adults experiencing mild-to-moderate cognitive changes, as well as their dedicated caregivers and families. Built with warm, accessible typography, high-contrast visual cues, Web Audio synthesized calming acoustic frequencies, Web Speech Text-to-Speech (TTS), and a fully transparent **Explainable AI (XAI)** recommendation engine.

---

## 🏗️ System Architecture & Tech Stack

- **Frontend:** React 18 (TypeScript), Vite 5, Tailwind CSS
- **Icons & UI:** Lucide React, Canvas Confetti
- **Analytics & Visualizations:** Recharts (Line Charts, Bar Charts, Donut/Pie Charts)
- **Audio Synthesizer:** Native Web Audio API synth (custom harmonic chords, non-punishing gentle prompt frequencies)
- **Voice Guidance:** Web Speech API TTS (cadenced at 0.9x speed for older adults)
- **State & Persistence:** LocalStorage-backed reactive client data store simulating an SQLite relational schema
- **XAI Engine:** Heuristic multi-factor decision engine providing transparent feature importance weights and clinical rationales

```
memora-ai/
├── src/
│   ├── types/
│   │   └── index.ts                 # Strongly-typed domain models
│   ├── services/
│   │   ├── soundService.ts          # Calming Web Audio API synthesizer
│   │   ├── speechService.ts         # Natural Text-to-Speech narration
│   │   ├── storageService.ts        # Relational schema & seed database
│   │   └── xaiEngine.ts             # Explainable AI heuristic model
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.tsx           # Logo, clock, accessibility controls
│   │   │   ├── DisclaimerBanner.tsx # Mandatory medical disclaimers
│   │   │   └── Footer.tsx           # Supportive contact & notices
│   │   ├── Common/
│   │   │   ├── AccessibleButton.tsx # Large touch targets (min 48-64px)
│   │   │   ├── FeedbackModal.tsx    # 4-choice comfort feedback & stats
│   │   │   └── XAIExplanationCard.tsx # Visual feature importance breakdown
│   │   ├── Games/
│   │   │   ├── PictureMatchingGame.tsx   # Visuospatial recall (4x2, 4x3, 4x4)
│   │   │   ├── SequenceMemoryGame.tsx    # Working memory (3, 4, 5 harmonic steps)
│   │   │   └── ObjectRecognitionGame.tsx # Semantic nostalgia recall (3, 5, 7 items)
│   │   ├── MemoryCards/
│   │   │   ├── MemoryCardsList.tsx       # Flip mode, quiz practice, voice read
│   │   │   └── AddMemoryCardModal.tsx    # Photo presets & custom memories
│   │   ├── Reminders/
│   │   │   ├── RemindersList.tsx         # Checklist with bell chimes & filters
│   │   │   └── AddReminderModal.tsx      # Time, category, notes
│   │   └── Caregiver/
│   │       ├── AnalyticsCharts.tsx       # Recharts Line, Bar, Pie charts
│   │       ├── SessionHistoryTable.tsx   # Searchable audit logs
│   │       └── ClinicalReportModal.tsx   # Printable/exportable consultation report
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── GamesHubPage.tsx
│   │   ├── MemoryCardsPage.tsx
│   │   ├── RemindersPage.tsx
│   │   └── CaregiverPage.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

---

## 🎮 Playable Cognitive Games

### 1. Picture Matching (Visuospatial Memory & Attention)
- **Difficulty Tiers:**
  - Easy: 4 pairs (8 cards, 4x2 grid)
  - Medium: 6 pairs (12 cards, 4x3 grid)
  - Hard: 8 pairs (16 cards, 4x4 grid)
- **Features:** Card flip animations, hint button to briefly preview unmatched cards, gentle acoustic triad chords on matching, attempts & duration tracking.

### 2. Sequence Memory (Working Memory & Auditory Attention)
- **Difficulty Tiers:**
  - Easy: 3-step sequence
  - Medium: 4-step sequence
  - Hard: 5-step sequence
- **Features:** Large tactile shape pads (Sunbeam Star, Ocean Circle, Forest Diamond, Rose Heart) with pentatonic harmonic frequencies, unhurried playback, gentle non-punishing retry, and Replay hint button.

### 3. Object Recognition (Semantic Memory & Nostalgic Reminiscence)
- **Difficulty Tiers:**
  - Easy: 3 items
  - Medium: 5 items
  - Hard: 7 items
- **Features:** High-resolution illustrations & icons of beloved vintage items (Porcelain Teapot, Rotary Phone, Antique Sewing Machine, Wooden Radio, Grandfather Clock, Fountain Pen, Rocking Chair) with historical trivia and comforting clue hints.

---

## 🧠 Explainable AI (XAI) Recommendation Engine

The adaptive engine analyzes the participant's last 5 sessions without requiring external opaque black-box models:
1. **Inputs Analyzed:**
   - Recall accuracy (%) & attempt ratios
   - Hint reliance (hints per game)
   - Cognitive pacing (duration seconds relative to benchmark)
   - User self-reported comfort: *"Comfortable"*, *"Too Easy"*, *"Too Difficult"*, *"I Want a Break"*
   - Domain balancing across Visuospatial, Working Memory, and Semantic Recall
2. **Outputs:**
   - Next Suggested Game & Target Difficulty
   - Plain-language rationale for the older adult
   - Clinical rationale explaining cognitive load balancing for the caregiver
   - Visual Feature Importance meter with direction indicators (`↑`, `↓`, `—`)
   - Interactive overrides: accept recommendation, adjust difficulty, or pick manually

---

## ♿ Accessibility & Senior-Friendly Design

- **Typography Scaling:** Normal, Large, and Extra Large font sizes toggled with one click.
- **Voice Guidance (TTS):** Reads instructions, question clues, memory stories, and recommendations aloud.
- **Auditory Synthesizer:** Custom harmonic acoustic chords using the browser's Web Audio API (zero audio files needed).
- **High-Contrast Mode:** Enhances border visibility and color separation for low-vision users.
- **Large Touch Targets:** 48px to 64px interactive buttons with clear focus states.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```
Access the application at `http://localhost:5173`.
