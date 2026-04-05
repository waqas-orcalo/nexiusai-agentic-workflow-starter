'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Avatar,
  Typography,
  Button,
  InputAdornment,
  Rating,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material';
import { styles } from './styles';
import { useGetAiModelsListQuery } from '@/services/ai-models';

const CATEGORIES = ['All', 'Language', 'Vision', 'Code', 'Image Gen', 'Audio', 'Open Source'];

const PROVIDER_EMOJI: Record<string, string> = {
  OpenAI: '🧠',
  Anthropic: '👑',
  'Google DeepMind': '🔬',
  Meta: '🦙',
  DeepSeek: '💻',
  'Mistral AI': '🌀',
  'Alibaba (Qwen)': '🀄',
  Cohere: '🔵',
  'Stability AI': '🎨',
  NVIDIA: '🟢',
};

const MarketplacePage = () => {
  const theme = useTheme();
  const [selectedLab, setSelectedLab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useGetAiModelsListQuery({ page: 1, limit: 100 });
  const allModels: any[] = data?.data?.data ?? data?.data?.items ?? [];

  // Build AI Labs dynamically from real data
  const aiLabs = useMemo(() => {
    const providerCounts: Record<string, number> = {};
    allModels.forEach((m) => {
      providerCounts[m.provider] = (providerCounts[m.provider] || 0) + 1;
    });
    const labs = Object.entries(providerCounts).map(([name, count]) => ({
      emoji: PROVIDER_EMOJI[name] || '🤖',
      name,
      count,
      id: name.toLowerCase().replace(/\s+/g, '-'),
    }));
    return [{ emoji: '🌐', name: 'All Labs', count: allModels.length, id: 'all' }, ...labs];
  }, [allModels]);

  const filteredModels = useMemo(() => {
    return allModels.filter((model) => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' ||
        model.category === selectedCategory ||
        (selectedCategory === 'Open Source' && model.isOpenSource);
      const matchesLab = selectedLab === 'all' ||
        model.provider.toLowerCase().replace(/\s+/g, '-') === selectedLab;
      return matchesSearch && matchesCategory && matchesLab;
    });
  }, [allModels, selectedLab, selectedCategory, searchQuery]);

  const getCategoryChipColor = (category: string) => {
    const colorMap: Record<string, string> = {
      Language: '#FF9800',
      Vision: '#2196F3',
      Code: '#4CAF50',
      'Image Gen': '#E91E63',
      Audio: '#9C27B0',
      Multimodal: '#FF5722',
    };
    return colorMap[category] || '#757575';
  };

  const modelToPrice = (m: any) => m.priceDisplay || (m.pricePer1MTokens ? `$${m.pricePer1MTokens}/1M` : 'Free');

  return (
    <Box sx={styles?.wrapper()}>
      {/* Left Sidebar - AI Labs */}
      <Box sx={styles?.leftSidebar()}>
        <Typography sx={styles?.sidebarTitle()}>AI Labs</Typography>
        <Box sx={styles?.labsList()}>
          {aiLabs.map((lab) => (
            <Box
              key={lab.id}
              onClick={() => setSelectedLab(lab.id)}
              sx={styles?.labItem(theme, selectedLab === lab.id)}
            >
              <Typography sx={styles?.labEmoji()}>{lab.emoji}</Typography>
              <Box sx={styles?.labInfo()}>
                <Typography sx={styles?.labName()}>{lab.name}</Typography>
                <Typography sx={styles?.labCount()}>{lab.count}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Center - Search, Categories, Models Grid */}
      <Box sx={styles?.centerContent()}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={styles?.searchField()}
        />

        {/* Category Tabs */}
        <Box sx={styles?.categoriesContainer()}>
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              sx={styles?.categoryChip(
                theme,
                selectedCategory === category
              )}
            />
          ))}
        </Box>

        {/* Models Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#C8622A' }} />
          </Box>
        ) : (
        <Grid container spacing={2.5}>
          {filteredModels.map((model) => (
            <Grid item xs={12} sm={6} md={4} key={model._id || model.id}>
              <Card sx={styles?.modelCard()}>
                <CardContent sx={styles?.cardContent()}>
                  {/* Top Row: Avatar + Name + Provider */}
                  <Box sx={styles?.modelHeader()}>
                    <Avatar sx={styles?.modelAvatar()}>
                      {model.emoji || '🤖'}
                    </Avatar>
                    <Box sx={styles?.modelNameBox()}>
                      <Typography sx={styles?.modelName()}>
                        {model.name}
                      </Typography>
                      <Typography sx={styles?.modelProvider()}>
                        {model.provider}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Category Chip */}
                  <Chip
                    label={model.category}
                    size="small"
                    sx={{
                      backgroundColor: getCategoryChipColor(model.category),
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: 24,
                      marginBottom: 1.5,
                    }}
                  />

                  {/* Description */}
                  <Typography sx={styles?.modelDescription()}>
                    {model.description}
                  </Typography>

                  {/* Bottom Row: Price, Rating, Button */}
                  <Box sx={styles?.modelFooter()}>
                    <Box sx={styles?.leftFooter()}>
                      <Chip
                        label={modelToPrice(model)}
                        size="small"
                        variant="outlined"
                        sx={styles?.priceChip()}
                      />
                      <Box sx={styles?.ratingBox()}>
                        <Rating
                          value={model.rating}
                          readOnly
                          size="small"
                          precision={0.1}
                        />
                        <Typography sx={styles?.ratingText()}>
                          {model.rating?.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={styles?.tryButton()}
                    >
                      Try
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        )}
      </Box>

      {/* Right Sidebar - Filters */}
      <Box sx={styles?.rightSidebar()}>
        <Box sx={styles?.filterHeader()}>
          <TuneIcon sx={{ fontSize: '1.25rem' }} />
          <Typography sx={styles?.filterTitle()}>Filters</Typography>
        </Box>
        <Box sx={styles?.filterSection()}>
          <Typography sx={styles?.filterSectionTitle()}>Pricing</Typography>
          <Box sx={styles?.filterOptions()}>
            <Chip label="Free" variant="outlined" size="small" />
            <Chip label="Pay as you go" variant="outlined" size="small" />
            <Chip label="Enterprise" variant="outlined" size="small" />
          </Box>
        </Box>
        <Box sx={styles?.filterSection()}>
          <Typography sx={styles?.filterSectionTitle()}>Capabilities</Typography>
          <Box sx={styles?.filterOptions()}>
            <Chip label="Vision" variant="outlined" size="small" />
            <Chip label="Audio" variant="outlined" size="small" />
            <Chip label="Code" variant="outlined" size="small" />
            <Chip label="Reasoning" variant="outlined" size="small" />
          </Box>
        </Box>
        <Box sx={styles?.filterSection()}>
          <Typography sx={styles?.filterSectionTitle()}>Source</Typography>
          <Box sx={styles?.filterOptions()}>
            <Chip label="Open Source" variant="outlined" size="small" />
            <Chip label="Proprietary" variant="outlined" size="small" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MarketplacePage;
