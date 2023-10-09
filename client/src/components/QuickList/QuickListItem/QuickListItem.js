import { useState } from "react";
import { truncateString } from "../../../utils/helper";
import {
  Button,
  Typography,
  Grid,
  Paper,
  Stack,
  SpeedDial,
} from "@mui/material";
import { mobileWidth, dialogues, dialogueObject, colors } from "../../../utils/enum";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import QuickDialogue from "../QuickDialogue/QuickDialogue";
import ItemDescription from "../../ItemDescription/ItemDescription";

const actions = [
  { icon: <DeleteIcon sx={{ color: "red" }} />, name: "Copy" },
  { icon: <EditIcon sx={{ color: colors.quickListColors.bold }} />, name: "Save" },
];

const QuickListItem = ({
  itemsArray,
  setItemsArray,
  item,
  openDialogue,
  setOpenDialogue,
  borderColor,
}) => {
  const [openItemDescrition, setOpenItemDescription] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(item?.checked);
  const [moreOrCloseButton, setMoreOrCloseButton] = useState(
    <MoreHorizIcon sx={{ color: colors.quickListColors.bold, position: "relative", right: 18 }} />
  );

  const handleOpenItemDescription = () => {
    if (item?.name.length > 30) {
      setOpenItemDescription(true);
      setIsActive(true);
    }
  };

  const openEditItemDialogue = () => {
    setOpenDialogue(dialogues.editItem);
    setIsActive(true);
  };

  const openDeleteItemDialogue = () => {
    setIsActive(true);
    setOpenDialogue(dialogues.deleteItem);
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  const onClicks = [openDeleteItemDialogue, openEditItemDialogue, null, null];

  return (
    <>
      <Grid item sx={{ maxWidth: mobileWidth }}>
        <Paper
          elevation={3}
          sx={{
            maxWidth: mobileWidth,
            width: "95vw",
            height: 80,
            opacity: 0.9,
            borderLeft: `5px solid black`,
          }}
        >
          <Stack
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
                  <CheckCircleIcon fontSize="large" sx={{ color: colors.quickListColors.bold }} />
                </Button>
              ) : (
                <Button disableRipple onClick={handleCheck}>
                  <RadioButtonUncheckedIcon
                    fontSize="large"
                    sx={{ color: colors.quickListColors.bold }}
                  />
                </Button>
              )}
              <Typography
                fontFamily={"Urbanist"}
                onClick={handleOpenItemDescription}
              >
                {item?.name && truncateString(item?.name, 30)}
              </Typography>
            </Stack>

            <SpeedDial
              ariaLabel="SpeedDial"
              direction={"left"}
              icon={moreOrCloseButton}
              onClose={() =>
                setMoreOrCloseButton(
                  <MoreHorizIcon
                    sx={{ color: colors.quickListColors.bold, position: "relative", right: 18 }}
                  />
                )
              }
              onOpen={() =>
                setMoreOrCloseButton(
                  <CloseIcon
                    sx={{ color: colors.quickListColors.bold, position: "relative", right: 18 }}
                  />
                )
              }
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
                  sx={{ color: colors.quickListColors.bold, position: "relative", right: 18 }}
                  key={action.name}
                  icon={action.icon}
                  onClick={onClicks[i]}
                />
              ))}
            </SpeedDial>
          </Stack>
        </Paper>
      </Grid>

      {openItemDescrition && isActive && (
        <ItemDescription
          setIsActive={setIsActive}
          item={item}
          openItemDescription={openItemDescrition}
          setOpenItemDescription={setOpenItemDescription}
          borderColor={borderColor}
        />
      )}

      {openDialogue && isActive && (
        <QuickDialogue
          setIsActive={setIsActive}
          itemsArray={itemsArray}
          setItemsArray={setItemsArray}
          dialogueObject={dialogueObject[openDialogue]}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
          item={item}
          listName={"Quick List"}
        />
      )}
    </>
  );
};

export default QuickListItem;
