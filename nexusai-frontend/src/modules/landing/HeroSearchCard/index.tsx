'use client';
import { useState, useRef, useEffect } from 'react';
import { Box } from '@mui/material';
import { styles } from './styles';

const SQ_DATA: Record<string, { icon: string; text: string }[]> = {
  recruiting: [
    { icon: '🔍', text: 'Monitor job postings at target companies' },
    { icon: '💰', text: 'Benchmark salary for a specific role' },
    { icon: '📋', text: 'Build a hiring pipeline tracker' },
    { icon: '🤝', text: 'Research a candidate before an interview' },
    { icon: '🗺️', text: 'Build an interactive talent market map' },
  ],
  prototype: [
    { icon: '⚡', text: 'Generate a React component from a sketch' },
    { icon: '🎨', text: 'Design a landing page layout in minutes' },
    { icon: '🔧', text: 'Build a REST API prototype with Node.js' },
    { icon: '📱', text: 'Create a mobile app wireframe' },
    { icon: '🤖', text: 'Prototype a chatbot for my website' },
  ],
  business: [
    { icon: '📊', text: 'Write a business plan for a SaaS startup' },
    { icon: '📈', text: 'Build a financial model and projections' },
    { icon: '🎯', text: 'Create a go-to-market strategy' },
    { icon: '🤝', text: 'Draft an investor pitch deck outline' },
    { icon: '⚖️', text: 'Analyse competitors in my market' },
  ],
  learn: [
    { icon: '🧠', text: 'Explain machine learning in simple terms' },
    { icon: '📚', text: 'Create a personalised study plan for me' },
    { icon: '🌍', text: 'Help me learn a new language faster' },
    { icon: '💡', text: 'Summarise a complex topic step by step' },
    { icon: '🧪', text: 'Quiz me on any subject I choose' },
  ],
  research: [
    { icon: '🔬', text: 'Summarise latest research on a topic' },
    { icon: '📰', text: 'Find and compare top AI models for my task' },
    { icon: '🌐', text: 'Research market trends in my industry' },
    { icon: '📖', text: 'Explain a technical paper in plain English' },
    { icon: '🧩', text: 'Map out key players in a new field' },
  ],
};

const SQ_TABS = [
  { key: 'recruiting', label: 'Recruiting', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { key: 'prototype', label: 'Create a prototype', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { key: 'business', label: 'Build a business', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { key: 'learn', label: 'Help me learn', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  { key: 'research', label: 'Research', icon: <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg> },
];


const HeroSearchCard = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeTab, setActiveTab] = useState('recruiting');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  useEffect(() => { autoResize(); }, [query]);

  const handleSqPick = (text: string) => {
    setQuery(text);
    textareaRef.current?.focus();
    setFocused(true);
  };

  const currentItems = SQ_DATA[activeTab] || [];

  return (
    <Box sx={styles?.root()}>
      {/* Search Card */}
      <Box sx={focused ? styles?.cardFocused() : styles?.card()}>
        {/* Top Row: textarea + avatar icons */}
        <Box sx={styles?.topRow()}>
          <textarea
            ref={textareaRef}
            className="hsb-input"
            placeholder="Click here and type anything — or just say hi! 🙋"
            value={query}
            rows={1}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{ flex: 1 }}
          />
          <Box sx={styles?.avatarIcons()}>
            <Box sx={{ ...styles?.avatarIcon(), background: 'linear-gradient(135deg,#10b981,#059669)' }} title="AI Assistant">
              <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            </Box>
            <Box sx={{ ...styles?.avatarIcon(), background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }} title="Extension">
              <svg viewBox="0 0 24 24" fill="white" width="13" height="13"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            </Box>
          </Box>
        </Box>

        {/* Bottom Bar: tools + agent chip + go */}
        <div className="hsb-bottom-bar">
          {/* Mic */}
          <button className="hsb-ibox" title="Voice input" style={{ ['--ic' as string]: '#7C3AED', ['--ic-lt' as string]: '#F3EEFF', ['--ic-border' as string]: 'rgba(124,58,237,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
            </svg>
          </button>
          {/* Attach */}
          <button className="hsb-ibox" title="Attach file" style={{ ['--ic' as string]: '#D97706', ['--ic-lt' as string]: '#FFFBEB', ['--ic-border' as string]: 'rgba(217,119,6,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          {/* Image */}
          <button className="hsb-ibox" title="Upload image" style={{ ['--ic' as string]: '#2563EB', ['--ic-lt' as string]: '#EFF6FF', ['--ic-border' as string]: 'rgba(37,99,235,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>
          {/* Voice typing */}
          <button className="hsb-ibox" title="Voice typing" style={{ ['--ic' as string]: '#0891B2', ['--ic-lt' as string]: '#E0F7FA', ['--ic-border' as string]: 'rgba(8,145,178,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <rect x="2" y="14" width="20" height="7" rx="2"/><path d="M9 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z" transform="translate(3,0)"/><path d="M17 10v1a5 5 0 0 1-10 0v-1"/><line x1="8" y1="17" x2="8" y2="17.01"/><line x1="12" y1="17" x2="12" y2="17.01"/><line x1="16" y1="17" x2="16" y2="17.01"/>
            </svg>
          </button>
          {/* Video */}
          <button className="hsb-ibox" title="Video input" style={{ ['--ic' as string]: '#DC2626', ['--ic-lt' as string]: '#FEF2F2', ['--ic-border' as string]: 'rgba(220,38,38,0.22)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </button>
          {/* Screen */}
          <button className="hsb-ibox" title="Share screen" style={{ ['--ic' as string]: '#059669', ['--ic-lt' as string]: '#ECFDF5', ['--ic-border' as string]: 'rgba(5,150,105,0.25)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </button>

          <div className="hsb-bar-sep" />

          {/* Agent chip */}
          <button className="hsb-computer-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
              <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Agent
            <span className="hsb-computer-chip-plus">+</span>
          </button>

          <div style={{ flex: 1 }} />

          {/* Go button */}
          <button className="hsb-go-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: 14, height: 14 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Let&apos;s go
          </button>
        </div>
      </Box>

      {/* Suggested Questions Panel */}
      <div className="sq-panel">
        <div className="sq-tabs">
          {SQ_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`sq-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="sq-body">
          <div className="sq-list">
            {currentItems.map((item) => (
              <button
                key={item.text}
                className="sq-item"
                onClick={() => handleSqPick(item.text)}
              >
                <span className="sq-item-icon">{item.icon}</span>
                <span className="sq-item-text">{item.text}</span>
                <span className="sq-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
        <div className="sq-footer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 11, height: 11 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Click any suggestion to fill the search box, then press <strong style={{ marginLeft: 3 }}>Let&apos;s go</strong>
        </div>
      </div>

    </Box>
  );
};

export default HeroSearchCard;
