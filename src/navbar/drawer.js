import { useState } from "react";
import { Drawer, IconButton, Box, Typography, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { alpha } from "@mui/material/styles";

const socialLabels = {
  'reddit.com': 'Reddit',
  'youtube.com': 'YouTube',
  'discord.gg': 'Discord',
  'twitter.com': 'Twitter',
  'twitch.tv': 'Twitch',
  'github.com': 'GitHub',
};

function getSocialLabel(path) {
  for (const [key, label] of Object.entries(socialLabels)) {
    if (path.includes(key)) return label;
  }
  return 'Social';
}

export default function DrawerComponent(props) {
  const { socials } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box>
      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        anchor="left"
        PaperProps={{
          sx: {
            width: { xs: '280px', sm: '360px' },
            background: (theme) => `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.elevated} 100%)`,
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 3,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: (theme) => theme.palette.primary.gradient || `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Social Links
            </Typography>
            <IconButton 
              onClick={() => setDrawerOpen(false)}
              size="small"
              sx={{
                color: "text.secondary",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: alpha("#8B5CF6", 0.1),
                  transform: "rotate(90deg)",
                },
              }}
            >
              <Icon icon="mdi:close" width={24} />
            </IconButton>
          </Box>

          {/* Social Icons Grid */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              justifyContent: "flex-start",
              alignContent: "flex-start",
            }}
          >
            {socials.map(({ path, icon }) => {
              const label = getSocialLabel(path);
              return (
                <Tooltip key={path} title={label} arrow placement="top">
                  <Box
                    component="a"
                    href={path}
                    rel="noopener noreferrer"
                    target="_blank"
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      textDecoration: "none",
                      color: "text.primary",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      width: "48px",
                      height: "48px",
                      "&:hover": {
                        backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.12),
                        borderColor: (theme) => alpha(theme.palette.primary.main, 0.3),
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        "& .social-icon": {
                          transform: "scale(1.15) rotate(5deg)",
                        },
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: (theme) => theme.palette.primary.gradient || `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        opacity: 0,
                        transition: "opacity 0.3s ease-in-out",
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      className="social-icon"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "& svg": {
                          width: "20px !important",
                          height: "20px !important",
                        },
                      }}
                    >
                      {icon}
                    </Box>
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Drawer>
      <IconButton 
        onClick={() => setDrawerOpen(!drawerOpen)}
        size="small"
        aria-label="Open navigation menu"
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.15),
            transform: "scale(1.1)",
          },
        }}
      >
        <Icon icon="mdi:menu" width={24} style={{ color: '#8B5CF6' }} />
      </IconButton>
    </Box>
  );
}
