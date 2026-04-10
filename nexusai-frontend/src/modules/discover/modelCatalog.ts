/** Static copy for “Models referenced” chips — mirrors reference site model overlay. */

export type DiscModelModalTabId =
  | 'overview'
  | 'how'
  | 'pricing'
  | 'prompt'
  | 'agent'
  | 'reviews'
  | 'variants';

export const MODEL_MODAL_TABS: {
  id: DiscModelModalTabId;
  label: string;
}[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'how', label: 'How to Use' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'prompt', label: 'Prompt Guide' },
  { id: 'agent', label: 'Agent Creation' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'variants', label: 'Variants & Releases' },
];

export interface DiscModelDetail {
  name: string;
  lab: string;
  tagline: string;
  hot?: boolean;
  description: string;
  io: string;
  useCases: { icon: string; label: string }[];
  exampleUser: string;
  exampleModel: string;
  benchmarks: { value: string; label: string }[];
}

const fallback = (name: string): DiscModelDetail => ({
  name,
  lab: 'NexusAI',
  tagline: 'Frontier AI model',
  description:
    'Full specifications, pricing, and prompt templates are available in the Marketplace.',
  io: 'Input: text · Output: text (varies by deployment)',
  useCases: [
    { icon: '✍️', label: 'Writing' },
    { icon: '💻', label: 'Code' },
    { icon: '🔍', label: 'Research' },
  ],
  exampleUser: 'Summarize this research paper in three bullet points.',
  exampleModel:
    '• Key finding one\n• Key finding two\n• Key finding three\n\nFollow-up: …',
  benchmarks: [
    { value: '—', label: 'MMLU' },
    { value: '—', label: 'HumanEval' },
    { value: '4.5⭐', label: 'Rating' },
  ],
});

export const MODEL_CATALOG: Record<string, DiscModelDetail> = {
  'Gemini 2.5 Pro': {
    name: 'Gemini 2.5 Pro',
    lab: 'Google DeepMind',
    tagline: 'SOTA model',
    hot: true,
    description:
      'Google DeepMind’s flagship reasoning and multimodal model with an extended context window and strong performance on math, code, and long-document tasks.',
    io: 'Input: text, images, audio, PDFs · Output: text, code · Context: up to 1M tokens (product-dependent) · Latency: ~1s avg (region-dependent)',
    useCases: [
      { icon: '✍️', label: 'Content writing' },
      { icon: '💻', label: 'Code generation' },
      { icon: '🔍', label: 'Document analysis' },
      { icon: '🌐', label: 'Translation' },
      { icon: '🎓', label: 'Education' },
      { icon: '📊', label: 'Data analysis' },
    ],
    exampleUser:
      '"Summarize this research paper in 3 bullet points and suggest 2 follow-up questions."',
    exampleModel:
      '• The paper introduces a new attention mechanism reducing compute by 40%\n• Results on MMLU show 3.2% improvement over baseline\n• Authors release code and weights under MIT license\n\nFollow-up questions:\n1. How does this scale to 100B+ parameter models?\n2. What are the trade-offs at inference time?',
    benchmarks: [
      { value: '87.2', label: 'MMLU' },
      { value: '90.2', label: 'HumanEval' },
      { value: '76.6', label: 'MATH' },
      { value: '4.7⭐', label: 'Rating' },
    ],
  },
  'GPT-5': {
    name: 'GPT-5',
    lab: 'OpenAI',
    tagline: 'Frontier reasoning',
    hot: true,
    description:
      'OpenAI’s advanced general-purpose model tuned for agentic workflows, tool use, and long-horizon reasoning across text and structured outputs.',
    io: 'Input: text, images · Output: text, JSON · Context: large (API tier-dependent)',
    useCases: [
      { icon: '💻', label: 'Code' },
      { icon: '🧠', label: 'Reasoning' },
      { icon: '📄', label: 'Analysis' },
    ],
    exampleUser: 'Plan a multi-step research task and list tools you would use.',
    exampleModel:
      'Here is a phased plan: (1) gather sources, (2) extract claims, (3) verify against data…',
    benchmarks: [
      { value: '88+', label: 'MMLU' },
      { value: '92+', label: 'HumanEval' },
      { value: '4.8⭐', label: 'Rating' },
    ],
  },
  'Claude Opus 4.6': {
    name: 'Claude Opus 4.6',
    lab: 'Anthropic',
    tagline: 'Maximum capability',
    hot: true,
    description:
      'Anthropic’s highest-capability Claude variant for complex analysis, long documents, and nuanced alignment-sensitive workloads.',
    io: 'Input: text, files · Output: text · Context: 200K+ tokens (plan-dependent)',
    useCases: [
      { icon: '📑', label: 'Long docs' },
      { icon: '🛡️', label: 'Policy review' },
      { icon: '✍️', label: 'Writing' },
    ],
    exampleUser: 'Red-team this policy for ambiguous failure modes.',
    exampleModel:
      'I will walk through edge cases: (A) conflicting instructions… (B) jurisdiction…',
    benchmarks: [
      { value: '89+', label: 'MMLU' },
      { value: '91+', label: 'HumanEval' },
      { value: '4.8⭐', label: 'Rating' },
    ],
  },
  o3: {
    name: 'o3',
    lab: 'OpenAI',
    tagline: 'Deep reasoning',
    description:
      'OpenAI’s reasoning-optimized model for hard STEM, competition math, and multi-step tool use.',
    io: 'Input: text · Output: text · Reasoning tokens: supported',
    useCases: [
      { icon: '🧮', label: 'Math' },
      { icon: '🔬', label: 'Science' },
      { icon: '🧩', label: 'Logic' },
    ],
    exampleUser: 'Solve this proof sketch and flag any gaps.',
    exampleModel:
      'Step 1: … Step 2: … Gap: we assumed X without proving Y.',
    benchmarks: [
      { value: 'Top', label: 'AIME-style' },
      { value: 'Top', label: 'GPQA' },
      { value: '4.7⭐', label: 'Rating' },
    ],
  },
  'Gemini 2.5 Flash': {
    name: 'Gemini 2.5 Flash',
    lab: 'Google DeepMind',
    tagline: 'Fast & efficient',
    description:
      'Latency-optimized Gemini variant for high-throughput applications while retaining strong multimodal understanding.',
    io: 'Input: text, images · Output: text · Context: large (tier-dependent)',
    useCases: [
      { icon: '⚡', label: 'Chatbots' },
      { icon: '🖼️', label: 'Vision QA' },
      { icon: '📝', label: 'Summaries' },
    ],
    exampleUser: 'Extract structured fields from this messy PDF text.',
    exampleModel:
      '{ "title": "…", "authors": ["…"], "date": "…" }',
    benchmarks: [
      { value: '85+', label: 'MMLU' },
      { value: '88+', label: 'HumanEval' },
      { value: '4.6⭐', label: 'Rating' },
    ],
  },
  'GPT-4o': {
    name: 'GPT-4o',
    lab: 'OpenAI',
    tagline: 'Multimodal flagship',
    hot: true,
    description:
      'OpenAI’s flagship multimodal model combining text, vision, and audio in one unified architecture. Strong across language, reasoning, and code.',
    io: 'Input: text, images, audio, PDFs · Output: text, code, structured data · Context: 128K tokens · Max output: 4,096 tokens · Latency: ~1.2s avg',
    useCases: [
      { icon: '✍️', label: 'Content writing' },
      { icon: '💻', label: 'Code generation' },
      { icon: '🔍', label: 'Document analysis' },
      { icon: '🌐', label: 'Translation' },
      { icon: '🎓', label: 'Education' },
      { icon: '📊', label: 'Data analysis' },
    ],
    exampleUser:
      '"Summarize this research paper in 3 bullet points and suggest 2 follow-up questions."',
    exampleModel:
      '• The paper introduces a new attention mechanism reducing compute by 40%\n• Results on MMLU show 3.2% improvement over baseline\n• Authors release code and weights under MIT license\n\nFollow-up questions:\n1. How does this scale to 100B+ parameter models?\n2. What are the trade-offs at inference time?',
    benchmarks: [
      { value: '87.2', label: 'MMLU' },
      { value: '90.2', label: 'HumanEval' },
      { value: '76.6', label: 'MATH' },
      { value: '4.7⭐', label: 'Rating' },
    ],
  },
  'Claude Sonnet 4.6': {
    name: 'Claude Sonnet 4.6',
    lab: 'Anthropic',
    tagline: 'Balanced speed & quality',
    description:
      'High-throughput Claude tier with strong instruction following and solid reasoning for everyday agent and product workloads.',
    io: 'Input: text, files · Output: text · Context: 200K+ tokens (plan-dependent)',
    useCases: [
      { icon: '💬', label: 'Assistants' },
      { icon: '📋', label: 'Extraction' },
      { icon: '✍️', label: 'Drafting' },
    ],
    exampleUser: 'Turn these notes into a concise PRD with acceptance criteria.',
    exampleModel:
      '## Goals … ## Non-goals … ## Acceptance criteria …',
    benchmarks: [
      { value: '87+', label: 'MMLU' },
      { value: '89+', label: 'HumanEval' },
      { value: '4.7⭐', label: 'Rating' },
    ],
  },
  'Llama 4 Scout': {
    name: 'Llama 4 Scout',
    lab: 'Meta AI',
    tagline: 'Efficient open multimodal',
    description:
      'Open-weight Llama 4 variant tuned for low-latency multimodal understanding across text, image, and video.',
    io: 'Input: text, image, video · Output: text · Open weights: yes',
    useCases: [
      { icon: '🦙', label: 'Fine-tuning' },
      { icon: '🖼️', label: 'Vision' },
      { icon: '🎬', label: 'Video QA' },
    ],
    exampleUser: 'Describe what happens in this clip in 5 bullets.',
    exampleModel:
      '1. … 2. … 3. … 4. … 5. …',
    benchmarks: [
      { value: 'Strong', label: 'OpenVQA' },
      { value: 'Strong', label: 'DocVQA' },
      { value: '4.5⭐', label: 'Rating' },
    ],
  },
  'Llama 4 Maverick': {
    name: 'Llama 4 Maverick',
    lab: 'Meta AI',
    tagline: 'Quality-first open',
    description:
      'Higher-quality open-weight Llama 4 line with MoE routing for demanding multimodal and reasoning-style tasks.',
    io: 'Input: text, image, video · Output: text · Open weights: yes',
    useCases: [
      { icon: '🧠', label: 'Reasoning' },
      { icon: '📚', label: 'RAG' },
      { icon: '🔧', label: 'Agents' },
    ],
    exampleUser: 'Compare two approaches to retrieval for this use case.',
    exampleModel:
      'Approach A … Approach B … Recommendation …',
    benchmarks: [
      { value: 'Top-tier', label: 'Open bench' },
      { value: '4.6⭐', label: 'Rating' },
    ],
  },
  'DeepSeek-R1': {
    name: 'DeepSeek-R1',
    lab: 'DeepSeek',
    tagline: 'Open reasoning',
    hot: true,
    description:
      'Open-weight reasoning model competitive on math and code with strong community fine-tunes and self-hosting options.',
    io: 'Input: text · Output: text · License: permissive (check upstream)',
    useCases: [
      { icon: '🧮', label: 'Math' },
      { icon: '💻', label: 'Code' },
      { icon: '🏠', label: 'Self-host' },
    ],
    exampleUser: 'Show your reasoning for this Olympiad-style problem.',
    exampleModel:
      'Let’s denote … Therefore … Final answer: …',
    benchmarks: [
      { value: 'Strong', label: 'AIME' },
      { value: 'Strong', label: 'Code' },
      { value: '4.6⭐', label: 'Rating' },
    ],
  },
  'Qwen2.5': {
    name: 'Qwen2.5',
    lab: 'Alibaba',
    tagline: 'General & coding',
    description:
      'Qwen family models with strong multilingual and coding performance across a range of sizes.',
    io: 'Input: text · Output: text · Sizes: multiple',
    useCases: [
      { icon: '🌐', label: 'Multilingual' },
      { icon: '💻', label: 'Coding' },
      { icon: '📦', label: 'Fine-tunes' },
    ],
    exampleUser: 'Implement this function with edge cases covered.',
    exampleModel:
      '```python\ndef …\n```',
    benchmarks: [
      { value: '85+', label: 'Coding' },
      { value: '4.5⭐', label: 'Rating' },
    ],
  },
};

export function getModelDetail(name: string): DiscModelDetail {
  const trimmed = name.trim();
  return MODEL_CATALOG[trimmed] ?? fallback(trimmed);
}
