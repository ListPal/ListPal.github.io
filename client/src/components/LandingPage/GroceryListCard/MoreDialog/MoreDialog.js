import {
  Alert,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState, useRef } from "react";
import Slide from "@mui/material/Slide";
import Backdrop from "@mui/material/Backdrop";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  dialogues,
  dialogueObject,
  URLS,
} from "../../../../utils/enum";
import { deleteList, postRequest } from "../../../../utils/testApi/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { dialogueValidation } from "../../../../utils/dialoguesValidation";
import AppleIcon from "@mui/icons-material/Apple";

const MoreDialog = ({
  listName,
  listId,
  activeContainer,
  setActiveContainer,
  openDialogue,
  setOpenDialogue,
}) => {
  // States
  const [severity, setSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listScope, setListScope] = useState("PRIVATE");
  // Other locals
  const listNameRef = useRef(null);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const handleInputValidation = async (input) => {
    return dialogueValidation(input);
  };

  const handleListScopeSelection = (event) => {
    setListScope(event.target.value);
  };

  const handleEditListOptions = async (newListName, listScope) => {
    setLoading(true);
    setErrorMessage(null);
    setAlertMessage(null);
    // Validate input
    const validation = await handleInputValidation(newListName);
    if (!validation?.validated) {
      setErrorMessage(validation?.message);
      setLoading(false);
      return;
    }

    // Send to db
    const data = {
      containerId: urlParams.get("containerId"),
      listId: listId,
      listName: newListName,
      scope: listScope,
    };

    const res = await postRequest(URLS.updateListNameUri, data);
    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.map((list) => {
        if (list.id === listId) {
          return { ...list, listName: newListName, scope: listScope };
        } else {
          return list;
        }
      });
      setActiveContainer((container) => {
        return { ...container, collapsedLists: updatedLists };
      });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", "Cannot do this action cause you did not create this list.");
      closeDialogueWithDelay();
    } else {
      console.log(res)
      showAlert("error", "Whoops!. Something went wrong in our end");
      closeDialogueWithDelay();
    }
  };

  const handleDeleteList = async () => {
    setLoading(true);
    setErrorMessage(null);
    setAlertMessage(null);
    // validate that user entered acknowledgement
    if (listNameRef.current.value !== listName) {
      showAlert(
        "error",
        "Couldn't delete the list.\nMake sure you enter the name of the list correctly (case sensitive)"
      );
      setTimeout(() => {
        hideAlert();
        setLoading(false);
      }, 3000);
      return;
    }

    // Send to db
    const data = {
      containerId: urlParams.get("containerId"),
      listId: listId,
    };

    const res = await deleteList(data);
    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.filter(
        (list) => list.id !== listId
      );
      setActiveContainer((container) => {
        return { ...container, collapsedLists: updatedLists };
      });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else {
      showAlert("error", "Whoops!. Something went wrong in our end");
      closeDialogueWithDelay();
    }
  };

  // TODO:
  //eslint-disable-next-line
  const handleAddPeople = () => {
    setLoading(true);
    //
    setLoading(false);
  };

  const handleRedirectToApple = () => {
    // Redirect to p2p provider
    setLoading(true);
    window.open("wallet://cash");
    setLoading(false);
  };

  const handleRedirectToVenmo = () => {
    // Redirect to p2p provider
    setLoading(true);
    window.open("venmo://accounts");
    setLoading(false);
  };

  const handleRedirectToCashapp = () => {
    // Redirect to p2p provider
    setLoading(true);
    window.open("cashme://");
    setLoading(false);
  };

  const actions = [
    handleRedirectToApple,
    handleRedirectToVenmo,
    handleRedirectToCashapp,
  ];

  const deriveCorrectIcon = (icon) => {
    if (icon === "deleteIcon") return <DeleteIcon />;
    if (icon === "editIcon") return <EditIcon />;
    if (icon === "appleIcon") return <AppleIcon />;
  };

  const showAlert = (severity, msg) => {
    setSeverity(severity);
    setAlertMessage(msg);
  };

  const hideAlert = () => {
    setAlertMessage(null);
  };

  const closeDialogueWithDelay = () => {
    setTimeout(() => {
      setOpenDialogue(dialogues.closed);
      setTimeout(() => setLoading(false), 2000);
    }, 2000);
  };

  const closeDialogueWithoutDelay = () => {
    setOpenDialogue(dialogues.closed);
    setLoading(false);
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDialogue !== dialogues.closed}
        onClose={
          alertMessage ? closeDialogueWithDelay : closeDialogueWithoutDelay
        }
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openDialogue !== dialogues.closed}>
          <Paper
            sx={{
              position: "absolute",
              top: "25%",
              left: "50%",
              transform: "translate(-50%)",
              borderRadius: 5,
              minWidth:320,
              minHeight: 250,
              padding:2,
            }}
          >
            <Slide
              className="alert-slide"
              in={alertMessage && true}
              sx={{
                position: "absolute",
                top: -100,
                left: -15,
                width: "80vw",
              }}
            >
              <Alert severity={severity}>{alertMessage}</Alert>
            </Slide>

            <Stack
              direction={"column"}
              spacing={2}
              sx={{
                alignItems: "center",
              }}
            >
              <Typography variant="h4">
                {dialogueObject[openDialogue]?.header}
              </Typography>

              <FormControl sx={{ alignItems: "center" }}>
                {dialogueObject[openDialogue]?.textFields.map(
                  (textField, i) =>
                    !textField.hidden && (
                      <CssTextField
                        fullWidth
                        error={errorMessage && true}
                        required
                        key={`${textField.text}${i}`}
                        inputRef={listNameRef}
                        id="custom-css-outlined-input"
                        label={textField.text}
                        helperText={
                          errorMessage ? errorMessage : textField.helperText
                        }
                        defaultValue={textField.defaultValue ? listName : null}
                        inputProps={{
                          maxLength: 30,
                          required: true,
                        }}
                      />
                    )
                )}

                {openDialogue === dialogues.editList && <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="PRIVATE"
                  name="radio-buttons-group"
                  onChange={handleListScopeSelection}
                  sx={{ justifyContent: "center" }}
                >
                  <FormControlLabel
                    value="PUBLIC"
                    control={<Radio />}
                    label="Public"
                  />
                  <FormControlLabel
                    value="PRIVATE"
                    control={<Radio />}
                    label="Private"
                  />
                  <FormControlLabel
                    value="RESTRICTED"
                    control={<Radio />}
                    label="Restricted"
                  />
                </RadioGroup>}
              </FormControl>

              {dialogueObject[openDialogue]?.button.map((button, i) => {
                return (
                  <Button
                    fullWidth
                    key={i}
                    type="submit"
                    disabled={loading}
                    endIcon={deriveCorrectIcon(button.icon)}
                    onClick={() => {
                      if (openDialogue === dialogues.deleteList) {
                        handleDeleteList();
                      } else if (openDialogue === dialogues.editList) {
                        handleEditListOptions(listNameRef.current.value, listScope);
                      } else if (openDialogue === dialogues.sendMoney) {
                        actions[i]();
                      }
                    }}
                    sx={{
                      width: "90%",
                      height: 50,
                      "&:hover": {
                        background: button.color,
                      },
                      background: button.color,
                      borderRadius: 0,
                      color: button.textColor,
                    }}
                  >
                    {button.text}
                  </Button>
                );
              })}
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "black",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "2px solid black",
      borderRadius: 0,
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "black",
    },
  },
});

export default MoreDialog;
