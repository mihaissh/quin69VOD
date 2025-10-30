import { useState } from "react";
import { Drawer, ListItem, List, ListItemText, IconButton, Divider, Box, Link, ListItemIcon } from "@mui/material";
import { Icon } from "@iconify/react";

const mainLinks = [
  { title: `Vods`, path: `/vods`, icon: <Icon icon="mdi:video" width={24} style={{ color: '#8B5CF6' }} /> },
];

export default function DrawerComponent(props) {
  const { socials } = props;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box>
      <Drawer 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            minWidth: 250,
            background: (theme) => theme.palette.background.paper,
          }
        }}
      >
        <List sx={{ py: 1 }}>
          {mainLinks.map(({ title, path, icon }) => (
            <Box key={title}>
              <ListItem onClick={() => setDrawerOpen(false)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>
                  <Link color="primary" href={path}>
                    {title}
                  </Link>
                </ListItemText>
              </ListItem>
              <Divider />
            </Box>
          ))}
          <Divider />
          <Box sx={{ display: "flex", p: 2 }}>
            {socials.map(({ path, icon }) => (
              <Box key={path} sx={{ mr: 2 }}>
                <Link href={path} rel="noopener noreferrer" target="_blank">
                  {icon}
                </Link>
              </Box>
            ))}
          </Box>
        </List>
      </Drawer>
      <IconButton 
        onClick={() => setDrawerOpen(!drawerOpen)}
        size="small"
        aria-label="Open navigation menu"
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: "rgba(139, 92, 246, 0.1)",
          },
        }}
      >
        <Icon icon="mdi:menu" width={24} style={{ color: '#8B5CF6' }} />
      </IconButton>
    </Box>
  );
}
