import {
  Button,
  Typography,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import {
  registrationValidation,
  validationErrors,
} from "../../utils/inputValidation";
import { useState, useRef } from "react";
import { postRequest, logout } from "../../utils/testApi/testApi";
import { URLS, mobileWidth } from "../../utils/enum";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Register = ({ setUser, setActiveList }) => {
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
    setVisibilityState(!visibilityState)
  };

  const handleRegister = async (name, lastName, username, password, phone) => {
    setLoading(true);
    const data = {
      name: name,
      lastName: lastName,
      phone: phone,
      username: username.toLowerCase(),
      email: username.toLowerCase(),
      password: password,
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
            borderRadius: "0px 0px 40px 0px",
            display: "flex",
            alignItems: "center",
            textAlign: "left",
            width: "100vw",
            background: "#1F2937",
            background: "#1F2937",
          }}
        >
          <ArrowBackIosIcon
            sx={{ color: "white" }}
            onClick={() => navigate("/")}
          />
          <Typography sx={{ color: "white" }} variant="h4">
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
            // boxShadow: "-1px -1px 8px lightgray",
            alignItems: "center",
          }}
        >
          <TextField
            error={validation.error === validationErrors.name}
            helperText={
              validation.error === validationErrors.name && validation?.message
            }
            required
            id="name-input"
            label="Name"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={nameRef}
            inputProps={{
              maxLength: 20,
            }}
          />
          <TextField
            error={validation.error === validationErrors.lastName}
            helperText={
              validation.error === validationErrors.lastName &&
              validation?.message
            }
            required
            id="last-name-input"
            label="Last Name"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={lastnameRef}
            inputProps={{
              maxLength: 40,
            }}
          />
          <TextField
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
            inputProps={{
              maxLength: 100,
            }}
          />
          <TextField
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
            autoComplete="current-password"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={passwordRef}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small" onClick={() => handleDeriveVisibilityIcon(isPasswordVisibile, setIsPasswordVisible)}>
                  {isPasswordVisibile ? <VisibilityOffIcon /> : <VisibilityIcon/> }
                </IconButton>
              ),
            }}
          />
          <TextField
            error={validation.error === validationErrors.password_mismatch}
            helperText={
              validation.error === validationErrors.password_mismatch &&
              validation?.message
            }
            required
            id="password-input2"
            label="Confirm Password"
            type={isConfirmPasswordVisibile ? "text" : "password"}
            autoComplete="current-password"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={confirmPasswordRef}
            inputProps={{
              maxLength: 50,
            }}
            InputProps={{
              endAdornment: (
                <IconButton size="small" onClick={() => handleDeriveVisibilityIcon(isConfirmPasswordVisibile, setIsConfirmPasswordVisible)}>
                  {isConfirmPasswordVisibile ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              ),
            }}
          />
          <TextField
            error={
              validation.error === validationErrors.phone_regex ||
              validation.error === validationErrors.phone_length
            }
            helperText={
              (validation.error === validationErrors.phone_regex ||
                validation.error === validationErrors.phone_length) ?
              validation?.message : 'We will not share your phone number.'
            }
            id="phone-mumber-input"
            label="Phone Number"
            type="tel"
            variant="filled"
            sx={{ width: "80vw", maxWidth: mobileWidth }}
            inputRef={phoneRef}
            inputProps={{
              maxLength: 10,
            }}
          />
          <Button
            disabled={loading}
            sx={{
              mt: 5,
              borderRadius: "20px 0px 20px 0px",
              height: "50px",
              width: "80vw",
              maxWidth: mobileWidth,
              background: "#1F2937",
              "&:hover": {
                background: "#1F2937",
                border: `2px solid "#1F2937`,
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
          </Button>
        </Stack>
      </Grid>
    </>
  );
};

export default Register;
