import { useState } from "react";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import IconButton from "@mui/material/Button";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import MoreOutlinedIcon from "@mui/icons-material/MoreOutlined";
import { Alert, Paper, Slide, Stack, Typography } from "@mui/material";
import { colors, dialogues, groceryListScopes } from "../../../../utils/enum";
import MoreDialog from "../MoreDialog/MoreDialog";
import { useNavigate } from "react-router-dom";

const MoreOptions = ({ listInfo, activeContainer, setActiveContainer, username, theme }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const [alert, _] = useState(false);
  const navigate = useNavigate();

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
          color: colors[theme].generalColors.fontColor,
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
        <Paper sx={{backgroundColor: colors[theme].generalColors.outerBackground, borderRadius: 0}}>
          <Stack direction={"row"}>
            {listInfo?.scope === groceryListScopes.restricted && (
              <IconButton
                onClick={() => {
                  navigate("/addPeople", {
                    state: {
                      containerId: listInfo?.reference,
                      listId: listInfo?.id,
                      selfUsername: username,
                    },
                  });
                }}
              >
                <PersonAddIcon sx={{ color: colors[theme].generalColors.fontColor }} />
              </IconButton>
            )}

            {listInfo?.scope === groceryListScopes.restricted && (
              <IconButton
                onClick={() => {
                  setOpenDialogue(dialogues.deletePeople);
                }}
              >
                <PersonRemoveIcon sx={{ color: colors[theme].generalColors.fontColor }} />
              </IconButton>
            )}

            <IconButton
              onClick={() => {
                setOpenDialogue(dialogues.editList);
              }}
            >
              <EditIcon sx={{ color: colors[theme].generalColors.fontColor }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setOpenDialogue(dialogues.deleteList);
              }}
            >
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          </Stack>
        </Paper>
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
        <Alert severity={"info"}>
          <Typography>Coming soon. This feature is still on the works</Typography>
        </Alert>
      </Slide>

      {openDialogue && (
        <MoreDialog
          theme={theme}
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
