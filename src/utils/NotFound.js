import { styled, Typography } from "@mui/material";
import CustomLink from "./CustomLink";

const NotFound = styled((props) => {
  const { channel } = props;
  document.title = `Not Found - ${channel}`;
  return (
    <div {...props}>
      <img 
        src={`${process.env.PUBLIC_URL}/quin69.webp`} 
        alt="Logo" 
        loading="lazy" 
        decoding="async" 
        style={{ height: "auto", maxWidth: "200px" }}
        onError={(e) => { e.currentTarget.src = `${process.env.PUBLIC_URL}/quin69.png`; }}
      />
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
        <CustomLink href="/">
          <Typography variant="body2" color="textSecondary">
            Nothing over here..
          </Typography>
        </CustomLink>
      </div>
    </div>
  );
})`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default NotFound;
