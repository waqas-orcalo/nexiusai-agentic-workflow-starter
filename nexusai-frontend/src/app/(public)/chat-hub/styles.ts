export const styles = {
  wrapper: () => ({
    display: 'flex',
    height: 'calc(100vh - 60px)',
    overflow: 'hidden',
    backgroundColor: '#F4F2EE',
  }),

  // Left Panel
  leftPanel: () => ({
    width: 240,
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    padding: 2,
    gap: 2,
  }),

  searchInput: () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  }),

  modelsContainer: () => ({
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),

  groupHeader: () => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    color: '#5A5750',
    letterSpacing: '0.5px',
    marginBottom: 1,
  }),

  modelsList: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  }),

  modelItem: (theme: any, isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '10px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderLeft: isSelected ? '3px solid #C8622A' : '3px solid transparent',
    backgroundColor: isSelected ? 'rgba(200, 98, 42, 0.1)' : 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(200, 98, 42, 0.05)',
    },
  }),

  modelItemEmoji: () => ({
    fontSize: '1.25rem',
    minWidth: 24,
  }),

  modelItemName: () => ({
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#1C1A16',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  // Center Panel
  centerPanel: () => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid rgba(0,0,0,0.08)',
  }),

  topBar: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    padding: '16px 24px',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
  }),

  selectedModelName: () => ({
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1C1A16',
  }),

  providerChip: () => ({
    backgroundColor: 'rgba(200, 98, 42, 0.1)',
    color: '#C8622A',
    fontWeight: 600,
  }),

  // Welcome State
  welcomeContainer: () => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    padding: 3,
    textAlign: 'center',
  }),

  botAvatar: () => ({
    width: 80,
    height: 80,
    backgroundColor: '#FDF1EB',
    color: '#C8622A',
  }),

  welcomeHeading: () => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1C1A16',
  }),

  welcomeSubtitle: () => ({
    fontSize: '1rem',
    color: '#5A5750',
  }),

  suggestedPromptsBox: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    marginTop: 2,
  }),

  suggestedPromptChip: () => ({
    backgroundColor: '#FDF1EB',
    color: '#C8622A',
    fontWeight: 600,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F8D5BD',
    },
  }),

  // Messages
  messagesContainer: () => ({
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),

  messageBox: (sender: string) => ({
    display: 'flex',
    justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
  }),

  messageText: (sender: string) => ({
    maxWidth: '60%',
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: sender === 'user' ? '#C8622A' : '#F0F0F0',
    color: sender === 'user' ? '#FFFFFF' : '#1C1A16',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  }),

  // Input Area
  inputAreaContainer: () => ({
    padding: '24px',
    borderTop: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
  }),

  inputRow: () => ({
    display: 'flex',
    gap: 1,
    alignItems: 'flex-end',
  }),

  chatInput: () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
    },
  }),

  actionButtons: () => ({
    display: 'flex',
    gap: 1,
    alignItems: 'center',
  }),

  iconButton: () => ({
    color: '#5A5750',
    '&:hover': {
      backgroundColor: 'rgba(200, 98, 42, 0.08)',
      color: '#C8622A',
    },
  }),

  sendButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: '#C8622A',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#A34D1E',
    },
  }),

  // Right Panel
  rightPanel: () => ({
    width: 280,
    borderLeft: '1px solid rgba(0,0,0,0.08)',
    backgroundColor: '#FFFFFF',
    padding: 2,
    overflowY: 'auto',
  }),

  detailCard: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  }),

  detailHeader: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  }),

  detailAvatar: () => ({
    width: 50,
    height: 50,
    backgroundColor: '#F4F2EE',
    fontSize: '1.75rem',
  }),

  detailModelName: () => ({
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#1C1A16',
  }),

  detailProvider: () => ({
    fontSize: '0.75rem',
    color: '#5A5750',
    fontWeight: 500,
  }),

  detailDescription: () => ({
    fontSize: '0.85rem',
    color: '#5A5750',
    lineHeight: 1.4,
  }),

  statsGrid: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  }),

  statItem: () => ({
    padding: '12px',
    backgroundColor: '#F4F2EE',
    borderRadius: '8px',
  }),

  statLabel: () => ({
    fontSize: '0.75rem',
    color: '#5A5750',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),

  statValue: () => ({
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginTop: 0.5,
  }),

  ratingContainer: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    marginTop: 0.5,
  }),

  ratingValue: () => ({
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#C8622A',
  }),

  promptsTitle: () => ({
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#1C1A16',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 1,
  }),

  promptsList: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  }),

  promptChip: () => ({
    justifyContent: 'flex-start',
    backgroundColor: '#FDF1EB',
    color: '#C8622A',
    fontWeight: 500,
    fontSize: '0.8rem',
    '&:hover': {
      backgroundColor: '#F8D5BD',
    },
  }),
};
