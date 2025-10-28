import { Box, Skeleton, Grid } from "@mui/material";

/**
 * Loading skeleton for VOD cards
 */
export const VodCardSkeleton = ({ count = 6, gridSize = 2.1 }) => {
  return (
    <Grid container spacing={2} sx={{ mt: 1, justifyContent: "center" }}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={gridSize} key={index}>
          <Box sx={{ width: "100%" }}>
            {/* Thumbnail skeleton */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height={180}
              sx={{ borderRadius: 1, mb: 1 }}
              animation="wave"
            />
            {/* Title skeleton */}
            <Skeleton variant="text" width="90%" height={28} animation="wave" />
            {/* Date skeleton */}
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Loading skeleton for VOD player page
 */
export const VodPlayerSkeleton = () => {
  return (
    <Box sx={{ height: "100%", width: "100%", p: 2 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="60vh"
        sx={{ borderRadius: 1, mb: 2 }}
        animation="wave"
      />
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
      </Box>
      <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="50%" height={24} />
    </Box>
  );
};

/**
 * Generic loading skeleton
 */
export const GenericSkeleton = ({ rows = 5 }) => {
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={`${Math.random() * 30 + 60}%`}
          height={40}
          animation="wave"
          sx={{ mb: 1 }}
        />
      ))}
    </Box>
  );
};

export default VodCardSkeleton;

