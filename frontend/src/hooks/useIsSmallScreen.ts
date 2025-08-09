import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export const useIsSmallScreen = (): boolean => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};