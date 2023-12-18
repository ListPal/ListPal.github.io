import { useState, useRef, useEffect } from "react";
import { Button, Typography, Grid, Stack, TextField, Divider, styled } from "@mui/material";
import { postRequest, checkSession } from "../../utils/rest";
import { URLS, colors, mobileWidth } from "../../utils/enum";
import { Link, useNavigate } from "react-router-dom";
import { usernamePasswordValidation } from "../../utils/inputValidation";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LoadingButton from "@mui/lab/LoadingButton";
import { generateRandomUserName } from "../../utils/helper";

const Login = ({ setActiveContainer, setUser, theme }) => {
  const [validation, setValidation] = useState({
    validated: true,
    message: null,
  });
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

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

  const handleLogin = async (username, password) => {
    setLoading(true);
    // Attempting to validate login input on the client side
    const valid = await usernamePasswordValidation(username, password);
    if (!valid.validated) {
      setValidation(valid);
      setLoading(false);
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
    setLoading(false);
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
    setUser({ name: null, username: generateRandomUserName(), anonymous: true });
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
      <meta name="theme-color" content={colors[theme]?.generalColors.outerBackground} />
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
          color={colors[theme]?.generalColors.fontColor}
          fontFamily={"Urbanist"}
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
        <CssTextField
          required
          error={!validation?.validated}
          id="username-input"
          label="Username"
          type="email"
          variant="outlined"
          inputRef={usernameRef}
          sx={{ width: "80vw", maxWidth: mobileWidth }}
          InputProps={{
            style: {
              fontFamily: "Urbanist",
              color: colors[theme]?.generalColors.helperTextFontColor,
            },
          }}
        />
        <CssTextField
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
          InputProps={{
            style: {
              color: colors[theme]?.generalColors.helperTextFontColor,
            },
          }}
        />
        <LoadingButton
          loading={loading}
          endIcon={<></>}
          loadingPosition="end"
          variant="contained"
          onClick={() => handleLogin(usernameRef.current.value, passwordRef.current.value)}
          sx={{
            fontFamily: "Urbanist",
            height: "50px",
            width: "80vw",
            maxWidth: mobileWidth,
            background: colors[theme]?.fallbackColors.bold,
            "&:hover": {
              background: colors[theme]?.fallbackColors.bold,
              border: `2px solid ${colors[theme]?.fallbackColors.bold}`,
            },
          }}
        >
          Login
        </LoadingButton>

        <Button
          disabled={loading}
          endIcon={<ElectricBoltIcon />}
          onClick={() => navigate("/quick-list")}
          sx={{
            fontFamily: "Urbanist",
            height: "50px",
            width: "80vw",
            maxWidth: mobileWidth,
            borderRadius: "20px 0px 20px 0px",
            background: colors[theme]?.quickListColors.bold,
            "&:hover": {
              background: colors[theme]?.quickListColors.bold,
              border: `2px solid ${colors[theme]?.quickListColors.bold}`,
            },
          }}
          variant="contained"
        >
          Quick List
        </Button>
        <Stack direction={"row"}>
          <Typography fontFamily={"Urbanist"} sx={{ color: colors[theme]?.generalColors.helperTextFontColor }}>
            Dont have an account?
          </Typography>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Typography color={colors[theme]?.generalColors.fontColor} fontFamily={"Urbanist"} sx={{ ml: 1, fontWeight: "570" }}>
              <strong>Sign Up</strong>
            </Typography>
          </Link>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default Login;
