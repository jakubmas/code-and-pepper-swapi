import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Container,
} from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { useIsSmallScreen } from '@/hooks';

interface NavbarProps {
  onStartOver: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartOver, isResetting = false }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isSmallScreen = useIsSmallScreen();
  
  const handleStartOverClick = (): void => {
    setConfirmOpen(true);
  };
  
  const handleConfirm = (): void => {
    onStartOver();
    setConfirmOpen(false);
  };
  
  const handleCancel = (): void => {
    setConfirmOpen(false);
  };
  
  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0, sm: 2 } }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
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
          
          <Button
            color="inherit"
            startIcon={<RestartAlt />}
            onClick={handleStartOverClick}
            size={isSmallScreen ? 'small' : 'medium'}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              minWidth: { xs: 'auto', sm: 120 },
              px: { xs: 1, sm: 2 },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'inline' } }}>
              Start Over
            </Box>
            <Box sx={{ display: { xs: 'inline', sm: 'none' } }}>
              Reset
            </Box>
          </Button>
        </Toolbar>
        </Container>
        {isResetting && (
          <LinearProgress 
            color="secondary" 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0 
            }} 
          />
        )}
      </AppBar>
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancel}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">
          Start Over?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-dialog-description">
            This will reset all scores and start a new game. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" variant="contained" autoFocus>
            Start Over
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};