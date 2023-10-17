import { Box, IconButton, CircularProgress } from "@mui/material";
import BlurOnOutlinedIcon from "@mui/icons-material/BlurOnOutlined";

const Loading = ({color, icon}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "calc(50% - 10px)",
        left: "calc(50% - 10px)",
        zIndex: 10,
      }}
    >
      <CircularProgress sx={{ color: color, position: "absolute" }} />
      <IconButton>
        {icon || <BlurOnOutlinedIcon sx={{ color: color }} />}
      </IconButton>
    </Box>
  );
};

export default Loading;
