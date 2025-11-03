import { memo, useState, useEffect, useRef, useMemo } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip, Avatar, Chip, Container, Slide, useMediaQuery } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import { Icon } from "@iconify/react";
import Drawer from "./drawer";
import { useResponsive } from "../hooks/useMediaQueries";
import { useTwitchStatus } from "../hooks/useTwitchStatus";
import { useLocation } from "react-router-dom";
import { alpha } from "@mui/material/styles";

const socials = [
  { path: `https://reddit.com/r/quin69`, icon: <Icon icon="mdi:reddit" width={24} style={{ color: '#FF4500' }} /> }, // Reddit Orange
  { path: `https://www.youtube.com/channel/UCGKQFbHWBL9SqYXH41ZMTkw`, icon: <Icon icon="mdi:youtube" width={24} style={{ color: '#FF0000' }} /> }, // YouTube Red
  {
    path: `https://discord.gg/rats`,
    icon: <Icon icon="mdi:discord" width={24} style={{ color: '#5865F2' }} />, // Discord Blurple
  },
  {
    path: `https://twitter.com/quinrex`,
    icon: <Icon icon="mdi:twitter" width={24} style={{ color: '#1DA1F2' }} />, // Twitter Blue
  },
  {
    path: `https://twitch.tv/quin69`,
    icon: <Icon icon="mdi:twitch" width={24} style={{ color: '#9146FF' }} />, // Twitch Purple
  },
  {
    path: `${process.env.REACT_APP_GITHUB}`,
    icon: <Icon icon="mdi:github" width={24} style={{ color: '#ffffff' }} />, // GitHub
  },
];

const SocialIcon = memo(({ path, icon, label }) => (
  <Tooltip title={label} arrow>
    <IconButton 
      component="a"
      href={path} 
      rel="noopener noreferrer" 
      target="_blank"
      size="small"
      aria-label={label}
      sx={{
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
        },
      }}
    >
      {icon}
    </IconButton>
  </Tooltip>
));

SocialIcon.displayName = 'SocialIcon';

// Hide on scroll component for mobile
function HideOnScroll({ children, enabled }) {
  const [show, setShow] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setShow(true);
      } 
      // Hide navbar when scrolling down and past threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      }
      
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  if (!enabled) return children;

  return (
    <Slide appear={false} direction="down" in={show}>
      {children}
    </Slide>
  );
}

export default function Navbar(props) {
  const { channel, twitchId } = props;
  const { isMobile, isTablet } = useResponsive();
  const showCompactNav = isMobile || isTablet;
  const { isLive, viewerCount } = useTwitchStatus(channel, twitchId);
  const location = useLocation();
  
  // Memoize URL calculations to avoid string operations on every render
  const logoUrlWebP = useMemo(() => `${process.env.PUBLIC_URL}/quin69.webp`, []);
  const logoUrlPng = useMemo(() => `${process.env.PUBLIC_URL}/quin69.png`, []);
  const twitchUrl = useMemo(() => `https://twitch.tv/${channel.toLowerCase()}`, [channel]);
  
  // Memoize VOD page check to avoid recalculating on every render
  const isVodPage = useMemo(() => 
    location.pathname.startsWith('/vods/') || 
    location.pathname.startsWith('/youtube/') || 
    location.pathname.startsWith('/live/') || 
    location.pathname.startsWith('/manual/') ||
    location.pathname.startsWith('/games/'),
    [location.pathname]
  );

  // Additional checks for mobile devices in both portrait and landscape
  // Portrait: max-width <= 900px catches most mobile devices
  // Landscape: (max-width <= 1024px AND max-height <= 700px) catches mobile devices in landscape
  // This ensures navbar is hidden on mobile even if breakpoint detection fails
  const isMobilePortrait = useMediaQuery('(max-width: 900px)');
  const isMobileLandscape = useMediaQuery('(max-width: 1024px) and (max-height: 700px) and (orientation: landscape)');
  
  // Hide navbar completely on mobile when watching VOD (both portrait and landscape)
  // Using both checks to ensure it works reliably across all mobile scenarios
  if (isVodPage && (isMobile || isMobilePortrait || isMobileLandscape)) {
    return null;
  }

  return (
    <Box sx={{ flexShrink: 0 }}>
      <HideOnScroll enabled={isMobile}>
        <AppBar 
          position={isMobile ? "sticky" : "static"}
          elevation={0}
          className="bg-zinc-800 border-b border-zinc-700 shadow-lg"
          sx={{
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            backgroundImage: "none !important",
            backgroundColor: "#27272a !important",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Container maxWidth="xl" disableGutters>
            <Toolbar disableGutters sx={{ 
              alignItems: "center",
              gap: { xs: 1, sm: 1.25, md: 1.5 }, 
              py: 0,
              px: { xs: 1, sm: 2 },
              minHeight: { xs: 48, sm: 56, md: 64 }
            }}>
            {/* Left Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.25, md: 2 }, flex: 1 }}>
              {showCompactNav && <Drawer socials={socials} />}

              <Tooltip title="View Twitch Channel" arrow placement="bottom">
                <CustomLink 
                  href={twitchUrl} 
                  rel="noopener noreferrer" 
                  target="_blank"
                  aria-label="Twitch Profile"
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={logoUrlWebP}
                      imgProps={{
                        onError: (e) => { e.target.src = logoUrlPng; }
                      }}
                      alt={`${channel} Profile`}
                      sx={{
                        width: { xs: 32, sm: 48, md: 56 },
                        height: { xs: 32, sm: 48, md: 56 },
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        border: isLive 
                          ? { xs: "2px solid #ff0000", sm: "2px solid #ff0000", md: "3px solid #ff0000" }
                          : { xs: "2px solid #34d399", sm: "2px solid #34d399", md: "3px solid #34d399" },
                        boxShadow: isLive 
                          ? { xs: "0 0 12px rgba(255, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)", sm: "0 0 20px rgba(255, 0, 0, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)" }
                          : "0 2px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          transform: "scale(1.1) rotate(5deg)",
                          boxShadow: isLive 
                            ? "0 0 30px rgba(255, 0, 0, 0.8), 0 6px 16px rgba(0, 0, 0, 0.4)"
                            : "0 4px 12px rgba(0, 0, 0, 0.3)",
                        },
                      }}
                    />
                    {isLive && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: { xs: -2, sm: -3 },
                          right: { xs: -2, sm: -3 },
                          width: { xs: 12, sm: 14, md: 16 },
                          height: { xs: 12, sm: 14, md: 16 },
                          borderRadius: "50%",
                          backgroundColor: "#ff0000",
                          border: "2px solid",
                          borderColor: "background.paper",
                          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                          "@keyframes pulse": {
                            "0%, 100%": {
                              opacity: 1,
                              transform: "scale(1)",
                            },
                            "50%": {
                              opacity: 0.7,
                              transform: "scale(1.2)",
                            },
                          },
                        }}
                      />
                    )}
                  </Box>
                </CustomLink>
              </Tooltip>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 0.25, sm: 0.5 }, minWidth: 0 }}>
                <CustomLink href="/" sx={{ textDecoration: "none" }}>
                  <Typography 
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "0.95rem", sm: "1.25rem", md: "1.5rem" },
                      background: (theme) => theme.palette.primary.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      transition: "none",
                    }}
                  >
                    {channel}
                  </Typography>
                </CustomLink>
                
                <Chip
                  icon={<Icon icon="mdi:circle" width={isMobile ? 7 : 9} />}
                  label={isLive ? `LIVE • ${viewerCount.toLocaleString()} viewers` : "Offline"}
                  size="small"
                  clickable={isLive}
                  component={isLive ? "a" : "div"}
                  href={isLive ? twitchUrl : undefined}
                  target={isLive ? "_blank" : undefined}
                  rel={isLive ? "noopener noreferrer" : undefined}
                  sx={{
                    height: { xs: 18, sm: 20, md: 22 },
                    fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
                    fontWeight: 700,
                    letterSpacing: { xs: "0.2px", sm: "0.3px", md: "0.5px" },
                    backgroundColor: isLive ? "rgba(255, 0, 0, 0.15)" : "rgba(128, 128, 128, 0.1)",
                    color: isLive ? "#ff0000" : "text.secondary",
                    border: isLive ? "1px solid rgba(255, 0, 0, 0.5)" : "1px solid rgba(128, 128, 128, 0.3)",
                    cursor: isLive ? "pointer" : "default",
                    transition: "none",
                    "& .MuiChip-icon": {
                      color: isLive ? "#ff0000" : "text.secondary",
                      marginLeft: { xs: "3px", sm: "4px", md: "5px" },
                    },
                    "& .MuiChip-label": {
                      padding: { xs: "0 5px", sm: "0 6px", md: "0 8px" },
                    },
                  }}
                />
              </Box>
              {/* Home Button removed on mobile */}
              {!showCompactNav && (
                <Tooltip title="Home" arrow>
                  <CustomLink href="/" sx={{ textDecoration: "none" }}>
                    <IconButton
                      size="medium"
                      sx={(theme) => ({
                        backgroundColor: alpha(theme.palette.primary.main, 0.12),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.2),
                          transform: "scale(1.05)",
                        },
                      })}
                      aria-label="Home"
                    >
                      <Icon icon="mdi:home" width={24} style={{ color: 'currentColor' }} />
                    </IconButton>
                  </CustomLink>
                </Tooltip>
              )}
            </Box>

            {/* Right Section - Social Icons */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: { xs: 0.75, sm: 1.25, md: 2 } }}>
              {/* Socials (no pill styling) */}
              {!showCompactNav && (
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <SocialIcon path={socials[0].path} icon={socials[0].icon} label="Reddit" />
                  <SocialIcon path={socials[1].path} icon={socials[1].icon} label="YouTube" />
                  <SocialIcon path={socials[2].path} icon={socials[2].icon} label="Discord" />
                  <SocialIcon path={socials[3].path} icon={socials[3].icon} label="Twitter" />
                  <SocialIcon path={socials[4].path} icon={socials[4].icon} label="Twitch" />
                  <SocialIcon path={socials[5].path} icon={socials[5].icon} label="GitHub" />
                </Box>
              )}
              
              {/* Removed separate GitHub Issues button; GitHub is now in socials */}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      </HideOnScroll>
    </Box>
  );
}
