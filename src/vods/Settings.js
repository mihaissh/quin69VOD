import { useMemo } from "react";
import debounce from "lodash.debounce";
import { Box, Modal, Typography, TextField, InputAdornment, FormGroup, FormControlLabel, Checkbox, IconButton, Fade, Backdrop, Divider } from "@mui/material";
import { Icon } from "@iconify/react";

export default function Settings(props) {
  const { userChatDelay, setUserChatDelay, showModal, setShowModal, showTimestamp, setShowTimestamp, alternativeBg, setAlternativeBg } = props;

  const delayChange = useMemo(
    () =>
      debounce((evt) => {
        if (evt.target.value.length === 0) return;
        const value = Number(evt.target.value);
        if (isNaN(value)) return;
        setUserChatDelay(value);
      }, 300),
    [setUserChatDelay]
  );

  return (
    <Modal 
      open={showModal} 
      onClose={() => setShowModal(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
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
          width: { xs: "90%", sm: 420 },
          maxWidth: 420,
          bgcolor: "background.paper", 
          borderRadius: 3,
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.5)",
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}>
          {/* Header */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            p: 2.5,
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                background: "linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)",
              }}>
                <Icon icon="mdi:cog" width={22} color="white" />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                Playback Settings
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setShowModal(false)}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <Icon icon="mdi:close" width={20} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {/* Chat Delay */}
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ mb: 1.5, color: "text.primary" }}
              >
                Chat Synchronization
              </Typography>
              <TextField
                inputProps={{ inputMode: "numeric", pattern: "[0-9-]*" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon icon="mdi:clock-outline" width={20} style={{ color: "#8B5CF6" }} />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">seconds</InputAdornment>,
                }}
                fullWidth
                label="Chat Delay"
                placeholder="0"
                type="number"
                onChange={delayChange}
                defaultValue={userChatDelay}
                onFocus={(evt) => evt.target.select()}
                helperText="Adjust if chat messages appear out of sync with video"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* Display Options */}
            <Box>
              <Typography 
                variant="subtitle2" 
                fontWeight={600} 
                sx={{ mb: 1.5, color: "text.primary" }}
              >
                Display Options
              </Typography>
              <FormGroup sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={showTimestamp} 
                      onChange={() => setShowTimestamp(!showTimestamp)}
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  } 
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Icon icon="mdi:clock-time-four-outline" width={18} />
                      <Typography variant="body2">Show message timestamps</Typography>
                    </Box>
                  }
                  sx={{
                    m: 0,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid",
                    borderColor: showTimestamp ? "primary.main" : "divider",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "primary.main",
                    },
                  }}
                />
                <FormControlLabel 
                  control={
                    <Checkbox 
                      checked={alternativeBg} 
                      onChange={() => setAlternativeBg(!alternativeBg)}
                      sx={{
                        color: "primary.main",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  } 
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Icon icon="mdi:palette-outline" width={18} />
                      <Typography variant="body2">Alternate message backgrounds</Typography>
                    </Box>
                  }
                  sx={{
                    m: 0,
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid",
                    borderColor: alternativeBg ? "primary.main" : "divider",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "primary.main",
                    },
                  }}
                />
              </FormGroup>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
