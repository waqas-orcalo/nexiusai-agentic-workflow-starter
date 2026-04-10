'use client';

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';

type TagVariant = 'blue' | 'green' | 'orange' | 'pink';

type AgentTemplate = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  /** Pills — order and colors match reference UI */
  tags: readonly { label: string; variant: TagVariant }[];
};

const TEMPLATES: AgentTemplate[] = [
  {
    id: 'research',
    icon: '🔍',
    title: 'Research Agent',
    desc: 'Automates web research and generates structured reports.',
    tags: [
      { label: 'GPT-3.5', variant: 'blue' },
      { label: 'Web search', variant: 'green' },
    ],
  },
  {
    id: 'support',
    icon: '💼',
    title: 'Support Agent',
    desc: 'Handles tickets, FAQs, and escalates complex issues.',
    tags: [
      { label: 'GPT-3.5', variant: 'blue' },
      { label: 'Ticketing', variant: 'green' },
    ],
  },
  {
    id: 'code-review',
    icon: '💻',
    title: 'Code Review Agent',
    desc: 'Reviews PRs, flags bugs, and suggests improvements.',
    tags: [
      { label: 'Claude Opus 4.5', variant: 'green' },
      { label: 'GitHub', variant: 'blue' },
    ],
  },
  {
    id: 'data',
    icon: '📊',
    title: 'Data Analysis Agent',
    desc: 'Processes spreadsheets and generates visual insights.',
    tags: [
      { label: 'Gemini', variant: 'orange' },
      { label: 'Sheets', variant: 'blue' },
    ],
  },
  {
    id: 'writer',
    icon: '✍️',
    title: 'Content Writer Agent',
    desc: 'Creates blog posts and marketing copy with brand voice.',
    tags: [
      { label: 'Claude Opus 4.5', variant: 'green' },
      { label: 'Marketing', variant: 'pink' },
    ],
  },
];

type MyAgent = {
  id: string;
  name: string;
};

const DEFAULT_MY_AGENTS: MyAgent[] = [{ id: 'default', name: 'Default Agent' }];

type AgentTask = {
  id: string;
  title: string;
  icon: string;
};

const DEFAULT_TASKS: AgentTask[] = [
  { id: 'dash', title: 'Dashboard Layout Adjust...', icon: '📐' },
  { id: 'design', title: 'Design agent system pro...', icon: '🎨' },
  { id: 'tools', title: 'Configure tool integratio...', icon: '🔌' },
];

const USE_CASE_CHIPS = [
  { id: 'use', label: 'Use cases', icon: '⌘' },
  { id: 'biz', label: 'Build a business', icon: '🏷️' },
  { id: 'learn', label: 'Help me learn', icon: '🎓' },
  { id: 'monitor', label: 'Monitor the situation', icon: '👁' },
  { id: 'research', label: 'Research', icon: '🔎' },
  { id: 'create', label: 'Create content', icon: '✍' },
  { id: 'analyze', label: 'Analyze & research', icon: '📈' },
] as const;

const SUGGESTIONS = [
  { id: 'space', icon: '🚀', text: 'Build a space exploration timeline app' },
  { id: 'stocks', icon: '📊', text: 'Create a real-time stock market tracker' },
  {
    id: 'chatbot',
    icon: '🤖',
    text: 'Prototype an AI chatbot demo application',
  },
  {
    id: 'kanban',
    icon: '🗂️',
    text: 'Create a project management Kanban board',
  },
] as const;

export default function AgentsPage() {
  const [myAgents] = useState<MyAgent[]>(DEFAULT_MY_AGENTS);
  const [activeAgentId, setActiveAgentId] = useState<string>(
    DEFAULT_MY_AGENTS[0]?.id ?? 'default',
  );
  const [activeChipId, setActiveChipId] =
    useState<(typeof USE_CASE_CHIPS)[number]['id']>('use');
  const [activeSuggestionId, setActiveSuggestionId] =
    useState<(typeof SUGGESTIONS)[number]['id']>('chatbot');
  const [prompt, setPrompt] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  const activeAgent = useMemo(
    () => myAgents.find((a) => a.id === activeAgentId) ?? myAgents[0],
    [activeAgentId, myAgents],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const copyLink = useCallback(async () => {
    const url = `https://nexusai-db.netlify.app/agents`;
    try {
      await navigator.clipboard.writeText(url);
      setToast('Copied');
    } catch {
      setToast('Copy failed');
    }
  }, []);

  const onNewAgent = useCallback(() => {
    setToast('New Agent');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      <nav className="app-nav">
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              background: 'var(--accent)',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 14 14"
              style={{ width: 11, height: 11 }}
              fill="white"
            >
              <path d="M7 1 L13 7 L7 13 L1 7 Z" />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            NexusAI
          </span>
        </Link>

        <div className="app-tabs">
          <Link className="app-tab" href="/chat">
            💬 Chat Hub
          </Link>
          <Link className="app-tab" href="/marketplace">
            🛍 Marketplace
          </Link>
          <Link className="app-tab active" href="/agents">
            🤖 Agents
          </Link>
          <Link className="app-tab" href="/discover">
            🔬 Discover New
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem',
              background: 'none',
              border: '1px solid var(--border2)',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'var(--text2)',
              fontWeight: 500,
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.8rem',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '2rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              color: 'white',
              fontWeight: 600,
            }}
          >
            Try free →
          </button>
        </div>
      </nav>

      <div className="agt-wrap">
        <aside className="agt2-side">
          <button type="button" className="agt2-new" onClick={onNewAgent}>
            ＋ New Agent
          </button>

          <div className="agt2-help">
            <div className="agt2-help-title">Not sure where to start?</div>
            <div className="agt2-help-sub">
              Chat with our AI guide — describe what you want your agent to do.
            </div>
            <button
              type="button"
              className="agt2-help-btn"
              onClick={() => setToast('Ask the Hub')}
            >
              Ask the Hub →
            </button>
          </div>

          <div className="agt2-sec-h">
            <span>AGENTS</span>
            <span className="agt2-count">1</span>
          </div>

          <div className="agt2-agents">
            {myAgents.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`agt2-agent${a.id === activeAgentId ? ' on' : ''}`}
                onClick={() => setActiveAgentId(a.id)}
              >
                <span className="agt2-agent-ic">✦</span>
                <span className="agt2-agent-main">
                  <span className="agt2-agent-name">{a.name}</span>
                  <span className="agt2-agent-sub">Default</span>
                </span>
                <span className="agt2-agent-badges">
                  <span className="agt2-dot" />
                  <span className="agt2-bubble">3</span>
                </span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="agt2-task"
            onClick={() => setToast('New Task')}
          >
            ＋ New Task
          </button>

          <div className="agt2-tasks">
            {DEFAULT_TASKS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="agt2-task-row"
                onClick={() => setToast(t.title)}
              >
                <span className="agt2-task-ic">{t.icon}</span>
                <span className="agt2-task-title">{t.title}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="agt2-main">
          <div className="agt2-main-pad">
            <div className="agt2-hero">
              <div className="agt2-h1">
                Agent works <span>for you.</span>
              </div>
              <div className="agt2-h2">
                Your AI agent takes care of everything, end to end.
              </div>
            </div>
          </div>
          <div className="agt2-main-divider" aria-hidden />

          <div className="agt2-main-pad">
            <div className="agt2-composer-row">
              <div className="agt2-composer">
                <div className="agt2-input">
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What should we work on next?"
                  />
                </div>
                {/* Toolbar icons match HeroSearchCard / nexusai-db (Voice, attach, image, …). */}
                <div
                  className="hsb-bottom-bar agt2-composer-bar"
                  aria-label="Agent tools"
                >
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Voice input"
                    aria-label="Voice input"
                    onClick={() => setToast('Voice input')}
                    style={
                      {
                        ['--ic' as string]: '#7C3AED',
                        ['--ic-lt' as string]: '#F3EEFF',
                        ['--ic-border' as string]: 'rgba(124,58,237,0.25)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Attach file"
                    aria-label="Attach file"
                    onClick={() => setToast('Attach file')}
                    style={
                      {
                        ['--ic' as string]: '#D97706',
                        ['--ic-lt' as string]: '#FFFBEB',
                        ['--ic-border' as string]: 'rgba(217,119,6,0.25)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Upload image"
                    aria-label="Upload image"
                    onClick={() => setToast('Upload image')}
                    style={
                      {
                        ['--ic' as string]: '#2563EB',
                        ['--ic-lt' as string]: '#EFF6FF',
                        ['--ic-border' as string]: 'rgba(37,99,235,0.25)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Voice typing"
                    aria-label="Voice typing"
                    onClick={() => setToast('Voice typing')}
                    style={
                      {
                        ['--ic' as string]: '#0891B2',
                        ['--ic-lt' as string]: '#E0F7FA',
                        ['--ic-border' as string]: 'rgba(8,145,178,0.25)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0891B2"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <rect x="2" y="14" width="20" height="7" rx="2" />
                      <path
                        d="M9 2a2 2 0 0 1 2 2v5a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2z"
                        transform="translate(3,0)"
                      />
                      <path d="M17 10v1a5 5 0 0 1-10 0v-1" />
                      <line x1="8" y1="17" x2="8" y2="17.01" />
                      <line x1="12" y1="17" x2="12" y2="17.01" />
                      <line x1="16" y1="17" x2="16" y2="17.01" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Video input"
                    aria-label="Video input"
                    onClick={() => setToast('Video input')}
                    style={
                      {
                        ['--ic' as string]: '#DC2626',
                        ['--ic-lt' as string]: '#FEF2F2',
                        ['--ic-border' as string]: 'rgba(220,38,38,0.22)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <polygon points="23 7 16 12 23 17 23 7" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="hsb-ibox"
                    title="Share screen"
                    aria-label="Share screen"
                    onClick={() => setToast('Share screen')}
                    style={
                      {
                        ['--ic' as string]: '#059669',
                        ['--ic-lt' as string]: '#ECFDF5',
                        ['--ic-border' as string]: 'rgba(5,150,105,0.25)',
                      } as CSSProperties
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 14, height: 14 }}
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <polyline points="8 21 12 17 16 21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </button>

                  <div className="hsb-bar-sep" aria-hidden />

                  <button
                    type="button"
                    className="hsb-computer-chip"
                    onClick={() => setToast('Agent +')}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ width: 13, height: 13 }}
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <polyline points="8 21 12 17 16 21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                    Agent
                    <span className="hsb-computer-chip-plus">+</span>
                  </button>

                  <div className="agt2-spacer" aria-hidden />
                </div>
              </div>
              <button
                type="button"
                className="agt2-send"
                aria-label="Send"
                onClick={() => setToast('Send')}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width={18}
                  height={18}
                  aria-hidden
                >
                  <path d="M3 11.5v1.2c0 .2.1.4.3.5l14.2 7.9c.4.2.8-.1.8-.5V2.9c0-.4-.4-.7-.8-.5L3.3 11c-.2.1-.3.3-.3.5z" />
                </svg>
              </button>
            </div>

            <div className="agt2-chips">
              {USE_CASE_CHIPS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`agt2-chip${c.id === activeChipId ? ' on' : ''}`}
                  onClick={() => setActiveChipId(c.id)}
                >
                  <span className="agt2-chip-ic">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="agt2-main-divider agt2-main-divider--afterChips"
            aria-hidden
          />

          <div className="agt2-suggest">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`agt2-sug-row${s.id === activeSuggestionId ? ' on' : ''}`}
                onClick={() => setActiveSuggestionId(s.id)}
              >
                <span className="agt2-sug-ic">{s.icon}</span>
                <span className="agt2-sug-text">{s.text}</span>
                <span className="agt2-sug-right">—</span>
              </button>
            ))}
          </div>

          <div className="agt2-main-divider" aria-hidden />

          <div className="agt2-main-pad agt2-suggest-foot">
            <button
              type="button"
              className="agt2-linkbtn"
              onClick={() => setToast('View all suggestions')}
            >
              View all suggestions <span>›</span>
            </button>
            <button
              type="button"
              className="agt2-linkbtn"
              onClick={() => setToast('Shuffle')}
            >
              Shuffle
            </button>
          </div>

          <div className="agt2-main-pad agt2-templates">
            <div className="agt2-templates-h">
              <div className="agt2-templates-title">
                AGENT TEMPLATES{' '}
                <span className="agt2-templates-pill">
                  {TEMPLATES.length + 1}
                </span>
              </div>
            </div>

            <div className="agt2-tplgrid">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="agt2-tpl"
                  onClick={() => setToast(t.title)}
                >
                  <div className="agt2-tpl-head">
                    <span className="agt2-tpl-ic" aria-hidden>
                      {t.icon}
                    </span>
                    <span className="agt2-tpl-title">{t.title}</span>
                  </div>
                  <div className="agt2-tpl-desc">{t.desc}</div>
                  <div className="agt2-tpl-tags">
                    {t.tags.map((tag, i) => (
                      <span
                        key={`${t.id}-${i}`}
                        className={`agt2-tag agt2-tag--${tag.variant}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </button>
              ))}

              <button
                type="button"
                className="agt2-tpl scratch"
                onClick={() => setToast('Build from Scratch')}
              >
                <div className="agt2-tpl-plus">＋</div>
                <div className="agt2-tpl-scratch">Build from Scratch</div>
              </button>
            </div>
          </div>

          <div className="agt2-toastbar">
            <span className="agt2-toastbadge">✓</span> Welcome to NexusAI!
          </div>
        </main>
      </div>

      {toast ? <div className="agt-toast">{toast}</div> : null}
    </div>
  );
}
