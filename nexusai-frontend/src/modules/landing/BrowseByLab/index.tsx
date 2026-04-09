import { Box } from '@mui/material';
import { styles } from './styles';

const AI_LABS = [
  { icon: '🧠', name: 'OpenAI', meta: '3 models · GPT-5.4, Sora 2' },
  { icon: '⚡', name: 'Anthropic', meta: '3 models · Opus, Sonnet, Haiku' },
  { icon: '🔬', name: 'Google DeepMind', meta: '5 models · Gemini 3.1, Veo 3' },
  { icon: '𝕏', name: 'xAI (Grok)', meta: '2 models · Grok-4-1, Grok-Imagine' },
  { icon: '💻', name: 'DeepSeek', meta: '3 models · V3, V3.2, R1' },
  { icon: '🦙', name: 'Meta (Llama)', meta: '2 models · Maverick, Scout' },
  { icon: '🀄', name: 'Alibaba (Qwen)', meta: '2 models · Qwen3-Max, Coder' },
  { icon: '🌀', name: 'Mistral', meta: '2 models · Devstral 2, Medium 3.1' },
  { icon: '🟢', name: 'NVIDIA NIM', meta: '4 models · Nemotron Ultra, Nano' },
  { icon: '🔷', name: 'GLM (Zhipu)', meta: '3 models · GLM-5, 4.7, 4.6V' },
  { icon: '🌙', name: 'Moonshot (Kimi)', meta: '2 models · k2.5, k2-Thinking' },
];

const BrowseByLab = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Browse by AI Lab</Box>
        <Box component="button" sx={styles?.seeAll()}>See all labs →</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {AI_LABS.map((lab) => (
          <Box key={lab.name} sx={styles?.card()}>
            <Box sx={styles?.labIcon()}>{lab.icon}</Box>
            <Box sx={styles?.labName()}>{lab.name}</Box>
            <Box sx={styles?.labMeta()}>{lab.meta}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default BrowseByLab;
