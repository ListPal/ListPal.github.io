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
import { handleValidatePhone } from "../../utils/inputValidation";

const ChangePhone = ({ user, setUser }) => {
  const phoneRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ severity: "success", message: null });

  const handleShowHideAlert = (severity, message) => {
    setAlert({ severity: severity, message: message });
    hideAlert();
  };

  const hideAlert = () => {
    setTimeout(() => setAlert({ severity: "success", message: null }), 2000);
  };

  const handleOnSave = async (newPhone) => {
    // Reset states
    setLoading(true);
    setError(null);

    // No changes
    if (newPhone === user?.phone) {
      handleShowHideAlert("warning", "No changes made");
      setLoading(false);
      return;
    }

    // Validate input
    const validation = await handleValidatePhone(newPhone);
    if (!validation?.validated) {
      setError(validation?.message);
      setLoading(false);
      return;
    }

    const data = { phone: newPhone };
    const res = await postRequest(URLS.updatePhone, data);
    if (res?.status === 200) {
      // Success
      setUser(res?.body);
    } else if (res?.status === 403) {
      navigate("/");
    } else if (res?.status === 401) {
      console.debug("Unauthorized");
    } else {
      console.debug(messages.genericError);
    }
    setLoading(false);
  };

  const handleCheckAuth = async () => {
    if (!user) {
      const res = await checkSession();
      if (res?.status === 200) {
        // Success
        setUser(res?.body);
      } else if (res?.status === 403) {
        navigate("/");
      } else {
        handleShowHideAlert({ severity: "error", message: messages.genericError });
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
            Update Phone
          </Typography>
        </Stack>

        <Divider sx={{ mt: 2, width: "100%", maxWidth: mobileWidth }} />

        {/*  Textfield(s) */}
        <Stack direction={"column"} spacing={2} pt={4} width={"100%"}>
          <Typography textAlign={"left"} fontFamily={"Urbanist"}>
            Manage your contact info by updating you current phone <strong>{user?.phone}</strong>
          </Typography>
          <CssTextField
            type={"tel"}
            helperText={error || ""}
            error={error && true}
            fullWidth
            inputRef={phoneRef}
            label={"Enter New Phone"}
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
            onClick={() => handleOnSave(phoneRef.current.value)}
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

export default ChangePhone;
