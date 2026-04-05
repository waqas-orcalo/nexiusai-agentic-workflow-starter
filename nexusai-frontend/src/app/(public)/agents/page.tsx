'use client';
import { useState } from 'react';
import {
  Box, Container, Typography, Button, Grid, Card, CardContent, Chip, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { styles } from './styles';
import { useGetAgentsListQuery } from '@/services/agents';

const QUICK_TASKS = [
  'Build a space exploration timeline app',
  'Create a real-time stock market tracker',
  'Prototype an AI chatbot demo application',
  'Create a project management Kanban board',
];

const AgentsPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { data, isLoading } = useGetAgentsListQuery({ page: 1, limit: 50 });
  const templates: any[] = data?.data?.data ?? data?.data?.items ?? [];

  return (
    <Container maxWidth="lg" sx={styles?.container()}>
      {/* Header */}
      <Box sx={styles?.headerBox()}>
        <Box>
          <Typography sx={styles?.headerTitle()}>🤖 Agent Builder</Typography>
          <Typography sx={styles?.headerSubtitle()}>Create powerful AI agents using any model.</Typography>
        </Box>
        <Button variant="outlined" startIcon={<AddIcon />} sx={styles?.newAgentButton()}>
          New Agent
        </Button>
      </Box>

      {/* Info Banner */}
      <Box sx={styles?.infoBanner()}>
        <Typography sx={styles?.infoBannerText()}>
          ✦ Not sure where to start? Chat with our AI guide — describe what you want to do and get a personalised setup plan.{' '}
          <Box component="span" sx={styles?.infoBannerLink()} onClick={() => {}}>
            Ask the Hub →
          </Box>
        </Typography>
      </Box>

      {/* Templates Grid */}
      <Box sx={styles?.templatesSection()}>
        <Typography sx={styles?.sectionTitle()}>Agent Templates</Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#C8622A' }} />
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {templates.map((template: any) => (
              <Grid item xs={12} sm={6} md={4} key={template._id}>
                <Card sx={styles?.templateCard(selectedTemplate === template._id)}>
                  <CardContent sx={styles?.templateCardContent()}>
                    {/* Emoji + Name */}
                    <Box sx={styles?.templateHeader()}>
                      <Typography sx={styles?.templateEmoji()}>{template.emoji || '🤖'}</Typography>
                      <Typography sx={styles?.templateName()}>{template.name}</Typography>
                    </Box>

                    {/* Description */}
                    <Typography sx={styles?.templateDesc()}>{template.description}</Typography>

                    {/* Model Chip */}
                    <Chip label={template.aiModelName || template.templateType} size="small" sx={styles?.modelChip()} />

                    {/* Tools */}
                    <Box sx={styles?.toolsList()}>
                      {(template.tools || []).map((tool: string) => (
                        <Chip key={tool} label={tool} size="small" variant="outlined" sx={styles?.toolChip()} />
                      ))}
                    </Box>

                    {/* Use Template Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      endIcon={<ArrowForwardIcon fontSize="small" />}
                      sx={styles?.useTemplateButton()}
                      onClick={() => setSelectedTemplate(template._id)}
                    >
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Quick Tasks Section */}
      <Box sx={styles?.quickTasksSection()}>
        <Typography sx={styles?.sectionTitle()}>Quick Tasks</Typography>
        <Box sx={styles?.tasksList()}>
          {QUICK_TASKS.map((task, idx) => (
            <Box key={idx} sx={styles?.taskItem()} onClick={() => {}}>
              <Typography sx={styles?.taskText()}>{task}</Typography>
              <Typography sx={styles?.taskArrow()}>→</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default AgentsPage;
