import {
  Alert,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Box,
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
import SearchIcon from "@mui/icons-material/Search";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

import {
  dialogues,
  dialogueObject,
  URLS,
  groceryListScopes,
  messages,
  mobileWidth,
} from "../../../../utils/enum";
import {
  addPeopleToList,
  deleteList,
  postRequest,
} from "../../../../utils/testApi/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { dialogueValidation } from "../../../../utils/dialoguesValidation";
import AppleIcon from "@mui/icons-material/Apple";

const MoreDialog = ({
  listInfo,
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
  const [listScope, setListScope] = useState(listInfo?.scope);

  // Other locals
  const textFieldRef = useRef(null);
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
      containerId: activeContainer?.id,
      listId: listInfo?.id,
      listName: newListName,
      scope: listScope,
    };

    const res = await postRequest(URLS.updateListNameUri, data);
    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.map((list) => {
        if (list.id === listInfo?.id) {
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
      showAlert(
        "warning",
        "Cannot do this action cause you did not create this list."
      );
      closeDialogueWithDelay();
    } else {
      console.log(res);
      showAlert("error", "Whoops!. Something went wrong in our end");
      closeDialogueWithDelay();
    }
  };

  const handleDeleteList = async () => {
    setLoading(true);
    setErrorMessage(null);
    setAlertMessage(null);
    // validate that user entered acknowledgement
    if (textFieldRef.current.value !== listInfo?.listName) {
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
      scope: listInfo?.scope,
      listId: listInfo?.id,
    };

    const res = await deleteList(data);
    // Update state hierarchy
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.filter(
        (list) => list.id !== listInfo?.id
      );
      setActiveContainer((container) => {
        return { ...container, collapsedLists: updatedLists };
      });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
      closeDialogueWithDelay();
    } else {
      showAlert("Something went wrong on our end. Couldn't delete the list.");
      closeDialogueWithDelay();
    }
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

  const moneyActions = [
    handleRedirectToApple,
    handleRedirectToVenmo,
    handleRedirectToCashapp,
  ];

  const deriveCorrectIcon = (icon) => {
    if (icon === "deleteIcon") return <DeleteIcon />;
    if (icon === "editIcon") return <EditIcon />;
    if (icon === "appleIcon") return <AppleIcon />;
    if (icon === "lookup") return <SearchIcon />;
    if (icon === 'phone') return <LocalPhoneIcon />
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
              zIndex: 5,
              position: "relative",
              display: "flex",
              justifyContent: "center",
              direction: "column",
              top: "45vh",
              left: "50vw",
              transform: "translate(-50%, -50%)",
              borderRadius: 5,
              width: "85vw",
              maxWidth: mobileWidth,
              p: 2,
              pt: 5,
              pb: 5,
            }}
          >
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
                        inputRef={textFieldRef}
                        id="custom-css-outlined-input"
                        label={textField.text}
                        helperText={
                          errorMessage ? errorMessage : textField.helperText
                        }
                        defaultValue={
                          textField.defaultValue ? listInfo?.listName : null
                        }
                        inputProps={{
                          maxLength: 30,
                          required: true,
                        }}
                      />
                    )
                )}

                {openDialogue === dialogues.editList && (
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={listInfo?.scope}
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
                  </RadioGroup>
                )}
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
                        handleEditListOptions(
                          textFieldRef.current.value,
                          listScope
                        );
                      } else if (openDialogue === dialogues.sendMoney) {
                        moneyActions[i]();
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
      <Slide
        className="alert-slide"
        in={alertMessage && true}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Alert severity={severity}>
          <Typography>{alertMessage}</Typography>
        </Alert>
      </Slide>
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
