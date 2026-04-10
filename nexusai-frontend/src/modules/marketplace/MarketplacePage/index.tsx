'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

const SB_MODELS = [
  { id: 'gpt5', icon: '🧠', bg: '#EEF2FD', name: 'GPT-5', org: 'OpenAI', live: true },
  { id: 'gpt52', icon: '🧠', bg: '#EEF2FD', name: 'GPT-5.2', org: 'OpenAI', live: true },
  { id: 'gpt5-turbo', icon: '⚡', bg: '#EEF2FD', name: 'GPT-5 Turbo', org: 'OpenAI', live: true },
  { id: 'gpt45', icon: '🔮', bg: '#EEF2FD', name: 'GPT-4.5', org: 'OpenAI', live: true },
  { id: 'gpt41', icon: '💡', bg: '#EEF2FD', name: 'GPT-4.1', org: 'OpenAI', live: true },
  { id: 'gpt41-mini', icon: '⚡', bg: '#EEF2FD', name: 'GPT-4.1-mini', org: 'OpenAI', live: true },
  { id: 'gpt4o', icon: '🌟', bg: '#EEF2FD', name: 'GPT-4o', org: 'OpenAI', live: true },
  { id: 'gpt4o-mini', icon: '🔹', bg: '#EEF2FD', name: 'GPT-4o-mini', org: 'OpenAI', live: true },
  { id: 'o3', icon: '🔷', bg: '#EEF2FD', name: 'o3', org: 'OpenAI', live: true },
  { id: 'o3-mini', icon: '🔸', bg: '#EEF2FD', name: 'o3-mini', org: 'OpenAI', live: true },
  { id: 'o4-mini', icon: '🟡', bg: '#EEF2FD', name: 'o4-mini', org: 'OpenAI', live: true },
  { id: 'claude-opus', icon: '👑', bg: '#FDF1EB', name: 'Claude Opus 4.6', org: 'Anthropic', live: true },
  { id: 'claude-opus45', icon: '👑', bg: '#FDF1EB', name: 'Claude Opus 4.5', org: 'Anthropic', live: true },
  { id: 'claude-sonnet', icon: '🔮', bg: '#FDF1EB', name: 'Claude Sonnet 4.6', org: 'Anthropic', live: true },
  { id: 'claude-haiku', icon: '✦', bg: '#FDF1EB', name: 'Claude Haiku 4.5', org: 'Anthropic', live: true },
  { id: 'gemini-ultra', icon: '🔬', bg: '#EBF0FC', name: 'Gemini 2.5 Ultra', org: 'Google', live: true },
  { id: 'gemini-pro', icon: '💫', bg: '#EBF0FC', name: 'Gemini 2.5 Pro', org: 'Google', live: true },
  { id: 'gemini-flash', icon: '⚡', bg: '#EBF0FC', name: 'Gemini 2.5 Flash', org: 'Google', live: true },
  { id: 'llama4-maverick', icon: '🦙', bg: '#EEF6FF', name: 'Llama 4 Maverick', org: 'Meta', live: true },
  { id: 'llama4-scout', icon: '🦙', bg: '#EEF6FF', name: 'Llama 4 Scout', org: 'Meta', live: true },
  { id: 'deepseek-r2', icon: '💻', bg: '#E8F8F0', name: 'DeepSeek R2', org: 'DeepSeek', live: true },
  { id: 'grok3', icon: '𝕏', bg: '#F2F2F2', name: 'Grok 3', org: 'xAI', live: true },
  { id: 'qwen3', icon: '🀄', bg: '#FFF4EB', name: 'Qwen 3 Max', org: 'Alibaba', live: true },
  { id: 'mistral-large', icon: '🌀', bg: '#F3F2F0', name: 'Mistral Large 3', org: 'Mistral AI', live: true },
  { id: 'kimi-k2', icon: '🌙', bg: '#F0EEFF', name: 'Kimi K2', org: 'Moonshot AI', live: false },
];

/** Stable pseudo-rating per model id (3.8–5.2) for Min Rating filter UI */
function modelRatingForId(id: string): number {
  let seed = 0;
  for (let i = 0; i < id.length; i++) seed = (seed * 31 + id.charCodeAt(i)) >>> 0;
  const tenths = 38 + (seed % 15);
  return tenths / 10;
}

export default function MarketplacePage() {
  const [mktQuery, setMktQuery] = useState('');
  const [mktQuery2, setMktQuery2] = useState('');
  const [mktFilter, setMktFilter] = useState<'all' | 'language' | 'vision' | 'code' | 'image' | 'audio' | 'open'>('all');
  const [activeLab, setActiveLab] = useState<string>('All Labs');
  const [mktMode, setMktMode] = useState<'browse' | 'compare' | 'cost'>('browse');
  const [manufMenuOpen, setManufMenuOpen] = useState(false);
  const manufDdRef = useRef<HTMLDivElement>(null);
  const [minRating, setMinRating] = useState<'any' | '4' | '4.5'>('any');
  const [pricingModel, setPricingModel] = useState({
    payPerUse: true,
    subscription: true,
    freeTier: false,
    enterprise: false,
  });
  const [licence, setLicence] = useState({
    commercial: true,
    openSource: true,
    researchOnly: false,
  });

  const labs = useMemo(() => ['All Labs', ...Array.from(new Set(SB_MODELS.map((m) => m.org)))], []);
  const manufacturers = useMemo(() => labs.slice(1), [labs]);

  useEffect(() => {
    if (!manufMenuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (manufDdRef.current && !manufDdRef.current.contains(e.target as Node)) setManufMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setManufMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [manufMenuOpen]);

  const marketplaceCards = useMemo(() => {
    return SB_MODELS
      .filter((m) => (activeLab === 'All Labs' ? true : m.org === activeLab))
      .filter((m) => {
        const q = mktQuery.trim().toLowerCase();
        if (!q) return true;
        return `${m.name} ${m.org}`.toLowerCase().includes(q);
      })
      .filter((m) => {
        const q = mktQuery2.trim().toLowerCase();
        if (!q) return true;
        return `${m.name} ${m.org} ${m.id}`.toLowerCase().includes(q);
      })
      .filter((m) => {
        if (mktFilter === 'all') return true;
        const hay = `${m.id} ${m.name} ${m.org}`.toLowerCase();
        if (mktFilter === 'open') return hay.includes('open') || hay.includes('llama') || hay.includes('qwen');
        if (mktFilter === 'code') return hay.includes('code') || hay.includes('deepseek');
        if (mktFilter === 'vision') return hay.includes('vision') || hay.includes('gemini') || hay.includes('4o');
        if (mktFilter === 'image') return hay.includes('image') || hay.includes('diffusion');
        if (mktFilter === 'audio') return hay.includes('audio');
        if (mktFilter === 'language') return true;
        return true;
      })
      .filter((m) => {
        const r = modelRatingForId(m.id);
        if (minRating === 'any') return true;
        if (minRating === '4') return r >= 4;
        return r >= 4.5;
      });
  }, [activeLab, mktFilter, mktQuery, mktQuery2, minRating]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <nav className="app-nav">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 22, height: 22, background: 'var(--text)', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 14 14" style={{ width: 11, height: 11 }} fill="white"><path d="M7 1 L13 7 L7 13 L1 7 Z"/></svg>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>NexusAI</span>
        </Link>

        <div className="app-tabs">
          <Link className="app-tab" href="/chat">💬 Chat Hub</Link>
          <Link className="app-tab active" href="/marketplace">🛍 Marketplace</Link>
          <Link className="app-tab" href="/agents">🤖 Agents</Link>
          <Link className="app-tab" href="/discover">🔬 Discover New</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: 'none', border: '1px solid var(--border2)', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text2)', fontWeight: 500 }}>Sign in</button>
          <button style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', background: 'var(--accent)', border: 'none', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', color: 'white', fontWeight: 600 }}>Try free →</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className="mkt-header">
          <span className="mkt-title">Model Marketplace</span>
          <div className="mkt-search-wrap">
            <div className="mkt-search-inner">
              <div className="mkt-si-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <input
                className="mkt-search"
                type="text"
                placeholder="Search models, capabilities…"
                value={mktQuery}
                onChange={(e) => setMktQuery(e.target.value)}
              />
            </div>
            <button className="mkt-icon-btn" title="Voice search" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </button>
            <button className="mkt-icon-btn" title="Upload file" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            <button className="mkt-icon-btn" title="Upload image" type="button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(
              [
                ['all', 'All'],
                ['language', 'Language'],
                ['vision', 'Vision'],
                ['code', 'Code'],
                ['image', 'Image Gen'],
                ['audio', 'Audio'],
                ['open', 'Open Source'],
              ] as const
            ).map(([key, label]) => (
              <button key={key} className={`mfil${mktFilter === key ? ' on' : ''}`} onClick={() => setMktFilter(key)} type="button">
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mkt-subnav">
          <button className={`mkt-subtab${mktMode === 'browse' ? ' on' : ''}`} type="button" onClick={() => setMktMode('browse')}>
            🏷 Browse Models
          </button>
          <button className={`mkt-subtab${mktMode === 'compare' ? ' on' : ''}`} type="button" onClick={() => setMktMode('compare')}>
            ⚖ Explore &amp; Compare
          </button>
          <button className={`mkt-subtab${mktMode === 'cost' ? ' on' : ''}`} type="button" onClick={() => setMktMode('cost')}>
            🧮 Cost Calculator
          </button>
        </div>

        <div className="mkt-search-row">
          <div className="mkt-search-wide">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={mktQuery2}
              onChange={(e) => setMktQuery2(e.target.value)}
              placeholder="Search model, manufacturer, variant…"
            />
          </div>
          <div className="mkt-dd-wrap" ref={manufDdRef}>
            <button
              className="mkt-dd"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={manufMenuOpen}
              onClick={() => setManufMenuOpen((o) => !o)}
            >
              {activeLab === 'All Labs' ? 'All Manufacturers' : activeLab}
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            {manufMenuOpen && (
              <div className="mkt-dd-menu" role="listbox" aria-label="Filter by manufacturer">
                <button
                  type="button"
                  role="option"
                  className={`mkt-dd-item${activeLab === 'All Labs' ? ' on' : ''}`}
                  onClick={() => {
                    setActiveLab('All Labs');
                    setManufMenuOpen(false);
                  }}
                >
                  All Manufacturers
                </button>
                {manufacturers.map((org) => (
                  <button
                    key={org}
                    type="button"
                    role="option"
                    className={`mkt-dd-item${activeLab === org ? ' on' : ''}`}
                    onClick={() => {
                      setActiveLab(org);
                      setManufMenuOpen(false);
                    }}
                  >
                    {org}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="labs-bar">
          <span className="labs-lbl">🏛 AI Labs</span>
          {labs.map((lab) => {
            const count = lab === 'All Labs' ? SB_MODELS.length : SB_MODELS.filter((m) => m.org === lab).length;
            return (
              <button
                key={lab}
                className={`lab-pill${activeLab === lab ? ' on' : ''}`}
                type="button"
                onClick={() => setActiveLab(lab)}
              >
                <span className="lab-logo">🏛</span>
                {lab}
                <span className="lab-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="lab-active-banner">
          <span>🏛</span>
          <span>
            Showing models from <strong>{activeLab}</strong>
          </span>
          <button className="lab-banner-clear" type="button" onClick={() => setActiveLab('All Labs')}>
            ✕ Clear filter
          </button>
        </div>

        <div className="mkt-body">
          <div className="mkt-sidebar">
            <div
              style={{
                background: 'var(--accent-lt)',
                border: '1px solid var(--accent-border)',
                borderRadius: 'var(--radius)',
                padding: '0.875rem',
                marginBottom: '1rem',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>✦ Need help choosing?</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text2)', lineHeight: 1.4 }}>
                Chat with our AI guide for a personalised recommendation in 60 seconds.
              </div>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Manufacturers</div>
              <div className="mkt-manuf-list">
                {labs.slice(1).map((org) => (
                  <button
                    key={org}
                    className={`mkt-manuf-item${activeLab === org ? ' on' : ''}`}
                    type="button"
                    onClick={() => setActiveLab(activeLab === org ? 'All Labs' : org)}
                  >
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--bg3)', border: '1px solid var(--border)', flexShrink: 0 }} />
                    {org}
                  </button>
                ))}
              </div>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Pricing Model</div>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={pricingModel.payPerUse}
                  onChange={() => setPricingModel((p) => ({ ...p, payPerUse: !p.payPerUse }))}
                />
                Pay-per-use
              </label>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={pricingModel.subscription}
                  onChange={() => setPricingModel((p) => ({ ...p, subscription: !p.subscription }))}
                />
                Subscription
              </label>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={pricingModel.freeTier}
                  onChange={() => setPricingModel((p) => ({ ...p, freeTier: !p.freeTier }))}
                />
                Free tier
              </label>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={pricingModel.enterprise}
                  onChange={() => setPricingModel((p) => ({ ...p, enterprise: !p.enterprise }))}
                />
                Enterprise
              </label>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Max Price /1M tokens</div>
              <input type="range" className="price-range" min="0" max="100" defaultValue={100} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: 4 }}>Up to $100</div>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Min Rating</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <button type="button" className={`fopt${minRating === 'any' ? ' on' : ''}`} onClick={() => setMinRating('any')}>
                  Any
                </button>
                <button type="button" className={`fopt${minRating === '4' ? ' on' : ''}`} onClick={() => setMinRating('4')}>
                  4+ ⭐
                </button>
                <button type="button" className={`fopt${minRating === '4.5' ? ' on' : ''}`} onClick={() => setMinRating('4.5')}>
                  4.5+ ⭐
                </button>
              </div>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Licence</div>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={licence.commercial}
                  onChange={() => setLicence((l) => ({ ...l, commercial: !l.commercial }))}
                />
                Commercial
              </label>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={licence.openSource}
                  onChange={() => setLicence((l) => ({ ...l, openSource: !l.openSource }))}
                />
                Open source
              </label>
              <label className="mkt-check">
                <input
                  type="checkbox"
                  checked={licence.researchOnly}
                  onChange={() => setLicence((l) => ({ ...l, researchOnly: !l.researchOnly }))}
                />
                Research only
              </label>
            </div>

            <div className="mkt-filter-sec">
              <div className="mkt-filter-title">Quick Guides</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Link href="/chat" className="mkt-guide-btn" style={{ textDecoration: 'none', display: 'block' }}>
                  📐 Prompt engineering tips
                </Link>
                <Link href="/chat" className="mkt-guide-btn" style={{ textDecoration: 'none', display: 'block' }}>
                  🤖 Agent creation guide
                </Link>
                <Link href="/chat" className="mkt-guide-btn" style={{ textDecoration: 'none', display: 'block' }}>
                  💰 Pricing comparison
                </Link>
              </div>
            </div>
          </div>

          <div className="mkt-grid">
            {marketplaceCards.map((m) => {
              const cardRating = modelRatingForId(m.id);
              return (
              <div key={m.id} className="mcard" role="button" tabIndex={0}>
                <div className="mcard-top">
                  <div className="mcard-icon-wrap">
                    <div className="mcard-icon" style={{ background: m.bg }}>{m.icon}</div>
                    <div>
                      <div className="mcard-name">{m.name}</div>
                      <div className="mcard-org">by {m.org}</div>
                    </div>
                  </div>
                  <span className={`mcard-badge ${m.live ? 'badge-hot' : 'badge-new'}`}>{m.live ? 'Hot' : 'New'}</span>
                </div>
                <div className="mcard-desc">
                  OpenAI flagship. Native agent use, advanced reasoning, and strong tool support.
                </div>
                <div className="mcard-tags">
                  <span className="tag t-blue">Multimodal</span>
                  <span className="tag t-teal">Reasoning</span>
                  <span className="tag t-amber">Agents</span>
                </div>
                <div className="mcard-footer">
                  <div className="mcard-rating">
                    <span className="stars">★★★★★</span>
                    <span>{cardRating.toFixed(1)}</span>
                  </div>
                  <div className="mcard-price">$2.50 / 1M</div>
                  <button className="mcard-how" type="button">How to Use →</button>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

