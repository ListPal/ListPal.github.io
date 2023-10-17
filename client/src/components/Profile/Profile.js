import {
  Alert,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Slide,
  Typography,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Stack, styled } from "@mui/system";
import { useNavigate } from "react-router";
import { URLS, colors, messages, mobileWidth, themes } from "../../utils/enum";
import { useEffect, useState } from "react";
import { checkSession, postRequest } from "../../utils/rest";

const Profile = ({ user, setUser, theme, setTheme }) => {
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ severity: "error", message: null });

  const handleShowHideAlert = (severity, message) => {
    setAlert({ severity: severity, message: message });
    setTimeout(() => setAlert({ severity: "error", message: null }), 3000);
  };

  const handleToggleTheme = () => {
    if (theme === themes.darkTheme) {
      setTheme(themes.lightTheme);
      return themes.lightTheme;
    } else {
      setTheme(themes.darkTheme);
      return themes.darkTheme;
    }
  };

  const handleCheckAuth = async () => {
    if (!user) {
      console.log("no user");
      const res = await checkSession();
      if (res?.status === 200) {
        // Success
        setUser(res?.user);
      } else {
        console.debug(res);
        navigate("/");
      }
    }
  };

  const handleUpdateUserPreferences = async () => {
    const data = { theme: handleToggleTheme() };
    const res = await postRequest(URLS.updateUserPreferences, data);
    if (res?.status === 200) {
      setUser({ ...user, userPreferences: res?.body });
    } else {
      console.log(res);
      handleShowHideAlert("error", messages.genericError);
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
        <Stack direction={"row"} width={"100%"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
          </IconButton>
          <Typography
            variant="h4"
            fontFamily={"Urbanist"}
            textAlign={"left"}
            color={colors[theme]?.generalColors.fontColor}
          >
            Account Settings
          </Typography>
        </Stack>
        <Divider
          sx={{
            mt: 2,
            width: "100%",
            maxWidth: mobileWidth,
          }}
        />
        <Grid item width={"100%"}>
          <List>
            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-name")}
            >
              <ListItemText
                secondary={
                  <Typography
                    variant={"subtitle2"}
                    fontFamily={"Urbanist"}
                    color={colors[theme]?.generalColors.helperTextFontColor}
                  >
                    {"Update Name"}
                  </Typography>
                }
              >
                <Typography
                  fontFamily={"Urbanist"}
                  fontSize={20}
                  color={colors[theme]?.generalColors.fontColor}
                >
                  {user?.name + " " + user?.lastName}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon
                  sx={{ transform: "rotate(180deg)", color: colors[theme]?.generalColors.fontColor }}
                />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-email")}
            >
              <ListItemText
                secondary={
                  <Typography
                    variant={"subtitle2"}
                    fontFamily={"Urbanist"}
                    color={colors[theme]?.generalColors.helperTextFontColor}
                  >
                    {"Update Email"}
                  </Typography>
                }
              >
                <Typography
                  fontFamily={"Urbanist"}
                  fontSize={20}
                  color={colors[theme]?.generalColors.fontColor}
                >
                  {user?.email}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon
                  sx={{ transform: "rotate(180deg)", color: colors[theme]?.generalColors.fontColor }}
                />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-phone")}
            >
              <ListItemText>
                <Typography
                  fontFamily={"Urbanist"}
                  fontSize={20}
                  color={colors[theme]?.generalColors.fontColor}
                >
                  {"Update Phone"}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon
                  sx={{ transform: "rotate(180deg)", color: colors[theme]?.generalColors.fontColor }}
                />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-password")}
            >
              <ListItemText>
                <Typography
                  fontFamily={"Urbanist"}
                  fontSize={20}
                  color={colors[theme]?.generalColors.fontColor}
                >
                  Change Password
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon
                  sx={{ transform: "rotate(180deg)", color: colors[theme]?.generalColors.fontColor }}
                />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton sx={{ height: "80px" }} onClick={handleUpdateUserPreferences}>
              <ListItemText>
                <Typography
                  fontFamily={"Urbanist"}
                  fontSize={20}
                  color={colors[theme]?.generalColors.fontColor}
                >
                  Toggle Theme
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <Brightness4Icon sx={{color: colors[theme]?.generalColors.fontColor}}/>
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
    </>
  );
};

export default Profile;
