import {
  PUBLIC_CODE,
  groceryContainerTypes,
  mobileWidth,
} from "../../../utils/enum";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import MoreOptions from "./MoreOptions/MoreOptions";
import { Button, Stack, Typography, Slide, Alert } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
// IMGS
import groceryWallpaper from "../../../utils/assets/card1.jpg";
import shoppingWallpaper from "../../../utils/assets/shoppingWallpaper.jpg";
import todoWallpaper from "../../../utils/assets/todoWallpaper.jpg";

const GroceryListCard = ({ listInfo, activeContainer, setActiveContainer }) => {
  // States
  const [alertMessage, setAlertMessage] = useState(null);
  const [severity, setSeverity] = useState("info");

  // Other locals
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);

  // Handlers
  const handleShowAlert = (severity, message) => {
    setAlertMessage(message);
    setSeverity(severity);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  const handleNavigate = () => {
    if (listInfo?.scope === "PUBLIC") {
      const data = {
        containerId: urlParams.get("containerId"),
        listName: listInfo?.listName,
        listId: listInfo?.id,
        cx: PUBLIC_CODE,
      };
      navigate(
        `/list?containerId=${data.containerId}&listId=${data.listId}&cx=${data.cx}`,
        { state: data }
      );
    } else {
      const data = {
        containerId: urlParams.get("containerId"),
        listName: listInfo?.listName,
        listId: listInfo?.id,
      };
      navigate(`/list?containerId=${data.containerId}&listId=${data.listId}`, {
        state: data,
      });
    }
  };

  const handleDeriveWallpaper = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return groceryWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return todoWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return shoppingWallpaper;
    }
  };
  return (
    <>
      <Grid item>
        <Paper
          sx={{
            maxWidth: mobileWidth,
            borderRadius: 0,
            height: "60vmin",
            width: "100vmin",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          }}
        >
          <Stack
            direction={"column"}
            sx={{
              justifyContent: "space-around",
              alignItems: "flex-start",
              padding: "8px",
            }}
            spacing={2}
          >
            <Slide
              className="alert-slide"
              in={alertMessage && true}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
              }}
            >
              <Alert severity={severity}>{alertMessage}</Alert>
            </Slide>
            <div
              className="background-pic"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "calc(2.5%)",

                backgroundImage: `url(${handleDeriveWallpaper()})`,
                backgroundSize: "cover",
                width: "95%",
                height: 150,
                borderRadius: "5px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack
                sx={{ width: "100%", justifyContent: "space-between" }}
                direction={"row"}
              >
                <span style={{ width: "10px" }} />
                <MoreOptions
                  listInfo={listInfo}
                  activeContainer={activeContainer}
                  setActiveContainer={setActiveContainer}
                />
              </Stack>

              <Typography
                padding={1}
                sx={{
                  zIndex: 1,
                  border: "1px solid #4B5563",
                  // fontSize: ,
                  color: "#4B5563",
                  backdropFilter: "blur(5px)",
                }}
                variant="overline"
              >
                {listInfo?.listName ? listInfo?.listName : "New List"}
              </Typography>

              <span style={{ height: "20%" }} />
            </div>

            <Stack
              direction={"row"}
              sx={{ width: "100%", justifyContent: "space-around" }}
            >
              {listInfo?.people.length > 0 &&
                listInfo?.people.map((e, i) => (
                  <AvatarGroup max={4}>
                    <Avatar
                      key={i}
                      sx={{ width: 40, height: 40 }}
                      alt="Remy Sharp"
                      src="/static/images/avatar/1.jpg"
                    />
                  </AvatarGroup>
                ))}

              {listInfo?.people.length === 0 && (
                <Button
                  onClick={() =>
                    handleShowAlert(
                      "info",
                      "Coming soon. This feature is still on the works."
                    )
                  }
                  endIcon={<PersonAddIcon />}
                  sx={{
                    "&:hover": { border: "2px solid black" },
                    borderRadius: 5,
                    border: "2px solid black",
                    color: "black",
                  }}
                  variant="outlined"
                >
                  Add People to List
                </Button>
              )}

              <Button
                onClick={handleNavigate}
                sx={{
                  "&:hover": { border: "2px solid black" },
                  borderRadius: 5,
                  border: "2px solid black",
                  color: "black",
                }}
                variant="outlined"
              >
                Open List
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Grid>
    </>
  );
};

export default GroceryListCard;
