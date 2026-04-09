import { Box } from '@mui/material';
import { styles } from './styles';

const BUDGET_TIERS = [
  {
    icon: '🆓',
    title: 'Free & Open Source',
    desc: 'Llama 4 Maverick, Llama 4 Scout, DeepSeek-V3, DeepSeek-R1 — self-host with zero API cost.',
    link: '6 models available →',
    bg: 'var(--teal-lt)',
    border: 'rgba(10,94,73,0.15)',
    titleColor: 'var(--teal)',
    linkColor: 'var(--teal)',
  },
  {
    icon: '💸',
    title: 'Budget — Under $0.50/1M',
    desc: 'Gemini 3.1 Flash-Lite, Mistral Medium, Nemotron Nano — best performance per dollar.',
    link: '9 models available →',
    bg: 'var(--blue-lt)',
    border: 'var(--blue-border)',
    titleColor: 'var(--blue)',
    linkColor: 'var(--blue)',
  },
  {
    icon: '⚖️',
    title: 'Mid-Range — $1–$5/1M',
    desc: 'Claude Sonnet 4.6, Claude Haiku 4.5, Gemini 3.1 Pro, GPT-5.4, Qwen3-Max.',
    link: '11 models available →',
    bg: 'var(--amber-lt)',
    border: 'rgba(138,90,0,0.15)',
    titleColor: 'var(--amber)',
    linkColor: 'var(--amber)',
  },
  {
    icon: '🏆',
    title: 'Premium — $5+/1M',
    desc: 'Claude Opus 4.6, Sora 2 Pro, gpt-image-1.5 — top-tier quality for demanding workloads.',
    link: '5 models available →',
    bg: 'var(--accent-lt)',
    border: 'var(--accent-border)',
    titleColor: 'var(--accent)',
    linkColor: 'var(--accent)',
  },
];

const FindByBudget = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Find Models by Budget</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {BUDGET_TIERS.map((tier) => (
          <Box
            key={tier.title}
            sx={{
              ...styles?.card(),
              background: tier.bg,
              border: `1px solid ${tier.border}`,
            }}
          >
            <Box sx={styles?.cardIcon()}>{tier.icon}</Box>
            <Box sx={{ ...styles?.cardTitle(), color: tier.titleColor }}>{tier.title}</Box>
            <Box sx={styles?.cardDesc()}>{tier.desc}</Box>
            <Box sx={{ ...styles?.cardLink(), color: tier.linkColor }}>{tier.link}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default FindByBudget;
