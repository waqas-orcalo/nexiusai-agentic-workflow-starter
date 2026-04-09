import { Box } from '@mui/material';
import { styles } from './styles';

const TRENDING = [
  { badge: '🆕 Just Released', badgeBg: 'var(--teal-lt)', badgeColor: 'var(--teal)', lab: 'Anthropic', title: 'Claude Opus 4.6 & Sonnet 4.6', desc: 'Adaptive Thinking and 1M token context (beta) mark a major leap in agent capability. Now the most intelligent Claude for coding and agentic tasks.' },
  { badge: '🔥 Hot', badgeBg: 'var(--amber-lt)', badgeColor: 'var(--amber)', lab: 'Google DeepMind', title: 'Gemini 3.1 Pro — Thought Signatures', desc: 'Thought Signatures bring new transparency to deep reasoning. 5M context window makes it the go-to for ultra-long document analysis.' },
  { badge: '🤖 Agent Use', badgeBg: 'var(--blue-lt)', badgeColor: 'var(--blue)', lab: 'OpenAI', title: 'GPT-5.4 — Native agent use', desc: 'GPT-5.4 introduces native agent use, letting it operate browsers, apps, and files autonomously with improved reasoning efficiency.' },
  { badge: '⚡ Real-Time', badgeBg: 'var(--rose-lt)', badgeColor: 'var(--rose)', lab: 'xAI', title: 'Grok-4-1 Fast — 4-Agent Architecture', desc: "Grok's 4-agent architecture with real-time X (Twitter) data access and 2M context makes it unique for real-time analysis tasks." },
  { badge: '🔓 Open Source', badgeBg: 'var(--blue-lt)', badgeColor: 'var(--blue)', lab: 'Meta', title: 'Llama 4 Maverick — 400B MoE', desc: "Meta's 400B Mixture-of-Experts model with native multimodal understanding. Free to self-host with a full commercial licence." },
  { badge: '💻 Coding', badgeBg: 'var(--teal-lt)', badgeColor: 'var(--teal)', lab: 'Mistral', title: 'Devstral 2 — Fastest Coding Agent', desc: "Mistral's coding agent with 256K context, multi-file edits, and codebase navigation. The fastest software engineering model available." },
];

const TrendingThisWeek = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>🔥 Trending This Week</Box>
        <Box component="button" sx={styles?.viewLink()}>View research feed →</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {TRENDING.map((item) => (
          <Box key={item.title} sx={styles?.card()}>
            <Box sx={styles?.cardMeta()}>
              <Box component="span" sx={{ ...styles?.badge(), background: item.badgeBg, color: item.badgeColor }}>
                {item.badge}
              </Box>
              <Box component="span" sx={styles?.labText()}>{item.lab}</Box>
            </Box>
            <Box sx={styles?.cardTitle()}>{item.title}</Box>
            <Box sx={styles?.cardDesc()}>{item.desc}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default TrendingThisWeek;
