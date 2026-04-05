'use client';
import { Box, Typography, TextField, Chip, Grid, Paper, Button, IconButton } from '@mui/material';
import {
  Mic,
  AttachFile,
  Image,
  Download,
  ScreenShare,
  Videocam,
  SmartToy,
} from '@mui/icons-material';
import { styles } from './styles';
import { useGetAiModelsListQuery } from '@/services/ai-models';

const actionCards = [
  { emoji: '🖼️', label: 'Create image' },
  { emoji: '🎵', label: 'Generate Audio' },
  { emoji: '🎬', label: 'Create video' },
  { emoji: '📊', label: 'Create slides' },
  { emoji: '📈', label: 'Create Infographs' },
  { emoji: '📝', label: 'Create quiz' },
  { emoji: '🃏', label: 'Create Flashcards' },
  { emoji: '🧠', label: 'Create Mind map' },
  { emoji: '📉', label: 'Analyze Data' },
  { emoji: '✍️', label: 'Write content' },
  { emoji: '💻', label: 'Code Generation' },
  { emoji: '📄', label: 'Document Analysis' },
  { emoji: '🌐', label: 'Translate' },
  { emoji: '🔍', label: 'Just Exploring' },
];

const HomePage = () => {
  const { data } = useGetAiModelsListQuery({ page: 1, limit: 1 });
  const totalModels = (data as any)?.data?.total ?? (data as any)?.data?.totalItems ?? 7;

  return (
  <Box sx={styles.wrapper()}>
    {/* Hero Section */}
    <Box sx={styles.heroSection()}>
      <Chip label={`• ${totalModels} models live · Updated daily`} sx={styles.heroBadge()} />
      <Typography variant="h1" sx={styles.heroHeading()}>
        Find your perfect{' '}
        <Box component="span" sx={styles.heroAccent()}>
          AI model
        </Box>
        <br />
        with guided discovery
      </Typography>
      <Typography sx={styles.heroSubtitle()}>
        You don't need to know anything about AI to get started. Just click the box below — we'll do
        the rest together. ✨
      </Typography>

      {/* Chat Input */}
      <Box sx={styles.chatInputWrapper()}>
        <TextField
          fullWidth
          placeholder="Click here and type anything — or just say hi! 🤖"
          sx={styles.chatInput()}
          variant="outlined"
        />
        <Box sx={styles.inputActions()}>
          <Box sx={styles.inputIcons()}>
            {[Mic, AttachFile, Image, Download, ScreenShare, Videocam].map((Icon, i) => (
              <IconButton key={i} size="small" sx={styles.inputIcon()}>
                <Icon sx={{ fontSize: 18 }} />
              </IconButton>
            ))}
            <Chip label="Agent +" size="small" sx={styles.agentChip()} />
          </Box>
          <Button variant="contained" sx={styles.letsGoBtn()} startIcon={<SmartToy />}>
            Let's go
          </Button>
        </Box>
      </Box>
    </Box>

    {/* Action Cards */}
    <Box sx={styles.actionCardsSection()}>
      <Grid container spacing={1.5} justifyContent="center" sx={{ maxWidth: 900, mx: 'auto' }}>
        {actionCards.map((card) => (
          <Grid item key={card.label}>
            <Paper sx={styles.actionCard()} elevation={0}>
              <Typography sx={styles.cardEmoji()}>{card.emoji}</Typography>
              <Typography sx={styles.cardLabel()}>{card.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>

    {/* Stats */}
    <Box sx={styles.statsSection()}>
      {[
        { value: `${totalModels}+`, label: 'AI Models' },
        { value: '82K', label: 'Builders' },
        { value: '28', label: 'AI Labs' },
        { value: '4.8 ⭐', label: 'Avg Rating' },
      ].map((stat) => (
        <Box key={stat.label} sx={styles.statItem()}>
          <Typography sx={styles.statValue()}>{stat.value}</Typography>
          <Typography sx={styles.statLabel()}>{stat.label}</Typography>
        </Box>
      ))}
    </Box>

    {/* Footer */}
    <Box sx={styles.footer()}>
      <Typography component="a" href="#" sx={styles.footerLink()}>
        Terms
      </Typography>
    </Box>
  </Box>
  );
};

export default HomePage;
