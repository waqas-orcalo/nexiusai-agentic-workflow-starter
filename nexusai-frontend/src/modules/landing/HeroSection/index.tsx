import { Box } from '@mui/material';
import HeroSearchCard from '@/modules/landing/HeroSearchCard';
import HeroActionGrid from '@/modules/landing/HeroActionGrid';
import HeroStats from '@/modules/landing/HeroStats';
import { styles } from './styles';

const HeroSection = () => (
  <Box component="section" sx={styles?.hero()}>
    {/* Dot grid background */}
    <Box sx={styles?.dotGrid()} aria-hidden="true" />

    {/* Eyebrow badge */}
    <Box sx={styles?.eyebrow()}>
      <span className="live-dot" />
      347 models live · Updated daily
    </Box>

    {/* Main heading */}
    <Box component="h1" sx={styles?.h1()}>
      Find your perfect{' '}
      <Box component="span" sx={styles?.accent()}>AI model</Box>
      <br />
      with guided discovery
    </Box>

    {/* Subtitle */}
    <Box component="p" sx={styles?.subtitle()}>
      You don&apos;t need to know anything about AI to get started. Just click the box below — we&apos;ll do the rest together. ✨
    </Box>

    {/* Expanding Search Card + Suggested Questions */}
    <HeroSearchCard />

    {/* Quick Action Buttons */}
    <HeroActionGrid />

    {/* Stats Row */}
    <HeroStats />
  </Box>
);

export default HeroSection;
