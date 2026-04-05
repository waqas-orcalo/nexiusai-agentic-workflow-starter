export const styles = {
  container: () => ({
    padding: 3,
  }),

  headerBox: () => ({
    marginBottom: 4,
  }),

  headerTitle: () => ({
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginBottom: 0.5,
  }),

  headerSubtitle: () => ({
    fontSize: '1rem',
    color: '#5A5750',
    fontWeight: 500,
  }),

  // Featured Card
  featuredCard: () => ({
    background: 'linear-gradient(135deg, #FDF1EB 0%, #FDE8D8 100%)',
    border: '2px solid #C8622A',
    borderRadius: '16px',
    padding: 3,
    marginBottom: 6,
    position: 'relative',
    overflow: 'hidden',
  }),

  featuredBadge: () => ({
    display: 'inline-block',
    backgroundColor: 'rgba(255, 107, 53, 0.15)',
    padding: '8px 16px',
    borderRadius: '8px',
    marginBottom: 2,
  }),

  badgeText: () => ({
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#C8622A',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }),

  featuredContent: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),

  featuredHeader: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }),

  featuredAvatar: () => ({
    width: 60,
    height: 60,
    backgroundColor: 'rgba(200, 98, 42, 0.15)',
    fontSize: '2rem',
    fontWeight: 700,
  }),

  featuredName: () => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1C1A16',
  }),

  featuredProvider: () => ({
    fontSize: '0.9rem',
    color: '#5A5750',
    fontWeight: 500,
  }),

  featuredDescription: () => ({
    fontSize: '1rem',
    color: '#1C1A16',
    lineHeight: 1.6,
  }),

  featuredFooter: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 2,
  }),

  featuredStats: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  }),

  statGroup: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  }),

  statValue: () => ({
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#C8622A',
  }),

  usersCount: () => ({
    fontSize: '0.95rem',
    color: '#5A5750',
    fontWeight: 600,
  }),

  tryNowButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: '#C8622A',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#A34D1E',
    },
  }),

  // New Releases Section
  newReleasesSection: () => ({
    marginBottom: 6,
  }),

  sectionTitle: () => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginBottom: 2,
  }),

  categoriesScroll: () => ({
    display: 'flex',
    gap: 1,
    marginBottom: 3,
    overflowX: 'auto',
    paddingBottom: 1,
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(200, 98, 42, 0.3)',
      borderRadius: '4px',
      '&:hover': {
        backgroundColor: 'rgba(200, 98, 42, 0.5)',
      },
    },
  }),

  categoryChip: (isSelected: boolean = false) => ({
    fontWeight: 600,
    backgroundColor: isSelected ? '#C8622A' : 'transparent',
    color: isSelected ? '#FFFFFF' : '#1C1A16',
    border: isSelected ? 'none' : '1px solid rgba(0,0,0,0.12)',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: isSelected ? '#A34D1E' : 'rgba(200, 98, 42, 0.08)',
    },
    flexShrink: 0,
  }),

  modelCard: () => ({
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    height: '100%',
    position: 'relative',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  }),

  releaseTagRow: () => ({
    display: 'flex',
    justifyContent: 'flex-end',
    mb: 0.5,
  }),

  releaseTag: () => ({
    backgroundColor: 'rgba(200, 98, 42, 0.1)',
    color: '#C8622A',
    fontWeight: 700,
    fontSize: '0.7rem',
    border: 'none',
  }),

  categoryChipSmall: () => ({
    fontWeight: 600,
    backgroundColor: 'rgba(200, 98, 42, 0.08)',
    color: '#C8622A',
    fontSize: '0.75rem',
    border: 'none',
    mb: 0.5,
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

  // Rising Stars Section
  risingStarsSection: () => ({
    marginBottom: 4,
  }),

  trendingCard: () => ({
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      borderColor: '#C8622A',
    },
  }),

  trendingCardContent: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    padding: '20px',
  }),

  trendingHeader: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  }),

  trendingAvatar: () => ({
    width: 50,
    height: 50,
    borderRadius: '8px',
    backgroundColor: '#F4F2EE',
    fontSize: '1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  trendingInfo: () => ({
    flex: 1,
  }),

  trendingName: () => ({
    fontWeight: 700,
    fontSize: '1rem',
    color: '#1C1A16',
  }),

  trendingProvider: () => ({
    fontSize: '0.75rem',
    color: '#5A5750',
    fontWeight: 500,
  }),

  trendBadge: () => ({
    backgroundColor: 'rgba(200, 98, 42, 0.1)',
    padding: '12px',
    borderRadius: '8px',
  }),

  trendText: () => ({
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#C8622A',
  }),

  trendingButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    color: '#C8622A',
    borderColor: '#C8622A',
    '&:hover': {
      backgroundColor: 'rgba(200, 98, 42, 0.08)',
      borderColor: '#A34D1E',
    },
  }),
};
