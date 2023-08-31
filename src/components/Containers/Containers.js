import { useEffect } from "react";
import { Grid, Button, Stack, Typography, Avatar } from "@mui/material";
import Container from "./Container/Container";
import { truncateString } from "../../utils/helper";
import LogoutIcon from "@mui/icons-material/Logout";
import { URLS, mobileWidth } from "../../utils/enum";
import { postRequest, logout } from "../../utils/testApi/testApi";
import { useNavigate } from "react-router-dom";
import grocery from "../../utils/assets/grocery.jpg";
import shop from "../../utils/assets/shop.jpg";
import todo from "../../utils/assets/todo.jpg";

const Containers = ({
  user,
  activeList,
  setActiveList,
  activeContainer,
  setActiveContainer,
}) => {
  const navigate = useNavigate();

  const checkItems = async () => {
    const data = {
      containerId: activeContainer?.id,
      listId: activeList[0]?.listId,
      itemIds: activeList?.groceryListItems
        .filter((item) => item.checked)
        .map((item) => item.id),
    };
    const res = await postRequest(URLS.checkListItemUri, data);
    console.debug("Attempt to save checks: " + res);
  };

  const handleLogout = async () => {
    if (activeList) {
      // save checked items
      await checkItems();
    }

    // reset states and logout
    const res = await logout();
    if (res.status === 200) {
      setActiveList({ groceryListItems: [] });
      setActiveContainer({ collapsedLists: [] });
      navigate("/login");
    } else {
      console.log("Error logging out: " + res?.status);
    }
  };

  useEffect(() => {
    if (!user) navigate("/login");
    else setActiveContainer({ collapsedLists: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
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
              backgroundColor: "black",
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={user?.name}
                src="[enter path here]"
              />
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

        <Grid item>
          {user &&
            ["Shopping List", "Grocery List", "To-do List"].map((e, i) => {
              return (
                <Container
                  key={i}
                  id={user[containerIds[i]]}
                  setActiveContainer={setActiveContainer}
                  heading={e}
                  imgSrc={imgSources[i]}
                />
              );
            })}
        </Grid>
      </Grid>
    </>
  );
};

const imgSources = [shop, grocery, todo];
const containerIds = [
  "wishlistContainerId",
  "groceryContainerId",
  "todoContainerId",
];
export default Containers;
