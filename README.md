# Execution Timing Simulator ⚡️

> An interactive, real-time browser tool for visualizing and comparing JavaScript execution timing and event rate control patterns: **Debounce**, **Throttle**, **Rate Limit**, **Async Queue**, and **Batching**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/atapas/execution-timing-simulator)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-analyzer.tapascript.io-teal?style=for-the-badge&logo=vercel)](https://analyzer.tapascript.io/)
[![React 19](https://img.shields.io/badge/React-19.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

![Execution Timing Simulator Live Preview](./public/demo.png)

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [🌐 Deployment & Live Demo](#-deployment--live-demo)
- [✨ Key Features](#-key-features)
- [🧠 Timing Strategies Explained](#-timing-strategies-explained)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Running Locally](#installation--running-locally)
  - [Available Scripts](#available-scripts)
- [📂 Project Structure](#-project-structure)
- [🤝 How to Contribute](#-how-to-contribute)
  - [Development Workflow](#development-workflow)
  - [Reporting Issues & Requesting Features](#reporting-issues--requesting-features)
- [🫶 Author & Acknowledgments](#-author--acknowledgments)
- [📄 License](#-license)

---

## 💡 About the Project

High-frequency events like button clicks, window resizing, keystrokes, and scroll events can easily degrade application performance or trigger unwanted server load if left uncontrolled. 

**Execution Timing Simulator** is designed to demystify how senior developers handle rate limiting and event pacing. Built on top of HTML5 Canvas and powered by `@tanstack/react-pacer`, it renders real-time side-by-side timeline streams comparing raw user interactions against 5 core execution timing strategies.

Whether you're learning frontend performance optimization or deciding between debouncing vs. throttling for your next feature, this tool gives you instant visual feedback on dropped, delayed, and batched execution frames. It allows you to **pause time at any snapshot** and hover/tap on event dots to inspect execution latency ($\Delta t$) and pattern descriptions.

---

## 🌐 Deployment & Live Demo

The project is deployed and publicly accessible at:

🔗 **[https://analyzer.tapascript.io/](https://analyzer.tapascript.io/)**

The application is deployed using production-optimized static hosting with continuous integration directly from the `main` branch.

---

## ✨ Key Features

- **⚡ Real-Time HTML5 Canvas Visualizer**: Ultra-smooth sub-millisecond timeline rendering of incoming event streams.
- **🎛️ Side-by-Side Strategy Comparison**: Simultaneously observe how 5 distinct timing algorithms respond to identical input triggers.
- **💥 Single & Burst Fire Simulation**: Click manually or trigger rapid event bursts to simulate real-world rapid user actions.
- **⏸️ Pause & Inspect**: Snapshot the timeline at any moment to freeze time and inspect execution spacing.
- **⏱️ Adjustable Time Window**: Customize the visual timeline scale (from 2 seconds up to 10 seconds).
- **📚 Interactive Pattern Documentation**: In-app architectural guide detailing use cases, parameters, and tradeoffs for each timing pattern.

---

## 🧠 Timing Strategies Explained

| Strategy | Behavior | Typical Use Cases |
| :--- | :--- | :--- |
| **Raw Events** | Fires execution immediately on every event trigger without delay or filtering. | Baseline benchmark. |
| **Debounce** | Delays execution until events stop firing for a specified quiet period (`wait: 500ms`). | Search auto-complete inputs, auto-save drafts, window resize handlers. |
| **Throttle** | Guarantees execution at most once per fixed time interval (`wait: 500ms`). | Scroll position tracking, drag & drop move events, button spam protection. |
| **Rate Limit** | Limits total executions to $N$ calls within a fixed time window (`limit: 3`, `window: 2000ms`). | API rate budgeting, payment button throttling, third-party SDK call caps. |
| **Async Queue** | Queues incoming events and executes them sequentially with controlled concurrency (`concurrency: 1`). | Serial network requests, sequential animation playback, ordered file uploads. |
| **Batching** | Collects multiple triggers until a maximum batch size or timeout is reached (`maxSize: 5`, `wait: 1000ms`). | Bulk database inserts, batch analytics logging, grouped WebSocket sends. |

---

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript, HTML5 Canvas
- **Pacing Engine**: [`@tanstack/react-pacer`](https://tanstack.com/pacer)
- **Styling**: Tailwind CSS v4, PostCSS, Lucide Icons, Geist Font
- **Build Tooling**: Vite 5, ESLint
- **Package Manager**: npm / yarn

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher (v20+ recommended)
- **npm** (v9+) or **yarn** (v1.22+)

### Installation & Running Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/atapas/execution-timing-simulator.git
   cd execution-timing-simulator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:5173` to see the app running locally.

### Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement (HMR). |
| `npm run build` | Runs TypeScript type checks (`tsc`) and builds the production bundle in `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs ESLint to check for code quality and formatting issues. |

---

## 📂 Project Structure

```text
execution-timing-simulator/
├── public/                 # Static public assets (favicons, icons)
├── src/
│   ├── components/         # Reusable UI components (buttons, modals, dialogs)
│   ├── lib/                # Utility helpers and styling utilities
│   ├── App.css             # Component layout styles
│   ├── App.tsx             # Root React Application
│   ├── CanvasTimeline.tsx  # Canvas-based real-time timeline visualizer
│   ├── DocsModal.tsx       # Documentation and pattern educational modal
│   ├── ExecutionSimulator.tsx # Main simulation state controller & Pacer hooks
│   ├── index.css           # Tailwind CSS imports & global design tokens
│   └── main.tsx            # React application entry point
├── .eslintrc.cjs           # ESLint configuration
├── index.html              # Main HTML entry file with SEO & JSON-LD metadata
├── postcss.config.js       # PostCSS configuration for Tailwind v4
├── package.json            # Project dependencies and npm scripts
├── tsconfig.json           # TypeScript root configuration
└── vite.config.ts          # Vite build configuration
```

---

## 🤝 How to Contribute

Contributions are what make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

### Development Workflow

1. **Fork the Repository** on GitHub (`https://github.com/atapas/execution-timing-simulator`).
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/execution-timing-simulator.git
   cd execution-timing-simulator
   ```
3. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make Your Changes**: Add your feature, improvement, or bug fix.
5. **Run Lint & Build Checks**:
   ```bash
   npm run lint
   npm run build
   ```
   Ensure there are no TypeScript or ESLint errors.
6. **Commit Your Changes**:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
7. **Push to Your Branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**: Go to the original repository and open a PR with a clear summary of your changes.

### Reporting Issues & Requesting Features

Found a bug or have an idea for an enhancement? Please search existing [GitHub Issues](https://github.com/atapas/execution-timing-simulator/issues) first. If it's not already reported:
- Open a **Bug Report** with steps to reproduce.
- Open a **Feature Request** describing the context and proposed improvement.

---

## 🫶 Author & Acknowledgments

Created with ❤️ by **Tapas Adhikary** ([tapaScript](https://youtube.com/@tapasadhikary)).

- 🎥 **YouTube**: [tapaScript on YouTube](https://youtube.com/@tapasadhikary)
- 🐦 **X / Twitter**: [@tapasadhikary](https://twitter.com/tapasadhikary)
- 💖 **Sponsor**: Support my open-source work on [GitHub Sponsors](https://github.com/sponsors/atapas)

---

## 📄 License

Distributed under the **MIT License**.

