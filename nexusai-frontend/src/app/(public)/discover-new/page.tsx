'use client';
import { useState, useMemo } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent,
  Avatar, Chip, Rating, CircularProgress,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styles } from './styles';
import { useGetAiModelsListQuery } from '@/services/ai-models';

const CATEGORIES = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Multimodal'];

const TREND_SUFFIXES = ['+15% this week', '+12% this week', '+8% this week'];

const DiscoverNewPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { data, isLoading } = useGetAiModelsListQuery({ page: 1, limit: 100 });
  const allModels: any[] = data?.data?.data ?? data?.data?.items ?? [];

  // Featured = highest-rated model
  const featuredModel = useMemo(() =>
    [...allModels].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0], [allModels]);

  // New Releases = all models sorted by rating desc
  const newReleases = useMemo(() =>
    [...allModels].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)), [allModels]);

  // Rising Stars = bottom half by price (open source or lowest cost) with high rating
  const risingStars = useMemo(() =>
    [...allModels]
      .filter((m) => m.isOpenSource || (m.pricePer1MTokens ?? 999) < 8)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 3),
  [allModels]);

  const filteredModels = selectedCategory === 'All'
    ? newReleases
    : newReleases.filter((m) => m.category === selectedCategory);

  const modelToPrice = (m: any) => m.priceDisplay || (m.pricePer1MTokens ? `$${m.pricePer1MTokens}/1M` : 'Free');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#C8622A' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={styles?.container()}>
      {/* Header */}
      <Box sx={styles?.headerBox()}>
        <Typography sx={styles?.headerTitle()}>Discover New</Typography>
        <Typography sx={styles?.headerSubtitle()}>
          The latest and most interesting AI models, freshly released.
        </Typography>
      </Box>

      {/* Featured Card */}
      {featuredModel && (
        <Box sx={styles?.featuredCard()}>
          <Box sx={styles?.featuredBadge()}>
            <Typography sx={styles?.badgeText()}>🔥 This Week&apos;s Top Model</Typography>
          </Box>
          <Box sx={styles?.featuredContent()}>
            <Box sx={styles?.featuredHeader()}>
              <Avatar sx={styles?.featuredAvatar()}>{featuredModel.emoji || '🤖'}</Avatar>
              <Box>
                <Typography sx={styles?.featuredName()}>{featuredModel.name}</Typography>
                <Typography sx={styles?.featuredProvider()}>{featuredModel.provider}</Typography>
              </Box>
            </Box>
            <Typography sx={styles?.featuredDescription()}>
              {featuredModel.description} {featuredModel.contextWindow ? `and ${(featuredModel.contextWindow / 1000).toFixed(0)}K context window.` : ''}
            </Typography>
            <Box sx={styles?.featuredFooter()}>
              <Box sx={styles?.featuredStats()}>
                <Box sx={styles?.statGroup()}>
                  <Rating value={featuredModel.rating} readOnly precision={0.1} sx={{ fontSize: '1.2rem' }} />
                  <Typography sx={styles?.statValue()}>{featuredModel.rating?.toFixed(1)}★</Typography>
                </Box>
                <Typography sx={styles?.usersCount()}>50K users this week</Typography>
              </Box>
              <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={styles?.tryNowButton()}>
                Try Now
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* New Releases Section */}
      <Box sx={styles?.newReleasesSection()}>
        <Typography sx={styles?.sectionTitle()}>New Releases</Typography>

        {/* Category Scroll */}
        <Box sx={styles?.categoriesScroll()}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={styles?.categoryChip(category === selectedCategory)}
            />
          ))}
        </Box>

        {/* Models Grid */}
        <Grid container spacing={2.5}>
          {filteredModels.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model._id}>
              <Card sx={styles?.modelCard()}>
                <CardContent sx={styles?.cardContent()}>
                  <Box sx={styles?.releaseTagRow()}>
                    <Chip label={model.releaseDate || 'New'} size="small" sx={styles?.releaseTag()} />
                  </Box>
                  <Box sx={styles?.modelHeader()}>
                    <Avatar sx={styles?.modelAvatar()}>{model.emoji || '🤖'}</Avatar>
                    <Box>
                      <Typography sx={styles?.modelName()}>{model.name}</Typography>
                      <Typography sx={styles?.modelProvider()}>{model.provider}</Typography>
                    </Box>
                  </Box>
                  <Chip label={model.category} size="small" sx={styles?.categoryChipSmall()} />
                  <Typography sx={styles?.modelDescription()}>{model.description}</Typography>
                  <Box sx={styles?.modelFooter()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={modelToPrice(model)} size="small" variant="outlined" sx={styles?.priceChip()} />
                      <Typography fontSize="13px" color="text.secondary">{model.rating?.toFixed(1)}★</Typography>
                    </Box>
                    <Button size="small" endIcon={<ArrowForwardIcon fontSize="small" />} sx={styles?.tryButton()}>
                      Try
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Rising Stars Section */}
      {risingStars.length > 0 && (
        <Box sx={styles?.risingStarsSection()}>
          <Typography sx={styles?.sectionTitle()}>Rising Stars 🚀</Typography>
          <Grid container spacing={2.5}>
            {risingStars.map((model, idx) => (
              <Grid item xs={12} sm={6} md={4} key={model._id}>
                <Card sx={styles?.trendingCard()}>
                  <CardContent sx={styles?.trendingCardContent()}>
                    <Box sx={styles?.trendingHeader()}>
                      <Avatar sx={styles?.trendingAvatar()}>{model.emoji || '🤖'}</Avatar>
                      <Box>
                        <Typography sx={styles?.trendingName()}>{model.name}</Typography>
                        <Typography sx={styles?.trendingProvider()}>{model.provider}</Typography>
                      </Box>
                    </Box>
                    <Box sx={styles?.trendBadge()}>
                      <Typography sx={styles?.trendText()}>📈 {TREND_SUFFIXES[idx] || '+10% this week'}</Typography>
                    </Box>
                    <Button variant="outlined" fullWidth endIcon={<ArrowForwardIcon fontSize="small" />} sx={styles?.trendingButton()}>
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default DiscoverNewPage;
