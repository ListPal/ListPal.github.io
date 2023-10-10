import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Stack, styled } from "@mui/system";
import { useLocation, useNavigate } from "react-router";
import { colors, mobileWidth } from "../../utils/enum";
import { useEffect } from "react";
import { checkSession } from "../../utils/rest";

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleCheckAuth = async () => {
    if (!user) {
      console.log('no user')
      const res = await checkSession();
      if (res?.status === 200) {
        // Success
        console.log(res)
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
      <Grid container p={2} width={"100vw"} maxWidth={mobileWidth}>
        <Stack direction={"row"} width={"100%"}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" fontFamily={"Urbanist"} textAlign={"left"}>
            Account Settings
          </Typography>
        </Stack>
        <Divider sx={{mt: 2, width: '100%', maxWidth: mobileWidth}} />
        <Grid item width={"100%"}>
          <List>
            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-name")}
            >
              <ListItemText secondary={"Update Name"}>
                <Typography fontFamily={"Urbanist"} fontSize={20}>
                  {user?.name + " " + user?.lastName}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon sx={{ transform: "rotate(180deg)" }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Grid>

        <Grid item width={"100%"}>
          <List>
            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-email")}
            >
              <ListItemText secondary={"Update Email"}>
                <Typography fontFamily={"Urbanist"} fontSize={20}>
                  {user?.email}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon sx={{ transform: "rotate(180deg)" }} />
              </ListItemIcon>
            </ListItemButton>
            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-phone")}
            >
              <ListItemText>
                <Typography fontFamily={"Urbanist"} fontSize={20}>
                  {"Update Phone"}
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon sx={{ transform: "rotate(180deg)" }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Grid>

        <Grid item width={"100%"}>
          <List>
            <ListItemButton
              sx={{ height: "80px" }}
              onClick={() => navigate("/profile/change-password")}
            >
              <ListItemText>
                <Typography fontFamily={"Urbanist"} fontSize={20}>
                  Change Password
                </Typography>
              </ListItemText>
              <ListItemIcon>
                <ArrowBackIosIcon sx={{ transform: "rotate(180deg)" }} />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Grid>
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

export default Profile;
