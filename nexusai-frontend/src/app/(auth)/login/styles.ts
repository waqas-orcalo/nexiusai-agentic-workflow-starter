export const styles = {
  container: () => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  }),
  paper: () => ({
    p: 4,
    maxWidth: 400,
    width: '100%',
    borderRadius: 2,
    boxShadow: '0 1px 8px rgba(0,0,0,0.12)',
  }),
  title: () => ({
    mb: 1,
    fontWeight: 700,
    textAlign: 'center',
  }),
  subtitle: () => ({
    mb: 3,
    color: 'text.secondary',
    textAlign: 'center',
    fontSize: '0.875rem',
  }),
  form: () => ({
    display: 'flex',
    flexDirection: 'column',
  }),
  submitButton: () => ({
    mt: 2,
    mb: 1,
  }),
};
