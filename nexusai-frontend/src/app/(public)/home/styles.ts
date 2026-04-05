export const styles = {
  wrapper: () => ({
    minHeight: '100vh',
    backgroundColor: '#F4F2EE',
  }),
  heroSection: () => ({
    pt: 8,
    pb: 4,
    px: 3,
    textAlign: 'center',
    maxWidth: 760,
    mx: 'auto',
  }),
  heroBadge: () => ({
    backgroundColor: 'rgba(0,0,0,0.06)',
    fontSize: '13px',
    mb: 3,
  }),
  heroHeading: () => ({
    fontSize: { xs: '40px', md: '72px' },
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#1C1A16',
    mb: 3,
  }),
  heroAccent: () => ({
    color: '#C8622A',
  }),
  heroSubtitle: () => ({
    fontSize: '16px',
    color: '#5A5750',
    maxWidth: 500,
    mx: 'auto',
    mb: 4,
  }),
  chatInputWrapper: () => ({
    backgroundColor: '#fff',
    borderRadius: '16px',
    border: '1px solid rgba(0,0,0,0.1)',
    p: 2,
    maxWidth: 700,
    mx: 'auto',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  }),
  chatInput: () => ({
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    fontSize: '15px',
  }),
  inputActions: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 1,
  }),
  inputIcons: () => ({
    display: 'flex',
    gap: 0.5,
    alignItems: 'center',
  }),
  inputIcon: () => ({
    color: '#5A5750',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  }),
  agentChip: () => ({
    fontSize: '12px',
    backgroundColor: 'rgba(200, 98, 42, 0.1)',
    color: '#C8622A',
  }),
  letsGoBtn: () => ({
    backgroundColor: '#C8622A',
    borderRadius: '20px',
    textTransform: 'none',
    px: 3,
    '&:hover': {
      backgroundColor: '#A34D1E',
    },
  }),
  actionCardsSection: () => ({
    py: 5,
    px: 3,
  }),
  actionCard: () => ({
    width: 110,
    height: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0.5,
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.08)',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    },
  }),
  cardEmoji: () => ({
    fontSize: '28px',
  }),
  cardLabel: () => ({
    fontSize: '12px',
    color: '#5A5750',
    textAlign: 'center',
  }),
  statsSection: () => ({
    display: 'flex',
    justifyContent: 'center',
    gap: 6,
    py: 4,
    borderTop: '1px solid rgba(0,0,0,0.08)',
  }),
  statItem: () => ({
    textAlign: 'center',
  }),
  statValue: () => ({
    fontSize: '32px',
    fontWeight: 800,
    color: '#1C1A16',
  }),
  statLabel: () => ({
    fontSize: '13px',
    color: '#9E9B93',
  }),
  footer: () => ({
    textAlign: 'center',
    py: 2,
  }),
  footerLink: () => ({
    color: '#9E9B93',
    fontSize: '13px',
    textDecoration: 'none',
    '&:hover': {
      color: '#5A5750',
    },
  }),
};
