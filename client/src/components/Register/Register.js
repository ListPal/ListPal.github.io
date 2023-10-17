import {
  Typography,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  IconButton,
  styled,
} from "@mui/material";
import { registrationValidation, validationErrors } from "../../utils/inputValidation";
import { useState, useRef } from "react";
import { postRequest, logout } from "../../utils/rest";
import { URLS, colors, mobileWidth } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";

const Register = ({ setUser, setActiveList, theme }) => {
  const [isPasswordVisibile, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisibile, setIsConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    validated: true,
    message: "",
  });

  const nameRef = useRef(null);
  const lastnameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const phoneRef = useRef(null);
  const navigate = useNavigate();

  const CssTextField = styled(TextField)({
    "& label.Mui-focused": {
      color: colors[theme].generalColors.helperTextFontColor,
    },
    "& label": {
      fontFamily: "Urbanist",
      color: colors[theme].generalColors.helperTextFontColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors[theme].generalColors.fontColor,
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: `1px solid ${colors[theme].generalColors.fontColor}`,
        borderRadius: 0,
      },
      "&:hover fieldset": {
        borderColor: colors[theme].generalColors.fontColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: colors[theme].generalColors.fontColor,
      },
    },
  });

  const handleDuplicatedAccountError = async () => {
    return {
      error: validationErrors.email_regex,
      message: "A user already exists with this email",
      validated: false,
    };
  };

  const handleEnsureCorrectPasswords = () => {
    return passwordRef.current.value === confirmPasswordRef.current.value;
  };

  const handleDeriveVisibilityIcon = (visibilityState, setVisibilityState) => {
    setVisibilityState(!visibilityState);
  };

  const handleRegister = async (name, lastName, username, password, phone) => {
    setLoading(true);
    const data = {
      name: name.trim() || "",
      lastName: lastName.trim() || "",
      phone: phone.trim() || "",
      email: username.toLowerCase().trim() || "",
      password: password || "",
    };

    // Validate regisration input on client side
    const valid = await registrationValidation(data);
    if (!valid?.validated) {
      setValidation(valid);
      setLoading(false);
      return;
    }

    // Ensure passwords match
    if (!handleEnsureCorrectPasswords()) {
      setValidation({
        error: validationErrors.password_mismatch,
        validated: false,
        message: "Passwords do not match.",
      });
      setLoading(false);
      return;
    }

    // Reset validation
    setActiveList({ groceryListItems: [] });
    setValidation({
      validated: true,
      message: "",
      error: null,
    });

    // Attempt to log user out if necessary
    setLoading(true);
    const loggedOut = await logout();
    if (loggedOut?.status === 200) {
      // logged out successfully, attempt to register new account
      const res = await postRequest(URLS.registerUri, data);
      if (res?.status === 200) {
        setUser(res?.user);
        navigate(`/containers`);
      } else if (res?.status === 403) {
        console.log(res);
        const duplicatedResponse = await handleDuplicatedAccountError();
        setValidation(duplicatedResponse);
      } else {
        console.log("Error on the server when registering user");
      }
    } else if (loggedOut?.status === 403) {
      console.log(loggedOut);
      setValidation({ error: null, validated: true, message: null });
    } else {
      console.log(loggedOut);
      console.log("Server error when trying to log out user");
    }
    setLoading(false);
  };

  return (
    <>
      <meta name="theme-color" content={colors[theme].generalColors.outerBackground} />
      {loading && (
        <>
          <CircularProgress
            color={"success"}
            sx={{
              position: "absolute",
              top: "50%",
              left: "45%",
              transform: "translate(-50%, 0)",
              zIndex: 10,
            }}
          />
        </>
      )}

      <Grid
        container
        sx={{
          maxWidth: mobileWidth,
        }}
      >
        <div
          style={{
            padding: 10,
            display: "flex",
            alignItems: "center",
            textAlign: "left",
            width: "100vw",
          }}
        >
          <ArrowBackIosIcon sx={{ color: colors[theme].generalColors.fontColor }} onClick={() => navigate("/")} />
          <Typography sx={{ color: colors[theme].generalColors.fontColor }} variant="h4">
            Create Account
          </Typography>
        </div>
        <Stack
          direction={"column"}
          pt={2}
          spacing={3}
          sx={{
            width: "100vw",
            maxWidth: mobileWidth,
            alignItems: "center",
          }}
        >
          <CssTextField
            autoFocus
            error={validation.error === validationErrors.name}
            helperText={validation.error === validationErrors.name && validation?.message}
            required
            id="name-input"
            label="Name"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={nameRef}
            InputProps={{
              style: { fontFamily: "Urbanist", color: colors[theme].generalColors.fontColor },
            }}
            inputProps={{
              maxLength: 20,
            }}
          />
          <CssTextField
            error={validation.error === validationErrors.lastName}
            helperText={validation.error === validationErrors.lastName && validation?.message}
            required
            id="last-name-input"
            label="Last Name"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={lastnameRef}
            InputProps={{
              style: { fontFamily: "Urbanist", color: colors[theme].generalColors.fontColor },
            }}
            inputProps={{
              maxLength: 40,
            }}
          />
          <CssTextField
            error={
              validation.error === validationErrors.email_regex ||
              validation.error === validationErrors.email_length
            }
            helperText={
              validation.error === validationErrors.email_regex ||
              validation.error === validationErrors.email_length
                ? validation?.message
                : "This will be your username"
            }
            required
            id="username-input"
            label="Email"
            type="email"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={usernameRef}
            InputProps={{
              style: { fontFamily: "Urbanist", color: colors[theme].generalColors.fontColor },
            }}
            inputProps={{
              maxLength: 100,
            }}
          />
          <CssTextField
            error={
              validation.error === validationErrors.password_regex ||
              validation.error === validationErrors.password_length
            }
            helperText={
              (validation.error === validationErrors.password_regex ||
                validation.error === validationErrors.password_length) &&
              validation?.message
            }
            required
            id="password-input"
            label="Password"
            type={isPasswordVisibile ? "text" : "password"}
            autoComplete="new-password"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={passwordRef}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              style: {
                color: colors[theme].generalColors.fontColor,
              },
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleDeriveVisibilityIcon(isPasswordVisibile, setIsPasswordVisible)
                  }
                >
                  {isPasswordVisibile ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <CssTextField
            error={validation.error === validationErrors.password_mismatch}
            helperText={
              validation.error === validationErrors.password_mismatch && validation?.message
            }
            required
            id="password-input2"
            label="Confirm Password"
            type={isConfirmPasswordVisibile ? "text" : "password"}
            autoComplete="new-password"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={confirmPasswordRef}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              style: {
                color: colors[theme].generalColors.fontColor,
              },
              endAdornment: (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleDeriveVisibilityIcon(
                      isConfirmPasswordVisibile,
                      setIsConfirmPasswordVisible
                    )
                  }
                >
                  {isConfirmPasswordVisibile ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <CssTextField
            error={
              validation.error === validationErrors.phone_regex ||
              validation.error === validationErrors.phone_length
            }
            helperText={
              validation.error === validationErrors.phone_regex ||
              validation.error === validationErrors.phone_length
                ? validation?.message
                : "We will not share your phone number."
            }
            id="phone-mumber-input"
            label="Phone Number"
            type="tel"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={phoneRef}
            InputProps={{
              style: { fontFamily: "Urbanist", color: colors[theme].generalColors.fontColor },
            }}
            inputProps={{
              maxLength: 10,
            }}
          />
          <LoadingButton
            loading={loading}
            endIcon={<></>}
            loadingPosition={"end"}
            sx={{
              position: "fixed",
              bottom: 30,
              borderRadius: "20px 0px 20px 0px",
              height: "50px",
              width: "80vw",
              maxWidth: mobileWidth,
              background: colors[theme].fallbackColors.bold,
              "&:hover": {
                background: colors[theme].fallbackColors.bold,
                border: `2px solid ${colors[theme].fallbackColors.bold}`,
              },
            }}
            variant="contained"
            onClick={() =>
              handleRegister(
                nameRef.current.value,
                lastnameRef.current.value,
                usernameRef.current.value,
                passwordRef.current.value,
                phoneRef.current.value
              )
            }
          >
            Welcome Aboard
          </LoadingButton>
        </Stack>
      </Grid>
    </>
  );
};

export default Register;
