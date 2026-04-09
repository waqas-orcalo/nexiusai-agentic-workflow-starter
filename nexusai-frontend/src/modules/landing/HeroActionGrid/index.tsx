'use client';
import { Box } from '@mui/material';
import { styles } from './styles';

const ACTION_BUTTONS = [
  { icon: '🎨', label: 'Create image' },
  { icon: '🎵', label: 'Generate Audio' },
  { icon: '🎬', label: 'Create video' },
  { icon: '📊', label: 'Create slides' },
  { icon: '📈', label: 'Create Infographs' },
  { icon: '❓', label: 'Create quiz' },
  { icon: '🗂️', label: 'Create Flashcards' },
  { icon: '🧠', label: 'Create Mind map' },
  { icon: '📉', label: 'Analyze Data' },
  { icon: '✍️', label: 'Write content' },
  { icon: '💻', label: 'Code Generation' },
  { icon: '📄', label: 'Document Analysis' },
  { icon: '🌐', label: 'Translate' },
  { icon: '🔭', label: 'Just Exploring' },
];

const HeroActionGrid = () => (
  <Box sx={styles?.wrapper()}>
    {ACTION_BUTTONS.map((btn) => (
      <button key={btn.label} className="hac-btn">
        <span className="hac-icon">{btn.icon}</span>
        <span className="hac-label">{btn.label}</span>
      </button>
    ))}
  </Box>
);

export default HeroActionGrid;
