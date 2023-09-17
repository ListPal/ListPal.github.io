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
  Button,
  Grid,
  IconButton,
  Slide,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { addPeopleToList } from "../../utils/testApi/testApi";
import { lookupUser } from "../../utils/testApi/testApi";
import {
  peopleLookupValidationByUsername,
  peopleLookupValidationByPhone,
} from "../../utils/inputValidation";

const AddPeopleList = () => {
  const navigate = useNavigate();
  const textFieldUserRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [alert, setAlert] = useState(null);
  const [lookupByPhone, setLookupByPhone] = useState(true);
  const [peopleToAdd, setPeopleToAdd] = useState([]);
  const [recent, setRecent] = useState([]);
  const location = useLocation();

  // TODO:
  const handleFetchRecent = async () => {};

  const handleShowAlert = (severity, message) => {
    setAlert({
      severity: severity,
      message: message,
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleCreateUserSet = (users) => {
    return Array.from(
      new Map(users.map((obj) => [JSON.stringify(obj), obj])).values()
    );
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
    setLoading(true);
    setMessage(null);

    const valid = lookupByPhone
      ? await peopleLookupValidationByPhone(textFieldUserRef.current.value)
      : await peopleLookupValidationByUsername(textFieldUserRef.current.value);
    if (!valid?.validated) {
      setMessage({
        severity: "error",
        message: valid?.message,
        error: valid?.error,
      });
      setLoading(false);
      return;
    }

    const data = {
      userIdentifier: textFieldUserRef.current.value.toLowerCase(),
      criteria: lookupByPhone ? "PHONE" : "USERNAME",
    };

    const res = await lookupUser(data);
    if (res?.status === 200) {
      setRecent(handleCreateUserSet([res?.body, ...recent].flat()));
      setMessage({
        severity: "green",
        message: "User found successfully ✓",
        error: null,
      });
    } else if (res?.status === 201) {
      setMessage({
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
    const userNamesToAdd = peopleToAdd.map((e) => e.username);
    const data = {
      people: userNamesToAdd,
      listId: location.state.listId,
      containerId: location.state.containerId,
    };
    setLoading(true);
    const res = await addPeopleToList(data);
    if (res?.status === 200) {
      console.log(res?.body);
      navigate(-1);
    } else if (res?.status === 201) {
      console.log(res);
      handleShowAlert({ severity: "warning", message: "User not found." });
    } else if (res?.status === 401) {
      console.log(res);
      handleShowAlert({
        severity: "error",
        message: "Hmm... It seems like you are not authorized to do this.",
      });
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/login");
    } else {
      handleShowAlert({
        severity: "error",
        message:
          "Whoops! Something went wrong on our end. We are working to fix this",
      });
      console.log(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!(location.state?.listId && location.state?.containerId)) {
      navigate(-1);
    } else {
      handleFetchRecent();
    }
  }, []);
  return (
    <Grid container spacing={4} p>
      <Grid item sx={{ width: "100vw" }}>
        <Stack direction={"column"} spacing={1}>
          <Stack direction={"row"} alignItems={"center"}>
            <Switch
              checked={lookupByPhone}
              onChange={() => setLookupByPhone(!lookupByPhone)}
            />
            <Typography
              variant="button"
              sx={{ color: "#4B5563" }}
            >{`Toggle lookup option`}</Typography>
          </Stack>
          <Stack sx={{ width: "95vw" }}>
            {lookupByPhone && (
              <TextField
                sx={{}}
                error={message?.error && true}
                inputRef={textFieldUserRef}
                label={"Lookup user by phone"}
                type="tel"
                helperText={
                  <Typography color={message?.severity} variant="helperText">
                    {message?.message}
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
                error={message?.error && true}
                inputRef={textFieldUserRef}
                label={"Lookup user by email"}
                helperText={
                  <Typography color={message?.severity} variant="helperText">
                    {message?.message}
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
        <Typography variant="h5" textAlign={"left"}>
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
          {recent.map((user, i) => {
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
                    <Avatar
                      alt={`${user?.name}`}
                      src={`/static/images/avatar/${user?.name}.jpg`}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    id={labelId}
                    primary={`${user?.name} ${user?.lastName}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {peopleToAdd.length > 0 && (
          <Button
            disabled={loading}
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
          </Button>
        )}
      </Grid>
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
