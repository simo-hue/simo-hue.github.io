---
title: "Wealth Compass"
description: "A comprehensive Personal Finance OS built to track Net Worth, Investments, and daily Cash Flow in one place. Powered by React, Vite, and Shadcn UI."
slug: wealth-compass
date: 2026-01-19
image: image.webp
draft: false
categories: ["tech projects"]
tags:
    - React
    - TypeScript
    - Tailwind CSS
    - Finance
    - Data Visualization
comments: false

links:
  - title: GitHub Repository
    description: Access full source code
    website: https://github.com/simo-hue/wealth-compass
---

**Wealth Compass** is my personal "Financial Operating System," born from the need to have a single, truthful source for all my financial data. While there are many apps for expense tracking or investment portfolio management, I wanted a solution that unified both worlds—giving me a real-time picture of my total **Net Worth**.

## The Problem

Managing personal finances often involves jumping between banking apps, brokerages, and crypto wallets. Spreadsheets are great but require constant manual updates. I needed a dashboard that:
1.  **Consolidates Everything**: From daily coffee expenses to long-term ETF holdings.
2.  **Tracks Net Worth**: A live calculation of Assets (Cash + Investments + Crypto) minus Liabilities.
3.  **Monitors Cash Flow**: Understanding monthly "burn rate" and savings rate clearly.
4.  **Privacy First**: A self-hosted or local-first approach where I own the data.

## The Solution: Wealth Compass

I built Wealth Compass as a modern web application using **React**, **TypeScript**, and **Vite**. It's designed to be fast, responsive, and visually stunning using **Shadcn UI** and **Tailwind CSS**.

### Key Features

#### 1. The Command Center (Dashboard)
The dashboard provides an immediate health check of my finances.
-   **Net Worth Card**: The single most important metric.
-   **Liquidity Tracking**: Shows exactly how much "dry powder" is available.
-   **Live Asset Updates**: I implemented a "Global Refresh" feature that fetches the latest stock and crypto prices to keep valuations current.

#### 2. Cash Flow Engine
Detailed tracking of income and expenses.
-   **Categorization**: Transactions are tagged (e.g., "Housing", "Salary", "Dividends") to visualize spending habits.
-   **Analytics**: Automatic calculation of Monthly Income, Expenses, and—crucially—**Savings Rate**.
-   **Privacy Mode**: A toggle to blur all sensitive numbers when working in public or sharing screenshots.

#### 3. Investment Portfolio
A deep dive into specific holdings.
-   **Stocks & ETFs**: Tracks quantity, cost basis, and current market value.
-   **Crypto**: specialized tracking for digital assets.
-   **Allocation**: Visual breakdown of portfolio by sector or asset class to ensure proper diversification.

#### 4. Future Planning
Includes a **FIRE (Financial Independence, Retire Early) Calculator** to project portfolio growth and estimate when work becomes optional based on current savings rates and expected returns.

## Tech Stack

This project was a playground to implement best practices in modern frontend development:
-   **Frontend**: React (Vite) for blazing fast performance.
-   **Styling**: Tailwind CSS + Shadcn UI for a premium, dark-mode-first aesthetic.
-   **Data Viz**: Recharts for beautiful financial trend lines and allocation pies.
-   **State Management**: React Context for managing global financial state and user settings.
-   **Backend**: Supabase (PostgreSQL) for secure and persistent data storage.

Wealth Compass isn't just a tracker; it's a tool that helps me make better financial decisions by making the data visible, beautiful, and actionable.
