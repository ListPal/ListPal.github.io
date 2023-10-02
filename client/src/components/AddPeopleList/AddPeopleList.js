import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  CircularProgress,
  Grid,
  IconButton,
  Slide,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useLocation, useNavigate } from "react-router-dom";
import { addPeopleToList, postRequest } from "../../utils/rest";
import { lookupUser } from "../../utils/rest";
import {
  peopleLookupValidationByUsername,
  peopleLookupValidationByPhone,
} from "../../utils/inputValidation";
import { URLS } from "../../utils/enum";
import LoadingButton from "@mui/lab/LoadingButton";

const AddPeopleList = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [textfieldMessage, setTextfieldMessage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [lookupByPhone, setLookupByPhone] = useState(true);
  const [peopleToAdd, setPeopleToAdd] = useState([]);
  const [suggested, setSuggested] = useState([]);
  // Other locals
  const navigate = useNavigate();
  const textFieldUserRef = useRef();
  const location = useLocation();

  // Handlers
  const handleSwitch = () => {
    setLookupByPhone(!lookupByPhone)
    setTextfieldMessage(null);
  }
  const handleShowAlert = (severity, message) => {
    setAlert({
      severity: severity,
      message: message,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateUserSet = (users) => {
    return Array.from(new Map(users.map((obj) => [JSON.stringify(obj), obj])).values());
  };

  const handleToggleListItem = (value) => () => {
    const currentIndex = peopleToAdd.indexOf(value);
    const newChecked = [...peopleToAdd];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setPeopleToAdd(newChecked);
  };

  const handleLookupUser = async () => {
    // Prepare to call api
    setLoading(true);
    setTextfieldMessage(null);
    // Input validation
    const valid = lookupByPhone
      ? await peopleLookupValidationByPhone(textFieldUserRef.current.value)
      : await peopleLookupValidationByUsername(textFieldUserRef.current.value);
    if (!valid?.validated) {
      setTextfieldMessage({
        severity: "error",
        message: valid?.message,
        error: valid?.error,
      });
      setLoading(false);
      return;
    }

    // Call API
    const data = {
      requesterUsername: location?.state?.selfUsername,
      userIdentifier: textFieldUserRef.current.value.toLowerCase(),
      criteria: lookupByPhone ? "PHONE" : "USERNAME",
    };
    const res = await lookupUser(data);
    if (res?.status === 200) {
      setSuggested(handleCreateUserSet([res?.body, ...suggested].flat()));
      setTextfieldMessage({
        severity: "green",
        message: "User found successfully ✓",
        error: null,
      });
    } else if (res?.status === 201) {
      setTextfieldMessage({
        severity: "error",
        message: "User not found by this criteria",
        error: null,
      });
    } else if (res?.status === 401) {
      console.log(res);
    } else if (res?.status === 403) {
      console.log(res);
    } else {
      console.log(res);
    }
    setLoading(false);
  };

  const handleAddPeople = async () => {
    setLoading(true);

    // Extract each username from user objects
    const usernamesToAdd = peopleToAdd.map((user) => user.username);

    // Call API
    const data = {
      people: usernamesToAdd,
      listId: location.state.listId,
      containerId: location.state.containerId,
    };
    const res = await addPeopleToList(data);
    if (res?.status === 200) {
      navigate(-1);
    } else if (res?.status === 201) {
      handleShowAlert({ severity: "warning", message: "User not found." });
    } else if (res?.status === 401) {
      console.log(res);
      handleShowAlert({
        severity: "error",
        message: "Hmm... It seems like you are not authorized to do this action.",
      });
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else {
      handleShowAlert({
        severity: "error",
        message: "Whoops! Something went wrong on our end. We are working to fix this",
      });
      console.log(res);
    }
    setLoading(false);
  };

  const handleFetchSuggested = async () => {
    setLoading(true);
    const data = {
      userIdentifier: location?.state?.selfUsername,
      criteria: "USERNAME",
    };
    const res = await postRequest(URLS.getSuggestedPeople, data);
    if (res?.status === 200) {
      console.log(res?.body);
      setSuggested(res?.body);
    } else if (res?.status === 201) {
      console.log(res);
    } else if (res?.status === 401) {
      console.log(res);
      handleShowAlert({
        severity: "error",
        message: "Hmm... It seems like you are not authorized to do this action.",
      });
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else {
      handleShowAlert({
        severity: "error",
        message: "Whoops! Something went wrong on our end. We are working to fix this",
      });
      console.log(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!(location.state?.listId && location.state?.containerId)) {
      navigate("/");
    } else {
      handleFetchSuggested();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Grid container spacing={4} p>
      <meta name="theme-color" content="white" />
      <Grid item sx={{ width: "100vw" }}>
        <Stack direction={"column"} spacing={1}>
          <Stack direction={"row"} alignItems={"center"}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBackIosIcon />
            </IconButton>
            <Switch checked={lookupByPhone} onChange={handleSwitch} />
            <Typography
              variant="button"
              sx={{ color: "#4B5563" }}
            >{`Toggle lookup option`}</Typography>
          </Stack>
          <Stack sx={{ width: "95vw" }}>
            {lookupByPhone && (
              <TextField
                sx={{}}
                error={textfieldMessage?.error && true}
                inputRef={textFieldUserRef}
                label={"Lookup user by phone"}
                type="tel"
                helperText={
                  <Typography color={textfieldMessage?.severity} variant="helperText">
                    {textfieldMessage?.message}
                  </Typography>
                }
                inputProps={{
                  maxLength: 10,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{ background: "#f2f3ff" }}
                      disabled={loading}
                      onClick={() => handleLookupUser()}
                    >
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
            {!lookupByPhone && (
              <TextField
                type="email"
                error={textfieldMessage?.error && true}
                inputRef={textFieldUserRef}
                label={"Lookup user by email"}
                helperText={
                  <Typography color={textfieldMessage?.severity} variant="helperText">
                    {textfieldMessage?.message}
                  </Typography>
                }
                inputProps={{
                  maxLength: 100,
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{ background: "#f2f3ff" }}
                      disabled={loading}
                      onClick={() => handleLookupUser()}
                    >
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
          </Stack>
        </Stack>
      </Grid>

      <Grid item sx={{ width: "100vw" }}>
        <Typography variant="h5" textAlign={"left"} fontFamily={"Urbanist"}>
          Recents
        </Typography>
        <List
          dense
          sx={{
            bgcolor: "background.paper",
            overflow: "scroll",
            maxHeight: "65vh",
          }}
        >
          {suggested.map((user, i) => {
            const labelId = `checkbox-list-secondary-label-${user}`;
            return (
              <ListItem
                key={i + "list-item"}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggleListItem(user)}
                    checked={peopleToAdd.indexOf(user) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar alt={`${user?.name}`} src={`/static/images/avatar/${user?.name}.jpg`} />
                  </ListItemAvatar>
                  <ListItemText id={labelId} primary={`${user?.name} ${user?.lastName}`} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {peopleToAdd.length > 0 && (
          <LoadingButton
            endIcon={<></>}
            loadingPosition={"end"}
            loading={loading}
            fullWidth
            onClick={handleAddPeople}
            variant={"contained"}
            sx={{
              height: 50,
              position: "fixed",
              bottom: 0,
              left: 0,
              borderRadius: 0,
            }}
          >
            Add All
          </LoadingButton>
        )}
      </Grid>

      {loading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "calc(50% - 10px)",
            left: "calc(50% - 10px)",
            zIndex: 10,
          }}
        />
      )}

      <Slide sx={{ position: "fixed", top: 0, left: 0 }} in={alert}>
        <Alert severity={alert?.severity}>
          <Typography variant="subtitle2" textAlign={"left"}>
            {alert?.message}
          </Typography>
        </Alert>
      </Slide>
    </Grid>
  );
};

export default AddPeopleList;
