export const styles = {
  container: () => ({
    padding: 3,
  }),

  headerBox: () => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
    gap: 2,
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

  newAgentButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    borderColor: '#C8622A',
    color: '#C8622A',
    borderRadius: '8px',
    '&:hover': {
      borderColor: '#A34D1E',
      backgroundColor: 'rgba(200, 98, 42, 0.08)',
    },
  }),

  infoBanner: () => ({
    backgroundColor: '#FDF1EB',
    border: '1px solid rgba(200, 98, 42, 0.2)',
    borderRadius: '12px',
    padding: 2,
    marginBottom: 4,
  }),

  infoBannerText: () => ({
    fontSize: '0.95rem',
    color: '#1C1A16',
    fontWeight: 500,
    lineHeight: 1.6,
  }),

  infoBannerLink: () => ({
    color: '#C8622A',
    fontWeight: 700,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  }),

  templatesSection: () => ({
    marginBottom: 6,
  }),

  sectionTitle: () => ({
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1C1A16',
    marginBottom: 2.5,
  }),

  templateCard: (_selected?: boolean) => ({
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      transform: 'translateY(-4px)',
    },
  }),

  templateCardContent: () => ({
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    padding: '20px',
    flex: 1,
  }),

  templateHeader: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  }),

  templateEmoji: () => ({
    fontSize: '2rem',
    minWidth: 40,
  }),

  templateName: () => ({
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1C1A16',
  }),

  templateDesc: () => ({
    fontSize: '0.875rem',
    color: '#5A5750',
    lineHeight: 1.5,
  }),

  modelChip: () => ({
    backgroundColor: 'rgba(200, 98, 42, 0.1)',
    color: '#C8622A',
    fontWeight: 600,
    fontSize: '0.75rem',
  }),

  toolsList: () => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.75,
  }),

  toolChip: () => ({
    borderColor: 'rgba(0,0,0,0.12)',
    color: '#5A5750',
    fontWeight: 500,
    fontSize: '0.75rem',
  }),

  useTemplateButton: () => ({
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '8px',
    backgroundColor: '#C8622A',
    color: '#FFFFFF',
    marginTop: 'auto',
    '&:hover': {
      backgroundColor: '#A34D1E',
    },
  }),

  quickTasksSection: () => ({
    marginTop: 6,
  }),

  tasksList: () => ({
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' },
    gap: 2,
  }),

  taskItem: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '16px 20px',
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    color: '#1C1A16',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#C8622A',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      backgroundColor: '#FDF1EB',
    },
  }),

  taskText: () => ({
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1C1A16',
  }),

  taskArrow: () => ({
    fontSize: '1.25rem',
    color: '#C8622A',
    fontWeight: 700,
    marginLeft: 'auto',
  }),
};
