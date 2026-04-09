import { Box } from '@mui/material';
import { styles } from './styles';

const FEATURES = [
  { icon: '🧭', title: 'Guided Discovery Chat', desc: "I'll greet you, ask about your goals, and have a genuine conversation before recommending models. No overwhelming lists." },
  { icon: '📐', title: 'Prompt Engineering Guide', desc: 'Every model includes tailored prompt templates, principles, and examples so you get the best output from day one.' },
  { icon: '🤖', title: 'Agent Builder', desc: 'Step-by-step agent creation guides for every model — system prompts, tool configuration, memory setup, deployment.' },
  { icon: '💰', title: 'Flexible Pricing', desc: 'Free tiers, pay-per-use, subscriptions, and enterprise plans. Transparent pricing with no hidden fees.' },
  { icon: '⭐', title: 'User Reviews & Ratings', desc: 'Verified reviews from real builders, benchmark scores, and detailed I/O specs to help you choose confidently.' },
  { icon: '🔬', title: 'Research Feed', desc: 'Daily curated AI research, model releases, and breakthroughs from top labs — stay ahead of the curve.' },
];

const BuiltForBuilders = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Built for every builder</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {FEATURES.map((feat) => (
          <Box key={feat.title} sx={styles?.card()}>
            <Box sx={styles?.cardIcon()}>{feat.icon}</Box>
            <Box sx={styles?.cardTitle()}>{feat.title}</Box>
            <Box sx={styles?.cardDesc()}>{feat.desc}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default BuiltForBuilders;
