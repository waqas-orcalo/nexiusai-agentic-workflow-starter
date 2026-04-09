import { Box } from '@mui/material';
import { styles } from './styles';

const MODELS = [
  { icon: '🧠', name: 'GPT-5.4',              lab: 'OpenAI',     context: '1.05M',     input: '$2.50',  output: '$15',    multimodal: '✅', speed: '🟢 Fast',     bestFor: 'High-precision professional tasks' },
  { icon: '👑', name: 'Claude Opus 4.6',       lab: 'Anthropic',  context: '200K/1M β', input: '$5',     output: '$25',    multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Agents, advanced coding' },
  { icon: '⚡', name: 'Claude Sonnet 4.6',     lab: 'Anthropic',  context: '200K/1M β', input: '$3',     output: '$15',    multimodal: '✅', speed: '🟢 Fast',     bestFor: 'Code, data, content at scale' },
  { icon: '🚀', name: 'Claude Haiku 4.5',      lab: 'Anthropic',  context: '200K',      input: '$1',     output: '$5',     multimodal: '✅', speed: '⚡ Fastest',  bestFor: 'Real-time, high-volume' },
  { icon: '🔬', name: 'Gemini 3.1 Pro',        lab: 'Google',     context: '2M–5M',     input: '$2',     output: '$12',    multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Deep reasoning, long context' },
  { icon: '⚡', name: 'Gemini 3 Flash',        lab: 'Google',     context: '1M',        input: '$2',     output: '$12',    multimodal: '✅', speed: '🟠 Moderate', bestFor: 'High-volume chat & coding' },
  { icon: '💡', name: 'Gemini 3.1 Flash-Lite', lab: 'Google',     context: '1M',        input: '$0.10',  output: '$0.40',  multimodal: '✅', speed: '⚡ Fastest',  bestFor: 'Low-cost agents, translation' },
  { icon: '𝕏',  name: 'Grok-4-1 Fast',         lab: 'xAI',        context: '2000K',     input: '$0.20',  output: '$0.50',  multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Real-time X data analysis' },
  { icon: '💻', name: 'DeepSeek-V3',           lab: 'DeepSeek',   context: '128K',      input: '~$0.07', output: '~$0.28', multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Budget general model' },
  { icon: '🦙', name: 'Llama 4 Maverick',      lab: 'Meta',       context: '128K',      input: 'Free',   output: 'Free',   multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Open-source multimodal' },
  { icon: '🀄', name: 'Qwen3-Max',             lab: 'Alibaba',    context: '128K',      input: '$0.40',  output: '$1.20',  multimodal: '✅', speed: '🟠 Moderate', bestFor: 'Multilingual / APAC' },
  { icon: '🌀', name: 'Devstral 2',            lab: 'Mistral',    context: '256K',      input: '$0.40',  output: '$2',     multimodal: '✅', speed: '⚡ Fastest',  bestFor: 'Software engineering agents' },
  { icon: '🟢', name: 'Nemotron Ultra 253B',   lab: 'NVIDIA',     context: '131K',      input: '$0.60',  output: '$1.80',  multimodal: '❌', speed: '🟠 Moderate', bestFor: 'Enterprise reasoning & RAG' },
  { icon: '🌙', name: 'kimi-k2.5',             lab: 'Moonshot',   context: '262K',      input: '$0.60',  output: '$3',     multimodal: '✅', speed: '⚡ Fastest',  bestFor: 'Multi-agent RAG, visual coding' },
];

const TABLE_HEADERS = ['Model', 'Lab', 'Context', 'Input $/1M', 'Output $/1M', 'Multimodal', 'Speed', 'Best For'];

const ModelComparisonTable = () => (
  <Box component="section" sx={styles?.section()}>
    <Box sx={styles?.inner()}>
      <Box sx={styles?.header()}>
        <Box component="h2" sx={styles?.title()}>Flagship Model Comparison</Box>
        <Box component="button" sx={styles?.compareLink()}>Compare all →</Box>
      </Box>
      <Box sx={styles?.subtitle()}>
        Side-by-side view of the leading models across all major labs. Input/Output prices per 1M tokens.
      </Box>
      <Box sx={styles?.tableWrapper()}>
        <Box component="table" sx={styles?.table()}>
          <thead>
            <Box component="tr" sx={styles?.theadRow()}>
              {TABLE_HEADERS.map((h, i) => (
                <Box
                  component="th"
                  key={h}
                  sx={i === 0 || i === 1 || i === 7 ? styles?.th() : styles?.thCenter()}
                >
                  {h}
                </Box>
              ))}
            </Box>
          </thead>
          <tbody>
            {MODELS.map((model) => (
              <Box component="tr" key={model.name} sx={styles?.tdRow()}>
                <Box component="td" sx={styles?.td()}>
                  <Box sx={styles?.modelNameWrap()}>
                    <Box component="span" sx={styles?.modelIcon()}>{model.icon}</Box>
                    <Box component="span" sx={styles?.modelName()}>{model.name}</Box>
                  </Box>
                </Box>
                <Box component="td" sx={styles?.tdOrg()}>{model.lab}</Box>
                <Box component="td" sx={styles?.tdContext()}>{model.context}</Box>
                <Box component="td" sx={styles?.tdPrice()}>{model.input}</Box>
                <Box component="td" sx={styles?.tdPrice()}>{model.output}</Box>
                <Box component="td" sx={styles?.tdCenter()}>{model.multimodal}</Box>
                <Box component="td" sx={styles?.tdSpeed(model.speed)}>{model.speed}</Box>
                <Box component="td" sx={styles?.tdBestFor()}>{model.bestFor}</Box>
              </Box>
            ))}
          </tbody>
        </Box>
      </Box>
      <Box sx={styles?.disclaimer()}>
        * Prices shown are approximate. Free self-hosted models exclude infrastructure costs. Beta pricing may change.
      </Box>
    </Box>
  </Box>
);

export default ModelComparisonTable;
