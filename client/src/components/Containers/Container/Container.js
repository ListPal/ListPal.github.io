import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { mobileWidth } from "../../../utils/enum";

const Container = ({ heading, imgSrc, id }) => {
  const navigate = useNavigate();

  const handleClickContainer = () => {
    navigate(`/container`, { state: { containerId: id} });
  };

  return (
    <Grid padding={0.5}>
      <Card
        elevation={2}
        sx={{ width: "100vw", height: "30vh", maxWidth: mobileWidth }}
      >
        <CardActionArea onClick={handleClickContainer}>
          <CardContent>
            <Typography variant="h6" fontFamily={'Urbanist'} fontWeight={400} sx={{ position: "absolute" }}>
              {heading}
            </Typography>
            <CardMedia>
              <img
                alt="decorative-card"
                src={imgSrc}
                loading="lazy"
                height={300}
                width={350}
              />
            </CardMedia>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Container;
