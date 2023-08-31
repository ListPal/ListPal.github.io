import { useState, useRef, useEffect } from "react";
import {
  Button,
  Typography,
  Grid,
  Stack,
  TextField,
  Divider,
} from "@mui/material";
import { postRequest, checkSession } from "../../utils/testApi/testApi";
import { URLS, colors, mobileWidth } from "../../utils/enum";
import { Link, useNavigate } from "react-router-dom";
import vector from "../../utils/assets/login.jpg";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { usernamePasswordValidation } from "../../utils/inputValidation";

const Login = ({ setActiveContainer, setUser }) => {
  const [validation, setValidation] = useState({
    validated: true,
    message: null,
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    setButtonDisabled(true);
    // Attempting to validate login input on the client side
    const valid = await usernamePasswordValidation(username, password);
    if (!valid.validated) {
      setValidation(valid);
      setButtonDisabled(false);
      return;
    }

    // At this point, input was validated
    const data = {
      username: username,
      password: password,
    };

    // Attempting to login
    const res = await postRequest(URLS.loginUri, data);
    if (res.status === 200) {
      setValidation({ validated: true, message: "" });
      // TODO: Change logic when multiple containers feature is deployed
      setUser(res?.user);
      navigate(`/containers`);
    } else if (res.status === 403) {
      setValidation({
        validated: false,
        message: "Wrong username or password.",
      });
    } else {
      setValidation({
        validated: false,
        message: "Whoops! Something went wrong on our end.",
      });
    }
    setButtonDisabled(false);
  };

  const handleCheckSession = async () => {
    // Check if user is logged in already and redirect if so
    const res = await checkSession();
    if (res.status === 200) {
      setUser(res?.user);
      navigate(`/containers`);
    }
  };

  useEffect(() => {
    setUser(null);
    setActiveContainer({ collapsedLists: [] });
    handleCheckSession();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: mobileWidth,
      }}
    >
      <img
        alt="login-decoration"
        src={vector}
        loading="lazy"
        height={250}
        width={300}
      />
      <Stack
        direction={"column"}
        spacing={2}
        sx={{
          mt: 3,
          width: "100vw",
          maxWidth: mobileWidth,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            width: "100vw",
            textAlign: "left",
            paddingLeft: 5,
            maxWidth: mobileWidth,
          }}
        >
          Login
          <Divider sx={{ mt: 1, width: "90vw", maxWidth: mobileWidth }} />{" "}
        </Typography>
        <TextField
          color="success"
          required
          error={!validation?.validated}
          id="username-input"
          label="Username"
          type="email"
          variant="outlined"
          inputRef={usernameRef}
          sx={{ width: "80vw", maxWidth: mobileWidth }}
        />
        <TextField
          color="success"
          error={!validation?.validated}
          required
          id="password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="outlined"
          inputRef={passwordRef}
          helperText={!validation?.validated && validation?.message}
          sx={{ width: "80vw", maxWidth: mobileWidth }}
        />
        <Button
          disabled={buttonDisabled}
          variant="contained"
          onClick={() =>
            handleLogin(usernameRef.current.value, passwordRef.current.value)
          }
          sx={{
            borderRadius: "50px",
            height: "50px",
            width: "80vw",
            maxWidth: mobileWidth,
            background: colors.landingPageColors.bold,
            "&:hover": {
              background: colors.landingPageColors.bold,
              border: `2px solid ${colors.landingPageColors.bold}`,
            },
          }}
        >
          Login
        </Button>

        <Button
          disabled={buttonDisabled}
          endIcon={<ElectricBoltIcon />}
          onClick={() => navigate("/quick-list")}
          sx={{
            height: "50px",
            width: "80vw",
            maxWidth: mobileWidth,
            borderRadius: "50px",
            background: "#1F2937",
            "&:hover": {
              background: "#1F2937",
              border: `2px solid #1F2937`,
            },
          }}
          variant="contained"
        >
          Quick List
        </Button>
        <Stack direction={"row"}>
          <Typography sx={{ color: "gray" }}>Dont have an account?</Typography>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Typography sx={{ ml: 1, color: "#1F2937", fontWeight: "570" }}>
              Sign Up
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default Login;
