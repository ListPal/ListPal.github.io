import { useEffect } from "react";
import { Grid, Button, Stack, Typography, Avatar } from "@mui/material";
import Container from "./Container/Container";
import { truncateString } from "../../utils/helper";
import LogoutIcon from "@mui/icons-material/Logout";
import { colors, mobileWidth, themes } from "../../utils/enum";
import { logout } from "../../utils/rest";
import { useNavigate } from "react-router-dom";

const Containers = ({
  setUser,
  user,
  activeList,
  setActiveList,
  activeContainer,
  setActiveContainer,
  grocery,
  shop,
  todo,
  theme,
}) => {
  const imgSources = [shop, grocery, todo];
  const containerIds = ["wishlistContainerId", "groceryContainerId", "todoContainerId"];
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Reset states and logout
    const res = await logout();
    if (res.status === 200) {
      setUser(null);
      setActiveContainer({ collapsedLists: [] });
      setActiveList({ groceryListItems: [] });
      navigate("/");
    } else {
      console.debug("Failed log you out. Please refresh the page and try again.");
    }
  };

  useEffect(() => {
    if (!user) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <meta name="theme-color" content={colors[theme].generalColors.outerBackground} />
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: mobileWidth,
        }}
      >
        <Grid item>
          <Stack
            direction={"row"}
            padding={1}
            spacing={2}
            sx={{
              mt: 2,
              width: "90vw",
              maxWidth: mobileWidth,
              backgroundColor: colors[theme].generalColors.userTopMenu,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              padding={1}
              fontFamily={"Urbanist"}
              fontWeight={500}
              variant="h5"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <div
                onClick={() => navigate("/profile")}
                style={{
                  fontFamily: "Urbanist",
                  width: 56,
                  height: 56,
                  background: theme === themes.lightTheme ? 'lightgray' : "#707070",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                {user?.name[0] || "U"}
              </div>
              <span style={{ width: "10px" }} />
              {user?.name ? truncateString(user.name) : "Unknown"}
            </Typography>

            <Button
              size="small"
              endIcon={<LogoutIcon />}
              onClick={() => {
                handleLogout();
              }}
              sx={{
                color: "white",
              }}
            />
          </Stack>
        </Grid>
        <Stack
          sx={{
            width: "100vw",
            height: "5vh",
          }}
        />
        {/* Cards */}
        {user &&
          ["Shopping Lists", "Grocery Lists", "Other Lists"].map((e, i) => {
            return (
              <Container
                theme={theme}
                key={i}
                id={user[containerIds[i]]}
                heading={e}
                imgSrc={imgSources[i]}
                grocery={grocery}
                todo={todo}
                shop={shop}
              />
            );
          })}
      </Grid>
    </>
  );
};
export default Containers;
