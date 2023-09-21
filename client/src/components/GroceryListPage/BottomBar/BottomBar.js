import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { dialogues, groceryListScopes, mobileWidth } from "../../../utils/enum";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SyncIcon from "@mui/icons-material/Sync";
import IosShareIcon from "@mui/icons-material/IosShare";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import { List, ListItemButton, ListItemAvatar } from "@mui/material";
import { Link } from "react-router-dom";
const BottomBar = ({
  setOpenDialogue,
  handleDeriveThemeColor,
  scope,
  handleSync,
  isEmptyList,
}) => {
  const [openShareTray, setOpenShareTray] = useState(false);

  // Handlers
  const handleSareWhatsappLink = () => {
    return `https://wa.me?text=${
      window.location.origin
    }/%23${window.location.hash.split("#")[1].split("&").join("%26")}`;
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
        justifyContent={"center"}
        sx={{
          boxShadow:
            "0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%)",
          borderRadius: "50px 50px 0px 0px",
          position: "fixed",
          bottom: 0,
          background: handleDeriveThemeColor().low,
          width: "100%",
          maxWidth: mobileWidth,
          height: "6vh",
        }}
      >
        {/* Sync List */}
        <IconButton sx={{ mr: 5 }} onClick={handleSync}>
          <SyncIcon sx={{ color: handleDeriveThemeColor().bold }} />
        </IconButton>

        {/* Share List */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: "50%",
            position: "relative",
            bottom: "3vh",
            background: handleDeriveThemeColor().low,
            width: 70,
            height: 65,
          }}
        >
          <Fab
            sx={{
              background: handleDeriveThemeColor().bold,
              color: "white",
              "&:hover": {
                background: handleDeriveThemeColor().bold,
                border: `2px solid ${handleDeriveThemeColor().bold}`,
              },
            }}
            onClick={() => setOpenDialogue(dialogues.addItem)}
          >
            <AddIcon />
          </Fab>
        </div>

        {/* Share List */}
        {scope === groceryListScopes.public ? (
          <IconButton sx={{ ml: 5 }}>
            <IosShareIcon
              sx={{ color: handleDeriveThemeColor().bold }}
              onClick={() => setOpenShareTray(!openShareTray)}
            />
          </IconButton>
        ) : (
          <IconButton
            disabled={isEmptyList}
            sx={{ ml: 5 }}
            size="small"
            variant="contained"
            onClick={() => setOpenDialogue(dialogues.resetList)}
          >
            <AutoDeleteOutlinedIcon
              sx={{ color: handleDeriveThemeColor().bold }}
            />
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
              style={{ textDecoration: "none", color: "black" }}
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
              style={{ textDecoration: "none", color: "black" }}
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
