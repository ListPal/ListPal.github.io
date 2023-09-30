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
import {
  Button,
  Typography,
  Paper,
  Stack,
  SpeedDial,
  ListItemButton,
  ListItem,
  ListItemText,
  IconButton,
  ListItemAvatar,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteItem, deletePublicItem } from "../../../utils/testApi/testApi";
import { Draggable } from "react-beautiful-dnd";

const actions = [
  { icon: <DeleteIcon sx={{ color: "red" }} />, name: "Delete item" },
  { icon: <EditIcon sx={{ color: "#374151" }} />, name: "Edit item" },
];

const Listitem = ({
  identifier = "unknown",
  item,
  setItem,
  activeList,
  setActiveList,
  setOpenDialogue,
  borderColor = colors.landingPageColors.bold,
  setAlertMessage,
  provided,
  modifiedIds,
  setModifiedIds,
}) => {
  // States
  const [isActive, setIsActive] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openItemDescrition, setOpenItemDescription] = useState(false);
  const navigate = useNavigate();

  // Handlers
  const handleOpenItemDescription = () => {
    if (item?.name.length > 24) {
      setOpenItemDescription(true);
      setIsActive(true);
    }
  };

  const handleDeriveOpenOrCloseIcon = () => {
    if (isActive) {
      return (
        <CloseIcon
          onClick={() => setIsActive(!isActive)}
          sx={{ color: "#374151", position: "relative", right: 18 }}
        />
      );
    } else {
      return (
        <MoreHorizIcon
          onClick={() => setIsActive(!isActive)}
          sx={{ color: "#374151", position: "relative", right: 18 }}
        />
      );
    }
  };

  const handleCheck = () => {
    // Mark items checked/unchecked
    let listItems = activeList?.groceryListItems || [];
    const updatedItems = listItems.map((e) =>
      e.id === item?.id ? { ...e, checked: !e.checked } : e
    );

    // Do not sperate checked/unchcked items
    listItems = updatedItems;

    // Toggle modified state
    const updatedModifiedIdSet = modifiedIds;
    if (updatedModifiedIdSet.has(item?.id)) {
      updatedModifiedIdSet.delete(item?.id);
    } else {
      updatedModifiedIdSet.add(item?.id);
    }

    // Update states
    setChecked(!checked);
    setModifiedIds(updatedModifiedIdSet);
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
    const res =
      activeList?.scope === groceryListScopes.public
        ? await deletePublicItem(data)
        : await deleteItem(data);
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
      <ListItem
        sx={{
          mt: 1,
          background: item?.checked ? "#F3F4F6" : "white",
          borderLeft: `5px solid ${borderColor}`,
          height: 80,
          borderRadius: 1,
          boxShadow: "0 6.4px 14.4px 0 rgb(0 0 0 / 13%), 0 1.2px 3.6px 0 rgb(0 0 0 / 11%)",
        }}
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        secondaryAction={
          <SpeedDial
            ariaLabel="SpeedDial"
            direction={"left"}
            icon={handleDeriveOpenOrCloseIcon()}
            open={isActive}
            sx={{ height: 35, width: 35 }}
          >
            {actions.map((action, i) => (
              <SpeedDialAction
                sx={{ position: "relative", right: 18 }}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={onClicks[i]}
              />
            ))}
          </SpeedDial>
        }
      >
        <ListItemIcon>
          <IconButton disableRipple onClick={handleCheck}>
            {item?.checked ? (
              <CheckCircleIcon
                fontSize="large"
                sx={{
                  color: borderColor ? borderColor : colors.landingPageColors.bold,
                }}
              />
            ) : (
              <RadioButtonUncheckedIcon
                fontSize="large"
                sx={{
                  color: borderColor ? borderColor : colors.landingPageColors.bold,
                }}
              />
            )}
          </IconButton>
        </ListItemIcon>
        <ListItemText secondary={identifier} onClick={handleOpenItemDescription}>
          <Typography
            fontFamily={"Urbanist"}
            color={item?.checked ? "gray" : "#374151"}
            sx={{ textDecorationLine: item?.checked && "line-through" }}
          >
            {item?.name && truncateString(item?.name, 25)}
          </Typography>
        </ListItemText>
      </ListItem>

      {openItemDescrition && isActive && (
        <ItemDescription
          setIsActive={setIsActive}
          item={item}
          openItemDescription={openItemDescrition}
          setOpenItemDescription={setOpenItemDescription}
          borderColor={borderColor}
        />
      )}
    </>
  );
};
export default Listitem;
