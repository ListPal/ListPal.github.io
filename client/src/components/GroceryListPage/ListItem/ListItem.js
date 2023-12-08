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
import NotesIcon from "@mui/icons-material/Notes";
import {
  Typography,
  SpeedDial,
  ListItem,
  ListItemText,
  IconButton,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteItem, deletePublicItem } from "../../../utils/rest";

const Listitem = ({
  identifier = "unknown",
  item,
  setItem,
  activeList,
  setActiveList,
  setOpenDialogue,
  borderColor,
  setAlertMessage,
  provided,
  modifiedIds,
  setModifiedIds,
  theme,
}) => {
  // States
  const [loading, setLoading] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openItemDescrition, setOpenItemDescription] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <DeleteIcon sx={{ color: "red" }} />, name: "Delete item" },
    {
      icon: <EditIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />,
      name: "Edit item",
    },
  ];

  // Handlers
  const handleOpenItemDescription = () => {
    if (item?.name.length > 24) {
      setOpenItemDescription(true);
    }
  };

  const handleDeriveOpenOrCloseIcon = () => {
    if (openSpeedDial) {
      return (
        <CloseIcon
          onClick={() => setOpenSpeedDial(!openSpeedDial)}
          sx={{ color: colors[theme]?.generalColors.fontColor, position: "relative", right: 18 }}
        />
      );
    } else {
      return (
        <MoreHorizIcon
          onClick={() => setOpenSpeedDial(!openSpeedDial)}
          sx={{ color: colors[theme]?.generalColors.fontColor, position: "relative", right: 18 }}
        />
      );
    }
  };

  const handleCheck = () => {
    setLoading(true);
    // Mark items checked/unchecked
    let listItems = activeList?.groceryListItems || [];
    const updatedItems = listItems.map((e) =>
      e.id === item?.id ? { ...e, checked: !e.checked } : e
    );

    // Do not separate checked/unchcked items
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

    setLoading(false);
  };

  const openEditItemDialogue = () => {
    setOpenDialogue(dialogues.editItem);
    setItem(item);
    setOpenSpeedDial(false);
  };

  const openSendMoneyDialogue = () => {
    setOpenDialogue(dialogues.sendMoney);
    setItem(item);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
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
      setOpenSpeedDial(false);
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      setAlertMessage(messages.unauthorizedAccess);
    } else {
      setAlertMessage(messages.genericError);
    }
    setLoading(false);
  };

  const onClicks = [handleDeleteItem, openEditItemDialogue, openSendMoneyDialogue];

  return (
    <>
      <ListItem
        alignItems={"flex-start"}
        sx={{
          height: 80,
          ml: "20px",
          borderRadius: 1,
          maxWidth: `calc(${mobileWidth} - 40px)`,
          width: "calc(100vw - 40px)",
        }}
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        secondaryAction={
          <SpeedDial
            ariaLabel="SpeedDial"
            direction={"left"}
            icon={handleDeriveOpenOrCloseIcon()}
            open={openSpeedDial}
            sx={{ height: 35, width: 35 }}
          >
            {actions.map((action, i) => (
              <SpeedDialAction
                sx={{
                  position: "relative",
                  right: 18,
                  background: colors[theme]?.generalColors.innerBackground,
                }}
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={onClicks[i]}
                FabProps={{
                  disabled: loading,
                }}
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
                  color: borderColor ? borderColor : colors[theme]?.fallbackColors.bold,
                }}
              />
            ) : (
              <RadioButtonUncheckedIcon
                fontSize="large"
                sx={{
                  color: borderColor ? borderColor : colors[theme]?.fallbackColors.bold,
                }}
              />
            )}
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{
            style: {
              fontFamily: "Urbanist",
              color: item?.checked ? "gray" : colors[theme]?.generalColors.fontColor,
              textDecorationLine: item?.checked && "line-through",
              fontWeight: 500,
              fontSize: '0.95rem',
            },
          }}
          secondaryTypographyProps={{
            style: {
              display:'flex',
              flexDirection:'column',
              fontFamily: "Urbanist",
              color: "#9CA3AF",
              fontSize: 12,
            },
          }}
          primary={item?.name && truncateString(item?.name, 28)}
          secondary={
            <>
            {identifier}
            {item?.name.length >= 28 && <NotesIcon sx={{fontSize:12}}/>}
            </>
          }
          onClick={handleOpenItemDescription}
        />
      </ListItem>
      <Divider variant="inset" component="li" />

      {openItemDescrition && (
        <ItemDescription
          theme={theme}
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
