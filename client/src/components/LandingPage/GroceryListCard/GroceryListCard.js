import { groceryContainerTypes, groceryListScopes, mobileWidth, radioGroupHelperTextObject } from "../../../utils/enum";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import MoreOptions from "./MoreOptions/MoreOptions";
import { Stack, Typography, Slide, Alert, Divider, ListItemButton } from "@mui/material";
import { useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// IMGS
import groceryWallpaper from "../../../utils/assets/groceryWallpaper.jpg";
import shoppingWallpaper from "../../../utils/assets/shoppingWallpaper.jpg";
import todoWallpaper from "../../../utils/assets/todoWallpaper.jpg";
import christmasWallpaper from "../../../utils/assets/christmasWallpaper.jpg";
import { Draggable } from "react-beautiful-dnd";

const GroceryListCard = ({ username, listInfo, activeContainer, setActiveContainer, index }) => {
  // States
  const [alertMessage, setAlertMessage] = useState(null);
  const [severity, setSeverity] = useState("info");

  // Other locals
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  // Handlers
  const handleNavigate = () => {
    if (listInfo?.scope === groceryListScopes.public) {
      const data = {
        containerId: location?.state?.containerId,
        listName: listInfo?.listName,
        listId: listInfo?.id,
      };
      navigate(`/list?containerId=${data.containerId}&listId=${data.listId}&scope=${listInfo?.scope}&name=${data.listName}`, { state: null });
    } else if (listInfo?.scope === groceryListScopes.restricted) {
      const data = {
        containerId: listInfo?.reference,
        listName: listInfo?.listName,
        listId: listInfo?.id,
        scope: listInfo?.scope,
      };
      navigate(`/list`, { state: data });
    } else {
      // private
      const data = {
        containerId: activeContainer?.id,
        listName: listInfo?.listName,
        listId: listInfo?.id,
        scope: listInfo?.scope,
      };
      navigate(`/list`, { state: data });
    }
  };

  const handleDeriveListScopeIcon = () => {
    if (listInfo?.scope === radioGroupHelperTextObject.private) {
      return <LockOutlinedIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === radioGroupHelperTextObject.public) {
      return <PublicIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === radioGroupHelperTextObject.public) {
      return <AdminPanelSettingsIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === groceryListScopes.restricted) {
      return <KeyIcon sx={{ fontSize: "15px" }} />;
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
      return listInfo?.listName.toUpperCase().includes("CHRISTMAS") ? christmasWallpaper : shoppingWallpaper;
    }
  };

  return (
    <Draggable draggableId={`${index}`} index={index}>
      {(provided) => (
        <ListItemButton disableRipple >
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={3}
            sx={{
              maxWidth: mobileWidth,
              borderRadius: 0,
              width: "96vw",
            }}
          >
            <Slide
              className="alert-slide"
              in={alertMessage && true}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
            >
              <Alert severity={severity}>
                <Typography>{alertMessage}</Typography>
              </Alert>
            </Slide>

            {/* All content */}
            <Stack p direction={"column"} sx={{ alignItems: "center" }}>
              <Stack width={"100%"} alignItems={"flex-end"}>
                <MoreOptions username={username} listInfo={listInfo} activeContainer={activeContainer} setActiveContainer={setActiveContainer} />
              </Stack>
              <div
                className="background-pic"
                onClick={handleNavigate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundImage: `url(${handleDeriveWallpaper()})`,
                  backgroundSize: "cover",
                  width: "95%",
                  height: 150,
                  borderRadius: "5px",
                  justifyContent: "center",
                  alignItems: "center",
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
              </div>
            </Stack>
          </Paper>
        </ListItemButton>
      )}
    </Draggable>
  );
};

export default GroceryListCard;
