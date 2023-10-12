import {
  Grid,
  Slide,
  Alert,
  Stack,
  styled,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { URLS, colors, messages, mobileWidth } from "../../utils/enum";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { checkSession, postRequest } from "../../utils/rest";
import {
  handleValidateLastName,
  handleValidateName,
  validationErrors,
} from "../../utils/inputValidation";

const ChangeName = ({ user, setUser }) => {
  const nameRef = useRef(null);
  const lastNameRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: null, message: null });
  const [alert, setAlert] = useState({ severity: "info", message: null });

  const handleShowHideAlert = (severity, message) => {
    setAlert({ severity: severity, message: message });
    hideAlert();
  };

  const hideAlert = () => {
    setTimeout(() => setAlert({ ...alert, message: null }), 2000);
  };

  const handleOnSave = async (name, lastName) => {
    // Reset states
    setLoading(true);
    setError({ error: null, message: null });

    // No changes
    if (name === user?.name && lastName === user?.lastName) {
      handleShowHideAlert("warning", "No changes made");
      setLoading(false);
      return;
    }

    // Validate name and last name
    let validation = await handleValidateName(name);
    if (!validation?.validated) {
      setError({ error: validation?.error, message: validation?.message });
      setLoading(false);
      return;
    }
    validation = await handleValidateLastName(lastName);
    if (!validation?.validated) {
      setError({ error: validation?.error, message: validation?.message });
      setLoading(false);
      return;
    }

    const data = { name: name, lastName: lastName };
    const res = await postRequest(URLS.updateName, data);
    if (res?.status === 200) {
      // Success
      setUser(res?.body);
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      console.debug("Unauthorized");
      handleShowHideAlert("error", messages.genericError);
    } else {
      console.debug(messages.genericError);
      handleShowHideAlert("error", messages.genericError);
    }
    setLoading(false);
  };

  const handleCheckAuth = async () => {
    if (!user) {
      const res = await checkSession();
      if (res?.status === 200) {
        // Success
        setUser(res?.user);
      } else {
        navigate("/");
      }
    }
  };

  useEffect(() => {
    handleCheckAuth();
  }, []);
  return (
    <>
      <meta name="theme-color" content="white" />
      <Slide severity={alert?.severity} in={alert?.message && true} sx={{ maxWidth: mobileWidth }}>
        <Alert>{alert?.message}</Alert>
      </Slide>
      <Grid container p={2} width={"100vw"} maxWidth={mobileWidth}>
        {/* Top buttons / title */}
        <Stack direction={"row"} width={"100%"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" fontFamily={"Urbanist"} textAlign={"left"}>
            Update Name
          </Typography>
        </Stack>

        <Divider sx={{ mt: 2, width: "100%", maxWidth: mobileWidth }} />

        {/*  Textfield(s) */}
        <Stack direction={"column"} spacing={2} pt={4} width={"100%"}>
          <Typography textAlign={"left"} fontFamily={"Urbanist"}>
            Manage your name <strong>{user?.name + " " + user?.lastName}</strong> 
          </Typography>
          <CssTextField
            error={error?.error === validationErrors.name}
            helperText={error?.error === validationErrors.name ? error?.message : ""}
            fullWidth
            defaultValue={user?.name}
            inputRef={nameRef}
            label={"First Name"}
            InputProps={{ style: { fontFamily: "Urbanist" } }}
            inputProps={{
              maxLength: 100,
            }}
          />
          <CssTextField
            error={error?.error === validationErrors.lastName}
            helperText={error?.error === validationErrors.lastName ? error?.message : ""}
            fullWidth
            defaultValue={user?.lastName}
            inputRef={lastNameRef}
            label={"Last Name"}
            InputProps={{ style: { fontFamily: "Urbanist" } }}
            inputProps={{
              maxLength: 100,
            }}
          />
          <LoadingButton
            loading={loading}
            endIcon={<></>}
            loadingPosition={"end"}
            variant={"contained"}
            onClick={() =>
              handleOnSave(nameRef?.current?.value.trim(), lastNameRef?.current?.value.trim())
            }
            sx={{
              background: colors.fallbackColors.bold,
              "&:hover": {
                background: colors.fallbackColors.bold,
                border: `2px solid ${colors.fallbackColors.bold}`,
              },
            }}
          >
            Save
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );
};

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#A0AAB4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: colors.fallbackColors.bold,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: `1px solid ${colors.fallbackColors.bold}`,
    },
    "&:hover fieldset": {
      borderColor: colors.fallbackColors.bold,
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.fallbackColors.bold,
    },
  },
});
export default ChangeName;
