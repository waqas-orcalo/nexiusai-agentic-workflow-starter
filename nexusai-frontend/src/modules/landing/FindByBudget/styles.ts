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
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  }),
  card: () => ({
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': { boxShadow: 'var(--shadow-md)' },
  }),
  cardIcon: () => ({
    fontSize: '1.5rem',
    marginBottom: '0.75rem',
  }),
  cardTitle: () => ({
    fontWeight: 700,
    fontFamily: "'Syne', sans-serif",
    marginBottom: '0.4rem',
    fontSize: '1rem',
  }),
  cardDesc: () => ({
    fontSize: '0.82rem',
    color: 'var(--text2)',
    lineHeight: 1.5,
    marginBottom: '0.75rem',
  }),
  cardLink: () => ({
    fontSize: '0.78rem',
    fontWeight: 600,
  }),
};
