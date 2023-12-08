import { colors, groceryContainerTypes, groceryListScopes, mobileWidth } from "../../../utils/enum";
import Paper from "@mui/material/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import MoreOptions from "./MoreOptions/MoreOptions";
import { Stack, Typography, Slide, Alert, ListItem, Card, List } from "@mui/material";
import { useState } from "react";
import KeyIcon from "@mui/icons-material/Key";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicIcon from "@mui/icons-material/Public";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
// IMGS
// import groceryWallpaper from "../../../assets/groceryWallpaper.jpg";
// import shoppingWallpaper from "../../../assets/shoppingWallpaper.jpg";
// import todoWallpaper from "../../../assets/todoWallpaper.jpg";
// import christmasWallpaper from "../../../assets/christmasWallpaper.jpg";
// import thanksGivingWallpaper from "../../../assets/thanksgiving.jpg";
// import shoppingWallpaperDarkTheme from "../../../assets/shoppingWallpaperDark.jpg";
// import christmasWallpaperDarkTheme from "../../../assets/christmasWallpaperDark.jpg";
import { Draggable } from "react-beautiful-dnd";
import CarrotIcon from "../../Icons/CarrotIcon";
import ChristmasTree from "../../Icons/ChristmasTree";
import ShoppingCart from "../../Icons/ShoppingCart";
import TodoIcon from "../../Icons/TodoIcon";

const GroceryListCard = ({
  username,
  listInfo,
  activeContainer,
  setActiveContainer,
  index,
  theme,
  themes,
}) => {
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
      return <CarrotIcon />;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return (
        <TodoIcon
          color={colors[themes].todoColors.icon}
          secondary={colors[themes].generalColors.fontColor}
        />
      );
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return listInfo?.listName.toUpperCase().includes("CHRISTMAS") ? (
        <ChristmasTree color={"#7b9370"} star={colors[themes].generalColors.highlight} />
      ) : (
        <ShoppingCart
          color={colors[themes].shoppingColors.icon}
          secondary={colors[themes].generalColors.highlight}
        />
      );
    }
  };

  // const handleDeriveWallpaper = () => {
  //   if (activeContainer?.containerType === groceryContainerTypes.grocery) {
  //     return listInfo?.listName.toUpperCase().includes("THANK")
  //       ? thanksGivingWallpaper
  //       : groceryWallpaper;
  //   }
  //   if (activeContainer?.containerType === groceryContainerTypes.todo) {
  //     return todoWallpaper;
  //   }
  //   if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
  //     if (themes === "darkTheme") {
  //       return listInfo?.listName.toUpperCase().includes("CHRISTMAS")
  //         ? christmasWallpaperDarkTheme
  //         : shoppingWallpaperDarkTheme;
  //     } else {
  //       return listInfo?.listName.toUpperCase().includes("CHRISTMAS")
  //         ? christmasWallpaper
  //         : shoppingWallpaper;
  //     }
  //   }
  // };

  return (
    <Draggable draggableId={`${index}`} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Paper
            elevation={0}
            sx={{
              maxWidth: mobileWidth,
              borderRadius: themes === "lightTheme" ? 0 : 2,
              width: "100vw",
              boxShadow: "0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)",
              backgroundColor: colors[themes].generalColors.innerBackground,
            }}
          >
            {/* All content */}
            <Stack p direction={"column"} sx={{ alignItems: "center" }}>
              <Stack width={"100%"} direction={"row"} justifyContent={"space-between"}>
                <Typography
                  fontFamily={"Urbanist"}
                  color={colors[themes].generalColors.fontColor}
                  variant={"h6"}
                >
                  {listInfo?.listName ? listInfo?.listName + "  " : "Unknown List"}
                  {handleDeriveListScopeIcon()}
                </Typography>
                <MoreOptions
                  theme={themes}
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
                  // backgroundImage: `url(${handleDeriveWallpaper()})`,
                  backgroundSize: "cover",
                  width: "100%",
                  height: "20vh",
                  borderRadius: "5px",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {handleDeriveWallpaper()}
              </div>
            </Stack>
          </Paper>
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
        </ListItem>
      )}
    </Draggable>
  );
};

export default GroceryListCard;
