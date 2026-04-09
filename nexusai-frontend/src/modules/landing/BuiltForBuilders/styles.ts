export const styles = {
  section: () => ({
    padding: '4rem 2.5rem',
    background: 'var(--bg)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  }),
  card: () => ({
    background: 'var(--white)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    transition: 'all 0.2s',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: 'var(--shadow)',
      borderColor: 'var(--accent-border)',
    },
  }),
  cardIcon: () => ({
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
  }),
  cardTitle: () => ({
    fontWeight: 600,
    marginBottom: '0.4rem',
    fontSize: '0.95rem',
    color: 'var(--text)',
    fontFamily: "'Instrument Sans', sans-serif",
  }),
  cardDesc: () => ({
    fontSize: '0.82rem',
    color: 'var(--text2)',
    lineHeight: 1.5,
  }),
};
