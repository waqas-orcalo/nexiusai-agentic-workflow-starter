export const styles = {
  section: () => ({
    padding: '4rem 2.5rem',
    background: 'var(--white)',
  }),
  inner: () => ({
    maxWidth: '1840px',
    margin: '0 auto',
  }),
  header: () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.75rem',
  }),
  title: () => ({
    fontFamily: "'Syne', sans-serif",
    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: 'var(--text)',
  }),
  grid: () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
    gap: '1rem',
  }),
  card: () => ({
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.25rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      boxShadow: 'var(--shadow)',
      borderColor: 'var(--accent-border)',
    },
  }),
  cardIcon: () => ({
    fontSize: '1.5rem',
    flexShrink: 0,
  }),
  cardBody: () => ({
    flex: 1,
  }),
  cardTitle: () => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'var(--text)',
    marginBottom: '0.25rem',
    fontFamily: "'Instrument Sans', sans-serif",
  }),
  cardModels: () => ({
    fontSize: '0.78rem',
    color: 'var(--text2)',
    lineHeight: 1.5,
    marginBottom: '0.5rem',
  }),
  cardCta: () => ({
    fontSize: '0.75rem',
    color: 'var(--accent)',
    fontWeight: 500,
  }),
};
