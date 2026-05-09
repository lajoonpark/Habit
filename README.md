# Habit Tracker

A gamified habit tracker web app built with Next.js, TypeScript, and Tailwind CSS.

## Features
- Daily habit checklist with XP rewards
- **Custom habit schedules** — set each habit to run on specific days of the week (e.g. Mon/Wed/Fri)
- Level up system with XP progression
- 7 ranks: Bronze → Silver → Gold → Platinum → Diamond → Master → Legend
- Streak tracking with freeze protection (schedule-aware: skipped non-scheduled days don't break streaks)
- Daily quests for bonus XP (based only on habits scheduled for today)
- Achievements system
- Fully local (no backend required)

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## Tech Stack
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **LocalStorage** - Data persistence (no backend needed)

## Future Enhancements
- Supabase backend for cloud sync
- User authentication
- Social features and leaderboards
- Mobile app with React Native
