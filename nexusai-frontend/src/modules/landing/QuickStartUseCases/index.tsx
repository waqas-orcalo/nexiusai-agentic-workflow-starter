import { Box } from '@mui/material';
import { styles } from './styles';

const USE_CASES = [
  { icon: '💻', title: 'Code Generation', models: 'Claude Opus 4.6, Devstral 2, GPT-5.4, Qwen3-Coder', cta: 'Start building →' },
  { icon: '🎨', title: 'Image Generation', models: 'gpt-image-1.5, Grok-Imagine-Pro, Gemini Flash Image', cta: 'Create images →' },
  { icon: '🤖', title: 'AI Agents', models: 'GPT-5.4, Claude Opus 4.6, kimi-k2.5, Grok-4-1', cta: 'Build agents →' },
  { icon: '📄', title: 'Document Analysis', models: 'Claude Sonnet 4.6, Gemini 3.1 Pro, Nemotron Ultra', cta: 'Analyse docs →' },
  { icon: '🎬', title: 'Video Generation', models: 'Sora 2 Pro, Veo 3.1, Grok-Imagine-Video', cta: 'Create video →' },
  { icon: '🔊', title: 'Voice & Audio', models: 'Gemini-TTS, ElevenLabs, Whisper v3', cta: 'Add voice →' },
  { icon: '🌍', title: 'Multilingual / Translation', models: 'Qwen3-Max (119 langs), Gemini 3.1 Flash-Lite, GLM-4.7', cta: 'Go multilingual →' },
  { icon: '🔢', title: 'Math & Research', models: 'DeepSeek-R1, QwQ-32B, Gemini 3.1 Pro', cta: 'Start researching →' },
];

const QuickStartUseCases = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Quick-Start by Use Case</Box>
      </Box>
      <Box sx={styles?.grid()}>
        {USE_CASES.map((uc) => (
          <Box key={uc.title} sx={styles?.card()}>
            <Box sx={styles?.cardIcon()}>{uc.icon}</Box>
            <Box sx={styles?.cardBody()}>
              <Box sx={styles?.cardTitle()}>{uc.title}</Box>
              <Box sx={styles?.cardModels()}>{uc.models}</Box>
              <Box sx={styles?.cardCta()}>{uc.cta}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default QuickStartUseCases;
