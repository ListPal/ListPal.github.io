import {
  Alert,
  Button,
  Typography,
  Modal,
  Fade,
  Slide,
  Backdrop,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useState, useRef } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AppleIcon from "@mui/icons-material/Apple";
import { styled } from "@mui/material/styles";
import {
  URLS,
  dialogueObject,
  dialogues,
  groceryListScopes,
  messages,
} from "../../../utils/enum";
import {
  postRequest,
  deleteList,
  deleteItem,
  deletePublicItem,
} from "../../../utils/testApi/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { dialogueValidation } from "../../../utils/dialoguesValidation";

function Dialogue({
  item,
  openDialogue,
  setOpenDialogue,
  activeList,
  setActiveList,
  activeContainer,
  setActiveContainer,
  user,
}) {
  // States
  const [severity, setSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Other Locals
  const location = useLocation();
  const navigate = useNavigate();
  const textFieldRef = useRef(null);
  const urlParams = new URLSearchParams(location.search);

  // Handlers
  const handleInputValidation = async (input) => {
    return dialogueValidation(input);
  };

  const deriveCorrectIcon = (header) => {
    if (header === "addIcon") return <AddIcon />;
    if (header === "deleteIcon") return <DeleteIcon />;
    if (header === "editIcon") return <EditIcon />;
    if (header === "appleIcon") return <AppleIcon />;
  };

  const deriveDefaultText = () => {
    if (openDialogue === dialogues.addItem) return "";
    if (openDialogue === dialogues.sendMoney) return "";
    if (openDialogue === dialogues.deleteList) return location.state?.listName;
    return item?.name;
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
      hideAlert();
      setLoading(false);
      setTimeout(() => setLoading(false), 2000);
    }, 2000);
  };

  const closeDialogueWithoutDelay = () => {
    setOpenDialogue(dialogues.closed);
    hideAlert();
    setLoading(false);
    setTimeout(() => setLoading(false), 1000);
  };

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
    const isDuplicate = activeList?.groceryListItems.find(
      (e) => e.name.toUpperCase() === name.toUpperCase()
    );
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
      containerId: urlParams.get('containerId'),
      scope: activeList?.scope,
    };
    const uri =
      activeList?.scope === groceryListScopes.public
        ? URLS.createPublicListItemUri
        : URLS.createListItemUri;
    const res = await postRequest(uri, data);
    // Add it to the items state object for re-rendering
    if (res?.status === 200) {
      const updatedItems = [...activeList?.groceryListItems, res?.body];
      setActiveList({ ...activeList, groceryListItems: updatedItems });
      showAlert("success", "item added");
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      // navigate('/') TODO:
    } else if (res?.status === 401) {
      showAlert(
        "warning",
        "Hmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities."
      );
    } else {
      showAlert("error", "Whoops!. Couldn't add item.");
      closeDialogueWithDelay();
    }
  };

  const handleEditItem = async (name) => {
    // Ensure reset states
    setLoading(true);
    setErrorMessage(null);

    // Didn't change anything
    if (name.toUpperCase() === item.name.toUpperCase()) {
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

    // Check if whoever's deleting the item has permissions
    if (
      item?.user?.username !== "unknown" &&
      user?.username !== item?.user?.username
    ) {
      showAlert(
        "error",
        "You cannot edit this item because you did not create it."
      );
      closeDialogueWithDelay();
      return;
    }

    // Send to POST server/edit-item with item id/info
    let updatedItem = { ...item, name: name };
    const data = {
      ...updatedItem,
      containerId: urlParams.get("containerId"),
      scope: activeList?.scope,
    };
    const uri =
      activeList?.scope === groceryListScopes.public
        ? URLS.updatePublicListItemUri
        : URLS.updateListItemUri;
    const res = await postRequest(uri, data);

    // Update items state object for re-rendering
    if (res?.status === 200) {
      const updatedItems = activeList?.groceryListItems.map((e) => {
        if (e.name === item?.name) {
          return { ...e, name: res?.body.name, id: res?.body.id };
        } else return e;
      });
      setActiveList({ ...activeList, groceryListItems: updatedItems });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      // navigate('/') TODO:
    } else if (res?.status === 401) {
      showAlert(
        "warning",
        "Hmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities."
      );
    } else {
      showAlert("error", "Something went wrong. Couldn't update the item.");
      closeDialogueWithDelay();
    }
  };

  const handleDeleteItem = async (item) => {
    setLoading(true);
    let { id, name } = item;

    // send DELETE request to server
    const data = {
      containerId: urlParams.get("containerId"),
      listId: activeList?.id,
      scope: activeList?.scope,
      itemId: item?.id,
    };

    // Check if whoever's deleting the item has permissions
    if (
      item?.user?.username !== "unknown" &&
      user?.username !== item?.user?.username
    ) {
      showAlert(
        "error",
        "You cannot delete this item because you did not create it."
      );
      closeDialogueWithDelay();
      return;
    }

    const res =
      activeList?.scope === groceryListScopes.public
        ? await deletePublicItem(data)
        : await deleteItem(data);
    if (res?.status === 200) {
      // update items state
      const previousItems = activeList?.groceryListItems.filter(
        (e) => !(e.id === id && e.name === name)
      );
      setActiveList({ ...activeList, groceryListItems: previousItems });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert(
        "warning",
        "Hmm... It seems like you don't have permissions to do that. Verify with the owner of the list to grant you the correct authorities."
      );
    } else {
      showAlert("error", "Apologies. Something went wrong on our end.");
      closeDialogueWithDelay();
    }
  };

  const handleDeleteEntireList = async () => {
    if (activeList?.scope === groceryListScopes.public) {
      showAlert(
        "warning",
        "This is a shared list. If you are the owner, go back and delete there."
      );
      return;
    }
    setLoading(true);
    // Validate input
    const valid = await handleInputValidation(textFieldRef.current.value);
    if (!valid?.validated) {
      setErrorMessage(valid?.message);
      setLoading(false);
      return;
    }

    // Validate that user entered acknowledgement
    if (textFieldRef.current.value !== location.state?.listName) {
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

    // Fetch the DELETE api on the server and send user, container, list info
    const data = {
      containerId: activeContainer?.id,
      scope: activeList?.scope,
      listId: activeList?.id,
    };

    const res = await deleteList(data);
    if (res?.status === 200) {
      const updatedLists = activeContainer?.collapsedLists.filter(
        (list) => list.id !== activeList?.id
      );
      setActiveContainer((container) => {
        return { ...container, collapsedLists: updatedLists };
      });
      setSeverity("info");
      setAlertMessage("No lists yet to display. Create your first list 🥳");
      navigate(-1);
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else {
      console.log(res);
      showAlert(
        "error",
        "Something went wrong on our end. Couldn't delete the list."
      );
      closeDialogueWithDelay();
    }
  };

  const handleRedirectToVenmo = () => {
    setLoading(true);
    // Redirect to p2p provider
    window.open("venmo://accounts");
    setLoading(false);
  };

  const handleRedirectToCashapp = () => {
    setLoading(true);
    // Redirect to p2p provider
    window.open("cashme://");
    setLoading(false);
  };

  const actions = [handleRedirectToVenmo, handleRedirectToCashapp];

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
              display: "flex",
              justifyContent: "center",
              direction: "column",
              position: "absolute",
              top: "25vh",
              left: "50vw",
              transform: "translate(-50%)",
              borderRadius: 5,
              width: 330,
              height: 300,
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
              <Typography variant="h4">
                {dialogueObject[openDialogue]?.header}
              </Typography>

              {dialogueObject[openDialogue]?.textFields.map(
                (textField, i) =>
                  !textField.hidden && (
                    <CssTextField
                      fullWidth
                      sx={{ maxWidth: "65vw" }}
                      autoFocus={false}
                      error={errorMessage && true}
                      required
                      key={`${textField.text}${i}`}
                      inputRef={textFieldRef}
                      id="custom-css-outlined-input"
                      label={textField.text}
                      helperText={
                        errorMessage ? errorMessage : textField.helperText
                      }
                      defaultValue={deriveDefaultText()}
                      inputProps={{
                        maxLength: 100,
                        required: true,
                      }}
                    />
                  )
              )}

              {dialogueObject[openDialogue]?.button.map((button, i) => {
                return (
                  <Button
                    key={i}
                    fullWidth
                    disabled={loading}
                    endIcon={deriveCorrectIcon(button.icon)}
                    onClick={() => {
                      if (openDialogue === dialogues.addItem) {
                        handleAddItem(textFieldRef.current.value);
                      } else if (openDialogue === dialogues.deleteList) {
                        handleDeleteEntireList();
                      } else if (openDialogue === dialogues.editItem) {
                        handleEditItem(textFieldRef.current.value);
                      } else if (openDialogue === dialogues.deleteItem) {
                        handleDeleteItem(item);
                      } else if (openDialogue === dialogues.sendMoney) {
                        actions[i]();
                      }
                    }}
                    sx={{
                      height: 50,
                      "&:hover": { background: button.color },
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
}

export default Dialogue;

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
