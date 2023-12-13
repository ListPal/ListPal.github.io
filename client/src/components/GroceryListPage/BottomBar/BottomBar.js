import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { colors, dialogues, groceryListScopes, mobileWidth } from "../../../utils/enum";
import IosShareIcon from "@mui/icons-material/IosShare";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AutoDeleteOutlinedIcon from "@mui/icons-material/AutoDeleteOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import UnpublishedOutlinedIcon from "@mui/icons-material/UnpublishedOutlined";
import { List, ListItemButton, ListItemAvatar, SpeedDial, SpeedDialAction } from "@mui/material";
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
  // States
  const [openShareTray, setOpenShareTray] = useState(false);
  // Hyper paramenters for the arched icons
  const d = 80;
  const r = `${d / 2}vmin`;
  const iconDiameter = 3;
  const iconRadius = iconDiameter / 2;
  const xOffset = 1;
  const yOffset = 1;

  // Handlers
  const handleSareWhatsappLink = () => {
    return `https://wa.me?text=${window.location.origin}/%23${window.location.hash
      .split("#")[1]
      .split("&")
      .join("%26")}`;
  };

  // Send over messaging system. This function manoipulates the string needed to send the link
  const handleMessageLink = () => {
    let url = window.location.href;
    url = url.split("&").join("%26");
    url = url.split(" ").join("%20");
    return `sms:?&body=${url}`;
  };

  // Icons passed to the SpeedDial
  const icons = [
    {
      icon: <AddIcon sx={{ fontSize: "1.5rem", color: colors[theme].generalColors.highlight }} />,
    },
    {
      icon: (
        <AttachMoneyOutlinedIcon
          sx={{ color: colors[theme]?.generalColors?.fontColor, fontSize: "1.5rem" }}
        />
      ),
    },
    {
      icon: showDone ? (
        <UnpublishedOutlinedIcon
          sx={{ color: colors[theme]?.generalColors?.fontColor, fontSize: "1.5rem" }}
        />
      ) : (
        <TaskAltOutlinedIcon
          sx={{ color: colors[theme]?.generalColors?.fontColor, fontSize: "1.5rem" }}
        />
      ),
    },
    {
      icon: (
        <AutoDeleteOutlinedIcon
          sx={{ color: colors[theme]?.generalColors?.fontColor, fontSize: "1.5rem" }}
        />
      ),
    },
  ];

  // Replace the show/hide checked items with the share list for public lists
  scope === groceryListScopes.public
    ? (icons[2] = {
        icon: (
          <IosShareIcon
            sx={{ color: colors[theme]?.generalColors?.fontColor, fontSize: "1.5rem" }}
          />
        ),
      })
    : (icons[2] = icons[2]);

  // Actions passed to the SpeedDial
  const onClicks = [
    () => setOpenDialogue(dialogues.addItem),
    () => setOpenDialogue(dialogues.sendMoney),
    scope === groceryListScopes.public
      ? () => setOpenShareTray(!openShareTray)
      : () => setShowDone(!showDone),
    () => setOpenDialogue(dialogues.resetList),
  ];

  /* 
  CSS positions for the arched icons in the SpeedDial. We use 
  trigonometric equations to determine the positions of the icons. We basically placed
  them equally distributed along the second quadrand of a circle centered in the lower corner of the screen
  with some r and d (i.e. radius and diameter) being determined as the hyper parameters above
  */
  const locs = [
    {
      position: "fixed",
      right: `calc(${r} * sin(0deg) + ${xOffset}rem)`,
      bottom: `calc(${r} * cos(0deg) - ${iconRadius}rem + ${yOffset}rem)`,
      width: `${iconDiameter}rem`,
      height: `${iconDiameter}rem`,
    },
    {
      position: "fixed",
      right: `calc(${r} * sin(32deg) - ${iconRadius}rem + ${xOffset}rem)`,
      bottom: `calc(${r} * cos(32deg) - ${iconRadius}rem + ${yOffset}rem)`,
      width: `${iconDiameter}rem`,
      height: `${iconDiameter}rem`,
    },
    {
      position: "fixed",
      right: `calc(${r} * sin(58deg) - ${iconRadius}rem + ${xOffset}rem)`,
      bottom: `calc(${r} * cos(58deg) - ${iconRadius}rem + ${yOffset}rem)`,
      width: `${iconDiameter}rem`,
      height: `${iconDiameter}rem`,
    },
    {
      position: "fixed",
      right: `calc(${r} * sin(90deg) - ${iconRadius}rem + ${xOffset}rem)`,
      bottom: `calc(${r} * cos(90deg) + ${yOffset}rem)`,
      width: `${iconDiameter}rem`,
      height: `${iconDiameter}rem`,
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial"
        icon={<SpeedDialIcon />}
        sx={{ position: "fixed", bottom: 40, right: 40 }}
        FabProps={{ style: { background: "black" } }}
        direction={"left"}
      >
        {icons.map((action, i) => (
          <SpeedDialAction
            key={i}
            icon={action.icon}
            FabProps={{ style: { background: colors[theme]?.generalColors?.innerBackground } }}
            onClick={onClicks[i]}
            sx={locs[i]}
          />
        ))}
      </SpeedDial>

      {/* Share List Tray */}
      {scope === groceryListScopes.public && (
        <SwipeableDrawer
          anchor={"bottom"}
          open={openShareTray}
          onOpen={() => setOpenShareTray(true)}
          onClose={() => setOpenShareTray(false)}
        >
          <List sx={{ height: "15vh", background: colors[theme].generalColors.innerBackground }}>
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
