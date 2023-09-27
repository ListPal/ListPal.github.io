import { mobileWidth, colors, dialogues, groceryListScopes, messages } from "../../../utils/enum";
import { useState } from "react";
import ItemDescription from "../../ItemDescription/ItemDescription";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { truncateString } from "../../../utils/helper";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Button, Typography, Paper, Stack, SpeedDial, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteItem, deletePublicItem } from "../../../utils/testApi/testApi";
import { Draggable } from "react-beautiful-dnd";

const actions = [
  { icon: <DeleteIcon sx={{ color: "red" }} />, name: "Delete item" },
  { icon: <EditIcon sx={{ color: "black" }} />, name: "Edit item" },
];

const ListItem = ({
  identifier,
  item,
  setItem,
  activeList,
  setActiveList,
  setOpenDialogue,
  borderColor,
  setAlertMessage,
  showDone = true,
  index,
}) => {
  // States
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openItemDescrition, setOpenItemDescription] = useState(false);
  const navigate = useNavigate();

  // Handlers
  const handleOpenItemDescription = () => {
    if (item?.name.length > 30) {
      setOpenItemDescription(true);
      setIsActive(true);
    }
  };

  const handleDeriveOpenOrCloseIcon = () => {
    if (isActive) {
      return <CloseIcon onClick={() => setIsActive(!isActive)} sx={{ color: "black", position: "relative", right: 18 }} />;
    } else {
      return <MoreHorizIcon onClick={() => setIsActive(!isActive)} sx={{ color: "black", position: "relative", right: 18 }} />;
    }
  };

  const handleCheck = (refactor = false) => {
    // Mark items checked/unchecked
    let listItems = activeList?.groceryListItems || [];
    const updatedItems = listItems.map((e) => (e.id === item?.id ? { ...e, checked: !e.checked } : e));

    if (!refactor) {
      // Sperate checked/unchcked items
      const uncheckedItems = updatedItems.filter((e) => !e.checked);
      const checkedItems = updatedItems.filter((e) => e.checked);
      listItems = [...uncheckedItems, ...checkedItems];
    } else {
      // Do not sperate checked/unchcked items
      listItems = updatedItems;
    }
    // Update states
    setChecked(!checked);
    setActiveList({
      ...activeList,
      groceryListItems: listItems,
    });
  };

  const openEditItemDialogue = () => {
    setOpenDialogue(dialogues.editItem);
    setItem(item);
  };

  const openSendMoneyDialogue = () => {
    setOpenDialogue(dialogues.sendMoney);
    setItem(item);
  };

  const handleDeleteItem = async () => {
    // Construct data to be sent
    const data = {
      containerId: activeList?.containerId,
      listId: activeList?.id,
      scope: activeList?.scope,
      itemId: item?.id,
    };

    // Send DELETE request to server
    const res = activeList?.scope === groceryListScopes.public ? await deletePublicItem(data) : await deleteItem(data);
    if (res?.status === 200) {
      // Update items state
      const previousItems = activeList?.groceryListItems.filter((e) => !(e.id === item?.id));
      setActiveList({ ...activeList, groceryListItems: previousItems });
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      setAlertMessage(messages.unauthorizedAccess);
    } else {
      setAlertMessage(messages.genericError);
    }
  };

  const onClicks = [handleDeleteItem, openEditItemDialogue, openSendMoneyDialogue];

  return (
    <>
      {((showDone && item?.checked) || !item?.checked) && (
        <ListItemButton disableRipple={true} sx={{ maxWidth: `calc(${mobileWidth} - 20px`, positon: "relative" }}>
          <Draggable draggableId={`${index}`} index={index}>
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                elevation={3}
                sx={{
                  transition: "all 0.2s",
                  background: item?.checked && "#F3F4F6",
                  maxWidth: mobileWidth,
                  width: "100%",
                  height: 80,
                  opacity: item?.checked && "100%",
                  color: item?.checked && "gray",
                  borderLeft: `5px solid ${borderColor ? borderColor : colors.landingPageColors.bold}`,
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
                    {item?.checked ? (
                      <Button disableRipple onClick={handleCheck}>
                        <CheckCircleIcon
                          fontSize="large"
                          sx={{
                            color: borderColor ? borderColor : colors.landingPageColors.bold,
                          }}
                        />
                      </Button>
                    ) : (
                      <Button disableRipple onClick={handleCheck}>
                        <RadioButtonUncheckedIcon
                          fontSize="large"
                          sx={{
                            color: borderColor ? borderColor : colors.landingPageColors.bold,
                          }}
                        />
                      </Button>
                    )}
                    <Typography sx={{ textDecorationLine: item?.checked && "line-through" }} onClick={handleOpenItemDescription} variant={"button"}>
                      {item?.name && truncateString(item?.name, 25)}
                      {item?.quantity > 1 && ` (${item?.quantity})`}
                    </Typography>
                  </Stack>

                  <SpeedDial ariaLabel="SpeedDial" direction={"left"} icon={handleDeriveOpenOrCloseIcon()} open={isActive} sx={{ height: 35, width: 35 }}>
                    {actions.map((action, i) => (
                      <SpeedDialAction sx={{ position: "relative", right: 18 }} key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={onClicks[i]} />
                    ))}
                  </SpeedDial>
                </Stack>
              </Paper>
            )}
          </Draggable>
        </ListItemButton>
      )}

      {openItemDescrition && isActive && (
        <ItemDescription setIsActive={setIsActive} item={item} openItemDescription={openItemDescrition} setOpenItemDescription={setOpenItemDescription} borderColor={borderColor} />
      )}
    </>
  );
};
export default ListItem;
