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
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { URLS, colors, messages, mobileWidth } from "../../utils/enum";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { checkSession, postRequest } from "../../utils/rest";
import {
  handleValidateLastName,
  handleValidateName,
  validationErrors,
} from "../../utils/inputValidation";

const ChangeName = ({ user, setUser, theme }) => {
  const nameRef = useRef(null);
  const lastNameRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: null, message: null });
  const [alert, setAlert] = useState({ severity: "info", message: null });

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
      <meta name="theme-color" content={colors[theme]?.generalColors.outerBackground} />
      <Slide severity={alert?.severity} in={alert?.message && true} sx={{ maxWidth: mobileWidth }}>
        <Alert>{alert?.message}</Alert>
      </Slide>
      <Grid container p={2} width={"100vw"} maxWidth={mobileWidth}>
        {/* Top buttons / title */}
        <Stack direction={"row"} width={"100%"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{color: colors[theme]?.generalColors.fontColor}}/>
          </IconButton>
          <Typography variant="h4" fontFamily={"Urbanist"} textAlign={"left"} color={colors[theme]?.generalColors.fontColor}>
            Update Name
          </Typography>
        </Stack>

        <Divider sx={{ mt: 2, width: "100%", maxWidth: mobileWidth }} />

        {/*  Textfield(s) */}
        <Stack direction={"column"} spacing={2} pt={4} width={"100%"}>
          <Typography textAlign={"left"} fontFamily={"Urbanist"} color={colors[theme]?.generalColors.fontColor}>
            Manage your name <strong>{user?.name + " " + user?.lastName}</strong>
          </Typography>
          <CssTextField
            error={error?.error === validationErrors.name}
            helperText={error?.error === validationErrors.name ? error?.message : ""}
            fullWidth
            defaultValue={user?.name}
            inputRef={nameRef}
            label={"First Name"}
            InputProps={{ style: { fontFamily: "Urbanist", color: colors[theme]?.generalColors.fontColor } }}
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
            InputProps={{ style: { fontFamily: "Urbanist", color: colors[theme]?.generalColors.fontColor } }}
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
              background: colors[theme]?.fallbackColors.bold,
              "&:hover": {
                background: colors[theme]?.fallbackColors.bold,
                border: `2px solid ${colors[theme]?.fallbackColors.bold}`,
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
export default ChangeName;
