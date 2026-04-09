export const styles = {
  wrapper: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    flexWrap: 'wrap' as const,
    justifyContent: 'center',
    marginTop: '1rem',
  }),
  stat: () => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  }),
  statValue: () => ({
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text)',
    lineHeight: 1.2,
  }),
  statLabel: () => ({
    fontSize: '0.78rem',
    color: 'var(--text3)',
  }),
};
