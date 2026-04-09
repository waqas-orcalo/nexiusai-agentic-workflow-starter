import { Box } from '@mui/material';
import { styles } from './styles';

const FEATURED_MODELS = [
  {
    icon: '👑', bg: '#FEF1EB',
    name: 'Claude Opus 4.6', org: 'Anthropic',
    badge: 'New', badgeClass: 'badge-new',
    desc: 'Adaptive Thinking, 1M token context (beta). Most intelligent Claude for coding and agentic tasks.',
    tags: ['Reasoning', 'Agents', 'Coding'],
    rating: 4.9, reviews: 2150, price: '$15/1M tk',
  },
  {
    icon: '🧠', bg: '#EEF2FD',
    name: 'GPT-5.4', org: 'OpenAI',
    badge: 'Hot', badgeClass: 'badge-hot',
    desc: 'Native agent use — operates browsers, apps and files autonomously. Improved reasoning efficiency.',
    tags: ['Agents', 'Multimodal', 'Flagship'],
    rating: 4.8, reviews: 3920, price: '$10/1M tk',
  },
  {
    icon: '🔬', bg: '#EBF5FB',
    name: 'Gemini 3.1 Pro', org: 'Google DeepMind',
    badge: 'Hot', badgeClass: 'badge-hot',
    desc: 'Thought Signatures, 5M context window. Go-to for ultra-long document analysis.',
    tags: ['Long-form', 'Multimodal', '5M ctx'],
    rating: 4.8, reviews: 2740, price: '$3.5/1M tk',
  },
  {
    icon: '🦙', bg: '#EEF2FD',
    name: 'Llama 4 Maverick', org: 'Meta',
    badge: '', badgeClass: '',
    desc: '400B Mixture-of-Experts with native multimodal. Free to self-host with commercial licence.',
    tags: ['Open Source', 'Multimodal', 'Free'],
    rating: 4.7, reviews: 1850, price: 'Free*',
  },
  {
    icon: '🌀', bg: '#F4F0FF',
    name: 'Devstral 2', org: 'Mistral',
    badge: '', badgeClass: '',
    desc: 'Fastest coding agent, 256K context, multi-file edits, codebase navigation.',
    tags: ['Coding', '256K ctx', 'Fast'],
    rating: 4.7, reviews: 980, price: '$0.22/1M tk',
  },
  {
    icon: '💻', bg: '#EFFDF5',
    name: 'DeepSeek-R1', org: 'DeepSeek',
    badge: '', badgeClass: '',
    desc: 'Open-source reasoning model rivalling o1. Excels at math, code, and complex logic tasks.',
    tags: ['Reasoning', 'Math', 'Open Source'],
    rating: 4.6, reviews: 1420, price: 'Free*',
  },
];

const FeaturedModels = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Featured Models</Box>
        <Box component="button" sx={styles?.browseLink()}>Browse all 525 →</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {FEATURED_MODELS.map((m) => (
          <div key={m.name} className="mcard">
            {/* Card top: icon + name/org + badge */}
            <div className="mcard-top">
              <div className="mcard-icon-wrap">
                <div className="mcard-icon" style={{ background: m.bg }}>{m.icon}</div>
                <div>
                  <div className="mcard-name">{m.name}</div>
                  <div className="mcard-org">{m.org}</div>
                </div>
              </div>
              {m.badge && (
                <span className={`mcard-badge ${m.badgeClass}`}>{m.badge}</span>
              )}
            </div>

            {/* Description */}
            <div className="mcard-desc">{m.desc}</div>

            {/* Tags */}
            <div className="mcard-tags">
              {m.tags.map((tag) => (
                <span key={tag} className="tag t-blue">{tag}</span>
              ))}
            </div>

            {/* Footer */}
            <div className="mcard-footer">
              <div className="mcard-rating">
                <span className="stars">{'★'.repeat(Math.floor(m.rating))}</span>
                {m.rating} ({m.reviews.toLocaleString()})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mcard-price">{m.price}</span>
                <button className="mcard-cta">Try →</button>
              </div>
            </div>
          </div>
        ))}
      </Box>
    </Box>
  </Box>
);

export default FeaturedModels;
