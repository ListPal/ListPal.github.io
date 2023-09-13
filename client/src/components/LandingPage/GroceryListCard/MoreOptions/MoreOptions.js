import { useState } from "react";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PaidIcon from "@mui/icons-material/Paid";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/Button";
import MoreOutlinedIcon from "@mui/icons-material/MoreOutlined";
import { Alert, Slide, Stack, Typography } from "@mui/material";
import { dialogues } from "../../../../utils/enum";
import MoreDialog from "../MoreDialog/MoreDialog";

const MoreOptions = ({ listInfo, activeContainer, setActiveContainer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const [alert, setAlert] = useState(false);

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
          <IconButton
            onClick={() => {
              // setOpenDialogue(dialogues.addPeople);
              setAlert(true)
              setTimeout(() => setAlert(false), 3000)
            }}
          >
            <PersonAddIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              setOpenDialogue(dialogues.sendMoney);
            }}
          >
            <PaidIcon sx={{ color: "black" }} />
          </IconButton>
          <IconButton
            onClick={() => {
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

      <Slide
        className="alert-slide"
        in={alert}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Alert severity={"info"}><Typography>Coming soon. This feature is still on the works</Typography></Alert>
      </Slide>

      {openDialogue && (
        <MoreDialog
          listInfo={listInfo}
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
