import { useState } from "react";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaidIcon from "@mui/icons-material/Paid";
// import GroupAddIcon from "@mui/icons-material/GroupAdd";
import IconButton from "@mui/material/Button";
import MoreOutlinedIcon from "@mui/icons-material/MoreOutlined";
import { Stack } from "@mui/material";
import { dialogues } from "../../../../utils/enum";
import MoreDialog from "../MoreDialog/MoreDialog";

const MoreOptions = ({ listInfo, activeContainer, setActiveContainer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        disableElevation
        disableRipple
        disableTouchRipple
        aria-describedby={"simple-popover"}
        onClick={handleClick}
        sx={{
          background: "none",
          color: "#5a6b51",
          borderRadius: "50%",
        }}
      >
        <MoreOutlinedIcon fontSize="medium" />
      </IconButton>

      <Popover
        id={"simple-popover"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        <Stack direction={"row"}>
          {/* <IconButton
            disabled
            onClick={() => {
              setOpenDialogue(dialogues.addPeople);
            }}
          >
            <GroupAddIcon sx={{ color: "black" }} />
          </IconButton> */}
          <IconButton
            onClick={() => {
              setOpenDialogue(dialogues.sendMoney);
            }}
          >
            <PaidIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              // setOpenDialogue(dialogues.editList)
              setOpenDialogue(dialogues.editList);
            }}
          >
            <EditIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setOpenDialogue(dialogues.deleteList);
            }}
          >
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Stack>
      </Popover>

      {openDialogue && (
        <MoreDialog
          listName={listInfo?.listName}
          listId={listInfo?.id}
          activeContainer={activeContainer}
          setActiveContainer={setActiveContainer}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
        />
      )}
    </>
  );
};

export default MoreOptions;
