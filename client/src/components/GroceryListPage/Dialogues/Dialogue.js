import { Alert, Typography, Modal, Fade, Slide, Backdrop, Paper, Stack, TextField, FormControl } from "@mui/material";
import { useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppleIcon from "@mui/icons-material/Apple";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
import { styled } from "@mui/material/styles";
import { URLS, actions, colors, dialogueObject, dialogues, groceryListScopes, messages } from "../../../utils/enum";
import { postRequest, deleteRequest, checkSession } from "../../../utils/rest";
import { useLocation, useNavigate } from "react-router-dom";
import { dialogueValidation } from "../../../utils/dialoguesValidation";
import LoadingButton from "@mui/lab/LoadingButton";
// Websocket
import { addItemWs, editItemWs, removeListItemsWs, removeCheckedListItemsWs, isWebSocketConnected } from "../../../utils/WebSocket";

function Dialogue({ containerId, item, openDialogue, setOpenDialogue, activeList, setActiveList, theme }) {
  // States
  const [severity, setSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Other Locals
  const location = useLocation();
  const textFieldRef = useRef(null);
  const navigate = useNavigate();

  // Handlers
  const handleInputValidation = async (input) => {
    return dialogueValidation(input);
  };

  const deriveCorrectIcon = (header) => {
    if (header === "addIcon") return <AddIcon />;
    if (header === "deleteIcon") return <DeleteIcon />;
    if (header === "editIcon") return <EditIcon />;
    if (header === "appleIcon") return <AppleIcon />;
    if (header === "removeDoneIcon") return <RemoveDoneIcon />;
    return <></>;
  };

  const deriveDefaultText = () => {
    if (openDialogue === dialogues.addItem) return "";
    if (openDialogue === dialogues.sendMoney) return "";
    if (openDialogue === dialogues.resetList) return location.state?.listName;
    return item?.name;
  };

  const showAlert = (severity, msg) => {
    setSeverity(severity);
    setAlertMessage(msg);
  };

  const hideAlert = () => {
    setAlertMessage(null);
  };

  const closeDialogueWithDelay = (delay = 2000) => {
    setTimeout(() => {
      setOpenDialogue(dialogues.closed);
      hideAlert();
      setLoading(false);
      setTimeout(() => setLoading(false), 1000);
    }, delay);
  };

  const closeDialogueWithoutDelay = () => {
    setOpenDialogue(dialogues.closed);
    hideAlert();
    setLoading(false);
    setTimeout(() => setLoading(false), 1000);
  };

  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: colors[theme]?.generalColors.helperTextFontColor,
    },
    "& label": {
      fontFamily: "Urbanist",
      color: colors[theme]?.generalColors.helperTextFontColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors[theme]?.generalColors.fontColor,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: `1px solid ${colors[theme]?.generalColors.fontColor}`,
        borderRadius: 0,
      },
      "&:hover fieldset": {
        borderColor: colors[theme]?.generalColors.fontColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors[theme]?.generalColors.fontColor,
      },
    },
  });

  const handleAddItem = async (name, quantity = 1) => {
    // Disable add item button until add op is done
    setLoading(true);
    setErrorMessage(null);

    // Validate input
    const valid = await handleInputValidation(name);
    if (!valid?.validated) {
      setErrorMessage(valid?.message);
      setLoading(false);
      return;
    }

    // Check for duplicates if list is not public
    const isDuplicate = activeList?.groceryListItems.find((e) => e.name.toUpperCase() === name.toUpperCase());
    if (activeList?.scope !== groceryListScopes.public && isDuplicate) {
      showAlert("warning", "Item already exists in the list.");
      setLoading(false);
      setTimeout(() => hideAlert(), 2000);
      return;
    }

    // Send to POST /server/create-list-item with info container, list, and item
    const data = {
      name: name,
      quantity: quantity,
      listId: activeList?.id,
      containerId: containerId,
      scope: activeList?.scope,
      category: "Misc",
    };
    const uri = activeList?.scope === groceryListScopes.public ? URLS.createPublicListItemUri : URLS.createListItemUri;

    // Send and notifiy websocket subscribers
    if (activeList?.scope === groceryListScopes.restricted && isWebSocketConnected()) {
      const authResponse = await checkSession();
      if (authResponse?.status !== 200) {
        navigate("/");
      }

      if (!isWebSocketConnected()) {
        showAlert("error", "Connection was lost. Please try refreshing or restarting the app.");
        closeDialogueWithDelay();
        setLoading(false);
        return;
      }

      addItemWs(data.listId, data, actions.ADD_ITEM, authResponse?.token);
      closeDialogueWithoutDelay();
      setLoading(false);
      return;
    }

    // Add it to the items state object for re-rendering
    const res = await postRequest(uri, data);
    if (res?.status === 200) {
      setActiveList(res?.body);
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 400 && activeList?.scope === groceryListScopes.public) {
      navigate("/listNotFound");
    } else {
      showAlert("error", "Whoops!. Couldn't add item.");
      closeDialogueWithDelay();
    }
  };

  const handleEditItem = async (name, category) => {
    // Ensure reset states
    setLoading(true);
    setErrorMessage(null);

    // Didn't change anything
    if (name.toUpperCase() === item?.name.toUpperCase()) {
      closeDialogueWithoutDelay();
      setLoading(false);
      return;
    }

    // Validate input
    const valid = await handleInputValidation(name);
    if (!valid?.validated) {
      setErrorMessage(valid?.message);
      setLoading(false);
      return;
    }

    // Send to POST server/edit-item with item id/info
    let updatedItem = { ...item, name: name };
    const data = {
      ...updatedItem,
      containerId: containerId,
      scope: activeList?.scope,
      category: "Misc",
    };

    const uri = activeList?.scope === groceryListScopes.public ? URLS.updatePublicListItemUri : URLS.updateListItemUri;

    // Websockets
    if (activeList?.scope === groceryListScopes.restricted && isWebSocketConnected()) {
      const authResponse = await checkSession();
      if (authResponse?.status !== 200) {
        navigate("/");
      }

      if (!isWebSocketConnected()) {
        showAlert("error", "Connection was lost. Please try refreshing or restarting the app.");
        closeDialogueWithDelay();
        setLoading(false);
        return;
      }

      editItemWs(activeList?.id, data, actions.EDIT_ITEM, authResponse?.token);
      setLoading(false);
      closeDialogueWithoutDelay();
      return;
    }

    const res = await postRequest(uri, data);
    // Update items state object for re-rendering
    if (res?.status === 200) {
      setActiveList(res?.body);
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      // navigate('/') TODO:
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 400 && activeList?.scope === groceryListScopes.public) {
      navigate("/listNotFound");
    } else {
      showAlert("error", messages.genericError);
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

  const handleEraseAllItems = async () => {
    if (activeList?.groceryListItems.length === 0) {
      console.debug("No items to delete");
    }
    setLoading(true);
    const data = {
      containerId: containerId,
      scope: activeList?.scope,
      listId: activeList?.id,
    };

    if (activeList?.scope === groceryListScopes.restricted && isWebSocketConnected()) {
      const authResponse = await checkSession();
      if (authResponse?.status !== 200) {
        navigate("/");
      }

      if (!isWebSocketConnected()) {
        showAlert("error", "Connection was lost. Please try refreshing or restarting the app.");
        closeDialogueWithDelay();
        setLoading(false);
        return;
      }

      removeListItemsWs(activeList?.id, data, actions.REMOVE_ITEMS, authResponse?.token);
      setLoading(false);
      closeDialogueWithoutDelay();
      return;
    }

    const res = await deleteRequest(URLS.resetList, data);
    if (res?.status === 200) {
      setActiveList(res?.body);
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    }  else if (res?.status === 400 && activeList?.scope === groceryListScopes.public) {
      navigate("/listNotFound");
    } else {
      showAlert("error", messages.genericError);
      closeDialogueWithDelay();
    }
  };

  const handleEraseCheckedItems = async () => {
    const listItems = activeList?.groceryListItems.filter((e) => e.checked) || [];
    if (listItems.length === 0) {
      console.debug("No checked items to delete");
      setOpenDialogue(dialogues.closed);
      return;
    }

    setLoading(true);
    const data = {
      containerId: containerId,
      scope: activeList?.scope,
      listId: activeList?.id,
      itemIds: listItems.map((e) => e.id),
    };

    // Send and notifiy websocket subscribers
    if (activeList?.scope === groceryListScopes.restricted && isWebSocketConnected()) {
      const authResponse = await checkSession();
      if (authResponse?.status !== 200) {
        navigate("/");
      }

      if (!isWebSocketConnected()) {
        showAlert("error", "Connection was lost. Please try refreshing or restarting the app.");
        closeDialogueWithDelay();
        setLoading(false);
        return;
      }

      removeCheckedListItemsWs(activeList?.id, data, actions.REMOVE_ITEMS, authResponse?.token);
      closeDialogueWithoutDelay();
      setLoading(false);
      return;
    }

    const res = await deleteRequest(URLS.eraseListItems, data);
    if (res?.status === 200) {
      setActiveList(res?.body);
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 400 && activeList?.scope === groceryListScopes.public) {
      navigate("/listNotFound");
    } else {
      showAlert("error", messages.genericError);
      closeDialogueWithDelay();
    }
  };

  const moneyActions = [handleRedirectToApple, handleRedirectToVenmo, handleRedirectToCashapp];

  const resetListActions = [handleEraseAllItems, handleEraseCheckedItems];

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openDialogue !== dialogues.closed}
        onClose={closeDialogueWithoutDelay}
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
              padding: 1,
              paddingLeft: 1,
              paddingRight: 1,
              paddingBottom: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              direction: "column",
              position: "absolute",
              top: "25vh",
              left: "50vw",
              transform: "translate(-50%)",
              borderRadius: 5,
              width: 300,
              minHeight: 300,
              backgroundColor: colors[theme]?.generalColors.innerBackground,
            }}
          >
            <Slide
              className="alert-slide"
              in={alertMessage && true}
              sx={{
                position: "fixed",
                top: "-25vh",
                width: "90vw",
              }}
            >
              <Alert severity={severity}>{alertMessage}</Alert>
            </Slide>

            <Stack
              direction={"column"}
              spacing={2}
              sx={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" fontFamily={"Urbanist"} color={colors[theme]?.generalColors.fontColor}>
                {dialogueObject[openDialogue]?.header}
              </Typography>

              <FormControl>
                {dialogueObject[openDialogue]?.textFields.map(
                  (textField, i) =>
                    !textField.hidden && (
                      <CssTextField
                        multiline={textField?.multiline}
                        maxRows={4}
                        sx={{ mt: i, mb: -1 * (i - 1) }}
                        fullWidth
                        required={textField?.required}
                        id="custom-css-outlined-input"
                        key={`${textField.text}${i}`}
                        // error={errorMessage && true}
                        inputRef={textFieldRef}
                        label={textField.text}
                        helperText={errorMessage ? errorMessage : textField.helperText}
                        defaultValue={deriveDefaultText()}
                        InputProps={{
                          style: {
                            fontFamily: "Urbanist",
                            color: colors[theme]?.generalColors.fontColor,
                          },
                        }}
                        inputProps={{
                          maxLength: textField?.maxLength || 100,
                        }}
                      />
                    )
                )}
              </FormControl>

              {dialogueObject[openDialogue]?.button.map((button, i) => {
                return (
                  <LoadingButton
                    key={i}
                    loading={loading}
                    loadingPosition="end"
                    fullWidth
                    endIcon={deriveCorrectIcon(button.icon)}
                    onClick={() => {
                      if (openDialogue === dialogues.addItem) {
                        handleAddItem(textFieldRef.current.value);
                      } else if (openDialogue === dialogues.resetList) {
                        resetListActions[i]();
                      } else if (openDialogue === dialogues.editItem) {
                        handleEditItem(textFieldRef.current.value);
                      } else if (openDialogue === dialogues.sendMoney) {
                        moneyActions[i]();
                      }
                    }}
                    sx={{
                      fontFamily: "Urbanist",
                      height: 50,
                      "&:hover": { background: button.color[theme] },
                      background: button.color[theme],
                      borderRadius: 0,
                      color: button.textColor[theme],
                    }}
                  >
                    {button.text}
                  </LoadingButton>
                );
              })}
            </Stack>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}

export default Dialogue;
