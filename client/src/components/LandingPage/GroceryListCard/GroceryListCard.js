import {
  colors,
  groceryContainerTypes,
  groceryListScopes,
  mobileWidth,
} from "../../../utils/enum";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import MoreOptions from "./MoreOptions/MoreOptions";
import { Stack, Typography, Slide, Alert, ListItem } from "@mui/material";
import { useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// IMGS
import groceryWallpaper from "../../../assets/groceryWallpaper.jpg";
import shoppingWallpaper from "../../../assets/shoppingWallpaper.jpg";
import todoWallpaper from "../../../assets/todoWallpaper.jpg";
import christmasWallpaper from "../../../assets/christmasWallpaper.jpg";
import thanksGivingWallpaper from "../../../assets/thanksGivingWallpaper.jpg";
import { Draggable } from "react-beautiful-dnd";

const GroceryListCard = ({ username, listInfo, activeContainer, setActiveContainer, index, theme }) => {
  // States
  const [alertMessage, setAlertMessage] = useState(null);
  const [severity, setSeverity] = useState("info");

  // Other locals
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers
  const handleNavigate = () => {
    if (listInfo?.scope === groceryListScopes.public) {
      const data = {
        containerId: location?.state?.containerId,
        listName: listInfo?.listName,
        listId: listInfo?.id,
      };
      navigate(
        `/list?containerId=${data.containerId}&listId=${data.listId}&scope=${listInfo?.scope}&name=${data.listName}`,
        { state: null }
      );
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
    if (listInfo?.scope === groceryListScopes.private) {
      return <LockOutlinedIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === groceryListScopes.public) {
      return <PublicIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === groceryListScopes.public) {
      return <AdminPanelSettingsIcon sx={{ fontSize: "15px" }} />;
    } else if (listInfo?.scope === groceryListScopes.restricted) {
      return <KeyIcon sx={{ fontSize: "15px" }} />;
    } else {
      return <></>;
    }
  };

  const handleDeriveWallpaper = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return listInfo?.listName.toUpperCase().includes("THANK")
        ? thanksGivingWallpaper
        : groceryWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return todoWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return listInfo?.listName.toUpperCase().includes("CHRISTMAS")
        ? christmasWallpaper
        : shoppingWallpaper;
    }
  };

  return (
    <Draggable draggableId={`${index}`} index={index}>
      {(provided) => (
        <ListItem>
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={0}
            sx={{
              maxWidth: mobileWidth,
              borderRadius: 0,
              width: "100vw",
              boxShadow: "0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)",
            }}
          >
            <Slide
              in={alertMessage && true}
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              <Alert severity={severity}>
                <Typography>{alertMessage}</Typography>
              </Alert>
            </Slide>

            {/* All content */}
            <Stack p direction={"column"} sx={{ alignItems: "center" }}>
              <Stack width={"100%"} alignItems={"flex-end"}>
                <MoreOptions
                  username={username}
                  listInfo={listInfo}
                  activeContainer={activeContainer}
                  setActiveContainer={setActiveContainer}
                />
              </Stack>
              <div
                className="background-pic"
                onClick={handleNavigate}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: theme,
                  backgroundImage: `url(${handleDeriveWallpaper()})`,
                  backgroundSize: "cover",
                  width: "100%",
                  height: '20vh',
                  maxHeight: 150,
                  borderRadius: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  padding={1}
                  fontFamily={"Urbanist"}
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
        </ListItem>
      )}
    </Draggable>
  );
};

export default GroceryListCard;
