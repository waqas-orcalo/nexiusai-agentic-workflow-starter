'use client';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { styles } from './styles';

interface HeaderProps {
  onMenuToggle?: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  return (
    <AppBar position="fixed" sx={styles?.appBar(theme)} elevation={0}>
      <Toolbar sx={styles?.toolbar()}>
        <Box sx={styles?.leftSection()}>
          <IconButton onClick={onMenuToggle} edge="start"><MenuIcon /></IconButton>
          <Typography sx={styles?.logo()}>AAC Starter</Typography>
        </Box>
        <Box>
          <IconButton onClick={handleAvatarClick}>
            <Avatar sx={styles?.avatar()}>
              {user?.firstName?.[0] || 'U'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
