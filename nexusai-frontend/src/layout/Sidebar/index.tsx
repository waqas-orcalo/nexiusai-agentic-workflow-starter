'use client';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Toolbar, Box, Typography, Divider,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import { styles } from './styles';

const NAV_ITEMS = [
  { label: 'Dashboard', href: ROUTES.DASHBOARD, icon: <DashboardIcon /> },
  { label: 'Users', href: ROUTES.USERS.LIST, icon: <PeopleIcon /> },
  { label: 'Courses', href: ROUTES.COURSES.LIST, icon: <SchoolIcon /> },
];

interface SidebarProps {
  open?: boolean;
}

const Sidebar = ({ open = true }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <Drawer variant="permanent" sx={styles?.drawer()} open={open}>
      <Toolbar />
      <Box sx={styles?.logoSection()}>
        <Typography sx={styles?.logoText()}>Air Apple Cart</Typography>
        <Typography variant="caption" color="text.secondary">Starter Project</Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                sx={{ ...styles?.navItem(), ...(isActive ? styles?.activeItem() : styles?.inactiveItem()) }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
