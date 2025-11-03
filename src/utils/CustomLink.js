import { styled, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const CustomLink = styled((props) => {
  const { href, to, ...otherProps } = props;
  const linkTo = to || href;
  
  // If it's an external link (starts with http or https), use regular MuiLink
  if (linkTo && (linkTo.startsWith('http://') || linkTo.startsWith('https://'))) {
    return <MuiLink href={linkTo} {...otherProps} />;
  }
  
  // For internal links, use RouterLink
  return <MuiLink component={RouterLink} to={linkTo} {...otherProps} />;
})`
  &:hover {
    opacity: 50%;
  }
`;

export default CustomLink;
