import { Button, Alert, Typography, Slide, IconButton, List } from "@mui/material";
import { useState, useEffect } from "react";
import { getAllLists, logout, postRequest, checkSession } from "../../utils/rest";
import {
  colors,
  filterCardsBy,
  groceryContainerTypes,
  groceryListScopes,
  messages,
  URLS,
} from "../../utils/enum";
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
// ICONS
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicIcon from "@mui/icons-material/Public";
import KeyIcon from "@mui/icons-material/Key";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Skeleton from "@mui/material/Skeleton";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import PullToRefresh from "pulltorefreshjs";

const LandingPage = ({
  activeList,
  setActiveList,
  user,
  setUser,
  activeContainer,
  setActiveContainer,
  groceryStrip,
  shoppingStrip,
  todoStrip,
  grocery,
  todo,
  shop,
}) => {
  // States
  const [filter, setFilter] = useState(filterCardsBy.all);
  const [severity, setSeverity] = useState("info");
  const [newListFormOpen, setNewListFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wasRefactored, setWasRefactored] = useState(false);
  const [alertMessage, setAlertMessage] = useState(
    "No lists yet to display. Create your first list 🥳"
  );

  // Other locals
  const navigate = useNavigate();
  const location = useLocation();

  // Handlers
  const handleOpenNewListForm = () => {
    setNewListFormOpen(!newListFormOpen);
  };
  const handleBack = async () => {
    if (wasRefactored) {
      // Set the new order
      const collapsedLists = activeContainer?.collapsedLists.map((e, i) => {
        return { ...e, order: i };
      });
      const data = { containerId: activeContainer?.id, collapsedLists: collapsedLists };
      const res = await postRequest(URLS.refactorCollapsedLists, data);
      if (res?.status === 200) {
        setWasRefactored(false);
        navigate(-1);
      } else if (res?.status === 401) {
        setWasRefactored(false);
        navigate("/");
      } else if (res?.status === 403) {
        setWasRefactored(false);
        navigate("/");
      } else {
        setWasRefactored(false);
        console.debug(res);
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const showAlert = (severity, message) => {
    setAlertMessage(message);
    setSeverity(severity);
  };

  const handleDeriveStrip = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return groceryStrip;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return todoStrip;
    } else if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return shoppingStrip;
    } else {
      return todoStrip;
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    // Reset states and logout
    const res = await logout();
    if (res.status === 200) {
      setUser(null);
      setActiveContainer({ collapsedLists: [] });
      setActiveList({ groceryListItems: [] });
      navigate("/");
    } else {
      showAlert("error", "Failed log you out. Please refresh the page and try again.");
    }
    setLoading(false);
  };

  const pullLists = async () => {
    setLoading(true);
    // Get user info if the user object is null
    let userInfoResponse = { user: user };
    if (!userInfoResponse?.user) {
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
      return colors.landingPageColors.low;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.low;
    } else if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return colors.shoppingColors.low;
    } else {
      return colors.fallbackColors.low;
    }
  };

  const handleDeriveBodyColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors.landingPageColors.bold;
    } else if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.bold;
    } else if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return colors.shoppingColors.bold;
    } else {
      return colors.fallbackColors.bold;
    }
  };

  const handleContainerImg = () => {
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

  const handlefilterListByScope = (lists) => {
    if (filter === filterCardsBy.all) {
      return lists;
    }
    if (filter === filterCardsBy.public) {
      const filteredLists = lists.filter((e) => e.scope === groceryListScopes.public);
      return filteredLists;
    }
    if (filter === filterCardsBy.private) {
      const filteredLists = lists.filter((e) => e.scope === groceryListScopes.private);
      return filteredLists;
    }
    if (filter === filterCardsBy.restricted) {
      const filteredLists = lists.filter((e) => e.scope === groceryListScopes.restricted);
      return filteredLists;
    }
  };

  const handleOnDragEnd = (result) => {
    // Prevents errors for dragging out of bounds
    if (!result.destination) return;

    const collapsedLists = activeContainer?.collapsedLists;
    const [reorderedItem] = collapsedLists.splice(result.source.index, 1);
    collapsedLists.splice(result.destination.index, 0, reorderedItem);
    setActiveContainer({ ...activeContainer, collapsedList: collapsedLists });
    setWasRefactored(true);
  };

  useEffect(() => {
    // Initialize pull to refresh component
    PullToRefresh.init({
      mainElement: "body",
      onRefresh() {
        window.location.reload();
      },
    });

    // Fetch only if lists are not cached
    if (activeContainer?.id !== location?.state?.containerId) {
      pullLists();
    } else {
      // console.debug("Lists are cached. No need to fetch");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <meta name="theme-color" content={"white"} />
      <Grid spacing={1} container sx={{ maxWidth: mobileWidth, alignItems: "center" }}>
        <Grid item>
          <Paper
            elevation={1}
            sx={{
              borderRadius: 0,
              height: "25vh",
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

            {/* User Info Menu Bar */}
            {!loading && (
              <Stack
                direction="column"
                padding={1}
                sx={{ height: "100%", justifyContent: "space-between", alignItems: "center" }}
              >
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
                    fontFamily={"Urbanist"}
                    fontWeight={500}
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton size={"small"} disableRipple onClick={handleBack}>
                      <ArrowBackIosIcon />
                    </IconButton>
                    <div
                      onClick={() => navigate("/profile")}
                      style={{
                        width: 56,
                        height: 56,
                        background: "lightgray",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: 'white'
                      }}
                    >
                      {user?.name[0] || "U"}
                    </div>
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
                    width: "100vw",
                    maxWidth: mobileWidth,
                    height: 40,
                    backgroundImage: `url(${handleDeriveStrip()})`,
                    backgroundSize: "cover",
                  }}
                />
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Create List Menu */}
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
              elevation={0}
              sx={{
                display: "flex",
                width: "100vw",
                maxWidth: mobileWidth,
                borderRadius: 0,
                backgroundColor: handleDeriveBodyColor(),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Stack direction="column" padding={5} spacing={2}>
                <Button
                  variant={"outlined"}
                  onClick={handleOpenNewListForm}
                  sx={{
                    "&:hover": { border: "2px solid white" },
                    borderRadius: 0,
                    border: "2px solid white",
                    color: "white",
                  }}
                >
                  <Typography sx={{ color: "white" }}>Create New List</Typography>
                  <AddIcon fontSize="large" sx={{ color: "white" }} />
                </Button>
              </Stack>
            </Paper>
          )}
        </Grid>

        {/* Filter options below */}
        <Grid item>
          {!loading && (
            <Paper elevation={0}>
              <Stack p spacing={1} width={"100%"} ml direction={"row"}>
                <IconButton
                  onClick={() => setFilter(filterCardsBy.public)}
                  sx={{
                    color: filter === filterCardsBy.public && handleDeriveBodyColor(),
                    background: filter === filterCardsBy.public && handleDeriveHeadingColor(),
                    "&:hover": {
                      background: handleDeriveHeadingColor(),
                    },
                  }}
                >
                  <PublicIcon />
                </IconButton>
                <IconButton
                  onClick={() => setFilter(filterCardsBy.all)}
                  sx={{
                    color: filter === filterCardsBy.all && handleDeriveBodyColor(),
                    background: filter === filterCardsBy.all && handleDeriveHeadingColor(),
                    "&:hover": {
                      background: handleDeriveHeadingColor(),
                    },
                  }}
                >
                  <AllInclusiveIcon />
                </IconButton>
                <IconButton
                  onClick={() => setFilter(filterCardsBy.private)}
                  sx={{
                    color: filter === filterCardsBy.private && handleDeriveBodyColor(),
                    background: filter === filterCardsBy.private && handleDeriveHeadingColor(),
                    "&:hover": {
                      background: handleDeriveHeadingColor(),
                    },
                  }}
                >
                  <LockOutlinedIcon />
                </IconButton>
                <IconButton
                  onClick={() => setFilter(filterCardsBy.restricted)}
                  sx={{
                    color: filter === filterCardsBy.restricted && handleDeriveBodyColor(),
                    background: filter === filterCardsBy.restricted && handleDeriveHeadingColor(),
                    "&:hover": {
                      background: handleDeriveHeadingColor(),
                    },
                  }}
                >
                  <KeyIcon />
                </IconButton>
              </Stack>
            </Paper>
          )}
        </Grid>

        {/* ListCard below */}
        <Grid item>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="list-items">
              {(provided, snapshot) => (
                <List
                  sx={{ pb: 2, maxWidth: mobileWidth, width: "100vw" }}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {loading && (
                    <Stack width={"100vw"} direction={"column"} mt={5}>
                      <Skeleton
                        animation={"wave"}
                        variant="rectangular"
                        sx={{ maxWidth: mobileWidth }}
                        height={150}
                      />
                    </Stack>
                  )}

                  {!loading &&
                    activeContainer?.collapsedLists &&
                    handlefilterListByScope(activeContainer?.collapsedLists).map((e, i) => (
                      <GroceryListCard
                        index={i}
                        username={user?.username}
                        activeContainer={activeContainer}
                        setActiveContainer={setActiveContainer}
                        listInfo={e}
                        key={i}
                      />
                    ))}
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>

        {activeContainer?.collapsedLists.length === 0 && !loading && (
          <Grid item sx={{ width: "100vw", maxWidth: mobileWidth }}>
            <Slide className="alert-slide" in={true} direction="right" sx={{ width: "100%" }}>
              <Alert severity={severity}>{alertMessage}</Alert>
            </Slide>
            <img
              alt="decorative-background"
              src={handleContainerImg()}
              loading="lazy"
              height={310}
              width={310}
            />
          </Grid>
        )}
      </Grid>

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
