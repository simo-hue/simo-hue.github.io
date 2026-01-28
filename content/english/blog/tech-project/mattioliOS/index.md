---
title: "Mattioli.OS"
description: "A deep dive into how I created 'Mattioli.OS', an advanced Habit Tracker and Personal OS based on React, Supabase, and AI."
slug: mattioli-os
date: 2026-01-19
image: cover.webp
draft: false
categories: ["tech projects"]
tags:
    - React
    - Supabase
    - AI
    - Productivity
    - Open Source
comments: false

links:
  - title: GitHub Repository
    description: Access full source code and documentation
    website: https://github.com/simo-hue/mattioli.OS
  - title: Web App
    description: Try the Live Demo on the official site
    website: https://simo-hue.github.io/mattioli.OS/
---

> "We don't rise to the level of our goals. We fall to the level of our systems." — James Clear

Let's be honest: most productivity apps are... too much. Too complex, too rigid, or simply too expensive for what they offer. I spent years jumping from Notion to Todoist, from calendar appointments to Excel sheets, seeking the "perfect system".

Spoiler: it didn't exist. So I decided to build it.

Introducing **Mattioli.OS** (formerly known as Habit Tracker), an open-source personal operating system designed for those who want to master their discipline, own 100% of their data, and track their personal growth.

## 🧘 The Philosophy: Why Another Habit Tracker?

When I started designing Mattioli.OS, I had three non-negotiable principles in mind that were missing in commercial solutions:

1.  **Friction is the Enemy**: If it takes more than 2 seconds to log a habit, you won't do it. The interface must be immediate.
2.  **Absolute Privacy**: My habit data is personal. I don't want it sold or analyzed by third parties. With this system, the database is mine (on Supabase) and the code is transparent.
3.  **Aesthetics Matter**: If an app is ugly, you won't use it. I aimed for a modern, dark, responsive design that is a pleasure to look at every day.

## 💎 Key Features

What makes Mattioli.OS different from a simple spreadsheet?

### 1. Integrated AI Coach 🤖
It's not just a passive tracker. I integrated an **AI Coach** that analyzes your weekly data. If it sees you skipped the gym for 3 days in a row, it doesn't send a generic notification. It asks you *why*, analyzes patterns, and suggests strategies based on your historical data to get you back on track.

### 2. Advanced Statistics 📊
Numbers don't lie. The system generates GitHub-style heatmaps to visualize your annual consistency at a glance. You can see exactly which months you were most productive and correlate data to understand what works for you.
But that's not all; there are dedicated statistics pages for daily habits as well as for macro goals (long term).

### 3. Total Management (The "Second Brain") 🧠
Beyond habits, Mattioli.OS manages:
- **Long-Term Vision**: Define your annual goals and break them down into daily actions.
- **Task Management**: An integrated Todo system that communicates with your habits.

## 🛠 Tech Stack

For the developers out there, here's what's under the hood. I chose a modern and performant stack to ensure speed and scalability:

*   **Frontend**: React (Vite) for a lightning-fast user experience.
*   **Backend & Database**: Supabase (PostgreSQL). Powerful, scalable, and with Row Level Security for maximum security.
*   **Styling**: TailwindCSS. For a rapid and consistent design system.
*   **State Management**: React Query (TanStack Query). To manage server-state synchronization without headaches.
*   **Hosting**: GitHub Pages (Frontend).

## 🔮 The Future

Mattioli.OS is a living project. I am constantly working to improve it. Upcoming features include deeper integration with external calendars and an even more customizable dashboard.

If you are a developer or a productivity enthusiast, I invite you to try the project. It's open-source, so you can fork it, modify it, and adapt it to your needs.

🔗 **[GitHub Repository](https://github.com/simo-hue/mattioli.OS)**
🔗 **[Live Demo](https://simo-hue.github.io/mattioli.OS/)**

Build your system. Raise your standards.
