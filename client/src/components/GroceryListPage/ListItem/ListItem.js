import {
  mobileWidth,
  colors,
  dialogues,
  groceryListScopes,
} from "../../../utils/enum";
import { useState } from "react";
import Dialogue from "../DialogueBox/Dialogue";
import EditIcon from "@mui/icons-material/Edit";
import PaidIcon from "@mui/icons-material/Paid";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { truncateString } from "../../../utils/helper";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Button,
  Typography,
  Grid,
  Paper,
  Stack,
  SpeedDial,
} from "@mui/material";

const actions = [
  { icon: <DeleteIcon sx={{ color: "red" }} />, name: "Copy" },
  { icon: <EditIcon sx={{ color: "black" }} />, name: "Save" },
  { icon: <PaidIcon sx={{ color: "black" }} />, name: "Print" },
];

const ListItem = ({
  identifier,
  listId,
  item,
  activeList,
  setActiveList,
  openDialogue,
  setOpenDialogue,
  activeContainer,
  setActiveContainer,
  borderColor,
  user,
  setUser,
}) => {
  // States
  const [checked, setChecked] = useState(item?.checked);
  const [active, setActive] = useState(false);

  // Handlers
  const handleDeriveOpenOrCloseIcon = () => {
    if (active) {
      return (
        <CloseIcon
          onClick={() => setActive(!active)}
          sx={{ color: "black", position: "relative", right: 18 }}
        />
      );
    } else {
      return (
        <MoreHorizIcon
          onClick={() => setActive(!active)}
          sx={{ color: "black", position: "relative", right: 18 }}
        />
      );
    }
  };

  const handleCheck = () => {
    // Mark items checked/unchecked
    const checkedItems = activeList?.groceryListItems.map((e) =>
      e.id === item?.id ? { ...e, checked: !e.checked } : e
    );

    // Update states
    setChecked(!checked);
    setActiveList({
      ...activeList,
      groceryListItems: checkedItems,
    });
  };

  const openEditItemDialogue = () => {
    setOpenDialogue(dialogues.editItem);
  };

  const openDeleteItemDialogue = () => {
    setOpenDialogue(dialogues.deleteItem);
  };

  const openSendMoneyDialogue = () => {
    setOpenDialogue(dialogues.sendMoney);
  };

  const onClicks = [
    openDeleteItemDialogue,
    openEditItemDialogue,
    openSendMoneyDialogue,
  ];

  return (
    <>
      <Grid
        item
        sx={{ maxWidth: `calc(${mobileWidth} - 20px`, positon: "relative" }}
      >
        {identifier && (
          <Typography
            variant="body2"
            sx={{
              textAlign: "left",
              ml: 1,
              pb: 1,
              // color: borderColor,
            }}
          >
            {`@${identifier}`}
          </Typography>
        )}

        <Paper
          elevation={3}
          sx={{
            maxWidth: mobileWidth,
            width: "95vw",
            height: 80,
            borderLeft: `5px solid ${
              borderColor ? borderColor : colors.landingPageColors.bold
            }`,
          }}
        >
          <Stack
            paddingLeft={1}
            paddingRight={1}
            direction={"row"}
            sx={{
              height: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Stack direction={"row"} sx={{ alignItems: "center" }}>
              {checked ? (
                <Button disableRipple onClick={handleCheck}>
                  <CheckCircleIcon
                    fontSize="large"
                    sx={{ color: borderColor ? borderColor : colors.landingPageColors.bold }}
                  />
                </Button>
              ) : (
                <Button disableRipple onClick={handleCheck}>
                  <RadioButtonUncheckedIcon
                    fontSize="large"
                    sx={{ color: borderColor ? borderColor : colors.landingPageColors.bold }}
                  />
                </Button>
              )}
              <Typography variant={"button"} sx={{ paddingLeft: 2 }}>
                {item?.name && truncateString(item?.name, 21)}
                {item?.quantity > 1 && ` (${item?.quantity})`}
              </Typography>
            </Stack>

            <SpeedDial
              ariaLabel="SpeedDial"
              direction={"left"}
              icon={handleDeriveOpenOrCloseIcon()}
              open={active}
              sx={{
                display: "flex",
                height: 35,
                width: 35,
                position: "relative",
                right: 0,
                top: 0,
              }}
            >
              {actions.map((action, i) => (
                <SpeedDialAction
                  sx={{ color: "black", position: "relative", right: 18 }}
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={onClicks[i]}
                />
              ))}
            </SpeedDial>
          </Stack>
        </Paper>
      </Grid>

      {openDialogue && active && (
        <Dialogue
          setUser={setUser}
          user={user}
          isPublic={activeList?.scope === groceryListScopes.public}
          item={item}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
          activeList={activeList}
          setActiveList={setActiveList}
          listId={listId}
          activeContainer={activeContainer}
          setActiveContainer={setActiveContainer}
        />
      )}
    </>
  );
};
export default ListItem;
