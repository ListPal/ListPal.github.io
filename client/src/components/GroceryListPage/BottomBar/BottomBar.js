import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { colors, dialogues, groceryListScopes, mobileWidth } from "../../../utils/enum";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import IosShareIcon from "@mui/icons-material/IosShare";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import { List, ListItemButton, ListItemAvatar } from "@mui/material";
import { Link } from "react-router-dom";

const BottomBar = ({
  setOpenDialogue,
  handleDeriveThemeColor,
  scope,
  handleSync,
  isEmptyList,
  showDone,
  setShowDone,
  theme,
}) => {
  const [openShareTray, setOpenShareTray] = useState(false);

  // Handlers
  const handleSareWhatsappLink = () => {
    return `https://wa.me?text=${window.location.origin}/%23${window.location.hash
      .split("#")[1]
      .split("&")
      .join("%26")}`;
  };

  const handleMessageLink = () => {
    let url = window.location.href;
    url = url.split("&").join("%26");
    url = url.split(" ").join("%20");
    return `sms:?&body=${url}`;
  };

  return (
    <>
      <Stack
        pb
        zIndex={100}
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        sx={{
          boxShadow:
            "0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%)",
          // borderRadius: "50px 50px 0px 0px",
          position: "fixed",
          bottom: 0,
          backgroundColor: colors[theme]?.generalColors.innerBackground,
          width: "100%",
          maxWidth: mobileWidth,
          height: "6vh",
        }}
      >
        {/* Add Item */}
        <IconButton onClick={() => setOpenDialogue(dialogues.addItem)}>
          <AddIcon
            fontSize={"large"}
            sx={{ color: colors[theme]?.generalColors.fontColor }}
          ></AddIcon>
        </IconButton>

        {/* Send/Receive $*/}
        <IconButton sx={{ ml: 1 }} onClick={() => setOpenDialogue(dialogues.sendMoney)}>
          <AttachMoneyOutlinedIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
        </IconButton>

        {/*  Show/Hide checked */}
        <IconButton sx={{ ml: 2 }} onClick={() => setShowDone(!showDone)}>
          {showDone && (
            <TaskAltOutlinedIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
          )}
          {!showDone && (
            <UnpublishedOutlinedIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
          )}
        </IconButton>

        {/* Share List */}
        {scope === groceryListScopes.public ? (
          <IconButton sx={{ ml: 2, mr: 2 }} onClick={() => setOpenShareTray(!openShareTray)}>
            <IosShareIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
          </IconButton>
        ) : (
          <IconButton
            disabled={isEmptyList}
            sx={{ ml: 2, mr: 2 }}
            size="small"
            variant="contained"
            onClick={() => setOpenDialogue(dialogues.resetList)}
          >
            <AutoDeleteOutlinedIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
          </IconButton>
        )}
      </Stack>

      {/* Share List Tray */}
      {scope === groceryListScopes.public && (
        <SwipeableDrawer
          anchor={"bottom"}
          open={openShareTray}
          onOpen={() => setOpenShareTray(true)}
          onClose={() => setOpenShareTray(false)}
        >
          <List sx={{ height: "15vh" }}>
            <Link
              to={handleSareWhatsappLink()}
              style={{ textDecoration: "none", color: colors[theme]?.generalColors.fontColor }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <WhatsAppIcon color="success" />
                </ListItemAvatar>
                WhatsApp
              </ListItemButton>
            </Link>

            <Link
              to={handleMessageLink()}
              style={{ textDecoration: "none", color: colors[theme]?.generalColors.fontColor }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <MapsUgcIcon />
                </ListItemAvatar>
                Message
              </ListItemButton>
            </Link>
          </List>
        </SwipeableDrawer>
      )}
    </>
  );
};

export default BottomBar;
