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
  seeAll: () => ({
    fontSize: '0.82rem',
    color: 'var(--accent)',
    cursor: 'pointer',
    fontWeight: 500,
    background: 'none',
    border: 'none',
    fontFamily: "'Instrument Sans', sans-serif",
  }),
  grid: () => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '0.75rem',
  }),
  card: () => ({
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '1.25rem 1rem',
    cursor: 'pointer',
    textAlign: 'center' as const,
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: 'var(--accent-border)',
      background: 'var(--white)',
      boxShadow: 'var(--shadow)',
    },
  }),
  labIcon: () => ({
    fontSize: '1.8rem',
    marginBottom: '0.5rem',
  }),
  labName: () => ({
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: '0.9rem',
    color: 'var(--text)',
    marginBottom: '2px',
  }),
  labMeta: () => ({
    fontSize: '0.72rem',
    color: 'var(--text3)',
  }),
};
