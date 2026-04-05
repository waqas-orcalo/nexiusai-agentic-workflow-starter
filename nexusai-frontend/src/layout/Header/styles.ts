export const styles = {
  appBar: (theme: any) => ({
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    color: 'text.primary',
  }),
  toolbar: () => ({
    justifyContent: 'space-between',
  }),
  leftSection: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  }),
  logo: () => ({
    fontWeight: 700,
    color: 'primary.main',
    fontSize: '1.25rem',
  }),
  avatar: () => ({
    width: 32,
    height: 32,
    bgcolor: 'primary.main',
    fontSize: '0.875rem',
  }),
};
