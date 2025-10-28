import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

/**
 * Animated container with fade-in effect
 */
export const FadeInBox = styled(Box)(({ theme, delay = 0 }) => ({
  animation: `fadeIn 0.5s ease-in-out ${delay}s both`,
  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(10px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

/**
 * Animated container with slide-in effect
 */
export const SlideInBox = styled(Box)(({ theme, direction = "left" }) => {
  const transforms = {
    left: "translateX(-20px)",
    right: "translateX(20px)",
    up: "translateY(-20px)",
    down: "translateY(20px)",
  };

  return {
    animation: "slideIn 0.4s ease-out both",
    "@keyframes slideIn": {
      from: {
        opacity: 0,
        transform: transforms[direction] || transforms.left,
      },
      to: {
        opacity: 1,
        transform: "translate(0, 0)",
      },
    },
  };
});

/**
 * Animated container with scale effect
 */
export const ScaleInBox = styled(Box)({
  animation: "scaleIn 0.3s ease-out both",
  "@keyframes scaleIn": {
    from: {
      opacity: 0,
      transform: "scale(0.95)",
    },
    to: {
      opacity: 1,
      transform: "scale(1)",
    },
  },
});

