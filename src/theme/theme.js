import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

// Modern 2025 color palette - inspired by contemporary design trends
const colors = {
  primary: {
    main: "#8B5CF6", // Modern purple
    light: "#A78BFA",
    dark: "#7C3AED",
    gradient: `linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)`, // Purple to teal gradient
  },
  secondary: {
    main: "#14B8A6", // Modern teal
    light: "#2DD4BF",
    dark: "#0D9488",
  },
  background: {
    default: "#0A0A0B", // Deep black with subtle warmth
    paper: "#16161A",
    elevated: "#1E1E24",
  },
  text: {
    primary: "#F9FAFB",
    secondary: "#D1D5DB",
    disabled: grey[600],
  },
  success: {
    main: "#10B981",
  },
  error: {
    main: "#EF4444",
  },
  warning: {
    main: "#F59E0B",
  },
  accent: {
    purple: "#8B5CF6",
    teal: "#06B6D4",
    pink: "#EC4899",
  },
};

const createAppTheme = () => {
  let theme = createTheme({
    palette: {
      mode: "dark",
      ...colors,
    },
    shape: {
      borderRadius: 8,
    },
    typography: {
      // Modern system font stack - zero network requests, instant rendering
      fontFamily: [
        '-apple-system',           // iOS/macOS San Francisco
        'BlinkMacSystemFont',      // macOS San Francisco
        '"Segoe UI"',              // Windows
        '"SF Pro Display"',        // macOS (display)
        '"SF Pro Text"',           // macOS (text)
        '"Helvetica Neue"',        // Fallback
        'Arial',                   // Universal fallback
        'sans-serif',              // System fallback
      ].join(','),
      h1: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.005em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '0em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      body1: {
        letterSpacing: '-0.011em',
      },
      body2: {
        letterSpacing: '-0.006em',
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: `${grey[600]} ${colors.background.default}`,
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              width: 8,
              height: 8,
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: grey[600],
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
              backgroundColor: grey[500],
            },
            "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
              backgroundColor: colors.background.default,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            color: "white",
            backgroundImage: "none",
            backgroundColor: colors.background.paper,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: colors.background.paper,
            transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: `0 8px 24px rgba(0, 0, 0, 0.4)`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                "& > fieldset": {
                  borderColor: colors.primary.light,
                },
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: colors.background.paper,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
          },
        },
      },
    },
  });

  theme = responsiveFontSizes(theme);
  return theme;
};

export default createAppTheme;

