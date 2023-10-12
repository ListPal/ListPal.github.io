import { Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mobileWidth } from "../../../utils/enum";

const Container = ({ heading, imgSrc, id }) => {
  const navigate = useNavigate();

  const handleClickContainer = () => {
    navigate(`/container`, { state: { containerId: id } });
  };

  return (
    <Grid mb={2} sx={{}}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: "0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)",
          height: "30vh",
          width: "95vw",
          maxWidth: mobileWidth,
        }}
      >
        <CardActionArea onClick={handleClickContainer}>
          <CardContent>
            <Typography
              variant="h6"
              fontFamily={"Urbanist"}
              fontWeight={400}
              sx={{ position: "absolute" }}
            >
              {heading}
            </Typography>
            <CardMedia>
              <img alt="decorative-card" src={imgSrc} loading="lazy" height={'95%'} width={'95%'} />
            </CardMedia>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Container;
