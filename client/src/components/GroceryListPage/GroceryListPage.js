import {
  URLS,
  colors,
  dialogues,
  borderColors,
  groceryListScopes,
  mobileWidth,
  groceryContainerTypes,
  messages,
} from "../../utils/enum";
import { Typography, Toolbar, Grid, AppBar, Slide, Alert } from "@mui/material";
import {
  getPublicList,
  postRequest,
  checkSession,
  getAllLists,
} from "../../utils/testApi/testApi";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { truncateString } from "../../utils/helper";
import IconButton from "@mui/material/IconButton";
import SyncIcon from "@mui/icons-material/Sync";
import AddIcon from "@mui/icons-material/Add";
import Dialogue from "./DialogueBox/Dialogue";
import { useState, useEffect } from "react";
import ListItem from "./ListItem/ListItem";
// IMGS
import groceryWallpaper from "../../utils/assets/card1.jpg";
import todoWallpaper from "../../utils/assets/todoWallpaperPlus.jpg";
import shoppingWallpaper from "../../utils/assets/shoppingWallpaperPlus.jpg";
import christmasWallpaperPlus from "../../utils/assets/christmasWallpaperPlus.jpg";

function GroceryListPage({
  activeList,
  setActiveList,
  activeContainer,
  setActiveContainer,
  user,
  setUser,
}) {
  // States
  const location = useLocation();
  const [alertMessage, setAlertMessage] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const [groupedByIdentifier, setGroupedByIdentifier] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listName, setListName] = useState(location.state?.listName);
  // Other globals
  let groupedByCurrentIdx = 0; // global var that keeps the idx count to decide when to display the identifier in the lis item
  const urlParams = new URLSearchParams(location.search);
  const containerId = location?.state
    ? location?.state?.containerId
    : urlParams.get("containerId");
  const listId = location?.state
    ? location?.state?.listId
    : urlParams.get("listId");
  const scope = location?.state
    ? location?.state?.scope
    : urlParams.get("scope");
  const navigate = useNavigate();

  // Handlers
  const handleGroupByUsername = async (items) => {
    groupedByCurrentIdx = 0; // reset identifier index count
    // Create Map
    const localItemsMap = new Map();
    const peopleSet = new Set();
    // Group items by username
    items.forEach((item) => {
      let key = item?.user?.username.split("@")[0];
      if (!key) key = "unknown";
      peopleSet.add(key);
      if (!localItemsMap.has(key)) {
        localItemsMap.set(key, []);
      }
      localItemsMap.get(key).push(item);
    });
    setGroupedByIdentifier(Array.from(peopleSet.values()).flat());
    return localItemsMap;
  };

  const handleCheckItems = async () => {
    // TODO: only send if there are modified items
    const data = {
      scope: scope,
      containerId: containerId,
      listId: listId,
      itemIds: activeList?.groceryListItems
        .filter((item) => item.checked)
        .map((item) => item.id),
    };
    const uri =
      scope === groceryListScopes.public
        ? URLS.checkPublicListItemUri
        : URLS.checkListItemUri;
    const res = await postRequest(uri, data);
    return res;
  };

  const handleSync = async () => {
    setLoading(true);
    const res = await handleCheckItems();
    if (res?.status === 200) {
      handleFetchList();
    } else if (res?.status === 400) {
      console.log(res);
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else {
      setAlertMessage("Apologies. Something went wrong on our end.");
      setTimeout(() => setAlertMessage(null), 1000);
      console.log(res);
    }
    setLoading(false);
  };

  const handleBorderColor = (identifier) => {
    if (
      groupedByIdentifier.indexOf(identifier) === -1 ||
      groupedByIdentifier.indexOf(identifier) === 0
    ) {
      return handleDeriveThemeColor();
    }
    return borderColors[groupedByIdentifier.indexOf(identifier)];
  };

  const handleShowIdentifier = (identifier) => {
    const idx = groupedByIdentifier.indexOf(identifier);
    if (idx === groupedByCurrentIdx) {
      groupedByCurrentIdx++;
      return identifier;
    }
    return null;
  };

  const handleDeriveWallpaper = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return groceryWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return todoWallpaper;
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return activeList?.listName?.toUpperCase().includes("CHRISTMAS")
        ? christmasWallpaperPlus
        : shoppingWallpaper;
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return groceryWallpaper;
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return todoWallpaper;
    }
    if (containerId.includes(groceryContainerTypes.whishlist)) {
      return shoppingWallpaper;
    }
    return todoWallpaper;
  };

  const handleDeriveThemeColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return colors.landingPageColors.bold;
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return colors.todoColors.bold;
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return colors.shoppingColors.bold;
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return colors.landingPageColors.bold;
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return colors.todoColors.bold;
    }
    if (containerId.includes(groceryContainerTypes.whishlist)) {
      return colors.shoppingColors.bold;
    }
    return "#0D324F";
  };

  const handleFetchUserInfo = async () => {
    // Get user info if the user object is null
    if (!user) {
      const userInfoResponse = await checkSession();
      if (userInfoResponse?.status === 200) {
        setUser(userInfoResponse?.user);
        return userInfoResponse;
      } else if (userInfoResponse?.status === 403) {
        console.log(userInfoResponse);
        navigate("/");
      } else {
        console.log(userInfoResponse);
        navigate(-1);
      }
    }
  };

  const handleFetchContainer = async (data) => {
    console.debug("fetching container with container id: " + data.containerId);
    const containerInfoResponse = await getAllLists(data);
    if (containerInfoResponse?.status === 200) {
      setActiveContainer(containerInfoResponse?.body);
      return containerInfoResponse;
    } else if (containerInfoResponse?.status === 403) {
      console.log(containerInfoResponse);
      navigate("/");
    } else if (containerInfoResponse?.status === 401) {
      console.log(containerInfoResponse);
      navigate(-1);
    } else {
      console.log(containerInfoResponse);
      navigate(-1);
    }
  };

  const handleAtomicUserAndContainerFetch = async () => {
    const user = await handleFetchUserInfo();
    const container = await handleFetchContainer({
      userId: user?.user?.id,
      containerId: containerId,
      scope: scope,
    });
    return user, container;
  };

  const handleFetchList = async () => {
    // Reset states
    setActiveList(null);
    const data = {
      containerId: containerId,
      listId: listId,
      scope: scope,
    };
    setLoading(true);
    const res =
      scope === groceryListScopes.public
        ? await getPublicList(data)
        : await postRequest(URLS.getListUri, data);

    // Cache it in state
    if (res?.status === 200) {
      setListName(res?.body.listName);
      // Group by items by username (Default)
      setAlertMessage(null);
      const activeListMap = await handleGroupByUsername(
        res?.body?.groceryListItems
      ); // Map engineering: username => items
      const responseBody = await {
        ...res?.body,
        groceryListItems: Array.from(activeListMap.values()).flat(),
      };

      setActiveList(responseBody);
    } else if (res?.status === 401) {
      setAlertMessage(messages.unauthorizedAccess);
    } else if (res?.status === 403) {
      console.log(res);
      navigate("/");
    } else {
      console.log(res);
      if (scope === groceryListScopes.public) {
        setAlertMessage(messages.noList);
      } else {
        setAlertMessage(messages.genericError);
      }
      setTimeout(() => setAlertMessage(null), 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Fetch user and container if not a public list
    if (scope !== groceryListScopes.public && !user) {
      handleAtomicUserAndContainerFetch();
    }

    // Check for cached list items
    if (activeList?.groceryListItems[0]?.listId === listId) {
      console.debug("No need to fetch items.");
      return;
    }

    // Mark items checked
    if (activeList?.groceryListItems.length > 0) {
      handleCheckItems();
    }

    // Fetch new active list
    handleFetchList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && (
        <CircularProgress
          color={"success"}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: "10",
            transform: "translate(-50%, 0)",
          }}
        />
      )}

      <AppBar
        component="nav"
        sx={{
          pb: 1,
          height: 60,
          width: "100vw",
          maxWidth: mobileWidth,
          background: handleDeriveThemeColor(),
          alignItems: "space-between",
          left: 0,
        }}
      >
        <Toolbar>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <ArrowBackIosIcon sx={{ color: "white" }} />
          </IconButton>

          {scope !== groceryListScopes.private && (
            <IconButton size="small" disabled={loading} onClick={handleSync}>
              <SyncIcon sx={{ color: "white" }} />
            </IconButton>
          )}

          <Typography
            padding={1}
            variant="h5"
            sx={{ color: "white", flexGrow: 1 }}
          >
            {listName && (
              <Typography fontSize={16} variant="button">
                {truncateString(listName, 20)}
              </Typography>
            )}
            {!listName && (
              <Typography fontSize={16} variant="button">
                UNKNOWN LIST
              </Typography>
            )}
          </Typography>

          <IconButton
            size="small"
            onClick={() => setOpenDialogue(dialogues.addItem)}
          >
            <AddIcon sx={{ color: "white" }} />
          </IconButton>

          {containerId === activeContainer?.id && (
            <IconButton
              size="small"
              variant="contained"
              onClick={() => setOpenDialogue(dialogues.resetList)}
            >
              <DeleteIcon sx={{ color: "red" }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* List items */}
      <Grid
        container
        mt={"8vh"}
        p={1}
        spacing={2}
        sx={{
          justifyContent: "center",
          justifyItems: "center",
          maxWidth: mobileWidth,
        }}
      >
        {!loading &&
          activeList?.groceryListItems.map((e, i) => (
            <Grid item key={i + "grid"}>
              <ListItem
                borderColor={handleBorderColor(e?.user?.username.split("@")[0])}
                identifier={handleShowIdentifier(
                  e?.user?.username.split("@")[0]
                )}
                setOpenDialogue={setOpenDialogue}
                setActiveList={setActiveList}
                openDialogue={openDialogue}
                activeContainer={activeContainer}
                setActiveContainer={setActiveContainer}
                activeList={activeList}
                listId={listId}
                item={e}
                user={user}
                setUser={setUser}
                key={i + "item"}
                containerId={containerId}
              />
            </Grid>
          ))}

        {(openDialogue === dialogues.addItem ||
          openDialogue === dialogues.resetList) && (
          <Dialogue
            containerId={containerId}
            setUser={setUser}
            user={user}
            setOpenDialogue={setOpenDialogue}
            activeList={activeList}
            setActiveList={setActiveList}
            activeContainer={activeContainer}
            setActiveContainer={setActiveContainer}
            openDialogue={openDialogue}
          />
        )}
      </Grid>

      {/* Alert  messages*/}
      <Slide className="alert-slide" in={alertMessage && true}>
        <Alert severity={"error"} sx={{ position: "fixed", width: "96vw" }}>
          {alertMessage}
        </Alert>
      </Slide>

      {/* Background Wallpaper */}
      <div
        id="background-image"
        style={{
          position: "fixed",
          top: "0",
          height: "100vh",
          width: "100vw",
          maxWidth: mobileWidth,
          zIndex: "-1",
          backgroundImage: `url(${handleDeriveWallpaper()})`,
          backgroundSize: "60%",
          overflowX: "hidden",
        }}
      />
    </>
  );
}

export default GroceryListPage;
