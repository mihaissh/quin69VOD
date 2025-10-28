import { memo, useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip, Avatar, Chip, Container, Slide, useScrollTrigger } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import { Icon } from "@iconify/react";
import Drawer from "./drawer";
import { useResponsive } from "../hooks/useMediaQueries";
import { useTwitchStatus } from "../hooks/useTwitchStatus";
import { useLocation } from "react-router-dom";

const socials = [
  { path: `https://reddit.com/r/quin69`, icon: <Icon icon="mdi:reddit" width={24} style={{ color: '#8B5CF6' }} /> },
  { path: `https://www.youtube.com/channel/UCGKQFbHWBL9SqYXH41ZMTkw`, icon: <Icon icon="mdi:youtube" width={24} style={{ color: '#8B5CF6' }} /> },
  {
    path: `https://discord.gg/rats`,
    icon: <Icon icon="mdi:discord" width={24} style={{ color: '#8B5CF6' }} />,
  },
  {
    path: `https://twitter.com/quinrex`,
    icon: <Icon icon="mdi:twitter" width={24} style={{ color: '#8B5CF6' }} />,
  },
  {
    path: `https://twitch.tv/quin69`,
    icon: <Icon icon="mdi:twitch" width={24} style={{ color: '#8B5CF6' }} />,
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setShow(true);
      } 
      // Hide navbar when scrolling down and past threshold
      else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShow(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, enabled]);

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
  
  // Check if we're on a VOD page
  const isVodPage = location.pathname.startsWith('/vods/') || location.pathname.startsWith('/youtube/');

  const logoUrl = `${process.env.PUBLIC_URL}/quin69.png`;
  const twitchUrl = `https://twitch.tv/${channel.toLowerCase()}`;

  return (
    <Box sx={{ flexShrink: 0 }}>
      <HideOnScroll enabled={isMobile}>
        <AppBar 
          position={isMobile ? "sticky" : "static"}
          elevation={0}
          sx={{
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            background: (theme) => `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.elevated} 100%)`,
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              py: { xs: isVodPage ? 0.75 : 0.5, sm: 1 }, 
              minHeight: { xs: isVodPage ? 48 : 50, sm: 60, md: 72 } 
            }}>
            {/* Left Section */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.75, sm: 1.25, md: 2 }, flex: 1 }}>
              {showCompactNav && <Drawer socials={socials} />}

              {!isVodPage && (
                <>
                  <Tooltip title="View Twitch Channel" arrow placement="bottom">
                    <CustomLink 
                      href={twitchUrl} 
                      rel="noopener noreferrer" 
                      target="_blank"
                      aria-label="Twitch Profile"
                    >
                      <Box sx={{ position: "relative" }}>
                        <Avatar
                          src={logoUrl}
                          alt={`${channel} Profile`}
                          sx={{
                            width: { xs: 32, sm: 48, md: 56 },
                            height: { xs: 32, sm: 48, md: 56 },
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: isLive 
                              ? { xs: "2px solid #ff0000", sm: "2px solid #ff0000", md: "3px solid #ff0000" }
                              : { xs: "2px solid rgba(255, 255, 255, 0.1)", sm: "2px solid rgba(255, 255, 255, 0.1)", md: "3px solid rgba(255, 255, 255, 0.1)" },
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
                          transition: "all 0.2s ease",
                          "&:hover": {
                            letterSpacing: "0.02em",
                          },
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
                        transition: "all 0.2s ease-in-out",
                        "& .MuiChip-icon": {
                          color: isLive ? "#ff0000" : "text.secondary",
                          marginLeft: { xs: "3px", sm: "4px", md: "5px" },
                        },
                        "& .MuiChip-label": {
                          padding: { xs: "0 5px", sm: "0 6px", md: "0 8px" },
                        },
                        "&:hover": isLive ? {
                          backgroundColor: "rgba(255, 0, 0, 0.25)",
                          transform: "scale(1.05)",
                          boxShadow: "0 2px 8px rgba(255, 0, 0, 0.3)",
                        } : {},
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>

            {/* Right Section - Home, Social Icons + Issues */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: { xs: 0.75, sm: 1.25, md: 2 } }}>
              {/* Home Button */}
              <Tooltip title="Home" arrow>
                <CustomLink href="/" sx={{ textDecoration: "none" }}>
                  <IconButton
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(139, 92, 246, 0.2)",
                        transform: "scale(1.1)",
                        boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                      },
                    }}
                  >
                    <Icon icon="mdi:home" width={isMobile ? 20 : 24} style={{ color: '#8B5CF6' }} />
                  </IconButton>
                </CustomLink>
              </Tooltip>

              {!showCompactNav && (
                <Box sx={{ 
                  display: "flex", 
                  gap: 0.5,
                  p: 0.5,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}>
                  <SocialIcon path={socials[0].path} icon={socials[0].icon} label="Reddit" />
                  <SocialIcon path={socials[1].path} icon={socials[1].icon} label="YouTube" />
                  <SocialIcon path={socials[2].path} icon={socials[2].icon} label="Discord" />
                  <SocialIcon path={socials[3].path} icon={socials[3].icon} label="Twitter" />
                  <SocialIcon path={socials[4].path} icon={socials[4].icon} label="Twitch" />
                </Box>
              )}
              
              {!showCompactNav && (
                <CustomLink 
                  href={`${process.env.REACT_APP_GITHUB}/issues`} 
                  rel="noopener noreferrer" 
                  target="_blank"
                  sx={{ textDecoration: "none" }}
                >
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1,
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(139, 92, 246, 0.1)",
                    border: "1px solid rgba(139, 92, 246, 0.2)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(139, 92, 246, 0.2)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(139, 92, 246, 0.3)",
                    },
                  }}>
                    <Icon icon="mdi:alert-circle" width={20} style={{ color: '#8B5CF6' }} />
                    <Typography color="primary" variant="body2" sx={{ fontWeight: 600 }}>
                      Report Issue
                    </Typography>
                  </Box>
                </CustomLink>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      </HideOnScroll>
    </Box>
  );
}
