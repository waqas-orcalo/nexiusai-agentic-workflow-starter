'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  Chip,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
  Rating,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ImageIcon from '@mui/icons-material/Image';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useTheme } from '@mui/material';
import { styles } from './styles';
import { useGetAiModelsListQuery } from '@/services/ai-models';

const CATEGORY_PROMPTS: Record<string, string[]> = {
  Language: ['Summarize this document', 'Write a professional email', 'Explain a concept', 'Generate creative content'],
  Vision: ['Analyze this image', 'Describe what you see', 'Identify objects', 'Generate image caption'],
  Code: ['Debug this function', 'Refactor my code', 'Write unit tests', 'Explain this algorithm'],
  Multimodal: ['Analyze images', 'Process documents', 'Generate insights', 'Answer complex questions'],
  'Image Gen': ['Generate a landscape', 'Create a logo', 'Design an illustration', 'Visualize a concept'],
  Audio: ['Transcribe audio', 'Generate speech', 'Analyze tone', 'Convert text to speech'],
  default: ['Help me brainstorm', 'Explain a concept', 'Assist with research', 'Solve a problem'],
};

const ChatHubPage = () => {
  const theme = useTheme();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading } = useGetAiModelsListQuery({ page: 1, limit: 100 });
  const allModels: any[] = data?.data?.data ?? data?.data?.items ?? [];

  // Group by provider
  const modelGroups = useMemo(() => {
    const groups: Record<string, any[]> = {};
    allModels.forEach((m) => {
      if (!groups[m.provider]) groups[m.provider] = [];
      groups[m.provider].push(m);
    });
    return groups;
  }, [allModels]);

  const currentModel = selectedModelId
    ? allModels.find((m) => m._id === selectedModelId)
    : allModels[0];

  const suggestedPrompts = currentModel
    ? CATEGORY_PROMPTS[currentModel.category] ?? CATEGORY_PROMPTS.default
    : CATEGORY_PROMPTS.default;

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };

  const modelToPrice = (m: any) => m.priceDisplay || (m.pricePer1MTokens ? `$${m.pricePer1MTokens}/1M` : 'Free');
  const formatContext = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}K` : `${n}`;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress sx={{ color: '#C8622A' }} />
      </Box>
    );
  }

  return (
    <Box sx={styles?.wrapper()}>
      {/* Left Model List */}
      <Box sx={styles?.leftPanel()}>
        <TextField
          fullWidth
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1.2rem', color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={styles?.searchInput()}
        />

        <Box sx={styles?.modelsContainer()}>
          {Object.entries(modelGroups).map(([provider, models]) => {
            const filtered = models.filter((m) =>
              m.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (filtered.length === 0) return null;
            return (
              <Box key={provider}>
                <Typography sx={styles?.groupHeader()}>{provider}</Typography>
                <Box sx={styles?.modelsList()}>
                  {filtered.map((model) => (
                    <Box
                      key={model._id}
                      onClick={() => { setSelectedModelId(model._id); setMessages([]); }}
                      sx={styles?.modelItem(theme, (currentModel?._id === model._id))}
                    >
                      <Typography sx={styles?.modelItemEmoji()}>{model.emoji || '🤖'}</Typography>
                      <Typography sx={styles?.modelItemName()}>{model.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Center Chat Area */}
      <Box sx={styles?.centerPanel()}>
        {/* Top Bar */}
        <Box sx={styles?.topBar()}>
          <Typography sx={styles?.selectedModelName()}>{currentModel?.name || 'Select a model'}</Typography>
          <Chip label={currentModel?.provider || ''} size="small" sx={styles?.providerChip()} />
        </Box>

        {/* Chat Content */}
        {messages.length === 0 ? (
          <Box sx={styles?.welcomeContainer()}>
            <Avatar sx={styles?.botAvatar()}>
              <SmartToyIcon sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Typography sx={styles?.welcomeHeading()}>
              Hello! I&apos;m {currentModel?.name || 'your AI assistant'} 👋
            </Typography>
            <Typography sx={styles?.welcomeSubtitle()}>I can help you with...</Typography>
            <Box sx={styles?.suggestedPromptsBox()}>
              {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
                <Chip key={idx} label={prompt} onClick={() => setInputValue(prompt)} sx={styles?.suggestedPromptChip()} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={styles?.messagesContainer()}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={styles?.messageBox(msg.sender)}>
                <Typography sx={styles?.messageText(msg.sender)}>{msg.text}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Input Area */}
        <Box sx={styles?.inputAreaContainer()}>
          <Box sx={styles?.inputRow()}>
            <TextField
              fullWidth
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
              multiline
              maxRows={4}
              sx={styles?.chatInput()}
            />
            <Box sx={styles?.actionButtons()}>
              <IconButton size="small" sx={styles?.iconButton()}><MicIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={styles?.iconButton()}><AttachFileIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={styles?.iconButton()}><ImageIcon fontSize="small" /></IconButton>
              <IconButton size="small" sx={styles?.iconButton()}><ScreenShareIcon fontSize="small" /></IconButton>
              <Button variant="contained" onClick={handleSendMessage} sx={styles?.sendButton()}>Let&apos;s go</Button>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Detail Panel */}
      {currentModel && (
        <Box sx={styles?.rightPanel()}>
          <Box sx={styles?.detailCard()}>
            <Box sx={styles?.detailHeader()}>
              <Avatar sx={styles?.detailAvatar()}>{currentModel.emoji || '🤖'}</Avatar>
              <Box>
                <Typography sx={styles?.detailModelName()}>{currentModel.name}</Typography>
                <Typography sx={styles?.detailProvider()}>{currentModel.provider}</Typography>
              </Box>
            </Box>

            <Typography sx={styles?.detailDescription()}>{currentModel.description}</Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={styles?.statsGrid()}>
              <Box sx={styles?.statItem()}>
                <Typography sx={styles?.statLabel()}>Context Window</Typography>
                <Typography sx={styles?.statValue()}>{formatContext(currentModel.contextWindow)}</Typography>
              </Box>
              <Box sx={styles?.statItem()}>
                <Typography sx={styles?.statLabel()}>Price</Typography>
                <Typography sx={styles?.statValue()}>{modelToPrice(currentModel)}</Typography>
              </Box>
              <Box sx={styles?.statItem()}>
                <Typography sx={styles?.statLabel()}>Rating</Typography>
                <Box sx={styles?.ratingContainer()}>
                  <Rating value={currentModel.rating} readOnly size="small" precision={0.1} />
                  <Typography sx={styles?.ratingValue()}>{currentModel.rating?.toFixed(1)}★</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography sx={styles?.promptsTitle()}>Suggested Prompts</Typography>
              <Box sx={styles?.promptsList()}>
                {suggestedPrompts.map((prompt, idx) => (
                  <Chip key={idx} label={prompt} onClick={() => setInputValue(prompt)} sx={styles?.promptChip()} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatHubPage;
