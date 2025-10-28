import { useMediaQuery, useTheme } from "@mui/material";

/**
 * Custom hook for common media queries
 */
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isPortrait,
    prefersReducedMotion,
  };
};

