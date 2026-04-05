const DRAWER_WIDTH = 240;

export const styles = {
  drawer: () => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: DRAWER_WIDTH,
      boxSizing: 'border-box',
      borderRight: '1px solid',
      borderColor: 'divider',
    },
  }),
  navItem: () => ({
    borderRadius: 1,
    mx: 1,
    mb: 0.5,
  }),
  activeItem: () => ({
    backgroundColor: 'primary.main',
    color: '#fff',
    '&:hover': { backgroundColor: 'primary.dark' },
    '& .MuiListItemIcon-root': { color: '#fff' },
  }),
  inactiveItem: () => ({
    '&:hover': { backgroundColor: 'action.hover' },
  }),
  logoSection: () => ({
    px: 2,
    py: 2,
  }),
  logoText: () => ({
    fontWeight: 700,
    color: 'primary.main',
  }),
};
