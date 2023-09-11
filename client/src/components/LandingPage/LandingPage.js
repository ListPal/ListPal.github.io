import { Button, Alert, Typography, Slide, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import {
  getAllLists,
  logout,
  postRequest,
  checkSession,
} from "../../utils/testApi/testApi";
import { colors, groceryContainerTypes, messages, URLS } from "../../utils/enum";
import "./LandingPage.scss";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import GroceryListCard from "./GroceryListCard/GroceryListCard";
import NewListForm from "./NewListForm/NewListForm";
import { mobileWidth } from "../../utils/enum";
import { useLocation, useNavigate } from "react-router-dom";
import { truncateString } from "../../utils/helper";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton from "@mui/material/Skeleton";
// IMGS
import foodStrip from "../../utils/assets/foodStrip.jpg";
import grocery from "../../utils/assets/grocery.jpg";
import shop from "../../utils/assets/shop.jpg";
import todo from "../../utils/assets/todo.jpg";

const LandingPage = ({
  activeList,
  setActiveList,
  user,
  setUser,
  activeContainer,
  setActiveContainer,
}) => {
  // States
  const [alertMessage, setAlertMessage] = useState(null);
  const [severity, setSeverity] = useState("info");
  const [newListFormOpen, setNewListFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Other locals
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  // Handlers
  const showAlert = (severity, message) => {
    setAlertMessage(message);
    setSeverity(severity);
  };

  const checkItems = async () => {
    const data = {
      containerId: urlParams.get("containerId"),
      listId: activeList?.id,
      itemIds: activeList?.groceryListItems
        .filter((item) => item.checked)
        .map((item) => item.id),
    };
    return await postRequest(URLS.checkListItemUri, data);
  };

  const handleLogout = async () => {
    setLoading(true);
    if (activeList?.groceryListItems.length > 0) {
      // save checked items
      const checkResponse = await checkItems();
      if (checkResponse?.status === 403) {
        navigate("/");
      } else if (checkResponse?.status !== 200) {
        showAlert(
          "error",
          "Apologies. Somehing went wrong on our end. Please refresh the page and try again."
        );
        setLoading(false);
        return;
      }
    }

    // reset states and logout
    const res = await logout();
    if (res.status === 200) {
      setUser(null);
      setActiveContainer({ collapsedLists: [] });
      setActiveList({ groceryListItems: [] });
      navigate("/");
    } else {
      showAlert(
        "error",
        "Apologies. Failed log you out. Please refresh the page and try again."
      );
    }
    setLoading(false);
  };

  const getAllList = async () => {
    setLoading(true);
    // Get user info if the user object is null
    let userInfoResponse = { user: user };
    if (!userInfoResponse?.user) {
      userInfoResponse = await checkSession();
      if (userInfoResponse?.status !== 200) navigate("/");
      setUser(userInfoResponse?.user);
    }

    // Fetch lists from container
    const data = {
      userId: userInfoResponse?.user?.id,
      containerId: urlParams.get("containerId"),
    };
    const res = await getAllLists(data);
    if (res?.status === 200) {
      setActiveContainer(res?.body);
      if (activeContainer?.collapsedLists.length === 0)
        showAlert("info", "No lists yet to display. Create your first list 🥳");
      else showAlert("info", null);
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else if (res?.status === 400) {
      console.log(res);
    } else {
      showAlert("error", "Apologies, we are trying to fix an error.");
    }
    setTimeout(() => setLoading(false), 1200);
  };

  const handleDeriveHeadingColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors.landingPageColors.low;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.low;
    } else if (
      activeContainer?.containerType === groceryContainerTypes.whishlist
    ) {
      return colors.shoppingColors.low;
    } else {
      return "#E1F2F6";
    }
  };

  const handleDeriveBodyColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors.landingPageColors.bold;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.bold;
    } else if (
      activeContainer?.containerType === groceryContainerTypes.whishlist
    ) {
      return colors.shoppingColors.bold;
    } else {
      return "#1F2937";
    }
  };

  const handleEmptyContainerImg = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return grocery;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return todo;
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return shop;
    }
    return grocery; // TODO: error image
  };

  useEffect(() => {
    // Fetch only if there lists are not cached
    if (
      !activeContainer?.collapsedLists ||
      activeContainer?.collapsedLists.length === 0
    )
      getAllList();
    else console.log("Lists are cached. No need to fetch");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Grid container spacing={1} paddingTop={2} sx={{ maxWidth: mobileWidth }}>
        <Grid item>
          <Paper
            sx={{
              borderRadius: 0,
              height: "50vmin",
              width: "100vmin",
              maxWidth: mobileWidth,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {loading && (
              <Skeleton
                animation="wave"
                sx={{ borderRadius: 5, maxWidth: `calc(0.9 * ${mobileWidth})` }}
                width={"90vw"}
                height={130}
              />
            )}

            {!loading && (
              <Stack direction="column" padding={1} spacing={6}>
                <Stack
                  direction={"row"}
                  padding={1}
                  spacing={2}
                  sx={{
                    width: "90vw",
                    maxWidth: `calc(0.9 * ${mobileWidth})`,
                    backgroundColor: handleDeriveHeadingColor(),
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
                    }}
                  >
                    <IconButton
                      size={"small"}
                      disableRipple
                      onClick={() => navigate(-1)}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <Avatar
                      sx={{ width: 56, height: 56 }}
                      alt={user?.name}
                      src="[enter path here]"
                    />
                    <span style={{ width: "10px" }} />
                    {user?.name && truncateString(user?.name)}
                  </Typography>

                  <Button
                    disabled={loading}
                    size="small"
                    endIcon={<LogoutIcon />}
                    onClick={() => {
                      handleLogout();
                    }}
                    sx={{
                      color: "black",
                    }}
                  />
                </Stack>
                <Stack
                  direction={"column"}
                  sx={{
                    width: "calc(100vw - 5)",
                    maxWidth: mobileWidth,
                    height: 50,
                    backgroundImage: `url(${foodStrip})`,
                    backgroundSize: "cover",
                  }}
                />
              </Stack>
            )}
          </Paper>
        </Grid>

        <Grid item>
          {loading && (
            <Skeleton
              animation="wave"
              variant="rectangular"
              height={"35vmin"}
              width={"100vmin"}
              sx={{ maxWidth: mobileWidth }}
            />
          )}
          {!loading && (
            <Paper
              sx={{
                height: "35vmin",
                width: "100vmin",
                maxWidth: mobileWidth,
                borderRadius: 0,
                backgroundColor: handleDeriveBodyColor(),
              }}
            >
              <Stack
                direction="column"
                padding={5}
                spacing={2}
                sx={{ justifyContent: "center", alignItems: "center" }}
              >
                <Button
                  variant={"outlined"}
                  onClick={() => setNewListFormOpen(!newListFormOpen)}
                  sx={{
                    "&:hover": { border: "2px solid white" },
                    borderRadius: 0,
                    border: "2px solid white",
                    color: "white",
                  }}
                >
                  <Typography sx={{ color: "white" }}>
                    Create New List
                  </Typography>
                  <AddIcon fontSize="large" sx={{ color: "white" }} />
                </Button>
              </Stack>
            </Paper>
          )}
        </Grid>

        {loading && (
          <Paper sx={{ ml: 1, mt: 2, height: "60vmin", width: "100vmin" }}>
            <Stack direction={"column"}>
              <Skeleton
                animation={"wave"}
                variant="rectangular"
                sx={{ mt: 0, ml: 2, maxWidth: mobileWidth }}
                width={"92%"}
                height={150}
              />
              <Stack
                direction={"row"}
                sx={{ justifyContent: "space-between", pl: 4, pr: 4 }}
              >
                <Skeleton
                  animation={"wave"}
                  sx={{ mt: 1 }}
                  width={"50%"}
                  height={60}
                />
                <Skeleton
                  animation={"wave"}
                  sx={{ mt: 1, maxWidth: mobileWidth }}
                  width={"30%"}
                  height={60}
                />
              </Stack>
            </Stack>
          </Paper>
        )}

        {!loading &&
          activeContainer?.collapsedLists.map((e, i) => (
            <GroceryListCard
              activeContainer={activeContainer}
              setActiveContainer={setActiveContainer}
              listInfo={e}
              key={i}
            />
          ))}
      </Grid>

      {activeContainer?.collapsedLists.length === 0 && !loading && (
        <Grid item sx={{ maxWidth: mobileWidth }}>
          <Slide
            className="alert-slide"
            in={alertMessage && true}
            direction="right"
          >
            <Alert severity={severity}>{alertMessage}</Alert>
          </Slide>
          <img
            alt="decorative-background"
            src={handleEmptyContainerImg()}
            loading="lazy"
            height={400}
            width={400}
          />
        </Grid>
      )}

      <NewListForm
        activeContainer={activeContainer}
        setActiveContainer={setActiveContainer}
        user={user}
        open={newListFormOpen}
        setOpen={setNewListFormOpen}
      />
    </>
  );
};

export default LandingPage;
