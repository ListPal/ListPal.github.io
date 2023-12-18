import { Typography, IconButton, List, Fab, Slide, Alert, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllLists, logout, postRequest, checkSession } from "../../utils/rest";
import { groceryListScopes, filterCardsBy, groceryContainerTypes, colors, messages, themes, URLS } from "../../utils/enum";
import "./LandingPage.scss";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import GroceryListCard from "./GroceryListCard/GroceryListCard";
import NewListForm from "./NewListForm/NewListForm";
import { mobileWidth } from "../../utils/enum";
import { useLocation, useNavigate } from "react-router-dom";
import { generateRandomUserName, truncateString } from "../../utils/helper";
import PullToRefresh from "../PullToRefresh/PullToRefresh";
// ICONS
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton from "@mui/material/Skeleton";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import GroceryDarkThemeIcon from "../Icons/GroceryIcon";
import OtherDarkThemeIcon from "../Icons/OtherIcon";
import ShoppingDarkThemeIcon from "../Icons/ShoppingIcon";

const LandingPage = ({ todo, shop, activeList, setActiveList, user, setUser, activeContainer, setActiveContainer, grocery, theme }) => {
  // States
  // const [filter, setFilter] = useState(filterCardsBy.all);
  const [newListFormOpen, setNewListFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasRefactored, setWasRefactored] = useState(0);
  const [severity, setSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [updateTimer, setUpdateTimer] = useState(null);

  // Other locals
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers
  const handleRefresh = () => {
    // Data fetching logic
    pullLists();
  };

  const handleOpenNewListForm = () => {
    setNewListFormOpen(!newListFormOpen);
  };

  const handleRefactorLists = async () => {
    if (wasRefactored > 0) {
      console.log("Updating lists order");
      // Set the new order
      const collapsedLists = activeContainer?.collapsedLists.map((e, i) => {
        return { ...e, order: i };
      });
      const data = { containerId: activeContainer?.id, collapsedLists: collapsedLists };
      const res = await postRequest(URLS.refactorCollapsedLists, data);
      if (res?.status === 200) {
        setWasRefactored(0);
      } else if (res?.status === 401) {
        console.debug(res);
      } else if (res?.status === 403) {
        console.debug(res);
      } else {
        console.debug(res);
      }
    }
  };

  const showAlert = (severity, message) => {
    setAlertMessage(message);
    setSeverity(severity);
  };

  const handleLogout = async () => {
    setLoading(true);
    // Reset states and logout
    const res = await logout();
    if (res.status === 200) {
      setUser({ name: null, username: generateRandomUserName(), anonymous: true });
      setActiveContainer({ collapsedLists: [] });
      setActiveList({ groceryListItems: [] });
      navigate("/login");
    } else {
      showAlert("error", "Failed log you out. Please try again later.");
      setTimeout(() => setSeverity("info"), 3000);
    }
    setLoading(false);
  };

  const pullLists = async () => {
    setLoading(true);
    // Get user info if the user object is null
    let userInfoResponse = { user: user };
    if (!userInfoResponse?.user || userInfoResponse?.user?.anonymous) {
      userInfoResponse = await checkSession();
      if (userInfoResponse?.status !== 200) {
        navigate("/");
        return;
      } else {
        setUser(userInfoResponse?.user);
      }
    }

    // Fetch lists from container
    const data = {
      userId: userInfoResponse?.user?.id,
      containerId: location?.state?.containerId,
    };
    const res = await getAllLists(data);
    if (res?.status === 200) {
      setActiveContainer(res?.body);
    } else if (res?.status === 401) {
      showAlert("warning", messages.unauthorizedAction);
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else if (res?.status === 400) {
      console.log(res);
    } else {
      showAlert("error", messages.genericError);
    }
    setTimeout(() => setLoading(false), 1200);
  };

  const handleDeriveHeadingColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors[theme]?.landingPageColors.low;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors[theme]?.todoColors.low;
    } else if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return colors[theme]?.shoppingColors.low;
    } else {
      return colors[theme]?.fallbackColors.low;
    }
  };

  const handleDeriveCardBackgroundColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors[theme]?.landingPageColors.medium;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors[theme]?.todoColors.medium;
    } else if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return colors[theme]?.shoppingColors.medium;
    } else {
      return colors[theme]?.fallbackColors.medium;
    }
  };

  const handleContainerImg = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return <GroceryDarkThemeIcon color={colors[theme].landingPageColors.icon} />;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return (
        <OtherDarkThemeIcon
          color={colors[theme].generalColors.innerBackground}
          trace={theme == themes.lightTheme ? colors[theme].generalColors.fontColor : colors[theme].generalColors.outerBackground}
        />
      );
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return <ShoppingDarkThemeIcon color={colors[theme].generalColors.highlight} secondary={colors[theme].shoppingColors.emptyListIcon} />;
    }
    return grocery; // TODO: error image
  };

  const handleOnDragEnd = (result) => {
    // Prevents errors for dragging out of bounds
    if (!result.destination) return;

    const collapsedLists = activeContainer?.collapsedLists;
    const [reorderedItem] = collapsedLists.splice(result.source.index, 1);
    collapsedLists.splice(result.destination.index, 0, reorderedItem);
    setActiveContainer({ ...activeContainer, collapsedList: collapsedLists });
    setWasRefactored((wasRefactored) => wasRefactored + 1);
  };

  const handleCheckItemsInterval = async () => {
    if (updateTimer !== null) {
      // Haven't sent items yet, so clear the timeout and start a new attempt
      console.log("Resetting the timer...");
      clearTimeout(updateTimer);
    }
    // Set a new timer to update the database after 3 seconds
    const timer = setTimeout(() => {
      handleRefactorLists();
    }, 2000); // Adjust the delay as needed

    setUpdateTimer(timer);
  };

  useEffect(() => {
    handleCheckItemsInterval();
  }, [wasRefactored]);

  // Pull lists
  useEffect(() => {
    // Fetch only if lists are not cached
    if (!location?.state?.containerId || activeContainer?.id !== location?.state?.containerId || user?.name === "Anonymous") pullLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // margin -40px and padding +40px avoids an issue with the pull to refresh
    <PullToRefresh onRefresh={handleRefresh}>
      <meta name="theme-color" content={colors[theme]?.generalColors.outerBackground} />
      <Slide in={severity === "error"} sx={{ position: "fixed", top: 0, zIndex: 10, maxWidth: mobileWidth, minWidth: "90%" }}>
        <Alert severity="error"> {alertMessage} </Alert>
      </Slide>
      <Grid spacing={1} container sx={{ maxWidth: mobileWidth, alignItems: "center" }}>
        <Grid item>
          <Paper
            elevation={0}
            sx={{
              paddingTop: 2,
              paddingBottom: 3,
              borderRadius: 0,
              width: "100vmin",
              maxWidth: mobileWidth,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              backgroundColor: colors[theme]?.generalColors.outerBackground,
            }}
          >
            {loading && (
              <Skeleton animation="wave" sx={{ borderRadius: 5, maxWidth: `calc(0.9 * ${mobileWidth})` }} width={"90vw"} height={130} />
            )}

            {/* User Info Menu Bar */}
            {!loading && (
              <Stack
                direction={"row"}
                padding={1}
                sx={{
                  width: "90vw",
                  maxWidth: `calc(0.9 * ${mobileWidth})`,
                  backgroundColor: handleDeriveHeadingColor(),
                  borderRadius: 5,
                  alignItems: "center",
                  justifyContent: "space-between",
                  color: colors[theme]?.generalColors.fontColor,
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
                  }}
                >
                  {/*  Back Button */}
                  <IconButton size={"small"} disableRipple onClick={() => navigate(-1)}>
                    <ArrowBackIosIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
                  </IconButton>

                  {/* Avatar */}
                  <div
                    onClick={() => navigate("/profile")}
                    style={{
                      width: 56,
                      height: 56,
                      background: theme === themes.lightTheme ? "lightgray" : "#707070",
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
                  {user?.name && truncateString(user?.name)}
                </Typography>

                {/* Log out button */}
                <IconButton disabled={loading} onClick={handleLogout}>
                  <LogoutIcon fontSize={"small"} sx={{ color: colors[theme]?.generalColors.fontColor }} />
                </IconButton>
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* TODO:Search Bar */}

        {/* ListCard below */}
        <Grid item>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="list-items">
              {(provided, snapshot) => (
                <List sx={{ pb: 2, maxWidth: mobileWidth, width: "100vw" }} {...provided.droppableProps} ref={provided.innerRef}>
                  {loading && (
                    <Stack width={"100vw"} direction={"column"} mt={5} spacing={2}>
                      {[1, 2, 3].map((e, i) => (
                        <Skeleton key={i} animation={"wave"} variant="rectangular" sx={{ maxWidth: mobileWidth }} height={150} />
                      ))}
                    </Stack>
                  )}

                  {!loading &&
                    activeContainer?.collapsedLists &&
                    activeContainer?.collapsedLists.map((e, i) => (
                      <GroceryListCard
                        index={i}
                        username={user?.username}
                        activeContainer={activeContainer}
                        setActiveContainer={setActiveContainer}
                        listInfo={e}
                        key={i}
                        theme={handleDeriveCardBackgroundColor()}
                        themes={theme}
                      />
                    ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>

        {/* Add button */}
        {!loading && (
          <Fab
            onClick={handleOpenNewListForm}
            sx={{
              background: "black",
              position: "fixed",
              bottom: 40,
              right: 40,
              "&:hover": { background: "black", border: "2px solid black" },
            }}
          >
            <AddIcon sx={{ color: "white" }} />
          </Fab>
        )}

        {/*  Decorative background */}
        {activeContainer?.collapsedLists.length < 1 && !loading && (
          <Grid
            item
            sx={{
              width: "100vw",
              maxWidth: mobileWidth,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {handleContainerImg()}

            <Typography
              fontFamily={"Urbanist"}
              variant={"h5"}
              color={theme === themes.darkTheme ? colors.darkTheme.generalColors.fontColor : "GrayText"}
            >
              No lists yet to display
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* New list form dialog */}
      <NewListForm
        activeContainer={activeContainer}
        setActiveContainer={setActiveContainer}
        user={user}
        open={newListFormOpen}
        setOpen={setNewListFormOpen}
        theme={theme}
      />
    </PullToRefresh>
  );
};

export default LandingPage;
