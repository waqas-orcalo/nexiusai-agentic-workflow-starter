export const styles = {
  wrapper: () => ({ minHeight: '100vh', backgroundColor: '#F4F2EE' }),
  appBar: () => ({
    backgroundColor: '#fff',
    color: '#1C1A16',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    zIndex: 1200,
  }),
  toolbar: () => ({
    maxWidth: '1280px',
    width: '100%',
    mx: 'auto',
    px: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '60px !important',
  }),
  logo: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    cursor: 'pointer',
  }),
  logoIcon: () => ({
    width: 30,
    height: 30,
    borderRadius: '8px',
    backgroundColor: '#C8622A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  logoText: () => ({
    fontWeight: 700,
    fontSize: '16px',
    color: '#1C1A16',
  }),
  navLinks: () => ({
    display: { xs: 'none', md: 'flex' },
    gap: 0.5,
  }),
  navLink: () => ({
    color: '#5A5750',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    '&:hover': {
      color: '#1C1A16',
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  }),
  navActions: () => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  }),
  langBtn: () => ({
    color: '#5A5750',
    fontSize: '14px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  }),
  signInBtn: () => ({
    color: '#1C1A16',
    borderColor: 'rgba(0,0,0,0.2)',
    fontSize: '14px',
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    '&:hover': {
      borderColor: '#1C1A16',
    },
  }),
  getStartedBtn: () => ({
    backgroundColor: '#C8622A',
    color: '#fff',
    fontSize: '14px',
    textTransform: 'none',
    borderRadius: '20px',
    px: 2,
    '&:hover': {
      backgroundColor: '#A34D1E',
    },
  }),
  content: () => ({
    pt: '60px',
  }),
};
