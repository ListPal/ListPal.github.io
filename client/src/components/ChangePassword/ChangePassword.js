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
import { URLS, colors, messages, mobileWidth } from "../../utils/enum";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { checkSession, postRequest } from "../../utils/rest";
// ICONS
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { handleValidatePassword } from "../../utils/inputValidation";

const ChangePassword = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ error: null, message: null });
  const [alert, setAlert] = useState({ severity: "success", message: null });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const navigate = useNavigate();

  const handleShowHideAlert = (severity, message) => {
    setAlert({ severity: severity, message: message });
    hideAlert();
  };

  const hideAlert = () => {
    setTimeout(() => setAlert({ severity: "success", message: null }), 2000);
  };

  const handleOnSave = async (currentPassword, newPassword) => {
    // Reset states
    setLoading(true);
    setError({ error: null, message: null });

    // Validate password
    let validation = await handleValidatePassword(currentPassword);
    if (!validation?.validated) {
      setError({ error: "current_password_error", message: validation?.message });
      setLoading(false);
      return;
    }

    validation = await handleValidatePassword(newPassword);
    if (!validation?.validated) {
      setError({ error: "new_password_error", message: validation?.message });
      setLoading(false);
      return;
    }

    const data = { currentPassword: currentPassword, newPassword: newPassword };
    const res = await postRequest(URLS.updatePassword, data);
    if (res?.status === 200) {
      // Success
      setUser(res?.body);
      handleShowHideAlert("success", "Password was successfully changed");
    } else if (res?.status === 201) {
      setError({ error: "current_password_error", message: "Wrong password" });
      console.debug("You entered the wrong current password.");
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      handleShowHideAlert({ severity: "error", message: messages.genericError });
      console.debug("Unauthorized");
    } else {
      console.debug(messages.genericError);
      handleShowHideAlert({ severity: "error", message: messages.genericError });
    }
    setLoading(false);
  };

  const handleDeriveVisibilityIcon = (visibilityState, setVisibilityState) => {
    setVisibilityState(!visibilityState);
  };

  const handleCheckAuth = async () => {
    if (!user) {
      const res = await checkSession();
      if (res?.status === 200) {
        // Success
        setUser(res?.body);
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
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" fontFamily={"Urbanist"} textAlign={"left"}>
            Password
          </Typography>
        </Stack>

        <Divider sx={{ mt: 2, width: "100%", maxWidth: mobileWidth }} />

        {/*  Textfield(s) */}
        <Stack direction={"column"} spacing={2} pt={4} width={"100%"}>
          <Typography textAlign={"left"} fontFamily={"Urbanist"}>
            Manage your profile security by updating your current password
          </Typography>
          {/* Current Password */}
          <CssTextField
            fullWidth
            helperText={error.error === "current_password_error" ? error.message : ""}
            error={error.error === "current_password_error"}
            type={showCurrentPassword ? "text" : "password"}
            label={"Enter Current Password"}
            inputRef={currentPasswordRef}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleDeriveVisibilityIcon(showCurrentPassword, setShowCurrentPassword)
                  }
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          {/* New Password */}
          <CssTextField
            fullWidth
            helperText={error?.error === "new_password_error" ? error.message : ""}
            error={error?.error === "new_password_error"}
            type={showNewPassword ? "text" : "password"}
            inputRef={newPasswordRef}
            label={"Enter New Password"}
            inputProps={{
              maxLength: 100,
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() => handleDeriveVisibilityIcon(showNewPassword, setShowNewPassword)}
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <LoadingButton
            loading={loading}
            endIcon={<></>}
            loadingPosition={"end"}
            variant={"contained"}
            onClick={() =>
              handleOnSave(currentPasswordRef.current.value, newPasswordRef.current.value)
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

export default ChangePassword;
