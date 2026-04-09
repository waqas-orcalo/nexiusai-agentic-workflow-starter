export const styles = {
  footer: () => ({
    background: 'var(--text)',
    padding: '1.25rem 2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  }),
  brand: () => ({
    fontFamily: "'Syne', sans-serif",
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.9)',
  }),
  links: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  }),
  link: () => ({
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.8rem',
    marginLeft: '1.25rem',
    transition: 'color 0.2s',
    cursor: 'pointer',
    '&:hover': { color: 'rgba(255,255,255,0.9)' },
    textDecoration: 'none',
  }),
};
