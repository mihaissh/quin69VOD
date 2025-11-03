import { useCallback } from "react";
import { Box, Modal, Typography, TextField, InputAdornment, FormGroup, FormControlLabel, Checkbox, IconButton, Fade, Backdrop, Divider, SwipeableDrawer } from "@mui/material";
import { Icon } from "@iconify/react";
import { useDebouncedCallback } from "../hooks/useDebounce";
import { useResponsive } from "../hooks/useMediaQueries";

export default function Settings(props) {
  const { userChatDelay, setUserChatDelay, showModal, setShowModal, showTimestamp, setShowTimestamp, alternativeBg, setAlternativeBg } = props;
  const { isMobile } = useResponsive();

  const delayChange = useDebouncedCallback(
    useCallback((evt) => {
      if (evt.target.value.length === 0) return;
      const value = Number(evt.target.value);
      if (isNaN(value)) return;
      setUserChatDelay(value);
    }, [setUserChatDelay]),
    300
  );

  // Mobile: bottom sheet; Desktop: centered modal
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={showModal}
        onClose={() => setShowModal(false)}
        onOpen={() => {}}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            backgroundColor: "background.paper",
            maxHeight: "80vh",
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Icon icon="mdi:cog" width={20} />
              <Typography variant="subtitle1" fontWeight={700}>Chat Settings</Typography>
            </Box>
            <IconButton onClick={() => setShowModal(false)} size="small">
              <Icon icon="mdi:close" width={20} />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2, display: "grid", rowGap: 2 }}>
            <TextField
              inputProps={{ inputMode: "numeric", pattern: "[0-9-]*", step: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon icon="mdi:clock-outline" width={18} />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">s</InputAdornment>,
              }}
              fullWidth
              label="Chat delay"
              placeholder="0"
              type="number"
              onChange={delayChange}
              defaultValue={userChatDelay}
              onFocus={(evt) => evt.target.select()}
              helperText="Fix desync between video and chat"
              size="small"
            />

            <FormGroup>
              <FormControlLabel 
                control={<Checkbox checked={showTimestamp} onChange={() => setShowTimestamp(!showTimestamp)} />}
                label="Show timestamps"
              />
              <FormControlLabel 
                control={<Checkbox checked={alternativeBg} onChange={() => setAlternativeBg(!alternativeBg)} />}
                label="Alternate message backgrounds"
              />
            </FormGroup>
          </Box>
        </Box>
      </SwipeableDrawer>
    );
  }

  return (
    <Modal 
      open={showModal} 
      onClose={() => setShowModal(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: { backdropFilter: "blur(4px)" }
        },
      }}
    >
      <Fade in={showModal}>
        <Box sx={{ 
          position: "absolute", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          width: { xs: "92%", sm: 420 },
          maxWidth: 420,
          bgcolor: "background.paper", 
          borderRadius: 3,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h6" fontWeight={700}>Chat Settings</Typography>
            <IconButton onClick={() => setShowModal(false)} size="small">
              <Icon icon="mdi:close" width={20} />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ p: 2.5 }}>
            <Box sx={{ mb: 2 }}>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9-]*", step: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="mdi:clock-outline" width={20} style={{ color: "#8B5CF6" }} />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                fullWidth
                label="Chat delay"
                placeholder="0"
                type="number"
                onChange={delayChange}
                defaultValue={userChatDelay}
                onFocus={(evt) => evt.target.select()}
                helperText="Fix desync between video and chat"
              />
            </Box>

            <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel 
                control={<Checkbox checked={showTimestamp} onChange={() => setShowTimestamp(!showTimestamp)} />}
                label="Show timestamps"
              />
              <FormControlLabel 
                control={<Checkbox checked={alternativeBg} onChange={() => setAlternativeBg(!alternativeBg)} />}
                label="Alternate message backgrounds"
              />
            </FormGroup>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
