import { useState, useEffect, useRef } from "react";

// Pangea brand colors — refined from real app screenshots
const C = {
  teal: "#00abc7",
  tealDark: "#008fa6",
  tealLight: "#E0F5F9",
  tealAccent: "#00c8e6",
  tealBanner: "#D4EEF2",   // Light teal banner bg from screenshots
  navy: "#1A2E4A",
  navyDark: "#0F1F35",
  cream: "#F5F1EB",
  creamDark: "#EDE8E0",
  white: "#FFFFFF",
  offWhite: "#FAF9F6",
  border: "#E5E1DA",
  borderLight: "#F0ECE5",
  textPrimary: "#1A2E4A",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  green: "#22C55E",
  greenBg: "#ECFDF5",
  orange: "#F59E0B",
  orangeBg: "#FFF8EB",
  red: "#EF4444",
  redBg: "#FEF2F2",
  blue: "#3B82F6",
  shadow: "0 2px 12px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 30px rgba(0,0,0,0.08)",
  shadowModal: "0 20px 60px rgba(0,0,0,0.25)",
};

// ── Markdown-lite: **bold** ──
const Txt = ({ children, style }) => {
  if (typeof children !== "string") return <span style={style}>{children}</span>;
  const parts = children.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span style={style}>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**")
          ? <strong key={i}>{p.slice(2, -2)}</strong>
          : <span key={i}>{p}</span>
      )}
    </span>
  );
};

// ── MOCK DATA ──

const scenarioA = {
  id: "A",
  label: "Scenario A",
  title: "Simple Trend — Fast Insight (~5s)",
  desc: "Maria — Grocery transfers to Mom",
  tags: ["Trend Detection", "Budget Setting", "Sync (~5s)"],
  tagColor: C.teal,
  tagBg: C.tealLight,
  icon: "📈",
  speed: "sync", // sync = fast (~5s), async = slow (~20s)
  generationMs: 5200,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 1800 },
    { text: "Preparing your insight...", ms: 3400 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See full insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  chatMessages: [
    {
      role: "ai", type: "insight",
      headline: "Grocery support trending up 23%",
      body: "Over the last 3 months, your transfers to Rosa labeled \"Groceries\" have increased from **$320/mo** to **$395/mo** — a 23% increase.",
      chart: [
        { label: "Jan", value: 320 },
        { label: "Feb", value: 355 },
        { label: "Mar", value: 395 },
      ],
      detail: "This is still within a healthy range for your income, but worth tracking if you want to stay within a monthly budget.",
    },
    {
      role: "ai", type: "pills",
      text: "Would you like to:",
      options: ["Set a monthly grocery budget", "See a breakdown by week", "Compare with other categories"],
    },
  ],
  chatCont: [
    {
      role: "ai", type: "action",
      headline: "Set grocery budget for Rosa",
      body: "Based on your 3-month average of **$357/mo**, I'd recommend:",
      options: [
        { label: "$350/mo", desc: "Slightly below average — helps you save" },
        { label: "$400/mo", desc: "Gives breathing room for price increases" },
        { label: "Custom amount", desc: "Set your own target" },
      ],
    },
  ],
  chatConfirm: [
    {
      role: "ai", type: "confirm",
      headline: "Grocery budget set",
      body: "I've set a **$400/mo** budget for grocery transfers to Rosa.",
      items: [
        "Notification when you reach 80% ($320)",
        "Monthly summary of grocery spending vs. budget",
        "Alert if prices are rising faster than usual",
      ],
    },
  ],
  postTransfer: {
    amount: "100.00 USD", converted: "2,050.00 MXN",
    recipient: "Rosa (Mom)", category: "Groceries",
    insight: "You've sent $295 of your $400 grocery budget this month. Room for one more transfer before your limit.",
    progress: 74,
  },
};

const scenarioB = {
  id: "B",
  label: "Scenario B",
  title: "Budget Pressure — Deep Insight (~20s)",
  desc: "Carlos — Roof repair project",
  tags: ["Budget Alert", "Cash Flow Plan", "Async (~20s)"],
  tagColor: C.orange,
  tagBg: C.orangeBg,
  icon: "⚠️",
  speed: "async",
  generationMs: 20000,
  fx: { send: "500", receive: "10,250", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "500.00",
    fee: "0.00",
    total: "500.00",
    rate: "20.50",
    totalMXN: "10,250.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Guadalupe Krafft Cruz",
    pickup: "ELEKTRA",
    promoNote: false,
  },
  suggestedCategory: "Home Improvement",
  categoryIcon: "🏠",
  categorizeSuccess: {
    headline: "Transfer sent!",
    amountMXN: "10,250",
    categoryLabel: "Home Improvement",
    emoji: "🏠",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 6500 },
    { text: "Finding patterns in your spending...", ms: 13000 },
    { text: "Preparing your insight...", ms: 20000 },
  ],
  fxWidget: {
    headline: "Project transfers exceeding safe budget",
    body: "Roof repair sending has pushed your U.S. buffer negative this month.",
    cta: "See funding plan",
  },
  dashWidget: {
    headline: "Sending pace alert",
    body: "You've sent $8,311 this month — well above your $2k–$4k comfort range.",
  },
  dashboard: {
    total: "8,311",
    count: 6,
    recipients: 2,
    country: "Mexico",
    receivers: [
      { name: "Guadalupe Krafft Cruz", amount: "7,011", flag: "🇲🇽" },
      { name: "Francisco G. Estrella", amount: "1,300", flag: "🇲🇽" },
    ],
    categories: [
      { name: "Home Improvement", amount: "7,311", pct: 88, color: C.orange, icon: "🏠" },
      { name: "Family Support", amount: "1,000", pct: 12, color: C.teal, icon: "👨‍👩‍👧" },
    ],
    monthlyChart: [2200, 3800, 8311],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  chatMessages: [
    {
      role: "ai", type: "insight",
      headline: "Roof repair sending is outpacing your budget",
      body: "You've sent **$8,311** this month across 6 transfers for the roof project, while your comfortable monthly range is **$2,000–$4,000**.",
      chart: [
        { label: "Jan", value: 2200 },
        { label: "Feb", value: 3800 },
        { label: "Mar", value: 8311 },
      ],
      detail: "Your current U.S. buffer after the last transfer is **negative**, meaning new transfers could pressure your U.S. bills. The roof still needs about **35,000 MXN**.",
      alert: true,
    },
    {
      role: "ai", type: "pills",
      text: "I need a couple of details to help you plan:",
      options: ["Roof needs ~35,000 MXN more", "Actually it's less than that", "I'm not sure how much is left"],
    },
  ],
  chatCont: [
    {
      role: "ai", type: "pills",
      text: "When do you expect to send your next transfer?",
      options: ["Within a few days", "Next payday", "Later this month", "Not sure"],
    },
  ],
  chatPlan: [
    {
      role: "ai", type: "plan",
      headline: "Funding plan: Finish roof in 6 weeks",
      body: "Here's a plan that protects your U.S. bills while finishing the roof:",
      steps: [
        "**Pause** new transfers until your next paycheck",
        "**Send $500** to Guadalupe biweekly (~8,400 MXN) for the roof",
        "**Keep $1,000** baseline family support each month",
        "Roof completes around **April 17** with 4 planned transfers",
      ],
      caution: "If starting buffer is near 700 USD, one extra transfer could drop you below target.",
      actions: ["Build this plan for me", "Show me other options", "I want to finish sooner"],
    },
  ],
  chatConfirm: [
    {
      role: "ai", type: "confirm",
      headline: "Roof funding plan created",
      body: "Here's what I've set up:",
      items: [
        "Tagged roof transfers in your Commitment Calendar",
        "Set automated alert at $3,000 monthly cap",
        "Created cashflow forecast for 6 weeks",
        "Scheduled payday reminders for planned sends",
      ],
    },
  ],
  postTransfer: {
    amount: "500.00 USD", converted: "10,250.00 MXN",
    recipient: "Guadalupe (Wife)", category: "Home Improvement — Roof",
    insight: "This is transfer 2 of 4 in your roof funding plan. 17,500 MXN remaining. On track to finish by April 17.",
    progress: 50,
  },
};

// Scenario C — Milestone 1: insight-only, no chat, with explicit feedback.
// Inherits async mechanics from B so we can show the delivery/notification story.
const scenarioC = {
  id: "C",
  label: "Scenario C",
  title: "M1: Insight + Feedback (no chat)",
  desc: "Maria — Grocery trend, no conversation yet",
  tags: ["Milestone 1", "Feedback UI", "Async (~20s)"],
  tagColor: C.navy,
  tagBg: "#E5E7EB",
  icon: "🚩",
  milestone: "M1",
  speed: "async",
  generationMs: 20000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 6500 },
    { text: "Finding patterns in your spending...", ms: 13000 },
    { text: "Preparing your insight...", ms: 20000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  // Structured insight payload for InsightView (M1 pseudo-chat)
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

// Scenario C10 — 10-second variant of Scenario C
const scenarioC10 = {
  id: "C10",
  label: "Scenario C (10s)",
  title: "M1: Insight + Feedback (10s sync)",
  desc: "Maria — Grocery trend, faster generation",
  tags: ["Milestone 1", "Feedback UI", "Sync (~10s)"],
  tagColor: C.navy,
  tagBg: "#E5E7EB",
  icon: "⚡",
  milestone: "M1",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4500 },
    { text: "Preparing your insight...", ms: 10000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

// UI Pattern explorations — all reuse scenarioC data with uiPattern field
const scenarioRC = {
  id: "RC",
  label: "Report Card",
  title: "Report Card UI Pattern",
  desc: "Maria — Grocery trend, report card layout",
  tags: ["Report Card", "M1", "Sync (~10s)"],
  tagColor: "#6366F1",
  tagBg: "#EEF2FF",
  icon: "📊",
  milestone: "M1",
  uiPattern: "reportCard",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioMT = {
  id: "MT",
  label: "Message Thread",
  title: "Message Thread UI Pattern",
  desc: "Maria — Grocery trend, chat message style",
  tags: ["Message Thread", "M1", "Sync (~10s)"],
  tagColor: "#6366F1",
  tagBg: "#EEF2FF",
  icon: "💬",
  milestone: "M1",
  uiPattern: "messageThread",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioBS = {
  id: "BS",
  label: "Bottom Sheet",
  title: "Bottom Sheet UI Pattern",
  desc: "Maria — Grocery trend, bottom sheet overlay",
  tags: ["Bottom Sheet", "M1", "Sync (~10s)"],
  tagColor: "#6366F1",
  tagBg: "#EEF2FF",
  icon: "📋",
  milestone: "M1",
  uiPattern: "bottomSheet",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioCA = {
  id: "CA",
  label: "Contextual Annotation",
  title: "Contextual Annotation UI Pattern",
  desc: "Maria — Grocery trend, inline annotations",
  tags: ["Annotation", "M1", "Sync (~10s)"],
  tagColor: "#6366F1",
  tagBg: "#EEF2FF",
  icon: "🏷️",
  milestone: "M1",
  uiPattern: "contextAnnotation",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioSV = {
  id: "SV",
  label: "Split View",
  title: "Split View UI Pattern",
  desc: "Maria — Grocery trend, expandable inline card",
  tags: ["Split View", "M1", "Sync (~10s)"],
  tagColor: "#6366F1",
  tagBg: "#EEF2FF",
  icon: "📐",
  milestone: "M1",
  uiPattern: "splitView",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioRec = {
  id: "REC",
  label: "Recommended",
  title: "Bottom Sheet + Persistent Icon",
  desc: "Maria — Final recommended pattern",
  tags: ["Recommended", "M1", "Sync (~10s)"],
  tagColor: C.teal,
  tagBg: C.tealLight,
  icon: "⭐",
  milestone: "M1",
  uiPattern: "recommended",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
};

const scenarioRecChat = {
  id: "RECCHAT",
  label: "Recommended: Interactivity",
  title: "Chat + Bottom Sheet",
  desc: "Maria — Full interactive chat experience",
  tags: ["Recommended", "Chat", "Future State"],
  tagColor: C.teal,
  tagBg: C.tealLight,
  icon: "💬",
  milestone: "future",
  uiPattern: "recommendedChat",
  speed: "sync",
  generationMs: 10000,
  fx: { send: "100", receive: "2,050", rate: "20.50", crossedRate: "17.85" },
  confirmTransfer: {
    amount: "100.00",
    fee: "0.00",
    total: "100.00",
    rate: "20.50",
    totalMXN: "2,050.00",
    deliveredBy: "Apr 16, 2026",
    receiver: "Rosa Garcia",
    pickup: "BODEGA AURRERA",
    promoNote: true,
  },
  suggestedCategory: "Groceries",
  categoryIcon: "🛒",
  categorizeSuccess: {
    headline: "Nice job!",
    amountMXN: "2,050",
    categoryLabel: "Groceries",
    emoji: "🛒",
  },
  loadingStages: [
    { text: "Analyzing your recent transfers...", ms: 4000 },
    { text: "Preparing your insight...", ms: 8000 },
  ],
  fxWidget: {
    headline: "Your grocery support is trending up",
    body: "Transfers to Rosa for groceries grew 23% over the last 3 months.",
    cta: "See insight",
  },
  dashWidget: {
    headline: "Grocery spending trend",
    body: "You've sent $395 in groceries this month — up from $320 in January.",
  },
  dashboard: {
    total: "1,185",
    count: 12,
    recipients: 1,
    country: "Mexico",
    receivers: [{ name: "Rosa (Mom)", amount: "1,185", flag: "🇲🇽" }],
    categories: [
      { name: "Groceries", amount: "1,185", pct: 100, color: C.teal, icon: "🛒" },
    ],
    monthlyChart: [320, 355, 395],
    monthLabels: ["Jan", "Feb", "Mar"],
  },
  insightDetail: {
    hook: "This $100 grocery transfer to Rosa fits a steady upward trend in what you're sending for everyday support.",
    keyStats: [
      { label: "3-month avg", value: "$357/mo", direction: "up" },
      { label: "vs January", value: "+23%", direction: "up" },
    ],
    findings: [
      {
        text: "Your grocery transfers to Rosa have grown steadily — from **$320/mo** in January to **$355** in February to **$395** in March, a **23% increase** over 3 months.",
      },
      {
        text: "At **$395/mo**, groceries now make up 100% of what you send to Rosa. That's within a healthy range for a single-category recipient, but leaves no buffer if she needs emergency support.",
        question: "Would it help to set a monthly grocery budget so you know when you're trending above your comfort level?",
      },
      {
        text: "Your overall monthly sending has stayed consistent at around **$1,185**, all to one recipient in Mexico. That's a focused pattern — no new recipients or categories in the past 3 months.",
      },
    ],
  },
  coldStartPills: ["How much have I sent this year?", "Show my spending by category", "Compare my last 3 months", "Who do I send to most?"],
  deliveryMethodPills: ["Which delivery method is fastest?", "What are the fees for each option?", "Which is best for large amounts?", "Can my receiver get cash today?"],
  mockResponses: {
    insight: { question: "Why is my grocery spending going up?", answer: "Based on your transfer history, your grocery transfers to Rosa have increased because you've been sending more frequently — from **2 transfers/month** in January to **3 transfers/month** in March. The average amount stayed ~$130, but the extra transfer each month drives the **23% increase**." },
    coldStart: { question: "How much have I sent this year?", answer: "In 2026 so far, you've sent **$3,555 USD** across **36 transfers** to Rosa Garcia in Mexico. Monthly: **Jan** $320, **Feb** $355, **Mar** $395. Your sending is up **23%** since January." },
    deliveryMethod: { question: "Which delivery method is fastest?", answer: "For Mexico transfers, **Cash Pickup** is fastest — available within minutes at BODEGA AURRERA. **Mobile Wallet** takes 1-2 hours. **Debit Card** is same day. **Bank Account** takes 1-3 business days. Since Rosa picks up at BODEGA AURRERA, Cash Pickup is already your fastest option." },
  },
};

// ── SHARED COMPONENTS ──

const PhoneFrame = ({ children }) => (
  <div style={{
    width: 375, height: 812,
    background: C.cream,
    borderRadius: 44,
    overflow: "hidden",
    boxShadow: "0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
    color: C.textPrimary,
    WebkitFontSmoothing: "antialiased",
  }}>
    <div style={{
      height: 48, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", fontSize: 14, fontWeight: 600,
      background: C.white,
    }}>
      <span style={{ letterSpacing: 0.3 }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#1A2E4A"/>
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#1A2E4A"/>
          <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#1A2E4A"/>
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#1A2E4A"/>
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 2.5C10.5 2.5 12.7 3.5 14.2 5.1L15.3 4C13.5 2.1 10.9 1 8 1C5.1 1 2.5 2.1 0.7 4L1.8 5.1C3.3 3.5 5.5 2.5 8 2.5Z" fill="#1A2E4A"/>
          <path d="M8 5.5C9.7 5.5 11.2 6.2 12.3 7.3L13.4 6.2C12 4.8 10.1 4 8 4C5.9 4 4 4.8 2.6 6.2L3.7 7.3C4.8 6.2 6.3 5.5 8 5.5Z" fill="#1A2E4A"/>
          <circle cx="8" cy="10" r="1.5" fill="#1A2E4A"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2" stroke="#1A2E4A" strokeWidth="1" fill="none"/>
          <rect x="2" y="2" width="18" height="8" rx="1" fill="#1A2E4A"/>
          <rect x="22" y="3.5" width="2.5" height="5" rx="1" fill="#1A2E4A"/>
        </svg>
      </div>
    </div>
    {children}
  </div>
);

const Header = ({ title, showBack, onBack, showLogo, showClose, onClose, showBell, bellUnread, onBell, insightIcon, insightIconState, insightIconReceive, onInsightIcon }) => {
  const [iconHighlight, setIconHighlight] = useState(false);

  const handleInsightIconClick = () => {
    if (!onInsightIcon) return;
    // All states are now tappable (muted shows empty state, generating shows loading)
    setIconHighlight(true);
    setTimeout(() => {
      setIconHighlight(false);
      onInsightIcon();
    }, 200);
  };

  const iconColor = insightIconState === "muted" ? "#9CA3AF" : C.teal;
  const iconBg = insightIconState === "muted"
    ? "#F3F4F6"
    : iconHighlight
      ? C.tealAccent
      : `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`;
  const iconCursor = "pointer";
  // Receive animation plays when sheet is dismissed — icon pulses to show "insight stored here"
  const receiveAnim = insightIconReceive ? "iconReceive 0.5s ease" : "none";

  return (
    <div style={{
      height: 52, flexShrink: 0,
      background: C.white,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderBottom: `1px solid ${C.border}`,
      position: "relative",
    }}>
      {showBack && (
        <button onClick={onBack} style={{
          position: "absolute", left: 12,
          background: "none", border: "none",
          fontSize: 26, cursor: "pointer", color: C.teal,
          padding: "4px 10px", lineHeight: 1,
        }}>‹</button>
      )}
      {showLogo ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill={C.teal}/>
            <text x="12" y="16" textAnchor="middle" fill="white" fontSize="13" fontWeight="800" fontFamily="-apple-system, sans-serif">P</text>
          </svg>
          <span style={{ fontSize: 20, fontWeight: 700, color: C.navy, letterSpacing: 0.3 }}>pangea</span>
        </div>
      ) : (
        <span style={{ fontSize: 17, fontWeight: 600, color: C.navy }}>{title}</span>
      )}
      {showLogo && (
        <button style={{
          position: "absolute", left: 14,
          background: "none", border: "none", cursor: "pointer",
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke="#9CA3AF" strokeWidth="1.5"/>
            <path d="M11 9v6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="11" cy="7" r="0.75" fill="#9CA3AF"/>
          </svg>
        </button>
      )}
      {/* Insight icon takes priority over bell when both present */}
      {insightIcon ? (
        <button onClick={handleInsightIconClick} style={{
          position: "absolute", right: 14,
          background: "none", border: "none", cursor: iconCursor,
          padding: 0,
        }}>
          <div style={{
            position: "relative",
            width: 26, height: 26, borderRadius: 13,
            background: iconBg,
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: iconHighlight ? "iconFlash 0.2s ease" : receiveAnim,
            transition: "background 0.15s ease",
          }}>
            {/* Spinning ring for generating state */}
            {insightIconState === "generating" && (
              <div style={{
                position: "absolute", inset: -3,
                borderRadius: "50%",
                border: `2px solid ${C.teal}30`,
                borderTopColor: C.teal,
                animation: "spin 0.8s linear infinite",
              }} />
            )}
            <span style={{
              fontSize: 13, fontWeight: 700,
              color: insightIconState === "muted" ? "#9CA3AF" : C.white,
              lineHeight: 1,
            }}>✦</span>
            {/* Notification dot for ready state */}
            {insightIconState === "ready" && (
              <div style={{
                position: "absolute", top: -2, right: -2,
                width: 10, height: 10, borderRadius: 5,
                background: C.teal,
                border: `2px solid ${C.white}`,
                boxShadow: `0 0 0 1px ${C.teal}80`,
                animation: "dotPop 0.3s ease",
              }} />
            )}
          </div>
        </button>
      ) : showBell ? (
        <button onClick={onBell} style={{
          position: "absolute", right: 14,
          background: "none", border: "none", cursor: "pointer",
          padding: 4,
        }}>
          <div style={{ position: "relative", width: 22, height: 22 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3a5 5 0 00-5 5v3.5L4.5 14h13L16 11.5V8a5 5 0 00-5-5z"
                stroke={C.navy} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <path d="M9 17a2 2 0 004 0" stroke={C.navy} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {bellUnread && (
              <div style={{
                position: "absolute", top: -1, right: -1,
                width: 10, height: 10, borderRadius: 5,
                background: C.teal,
                border: `2px solid ${C.white}`,
                boxShadow: `0 0 0 1px ${C.teal}80`,
                animation: "pulse 1.6s ease-in-out infinite",
              }} />
            )}
          </div>
        </button>
      ) : null}
      {showClose && !insightIcon && (
        <button onClick={onClose} style={{
          position: "absolute", right: 14,
          background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.navy,
        }}>✕</button>
      )}
    </div>
  );
};

const BottomNav = ({ active, onNav }) => (
  <div style={{
    height: 74, flexShrink: 0,
    background: C.white,
    borderTop: `1px solid ${C.border}`,
    display: "flex", justifyContent: "space-around", alignItems: "flex-start",
    paddingTop: 8, paddingBottom: 16,
  }}>
    {[
      { id: "send", label: "Send Money",
        icon: (a) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v14m0 0l-4-4m4 4l4-4M4 18h16" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2" strokeLinecap="round"/></svg>
      },
      { id: "bills", label: "Pay Bills",
        icon: (a) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2"/><path d="M9 7h6M9 11h6M9 15h3" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2" strokeLinecap="round"/></svg>
      },
      { id: "activity", label: "Activity",
        icon: (a) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2"/></svg>
      },
      { id: "dashboard", label: "Dashboard",
        icon: (a) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 20V10l4-3v13M10 20V6l4-3v17M16 20V8l4-3v15" stroke={a ? C.teal : "#9CA3AF"} strokeWidth="2" strokeLinecap="round"/></svg>
      },
    ].map(t => (
      <button key={t.id} onClick={() => onNav(t.id)} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        color: active === t.id ? C.teal : C.textMuted,
        fontSize: 10, fontWeight: active === t.id ? 600 : 400,
        opacity: active === t.id ? 1 : 0.65,
        minWidth: 64,
      }}>
        {t.icon(active === t.id)}
        <span>{t.label}</span>
      </button>
    ))}
  </div>
);

const InsightWidget = ({ headline, body, cta, alert, onClick, fresh }) => (
  <div onClick={onClick} style={{
    margin: "14px 16px",
    padding: "16px 18px",
    background: `linear-gradient(135deg, ${C.white}, ${alert ? "#FFFBF5" : "#F0FDFA"})`,
    borderRadius: 14,
    border: `1.5px solid ${alert ? C.orange + "40" : C.teal + "35"}`,
    cursor: "pointer",
    boxShadow: fresh ? `0 4px 18px ${alert ? C.orange : C.teal}40` : C.shadow,
    transition: "all 0.4s ease",
    position: "relative",
    animation: fresh ? "reveal 0.6s ease" : "none",
  }}>
    {fresh && (
      <div style={{
        position: "absolute", top: -8, right: 14,
        background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
        color: C.white, fontSize: 10, fontWeight: 700,
        padding: "3px 10px", borderRadius: 10,
        letterSpacing: 0.5, textTransform: "uppercase",
        boxShadow: `0 2px 8px ${C.teal}50`,
      }}>✦ New</div>
    )}
    <div style={{
      fontSize: 10, fontWeight: 700, color: alert ? C.orange : C.teal,
      textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
      display: "flex", alignItems: "center", gap: 4,
    }}>
      <span style={{ fontSize: 12 }}>✦</span> AI Insight
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 5, lineHeight: 1.3 }}>
      {headline}
    </div>
    <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55, marginBottom: 12 }}>
      {body}
    </div>
    <div style={{
      fontSize: 13, fontWeight: 600, color: alert ? C.orange : C.teal,
      display: "flex", alignItems: "center", gap: 4,
    }}>
      {cta || "See full insight"} <span style={{ fontSize: 16 }}>→</span>
    </div>
  </div>
);

const InsightLoadingCard = ({ stage, progress, alert, onSkip, generationMs }) => (
  <div style={{
    margin: "14px 16px",
    padding: "18px 18px 16px",
    background: C.white,
    borderRadius: 14,
    border: `1.5px dashed ${alert ? C.orange + "50" : C.teal + "50"}`,
    position: "relative",
    overflow: "hidden",
  }}>
    {/* Shimmer bar at top */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, transparent, ${alert ? C.orange : C.teal}, transparent)`,
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s linear infinite",
    }} />

    <div style={{
      fontSize: 10, fontWeight: 700, color: alert ? C.orange : C.teal,
      textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12,
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: 6,
        border: `2px solid ${alert ? C.orange : C.teal}40`,
        borderTopColor: alert ? C.orange : C.teal,
        animation: "spin 0.8s linear infinite",
      }} />
      Generating Insight
    </div>

    {/* Skeleton lines */}
    <div style={{ marginBottom: 12 }}>
      <div style={{
        height: 14, width: "75%", marginBottom: 8, borderRadius: 4,
        background: `linear-gradient(90deg, ${C.creamDark} 0%, ${C.borderLight} 50%, ${C.creamDark} 100%)`,
        backgroundSize: "200% 100%",
        animation: "shimmerBg 1.8s ease-in-out infinite",
      }} />
      <div style={{
        height: 10, width: "90%", marginBottom: 6, borderRadius: 4,
        background: `linear-gradient(90deg, ${C.creamDark} 0%, ${C.borderLight} 50%, ${C.creamDark} 100%)`,
        backgroundSize: "200% 100%",
        animation: "shimmerBg 1.8s ease-in-out infinite 0.2s",
      }} />
      <div style={{
        height: 10, width: "60%", borderRadius: 4,
        background: `linear-gradient(90deg, ${C.creamDark} 0%, ${C.borderLight} 50%, ${C.creamDark} 100%)`,
        backgroundSize: "200% 100%",
        animation: "shimmerBg 1.8s ease-in-out infinite 0.4s",
      }} />
    </div>

    <div style={{
      fontSize: 12, color: C.textSecondary, marginBottom: 10,
      fontStyle: "italic", minHeight: 16,
      transition: "opacity 0.3s ease",
    }}>
      {stage}
    </div>

    {/* Progress bar */}
    <div style={{
      width: "100%", height: 4, background: C.creamDark,
      borderRadius: 2, overflow: "hidden", marginBottom: 10,
    }}>
      <div style={{
        width: `${progress}%`, height: "100%",
        background: `linear-gradient(90deg, ${alert ? C.orange : C.teal}, ${alert ? C.orange : C.tealAccent})`,
        transition: "width 0.4s ease",
      }} />
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 11, color: C.textMuted }}>
        {progress < 100 ? `Takes ~${Math.round((generationMs || 20000) / 1000)} seconds` : "Almost ready..."}
      </span>
      {onSkip && (
        <button onClick={onSkip} style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 11, color: C.teal, fontWeight: 600,
        }}>Fast forward →</button>
      )}
    </div>
  </div>
);

const Feedback = ({ small }) => {
  const [sel, setSel] = useState(null);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      justifyContent: small ? "flex-end" : "flex-start",
      marginTop: small ? 8 : 12, padding: small ? "4px 0" : 0,
    }}>
      <span style={{ fontSize: 11, color: C.textMuted }}>Is this helpful?</span>
      {["👍", "👎"].map(e => (
        <button key={e} onClick={() => setSel(e)} style={{
          background: sel === e ? (e === "👍" ? C.greenBg : C.redBg) : "transparent",
          border: sel === e ? `1px solid ${e === "👍" ? C.green + "30" : C.red + "30"}` : "1px solid transparent",
          fontSize: 14, cursor: "pointer", borderRadius: 8, padding: "3px 8px",
          transition: "all 0.15s ease",
        }}>{e}</button>
      ))}
    </div>
  );
};

const MiniBar = ({ data, alert }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 100, padding: "10px 0" }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 5 }}>
            ${d.value.toLocaleString()}
          </span>
          <div style={{
            width: "100%", maxWidth: 48,
            height: Math.max(10, (d.value / max) * 60),
            background: alert && i === data.length - 1
              ? `linear-gradient(180deg, ${C.orange}, ${C.orange}DD)`
              : `linear-gradient(180deg, ${C.teal}, ${C.tealDark})`,
            borderRadius: 6,
          }} />
          <span style={{ fontSize: 11, color: C.textMuted, marginTop: 5 }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const Pill = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    padding: "11px 16px",
    borderRadius: 22,
    border: `1.5px solid ${C.border}`,
    background: C.white,
    color: C.navy,
    fontSize: 14, fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    transition: "all 0.15s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
  }}>{label}</button>
);

const ProgressBar = ({ pct, warn }) => (
  <div style={{ width: "100%", height: 6, background: C.creamDark, borderRadius: 3, overflow: "hidden" }}>
    <div style={{
      width: `${pct}%`, height: "100%",
      background: warn ? `linear-gradient(90deg, ${C.orange}, ${C.orange}DD)` : `linear-gradient(90deg, ${C.teal}, ${C.tealAccent})`,
      borderRadius: 3,
      transition: "width 0.5s ease",
    }} />
  </div>
);

// ── FX CALCULATOR SCREEN ──

const FxCalcScreen = ({ scenario, onGetStarted, onInsight, onNav, insightState, insightViewed, loadingProgress, loadingStage, onSkipWait, splitExpanded, onSplitToggle, onSplitDetail, showBottomSheet, onBottomSheetOpen, onBottomSheetDismiss, feedback, onFeedback, annotationPopover, onAnnotationTap, onAnnotationDismiss, onAnnotationFullInsight, insightIconProps, stripDismissed }) => {
  const s = scenario;
  const hasInsight = insightState === "ready";
  const bellUnread = hasInsight && !insightViewed;
  return (
    <>
      <Header
        showLogo
        showBell
        bellUnread={bellUnread}
        onBell={hasInsight ? onInsight : undefined}
        {...(insightIconProps || {})}
      />
      <div style={{ flex: 1, overflow: "auto", background: C.cream }}>
        <div style={{
          margin: "12px 16px", padding: "14px 16px",
          background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
          borderRadius: 14,
          border: `1.5px solid ${C.teal}25`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>🎁</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>Promo rate on your first transfer!</div>
            <div style={{ fontSize: 14, color: C.navy, marginTop: 2 }}>
              1 USD = <span style={{ textDecoration: "line-through", color: C.textMuted, fontSize: 13 }}>{s.fx.crossedRate}</span>{" "}
              <span style={{ fontWeight: 700, color: C.teal, fontSize: 15 }}>{s.fx.rate} MXN</span>
            </div>
          </div>
        </div>

        <div style={{
          margin: "0 16px", padding: 20,
          background: C.white, borderRadius: 16,
          border: `1px solid ${C.border}`, boxShadow: C.shadow,
        }}>
          <div style={{ padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>You send</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: C.navy }}>{s.fx.send}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.offWhite, borderRadius: 22, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>🇺🇸</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>USD</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", margin: "-4px 0", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 18, background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 16, color: C.navy }}>⇅</span>
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 12, border: `1.5px solid ${C.border}`, marginTop: 8, marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 8 }}>Recipient gets</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 34, fontWeight: 700, color: C.navy }}>{s.fx.receive}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", background: C.offWhite, borderRadius: 22, border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 16 }}>🇲🇽</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>MXN</span>
                <span style={{ color: C.textMuted, fontSize: 12 }}>▾</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 13, color: C.teal, fontWeight: 500, marginBottom: 16 }}>
            Transfer Fees ⓘ
          </div>

          <button onClick={onGetStarted} style={{
            width: "100%", padding: 16,
            background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
            border: "none", borderRadius: 28,
            color: C.white, fontSize: 17, fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 16px ${C.teal}40`,
          }}>
            Get Started
          </button>
        </div>

        {/* Insight zone on FX Calc — persistent surface.
            idle    = prior insight (ambient, no badge)
            loading = generating the next one
            ready   = new one just finished ("New" until viewed) */}
        {(() => {
          const pat = s.uiPattern;
          // Context annotation on FX Calc: prominent inline loading banner
          if (pat === "contextAnnotation") {
            if (insightState === "loading") {
              return (
                <div style={{
                  margin: "14px 16px", padding: "14px 16px",
                  background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
                  borderRadius: 12,
                  border: `1.5px solid ${C.teal}30`,
                  position: "relative", overflow: "hidden",
                }}>
                  {/* Animated shimmer sweep */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 1.8s linear infinite",
                  }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 14,
                      background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <div style={{
                        width: 12, height: 12, borderRadius: 6,
                        border: `2px solid rgba(255,255,255,0.4)`,
                        borderTopColor: C.white,
                        animation: "spin 0.8s linear infinite",
                      }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                        Preparing Insights
                      </div>
                      <div style={{ fontSize: 12, color: C.tealDark }}>
                        {loadingStage || "Analyzing your transfers..."}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            if (insightState === "ready" || insightState === "idle") {
              return (
                <div onClick={onInsight} style={{
                  margin: "14px 16px", padding: "10px 14px",
                  background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
                  borderRadius: 10, border: `1px solid ${C.teal}25`,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                  animation: insightState === "ready" && !insightViewed ? "fadeIn 0.4s ease" : "none",
                }}>
                  <span style={{ fontSize: 12, color: C.teal }}>✦</span>
                  <span style={{ fontSize: 12, color: C.tealDark, fontWeight: 500 }}>New insight about your grocery transfers</span>
                </div>
              );
            }
            return null;
          }

          // Report card widget
          if (pat === "reportCard") {
            if (insightState === "loading") {
              return (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Preparing your insight</div>
                  <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />
                </>
              );
            }
            if (insightState === "ready" || insightState === "idle") {
              return (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {insightState === "ready" && !insightViewed ? "New insight ready" : "Your latest insight"}
                  </div>
                  <ReportCardWidget scenario={s} onClick={onInsight} fresh={insightState === "ready" && !insightViewed} />
                </>
              );
            }
            return null;
          }

          // Message thread widget
          if (pat === "messageThread") {
            if (insightState === "loading") {
              return (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Preparing your insight</div>
                  <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />
                </>
              );
            }
            if (insightState === "ready" || insightState === "idle") {
              return <MessageWidget scenario={s} onClick={onInsight} fresh={insightState === "ready" && !insightViewed} />;
            }
            return null;
          }

          // Split view widget
          if (pat === "splitView") {
            if (insightState === "loading") {
              return (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>Preparing your insight</div>
                  <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />
                </>
              );
            }
            if (insightState === "ready" || insightState === "idle") {
              return (
                <SplitViewWidget
                  scenario={s}
                  expanded={splitExpanded}
                  onToggle={onSplitToggle}
                  onFullDetail={onSplitDetail}
                  fresh={insightState === "ready" && !insightViewed}
                />
              );
            }
            return null;
          }

          // Bottom sheet — loading AND ready both show in the footer strip (rendered below scroll area)
          if (pat === "bottomSheet") {
            return null;
          }

          // Recommended — insight zone handled by header icon + strip
          if (pat === "recommended" || pat === "recommendedChat") {
            return null;
          }

          // Default insight zone (scenarioC, scenarioC10, scenarioA, scenarioB)
          return (
            <>
              {insightState === "idle" && (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Your latest insight
                  </div>
                  <InsightWidget headline={s.fxWidget.headline} body={s.fxWidget.body} cta={s.fxWidget.cta} alert={s.id === "B"} onClick={onInsight} />
                </>
              )}
              {insightState === "loading" && (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Preparing your insight
                  </div>
                  <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={s.id === "B"} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />
                </>
              )}
              {insightState === "ready" && (
                <>
                  <div style={{ margin: "14px 16px 4px", fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    {insightViewed ? "Your latest insight" : "New insight ready"}
                  </div>
                  <InsightWidget headline={s.fxWidget.headline} body={s.fxWidget.body} cta={s.fxWidget.cta} alert={s.id === "B"} onClick={onInsight} fresh={!insightViewed} />
                </>
              )}
            </>
          );
        })()}

        <div style={{ margin: "0 16px 16px", fontSize: 10, color: C.textMuted, lineHeight: 1.4 }}>
          * Transfer fee listed does not include credit card transaction fees, transfers scheduled in advance, or exchange rate gains.
        </div>
      </div>
      {/* Bottom sheet strip — sits between scroll area and bottom nav, shows during loading AND ready */}
      {s.uiPattern === "bottomSheet" && (insightState === "ready" || insightState === "idle" || insightState === "loading") && (
        <BottomSheetStrip scenario={s} onClick={onBottomSheetOpen} fresh={insightState === "ready" && !insightViewed} insightState={insightState} loadingStage={loadingStage} loadingProgress={loadingProgress} />
      )}
      {/* Recommended strip — with fade-out behavior */}
      {(s.uiPattern === "recommended" || s.uiPattern === "recommendedChat") && (
        <RecommendedStrip
          scenario={s}
          onClick={onBottomSheetOpen}
          fresh={insightState === "ready" && !insightViewed}
          insightState={insightState}
          loadingStage={loadingStage}
          loadingProgress={loadingProgress}
          visible={!stripDismissed && (insightState === "loading" || insightState === "ready" || insightState === "idle")}
        />
      )}
      <BottomNav active="send" onNav={onNav} />
      {/* Bottom sheet overlay */}
      {(s.uiPattern === "bottomSheet" || s.uiPattern === "recommended") && showBottomSheet && (
        <BottomSheetOverlay
          scenario={s}
          feedback={feedback}
          onFeedback={onFeedback}
          onDismiss={onBottomSheetDismiss}
          onFullInsight={() => { onBottomSheetDismiss(); onAnnotationFullInsight(); }}
          insightState={insightState}
          loadingStage={loadingStage}
          loadingProgress={loadingProgress}
        />
      )}
    </>
  );
};

// ── CONFIRM TRANSFER SCREEN ──

const ConfirmTransferScreen = ({ scenario, onSend, onBack, insightIconProps }) => {
  const t = scenario.confirmTransfer;
  return (
    <>
      <Header title="Confirm Transfer Details" showBack onBack={onBack} {...(insightIconProps || {})} />
      <div style={{ flex: 1, overflow: "auto", background: C.white }}>
        {/* Amount with edit */}
        <div style={{ padding: "20px 20px 12px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: C.navy }}>${t.amount}</span>
            <span style={{ fontSize: 18, color: C.teal, cursor: "pointer" }}>✎</span>
          </div>
          {t.promoNote && (
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 13, color: C.teal, fontWeight: 500 }}>
              ✦ Special offers applied to this transfer
            </div>
          )}
        </div>

        {/* Receiver info */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Receiver</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{t.receiver}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Cash Pickup</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{t.pickup}</span>
          </div>
        </div>

        {/* Amount breakdown */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Transfer Amount</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{t.amount} USD</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Transfer Fee</span>
            <span style={{ fontSize: 14, color: C.teal, fontWeight: 600 }}>{t.fee} USD</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Total Amount</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{t.total} USD</span>
          </div>
        </div>

        {/* Exchange rate */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Exchange Rate</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>1 USD = {t.rate} MXN</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", paddingLeft: 16 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Promotional ($500)</span>
            <span style={{ fontSize: 12, color: C.teal }}>1 USD = 20.80 MXN</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", paddingLeft: 16 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Standard (over $500)</span>
            <span style={{ fontSize: 12, color: C.teal }}>1 USD = 19.67 MXN</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", marginTop: 4 }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Total to Receiver*</span>
            <span style={{ fontSize: 14, color: C.teal, fontWeight: 600 }}>{t.totalMXN} MXN</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: C.teal, fontWeight: 600, cursor: "pointer" }}>
            ADD PROMO
          </div>
        </div>

        {/* Delivery */}
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.borderLight}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Delivered by</span>
            <span style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>{t.deliveredBy}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
            <span style={{ fontSize: 14, color: C.textSecondary }}>Total Payment</span>
            <span style={{ fontSize: 15, color: C.navy, fontWeight: 700 }}>{t.total} USD</span>
          </div>
        </div>

        {/* Rate guarantee */}
        <div style={{ margin: "16px 20px", padding: "14px 16px", background: C.tealBanner, borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🕐</span>
          <div style={{ flex: 1, fontSize: 13, color: C.navy, fontWeight: 500 }}>
            Exchange rate guaranteed for the next 5 minutes
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <div style={{ textAlign: "center", minWidth: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>4</div>
              <div style={{ fontSize: 9, color: C.textMuted }}>min</div>
            </div>
            <div style={{ textAlign: "center", minWidth: 32 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>28</div>
              <div style={{ fontSize: 9, color: C.textMuted }}>secs</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "0 20px 12px", fontSize: 11, color: C.textMuted, lineHeight: 1.5 }}>
          You have the right to dispute errors and/or cancel your transfer for a refund. For details click <span style={{ color: C.teal }}>here</span>.
        </div>
        <div style={{ padding: "0 20px 16px", fontSize: 11, color: C.textMuted }}>
          * Pangea rounds to the nearest whole peso.
        </div>

        <div style={{ padding: "0 20px 20px" }}>
          <button onClick={onSend} style={{
            width: "100%", padding: 16,
            background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
            border: "none", borderRadius: 28,
            color: C.white, fontSize: 17, fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 16px ${C.teal}40`,
          }}>
            Tap to send
          </button>
        </div>
      </div>
    </>
  );
};

// ── CATEGORIZE SCREEN ──

const CategorizeScreen = ({ scenario, onCategorize, onBack, onCancel, insightIconProps }) => {
  const suggested = scenario.suggestedCategory;

  const recentCategories = [
    { name: "Gift", icon: "🎁" },
    { name: "Groceries", icon: "🛒" },
    { name: "Home Improvement", icon: "🛠️" },
  ];
  const moreCategories = [
    { name: "Business Expense", icon: "💼" },
    { name: "Insurance", icon: "🛡️" },
    { name: "Medical", icon: "🏥" },
    { name: "Utility Bills", icon: "💡" },
  ];

  const CategoryRow = ({ cat, highlight }) => (
    <button onClick={() => onCategorize(cat.name)} style={{
      width: "100%", padding: "14px 18px",
      background: highlight ? C.tealLight : C.white,
      border: "none", borderBottom: `1px solid ${C.borderLight}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", textAlign: "left",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 20 }}>{cat.icon}</span>
        <span style={{ fontSize: 15, color: C.navy, fontWeight: 500 }}>{cat.name}</span>
        {highlight && (
          <span style={{ fontSize: 10, fontWeight: 700, color: C.teal, background: C.white, padding: "2px 8px", borderRadius: 8, letterSpacing: 0.5, border: `1px solid ${C.teal}30` }}>
            SUGGESTED
          </span>
        )}
      </div>
      <span style={{ fontSize: 18, color: C.textMuted }}>›</span>
    </button>
  );

  return (
    <>
      <Header title="Categorize Your Transfer" showBack onBack={onBack} {...(insightIconProps || {})} />
      <div style={{ flex: 1, overflow: "auto", background: C.cream }}>
        {/* Privacy banner */}
        <div style={{
          margin: "14px 16px", padding: "12px 16px",
          background: C.creamDark, borderRadius: 10,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.4 }}>
            This data is private and is strictly for you. You'll see this data in your Dashboard.
          </span>
        </div>

        {/* Your Recent Categories section */}
        <div style={{
          padding: "10px 16px", background: C.tealBanner,
          fontSize: 13, fontWeight: 700, color: C.navy,
        }}>
          Your Recent Categories
        </div>
        <div style={{ background: C.white }}>
          {recentCategories.map((cat) => (
            <CategoryRow key={cat.name} cat={cat} highlight={cat.name === suggested} />
          ))}
        </div>

        {/* More Categories section */}
        <div style={{
          padding: "10px 16px", background: C.tealBanner,
          fontSize: 13, fontWeight: 700, color: C.navy, marginTop: 8,
        }}>
          More Categories
        </div>
        <div style={{ background: C.white }}>
          {moreCategories.map((cat) => (
            <CategoryRow key={cat.name} cat={cat} highlight={cat.name === suggested} />
          ))}
        </div>

        {/* Personalize link */}
        <div style={{
          margin: "20px 16px", padding: "12px 16px",
          background: C.creamDark, borderRadius: 10, textAlign: "center",
        }}>
          <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 4 }}>
            Want to add multiple categories, or add a note?
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, cursor: "pointer" }}>
            Personalize Your Transfer
          </div>
        </div>

        {/* Cancel */}
        <div style={{ textAlign: "center", padding: "12px 16px 24px" }}>
          <button onClick={onCancel} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: C.navy, letterSpacing: 0.5,
          }}>CANCEL</button>
        </div>
      </div>
    </>
  );
};

// ── CATEGORIZE SUCCESS MODAL ──

const CategorizeSuccessModal = ({ scenario, onSeeDashboard }) => {
  const s = scenario.categorizeSuccess;
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(15, 31, 53, 0.55)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 10, padding: 20,
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        background: C.white, borderRadius: 20, padding: "28px 24px 24px",
        width: "100%", maxWidth: 300, textAlign: "center",
        boxShadow: C.shadowModal,
        animation: "modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 18 }}>
          {s.headline}
        </div>

        {/* Big icon */}
        <div style={{
          width: 88, height: 88, borderRadius: 44,
          background: `linear-gradient(135deg, ${C.tealLight}, ${C.tealBanner})`,
          margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 42,
          border: `3px solid ${C.tealLight}`,
        }}>
          {s.emoji}
        </div>

        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 4 }}>
          You sent
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          {s.amountMXN} MXN
        </div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24 }}>
          for <strong style={{ color: C.navy }}>{s.categoryLabel}</strong>
        </div>

        {/* Subtle hint about insight generating */}
        <div style={{
          background: C.offWhite, borderRadius: 10, padding: "10px 12px",
          marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
          border: `1px solid ${C.borderLight}`,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: 7,
            border: `2px solid ${C.teal}40`,
            borderTopColor: C.teal,
            animation: "spin 0.8s linear infinite",
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 11, color: C.textSecondary, textAlign: "left", lineHeight: 1.4 }}>
            Preparing a personalized insight based on this transfer
          </span>
        </div>

        <button onClick={onSeeDashboard} style={{
          width: "100%", padding: 14,
          background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
          border: "none", borderRadius: 26,
          color: C.white, fontSize: 14, fontWeight: 700,
          cursor: "pointer", letterSpacing: 1,
          boxShadow: `0 4px 14px ${C.teal}40`,
        }}>
          SEE YOUR DASHBOARD
        </button>
      </div>
    </div>
  );
};

// ── DASHBOARD SCREEN ──

const DashboardScreen = ({ scenario, onInsight, onNav, insightState, insightViewed, loadingProgress, loadingStage, onSkipWait, splitExpanded, onSplitToggle, onSplitDetail, showBottomSheet, onBottomSheetOpen, onBottomSheetDismiss, feedback, onFeedback, annotationPopover, onAnnotationTap, onAnnotationDismiss, onAnnotationFullInsight, insightIconProps, stripDismissed }) => {
  const s = scenario;
  const d = s.dashboard;
  const maxChart = Math.max(...d.monthlyChart);

  return (
    <>
      <Header showLogo {...(insightIconProps || {})} />
      <div style={{ flex: 1, overflow: "auto", background: C.cream }}>
        {/* Month tabs */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "10px 12px", overflowX: "auto",
        }}>
          <span style={{ fontSize: 18, color: C.textMuted, cursor: "pointer", padding: "0 4px" }}>‹</span>
          {[
            { top: "NOV", bottom: "2025" },
            { top: "DEC", bottom: "2025" },
            { top: "2025", bottom: "Report", highlight: true },
            { top: "JAN", bottom: "2026" },
          ].map((m, i) => (
            <div key={i} style={{
              padding: "6px 10px", borderRadius: 8,
              fontSize: 11, textAlign: "center",
              fontWeight: m.highlight ? 600 : 500,
              color: m.highlight ? C.teal : C.textMuted,
              lineHeight: 1.3, minWidth: 42,
            }}>
              <div>{m.top}</div>
              <div>{m.bottom}</div>
            </div>
          ))}
          <div style={{
            padding: "7px 14px", borderRadius: 10,
            background: C.navyDark, color: C.white,
            fontSize: 11, textAlign: "center",
            fontWeight: 700, lineHeight: 1.3, minWidth: 48,
          }}>
            <div>MAR</div>
            <div>2026</div>
          </div>
          <span style={{ fontSize: 18, color: C.textMuted, cursor: "pointer", padding: "0 4px" }}>›</span>
        </div>

        {/* Country filter */}
        <div style={{
          margin: "0 16px 12px", padding: "10px 14px",
          background: C.white, borderRadius: 12,
          border: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>View Transfers by Country</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>🇺🇸</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>United States</span>
            </div>
          </div>
          <span style={{ color: C.textMuted, fontSize: 16 }}>▾</span>
        </div>

        {/* AI INSIGHT CARD — Always anchored at top of Dashboard */}
        {(() => {
          const pat = s.uiPattern;

          // Context annotation: no separate insight card — loading indicators appear inline within each section
          if (pat === "contextAnnotation") {
            return null;
          }

          // Report card widget
          if (pat === "reportCard") {
            if (insightState === "loading") return <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />;
            if (insightState === "ready" || insightState === "idle") return <ReportCardWidget scenario={s} onClick={onInsight} fresh={insightState === "ready" && !insightViewed} />;
            return null;
          }

          // Message thread widget
          if (pat === "messageThread") {
            if (insightState === "loading") return <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />;
            if (insightState === "ready" || insightState === "idle") return <MessageWidget scenario={s} onClick={onInsight} fresh={insightState === "ready" && !insightViewed} />;
            return null;
          }

          // Split view widget
          if (pat === "splitView") {
            if (insightState === "loading") return <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={false} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />;
            if (insightState === "ready" || insightState === "idle") {
              return <SplitViewWidget scenario={s} expanded={splitExpanded} onToggle={onSplitToggle} onFullDetail={onSplitDetail} fresh={insightState === "ready" && !insightViewed} />;
            }
            return null;
          }

          // Bottom sheet — loading AND ready both show in footer strip
          if (pat === "bottomSheet") {
            return null;
          }

          // Recommended — insight zone handled by header icon + strip
          if (pat === "recommended" || pat === "recommendedChat") {
            return null;
          }

          // Default
          return (
            <>
              {insightState === "loading" && (
                <InsightLoadingCard stage={loadingStage} progress={loadingProgress} alert={s.id === "B"} onSkip={s.speed === "async" ? onSkipWait : null} generationMs={s.generationMs} />
              )}
              {insightState === "ready" && (
                <InsightWidget headline={s.dashWidget.headline} body={s.dashWidget.body} alert={s.id === "B"} onClick={onInsight} fresh={!insightViewed} />
              )}
              {insightState === "idle" && (
                <InsightWidget headline={s.dashWidget.headline} body={s.dashWidget.body} alert={s.id === "B"} onClick={onInsight} />
              )}
            </>
          );
        })()}

        {/* Monthly Summary */}
        <div style={{ margin: "0 16px 12px", padding: 18, background: C.white, borderRadius: 14, border: `1px solid ${C.border}`, boxShadow: C.shadow }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 12 }}>March Summary</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: C.navy }}>{d.total} USD</span>
            <span style={{ fontSize: 16 }}>🇺🇸</span>
            <span style={{ fontSize: 13, color: C.textSecondary }}>Sent this month</span>
          </div>
          <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>
            You've sent <strong>{d.total} USD</strong> across <strong>{d.count} transfers</strong> to <strong>{d.recipients} recipient{d.recipients > 1 ? "s" : ""}</strong> in {d.country}.
          </div>
        </div>

        {/* Receivers */}
        <div style={{
          margin: "0 16px 12px", padding: 18, background: C.white, borderRadius: 14,
          border: `1px solid ${C.border}`, boxShadow: C.shadow, position: "relative",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>👤</span> Your Receivers
            <span style={{ marginLeft: "auto", fontSize: 12, color: C.textMuted, fontWeight: 500 }}>Amount</span>
          </div>
          {d.receivers.map((r, i) => {
            const isAnnotated = s.uiPattern === "contextAnnotation" && (insightState === "ready" || insightState === "idle") && r.name.includes("Rosa");
            const isAnnotationLoading = s.uiPattern === "contextAnnotation" && insightState === "loading" && r.name.includes("Rosa");
            return (
              <div key={i} onClick={isAnnotated ? () => onAnnotationTap(1, "receiver") : undefined} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "11px 0",
                borderBottom: i < d.receivers.length - 1 ? `1px solid ${C.borderLight}` : "none",
                borderLeft: isAnnotated ? `3px solid ${C.teal}` : isAnnotationLoading ? `3px solid ${C.teal}50` : "none",
                paddingLeft: (isAnnotated || isAnnotationLoading) ? 10 : 0,
                background: isAnnotationLoading ? `${C.tealLight}80` : "transparent",
                borderRadius: isAnnotationLoading ? 6 : 0,
                cursor: isAnnotated ? "pointer" : "default",
                transition: "all 0.2s ease",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{r.flag || "🇲🇽"}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.navy }}>{r.name}</span>
                  {isAnnotated && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: C.teal,
                      background: C.tealLight, padding: "3px 8px", borderRadius: 8,
                      border: `1px solid ${C.teal}30`,
                      display: "flex", alignItems: "center", gap: 3,
                    }}>Trending ↑ <span style={{ fontSize: 11 }}>›</span></span>
                  )}
                  {isAnnotationLoading && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: C.teal,
                      background: C.white, padding: "2px 8px", borderRadius: 6,
                      border: `1px solid ${C.teal}30`,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: 4,
                        border: `1.5px solid ${C.teal}40`,
                        borderTopColor: C.teal,
                        animation: "spin 0.8s linear infinite",
                      }} />
                      Analyzing...
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{r.amount} USD</span>
              </div>
            );
          })}
          <Feedback small />
          {annotationPopover && annotationPopover.area === "receiver" && (
            <AnnotationPopover
              finding={s.insightDetail.findings[annotationPopover.findingIdx]}
              onSeeFullInsight={onAnnotationFullInsight}
              onDismiss={onAnnotationDismiss}
            />
          )}
        </div>

        {/* Categories */}
        <div style={{
          margin: "0 16px 12px", padding: 18, background: C.white, borderRadius: 14,
          border: `1px solid ${C.border}`, boxShadow: C.shadow, position: "relative",
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📂</span> Your Categories
          </div>
          <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 16, gap: 2 }}>
            {d.categories.map((cat, i) => (
              <div key={i} style={{ width: `${cat.pct}%`, background: `linear-gradient(135deg, ${cat.color}, ${cat.color}CC)` }} />
            ))}
          </div>
          {d.categories.map((cat, i) => {
            const isAnnotated = s.uiPattern === "contextAnnotation" && (insightState === "ready" || insightState === "idle") && cat.name === "Groceries";
            const isCatLoading = s.uiPattern === "contextAnnotation" && insightState === "loading" && cat.name === "Groceries";
            return (
              <div key={i} onClick={isAnnotated ? () => onAnnotationTap(1, "category") : undefined} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "9px 0",
                borderBottom: i < d.categories.length - 1 ? `1px solid ${C.borderLight}` : "none",
                cursor: isAnnotated ? "pointer" : "default",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color }} />
                  <span style={{ fontSize: 14 }}>{cat.icon}</span>
                  <span style={{ fontSize: 14, color: C.navy }}>{cat.name}</span>
                  {isAnnotated && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: C.teal,
                      background: C.tealLight, padding: "3px 8px", borderRadius: 8,
                      border: `1px solid ${C.teal}30`,
                      display: "flex", alignItems: "center", gap: 3,
                      cursor: "pointer",
                    }}>Insight <span style={{ fontSize: 11 }}>›</span></span>
                  )}
                  {isCatLoading && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, color: C.teal,
                      background: C.tealLight, padding: "2px 8px", borderRadius: 6,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                      <span style={{
                        width: 8, height: 8, borderRadius: 4,
                        border: `1.5px solid ${C.teal}40`,
                        borderTopColor: C.teal,
                        animation: "spin 0.8s linear infinite",
                      }} />
                      Analyzing...
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{cat.amount} USD</span>
              </div>
            );
          })}
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600, color: C.teal, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Categorize Transfers <span style={{ fontSize: 16 }}>→</span>
          </div>
          <Feedback small />
          {annotationPopover && annotationPopover.area === "category" && (
            <AnnotationPopover
              finding={s.insightDetail.findings[annotationPopover.findingIdx]}
              onSeeFullInsight={onAnnotationFullInsight}
              onDismiss={onAnnotationDismiss}
            />
          )}
        </div>

        {/* Monthly Chart */}
        <div style={{
          margin: "0 16px 12px", padding: 18, background: C.white, borderRadius: 14,
          border: `1px solid ${C.border}`, boxShadow: C.shadow, position: "relative",
        }}>
          {/* Annotation: prominent loading indicator above chart */}
          {s.uiPattern === "contextAnnotation" && insightState === "loading" && (
            <div style={{
              margin: "0 0 12px", padding: "10px 14px",
              background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
              borderRadius: 10,
              border: `1.5px solid ${C.teal}25`,
              display: "flex", alignItems: "center", gap: 8,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
                backgroundSize: "200% 100%",
                animation: "shimmer 1.8s linear infinite",
              }} />
              <div style={{
                width: 18, height: 18, borderRadius: 9,
                border: `2.5px solid ${C.teal}40`,
                borderTopColor: C.teal,
                animation: "spin 0.8s linear infinite",
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.tealDark }}>
                Analyzing trend data...
              </span>
            </div>
          )}
          {/* Annotation callout above chart */}
          {s.uiPattern === "contextAnnotation" && (insightState === "ready" || insightState === "idle") && (
            <div onClick={() => onAnnotationTap(0, "chart")} style={{
              margin: "0 0 12px", padding: "10px 14px",
              background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
              borderRadius: 10, border: `1.5px solid ${C.teal}30`,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
              animation: "fadeIn 0.4s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>↑23%</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.tealDark }}>over 3 months</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, display: "flex", alignItems: "center", gap: 3 }}>
                Details <span style={{ fontSize: 13 }}>→</span>
              </span>
            </div>
          )}
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📊</span> Transfer Summary — USD
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 90 }}>
            {d.monthlyChart.map((v, i) => {
              const isMax = v === Math.max(...d.monthlyChart);
              const isAlert = isMax && s.id === "B";
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.navy, marginBottom: 4 }}>${v.toLocaleString()}</span>
                  <div style={{
                    width: "100%", maxWidth: 40,
                    height: Math.max(8, (v / maxChart) * 55),
                    background: isAlert ? `linear-gradient(180deg, ${C.orange}, ${C.orange}CC)` : `linear-gradient(180deg, ${C.teal}, ${C.tealDark})`,
                    borderRadius: 5,
                  }} />
                  <span style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{d.monthLabels[i]}</span>
                </div>
              );
            })}
          </div>
          <Feedback small />
          {annotationPopover && annotationPopover.area === "chart" && (
            <AnnotationPopover
              finding={s.insightDetail.findings[annotationPopover.findingIdx]}
              onSeeFullInsight={onAnnotationFullInsight}
              onDismiss={onAnnotationDismiss}
            />
          )}
        </div>

        <div style={{ height: 16 }} />
      </div>
      {/* Bottom sheet strip for dashboard — shows during loading AND ready */}
      {s.uiPattern === "bottomSheet" && (insightState === "ready" || insightState === "idle" || insightState === "loading") && (
        <BottomSheetStrip scenario={s} onClick={onBottomSheetOpen} fresh={insightState === "ready" && !insightViewed} insightState={insightState} loadingStage={loadingStage} loadingProgress={loadingProgress} />
      )}
      {/* Recommended strip for dashboard — with fade-out behavior */}
      {(s.uiPattern === "recommended" || s.uiPattern === "recommendedChat") && (
        <RecommendedStrip
          scenario={s}
          onClick={onBottomSheetOpen}
          fresh={insightState === "ready" && !insightViewed}
          insightState={insightState}
          loadingStage={loadingStage}
          loadingProgress={loadingProgress}
          visible={!stripDismissed && (insightState === "loading" || insightState === "ready" || insightState === "idle")}
        />
      )}
      <BottomNav active="dashboard" onNav={onNav} />
      {/* Bottom sheet overlay on dashboard */}
      {(s.uiPattern === "bottomSheet" || s.uiPattern === "recommended") && showBottomSheet && (
        <BottomSheetOverlay
          scenario={s}
          feedback={feedback}
          onFeedback={onFeedback}
          onDismiss={onBottomSheetDismiss}
          onFullInsight={onAnnotationFullInsight}
        />
      )}
    </>
  );
};

// ── AI CHAT SCREEN ──

const ChatScreen = ({ scenario, onBack, onNav, onPostTransfer }) => {
  const s = scenario;
  const [messages, setMessages] = useState(s.chatMessages);
  const [phase, setPhase] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const typeAndAdd = (msgs, nextPhase) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(p => [...p, ...msgs]);
      setPhase(nextPhase);
    }, 1200);
  };

  const pick = (label) => {
    setMessages(p => [...p, { role: "user", text: label }]);
    if (phase === 0) typeAndAdd(s.chatCont, 1);
    else if (phase === 1) typeAndAdd(s.id === "A" ? s.chatConfirm : (s.chatPlan || s.chatConfirm), 2);
    else if (phase === 2) {
      if (s.chatConfirm && s.id === "B") typeAndAdd(s.chatConfirm, 3);
      else setPhase(3);
    }
  };

  const renderMsg = (msg, i) => {
    if (msg.role === "user") {
      return (
        <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
          <div style={{
            background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, color: C.white,
            padding: "11px 16px", borderRadius: "18px 18px 4px 18px",
            maxWidth: "75%", fontSize: 14, fontWeight: 500,
            boxShadow: `0 2px 8px ${C.teal}30`,
          }}>{msg.text}</div>
        </div>
      );
    }

    return (
      <div key={i} style={{ marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="11" fill={C.teal}/>
            <text x="11" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">P</text>
          </svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Pangea AI</span>
        </div>
        <div style={{ background: C.white, borderRadius: "4px 16px 16px 16px", padding: 16, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
          {msg.type === "insight" && (
            <>
              {msg.alert && <div style={{ background: C.orangeBg, color: C.orange, padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, marginBottom: 10, display: "inline-block", border: `1px solid ${C.orange}20` }}>⚠️ Budget Alert</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8, lineHeight: 1.3 }}>{msg.headline}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: 8 }}><Txt>{msg.body}</Txt></div>
              {msg.chart && <MiniBar data={msg.chart} alert={msg.alert} />}
              {msg.detail && <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55, marginTop: 6 }}><Txt>{msg.detail}</Txt></div>}
              <Feedback />
            </>
          )}
          {msg.type === "pills" && (
            <>
              <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 10, lineHeight: 1.5 }}>{msg.text}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {msg.options.map((o, j) => <Pill key={j} label={o} onClick={() => pick(o)} />)}
              </div>
            </>
          )}
          {msg.type === "action" && (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{msg.headline}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: 12 }}><Txt>{msg.body}</Txt></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {msg.options.map((o, j) => (
                  <button key={j} onClick={() => pick(o.label || o)} style={{ padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.white, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{o.label || o}</div>
                    {o.desc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{o.desc}</div>}
                  </button>
                ))}
              </div>
            </>
          )}
          {msg.type === "plan" && (
            <>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{msg.headline}</div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: 12 }}><Txt>{msg.body}</Txt></div>
              <div style={{ background: C.offWhite, borderRadius: 12, padding: 14, marginBottom: 12, border: `1px solid ${C.borderLight}` }}>
                {msg.steps.map((st, j) => (
                  <div key={j} style={{ fontSize: 14, color: C.navy, lineHeight: 1.65, display: "flex", gap: 8, marginBottom: j < msg.steps.length - 1 ? 8 : 0 }}>
                    <span style={{ color: C.teal, fontWeight: 700 }}>→</span>
                    <Txt>{st}</Txt>
                  </div>
                ))}
              </div>
              {msg.caution && <div style={{ background: C.orangeBg, padding: "10px 14px", borderRadius: 10, fontSize: 13, color: C.textSecondary, marginBottom: 12, border: `1px solid ${C.orange}15` }}>⚡ {msg.caution}</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {msg.actions.map((a, j) => <Pill key={j} label={a} onClick={() => pick(a)} />)}
              </div>
              <Feedback />
            </>
          )}
          {msg.type === "confirm" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.green, border: `1px solid ${C.green}20` }}>✓</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{msg.headline}</div>
              </div>
              <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: 12 }}><Txt>{msg.body}</Txt></div>
              <div style={{ background: C.tealLight, borderRadius: 12, padding: 14, border: `1px solid ${C.teal}15` }}>
                {msg.items.map((it, j) => (
                  <div key={j} style={{ fontSize: 13, color: C.tealDark, lineHeight: 1.6, display: "flex", gap: 8, marginBottom: j < msg.items.length - 1 ? 6 : 0 }}>
                    <span style={{ color: C.teal }}>✓</span><span>{it}</span>
                  </div>
                ))}
              </div>
              <Feedback />
              <button onClick={onPostTransfer} style={{ marginTop: 14, width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`, border: "none", borderRadius: 12, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: `0 4px 12px ${C.teal}30` }}>
                See post-transfer view →
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Header title="AI Insights" showBack onBack={onBack} />
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 16, background: C.cream }}>
        {messages.map(renderMsg)}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", animation: "fadeIn 0.2s ease" }}>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="11" fill={C.teal}/>
              <text x="11" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">P</text>
            </svg>
            <div style={{ background: C.white, borderRadius: 16, padding: "10px 18px", border: `1px solid ${C.border}`, display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal, opacity: 0.5, animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px 24px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <input placeholder="Ask about your transfers..." style={{ flex: 1, padding: "12px 18px", borderRadius: 24, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", background: C.offWhite, color: C.navy }} />
        <button style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`, border: "none", color: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${C.teal}30` }}>↑</button>
      </div>
    </>
  );
};

// ── M1 INSIGHT VIEW (pseudo-chat, no input, with feedback) ──

const FEEDBACK_REASONS = [
  "Not relevant to me",
  "Inaccurate or wrong",
  "Not useful",
  "Confusing",
  "I don't want insights like this",
];

const InsightView = ({ scenario, feedback, onFeedback, onBack }) => {
  const s = scenario;
  const insight = s.insightDetail;
  const [showReasons, setShowReasons] = useState(feedback?.sentiment === "down" && !feedback?.submitted);
  const [comment, setComment] = useState(feedback?.comment || "");
  const submitted = feedback?.submitted;
  const sentiment = feedback?.sentiment;
  const selectedReasons = feedback?.reasons || [];

  const handleThumb = (dir) => {
    if (submitted) return;
    if (dir === "up") {
      onFeedback({ sentiment: "up", reasons: [], comment: "", submitted: true });
      setShowReasons(false);
    } else {
      // If user toggles off "down" before submitting, clear
      if (sentiment === "down" && !submitted) {
        onFeedback(null);
        setShowReasons(false);
        return;
      }
      onFeedback({ sentiment: "down", reasons: [], comment: "", submitted: false });
      setShowReasons(true);
    }
  };

  const toggleReason = (r) => {
    const next = selectedReasons.includes(r)
      ? selectedReasons.filter(x => x !== r)
      : [...selectedReasons, r];
    onFeedback({ ...feedback, reasons: next });
  };

  const submitDown = () => {
    onFeedback({ sentiment: "down", reasons: selectedReasons, comment, submitted: true });
    setShowReasons(false);
  };

  return (
    <>
      <Header title="Insight" showBack onBack={onBack} />
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: C.cream }}>
        {/* Subtle M1 banner so reviewers know conversation is coming later */}
        <div style={{
          margin: "0 0 14px", padding: "8px 12px",
          background: "rgba(26, 46, 74, 0.05)",
          border: `1px dashed ${C.border}`,
          borderRadius: 10,
          fontSize: 11, color: C.textSecondary,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 12 }}>🚩</span>
          <span><strong style={{ color: C.navy }}>Milestone 1:</strong> Insight + feedback only. Conversation will unlock in a later milestone.</span>
        </div>

        {/* AI message bubble — structured: hook → stats → findings */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14, animation: "fadeIn 0.4s ease" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, fontSize: 14, fontWeight: 700,
            flexShrink: 0, boxShadow: `0 2px 8px ${C.teal}30`,
          }}>✦</div>
          <div style={{
            flex: 1, background: C.white, borderRadius: 16,
            padding: 18, border: `1px solid ${C.border}`, boxShadow: C.shadow,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: C.teal,
              textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
            }}>
              ✦ AI Insight
            </div>

            {/* Hook — the short lead sentence */}
            <div style={{ fontSize: 15, color: C.navy, lineHeight: 1.6, marginBottom: 16, fontWeight: 500 }}>
              <Txt>{insight.hook}</Txt>
            </div>

            {/* Key stats callout — replaces chart for M1 */}
            {insight.keyStats && (
              <div style={{
                display: "flex", gap: 12, marginBottom: 18,
                padding: "14px 16px",
                background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
                borderRadius: 12,
                border: `1px solid ${C.teal}20`,
              }}>
                {insight.keyStats.map((stat, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      fontSize: 22, fontWeight: 700, color: C.navy,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      {stat.value}
                      {stat.direction === "up" && (
                        <span style={{ fontSize: 14, color: C.teal }}>↑</span>
                      )}
                      {stat.direction === "down" && (
                        <span style={{ fontSize: 14, color: C.orange }}>↓</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3, fontWeight: 500 }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Findings — each with teal accent stripe, observation + muted question */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {insight.findings.map((f, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12,
                  padding: "14px 0",
                  borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none",
                }}>
                  {/* Accent stripe */}
                  <div style={{
                    width: 3, borderRadius: 2, flexShrink: 0,
                    background: `linear-gradient(180deg, ${C.teal}, ${C.teal}60)`,
                    marginTop: 2,
                  }} />
                  <div style={{ flex: 1 }}>
                    {/* Observation text */}
                    <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: f.question ? 8 : 0 }}>
                      <Txt>{f.text}</Txt>
                    </div>
                    {/* Muted follow-up question — visible but clearly secondary */}
                    {f.question && (
                      <div style={{
                        fontSize: 13, color: C.textMuted, lineHeight: 1.55,
                        fontStyle: "italic",
                        display: "flex", alignItems: "flex-start", gap: 6,
                        padding: "6px 10px",
                        background: C.offWhite,
                        borderRadius: 8,
                        border: `1px solid ${C.borderLight}`,
                      }}>
                        <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1 }}>💬</span>
                        <span>{f.question}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback panel — anchored below insight, stays visible */}
        <div style={{
          background: C.white, borderRadius: 16,
          padding: 16, border: `1px solid ${C.border}`,
          boxShadow: C.shadow,
        }}>
          {!submitted ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
                Was this insight helpful?
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: showReasons ? 14 : 0 }}>
                <button onClick={() => handleThumb("up")} style={{
                  flex: 1, padding: "10px 14px",
                  background: sentiment === "up" ? C.greenBg : C.white,
                  border: `1.5px solid ${sentiment === "up" ? C.green + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "up" ? C.green : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16 }}>👍</span> Helpful
                </button>
                <button onClick={() => handleThumb("down")} style={{
                  flex: 1, padding: "10px 14px",
                  background: sentiment === "down" ? C.redBg : C.white,
                  border: `1.5px solid ${sentiment === "down" ? C.red + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "down" ? C.red : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16 }}>👎</span> Not helpful
                </button>
              </div>

              {showReasons && sentiment === "down" && (
                <div style={{ animation: "fadeIn 0.25s ease" }}>
                  <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>
                    What didn't work? (select any that apply)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {FEEDBACK_REASONS.map(r => {
                      const on = selectedReasons.includes(r);
                      return (
                        <button key={r} onClick={() => toggleReason(r)} style={{
                          padding: "7px 12px",
                          background: on ? C.navy : C.white,
                          color: on ? C.white : C.navy,
                          border: `1.5px solid ${on ? C.navy : C.border}`,
                          borderRadius: 16, cursor: "pointer",
                          fontSize: 12, fontWeight: 500,
                          transition: "all 0.15s ease",
                        }}>
                          {on && <span style={{ marginRight: 4 }}>✓</span>}{r}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Anything else you'd like us to know? (optional)"
                    rows={2}
                    style={{
                      width: "100%", padding: "10px 12px",
                      borderRadius: 10, border: `1.5px solid ${C.border}`,
                      fontSize: 13, color: C.navy, background: C.offWhite,
                      outline: "none", resize: "none",
                      fontFamily: "inherit", marginBottom: 12,
                    }}
                  />
                  <button onClick={submitDown} style={{
                    width: "100%", padding: 12,
                    background: C.navy, color: C.white,
                    border: "none", borderRadius: 12,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}>
                    Submit feedback
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: sentiment === "up" ? C.greenBg : C.redBg,
                  border: `1px solid ${sentiment === "up" ? C.green + "40" : C.red + "40"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14,
                }}>
                  {sentiment === "up" ? "👍" : "👎"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                  Thanks — your feedback helps us improve
                </div>
              </div>
              {sentiment === "down" && selectedReasons.length > 0 && (
                <div style={{ marginTop: 8, padding: "10px 12px", background: C.offWhite, borderRadius: 10, border: `1px solid ${C.borderLight}` }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 }}>
                    You said
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: comment ? 8 : 0 }}>
                    {selectedReasons.map(r => (
                      <span key={r} style={{
                        fontSize: 11, padding: "3px 10px", borderRadius: 10,
                        background: C.white, color: C.textSecondary,
                        border: `1px solid ${C.border}`,
                      }}>{r}</span>
                    ))}
                  </div>
                  {comment && (
                    <div style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic", lineHeight: 1.5 }}>
                      "{comment}"
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>
      {/* Intentionally no chat input — conversation is future state */}
    </>
  );
};

// ── REPORT CARD PATTERN ──

const ReportCardWidget = ({ scenario, onClick, fresh }) => {
  const insight = scenario.insightDetail;
  return (
    <div onClick={onClick} style={{
      margin: "14px 16px",
      padding: "22px 20px",
      background: C.white,
      borderRadius: 16,
      border: `1px solid ${C.border}`,
      cursor: "pointer",
      boxShadow: fresh ? `0 4px 18px ${C.teal}40` : C.shadow,
      transition: "all 0.4s ease",
      animation: fresh ? "reveal 0.6s ease" : "none",
      position: "relative",
    }}>
      {fresh && (
        <div style={{
          position: "absolute", top: -8, right: 14,
          background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
          color: C.white, fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 10,
          letterSpacing: 0.5, textTransform: "uppercase",
          boxShadow: `0 2px 8px ${C.teal}50`,
        }}>New</div>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color: C.navy }}>$357/mo</span>
        <span style={{
          fontSize: 12, fontWeight: 700, color: C.white,
          background: C.teal, padding: "3px 8px", borderRadius: 8,
        }}>↑23%</span>
      </div>
      <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>
        {insight.hook}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.teal, display: "flex", alignItems: "center", gap: 4 }}>
        View report <span style={{ fontSize: 16 }}>→</span>
      </div>
    </div>
  );
};

const ReportCardView = ({ scenario, feedback, onFeedback, onBack }) => {
  const insight = scenario.insightDetail;
  const [showReasons, setShowReasons] = useState(feedback?.sentiment === "down" && !feedback?.submitted);
  const [comment, setComment] = useState(feedback?.comment || "");
  const submitted = feedback?.submitted;
  const sentiment = feedback?.sentiment;
  const selectedReasons = feedback?.reasons || [];

  const handleThumb = (dir) => {
    if (submitted) return;
    if (dir === "up") {
      onFeedback({ sentiment: "up", reasons: [], comment: "", submitted: true });
      setShowReasons(false);
    } else {
      if (sentiment === "down" && !submitted) {
        onFeedback(null);
        setShowReasons(false);
        return;
      }
      onFeedback({ sentiment: "down", reasons: [], comment: "", submitted: false });
      setShowReasons(true);
    }
  };

  const toggleReason = (r) => {
    const next = selectedReasons.includes(r)
      ? selectedReasons.filter(x => x !== r)
      : [...selectedReasons, r];
    onFeedback({ ...feedback, reasons: next });
  };

  const submitDown = () => {
    onFeedback({ sentiment: "down", reasons: selectedReasons, comment, submitted: true });
    setShowReasons(false);
  };

  return (
    <>
      <Header title="Transfer Insights" showBack onBack={onBack} />
      <div style={{ flex: 1, overflow: "auto", padding: "20px 16px", background: C.white }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 20, lineHeight: 1.3 }}>
          Your Transfer Insights
        </div>

        {/* Hero stat block */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 24,
          padding: "18px 20px",
          background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
          borderRadius: 14,
          border: `1px solid ${C.teal}20`,
        }}>
          {insight.keyStats.map((stat, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                fontSize: 26, fontWeight: 800, color: C.navy,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                {stat.value}
                {stat.direction === "up" && <span style={{ fontSize: 16, color: C.teal }}>↑</span>}
                {stat.direction === "down" && <span style={{ fontSize: 16, color: C.orange }}>↓</span>}
              </div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Findings as prose paragraphs */}
        {insight.findings.map((f, i) => (
          <div key={i} style={{
            marginBottom: 20,
            paddingLeft: 16,
            borderLeft: `3px solid ${C.teal}`,
          }}>
            <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.7 }}>
              <Txt>{f.text}</Txt>
            </div>
            {f.question && (
              <div style={{
                fontSize: 13, color: C.textMuted, lineHeight: 1.55,
                fontStyle: "italic", marginTop: 8,
              }}>
                {f.question}
              </div>
            )}
          </div>
        ))}

        {/* Feedback panel */}
        <div style={{
          marginTop: 28, padding: 16,
          background: C.offWhite, borderRadius: 14,
          border: `1px solid ${C.borderLight}`,
        }}>
          {!submitted ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
                Was this insight helpful?
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: showReasons ? 14 : 0 }}>
                <button onClick={() => handleThumb("up")} style={{
                  flex: 1, padding: "10px 14px",
                  background: sentiment === "up" ? C.greenBg : C.white,
                  border: `1.5px solid ${sentiment === "up" ? C.green + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "up" ? C.green : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16 }}>👍</span> Helpful
                </button>
                <button onClick={() => handleThumb("down")} style={{
                  flex: 1, padding: "10px 14px",
                  background: sentiment === "down" ? C.redBg : C.white,
                  border: `1.5px solid ${sentiment === "down" ? C.red + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "down" ? C.red : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.15s ease",
                }}>
                  <span style={{ fontSize: 16 }}>👎</span> Not helpful
                </button>
              </div>
              {showReasons && sentiment === "down" && (
                <div style={{ animation: "fadeIn 0.25s ease" }}>
                  <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 8 }}>
                    What didn't work? (select any that apply)
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    {FEEDBACK_REASONS.map(r => {
                      const on = selectedReasons.includes(r);
                      return (
                        <button key={r} onClick={() => toggleReason(r)} style={{
                          padding: "7px 12px",
                          background: on ? C.navy : C.white,
                          color: on ? C.white : C.navy,
                          border: `1.5px solid ${on ? C.navy : C.border}`,
                          borderRadius: 16, cursor: "pointer",
                          fontSize: 12, fontWeight: 500,
                          transition: "all 0.15s ease",
                        }}>
                          {on && <span style={{ marginRight: 4 }}>✓</span>}{r}
                        </button>
                      );
                    })}
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Anything else you'd like us to know? (optional)"
                    rows={2}
                    style={{
                      width: "100%", padding: "10px 12px",
                      borderRadius: 10, border: `1.5px solid ${C.border}`,
                      fontSize: 13, color: C.navy, background: C.white,
                      outline: "none", resize: "none",
                      fontFamily: "inherit", marginBottom: 12,
                    }}
                  />
                  <button onClick={submitDown} style={{
                    width: "100%", padding: 12,
                    background: C.navy, color: C.white,
                    border: "none", borderRadius: 12,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                  }}>
                    Submit feedback
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: sentiment === "up" ? C.greenBg : C.redBg,
                  border: `1px solid ${sentiment === "up" ? C.green + "40" : C.red + "40"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>
                  {sentiment === "up" ? "👍" : "👎"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                  Thanks — your feedback helps us improve
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 20 }} />
      </div>
    </>
  );
};

// ── MESSAGE THREAD PATTERN ──

const MessageWidget = ({ scenario, onClick, fresh }) => {
  const insight = scenario.insightDetail;
  return (
    <div onClick={onClick} style={{
      margin: "14px 16px",
      display: "flex", alignItems: "flex-start", gap: 10,
      cursor: "pointer",
      animation: fresh ? "fadeIn 0.5s ease" : "none",
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 12, flexShrink: 0,
        background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.white, fontSize: 11, fontWeight: 700, marginTop: 4,
      }}>✦</div>
      <div style={{ flex: 1 }}>
        <div style={{
          background: C.white, borderRadius: "4px 16px 16px 16px",
          padding: "12px 14px",
          border: `1px solid ${C.border}`,
          boxShadow: fresh ? `0 3px 12px ${C.teal}30` : C.shadow,
          position: "relative",
        }}>
          {fresh && (
            <div style={{
              position: "absolute", top: -7, right: 10,
              background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
              color: C.white, fontSize: 9, fontWeight: 700,
              padding: "2px 8px", borderRadius: 8, letterSpacing: 0.5,
            }}>NEW</div>
          )}
          <div style={{ fontSize: 14, color: C.navy, lineHeight: 1.5, marginBottom: 8 }}>
            {insight.hook}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 600, color: C.teal,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            Tap to read <span style={{ fontSize: 14 }}>→</span>
          </div>
        </div>
        <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, marginLeft: 4 }}>
          Just now
        </div>
      </div>
    </div>
  );
};

const MessageThreadView = ({ scenario, feedback, onFeedback, onBack }) => {
  const insight = scenario.insightDetail;
  const [feedbackSel, setFeedbackSel] = useState(feedback?.sentiment || null);

  const handleInlineThumb = (dir) => {
    if (feedback?.submitted) return;
    setFeedbackSel(dir);
    if (dir === "up") {
      onFeedback({ sentiment: "up", reasons: [], comment: "", submitted: true });
    } else {
      onFeedback({ sentiment: "down", reasons: [], comment: "", submitted: true });
    }
  };

  const renderBubble = (content, i, isLast) => (
    <div key={i} style={{
      marginBottom: 14,
      animation: `fadeIn 0.4s ease ${0.15 * i}s both`,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        {i === 0 ? (
          <div style={{
            width: 28, height: 28, borderRadius: 14, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, fontSize: 12, fontWeight: 700,
          }}>✦</div>
        ) : (
          <div style={{ width: 28, flexShrink: 0 }} />
        )}
        <div style={{
          flex: 1, background: C.white, borderRadius: "4px 16px 16px 16px",
          padding: "14px 16px", border: `1px solid ${C.border}`, boxShadow: C.shadow,
        }}>
          <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65 }}>
            <Txt>{content}</Txt>
          </div>
          {isLast && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginTop: 10, paddingTop: 8,
              borderTop: `1px solid ${C.borderLight}`,
            }}>
              <span style={{ fontSize: 11, color: C.textMuted }}>Helpful?</span>
              {["👍", "👎"].map(e => (
                <button key={e} onClick={() => handleInlineThumb(e === "👍" ? "up" : "down")} style={{
                  background: (feedbackSel === "up" && e === "👍") || (feedbackSel === "down" && e === "👎")
                    ? (e === "👍" ? C.greenBg : C.redBg) : "transparent",
                  border: (feedbackSel === "up" && e === "👍") || (feedbackSel === "down" && e === "👎")
                    ? `1px solid ${e === "👍" ? C.green + "30" : C.red + "30"}` : "1px solid transparent",
                  fontSize: 14, cursor: "pointer", borderRadius: 8, padding: "3px 8px",
                  transition: "all 0.15s ease",
                }}>{e}</button>
              ))}
              {feedback?.submitted && (
                <span style={{ fontSize: 10, color: C.textMuted, marginLeft: 4 }}>Thanks!</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const allBubbles = [insight.hook].concat(insight.findings.map(f => f.text));

  return (
    <>
      <Header title="AI Insights" showBack onBack={onBack} />
      <div style={{ flex: 1, overflow: "auto", padding: 16, background: C.cream }}>
        {allBubbles.map((text, i) => renderBubble(text, i, i === allBubbles.length - 1))}

        {/* Suggested reply chips for questions */}
        {insight.findings.filter(f => f.question).length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            marginTop: 8, marginLeft: 36, animation: `fadeIn 0.4s ease ${0.15 * allBubbles.length}s both`,
          }}>
            {insight.findings.filter(f => f.question).map((f, i) => (
              <button key={i} onClick={() => {}} style={{
                padding: "8px 14px", borderRadius: 20,
                background: C.white, border: `1.5px solid ${C.border}`,
                fontSize: 12, color: C.textSecondary, cursor: "pointer",
                position: "relative",
                transition: "all 0.15s ease",
              }}
              title="💬 Coming soon"
              >
                {f.question.length > 50 ? f.question.slice(0, 50) + "..." : f.question}
              </button>
            ))}
          </div>
        )}

        <div style={{ height: 20 }} />
      </div>
    </>
  );
};

// ── BOTTOM SHEET PATTERN ──

const BottomSheetStrip = ({ scenario, onClick, fresh, insightState, loadingStage, loadingProgress }) => {
  const insight = scenario.insightDetail;
  const isLoading = insightState === "loading";
  return (
    <div onClick={isLoading ? undefined : onClick} style={{
      margin: 0,
      padding: isLoading ? "12px 16px 14px" : "14px 16px 16px",
      background: C.white,
      borderTop: `1.5px solid ${isLoading ? C.teal + "40" : C.border}`,
      cursor: isLoading ? "default" : "pointer",
      animation: fresh ? "fadeIn 0.4s ease" : "none",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Shimmer bar at top during loading */}
      {isLoading && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s linear infinite",
        }} />
      )}

      {isLoading ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 8,
              border: `2px solid ${C.teal}40`,
              borderTopColor: C.teal,
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Generating Insight
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic" }}>
            {loadingStage}
          </div>
          {/* Progress bar */}
          <div style={{
            width: "100%", height: 3, background: C.creamDark,
            borderRadius: 2, overflow: "hidden", marginTop: 8,
          }}>
            <div style={{
              width: `${loadingProgress}%`, height: "100%",
              background: `linear-gradient(90deg, ${C.teal}, ${C.tealAccent})`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>✦</span>
            <div style={{
              flex: 1, fontSize: 13, color: C.navy, fontWeight: 500,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {insight.hook}
            </div>
            <span style={{ fontSize: 16, color: C.textMuted, flexShrink: 0, transform: "rotate(180deg)" }}>⌄</span>
          </div>
          {fresh && (
            <div style={{
              marginTop: 6, marginLeft: 34,
              fontSize: 11, fontWeight: 600, color: C.teal,
            }}>
              Swipe up to read →
            </div>
          )}
        </>
      )}
    </div>
  );
};

const RecommendedStrip = ({ scenario, onClick, fresh, insightState, loadingStage, loadingProgress, visible }) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setAnimatingOut(false);
    } else if (shouldRender) {
      setAnimatingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setAnimatingOut(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!shouldRender) return null;

  const insight = scenario.insightDetail;
  const isLoading = insightState === "loading";
  return (
    <div onClick={isLoading ? undefined : onClick} style={{
      margin: 0,
      padding: isLoading ? "12px 16px 14px" : "14px 16px 16px",
      background: C.white,
      borderTop: `1.5px solid ${isLoading ? C.teal + "40" : C.border}`,
      cursor: isLoading ? "default" : "pointer",
      animation: animatingOut ? "fadeOut 0.3s ease forwards" : (fresh ? "fadeIn 0.4s ease" : "none"),
      position: "relative",
      overflow: "hidden",
      transition: "padding 0.3s ease, border-color 0.3s ease",
    }}>
      {isLoading && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${C.teal}, transparent)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.8s linear infinite",
        }} />
      )}

      {isLoading ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: 8,
              border: `2px solid ${C.teal}40`,
              borderTopColor: C.teal,
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8 }}>
              Generating Insight
            </span>
          </div>
          <div style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic" }}>
            {loadingStage}
          </div>
          <div style={{
            width: "100%", height: 3, background: C.creamDark,
            borderRadius: 2, overflow: "hidden", marginTop: 8,
          }}>
            <div style={{
              width: `${loadingProgress}%`, height: "100%",
              background: `linear-gradient(90deg, ${C.teal}, ${C.tealAccent})`,
              transition: "width 0.4s ease",
            }} />
          </div>
        </>
      ) : (
        <div style={{ animation: "stripCrossfade 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: 12,
              background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>✦</span>
            <div style={{
              flex: 1, fontSize: 13, color: C.navy, fontWeight: 500,
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {insight.hook}
            </div>
            <span style={{ fontSize: 16, color: C.textMuted, flexShrink: 0, transform: "rotate(180deg)" }}>⌄</span>
          </div>
          {fresh && (
            <div style={{
              marginTop: 6, marginLeft: 34,
              fontSize: 11, fontWeight: 600, color: C.teal,
            }}>
              Swipe up to read →
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BottomSheetOverlay = ({ scenario, feedback, onFeedback, onDismiss, onFullInsight, insightState, loadingStage, loadingProgress }) => {
  const insight = scenario.insightDetail;
  const [expandedIdx, setExpandedIdx] = useState(-1);
  const [showReasons, setShowReasons] = useState(feedback?.sentiment === "down" && !feedback?.submitted);
  const [comment, setComment] = useState(feedback?.comment || "");
  const submitted = feedback?.submitted;
  const sentiment = feedback?.sentiment;
  const selectedReasons = feedback?.reasons || [];

  const handleThumb = (dir) => {
    if (submitted) return;
    if (dir === "up") {
      onFeedback({ sentiment: "up", reasons: [], comment: "", submitted: true });
      setShowReasons(false);
    } else {
      if (sentiment === "down" && !submitted) {
        onFeedback(null);
        setShowReasons(false);
        return;
      }
      onFeedback({ sentiment: "down", reasons: [], comment: "", submitted: false });
      setShowReasons(true);
    }
  };

  const toggleReason = (r) => {
    const next = selectedReasons.includes(r)
      ? selectedReasons.filter(x => x !== r)
      : [...selectedReasons, r];
    onFeedback({ ...feedback, reasons: next });
  };

  const submitDown = () => {
    onFeedback({ sentiment: "down", reasons: selectedReasons, comment, submitted: true });
    setShowReasons(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div onClick={onDismiss} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 74,
        background: "rgba(0,0,0,0.3)", zIndex: 20,
        animation: "fadeIn 0.2s ease",
      }} />
      {/* Sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 74,
        maxHeight: "60%", overflow: "auto",
        background: C.white, borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
        zIndex: 21, padding: "0 16px 16px",
        animation: "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
      }}>
        {/* Drag handle + dismiss chevron */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0 10px", position: "relative" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
          <button onClick={onDismiss} style={{
            position: "absolute", right: 4, top: 6,
            background: "none", border: "none", cursor: "pointer",
            width: 28, height: 28, borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.textMuted, fontSize: 18,
          }}>⌄</button>
        </div>

        {/* Empty state — no insight yet */}
        {insightState === "idle" && !insight && (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <div style={{
              width: 48, height: 48, borderRadius: 24, margin: "0 auto 14px",
              background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
            }}>✦</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 6 }}>No insights yet</div>
            <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5 }}>
              Send a transfer to get your first AI insight.
            </div>
          </div>
        )}

        {/* Loading state — generating in progress */}
        {insightState === "loading" && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 20, height: 20, borderRadius: 10,
                border: `2.5px solid ${C.teal}40`,
                borderTopColor: C.teal,
                animation: "spin 0.8s linear infinite",
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>
                  Generating Insight
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary, fontStyle: "italic" }}>
                  {loadingStage || "Analyzing your transfers..."}
                </div>
              </div>
            </div>
            {/* Skeleton lines */}
            <div style={{ marginBottom: 12 }}>
              {[75, 90, 60].map((w, i) => (
                <div key={i} style={{
                  height: 10, width: `${w}%`, marginBottom: 8, borderRadius: 4,
                  background: `linear-gradient(90deg, ${C.creamDark} 0%, ${C.borderLight} 50%, ${C.creamDark} 100%)`,
                  backgroundSize: "200% 100%",
                  animation: `shimmerBg 1.8s ease-in-out infinite ${i * 0.2}s`,
                }} />
              ))}
            </div>
            {/* Progress bar */}
            <div style={{
              width: "100%", height: 4, background: C.creamDark,
              borderRadius: 2, overflow: "hidden",
            }}>
              <div style={{
                width: `${loadingProgress || 0}%`, height: "100%",
                background: `linear-gradient(90deg, ${C.teal}, ${C.tealAccent})`,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}

        {/* Ready/viewed — full insight content (also default when insightState is undefined) */}
        {(insightState !== "loading" && !(insightState === "idle" && !insight)) && (<>

        {/* Hook */}
        <div style={{ fontSize: 15, color: C.navy, lineHeight: 1.6, fontWeight: 500, marginBottom: 14 }}>
          <Txt>{insight.hook}</Txt>
        </div>

        {/* Stat block */}
        {insight.keyStats && (
          <div style={{
            display: "flex", gap: 12, marginBottom: 16,
            padding: "12px 14px",
            background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
            borderRadius: 12, border: `1px solid ${C.teal}20`,
          }}>
            {insight.keyStats.map((stat, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  {stat.value}
                  {stat.direction === "up" && <span style={{ fontSize: 12, color: C.teal }}>↑</span>}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Accordion findings */}
        {insight.findings.map((f, i) => {
          const isOpen = expandedIdx === i;
          const previewText = f.text.replace(/\*\*/g, "").slice(0, 60) + "...";
          return (
            <div key={i} style={{
              borderTop: i > 0 ? `1px solid ${C.borderLight}` : "none",
            }}>
              <div onClick={() => setExpandedIdx(isOpen ? -1 : i)} style={{
                padding: "12px 0", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, color: C.navy, fontWeight: 500, flex: 1 }}>
                  {isOpen ? <Txt>{f.text}</Txt> : previewText}
                </span>
                <span style={{
                  fontSize: 14, color: C.textMuted, flexShrink: 0, marginLeft: 8,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                  transition: "transform 0.2s ease",
                }}>⌄</span>
              </div>
              {isOpen && f.question && (
                <div style={{
                  fontSize: 12, color: C.textMuted, fontStyle: "italic",
                  padding: "0 0 12px", lineHeight: 1.5,
                  animation: "fadeIn 0.2s ease",
                }}>
                  {f.question}
                </div>
              )}
            </div>
          );
        })}

        {/* Feedback — prominent full-width buttons */}
        <div style={{
          marginTop: 14, padding: "14px 0 0",
          borderTop: `1px solid ${C.borderLight}`,
        }}>
          {!submitted ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 10 }}>
                Was this insight helpful?
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: showReasons ? 14 : 0 }}>
                <button onClick={() => handleThumb("up")} style={{
                  flex: 1, padding: "11px 14px",
                  background: sentiment === "up" ? C.greenBg : C.white,
                  border: `1.5px solid ${sentiment === "up" ? C.green + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "up" ? C.green : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>👍</span> Helpful
                </button>
                <button onClick={() => handleThumb("down")} style={{
                  flex: 1, padding: "11px 14px",
                  background: sentiment === "down" ? C.redBg : C.white,
                  border: `1.5px solid ${sentiment === "down" ? C.red + "60" : C.border}`,
                  borderRadius: 12, cursor: "pointer",
                  fontSize: 14, fontWeight: 600, color: sentiment === "down" ? C.red : C.navy,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <span style={{ fontSize: 16 }}>👎</span> Not helpful
                </button>
              </div>
              {showReasons && sentiment === "down" && (
                <div style={{ animation: "fadeIn 0.25s ease" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                    {FEEDBACK_REASONS.map(r => {
                      const on = selectedReasons.includes(r);
                      return (
                        <button key={r} onClick={() => toggleReason(r)} style={{
                          padding: "6px 11px", background: on ? C.navy : C.white,
                          color: on ? C.white : C.navy,
                          border: `1.5px solid ${on ? C.navy : C.border}`,
                          borderRadius: 14, cursor: "pointer", fontSize: 11, fontWeight: 500,
                        }}>
                          {on && "✓ "}{r}
                        </button>
                      );
                    })}
                  </div>
                  <button onClick={submitDown} style={{
                    width: "100%", padding: 11,
                    background: C.navy, color: C.white,
                    border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>Submit feedback</button>
                </div>
              )}
            </>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px", borderRadius: 10,
              background: sentiment === "up" ? C.greenBg : C.redBg,
              border: `1px solid ${sentiment === "up" ? C.green + "30" : C.red + "30"}`,
            }}>
              <span style={{ fontSize: 16 }}>{sentiment === "up" ? "👍" : "👎"}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Thanks — your feedback helps us improve</span>
            </div>
          )}
        </div>
        </>)}
      </div>
    </>
  );
};

// ── CONTEXT ANNOTATION PATTERN ──

const AnnotationPopover = ({ finding, onSeeFullInsight, onDismiss }) => (
  <div style={{
    position: "absolute", left: 20, right: 20,
    background: C.white, borderRadius: 14,
    padding: 16, boxShadow: C.shadowModal,
    border: `1.5px solid ${C.teal}30`,
    zIndex: 25,
    animation: "fadeIn 0.2s ease",
  }}>
    {/* Arrow */}
    <div style={{
      position: "absolute", top: -8, left: 24,
      width: 0, height: 0,
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderBottom: `8px solid ${C.white}`,
    }} />
    <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 8 }}>
      <Txt>{finding.text}</Txt>
    </div>
    {finding.question && (
      <div style={{ fontSize: 12, color: C.textMuted, fontStyle: "italic", marginBottom: 10 }}>
        {finding.question}
      </div>
    )}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <button onClick={onSeeFullInsight} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: 600, color: C.teal,
      }}>
        See full insight →
      </button>
      <button onClick={onDismiss} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 12, color: C.textMuted,
      }}>
        Dismiss
      </button>
    </div>
  </div>
);

// ── SPLIT VIEW PATTERN ──

const SplitViewWidget = ({ scenario, expanded, onToggle, onFullDetail, fresh }) => {
  const insight = scenario.insightDetail;
  return (
    <div style={{
      margin: "20px 16px 14px",
      background: C.white, borderRadius: 14,
      border: `1.5px solid ${expanded ? C.teal + "40" : C.border}`,
      boxShadow: fresh ? `0 4px 18px ${C.teal}40` : C.shadow,
      overflow: "visible",
      transition: "all 0.35s ease",
      animation: fresh ? "reveal 0.6s ease" : "none",
      position: "relative",
    }}>
      {fresh && !expanded && (
        <div style={{
          position: "absolute", top: -10, right: 14,
          background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
          color: C.white, fontSize: 10, fontWeight: 700,
          padding: "3px 10px", borderRadius: 10,
          letterSpacing: 0.5, textTransform: "uppercase",
          boxShadow: `0 2px 8px ${C.teal}50`,
          zIndex: 1,
        }}>✦ New</div>
      )}
      {/* Header label + collapse toggle */}
      <div onClick={onToggle} style={{
        padding: "14px 16px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer",
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, color: C.teal,
          textTransform: "uppercase", letterSpacing: 1.2,
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ fontSize: 12 }}>✦</span> AI Insight
        </div>
        <span style={{
          fontSize: 16, color: C.textMuted, flexShrink: 0,
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.25s ease",
        }}>⌄</span>
      </div>
      {/* Hook text — always visible */}
      <div onClick={onToggle} style={{
        padding: "8px 16px 0",
        cursor: "pointer",
      }}>
        <div style={{ fontSize: 14, color: C.navy, fontWeight: 600, lineHeight: 1.5 }}>
          {expanded ? insight.hook : (insight.hook.length > 80 ? insight.hook.slice(0, 80) + "..." : insight.hook)}
        </div>
      </div>

      {/* Stat block — always visible */}
      {insight.keyStats && (
        <div onClick={onToggle} style={{
          margin: "12px 16px 0", cursor: "pointer",
          display: "flex", gap: 12,
          padding: "12px 14px",
          background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
          borderRadius: 12, border: `1px solid ${C.teal}20`,
        }}>
          {insight.keyStats.map((stat, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                fontSize: 20, fontWeight: 700, color: C.navy,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              }}>
                {stat.value}
                {stat.direction === "up" && <span style={{ fontSize: 12, color: C.teal }}>↑</span>}
              </div>
              <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Expand invitation — only when collapsed */}
      {!expanded && (
        <div onClick={onToggle} style={{
          padding: "12px 16px 14px",
          cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>
            See what's driving this
          </span>
          <span style={{ fontSize: 14, color: C.teal, animation: "pulse 1.6s ease-in-out infinite" }}>↓</span>
        </div>
      )}

      {/* Expanded content — first finding + CTA */}
      {expanded && (
        <div style={{
          padding: "12px 16px 16px",
          animation: "expandCard 0.3s ease",
        }}>
          {/* Top finding only — keeps expanded state compact */}
          {insight.findings.length > 0 && (
            <div style={{
              paddingLeft: 12,
              borderLeft: `3px solid ${C.teal}40`,
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.6 }}>
                <Txt>{insight.findings[0].text}</Txt>
              </div>
            </div>
          )}

          {/* Link to full detail for all findings + feedback */}
          <button onClick={onFullDetail} style={{
            width: "100%", padding: 12,
            background: C.offWhite, border: `1.5px solid ${C.border}`,
            borderRadius: 12, cursor: "pointer",
            fontSize: 13, fontWeight: 600, color: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            {insight.findings.length > 1 ? `See all ${insight.findings.length} findings + give feedback` : "See full detail + give feedback"} <span style={{ fontSize: 14 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ── POST-TRANSFER SCREEN ──

const PostTransferScreen = ({ scenario, onBack, onNav }) => {
  const pt = scenario.postTransfer;
  return (
    <>
      <Header title="Transfer Details" showBack onBack={onBack} />
      <div style={{ flex: 1, overflow: "auto", background: C.cream, padding: 16 }}>
        <div style={{ background: C.white, borderRadius: 16, padding: 22, border: `1px solid ${C.border}`, textAlign: "center", marginBottom: 16, boxShadow: C.shadow }}>
          <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 6 }}>Sent to {pt.recipient}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
            {pt.amount} → {pt.converted}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 14 }}>
            {["Sending", "Ready for Pickup", "Received"].map((step, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 14, boxShadow: `0 2px 6px ${C.green}30` }}>✓</div>
                <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 500 }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.greenBg, padding: "5px 14px", borderRadius: 8, fontSize: 12, color: C.green, fontWeight: 600, display: "inline-block", border: `1px solid ${C.green}20` }}>{pt.category}</div>
        </div>

        <div style={{ background: `linear-gradient(135deg, ${C.white}, #F0FDFA)`, borderRadius: 16, padding: 18, border: `1.5px solid ${C.teal}25`, marginBottom: 16, boxShadow: C.shadow }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>✦ AI Insight</div>
          <div style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.65, marginBottom: 14 }}>{pt.insight}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>{pt.progress}%</span>
          </div>
          <ProgressBar pct={pt.progress} warn={pt.progress > 80} />
          <Feedback />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button style={{ width: "100%", padding: 15, background: C.white, border: `1.5px solid ${C.teal}`, borderRadius: 14, color: C.teal, fontWeight: 600, fontSize: 15, cursor: "pointer" }}>View Receipt</button>
          <button style={{ width: "100%", padding: 15, background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`, border: "none", borderRadius: 14, color: C.white, fontWeight: 600, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 12px ${C.teal}30` }}>Repeat Transfer</button>
        </div>
      </div>
      <BottomNav active="activity" onNav={onNav} />
    </>
  );
};

// ── DELIVERY METHOD SCREEN ──

const DeliveryMethodScreen = ({ onSelect, onBack, insightIconProps, onInsightIconTap }) => {
  const methods = [
    { icon: "💳", label: "Receiver Debit Card" },
    { icon: "🏦", label: "Receiver Bank Account" },
    { icon: "📱", label: "Mobile Wallet Deposit" },
    { icon: "💵", label: "Cash Pickup" },
  ];
  return (
    <>
      <Header title="Select Delivery Method" showBack onBack={onBack} {...(insightIconProps || {})} />
      <div style={{ flex: 1, overflow: "auto", background: C.cream }}>
        <div style={{ margin: "16px 16px 0" }}>
          {methods.map((m, i) => (
            <button key={i} onClick={onSelect} style={{
              width: "100%", padding: "14px 16px",
              background: C.white,
              border: "none",
              borderBottom: i < methods.length - 1 ? `1px solid ${C.borderLight}` : "none",
              borderRadius: i === 0 ? "14px 14px 0 0" : i === methods.length - 1 ? "0 0 14px 14px" : 0,
              display: "flex", alignItems: "center", gap: 14,
              cursor: "pointer", textAlign: "left",
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: 25,
                background: C.tealLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>{m.icon}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.navy }}>{m.label}</span>
              <span style={{ fontSize: 20, color: C.textMuted }}>›</span>
            </button>
          ))}
        </div>
      </div>
      <BottomNav active="send" onNav={() => {}} />
    </>
  );
};

// ── CHAT BOTTOM SHEET ──

const ChatBottomSheet = ({ scenario, mode, onDismiss, insightState, feedback, onFeedback }) => {
  const [chatInput, setChatInput] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const insight = scenario.insightDetail;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [localMessages, typing]);

  const getMockResponse = (text, m) => {
    const mr = scenario.mockResponses;
    if (m === "insight") return mr.insight.answer;
    if (m === "coldStart") return mr.coldStart.answer;
    if (m === "contextual") return mr.deliveryMethod.answer;
    return "Based on your transfer history, I can help you understand your sending patterns better.";
  };

  const handleSubmit = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim() };
    const contextMsg = mode === "insight" ? { role: "ai", text: insight.hook } : null;
    const initialMsgs = contextMsg ? [contextMsg, userMsg] : [userMsg];
    setLocalMessages(initialMsgs);
    setExpanded(true);
    setTyping(true);
    setChatInput("");
    setTimeout(() => {
      setTyping(false);
      setLocalMessages(prev => [...prev, { role: "ai", text: getMockResponse(text.trim(), mode) }]);
    }, 1400);
  };

  const handleFollowUp = (text) => {
    if (!text.trim()) return;
    setLocalMessages(prev => [...prev, { role: "user", text: text.trim() }]);
    setTyping(true);
    setChatInput("");
    setTimeout(() => {
      setTyping(false);
      setLocalMessages(prev => [...prev, { role: "ai", text: "That's a great question! Based on your transfer history, I can help with that. Your sending patterns show a consistent upward trend — would you like me to break that down further?" }]);
    }, 1400);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (expanded) handleFollowUp(chatInput);
      else handleSubmit(chatInput);
    }
  };

  const pills = mode === "coldStart" ? scenario.coldStartPills
    : mode === "contextual" ? scenario.deliveryMethodPills
    : [];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onDismiss} style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 74,
        background: "rgba(0,0,0,0.3)", zIndex: 20,
        animation: "fadeIn 0.2s ease",
      }} />
      {/* Sheet */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 74,
        maxHeight: expanded ? "90%" : "65%",
        transition: "max-height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        background: C.white, borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 30px rgba(0,0,0,0.15)",
        zIndex: 21, padding: "0 16px 12px",
        animation: "sheetExpand 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Drag handle + dismiss/collapse button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 0 10px", position: "relative", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border }} />
          <button
            onClick={expanded ? () => { setExpanded(false); setLocalMessages([]); } : onDismiss}
            style={{
              position: "absolute", right: 4, top: 6,
              background: "none", border: "none", cursor: "pointer",
              width: 28, height: 28, borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.textMuted, fontSize: 18,
            }}>⌄</button>
        </div>

        <div ref={scrollRef} style={{ flex: 1, overflow: "auto" }}>

          {/* ── EXPANDED: inline chat conversation ── */}
          {expanded && (
            <div style={{ paddingBottom: 8 }}>
              {localMessages.map((msg, i) => (
                msg.role === "user" ? (
                  <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
                    <div style={{
                      background: C.navy, color: C.white,
                      padding: "11px 16px", borderRadius: "18px 18px 4px 18px",
                      maxWidth: "75%", fontSize: 14, fontWeight: 500, lineHeight: 1.45,
                    }}>{msg.text}</div>
                  </div>
                ) : (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                      background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: C.white, fontSize: 11, fontWeight: 700,
                    }}>✦</div>
                    <div style={{
                      background: C.offWhite, border: `1px solid ${C.border}`,
                      padding: "11px 14px", borderRadius: "4px 18px 18px 18px",
                      maxWidth: "78%", fontSize: 14, color: C.navy, lineHeight: 1.55,
                      boxShadow: C.shadow,
                    }}><Txt>{msg.text}</Txt></div>
                  </div>
                )
              ))}
              {typing && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: C.white, fontSize: 11, fontWeight: 700,
                  }}>✦</div>
                  <div style={{
                    background: C.offWhite, border: `1px solid ${C.border}`,
                    padding: "13px 16px", borderRadius: "4px 18px 18px 18px",
                    boxShadow: C.shadow, display: "flex", gap: 5, alignItems: "center",
                  }}>
                    {[0, 1, 2].map(d => (
                      <div key={d} style={{
                        width: 7, height: 7, borderRadius: "50%", background: C.textMuted,
                        animation: `dotBounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── COLLAPSED: insight mode ── */}
          {!expanded && mode === "insight" && insight && (
            <>
              {/* Compact hook */}
              <div style={{ fontSize: 14, color: C.navy, lineHeight: 1.55, fontWeight: 500, marginBottom: 12 }}>
                <Txt>{insight.hook}</Txt>
              </div>
              {/* Stat block */}
              {insight.keyStats && (
                <div style={{
                  display: "flex", gap: 12, marginBottom: 14,
                  padding: "10px 12px",
                  background: `linear-gradient(135deg, ${C.tealLight}, #E8F8F6)`,
                  borderRadius: 10, border: `1px solid ${C.teal}20`,
                }}>
                  {insight.keyStats.map((stat, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                        {stat.value}
                        {stat.direction === "up" && <span style={{ fontSize: 11, color: C.teal }}>↑</span>}
                      </div>
                      <div style={{ fontSize: 10, color: C.textMuted, marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Findings bullets */}
              {insight.findings && (
                <div style={{ marginBottom: 14 }}>
                  {insight.findings.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 9, marginBottom: 9, alignItems: "flex-start" }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: "50%", background: C.teal,
                        marginTop: 5, flexShrink: 0,
                      }} />
                      <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.55 }}>
                        <Txt>{f.text}</Txt>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Thumbs */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: C.textMuted }}>Was this helpful?</span>
                {["👍", "👎"].map(e => (
                  <button key={e} onClick={() => onFeedback && onFeedback({ sentiment: e === "👍" ? "up" : "down", reasons: [], comment: "", submitted: true })} style={{
                    background: feedback?.sentiment === (e === "👍" ? "up" : "down") ? (e === "👍" ? C.greenBg : C.redBg) : "transparent",
                    border: feedback?.sentiment === (e === "👍" ? "up" : "down") ? `1px solid ${e === "👍" ? C.green + "30" : C.red + "30"}` : "1px solid transparent",
                    fontSize: 14, cursor: "pointer", borderRadius: 8, padding: "3px 8px",
                  }}>{e}</button>
                ))}
              </div>
              {/* Divider */}
              <div style={{ height: 1, background: C.borderLight, marginBottom: 10 }} />
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>Ask about this insight</div>
            </>
          )}

          {/* ── COLLAPSED: coldStart / contextual mode ── */}
          {!expanded && (mode === "coldStart" || mode === "contextual") && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 16,
                  background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: C.white, fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>✦</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>
                  {mode === "coldStart" ? "Ask about your transfers" : "Help with delivery methods"}
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.textSecondary, lineHeight: 1.5, marginBottom: 14 }}>
                {mode === "coldStart"
                  ? "I can help you understand your sending patterns, track spending, and more."
                  : "I can help you choose the right option."}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {pills.map((p, i) => (
                  <button key={i} onClick={() => handleSubmit(p)} style={{
                    padding: "10px 10px", borderRadius: 12,
                    border: `1.5px solid ${C.teal}40`,
                    background: C.white, color: C.navy,
                    fontSize: 12, fontWeight: 500,
                    cursor: "pointer", textAlign: "left", lineHeight: 1.35,
                  }}>{p}</button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Chat input bar */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", paddingTop: 8, flexShrink: 0, borderTop: `1px solid ${C.borderLight}` }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={expanded ? "Ask a follow-up..." : "Ask anything..."}
            style={{
              flex: 1, padding: "10px 16px",
              borderRadius: 22, border: `1.5px solid ${C.border}`,
              fontSize: 14, outline: "none", background: C.offWhite, color: C.navy,
              fontFamily: "inherit",
            }}
          />
          <button onClick={() => expanded ? handleFollowUp(chatInput) : handleSubmit(chatInput)} style={{
            width: 32, height: 32, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
            border: "none", color: C.white, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>↑</button>
        </div>
      </div>
    </>
  );
};

// ── FULL SCREEN CHAT ──

const FullScreenChat = ({ messages, onSendMessage, onBack, insightIconProps, typing }) => {
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSubmit = (text) => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setChatInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(chatInput);
    }
  };

  return (
    <>
      <Header title="AI Assistant" showBack onBack={onBack} {...(insightIconProps || {})} />
      <div ref={scrollRef} style={{ flex: 1, overflow: "auto", padding: 16, background: C.cream }}>
        {messages.map((msg, i) => {
          if (msg.role === "user") {
            return (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, animation: "fadeIn 0.3s ease" }}>
                <div style={{
                  background: C.navy, color: C.white,
                  padding: "11px 16px", borderRadius: "18px 18px 4px 18px",
                  maxWidth: "75%", fontSize: 14, fontWeight: 500,
                }}>{msg.text}</div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14, animation: "fadeIn 0.3s ease" }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: C.white, fontSize: 11, fontWeight: 700,
              }}>✦</div>
              <div style={{
                background: C.white, borderRadius: "4px 16px 16px 16px",
                padding: "12px 14px", border: `1px solid ${C.border}`,
                maxWidth: "80%", fontSize: 14, color: C.textSecondary, lineHeight: 1.6,
              }}>
                <Txt>{msg.text}</Txt>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14, animation: "fadeIn 0.2s ease" }}>
            <div style={{
              width: 24, height: 24, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: C.white, fontSize: 11, fontWeight: 700,
            }}>✦</div>
            <div style={{
              background: C.white, borderRadius: "4px 16px 16px 16px",
              padding: "10px 18px", border: `1px solid ${C.border}`,
              display: "flex", gap: 4, alignItems: "center",
            }}>
              {[0, 1, 2].map(j => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal, opacity: 0.5, animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ padding: "10px 16px 24px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          style={{
            flex: 1, padding: "12px 18px",
            borderRadius: 24, border: `1.5px solid ${C.border}`,
            fontSize: 14, outline: "none", background: C.offWhite, color: C.navy,
            fontFamily: "inherit",
          }}
        />
        <button onClick={() => handleSubmit(chatInput)} style={{
          width: 36, height: 36, borderRadius: 18,
          background: `linear-gradient(135deg, ${C.tealAccent}, ${C.teal})`,
          border: "none", color: C.white, fontSize: 16, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>↑</button>
      </div>
    </>
  );
};

// ── SCENARIO PICKER ──

const Picker = ({ onSelect }) => (
  <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", padding: 24, background: C.cream }}>
    <div style={{ textAlign: "center", marginBottom: 24, marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="14" fill={C.teal}/>
          <text x="14" y="18.5" textAnchor="middle" fill="white" fontSize="15" fontWeight="800">P</text>
        </svg>
        <span style={{ fontSize: 24, fontWeight: 700, color: C.navy }}>pangea</span>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 4 }}>AI Insights Prototype</div>
      <div style={{ fontSize: 13, color: C.textSecondary }}>Choose a scenario to explore</div>
    </div>

    {/* Recommended */}
    <div style={{ fontSize: 10, fontWeight: 700, color: C.teal, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
      Recommended
    </div>
    <div onClick={() => onSelect(scenarioRec)} style={{
      background: C.white, borderRadius: 16, padding: 20,
      border: `2px solid ${C.teal}`, marginBottom: 16, cursor: "pointer",
      boxShadow: `0 4px 18px ${C.teal}30`, position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{scenarioRec.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{scenarioRec.label}: {scenarioRec.title}</div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{scenarioRec.desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {scenarioRec.tags.map(t => (
          <span key={t} style={{ fontSize: 11, background: scenarioRec.tagBg, color: scenarioRec.tagColor, padding: "4px 10px", borderRadius: 10, fontWeight: 500, border: `1px solid ${scenarioRec.tagColor}15` }}>{t}</span>
        ))}
      </div>
    </div>
    <div onClick={() => onSelect(scenarioRecChat)} style={{
      background: C.white, borderRadius: 16, padding: 20,
      border: `2px solid ${C.teal}`, marginBottom: 16, cursor: "pointer",
      boxShadow: `0 4px 18px ${C.teal}30`, position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{scenarioRecChat.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{scenarioRecChat.label}: {scenarioRecChat.title}</div>
          <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{scenarioRecChat.desc}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {scenarioRecChat.tags.map(t => (
          <span key={t} style={{ fontSize: 11, background: scenarioRecChat.tagBg, color: scenarioRecChat.tagColor, padding: "4px 10px", borderRadius: 10, fontWeight: 500, border: `1px solid ${scenarioRecChat.tagColor}15` }}>{t}</span>
        ))}
      </div>
    </div>

    {/* M1 — near-term reality — current design */}
    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
      Near-term (Milestone 1) — Current Design
    </div>
    {[scenarioC, scenarioC10].map(s => (
      <div key={s.id} onClick={() => onSelect(s)} style={{
        background: C.white, borderRadius: 16, padding: 20,
        border: `2px solid ${C.teal}30`, marginBottom: 12, cursor: "pointer",
        boxShadow: C.shadow, position: "relative",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{s.label}: {s.title}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{s.desc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {s.tags.map(t => (
            <span key={t} style={{ fontSize: 11, background: s.tagBg, color: s.tagColor, padding: "4px 10px", borderRadius: 10, fontWeight: 500, border: `1px solid ${s.tagColor}15` }}>{t}</span>
          ))}
        </div>
      </div>
    ))}

    {/* UI Pattern Explorations */}
    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 8, marginTop: 8, textTransform: "uppercase" }}>
      UI Pattern Explorations
    </div>
    {[scenarioRC, scenarioMT, scenarioBS, scenarioCA, scenarioSV].map(s => (
      <div key={s.id} onClick={() => onSelect(s)} style={{
        background: C.white, borderRadius: 16, padding: 18,
        border: `1.5px solid ${s.tagColor}30`, marginBottom: 10, cursor: "pointer",
        boxShadow: C.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 24 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{s.label}</div>
            <div style={{ fontSize: 11, color: C.textSecondary, marginTop: 2 }}>{s.desc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {s.tags.map(t => (
            <span key={t} style={{ fontSize: 10, background: s.tagBg, color: s.tagColor, padding: "3px 9px", borderRadius: 9, fontWeight: 500, border: `1px solid ${s.tagColor}15` }}>{t}</span>
          ))}
        </div>
      </div>
    ))}

    {/* Future state — with chat */}
    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1, marginBottom: 8, marginTop: 8, textTransform: "uppercase" }}>
      Future state (with conversation)
    </div>
    {[scenarioA, scenarioB].map(s => (
      <div key={s.id} onClick={() => onSelect(s)} style={{
        background: C.white, borderRadius: 16, padding: 20,
        border: `1px solid ${C.border}`, marginBottom: 12, cursor: "pointer",
        boxShadow: C.shadow,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{s.label}: {s.title}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{s.desc}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {s.tags.map(t => (
            <span key={t} style={{ fontSize: 11, background: s.tagBg, color: s.tagColor, padding: "4px 10px", borderRadius: 10, fontWeight: 500, border: `1px solid ${s.tagColor}15` }}>{t}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── MAIN APP ──

export default function PangeaAIPrototype() {
  // Screens: picker | fxCalc | confirm | categorize | dashboard | chat | insightView | post
  //          | reportCardView | messageThreadView | deliveryMethod | fullChat
  const [screen, setScreen] = useState("picker");
  const [scenario, setScenario] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // Insight lifecycle: idle | loading | ready
  const [insightState, setInsightState] = useState("idle");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState("");
  // M1 — track whether user has opened the insight (drops bell dot + "New" badge)
  const [insightViewed, setInsightViewed] = useState(false);
  // M1 — feedback state { sentiment, reasons, comment, submitted }
  const [feedback, setFeedback] = useState(null);
  // UI pattern states
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [splitExpanded, setSplitExpanded] = useState(false);
  const [annotationPopover, setAnnotationPopover] = useState(null); // { findingIdx, area }
  // Recommended pattern states
  const [stripDismissed, setStripDismissed] = useState(false);
  const [iconReceive, setIconReceive] = useState(false);
  // Chat state for recommendedChat pattern
  const [chatMode, setChatMode] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [showChatSheet, setShowChatSheet] = useState(false);
  const [chatTyping, setChatTyping] = useState(false);
  const [prevScreen, setPrevScreen] = useState("fxCalc");
  const loadingTimers = useRef([]);

  const clearLoadingTimers = () => {
    loadingTimers.current.forEach(t => clearTimeout(t));
    loadingTimers.current.forEach(t => clearInterval(t));
    loadingTimers.current = [];
  };

  const startGenerating = (s) => {
    clearLoadingTimers();
    setInsightState("loading");
    setLoadingProgress(0);
    setLoadingStage(s.loadingStages[0].text);

    const total = s.generationMs;
    const startedAt = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(98, (elapsed / total) * 100);
      setLoadingProgress(pct);

      const currentStage = s.loadingStages.find(st => elapsed < st.ms) || s.loadingStages[s.loadingStages.length - 1];
      setLoadingStage(currentStage.text);
    }, 120);
    loadingTimers.current.push(progressInterval);

    const doneTimer = setTimeout(() => {
      clearLoadingTimers();
      setLoadingProgress(100);
      setInsightState("ready");
    }, total);
    loadingTimers.current.push(doneTimer);
  };

  const skipWait = () => {
    clearLoadingTimers();
    setLoadingProgress(100);
    setInsightState("ready");
  };

  const getInsightIconState = () => {
    if (insightState === "loading") return "generating";
    if (insightState === "ready" && !insightViewed) return "ready";
    if (insightState === "ready" && insightViewed) return "viewed";
    // idle — assume prior insight exists for prototype
    return "viewed";
  };

  const handleOpenSheetFromIcon = () => {
    // Works in all states: muted (empty state), generating (loading view), ready/viewed (insight)
    if (insightState === "ready" || insightState === "idle") {
      setInsightViewed(true);
    }
    setShowBottomSheet(true);
  };

  const handleDismissSheetRecommended = () => {
    setShowBottomSheet(false);
    setStripDismissed(true);
    // Trigger receive pulse on the header icon
    setIconReceive(true);
    setTimeout(() => setIconReceive(false), 600);
  };

  // Chat handlers for recommendedChat
  const handleChatIconTap = () => {
    let mode = "coldStart";
    if (screen === "fxCalc") mode = "coldStart";
    else if (screen === "deliveryMethod") mode = "contextual";
    else if (screen === "dashboard" && insightState === "ready" && !insightViewed) mode = "insight";
    else mode = "coldStart";
    setChatMode(mode);
    setShowChatSheet(true);
    if (mode === "insight") setInsightViewed(true);
  };

  const handleChatSubmit = () => {
    // Chat is now handled fully inside ChatBottomSheet (inline expansion).
    // This handler is kept for future use but no longer drives navigation.
  };

  const handleChatSendMore = (text) => {
    setChatMessages(prev => [...prev, { role: "user", text }]);
    setChatTyping(true);
    setTimeout(() => {
      setChatTyping(false);
      setChatMessages(prev => [...prev, { role: "ai", text: "That's a great question! Based on your transfer history, I can help with that. Could you tell me more about what specifically you'd like to know?" }]);
    }, 1500);
  };

  const handleStripTapChat = () => {
    if (scenario?.uiPattern === "recommendedChat") {
      setInsightViewed(true);
      setChatMode("insight");
      setShowChatSheet(true);
    } else {
      setInsightViewed(true);
      setShowBottomSheet(true);
    }
  };

  const insightIconProps = scenario?.uiPattern === "recommended" ? {
    insightIcon: true,
    insightIconState: getInsightIconState(),
    insightIconReceive: iconReceive,
    onInsightIcon: handleOpenSheetFromIcon,
  } : scenario?.uiPattern === "recommendedChat" ? {
    insightIcon: true,
    insightIconState: screen === "dashboard" && insightState === "ready" && !insightViewed ? "ready" : "viewed",
    insightIconReceive: iconReceive,
    onInsightIcon: handleChatIconTap,
  } : {};

  const selectScenario = (s) => {
    setScenario(s);
    setScreen("fxCalc");
    setInsightState("idle");
    setShowSuccessModal(false);
    setInsightViewed(false);
    setFeedback(null);
    setShowBottomSheet(false);
    setSplitExpanded(false);
    setAnnotationPopover(null);
    setStripDismissed(false);
    setChatMode(null);
    setChatMessages([]);
    setChatExpanded(false);
    setShowChatSheet(false);
    setChatTyping(false);
  };

  const restart = () => {
    clearLoadingTimers();
    setScreen("picker");
    setScenario(null);
    setInsightState("idle");
    setShowSuccessModal(false);
    setInsightViewed(false);
    setFeedback(null);
    setShowBottomSheet(false);
    setSplitExpanded(false);
    setAnnotationPopover(null);
    setStripDismissed(false);
    setChatMode(null);
    setChatMessages([]);
    setChatExpanded(false);
    setShowChatSheet(false);
    setChatTyping(false);
  };

  const handleCategorize = () => {
    // Immediately kick off AI generation in background
    startGenerating(scenario);
    setShowSuccessModal(true);
    setInsightViewed(false);
    setFeedback(null);
    setStripDismissed(false);
    setScreen("dashboard");
  };

  const handleSeeDashboard = () => {
    setShowSuccessModal(false);
  };

  // Central router for tapping an insight widget — scenario decides destination.
  // Disabled while loading (caller already guards by showing loading card, not widget).
  const openInsight = () => {
    if (insightState === "loading") return;
    setInsightViewed(true);
    const pat = scenario?.uiPattern;
    if (pat === "reportCard") {
      setScreen("reportCardView");
    } else if (pat === "messageThread") {
      setScreen("messageThreadView");
    } else if (pat === "bottomSheet") {
      setShowBottomSheet(true);
    } else if (pat === "recommended") {
      setShowBottomSheet(true);
    } else if (pat === "splitView") {
      setSplitExpanded(!splitExpanded);
    } else if (pat === "contextAnnotation") {
      // For context annotation, tapping bell goes to standard InsightView
      setScreen("insightView");
    } else if (scenario?.milestone === "M1") {
      setScreen("insightView");
    } else {
      setScreen("chat");
    }
  };

  const nav = (tab) => {
    if (!scenario) return;
    if (scenario.uiPattern === "recommended" || scenario.uiPattern === "recommendedChat") {
      setStripDismissed(true);
    }
    if (tab === "send") setScreen("fxCalc");
    else if (tab === "dashboard") setScreen("dashboard");
    else if (tab === "activity") setScreen("dashboard");
  };

  useEffect(() => () => clearLoadingTimers(), []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0c1220, #162035, #1a2845)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20, gap: 48,
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1); } }
        @keyframes spin { from { transform:rotate(0); } to { transform:rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes shimmerBg { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes modalPop { 0% { opacity: 0; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes reveal { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 60% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        @keyframes accordionExpand { 0% { max-height: 0; opacity: 0; } 100% { max-height: 500px; opacity: 1; } }
        @keyframes expandCard { 0% { opacity: 0; max-height: 0; } 100% { opacity: 1; max-height: 800px; } }
        @keyframes iconFlash { 0% { background: #00c8e6; transform: scale(1.15); } 100% { background: #00abc7; transform: scale(1); } }
        @keyframes iconReceive { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,171,199,0.6); } 30% { transform: scale(1.3); box-shadow: 0 0 0 8px rgba(0,171,199,0.2); } 60% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0,171,199,0); } 100% { transform: scale(1); } }
        @keyframes stripCrossfade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(8px); } }
        @keyframes dotPop { 0% { transform: scale(0); } 60% { transform: scale(1.3); } 100% { transform: scale(1); } }
        @keyframes sheetExpand { from { transform: translateY(40%); opacity: 0.8; } to { transform: translateY(0); opacity: 1; } }
        @keyframes dotBounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-5px); opacity: 1; } }
        * { box-sizing: border-box; margin: 0; -webkit-tap-highlight-color: transparent; }
        button:hover { opacity: 0.92; }
        button:active { transform: scale(0.98); }
        input:focus { border-color: ${C.teal} !important; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <PhoneFrame>
        {screen === "picker" && <Picker onSelect={selectScenario} />}

        {screen === "fxCalc" && scenario && (
          <FxCalcScreen
            scenario={scenario}
            insightState={insightState}
            insightViewed={insightViewed}
            loadingProgress={loadingProgress}
            loadingStage={loadingStage}
            onSkipWait={skipWait}
            onGetStarted={() => setScreen(scenario?.uiPattern === "recommendedChat" ? "deliveryMethod" : "confirm")}
            onInsight={openInsight}
            onNav={nav}
            splitExpanded={splitExpanded}
            onSplitToggle={() => { setInsightViewed(true); setSplitExpanded(!splitExpanded); }}
            onSplitDetail={() => { setInsightViewed(true); setScreen("insightView"); }}
            showBottomSheet={showBottomSheet}
            onBottomSheetOpen={scenario?.uiPattern === "recommendedChat" ? handleStripTapChat : () => { setInsightViewed(true); setShowBottomSheet(true); }}
            onBottomSheetDismiss={scenario?.uiPattern === "recommended" ? handleDismissSheetRecommended : () => setShowBottomSheet(false)}
            feedback={feedback}
            onFeedback={setFeedback}
            annotationPopover={annotationPopover}
            onAnnotationTap={(idx, area) => setAnnotationPopover({ findingIdx: idx, area })}
            onAnnotationDismiss={() => setAnnotationPopover(null)}
            onAnnotationFullInsight={() => { setAnnotationPopover(null); setInsightViewed(true); setScreen("insightView"); }}
            insightIconProps={insightIconProps}
            stripDismissed={stripDismissed}
          />
        )}

        {screen === "confirm" && scenario && (
          <ConfirmTransferScreen
            scenario={scenario}
            onBack={() => setScreen(scenario?.uiPattern === "recommendedChat" ? "deliveryMethod" : "fxCalc")}
            onSend={() => setScreen("categorize")}
            insightIconProps={insightIconProps}
          />
        )}

        {screen === "categorize" && scenario && (
          <CategorizeScreen
            scenario={scenario}
            onBack={() => setScreen("confirm")}
            onCancel={() => setScreen("fxCalc")}
            onCategorize={handleCategorize}
            insightIconProps={insightIconProps}
          />
        )}

        {screen === "dashboard" && scenario && (
          <>
            <DashboardScreen
              scenario={scenario}
              insightState={insightState}
              insightViewed={insightViewed}
              loadingProgress={loadingProgress}
              loadingStage={loadingStage}
              onSkipWait={skipWait}
              onInsight={openInsight}
              onNav={nav}
              splitExpanded={splitExpanded}
              onSplitToggle={() => { setInsightViewed(true); setSplitExpanded(!splitExpanded); }}
              onSplitDetail={() => { setInsightViewed(true); setScreen("insightView"); }}
              showBottomSheet={showBottomSheet}
              onBottomSheetOpen={scenario?.uiPattern === "recommendedChat" ? handleStripTapChat : () => { setInsightViewed(true); setShowBottomSheet(true); }}
              onBottomSheetDismiss={scenario?.uiPattern === "recommended" ? handleDismissSheetRecommended : () => setShowBottomSheet(false)}
              feedback={feedback}
              onFeedback={setFeedback}
              annotationPopover={annotationPopover}
              onAnnotationTap={(idx, area) => setAnnotationPopover({ findingIdx: idx, area })}
              onAnnotationDismiss={() => setAnnotationPopover(null)}
              onAnnotationFullInsight={() => { setAnnotationPopover(null); setInsightViewed(true); setScreen("insightView"); }}
              insightIconProps={insightIconProps}
              stripDismissed={stripDismissed}
            />
            {showSuccessModal && (
              <CategorizeSuccessModal
                scenario={scenario}
                onSeeDashboard={handleSeeDashboard}
              />
            )}
          </>
        )}

        {screen === "chat" && scenario && (
          <ChatScreen
            scenario={scenario}
            onBack={() => setScreen("dashboard")}
            onNav={nav}
            onPostTransfer={() => setScreen("post")}
          />
        )}

        {screen === "insightView" && scenario && (
          <InsightView
            scenario={scenario}
            feedback={feedback}
            onFeedback={setFeedback}
            onBack={() => setScreen("dashboard")}
          />
        )}

        {screen === "reportCardView" && scenario && (
          <ReportCardView
            scenario={scenario}
            feedback={feedback}
            onFeedback={setFeedback}
            onBack={() => setScreen("dashboard")}
          />
        )}

        {screen === "messageThreadView" && scenario && (
          <MessageThreadView
            scenario={scenario}
            feedback={feedback}
            onFeedback={setFeedback}
            onBack={() => setScreen("dashboard")}
          />
        )}

        {screen === "post" && scenario && (
          <PostTransferScreen
            scenario={scenario}
            onBack={() => setScreen("chat")}
            onNav={nav}
          />
        )}

        {screen === "deliveryMethod" && scenario && (
          <DeliveryMethodScreen
            onSelect={() => setScreen("confirm")}
            onBack={() => setScreen("fxCalc")}
            insightIconProps={insightIconProps}
            onInsightIconTap={handleChatIconTap}
          />
        )}

        {screen === "fullChat" && scenario && (
          <FullScreenChat
            messages={chatMessages}
            onSendMessage={handleChatSendMore}
            onBack={() => setScreen(prevScreen)}
            insightIconProps={{}}
            typing={chatTyping}
          />
        )}

        {/* Chat bottom sheet overlay — renders on any screen for recommendedChat */}
        {scenario?.uiPattern === "recommendedChat" && showChatSheet && (
          <ChatBottomSheet
            scenario={scenario}
            mode={chatMode}
            onDismiss={() => { setShowChatSheet(false); setStripDismissed(true); setIconReceive(true); setTimeout(() => setIconReceive(false), 600); }}
            onSubmitChat={handleChatSubmit}
            insightState={insightState}
            feedback={feedback}
            onFeedback={setFeedback}
          />
        )}
      </PhoneFrame>

      {/* Side guide */}
      <div style={{ maxWidth: 320, color: "#94a3b8", fontSize: 13, lineHeight: 1.6 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>
          Flow Guide
        </div>
        {scenario && (
          <div style={{
            fontSize: 11, color: scenario.milestone === "M1" ? "#7dd3c0" : "#94a3b8",
            marginBottom: 14,
            padding: "6px 10px",
            background: scenario.milestone === "M1" ? "rgba(0,180,166,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${scenario.milestone === "M1" ? "rgba(0,180,166,0.35)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 8, display: "inline-block",
          }}>
            {scenario.uiPattern
              ? `🎨 Pattern: ${scenario.label}`
              : scenario.milestone === "M1" ? "🚩 M1: insight + feedback only" : "◇ Future state: with conversation"}
          </div>
        )}
        {[
          { id: "picker", label: "1. Pick scenario", desc: "M1, or future state (A/B)" },
          { id: "fxCalc", label: "2. FX Calculator", desc: "Enter transfer → Get Started" },
          { id: "confirm", label: "3. Confirm Transfer", desc: "Review details → Tap to send" },
          { id: "categorize", label: "4. Categorize", desc: "Pick a category — triggers AI pipeline" },
          { id: "dashboard-modal", label: "5. Success Modal", desc: "Acknowledges send, hints at insight" },
          { id: "dashboard-loading", label: "6. Dashboard (Loading)", desc: "Data immediate; AI card loads" },
          { id: "dashboard-ready", label: "7. Dashboard (Ready)", desc: "AI card reveals with 'New' badge" },
          { id: "fxCalc-delivered", label: "7b. FX Calc (Delivered)", desc: "Bell + widget show on return to FX Calc" },
          ...(scenario?.uiPattern === "recommendedChat" ? [
            { id: "deliveryMethod", label: "3b. Delivery Method", desc: "Select delivery → proceed to confirm" },
          ] : []),
          {
            id: (() => {
              const pat = scenario?.uiPattern;
              if (pat === "reportCard") return "reportCardView";
              if (pat === "messageThread") return "messageThreadView";
              if (pat === "bottomSheet") return "bottomSheet-overlay";
              if (pat === "recommended") return "recommended-overlay";
              if (pat === "recommendedChat") return "chatSheet";
              if (pat === "splitView") return "splitView-expand";
              if (pat === "contextAnnotation") return "annotation-tap";
              return scenario?.milestone === "M1" ? "insightView" : "chat";
            })(),
            label: (() => {
              const pat = scenario?.uiPattern;
              if (pat === "reportCard") return "8. Report Card View";
              if (pat === "messageThread") return "8. Message Thread";
              if (pat === "bottomSheet") return "8. Bottom Sheet";
              if (pat === "recommended") return "8. Bottom Sheet (Icon)";
              if (pat === "recommendedChat") return "8. Chat Sheet";
              if (pat === "splitView") return "8. Expand Card";
              if (pat === "contextAnnotation") return "8. Tap Annotation";
              return scenario?.milestone === "M1" ? "8. Insight + Feedback" : "8. AI Chat";
            })(),
            desc: (() => {
              const pat = scenario?.uiPattern;
              if (pat === "reportCard") return "Full-page article layout + feedback";
              if (pat === "messageThread") return "Thread of message bubbles";
              if (pat === "bottomSheet") return "Half-screen overlay with accordions";
              if (pat === "recommended") return "Persistent header icon + sheet overlay";
              if (pat === "recommendedChat") return "Tap icon → chat sheet with pills";
              if (pat === "splitView") return "Card expands inline with all detail";
              if (pat === "contextAnnotation") return "Popovers on annotated sections";
              return scenario?.milestone === "M1" ? "Pseudo-chat: insight + 👍👎 + reasons" : "Deep-dive conversation";
            })(),
          },
          ...(scenario?.uiPattern === "recommendedChat" ? [
            { id: "fullChat", label: "9. Full Chat", desc: "Expanded AI conversation view" },
          ] : []),
          { id: "post", label: "9. Post-Transfer", desc: "Transfer details + follow-up insight", futureOnly: true },
        ].filter(item => !(item.futureOnly && scenario?.milestone === "M1")).map(item => {
          let active = false;
          if (item.id === screen) active = true;
          if (item.id === "bottomSheet-overlay" && showBottomSheet) active = true;
          if (item.id === "recommended-overlay" && showBottomSheet) active = true;
          if (item.id === "chatSheet" && showChatSheet) active = true;
          if (item.id === "splitView-expand" && splitExpanded) active = true;
          if (item.id === "annotation-tap" && annotationPopover) active = true;
          if (item.id === "dashboard-modal" && screen === "dashboard" && showSuccessModal) active = true;
          if (item.id === "dashboard-loading" && screen === "dashboard" && !showSuccessModal && insightState === "loading") active = true;
          if (item.id === "dashboard-ready" && screen === "dashboard" && !showSuccessModal && insightState === "ready") active = true;
          if (item.id === "fxCalc-delivered" && screen === "fxCalc" && insightState === "ready") active = true;
          return (
            <div key={item.id} style={{
              padding: "9px 14px", marginBottom: 5, borderRadius: 10,
              background: active ? "rgba(0,180,166,0.12)" : "rgba(255,255,255,0.02)",
              borderLeft: active ? `3px solid ${C.teal}` : "3px solid transparent",
              transition: "all 0.2s ease",
            }}>
              <strong style={{ color: active ? "#e2e8f0" : "#94a3b8", fontSize: 13 }}>{item.label}</strong><br />
              <span style={{ fontSize: 11 }}>{item.desc}</span>
            </div>
          );
        })}
        <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.04)", fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#94a3b8" }}>Sync vs Async:</strong> A = ~5s fast path. B/C = ~20s with progressive stages — use "Fast forward" during loading to jump ahead.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#94a3b8" }}>Delivery cue (M1):</strong> When async generation completes, a bell dot appears in the FX Calc header and a "New insight ready" widget surfaces there — for users who leave Dashboard before ready.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: "#94a3b8" }}>Feedback sticks:</strong> Thumbs selection + reasons persist across navigation. Re-open the insight to see submitted state.
          </div>
          <div>
            <strong style={{ color: "#94a3b8" }}>Quality gate:</strong> In production, weak insights would not surface — no card, no bell.
          </div>
          <button onClick={restart} style={{
            marginTop: 12, width: "100%", padding: "8px 10px",
            background: "rgba(0,180,166,0.2)", color: "#e2e8f0",
            border: `1px solid ${C.teal}40`, borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>↺ Restart flow</button>
        </div>
      </div>
    </div>
  );
}
