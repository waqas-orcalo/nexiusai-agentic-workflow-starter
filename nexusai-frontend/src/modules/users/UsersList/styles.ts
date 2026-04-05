export const styles = {
  wrapper: () => ({}),
  statusChip: (theme: any, status: string) => ({
    backgroundColor: status === 'active' ? theme?.palette?.success?.light : theme?.palette?.warning?.light,
    color: status === 'active' ? theme?.palette?.success?.dark : theme?.palette?.warning?.dark,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 24,
  }),
  actionCell: () => ({
    display: 'flex',
    gap: 0.5,
  }),
};
