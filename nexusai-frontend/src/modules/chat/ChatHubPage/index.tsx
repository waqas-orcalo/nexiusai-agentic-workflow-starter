'use client';
import { useState } from 'react';
import Link from 'next/link';

/* ─── Sidebar Models ─────────────────────────────────────────────── */
const SB_MODELS = [
  { id: 'gpt5',           icon: '🧠', bg: '#EEF2FD', name: 'GPT-5',           org: 'OpenAI',     live: true },
  { id: 'gpt52',          icon: '🧠', bg: '#EEF2FD', name: 'GPT-5.2',         org: 'OpenAI',     live: true },
  { id: 'gpt5-turbo',     icon: '⚡', bg: '#EEF2FD', name: 'GPT-5 Turbo',     org: 'OpenAI',     live: true },
  { id: 'gpt45',          icon: '🔮', bg: '#EEF2FD', name: 'GPT-4.5',         org: 'OpenAI',     live: true },
  { id: 'gpt41',          icon: '💡', bg: '#EEF2FD', name: 'GPT-4.1',         org: 'OpenAI',     live: true },
  { id: 'gpt41-mini',     icon: '⚡', bg: '#EEF2FD', name: 'GPT-4.1-mini',    org: 'OpenAI',     live: true },
  { id: 'gpt4o',          icon: '🌟', bg: '#EEF2FD', name: 'GPT-4o',          org: 'OpenAI',     live: true },
  { id: 'gpt4o-mini',     icon: '🔹', bg: '#EEF2FD', name: 'GPT-4o-mini',     org: 'OpenAI',     live: true },
  { id: 'o3',             icon: '🔷', bg: '#EEF2FD', name: 'o3',              org: 'OpenAI',     live: true },
  { id: 'o3-mini',        icon: '🔸', bg: '#EEF2FD', name: 'o3-mini',         org: 'OpenAI',     live: true },
  { id: 'o4-mini',        icon: '🟡', bg: '#EEF2FD', name: 'o4-mini',         org: 'OpenAI',     live: true },
  { id: 'claude-opus',    icon: '👑', bg: '#FDF1EB', name: 'Claude Opus 4.6', org: 'Anthropic',  live: true },
  { id: 'claude-opus45',  icon: '👑', bg: '#FDF1EB', name: 'Claude Opus 4.5', org: 'Anthropic',  live: true },
  { id: 'claude-sonnet',  icon: '🔮', bg: '#FDF1EB', name: 'Claude Sonnet 4.6',org: 'Anthropic', live: true },
  { id: 'claude-haiku',   icon: '✦',  bg: '#FDF1EB', name: 'Claude Haiku 4.5',org: 'Anthropic',  live: true },
  { id: 'gemini-ultra',   icon: '🔬', bg: '#EBF0FC', name: 'Gemini 2.5 Ultra',org: 'Google',     live: true },
  { id: 'gemini-pro',     icon: '💫', bg: '#EBF0FC', name: 'Gemini 2.5 Pro',  org: 'Google',     live: true },
  { id: 'gemini-flash',   icon: '⚡', bg: '#EBF0FC', name: 'Gemini 2.5 Flash',org: 'Google',     live: true },
  { id: 'llama4-maverick',icon: '🦙', bg: '#EEF6FF', name: 'Llama 4 Maverick',org: 'Meta',       live: true },
  { id: 'llama4-scout',   icon: '🦙', bg: '#EEF6FF', name: 'Llama 4 Scout',   org: 'Meta',       live: true },
  { id: 'deepseek-r2',    icon: '💻', bg: '#E8F8F0', name: 'DeepSeek R2',     org: 'DeepSeek',   live: true },
  { id: 'grok3',          icon: '𝕏',  bg: '#F2F2F2', name: 'Grok 3',          org: 'xAI',        live: true },
  { id: 'qwen3',          icon: '🀄', bg: '#FFF4EB', name: 'Qwen 3 Max',      org: 'Alibaba',    live: true },
  { id: 'mistral-large',  icon: '🌀', bg: '#F3F2F0', name: 'Mistral Large 3', org: 'Mistral AI', live: true },
  { id: 'kimi-k2',        icon: '🌙', bg: '#F0EEFF', name: 'Kimi K2',         org: 'Moonshot AI',live: false },
];

/* ─── Greeting goal tiles ────────────────────────────────────────── */
const GOAL_TILES = [
  { em: '✍️', label: 'Write content', sub: 'Emails, posts, stories' },
  { em: '🎨', label: 'Create images', sub: 'Art, photos, designs' },
  { em: '🛠️', label: 'Build something', sub: 'Apps, tools, websites' },
  { em: '⚡', label: 'Automate work', sub: 'Save hours every week' },
  { em: '📊', label: 'Analyse data', sub: 'PDFs, sheets, reports' },
  { em: '🔍', label: 'Just exploring', sub: "Show me what's possible" },
];

/* ─── Category Prompt Panel data ─────────────────────────────────── */
const CPANEL_TABS = [
  {
    key: 'use_cases', label: 'Use cases',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    prompts: [
      'Monitor job postings at target companies', 'Build a hiring pipeline tracker',
      'Research a candidate before an interview', 'Benchmark salary for a specific role',
      'Build an interactive talent market map', 'Generate interview questions for a role',
    ],
  },
  {
    key: 'monitor', label: 'Monitor the situation',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
    prompts: [
      'Track industry news and trends', 'Monitor competitor activity and pricing',
      'Alert me to relevant regulatory changes', 'Summarise weekly AI news headlines',
      'Track social sentiment around a brand', 'Watch for funding announcements in my sector',
    ],
  },
  {
    key: 'prototype', label: 'Create a prototype',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    prompts: [
      'Generate a React component from a sketch', 'Build a REST API prototype with Node.js',
      'Design a landing page layout in minutes', 'Create a mobile app wireframe',
      'Prototype a chatbot for my website', 'Build a Chrome extension prototype',
    ],
  },
  {
    key: 'business', label: 'Build a business plan',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    prompts: [
      'Write a business plan for a SaaS startup', 'Build a financial model and projections',
      'Create a go-to-market strategy', 'Draft an investor pitch deck outline',
      'Analyse competitors in my market', 'Build a pricing strategy framework',
    ],
  },
  {
    key: 'create', label: 'Create content',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    prompts: [
      'Write a LinkedIn post about my product', 'Draft a cold email campaign sequence',
      'Create a blog post outline on AI trends', 'Write product descriptions for my store',
      'Generate social media content calendar', 'Write a compelling landing page copy',
    ],
  },
  {
    key: 'analyze', label: 'Analyze & research',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    prompts: [
      'Summarise the latest research on a topic', 'Find and compare top AI models for my task',
      'Analyse data in this CSV and summarise', 'Research market trends in my industry',
      'Explain a technical paper in plain English', 'Map out key players in a new field',
    ],
  },
  {
    key: 'learn', label: 'Learn something',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
    prompts: [
      'Explain machine learning in simple terms', 'Create a personalised study plan for me',
      'Help me learn a new language faster', 'Summarise a complex topic step by step',
      'Quiz me on any subject I choose', 'Teach me how to use AI for my job',
    ],
  },
];

/* ─── Quick Actions ──────────────────────────────────────────────── */
const QA_GROUPS = [
  {
    label: 'Navigation & Tools',
    items: [
      { icon: '🛍', text: 'Browse Marketplace' },
      { icon: '🤖', text: 'Build an Agent' },
      { icon: '📖', text: 'How to use Guide' },
      { icon: '📐', text: 'Prompt Engineering' },
      { icon: '💰', text: 'View Pricing' },
      { icon: '📊', text: 'AI Models Analysis' },
    ],
  },
  {
    label: 'Create & Generate',
    items: [
      { icon: '🎨', text: 'Create image' },
      { icon: '🎵', text: 'Generate Audio' },
      { icon: '🎬', text: 'Create video' },
      { icon: '📋', text: 'Create slides' },
      { icon: '📈', text: 'Create Infographs' },
      { icon: '❓', text: 'Create quiz' },
      { icon: '🗂️', text: 'Create Flashcards' },
      { icon: '🧠', text: 'Create Mind map' },
    ],
  },
  {
    label: 'Analyze & Write',
    items: [
      { icon: '📉', text: 'Analyze Data' },
      { icon: '✍️', text: 'Write content' },
      { icon: '💻', text: 'Code Generation' },
      { icon: '📄', text: 'Document Analysis' },
      { icon: '🌐', text: 'Translate' },
    ],
  },
];

/* ─── Active model data for right panel ─────────────────────────── */
const MODEL_DETAILS: Record<string, { icon: string; bg: string; name: string; org: string; desc: string; ctx: string; price: string; rating: string }> = {
  gpt5: { icon: '🧠', bg: '#EEF2FD', name: 'GPT-5', org: 'by OpenAI', desc: 'OpenAI flagship. Native agent use, advanced reasoning, 2M context window.', ctx: '2M', price: '$7.50', rating: '4.9⭐' },
  'gpt5-turbo': { icon: '⚡', bg: '#EEF2FD', name: 'GPT-5 Turbo', org: 'by OpenAI', desc: 'Fast, cost-effective GPT-5 for high-volume deployments.', ctx: '1M', price: '$2.50', rating: '4.8⭐' },
  'claude-opus': { icon: '👑', bg: '#FDF1EB', name: 'Claude Opus 4.6', org: 'by Anthropic', desc: 'Most powerful Claude. Best for agents, long documents and complex reasoning.', ctx: '200K', price: '$5.00', rating: '4.8⭐' },
  'claude-sonnet': { icon: '🔮', bg: '#FDF1EB', name: 'Claude Sonnet 4.6', org: 'by Anthropic', desc: 'Balanced intelligence and speed. Ideal for enterprise workloads.', ctx: '200K', price: '$3.00', rating: '4.7⭐' },
  'gemini-ultra': { icon: '🔬', bg: '#EBF0FC', name: 'Gemini 2.5 Ultra', org: 'by Google', desc: 'Google\'s most capable model with 1M+ context and strong multimodal skills.', ctx: '1.05M', price: '$3.50', rating: '4.8⭐' },
};

function getActiveModelDetails(modelId: string) {
  const detailed = MODEL_DETAILS[modelId];
  if (detailed) return detailed;

  const sb = SB_MODELS.find((m) => m.id === modelId);
  if (sb) {
    return {
      icon: sb.icon,
      bg: sb.bg,
      name: sb.name,
      org: `by ${sb.org}`,
      desc: 'Select a model to see details.',
      ctx: '—',
      price: '—',
      rating: '—',
    };
  }

  return {
    icon: '✦',
    bg: 'var(--bg2)',
    name: modelId,
    org: 'by —',
    desc: 'Select a model to see details.',
    ctx: '—',
    price: '—',
    rating: '—',
  };
}

type UsageOverview = { requests: string; avgLatency: string; costToday: string; spark: number[] };

const USAGE_OVERVIEW: Record<string, UsageOverview> = {
  'gpt5-turbo': { requests: '1,284', avgLatency: '1.2s', costToday: '$2.40', spark: [8, 10, 14, 12, 18, 22, 16, 20, 28, 24, 26, 30, 22, 18, 20, 26, 34, 30, 28, 36, 40, 34] },
  'claude-opus': { requests: '642', avgLatency: '1.6s', costToday: '$3.10', spark: [6, 8, 10, 12, 14, 16, 18, 16, 14, 20, 22, 24, 20, 18, 22, 26, 28, 30, 34, 32, 30, 28] },
  'claude-sonnet': { requests: '903', avgLatency: '1.3s', costToday: '$2.05', spark: [7, 9, 11, 13, 12, 14, 18, 20, 18, 16, 22, 24, 26, 24, 22, 28, 30, 32, 34, 36, 34, 32] },
  'gemini-ultra': { requests: '1,094', avgLatency: '1.1s', costToday: '$2.55', spark: [9, 11, 12, 14, 16, 18, 22, 24, 26, 22, 20, 24, 28, 30, 32, 34, 36, 34, 32, 38, 40, 42] },
};

function getUsageOverview(modelId: string): UsageOverview {
  const preset = USAGE_OVERVIEW[modelId];
  if (preset) return preset;

  // Deterministic fallback based on modelId string (no Math.random -> avoids hydration mismatch)
  let seed = 0;
  for (let i = 0; i < modelId.length; i++) seed = (seed * 31 + modelId.charCodeAt(i)) >>> 0;
  const next = () => (seed = (seed * 1664525 + 1013904223) >>> 0);

  const req = 600 + (next() % 1200);
  const latencyTenth = 9 + (next() % 11); // 0.9s - 1.9s
  const costCents = 140 + (next() % 260); // $1.40 - $3.99

  const spark = Array.from({ length: 22 }, () => 6 + (next() % 38)); // 6-43

  return {
    requests: req.toLocaleString('en-US'),
    avgLatency: `${(latencyTenth / 10).toFixed(1)}s`,
    costToday: `$${(costCents / 100).toFixed(2)}`,
    spark,
  };
}

const ChatHubPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'agents'>('chat');
  const [selectedModel, setSelectedModel] = useState('gpt5');
  const [cpanelTab, setCpanelTab] = useState('use_cases');
  const [inputVal, setInputVal] = useState('');

  const activeCpanel = CPANEL_TABS.find((t) => t.key === cpanelTab);
  const activeModel = getActiveModelDetails(selectedModel);
  const usage = getUsageOverview(selectedModel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>

      {/* ── App Nav ── */}
      <nav className="app-nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 22, height: 22, background: 'var(--text)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 14 14" style={{ width: 11, height: 11 }} fill="white"><path d="M7 1 L13 7 L7 13 L1 7 Z"/></svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>NexusAI</span>
        </Link>

        <div className="app-tabs">
          <button className={`app-tab${activeTab === 'chat' ? ' active' : ''}`} onClick={() => setActiveTab('chat')}>💬 Chat Hub</button>
          <Link className="app-tab" href="/marketplace">🛍 Marketplace</Link>
          <Link className="app-tab" href="/agents">🤖 Agents</Link>
          <Link className="app-tab" href="/discover">🔬 Discover New</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: 'none', border: '1px solid var(--border2)', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text2)', fontWeight: 500 }}>Sign in</button>
          <button style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: 'var(--accent)', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', color: 'white', fontWeight: 600 }}>Try free →</button>
        </div>
      </nav>

      {/* ── App Body ── */}
      <div className="app-body">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="sb-sec" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="sb-lbl">Models</div>
            <input className="sb-search" type="text" placeholder="Search 525 models…" />
            <div style={{ marginTop: '0.5rem' }}>
              {SB_MODELS.map((m) => (
                <div
                  key={m.id}
                  className={`sb-model${selectedModel === m.id ? ' on' : ''}`}
                  onClick={() => setSelectedModel(m.id)}
                >
                  <div className="sb-mi" style={{ background: m.bg }}>{m.icon}</div>
                  <div>
                    <div className="sb-mn">{m.name}</div>
                    <div className="sb-ms">
                      <span className={`sdot ${m.live ? 'live' : 'beta'}`} />
                      {m.org}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Create Agent CTA */}
          <div className="sb-sec">
            <div style={{ background: 'var(--accent-lt)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius)', padding: '0.875rem', cursor: 'pointer' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>+ Create Agent</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>Build a custom AI agent with any model</div>
            </div>
          </div>
        </aside>

        {/* ── Central ── */}
        <main className="central">
          <>
              {/* Chat Area */}
              <div className="chat-area" id="chat-area">
                {/* Greeting Card */}
                <div className="greet-card" style={{ alignSelf: 'center' }}>
                  <div className="greet-avatar">✦</div>
                  <h3 style={{ fontSize: '1.45rem', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
                    Welcome! I&apos;m here to help you 👋
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.65, textAlign: 'center' }}>
                    No tech background needed. Tell me what you&apos;d like to <strong>achieve</strong> — I&apos;ll help you discover what&apos;s possible, step by step.
                  </p>

                  {/* Goal tiles container */}
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--accent)', marginBottom: '0.75rem' }}>
                      ✨ What would you like to do today?
                    </div>
                    <div className="ob-grid">
                      {GOAL_TILES.map((tile) => (
                        <div
                          key={tile.label}
                          className="ob-tile"
                          onClick={() => setInputVal(tile.label)}
                        >
                          <span className="ob-tile-icon">{tile.em}</span>
                          <div className="ob-tile-label">{tile.label}</div>
                          <div className="ob-tile-sub">{tile.sub}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text3)' }}>
                    Or type anything below — there are no wrong answers ↓
                  </div>
                </div>
              </div>

              {/* ── Input Area ── */}
              <div className="inp-area">
                <div className="hub-attach-row" id="hub-attach-row" />

                <div className="inp-row">
                  <div className="inp-wrap">
                    <textarea
                      id="chat-input"
                      rows={1}
                      placeholder="Describe your project, ask a question, or just say hi — I'm here to help…"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                    />
                    <div className="inp-bar">
                      {/* Voice */}
                      <button className="inp-icon-btn ic-purple" title="Voice conversation">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                          <line x1="12" y1="19" x2="12" y2="22"/>
                        </svg>
                      </button>
                      {/* Voice typing */}
                      <button className="inp-icon-btn ic-orange" title="Voice typing">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="14" width="20" height="7" rx="2"/>
                          <path d="M12 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"/>
                          <path d="M18 10v1a6 6 0 0 1-12 0v-1"/>
                          <line x1="8" y1="17.5" x2="8" y2="17.51"/>
                          <line x1="12" y1="17.5" x2="12" y2="17.51"/>
                          <line x1="16" y1="17.5" x2="16" y2="17.51"/>
                        </svg>
                      </button>
                      {/* Video */}
                      <button className="inp-icon-btn ic-blue" title="Video">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                        </svg>
                      </button>
                      {/* Screen sharing */}
                      <button className="inp-icon-btn ic-teal" title="Screen sharing">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                          <polyline points="8 21 12 17 16 21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                      </button>
                      {/* Attach */}
                      <button className="inp-icon-btn ic-rose" title="Attach file">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                      </button>
                      {/* Image */}
                      <button className="inp-icon-btn ic-green" title="Upload image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </button>

                      <button className="itool" title="Prompt tips">✦</button>
                      <div className="model-sel">
                        <span>{SB_MODELS.find((m) => m.id === selectedModel)?.name || 'GPT-5'}</span>
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                  <button className="send-btn">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>

                {/* ── Category Prompt Panel ── */}
                <div className="cpanel">
                  <div className="cpanel-tabs">
                    {CPANEL_TABS.map((tab) => (
                      <button
                        key={tab.key}
                        className={`cpanel-tab${cpanelTab === tab.key ? ' active' : ''}`}
                        onClick={() => setCpanelTab(tab.key)}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="cpanel-prompts">
                    {activeCpanel?.prompts.map((p) => (
                      <button key={p} className="cpanel-prompt" onClick={() => setInputVal(p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
        </main>

        {/* ── Right Panel ── */}
        <aside className="rpanel">

          {/* Active Model Card — shown when a model is selected from sidebar */}
          {selectedModel !== 'gpt5' && (
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div className="rp-lbl">ACTIVE MODEL</div>
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.875rem', marginTop: '0.5rem' }}>
                <div className="rp-am-head">
                  <div className="rp-am-icon" style={{ background: activeModel.bg }}>{activeModel.icon}</div>
                  <div>
                    <div className="rp-am-name">{activeModel.name}</div>
                    <div className="rp-am-org">{activeModel.org}</div>
                  </div>
                  <span className="rp-am-live">Live</span>
                </div>
                <div className="rp-am-desc">{activeModel.desc}</div>
                <div className="rp-am-stats">
                  <div className="rp-am-stat"><strong>{activeModel.ctx}</strong><span>Context</span></div>
                  <div className="rp-am-stat"><strong>{activeModel.price}</strong><span>/1M tk</span></div>
                  <div className="rp-am-stat"><strong>{activeModel.rating}</strong><span>Rating</span></div>
                </div>
                <div className="rp-am-btns">
                  <button className="rp-am-btn outline">Details</button>
                  <button className="rp-am-btn filled">Pricing</button>
                </div>
              </div>
            </div>
          )}

          {/* Usage Overview — shown when a model is selected (matches Raw html/index.html) */}
          {selectedModel !== 'gpt5' && (
            <div className="rp-usage show">
              <div className="rp-lbl">USAGE OVERVIEW</div>
              <div className="rp-usage-stats">
                <div className="rp-usage-stat">
                  <div className="u-label">Requests</div>
                  <div className="u-val">{usage.requests}</div>
                </div>
                <div className="rp-usage-stat">
                  <div className="u-label">Avg Latency</div>
                  <div className="u-val">{usage.avgLatency}</div>
                </div>
                <div className="rp-usage-stat">
                  <div className="u-label">Cost (today)</div>
                  <div className="u-val">{usage.costToday}</div>
                </div>
              </div>
              <div className="rp-spark-wrap">
                <div className="rp-spark" aria-hidden>
                  {usage.spark.map((h, i) => (
                    <div
                      key={i}
                      className="rp-spark-bar"
                      style={{ height: h, opacity: 0.55 + (h / 100) }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="rp-sec" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="rp-lbl">Quick Actions</div>
            <div className="qa-grid">
              {QA_GROUPS.map((group, idx) => (
                <div key={group.label}>
                  <div className="qa-group-label" style={idx === 0 ? undefined : { marginTop: 10 }}>
                    {group.label}
                  </div>
                  {group.items.map((item) => (
                    <button key={item.text} className="qa-btn">
                      <span className="qa-icon">{item.icon}</span>
                      <span className="qa-text">{item.text}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default ChatHubPage;
