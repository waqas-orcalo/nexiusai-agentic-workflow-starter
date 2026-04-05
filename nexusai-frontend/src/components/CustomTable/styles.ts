export const styles = {
  container: () => ({
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  }),
  headerCell: () => ({
    fontWeight: 700,
    color: 'text.secondary',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    py: 1.5,
  }),
  tableRow: () => ({
    '&:hover': { backgroundColor: 'action.hover' },
    cursor: 'pointer',
  }),
  emptyCell: () => ({
    textAlign: 'center',
    py: 6,
    color: 'text.secondary',
  }),
};
