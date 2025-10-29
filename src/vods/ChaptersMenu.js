import { Box, Tooltip } from "@mui/material";

export default function Chapters(props) {
  const { game } = props;

  return (
    <Box sx={{ pr: 1 }}>
      <Tooltip title={game.game_name}>
        <img alt={game.game_name || "Game"} loading="lazy" decoding="async" width="40" height="53" src={getImage(game.chapter_image)} style={{ width: "40px", height: "53px" }} />
      </Tooltip>
    </Box>
  );
}

//Support older vods that had {width}x{height} in the link
const getImage = (link) => {
  if (!link) return "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg";
  return link.replace("{width}x{height}", "40x53");
};
