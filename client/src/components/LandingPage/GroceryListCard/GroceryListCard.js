import {
  PUBLIC_CODE,
  groceryContainerTypes,
  groceryListScopes,
  mobileWidth,
  radioGroupHelperTextObject,
} from "../../../utils/enum";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import MoreOptions from "./MoreOptions/MoreOptions";
import {
  Button,
  Stack,
  Typography,
  Slide,
  Alert,
  IconButton,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import KeyIcon from '@mui/icons-material/Key';
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  // Handlers
  const handleShowAlert = (severity, message) => {
    setAlertMessage(message);
    setSeverity(severity);
    setTimeout(() => setAlertMessage(null), 2000);
  };

  const handleNavigate = () => {
    if (listInfo?.scope === groceryListScopes.public) {
      const data = {
        containerId: extractContainerIdFromListId(),
        listName: listInfo?.listName,
        listId: listInfo?.id,
        cx: PUBLIC_CODE,
      };
      navigate(
        `/list?containerId=${data.containerId}&listId=${data.listId}&scope=${listInfo?.scope}`,
        { state: data }
      );
    } else if (listInfo?.scope === groceryListScopes.restricted) {
      const data = {
        containerId: extractContainerIdFromListId(),
        listName: listInfo?.listName,
        listId: listInfo?.id,
      };
      navigate(
        `/list?containerId=${data.containerId}&listId=${data.listId}&scope=${listInfo?.scope}`,
        { state: data }
      );
    } else {
      const data = {
        containerId: extractContainerIdFromListId(),
        listName: listInfo?.listName,
        listId: listInfo?.id,
      };
      navigate(
        `/list?containerId=${data.containerId}&listId=${data.listId}&scope=${listInfo?.scope}`,
        { state: data }
      );
    }
  };

  const handleDeriveListScopeIcon = () => {
    if (listInfo?.scope === radioGroupHelperTextObject.private) {
      return <LockOutlinedIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === radioGroupHelperTextObject.public) {
      return <PublicIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === radioGroupHelperTextObject.public) {
      return <AdminPanelSettingsIcon sx={{ fontSize: "15px"}} />;
    } else if (listInfo?.scope === groceryListScopes.restricted) {
      return <KeyIcon sx={{ fontSize: "15px" }} />
    } else {
      return "";
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

  const extractContainerIdFromListId = () => {
    return listInfo?.id.split(listInfo?.listName)[0];
  };

  return (
    <>
      <Grid item>
        <Paper
          sx={{
            paddingBottom: 4,
            maxWidth: mobileWidth,
            borderRadius: 0,
            height: "60vmin",
            width: "100vmin",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff",
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

          <Stack
            direction={"column"}
            sx={{
              alignItems: "flex-start",
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
              onClick={handleNavigate}
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "calc(2.5%)",
                backgroundImage: `url(${handleDeriveWallpaper()})`,
                backgroundSize: "cover",
                width: "95%",
                height: 150,
                borderRadius: "5px",
                justifyContent: "center",
                alignItems: "center",
                border: "0.8px solid lightgrey",
              }}
            >
              <Typography
                padding={1}
                sx={{
                  display: "flex",
                  zIndex: 1,
                  border: "1px solid #4B5563",
                  color: "#4B5563",
                  backdropFilter: "blur(5px)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                variant="overline"
              >
                {listInfo?.listName ? listInfo?.listName : "New List"}
                {handleDeriveListScopeIcon()}
              </Typography>

              <span style={{ height: "20%" }} />
            </div>

            <Stack
              direction={"row"}
              sx={{ width: "100%", justifyContent: "space-around" }}
            >
              {/* {listInfo?.people.length > 0 && (
                <AvatarGroup>
                  {listInfo?.people.map((e, i) => (
                    <Avatar
                      key={i}
                      sx={{ width: 40, height: 40 }}
                      alt={e.toUpperCase()}
                      src="/static/images/avatar/1.jpg"
                    />
                  ))}
                  <IconButton>+</IconButton>
                </AvatarGroup>
              )} */}

              {
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
              }

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
