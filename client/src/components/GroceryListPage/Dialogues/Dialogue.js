import {
  Alert,
  Typography,
  Modal,
  Fade,
  Slide,
  Backdrop,
  Paper,
  Stack,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormHelperText,
  Button,
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
  deleteItem,
  deletePublicItem,
  deleteRequest,
} from "../../../utils/testApi/testApi";
import { useLocation, useNavigate } from "react-router-dom";
import { dialogueValidation } from "../../../utils/dialoguesValidation";
import LoadingButton from "@mui/lab/LoadingButton";

function Dialogue({
  containerId,
  item,
  openDialogue,
  setOpenDialogue,
  activeList,
  setActiveList,
}) {
  // States
  const [severity, setSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [category, setCategory] = useState("None");

  // Other Locals
  const location = useLocation();
  const textFieldRef = useRef(null);

  const navigate = useNavigate();

  // Handlers
  const handleCategorySelection = (event) => {
    setCategory(event.target.value);
  };

  const handleInputValidation = async (input) => {
    return dialogueValidation(input);
  };

  const deriveCorrectIcon = (header) => {
    if (header === "addIcon") return <AddIcon />;
    if (header === "deleteIcon") return <DeleteIcon />;
    if (header === "editIcon") return <EditIcon />;
    if (header === "appleIcon") return <AppleIcon />;
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
      containerId: containerId,
      scope: activeList?.scope,
      category: category === "None" ? "Misc" : category,
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
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
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
    if (name.toUpperCase() === item?.name.toUpperCase() && category === item?.category) {
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
      category: category === "None" ? "Misc" : category,
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
      showAlert("warning", messages.unauthorizedAction);
    } else {
      showAlert("error", messages.genericError);
      closeDialogueWithDelay();
    }
  };

  const handleResetList = async () => {
    setLoading(true);
    const data = {
      containerId: containerId,
      scope: activeList?.scope,
      listId: activeList?.id,
    };
    const res = await deleteRequest(URLS.resetList, data);
    if (res?.status === 200) {
      setActiveList((activeList) => {
        return { ...activeList, groceryListItems: [] };
      });
      closeDialogueWithoutDelay();
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else {
      console.log(res);
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

  const moneyActions = [
    handleRedirectToApple,
    handleRedirectToVenmo,
    handleRedirectToCashapp,
  ];

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
              padding:1,
              paddingLeft: 1,
              paddingRight: 1,
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

              <FormControl>
                {dialogueObject[openDialogue]?.textFields.map(
                  (textField, i) =>
                    !textField.hidden && (
                      <CssTextField
                        fullWidth
                        required
                        id="custom-css-outlined-input"
                        key={`${textField.text}${i}`}
                        error={errorMessage && true}
                        inputRef={textFieldRef}
                        label={textField.text}
                        helperText={
                          errorMessage ? errorMessage : textField.helperText
                        }
                        defaultValue={deriveDefaultText()}
                        inputProps={{
                          maxLength: 100,
                        }}
                      />
                    )
                )}

                {dialogueObject[openDialogue]?.radioButtons.length > 0 && (
                  <RadioGroup
                    row
                    sx={{ justifyContent: 'flex-start', width:'100%' }}
                    defaultValue="None"
                    onChange={handleCategorySelection}
                  >
                    {dialogueObject[openDialogue]?.radioButtons.map(
                      (radioButton, i) => (
                        <FormControlLabel
                          key={i}
                          value={radioButton.category}
                          control={<Radio />}
                          label={
                            <Typography >
                              {radioButton.category}
                            </Typography>
                          }
                        />
                      )
                    )}
                  </RadioGroup>
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
                        handleResetList();
                      } else if (openDialogue === dialogues.editItem) {
                        handleEditItem(textFieldRef.current.value, category);
                      } else if (openDialogue === dialogues.sendMoney) {
                        moneyActions[i]();
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