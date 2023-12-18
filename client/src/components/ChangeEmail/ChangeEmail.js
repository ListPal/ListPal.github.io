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
import { handleValidateUsername } from "../../utils/inputValidation";

const ChangeEmail = ({ user, setUser, theme }) => {
  const usernameRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ severity: "success", message: null });

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
    setTimeout(() => setAlert({ severity: "success", message: null }), 2000);
  };

  const handleOnSave = async (newEmail) => {
    // Reset states
    setLoading(true);
    setError(null);

    // No changes
    if (newEmail === user?.email) {
      handleShowHideAlert("warning", "No changes made");
      setLoading(false);
      return;
    }

    // Validate email
    const validation = await handleValidateUsername(newEmail);
    if (!validation?.validated) {
      setError(validation?.message);
      setLoading(false);
      return;
    }

    const data = { email: newEmail };
    const res = await postRequest(URLS.updateEmail, data);
    if (res?.status === 200) {
      // Success
      setUser(res?.body);
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      handleShowHideAlert("error", messages.genericError);
      console.debug("Unauthorized");
    } else {
      handleShowHideAlert("error", messages.genericError);
      console.debug(messages.genericError);
    }
    setLoading(false);
  };

  const handleCheckAuth = async () => {
    if (!user || user?.anonymous) {
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
      <Slide
        severity={alert?.severity || "info"}
        in={alert?.message && true}
        sx={{ maxWidth: mobileWidth }}
      >
        <Alert>{alert?.message}</Alert>
      </Slide>
      <Grid container p={2} width={"100vw"} maxWidth={mobileWidth}>
        {/* Top buttons / title */}
        <Stack direction={"row"} width={"100%"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{color: colors[theme]?.generalColors.fontColor}}/>
          </IconButton>
          <Typography
            variant="h4"
            fontFamily={"Urbanist"}
            textAlign={"left"}
            color={colors[theme]?.generalColors.fontColor}
          >
            Change Email
          </Typography>
        </Stack>

        <Divider sx={{ mt: 2, width: "100%", maxWidth: mobileWidth }} />

        {/*  Textfield(s) */}
        <Stack direction={"column"} spacing={2} pt={4} width={"100%"}>
          <Typography
            textAlign={"left"}
            fontFamily={"Urbanist"}
            color={colors[theme]?.generalColors.fontColor}
          >
            Manage your username <strong>{user?.email}</strong> by updating your current email
          </Typography>
          <CssTextField
            error={error && true}
            helperText={error || ""}
            type={"email"}
            fullWidth
            inputRef={usernameRef}
            label={"Enter New Email"}
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
            onClick={() => handleOnSave(usernameRef.current.value)}
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

export default ChangeEmail;
