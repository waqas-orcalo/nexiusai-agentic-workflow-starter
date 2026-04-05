export const styles = {
  wrapper: () => ({
    display: 'flex',
    height: 'calc(100vh - 60px)',
    overflow: 'hidden',
    backgroundColor: '#F4F2EE',
  }),

  // Left Sidebar
  leftSidebar: () => ({
    width: 220,
    borderRight: '1px solid rgba(0,0,0,0.08)',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    padding: 2,
  }),

  sidebarTitle: () => ({
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginBottom: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),

  labsList: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  }),

  labItem: (theme: any, isSelected: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: isSelected ? 'rgba(200, 98, 42, 0.1)' : 'transparent',
    borderLeft: isSelected ? '3px solid #C8622A' : '3px solid transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(200, 98, 42, 0.05)',
    },
  }),

  labEmoji: () => ({
    fontSize: '1.5rem',
    minWidth: 24,
  }),

  labInfo: () => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  }),

  labName: () => ({
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#1C1A16',
  }),

  labCount: () => ({
    fontSize: '0.75rem',
    color: '#5A5750',
  }),

  // Center Content
  centerContent: () => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 3,
    overflowY: 'auto',
  }),

  searchField: () => ({
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
    },
  }),

  categoriesContainer: () => ({
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
  }),

  categoryChip: (theme: any, isSelected: boolean) => ({
    fontWeight: 600,
    backgroundColor: isSelected ? '#C8622A' : 'transparent',
    color: isSelected ? '#FFFFFF' : '#1C1A16',
    border: isSelected ? 'none' : '1px solid rgba(0,0,0,0.12)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: isSelected ? '#A34D1E' : 'rgba(200, 98, 42, 0.08)',
    },
  }),

  modelCard: () => ({
    height: '100%',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  }),

  cardContent: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    padding: '20px',
  }),

  modelHeader: () => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
  }),

  modelAvatar: () => ({
    width: 40,
    height: 40,
    borderRadius: '8px',
    backgroundColor: '#F4F2EE',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  modelNameBox: () => ({
    flex: 1,
  }),

  modelName: () => ({
    fontWeight: 700,
    fontSize: '1rem',
    color: '#1C1A16',
    lineHeight: 1.3,
  }),

  modelProvider: () => ({
    fontSize: '0.75rem',
    color: '#5A5750',
    fontWeight: 500,
  }),

  modelDescription: () => ({
    fontSize: '0.875rem',
    color: '#5A5750',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }),

  modelFooter: () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    marginTop: 'auto',
  }),

  leftFooter: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flex: 1,
  }),

  priceChip: () => ({
    fontWeight: 600,
    fontSize: '0.75rem',
    borderColor: 'rgba(0,0,0,0.12)',
  }),

  ratingBox: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  }),

  ratingText: () => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#1C1A16',
  }),

  tryButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#C8622A',
    padding: '4px 12px',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: 'rgba(200, 98, 42, 0.08)',
    },
  }),

  // Right Sidebar
  rightSidebar: () => ({
    width: 220,
    borderLeft: '1px solid rgba(0,0,0,0.08)',
    overflowY: 'auto',
    backgroundColor: '#FFFFFF',
    padding: 2,
  }),

  filterHeader: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    marginBottom: 2,
  }),

  filterTitle: () => ({
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1C1A16',
  }),

  filterSection: () => ({
    marginBottom: 2.5,
    paddingBottom: 2.5,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    '&:last-child': {
      borderBottom: 'none',
    },
  }),

  filterSectionTitle: () => ({
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginBottom: 1,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),

  filterOptions: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  }),
};
