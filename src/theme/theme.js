import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import themeColors from "./colors";

// Theme palette derived from CSS variables map (Tailwind zinc + accents)
const colors = {
  primary: {
    main: themeColors.emerald[500],
    light: themeColors.emerald[400],
    dark: themeColors.emerald[700],
    gradient: `linear-gradient(135deg, ${themeColors.emerald[500]} 0%, ${themeColors.cyan[500]} 100%)`,
  },
  secondary: {
    main: themeColors.cyan[500],
    light: themeColors.blue[500],
    dark: themeColors.neutral[800],
  },
  background: {
    default: themeColors.zinc[900],
    paper: themeColors.zinc[800],
    elevated: themeColors.zinc[800],
  },
  text: {
    primary: themeColors.zinc[100],
    secondary: themeColors.zinc[400],
    disabled: grey[600],
  },
  success: { main: themeColors.green[600] },
  error: { main: themeColors.red[400] },
  warning: { main: themeColors.rose[500] },
  accent: {
    teal: themeColors.cyan[500],
    blue: themeColors.blue[500],
    emerald: themeColors.emerald[500],
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

