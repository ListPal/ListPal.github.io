import { Typography, Grid, Card, CardContent, CardMedia, CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { colors, mobileWidth, themes } from "../../../utils/enum";
import GroceryDarkThemeIcon from "../../Icons/GroceryIcon";
import ShoppingDarkThemeIcon from "../../Icons/ShoppingIcon";

const Container = ({ heading, imgSrc, id, theme }) => {
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
          backgroundColor: colors[theme]?.generalColors.innerBackground,
        }}
      >
        <CardActionArea onClick={handleClickContainer}>
          <CardContent>
            <Typography
              variant="h6"
              color={colors[theme]?.generalColors.fontColor}
              fontFamily={"Urbanist"}
              fontWeight={400}
              sx={{ position: "absolute" }}
            >
              {heading}
            </Typography>
            <CardMedia sx={{ pt: 5 }}>
              {/* <img alt="decorative-card" src={imgSrc} loading="lazy" height={"95%"} width={"95%"} /> */}
              {imgSrc}
            </CardMedia>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Container;
