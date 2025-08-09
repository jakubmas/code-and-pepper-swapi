import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { Home, History } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useIsSmallScreen } from '@/hooks';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isSmallScreen = useIsSmallScreen();
  
  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: 'none', sm: 'inline' },
                  }}
                >
                  ⚔️
                </Box>
                Star Wars Battle
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<Home />}
                size={isSmallScreen ? 'small' : 'medium'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Game
                </Box>
              </Button>
              
              <Button
                color="inherit"
                component={Link}
                to="/results"
                startIcon={<History />}
                size={isSmallScreen ? 'small' : 'medium'}
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  backgroundColor: location.pathname === '/results' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Results
                </Box>
              </Button>
            </Box>
        </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};