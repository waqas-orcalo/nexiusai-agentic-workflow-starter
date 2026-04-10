'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';

import {
  MODEL_MODAL_TABS,
  type DiscModelDetail,
  type DiscModelModalTabId,
  getModelDetail,
} from '../modelCatalog';

type DiscCategory =
  | 'all'
  | 'reasoning'
  | 'multimodal'
  | 'alignment'
  | 'efficiency'
  | 'open_weights';

interface ResearchPaper {
  id: string;
  month: string;
  day: string;
  lab: string;
  categoryLabel: string;
  category: Exclude<DiscCategory, 'all'>;
  title: string;
  teaser: string;
  dateLine: string;
  arxiv: string;
  authors: string;
  overview: string;
  stats: { value: string; label: string }[];
  findings: string[];
  models: { name: string }[];
  impactTitle: string;
  impactBody: string;
  citation: string;
}

const PAPERS: ResearchPaper[] = [
  {
    id: 'gemini-25-reasoning',
    month: 'Mar',
    day: '26',
    lab: 'Google DeepMind',
    categoryLabel: 'Reasoning',
    category: 'reasoning',
    title: 'Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks',
    teaser:
      'Scores 83.2% on AIME 2025 math competition, outperforming all prior models on reasoning-intensive tasks.',
    dateLine: 'March 26, 2026',
    arxiv: 'arXiv:2603.08821',
    authors: 'Anil, R., Borgeaud, S., Wu, Y., et al.',
    overview:
      'Google DeepMind\'s Gemini 2.5 Pro has set a new state-of-the-art across multiple reasoning benchmarks, most notably scoring 83.2% on the highly competitive AIME 2025 mathematical competition. This result surpasses GPT-5, Claude Opus 4.6, and all prior frontier models on reasoning-intensive evaluations. The paper introduces a novel chain-of-thought extension called "Iterative Thought Refinement" (ITR), which enables the model to backtrack and revise intermediate reasoning steps in real-time, dramatically improving accuracy on multi-step logical and mathematical problems.',
    stats: [
      { value: '83.2%', label: 'AIME 2025 score' },
      { value: '+6.4%', label: 'vs prior SOTA' },
      { value: '5M ctx', label: 'Context window' },
    ],
    findings: [
      'New Iterative Thought Refinement (ITR) allows real-time reasoning backtracking, boosting math accuracy by 18% vs standard CoT.',
      'Gemini 2.5 Pro scored top-1 on MATH, HumanEval, and MMLU-Pro simultaneously — a first for any single model.',
      'Performance gains are most significant on problems requiring 10+ reasoning steps, suggesting ITR scales with complexity.',
      'Multimodal reasoning (diagrams + equations) also improved 22% over Gemini 2.0, crucial for physics and geometry tasks.',
    ],
    models: [
      { name: 'Gemini 2.5 Pro' },
      { name: 'GPT-5' },
      { name: 'Claude Opus 4.6' },
      { name: 'o3' },
    ],
    impactTitle: 'Impact Assessment',
    impactBody:
      'High — sets new benchmark baseline for all future frontier model evaluations.',
    citation:
      'Anil, R., Borgeaud, S., Wu, Y., et al. — Google DeepMind (2026). "Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks". arXiv:2603.08821.',
  },
  {
    id: 'mit-multimodal-scaling',
    month: 'Mar',
    day: '22',
    lab: 'MIT CSAIL',
    categoryLabel: 'Multimodal',
    category: 'multimodal',
    title: 'Scaling laws for multimodal models: new empirical findings',
    teaser:
      'Research reveals unexpected scaling dynamics when combining vision and language — efficiency gains plateau earlier than expected.',
    dateLine: 'March 22, 2026',
    arxiv: 'arXiv:2603.07102',
    authors: 'Chen, L., Park, J., et al.',
    overview:
      'A large-scale study of multimodal training runs shows that vision–language scaling follows different power laws than text-only models. The team trained over 120 configurations and found that joint modalities hit diminishing returns sooner unless compute is rebalanced toward alignment layers.',
    stats: [
      { value: '120+', label: 'Training configs' },
      { value: '14%', label: 'Better $/perf' },
      { value: '1.2T', label: 'Tokens seen' },
    ],
    findings: [
      'Vision encoders saturate earlier than LLM backbones at fixed budgets.',
      'Intermediate fusion beats late fusion for retrieval-heavy tasks.',
      'Data mixing ratios matter more than total token count past a threshold.',
    ],
    models: [{ name: 'Gemini 2.5 Flash' }, { name: 'GPT-4o' }],
    impactTitle: 'Impact Assessment',
    impactBody:
      'Medium–high — informs how labs allocate multimodal training budgets.',
    citation:
      'Chen, L., Park, J., et al. — MIT CSAIL (2026). "Scaling laws for multimodal models: new empirical findings". arXiv:2603.07102.',
  },
  {
    id: 'anthropic-cai-v2',
    month: 'Mar',
    day: '18',
    lab: 'Anthropic',
    categoryLabel: 'Alignment',
    category: 'alignment',
    title:
      'Constitutional AI v2: improved alignment through iterative refinement',
    teaser:
      'New methodology achieves 40% reduction in harmful outputs while preserving capability on standard benchmarks.',
    dateLine: 'March 18, 2026',
    arxiv: 'arXiv:2603.06211',
    authors: 'Bai, Y., Kadavath, S., et al.',
    overview:
      'Anthropic extends Constitutional AI with a two-phase critic–revision loop that trains models to self-correct against a hierarchy of principles. Harmful completions drop sharply without regressing on MMLU or coding tasks.',
    stats: [
      { value: '40%', label: 'Fewer harmful outputs' },
      { value: '0.3%', label: 'MMLU delta' },
      { value: '2×', label: 'Critic rounds' },
    ],
    findings: [
      'Iterative critique outperforms single-pass RLHF on subtle policy violations.',
      'Principle ordering reduces ambiguity in edge-case adjudication.',
      'Smaller critics can supervise larger actors with minimal drift.',
    ],
    models: [{ name: 'Claude Sonnet 4.6' }, { name: 'Claude Opus 4.6' }],
    impactTitle: 'Impact Assessment',
    impactBody: 'High — practical template for safer deployment at scale.',
    citation:
      'Bai, Y., Kadavath, S., et al. — Anthropic (2026). "Constitutional AI v2: improved alignment through iterative refinement". arXiv:2603.06211.',
  },
  {
    id: 'meta-llama4-mm',
    month: 'Mar',
    day: '15',
    lab: 'Meta AI',
    categoryLabel: 'Open Weights',
    category: 'open_weights',
    title: 'Llama 4 Scout & Maverick: natively multimodal from the ground up',
    teaser:
      '17B MoE architecture trained on 40 trillion tokens with native understanding across text, image, and video.',
    dateLine: 'March 15, 2026',
    arxiv: 'arXiv:2603.05188',
    authors: 'Meta GenAI Team',
    overview:
      'Llama 4 introduces natively multimodal MoE variants aimed at efficient deployment. Scout prioritizes latency; Maverick targets maximum quality with sparse expert routing.',
    stats: [
      { value: '17B', label: 'MoE (active)' },
      { value: '40T', label: 'Tokens' },
      { value: 'OSS', label: 'Weights' },
    ],
    findings: [
      'Native image+video tokens remove adapter bottlenecks seen in bolt-on vision.',
      'MoE routing stays stable through multimodal pre-training.',
      'Strong open benchmarks vs prior Llama generations on DocVQA and Video-MME.',
    ],
    models: [{ name: 'Llama 4 Scout' }, { name: 'Llama 4 Maverick' }],
    impactTitle: 'Impact Assessment',
    impactBody: 'High for open ecosystem — lowers barrier to multimodal apps.',
    citation:
      'Meta GenAI Team (2026). "Llama 4 Scout & Maverick: natively multimodal from the ground up". arXiv:2603.05188.',
  },
  {
    id: 'stanford-long-context',
    month: 'Mar',
    day: '10',
    lab: 'Stanford NLP',
    categoryLabel: 'Efficiency',
    category: 'efficiency',
    title: 'Long-context recall: how models handle 1M+ token windows',
    teaser:
      'Comprehensive evaluation shows sharp recall degradation beyond 200K tokens for most models tested.',
    dateLine: 'March 10, 2026',
    arxiv: 'arXiv:2603.04002',
    authors: 'Nguyen, H., Zhang, T., et al.',
    overview:
      'Needle-in-haystack and structured retrieval tasks are run from 32K through 2M tokens across frontier models. The paper defines a recall half-life curve and proposes cheap mitigation via hierarchical summaries.',
    stats: [
      { value: '2M', label: 'Max ctx tested' },
      { value: '200K', label: 'Recall cliff' },
      { value: '8', label: 'Models' },
    ],
    findings: [
      'Positional encoding choice dominates ultra-long recall more than raw params.',
      'Chunked RAG still beats naive 1M stuffing for factual QA.',
      'Synthetic long docs underestimate real-world PDF noise.',
    ],
    models: [{ name: 'Gemini 2.5 Pro' }, { name: 'Claude Opus 4.6' }],
    impactTitle: 'Impact Assessment',
    impactBody:
      'Medium — essential reading for anyone shipping long-context features.',
    citation:
      'Nguyen, H., Zhang, T., et al. — Stanford NLP (2026). "Long-context recall: how models handle 1M+ token windows". arXiv:2603.04002.',
  },
  {
    id: 'deepseek-r1-oss',
    month: 'Mar',
    day: '5',
    lab: 'DeepSeek',
    categoryLabel: 'Open Weights',
    category: 'open_weights',
    title:
      'DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost',
    teaser:
      'Full weight release enables fine-tuning for domain-specific reasoning at a fraction of frontier model costs.',
    dateLine: 'March 5, 2026',
    arxiv: 'arXiv:2603.01977',
    authors: 'DeepSeek-AI',
    overview:
      'The report documents training recipes, distillation paths, and evaluation parity for an open-weight reasoning model competitive with mid-tier closed APIs on math and code.',
    stats: [
      { value: '$0', label: 'API cost (self-host)' },
      { value: 'AIME', label: 'Strong math' },
      { value: 'MIT', label: 'License' },
    ],
    findings: [
      'Cold-start RL with verifiable rewards scales better than pure SFT for math.',
      'Community fine-tunes close half the gap to closed frontier within weeks.',
      'Inference tricks (spec decode, MTP) cut latency substantially.',
    ],
    models: [{ name: 'DeepSeek-R1' }, { name: 'Qwen2.5' }],
    impactTitle: 'Impact Assessment',
    impactBody: 'High — accelerates open research and specialized agents.',
    citation:
      'DeepSeek-AI (2026). "DeepSeek-R1 open weights: reproducing frontier reasoning at minimal cost". arXiv:2603.01977.',
  },
];

const FILTER_CHIPS: { key: DiscCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'reasoning', label: '🧠 Reasoning' },
  { key: 'multimodal', label: '🌐 Multimodal' },
  { key: 'alignment', label: '🛡️ Alignment' },
  { key: 'efficiency', label: '⚡ Efficiency' },
  { key: 'open_weights', label: '🔓 Open Weights' },
];

type DiscoverState = { filter: DiscCategory; selectedId: string };

type DiscoverAction =
  | { type: 'applyFilter'; key: DiscCategory }
  | { type: 'selectPaper'; id: string }
  | { type: 'initFromHash'; id: string };

const discoverReducer = (
  state: DiscoverState,
  action: DiscoverAction,
): DiscoverState => {
  switch (action.type) {
    case 'applyFilter': {
      const next = PAPERS.filter(
        (p) => action.key === 'all' || p.category === action.key,
      );
      if (next.length === 0) return { ...state, filter: action.key };
      const selectedId = next.some((p) => p.id === state.selectedId)
        ? state.selectedId
        : next[0].id;
      return { filter: action.key, selectedId };
    }
    case 'selectPaper':
      return { ...state, selectedId: action.id };
    case 'initFromHash':
      if (PAPERS.some((p) => p.id === action.id)) {
        return { ...state, selectedId: action.id };
      }
      return state;
    default:
      return state;
  }
};

const discoverInitialState: DiscoverState = {
  filter: 'all',
  selectedId: PAPERS[0]?.id ?? '',
};

const DiscoverNewPage = () => {
  const [discover, dispatch] = useReducer(
    discoverReducer,
    discoverInitialState,
  );
  const { filter, selectedId } = discover;
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeDone, setSubscribeDone] = useState(false);
  const [copyFlash, setCopyFlash] = useState(false);
  const [modelModalName, setModelModalName] = useState<string | null>(null);
  const [modelModalTab, setModelModalTab] =
    useState<DiscModelModalTabId>('overview');
  const [modelCodeCopied, setModelCodeCopied] = useState(false);
  const [promptCopiedIdx, setPromptCopiedIdx] = useState<number | null>(null);
  const [variantSubTab, setVariantSubTab] = useState<
    'variants' | 'comparison' | 'usecases'
  >('variants');

  useEffect(() => {
    const id =
      typeof window !== 'undefined'
        ? window.location.hash.replace(/^#/, '')
        : '';
    if (id && PAPERS.some((p) => p.id === id)) {
      dispatch({ type: 'initFromHash', id });
    }
  }, []);

  useEffect(() => {
    if (!modelModalName) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModelModalName(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modelModalName]);

  const filtered = useMemo(() => {
    return PAPERS.filter((p) => filter === 'all' || p.category === filter);
  }, [filter]);

  const applyFilter = useCallback((key: DiscCategory) => {
    dispatch({ type: 'applyFilter', key });
  }, []);

  const selected = useMemo(() => {
    const inList = filtered.find((p) => p.id === selectedId);
    if (inList) return inList;
    return filtered[0] ?? PAPERS[0];
  }, [filtered, selectedId]);

  /** Total in catalog — reference always shows e.g. "6 papers this week", not the filtered count. */
  const totalCatalogCount = PAPERS.length;

  const toggleSave = useCallback(() => {
    if (!selected) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(selected.id)) next.delete(selected.id);
      else next.add(selected.id);
      return next;
    });
  }, [selected]);

  const copyCitation = useCallback(async () => {
    if (!selected?.citation || typeof navigator === 'undefined') return;
    try {
      await navigator.clipboard.writeText(selected.citation);
      setCopyFlash(true);
      window.setTimeout(() => setCopyFlash(false), 2000);
    } catch {
      /* ignore */
    }
  }, [selected]);

  const sharePaper = useCallback(async () => {
    if (!selected) return;
    const text = `${selected.title} — ${selected.lab}`;
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/discover#${selected.id}`
        : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'NexusAI Research', text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }, [selected]);

  const onSubscribe = useCallback(() => {
    if (!subscribeEmail.trim()) return;
    setSubscribeDone(true);
    window.setTimeout(() => {
      setSubscribeOpen(false);
      setSubscribeDone(false);
      setSubscribeEmail('');
    }, 1600);
  }, [subscribeEmail]);

  const copyHowToCode = useCallback(async () => {
    const code = `import nexusai

client = nexusai.Client(api_key="YOUR_KEY")
response = client.chat(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)

print(response.content)`;
    try {
      await navigator.clipboard.writeText(code);
      setModelCodeCopied(true);
      window.setTimeout(() => setModelCodeCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const copyPrompt = useCallback(async (idx: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setPromptCopiedIdx(idx);
      window.setTimeout(() => setPromptCopiedIdx(null), 1500);
    } catch {
      /* ignore */
    }
  }, []);

  const openModelModal = useCallback((name: string) => {
    setModelModalName(name);
    setModelModalTab('overview');
  }, []);

  const modelModalDetail = useMemo(
    () => (modelModalName ? getModelDetail(modelModalName) : null),
    [modelModalName],
  );

  const PROMPT_PRINCIPLES = useMemo(() => {
    const name = modelModalDetail?.name || 'GPT-4o';
    return [
      {
        title: 'PRINCIPLE 1 — BE EXPLICIT ABOUT FORMAT',
        body: `Summarize the following text in exactly 3 bullet points.\nEach bullet should be one sentence, under 20 words.\nText: {your_text_here}`,
      },
      {
        title: 'PRINCIPLE 2 — ASSIGN A ROLE',
        body: `You are a senior software engineer specializing in Python.\nReview the following code for bugs, performance issues,\nand style violations. Be concise and actionable.\n\nCode: {your_code_here}`,
      },
      {
        title: 'PRINCIPLE 3 — CHAIN-OF-THOUGHT FOR COMPLEX TASKS',
        body: `Solve this step by step, showing your reasoning at each stage.\n\nProblem: {your_problem_here}\n\nThink through: assumptions → approach → calculation → answer`,
      },
      {
        title: 'PRINCIPLE 4 — FEW-SHOT EXAMPLES',
        body: `Classify customer sentiment. Examples:\nInput: \"Shipping was fast!\" → Output: positive\nInput: \"Support never replied.\" → Output: negative\n\nInput: {your_text_here} → Output:`,
      },
    ].map((p) => ({ ...p, modelName: name }));
  }, [modelModalDetail?.name]);

  const REVIEWS = useMemo(
    () => [
      {
        name: 'Sarah K.',
        role: 'ML Engineer at Stripe',
        rating: 5,
        date: 'Mar 2025',
        text:
          'This model has transformed our document processing pipeline. The vision capabilities are remarkably accurate — it handles complex financial statements and extracts structured data with minimal post-processing. Latency is excellent for our use case.',
      },
      {
        name: 'Tariq M.',
        role: 'Founder, EdTech Startup',
        rating: 4,
        date: 'Feb 2025',
        text:
          'Impressive reasoning and creative capabilities. We use it for personalised learning content and student feedback. The main downside is cost at scale — the Pro subscription helps but enterprise pricing is where it becomes truly cost-effective.',
      },
      {
        name: 'Priya N.',
        role: 'Senior Developer at Shopify',
        rating: 5,
        date: 'Feb 2025',
        text:
          'Best coding model we’ve used. Code review, refactoring suggestions, and debugging explanations are outstanding. The function calling is reliable and JSON mode outputs are always well-structured. Highly recommend for developer tooling.',
      },
    ],
    [],
  );

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
          <Link className="app-tab" href="/agents">
            🤖 Agents
          </Link>
          <Link className="app-tab active" href="/discover">
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

      <div className="disc-wrap">
        <header className="disc-head">
          <div className="disc-head-left">
            <h2 className="disc-title">AI Research Feed</h2>
            <p className="disc-sub">Curated breakthroughs · Updated daily</p>
          </div>
          <div className="disc-head-right">
            <span className="disc-count-pill">
              {totalCatalogCount} papers this week
            </span>
            <button
              type="button"
              className="disc-subscribe-btn"
              onClick={() => setSubscribeOpen(true)}
            >
              🔔 Subscribe
            </button>
          </div>
        </header>

        <div className="disc-filters" aria-label="Filter research by category">
          {FILTER_CHIPS.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={filter === c.key}
              className={`disc-chip${filter === c.key ? ' on' : ''}`}
              onClick={() => applyFilter(c.key)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const i = FILTER_CHIPS.findIndex((x) => x.key === c.key);
                const dir = e.key === 'ArrowRight' ? 1 : -1;
                const nextChip =
                  FILTER_CHIPS[
                    (i + dir + FILTER_CHIPS.length) % FILTER_CHIPS.length
                  ];
                if (nextChip) applyFilter(nextChip.key);
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="disc-split">
          <aside className="disc-list-col" aria-label="Research papers">
            {filtered.length === 0 ? (
              <div className="disc-empty-list">
                No papers in this category yet.
              </div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`disc-paper-card${selected?.id === p.id ? ' on' : ''}`}
                  onClick={() => dispatch({ type: 'selectPaper', id: p.id })}
                >
                  <div className="disc-paper-date">
                    <span className="disc-paper-mon">{p.month}</span>
                    <span className="disc-paper-day">{p.day}</span>
                  </div>
                  <div className="disc-paper-body">
                    <div className="disc-paper-meta">
                      <span>{p.lab}</span>
                      <span className="disc-paper-tag">{p.categoryLabel}</span>
                    </div>
                    <div className="disc-paper-title">{p.title}</div>
                    <div className="disc-paper-teaser">{p.teaser}</div>
                  </div>
                </button>
              ))
            )}
          </aside>

          <main className="disc-detail" aria-live="polite">
            {selected ? (
              <>
                <div className="disc-detail-inner">
                  <div className="disc-detail-top">
                    <div className="disc-detail-meta">
                      <span>{selected.lab}</span>
                      <span className="disc-dot">·</span>
                      <span>{selected.dateLine}</span>
                      <span className="disc-detail-cat">
                        {selected.categoryLabel}
                      </span>
                    </div>
                    <h3 className="disc-detail-title">{selected.title}</h3>
                    <div className="disc-arxiv-line">
                      {selected.arxiv} · {selected.authors}
                    </div>
                  </div>

                  <section className="disc-section">
                    <div className="disc-sec-label">Overview</div>
                    <p className="disc-sec-p">{selected.overview}</p>
                  </section>

                  <div className="disc-stats-row">
                    {selected.stats.map((s) => (
                      <div key={s.label} className="disc-stat">
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  <section className="disc-section">
                    <div className="disc-sec-label">Key Findings</div>
                    <div className="disc-findings-wrap">
                      <ol className="disc-findings">
                        {selected.findings.map((f, i) => (
                          <li key={i}>
                            <span className="disc-fnum">{i + 1}.</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </section>

                  <section className="disc-section">
                    <div className="disc-sec-label">Models Referenced</div>
                    <div className="disc-model-chips">
                      {selected.models.map((m) => (
                        <button
                          key={m.name}
                          type="button"
                          className="disc-model-chip"
                          onClick={() => openModelModal(m.name)}
                        >
                          <span className="disc-model-chip-icon" aria-hidden>
                            🤖
                          </span>
                          <span>{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="disc-section disc-impact">
                    <div className="disc-sec-label">{selected.impactTitle}</div>
                    <div className="disc-impact-box">
                      <span className="disc-impact-emoji">⚡</span>
                      <p>{selected.impactBody}</p>
                    </div>
                  </section>

                  <section className="disc-section">
                    <div className="disc-sec-label">Citation</div>
                    <div className="disc-cite-box">
                      <button
                        type="button"
                        className="disc-copy-btn"
                        onClick={copyCitation}
                      >
                        {copyFlash ? 'Copied' : 'Copy'}
                      </button>
                      <p className="disc-cite-text">{selected.citation}</p>
                      <a
                        className="disc-arxiv-link"
                        href={`https://arxiv.org/abs/${selected.arxiv.replace(/^arXiv:/i, '').trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selected.arxiv} ↗
                      </a>
                    </div>
                  </section>
                </div>

                <div className="disc-actions-bar">
                  <Link href="/chat" className="disc-action-btn primary">
                    💬 Discuss in Chat Hub
                  </Link>
                  <button
                    type="button"
                    className={`disc-action-btn${savedIds.has(selected.id) ? ' saved' : ''}`}
                    onClick={toggleSave}
                  >
                    {savedIds.has(selected.id) ? '♥ Saved' : '♡ Save'}
                  </button>
                  <button
                    type="button"
                    className="disc-action-btn"
                    onClick={sharePaper}
                  >
                    🔗 Share
                  </button>
                </div>
              </>
            ) : (
              <div className="disc-empty-detail">
                Select a paper from the list.
              </div>
            )}
          </main>
        </div>
      </div>

      {modelModalName && modelModalDetail && (
        <div
          className="disc-mdl-overlay"
          role="presentation"
          onClick={() => setModelModalName(null)}
        >
          <div
            className="disc-mdl"
            role="dialog"
            aria-labelledby="disc-mdl-title"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="disc-mdl-head">
              <div className="disc-mdl-head-main">
                <div className="disc-mdl-gem" aria-hidden>
                  💎
                </div>
                <div>
                  <h2 id="disc-mdl-title" className="disc-mdl-title">
                    {modelModalDetail.name}
                  </h2>
                  <p className="disc-mdl-sub">
                    by {modelModalDetail.lab} · {modelModalDetail.tagline}
                  </p>
                </div>
              </div>
              <div className="disc-mdl-head-actions">
                {modelModalDetail.hot ? (
                  <span className="disc-mdl-hot">Hot</span>
                ) : null}
                <button
                  type="button"
                  className="disc-mdl-close"
                  aria-label="Close"
                  onClick={() => setModelModalName(null)}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="disc-mdl-tabs" role="tablist">
              {MODEL_MODAL_TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={modelModalTab === t.id}
                  className={`disc-mdl-tab${modelModalTab === t.id ? ' on' : ''}`}
                  onClick={() => setModelModalTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="disc-mdl-body">
              {modelModalTab === 'overview' ? (
                <>
                  <div className="disc-mdl-top-grid">
                    <div className="disc-mdl-card">
                      <h4 className="disc-mdl-h4">Description</h4>
                      <p className="disc-mdl-p">
                        {modelModalDetail.description}
                      </p>
                    </div>
                    <div className="disc-mdl-card">
                      <h4 className="disc-mdl-h4">Input / Output</h4>
                      <div className="disc-mdl-io">
                        {modelModalDetail.io
                          .split('·')
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map((line) => {
                            const [k, ...rest] = line.split(':');
                            const v = rest.join(':').trim();
                            const hasKey = rest.length > 0 && k.trim().length > 0;
                            return (
                              <div key={line} className="disc-mdl-io-row">
                                {hasKey ? (
                                  <>
                                    <strong>{k.trim()}:</strong> <span>{v}</span>
                                  </>
                                ) : (
                                  <span>{line}</span>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <div className="disc-mdl-block">
                    <h4 className="disc-mdl-h4">Use Cases</h4>
                    <div className="disc-mdl-use-grid wide">
                      {modelModalDetail.useCases.map(
                        (u: DiscModelDetail['useCases'][number]) => (
                        <div key={u.label} className="disc-mdl-use-pill">
                          <span className="disc-mdl-use-ic" aria-hidden>
                            {u.icon}
                          </span>
                          <span className="disc-mdl-use-txt">{u.label}</span>
                        </div>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="disc-mdl-block">
                    <h4 className="disc-mdl-h4">Example Prompt → Output</h4>
                    <div className="disc-mdl-example ref">
                      <div className="disc-mdl-ex-row">
                        <span className="disc-mdl-ex-label">User</span>
                        <p className="disc-mdl-ex-text">
                          {modelModalDetail.exampleUser}
                        </p>
                      </div>
                      <div className="disc-mdl-ex-row out">
                        <span className="disc-mdl-ex-label">
                          {modelModalDetail.name}
                        </span>
                        <p className="disc-mdl-ex-text disc-mdl-ex-pre">
                          {modelModalDetail.exampleModel}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="disc-mdl-block">
                    <h4 className="disc-mdl-h4">Benchmark Scores</h4>
                    <div className="disc-mdl-bench">
                      {modelModalDetail.benchmarks.map(
                        (b: DiscModelDetail['benchmarks'][number]) => (
                        <div key={b.label} className="disc-mdl-bench-item">
                          <strong>{b.value}</strong>
                          <span>{b.label}</span>
                        </div>
                        ),
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="disc-mdl-placeholder">
                  {modelModalTab === 'how' ? (
                    <div className="disc-mdl-how">
                      <h3 className="disc-mdl-how-title">How to Use This Model</h3>
                      <p className="disc-mdl-how-lead">
                        Follow these steps to integrate and start getting value
                        from this model in minutes.
                      </p>

                      <div className="disc-mdl-steps">
                        <div className="disc-mdl-step">
                          <div className="disc-mdl-step-num">1</div>
                          <div className="disc-mdl-step-body">
                            <div className="disc-mdl-step-title">
                              Get API Access
                            </div>
                            <p className="disc-mdl-step-p">
                              Sign up for a NexusAI account (free). Navigate to
                              Settings → API Keys and create a new key. Your key
                              grants access to all models in the marketplace —
                              no separate accounts needed.
                            </p>
                          </div>
                        </div>

                        <div className="disc-mdl-step">
                          <div className="disc-mdl-step-num">2</div>
                          <div className="disc-mdl-step-body">
                            <div className="disc-mdl-step-title">
                              Choose your integration method
                            </div>
                            <p className="disc-mdl-step-p">
                              Options: (a) NexusAI REST API — simple HTTP
                              requests from any language, (b) Official SDK —
                              Python, Node.js, Go packages available, (c)
                              No-code — use the built-in Playground or connect
                              via Zapier / Make.
                            </p>

                            <div className="disc-mdl-codecard">
                              <div className="disc-mdl-codecard-head">
                                <span className="disc-mdl-codecard-kicker">
                                  QUICK START (PYTHON)
                                </span>
                                <button
                                  type="button"
                                  className="disc-mdl-codecard-copy"
                                  onClick={copyHowToCode}
                                >
                                  {modelCodeCopied ? 'Copied' : 'Copy'}
                                </button>
                              </div>
                              <pre className="disc-mdl-codecard-pre">
                                <code>{`import nexusai

client = nexusai.Client(api_key=\"YOUR_KEY\")
response = client.chat(
    model=\"gpt-4o\",
    messages=[{\"role\": \"user\", \"content\": \"Hello!\"}]
)

print(response.content)`}</code>
                              </pre>
                            </div>
                          </div>
                        </div>

                        <div className="disc-mdl-step">
                          <div className="disc-mdl-step-num">3</div>
                          <div className="disc-mdl-step-body">
                            <div className="disc-mdl-step-title">
                              Understand input and output formats
                            </div>
                            <p className="disc-mdl-step-p">
                              This model accepts text, images, and PDFs as input.
                              Outputs are text and structured JSON. For long
                              documents, consider chunking content into sections.
                            </p>
                          </div>
                        </div>

                        <div className="disc-mdl-step">
                          <div className="disc-mdl-step-num">4</div>
                          <div className="disc-mdl-step-body">
                            <div className="disc-mdl-step-title">
                              Set parameters for your use case
                            </div>
                            <p className="disc-mdl-step-p">
                              Key parameters: temperature (0 = deterministic, 1
                              = creative), max_tokens (controls output length),
                              system (sets model persona and behaviour). Start
                              with temperature 0.3–0.7 for most applications.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : modelModalTab === 'pricing' ? (
                    <div className="disc-mdl-pricing">
                      <p className="disc-mdl-pricing-lead">
                        Choose the plan that fits your usage. All plans include
                        API access, documentation, and community support.
                      </p>

                      <div className="disc-mdl-price-grid">
                        <div className="disc-mdl-price-card">
                          <div className="disc-mdl-price-kicker">
                            PAY-PER-USE
                          </div>
                          <div className="disc-mdl-price">
                            <span className="disc-mdl-price-val">$5</span>
                          </div>
                          <div className="disc-mdl-price-sub">
                            per 1M input tokens
                          </div>
                          <ul className="disc-mdl-price-list">
                            <li>✓ No monthly commitment</li>
                            <li>✓ $15 per 1M output tokens</li>
                            <li>✓ 128K context window</li>
                            <li>✓ Rate: 500 RPM</li>
                            <li>✓ Standard support</li>
                          </ul>
                        </div>

                        <div className="disc-mdl-price-card pro">
                          <div className="disc-mdl-popular">Most Popular</div>
                          <div className="disc-mdl-price-kicker">
                            PRO SUBSCRIPTION
                          </div>
                          <div className="disc-mdl-price">
                            <span className="disc-mdl-price-val">$49</span>
                          </div>
                          <div className="disc-mdl-price-sub">per month</div>
                          <ul className="disc-mdl-price-list">
                            <li>✓ $3 per 1M input tokens</li>
                            <li>✓ $9 per 1M output tokens</li>
                            <li>✓ 128K context window</li>
                            <li>✓ Rate: 3,000 RPM</li>
                            <li>✓ Priority support</li>
                            <li>✓ Usage dashboard</li>
                          </ul>
                        </div>

                        <div className="disc-mdl-price-card">
                          <div className="disc-mdl-price-kicker">ENTERPRISE</div>
                          <div className="disc-mdl-price custom">Custom</div>
                          <div className="disc-mdl-price-sub">
                            negotiated pricing
                          </div>
                          <ul className="disc-mdl-price-list">
                            <li>✓ Volume discounts</li>
                            <li>✓ Dedicated capacity</li>
                            <li>✓ Fine-tuning access</li>
                            <li>✓ Unlimited RPM</li>
                            <li>✓ SLA &amp; compliance</li>
                            <li>✓ Dedicated CSM</li>
                          </ul>
                        </div>
                      </div>

                      <div className="disc-mdl-free-tier">
                        <strong>Free tier available:</strong> Get 100K tokens/month
                        at no cost. Perfect for prototyping and exploration. No
                        credit card required to get started.
                      </div>
                    </div>
                  ) : modelModalTab === 'prompt' ? (
                    <div className="disc-mdl-prompt">
                      <h3 className="disc-mdl-how-title">
                        Prompt Engineering for {modelModalDetail.name}
                      </h3>
                      <p className="disc-mdl-how-lead">
                        Well-crafted prompts dramatically improve model output
                        quality. Follow these principles to get the best results
                        every time.
                      </p>

                      <div className="disc-mdl-prompt-list">
                        {PROMPT_PRINCIPLES.map((p, idx) => (
                          <div key={p.title} className="disc-mdl-prompt-card">
                            <div className="disc-mdl-prompt-head">
                              <span className="disc-mdl-prompt-title">
                                {p.title}
                              </span>
                              <button
                                type="button"
                                className="disc-mdl-codecard-copy"
                                onClick={() => copyPrompt(idx, p.body)}
                              >
                                {promptCopiedIdx === idx ? 'Copied' : 'Copy'}
                              </button>
                            </div>
                            <pre className="disc-mdl-prompt-pre">
                              <code>{p.body}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : modelModalTab === 'agent' ? (
                    <div className="disc-mdl-agent">
                      <h3 className="disc-mdl-how-title">
                        Create an Agent with {modelModalDetail.name}
                      </h3>
                      <p className="disc-mdl-how-lead">
                        Follow these steps to build a powerful AI agent in under
                        10 minutes.
                      </p>

                      <div className="disc-mdl-steps">
                        {[
                          {
                            t: "Define your agent's purpose",
                            p: 'Clearly state what your agent should do. Example: “A customer support agent that answers product questions, escalates billing issues, and creates Jira tickets for bugs.”',
                          },
                          {
                            t: 'Write the system prompt',
                            p: "The system prompt defines the agent's persona, scope, and behaviour. Be explicit about what the agent should and shouldn't do. Include tone, response length, and escalation rules.",
                          },
                          {
                            t: 'Connect tools & APIs',
                            p: 'Equip your agent with tools: web search, database lookup, email sender, calendar API, Slack webhook. Define your tools in JSON schema format.',
                          },
                          {
                            t: 'Set up memory',
                            p: 'Configure short-term (conversation history) and long-term memory (vector store). This lets the agent remember user preferences and important context across sessions.',
                          },
                          {
                            t: 'Test & iterate',
                            p: 'Run the agent through 20+ test scenarios covering edge cases. Refine the system prompt based on failures. Use our Agent Playground to debug and tune before deployment.',
                          },
                          {
                            t: 'Deploy & monitor',
                            p: 'Get a shareable endpoint or embed widget. Monitor performance in the NexusAI dashboard — track response quality, latency, token usage, and user satisfaction scores in real time.',
                          },
                        ].map((s, i) => (
                          <div key={s.t} className="disc-mdl-step">
                            <div className="disc-mdl-step-num">{i + 1}</div>
                            <div className="disc-mdl-step-body">
                              <div className="disc-mdl-step-title">{s.t}</div>
                              <p className="disc-mdl-step-p">{s.p}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="disc-mdl-agent-actions">
                        <button type="button" className="disc-mdl-agent-primary">
                          Open Agent Builder →
                        </button>
                        <button type="button" className="disc-mdl-agent-secondary">
                          Ask the Hub
                        </button>
                      </div>
                    </div>
                  ) : modelModalTab === 'reviews' ? (
                    <div className="disc-mdl-rev">
                      <div className="disc-mdl-rev-top">
                        <div className="disc-mdl-rev-score">
                          <div className="disc-mdl-rev-num">4.7</div>
                          <div className="disc-mdl-rev-stars" aria-hidden>
                            ★★★★★
                          </div>
                          <div className="disc-mdl-rev-count">2,847 reviews</div>
                        </div>
                        <div className="disc-mdl-rev-bars">
                          {[
                            { star: 5, pct: 72 },
                            { star: 4, pct: 20 },
                            { star: 3, pct: 6 },
                            { star: 2, pct: 2 },
                            { star: 1, pct: 2 },
                          ].map((r) => (
                            <div key={r.star} className="disc-mdl-rev-bar">
                              <span className="disc-mdl-rev-bar-l">
                                {r.star}
                              </span>
                              <div className="disc-mdl-rev-track">
                                <div
                                  className="disc-mdl-rev-fill"
                                  style={{ width: `${r.pct}%` }}
                                />
                              </div>
                              <span className="disc-mdl-rev-bar-r">
                                {r.pct}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="disc-mdl-rev-list">
                        {REVIEWS.map((r) => (
                          <div key={r.name} className="disc-mdl-rev-item">
                            <div className="disc-mdl-rev-name">{r.name}</div>
                            <div className="disc-mdl-rev-role">{r.role}</div>
                            <p className="disc-mdl-rev-text">{r.text}</p>
                            <div className="disc-mdl-rev-meta">
                              <span className="disc-mdl-rev-stars2" aria-hidden>
                                {'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}
                              </span>
                              <span className="disc-mdl-rev-date">{r.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : modelModalTab === 'variants' ? (
                    <div className="disc-mdl-var">
                      <div className="disc-mdl-var-tabs">
                        <button
                          type="button"
                          className={`disc-mdl-var-tab${variantSubTab === 'variants' ? ' on' : ''}`}
                          onClick={() => setVariantSubTab('variants')}
                        >
                          🧾 Variants & Releases
                        </button>
                        <button
                          type="button"
                          className={`disc-mdl-var-tab${variantSubTab === 'comparison' ? ' on' : ''}`}
                          onClick={() => setVariantSubTab('comparison')}
                        >
                          📊 Comparison
                        </button>
                        <button
                          type="button"
                          className={`disc-mdl-var-tab${variantSubTab === 'usecases' ? ' on' : ''}`}
                          onClick={() => setVariantSubTab('usecases')}
                        >
                          🎯 Use Cases
                        </button>
                      </div>

                      {variantSubTab === 'variants' ? (
                        <>
                          <p className="disc-mdl-var-lead">
                            Available model versions and their deployment status.
                          </p>
                          <div className="disc-mdl-var-list">
                            <div className="disc-mdl-var-row current">
                              <div>
                                <div className="disc-mdl-var-name">
                                  gemini-2.5-pro
                                </div>
                                <div className="disc-mdl-var-sub">
                                  In: $12.5 / Out: $10 per 1M tok
                                </div>
                              </div>
                              <span className="disc-mdl-var-pill current">
                                CURRENT
                              </span>
                              <div className="disc-mdl-var-note">
                                Updated — this is the latest stable release with
                                all current improvements.
                              </div>
                            </div>

                            {[
                              { name: 'gemini-2.5-pro-preview', pill: 'STABLE' },
                              { name: 'gemini-2.5-flash', pill: 'STABLE' },
                            ].map((v) => (
                              <div key={v.name} className="disc-mdl-var-row">
                                <div>
                                  <div className="disc-mdl-var-name">{v.name}</div>
                                  <div className="disc-mdl-var-sub">
                                    In: $12.5 / Out: $10 per 1M tok
                                  </div>
                                </div>
                                <span className="disc-mdl-var-pill stable">
                                  {v.pill}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : variantSubTab === 'comparison' ? (
                        <div className="disc-mdl-cmpr">
                          <div className="disc-mdl-kpis">
                            <div className="disc-mdl-kpi">
                              <div className="disc-mdl-kpi-val">3</div>
                              <div className="disc-mdl-kpi-lab">TOTAL VARIANTS</div>
                            </div>
                            <div className="disc-mdl-kpi">
                              <div className="disc-mdl-kpi-val teal">3</div>
                              <div className="disc-mdl-kpi-lab">ACTIVE</div>
                            </div>
                            <div className="disc-mdl-kpi">
                              <div className="disc-mdl-kpi-val red">0</div>
                              <div className="disc-mdl-kpi-lab">DEPRECATED</div>
                            </div>
                          </div>

                          <div className="disc-mdl-legend">
                            <span>
                              <i className="disc-mdl-dot cur" /> Current
                            </span>
                            <span>
                              <i className="disc-mdl-dot st" /> Stable
                            </span>
                            <span>
                              <i className="disc-mdl-dot dep" /> Deprecated
                            </span>
                          </div>

                          <h4 className="disc-mdl-cmpr-h">Variant Comparison</h4>
                          <div className="disc-mdl-cmpr-table">
                            <div className="disc-mdl-cmpr-head">
                              <div>VARIANT</div>
                              <div>STATUS</div>
                              <div>PRICING</div>
                              <div className="right">CONTEXT</div>
                            </div>
                            {[
                              {
                                name: 'gemini-2.5-pro',
                                status: 'CURRENT',
                                statusTone: 'cur',
                              },
                              {
                                name: 'gemini-2.5-pro-preview',
                                status: 'STABLE',
                                statusTone: 'st',
                              },
                              {
                                name: 'gemini-2.5-flash',
                                status: 'STABLE',
                                statusTone: 'st',
                              },
                            ].map((r) => (
                              <div key={r.name} className="disc-mdl-cmpr-row">
                                <div className="disc-mdl-cmpr-name">{r.name}</div>
                                <div>
                                  <span
                                    className={`disc-mdl-cmpr-pill ${r.statusTone}`}
                                  >
                                    {r.status}
                                  </span>
                                </div>
                                <div className="disc-mdl-cmpr-price">
                                  In: $12.5 / Out: $10 per 1M tok
                                </div>
                                <div className="disc-mdl-cmpr-ctx">
                                  <div className="disc-mdl-cmpr-bar">
                                    <div className="disc-mdl-cmpr-bar-fill" />
                                  </div>
                                  <span>128k</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <h4 className="disc-mdl-cmpr-h">Performance Scores</h4>
                          <div className="disc-mdl-perf">
                            <div className="disc-mdl-perf-left">
                              <div className="disc-mdl-perf-left-h">METRIC</div>
                              {[
                                { k: 'REASONING', v: '97' },
                                { k: 'CODING', v: '95' },
                                { k: 'CONTEXT', v: '98' },
                              ].map((m) => (
                                <div key={m.k} className="disc-mdl-perf-left-r">
                                  <div className="disc-mdl-perf-m">{m.k}</div>
                                  <div className="disc-mdl-perf-mv">{m.v}</div>
                                </div>
                              ))}
                            </div>
                            <div className="disc-mdl-perf-cols">
                              {[
                                { name: 'gemini-2.5-pro', vals: ['97', '95', '98'] },
                                {
                                  name: 'gemini-2.5-pro-preview',
                                  vals: ['—', '—', '—'],
                                },
                                { name: 'gemini-2.5-flash', vals: ['—', '—', '—'] },
                              ].map((c) => (
                                <div key={c.name} className="disc-mdl-perf-col">
                                  <div className="disc-mdl-perf-col-h">
                                    {c.name}
                                  </div>
                                  {c.vals.map((v, i) => (
                                    <div key={i} className="disc-mdl-perf-cell">
                                      {v}
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="disc-mdl-ucs">
                          <div className="disc-mdl-legend">
                            <span>
                              <i className="disc-mdl-dot cur" /> Current
                            </span>
                            <span>
                              <i className="disc-mdl-dot st" /> Stable
                            </span>
                            <span>
                              <i className="disc-mdl-dot dep" /> Deprecated
                            </span>
                          </div>

                          {[
                            {
                              name: 'gemini-2.5-pro',
                              pill: { text: 'CURRENT', tone: 'cur' },
                            },
                            {
                              name: 'gemini-2.5-pro-preview',
                              pill: { text: 'STABLE', tone: 'st' },
                            },
                          ].map((v) => (
                            <div key={v.name} className="disc-mdl-uc-block">
                              <div className="disc-mdl-uc-head">
                                <span className="disc-mdl-uc-name">{v.name}</span>
                                <span className={`disc-mdl-uc-pill ${v.pill.tone}`}>
                                  {v.pill.text}
                                </span>
                              </div>
                              <div className="disc-mdl-uc-list">
                                {[
                                  {
                                    ic: '✍️',
                                    t: 'Content Writing',
                                    d: 'Generate articles, emails, and marketing copy.',
                                  },
                                  {
                                    ic: '💻',
                                    t: 'Code Generation',
                                    d: 'Write, debug, and refactor code across languages.',
                                  },
                                  {
                                    ic: '🔍',
                                    t: 'Document Analysis',
                                    d: 'Extract and summarize insights from long documents.',
                                  },
                                  {
                                    ic: '🌐',
                                    t: 'Translation',
                                    d: 'Translate and localize content across languages.',
                                  },
                                  {
                                    ic: '📊',
                                    t: 'Data Analysis',
                                    d: 'Analyze datasets and generate structured reports.',
                                  },
                                  {
                                    ic: '🎓',
                                    t: 'Education',
                                    d: 'Explain concepts, tutor students, and create learning materials.',
                                  },
                                ].map((u) => (
                                  <div key={u.t} className="disc-mdl-uc-row">
                                    <span className="disc-mdl-uc-ic" aria-hidden>
                                      {u.ic}
                                    </span>
                                    <div className="disc-mdl-uc-mid">
                                      <div className="disc-mdl-uc-t">{u.t}</div>
                                      <div className="disc-mdl-uc-d">{u.d}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                          <h4 className="disc-mdl-cmpr-h">Use Case Matrix</h4>
                          <div className="disc-mdl-matrix">
                            <div className="disc-mdl-mtrx-head">
                              <div>USE CASE</div>
                              <div>GEMINI-2.5-PRO</div>
                              <div>GEMINI-2.5-PRO-PREVIEW</div>
                              <div>GEMINI-2.5-FLASH</div>
                            </div>
                            {[
                              { ic: '✍️', t: 'Content Writing' },
                              { ic: '💻', t: 'Code Generation' },
                              { ic: '🔍', t: 'Document Analysis' },
                              { ic: '🌐', t: 'Translation' },
                              { ic: '📊', t: 'Data Analysis' },
                              { ic: '🎓', t: 'Education' },
                            ].map((u) => (
                              <div key={u.t} className="disc-mdl-mtrx-row">
                                <div className="disc-mdl-mtrx-use">
                                  <span aria-hidden>{u.ic}</span>
                                  <span>{u.t}</span>
                                </div>
                                <div className="disc-mdl-mtrx-cell">
                                  <span className="disc-mdl-mtrx-check">✓</span>
                                </div>
                                <div className="disc-mdl-mtrx-cell">
                                  <span className="disc-mdl-mtrx-check">✓</span>
                                </div>
                                <div className="disc-mdl-mtrx-cell">
                                  <span className="disc-mdl-mtrx-check">✓</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p>
                        {MODEL_MODAL_TABS.find(
                          (x: (typeof MODEL_MODAL_TABS)[number]) =>
                            x.id === modelModalTab,
                        )?.label}:{' '}
                        live pricing, prompt packs, reviews, and deployment
                        templates are available in the Marketplace.
                      </p>
                      <Link className="disc-mdl-mp-link" href="/marketplace">
                        Browse Marketplace →
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {subscribeOpen && (
        <div
          className="disc-modal-overlay"
          role="presentation"
          onClick={() => !subscribeDone && setSubscribeOpen(false)}
        >
          <div
            className="disc-modal"
            role="dialog"
            aria-labelledby="disc-sub-title"
            onClick={(e) => e.stopPropagation()}
          >
            {subscribeDone ? (
              <p className="disc-modal-done">
                You&apos;re subscribed — watch your inbox for the weekly digest.
              </p>
            ) : (
              <>
                <h4 id="disc-sub-title" className="disc-modal-title">
                  Subscribe to the research digest
                </h4>
                <p className="disc-modal-desc">
                  New model releases, benchmarks, and prompt tips — no spam.
                </p>
                <input
                  type="email"
                  className="disc-modal-input"
                  placeholder="you@company.com"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  autoComplete="email"
                />
                <div className="disc-modal-actions">
                  <button
                    type="button"
                    className="disc-modal-cancel"
                    onClick={() => setSubscribeOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="disc-modal-ok"
                    onClick={onSubscribe}
                  >
                    Subscribe
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverNewPage;
