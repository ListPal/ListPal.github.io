// React imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Dnd imports
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// MUI imports
import {
  Typography,
  Toolbar,
  AppBar,
  Slide,
  Alert,
  Stack,
  Box,
  CircularProgress,
  List,
} from "@mui/material";

// MUI Icons
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// My imports
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
import {
  getPublicList,
  postRequest,
  checkSession,
  getAllLists,
} from "../../utils/testApi/testApi";
import { mergeArrays, truncateString } from "../../utils/helper";

// Component imports
import ListItem from "./ListItem/ListItem";
import BottomBar from "./BottomBar/BottomBar";

// IMGS
import groceryWallpaper from "../../utils/assets/groceryWallpaperPlus.jpg";
import todoWallpaper from "../../utils/assets/todoWallpaperPlus.jpg";
import shoppingWallpaper from "../../utils/assets/shoppingWallpaperPlus.jpg";
import christmasWallpaperPlus from "../../utils/assets/christmasWallpaperPlus.jpg";
import Dialogue from "./Dialogues/Dialogue";

function GroceryListPage({
  activeList,
  setActiveList,
  activeContainer,
  setActiveContainer,
  user,
  setUser,
  wasDragged,
  setWasDragged,
  wasChecked,
  setWasChecked,
}) {
  // States
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [recentlyDeletedItem, setRecentlyDeletedItem] = useState(null);
  const [groupedByIdentifier, setGroupedByIdentifier] = useState([]);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);

  // Other globals
  let groupedByCurrentIdx = 0; // global var that keeps the idx count to decide when to display the identifier in the lis item
  const urlParams = new URLSearchParams(location.search);
  const state = location?.state || {};
  const containerId = state.containerId || urlParams.get("containerId");
  const listId = state.listId || urlParams.get("listId");
  const scope = state.scope || urlParams.get("scope");
  const navigate = useNavigate();

  // Handlers
  const handleBack = () => {
    // If private, just push the list
    if (activeList?.scope === groceryListScopes.private)
      handlePushList(activeList?.groceryListItems, false, true);
    navigate(-1);
  };

  const handleOnDragEnd = (result) => {
    // Prevents errors for dragging out of bounds
    if (!result.destination) return;

    const listItems = activeList?.groceryListItems;
    const [reorderedItem] = listItems.splice(result.source.index, 1);
    listItems.splice(result.destination.index, 0, reorderedItem);
    setActiveList({ ...activeList, groceryListItems: listItems });
    setWasDragged(true);
  };

  const handleGroupByUsername = async (items) => {
    // Empty items, no need to group
    if (items.length === 0 || !items) {
      console.debug(items);
      return new Map();
    }
    groupedByCurrentIdx = 0; // reset identifier index count
    // Create Map
    const localItemsMap = new Map();
    const peopleSet = new Set();
    // Group items by username
    items.forEach((item) => {
      const key = item?.user?.username.split("@")[0] || "unknown";
      peopleSet.add(key);
      if (!localItemsMap.has(key)) {
        localItemsMap.set(key, []);
      }
      localItemsMap.get(key).push(item);
    });
    setGroupedByIdentifier(Array.from(peopleSet.values()).flat());
    return localItemsMap;
  };

  const handleGroupByCategory = async (items) => {
    // Empty items, no need to group
    if (items.length === 0 || !items) {
      return new Map();
    }
    groupedByCurrentIdx = 0; // reset identifier index count
    // Create Map
    const localItemsMap = new Map();
    const categorySet = new Set();
    // Group items by username
    items.forEach((item) => {
      const key = item?.category || "Misc";
      categorySet.add(key);
      if (!localItemsMap.has(key)) {
        localItemsMap.set(key, []);
      }
      localItemsMap.get(key).push(item);
    });
    setGroupedByIdentifier(Array.from(categorySet.values()).flat());
    return localItemsMap;
  };

  const handleSync = async (cache) => {
    setLoading(true);
    // Pull
    const pull = await handlePullList(false);
    // Merge
    const mergedArray = await mergeArrays(
      activeList?.groceryListItems,
      pull?.groceryListItems
    );
    // Push
    if (mergedArray) await handlePushList(mergedArray, false, false);
    // Reset relevant states
    setActiveList({ ...activeList, groceryListItems: mergedArray });
    setWasDragged(false);
    setWasChecked(false);
    setLoading(false);
  };

  const handleBorderColor = (identifier) => {
    // Handling preconditions
    if (!identifier) {
      console.error("No identifier was fed to derive borderColor");
      return handleDeriveThemeColor().bold;
    }

    if (
      // the identifier is the first element in groupedByIdentifier or not found at all
      groupedByIdentifier.indexOf(identifier) === -1 ||
      groupedByIdentifier.indexOf(identifier) === 0
    ) {
      return handleDeriveThemeColor().bold;
    }

    return borderColors[groupedByIdentifier.indexOf(identifier)];
  };

  const handleShowIdentifier = (identifier) => {
    // Handling preconditions
    if (!identifier) {
      console.debug("No identifier was fed to derive handleShowIdentifier");
      return handleDeriveThemeColor().bold;
    }

    // Look for identifier index in the groupedByIdentifier array
    const idx = groupedByIdentifier.indexOf(identifier);
    if (idx === groupedByCurrentIdx) {
      groupedByCurrentIdx++;
      return identifier;
    }
    return null;
  };

  const handleDeriveWallpaper = () => {
    if (activeContainer?.containerType) {
      if (activeContainer.containerType === groceryContainerTypes.grocery) {
        return groceryWallpaper;
      }
      if (activeContainer.containerType === groceryContainerTypes.todo) {
        return todoWallpaper;
      }
      if (
        activeContainer.containerType === groceryContainerTypes.whishlist &&
        activeList?.listName?.toUpperCase().includes("CHRISTMAS")
      ) {
        return christmasWallpaperPlus;
      }
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return groceryWallpaper;
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return todoWallpaper;
    }
    return shoppingWallpaper;
  };

  const handleDeriveThemeColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return {
        bold: colors.landingPageColors.bold,
        low: colors.landingPageColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return {
        bold: colors.todoColors.bold,
        low: colors.todoColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return {
        bold: colors.shoppingColors.bold,
        low: colors.shoppingColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return {
        bold: colors.landingPageColors.bold,
        low: colors.landingPageColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return {
        bold: colors.todoColors.bold,
        low: colors.todoColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.whishlist)) {
      return {
        bold: colors.shoppingColors.bold,
        low: colors.shoppingColors.low,
      };
    }
    return { bold: colors.fallbackColors.blod, low: colors.fallbackColors.low };
  };

  const handleFetchUserInfo = async () => {
    // Get user info if the user object is null
    if (!user) {
      const userInfoResponse = await checkSession();
      if (userInfoResponse?.status === 200) {
        setUser(userInfoResponse?.user);
        return userInfoResponse;
      } else if (userInfoResponse?.status === 403) {
        console.debug(userInfoResponse);
        navigate("/");
      } else {
        console.debug(userInfoResponse);
        navigate(-1);
      }
    }
  };

  const handleFetchContainer = async (data) => {
    // Handling preconditions
    if (!data) {
      console.error("No data was fed to derive handleFetchContainer");
      return handleDeriveThemeColor().bold;
    }

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

  const handlePullList = async (cache = true, loadingControl = true) => {
    // Handling preconditions
    if (!(containerId && listId && scope)) {
      console.error("Data passed to handleFetchList is null or undefined");
      return;
    }
    // Reset states
    if (loadingControl) setLoading(true);
    setActiveList(null);
    setAlertMessage(null);
    const data = {
      containerId: containerId,
      listId: listId,
      scope: scope,
    };
    const res =
      scope === groceryListScopes.public
        ? await getPublicList(data)
        : await postRequest(URLS.getListUri, data);

    // Cache it in state
    if (res?.status === 200) {
      // Group by items by category (Default)
      const activeListMap = await handleGroupByCategory(
        res?.body?.groceryListItems
      ); // Map engineering: (username | category) => items
      const responseBody = await {
        ...res?.body,
        groceryListItems: [...activeListMap.values()].flat(),
      };
      if (cache) setActiveList(responseBody);
    } else if (res?.status === 401) {
      setAlertMessage(messages.unauthorizedAccess);
    } else if (res?.status === 403) {
      console.debug(res);
      navigate("/");
    } else {
      console.debug(res);
      if (scope === groceryListScopes.public) {
        setAlertMessage(messages.noList);
      } else {
        setAlertMessage(messages.genericError);
      }
      setTimeout(() => setAlertMessage(null), 3000);
    }
    if (loadingControl) setTimeout(() => setLoading(false), 900);
    return res?.body;
  };

  const handlePushList = async (items, cache, loadingControl) => {
    if (!items || items.length === 0) {
      console.debug("No items to reorder");
      return;
    }

    if (!wasDragged) {
      console.debug("No need to reorder");
      return;
    }

    if (loadingControl) setLoading(true);
    setAlertMessage(null);
    const data = {
      containerId: containerId,
      listId: activeList?.id,
      scope: activeList?.scope,
      items: items,
    };
    // Send new order to the server
    const res = await postRequest(URLS.updateListOrder, data);
    // Cache list in state
    if (res?.status === 200) {
      // Success
      if (cache) setActiveList(res?.body);
    } else if (res?.status === 401) {
      setAlertMessage(messages.unauthorizedAccess);
      setTimeout(() => setLoading(false), 900);
    } else if (res?.status === 403) {
      navigate("/");
    } else {
      setAlertMessage(messages.genericError);
      setTimeout(() => setAlertMessage(null), 3000);
    }
    if (loadingControl) setTimeout(() => setLoading(false), 900);
    return res;
  };

  const handleRemoveDone = () => {
    const uncheckedItems = activeList?.groceryListItems.filter(e => !e.checked)
    const checkedItems = activeList?.groceryListItems.filter(e => e.checked)
    setActiveList({ ...activeList, groceryListItems: [...uncheckedItems, ...checkedItems]});
    // setActiveList({ ...activeList, groceryListItems: uncheckedItems});
  }

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

    // Pull new list
    handlePullList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <meta name="theme-color" content={handleDeriveThemeColor().bold} />

      {/* Alert messages*/}
      <Slide className="alert-slide" in={alertMessage && true}>
        <Alert
          severity={"error"}
          sx={{ position: "fixed", width: "96vw", top: "8vh", zIndex: 10 }}
        >
          {alertMessage}
        </Alert>
      </Slide>

      {/* Dialogue (absolute positioned) */}
      {openDialogue && (
        <Dialogue
          item={activeItem}
          containerId={containerId}
          activeList={activeList}
          setActiveList={setActiveList}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
        />
      )}

      {/* Loading progress */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "calc(50% - 10px)",
            left: "calc(50% - 10px)",
            zIndex: 10,
          }}
        >
          <CircularProgress
            sx={{ color: handleDeriveThemeColor().bold, position: "absolute" }}
          />
          <IconButton>
            <CheckCircleRoundedIcon
              sx={{ color: handleDeriveThemeColor().bold }}
            />
          </IconButton>
        </Box>
      )}

      {/* Top bar with title and back button */}
      <AppBar
        component="nav"
        sx={{
          left: 0,
          justifyContent: "center",
          maxWidth: mobileWidth,
          background: handleDeriveThemeColor().bold,
        }}
      >
        <Toolbar>
          <Stack direction={"row"}>
            <IconButton size="small" onClick={handleBack}>
              <ArrowBackIosIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography
              padding={1}
              variant="h5"
              sx={{ color: "white", flexGrow: 1 }}
            >
              {location?.state?.listName && (
                <Typography fontSize={16} variant="button">
                  {truncateString(location?.state?.listName, 20)}
                </Typography>
              )}
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* List items */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="list-items">
          {(provided, snapshot) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              mt={"8vh"}
              sx={{
                mt: "8vh",
                justifyContent: "center",
                justifyItems: "center",
                maxWidth: mobileWidth,
                pb: "9vh",
              }}
            >
              {!loading &&
                activeList?.groceryListItems.map((e, i) => (
                  <ListItem
                    borderColor={handleBorderColor(
                      e?.user?.username.split("@")[0]
                    )}
                    // identifier={handleShowIdentifier(e?.category)}
                    recentlyDeletedItem={recentlyDeletedItem}
                    setRecentlyDeletedItem={setRecentlyDeletedItem}
                    setOpenDialogue={setOpenDialogue}
                    setActiveList={setActiveList}
                    openDialogue={openDialogue}
                    activeContainer={activeContainer}
                    setActiveContainer={setActiveContainer}
                    activeList={activeList}
                    listId={listId}
                    item={e}
                    setItem={setActiveItem}
                    user={user}
                    setUser={setUser}
                    key={i + "item"}
                    index={i}
                    containerId={containerId}
                    setAlertMessage={setAlertMessage}
                    setWasChecked={setWasChecked}
                  />
                ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>

      {/* Bottom Bar with buttons */}
      <BottomBar
        scope={scope}
        handleSync={handleSync}
        setOpenDialogue={setOpenDialogue}
        handleDeriveThemeColor={handleDeriveThemeColor}
        isEmptyList={activeList?.groceryListItems.length === 0}
        handleRemoveDone={handleRemoveDone}
      />

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
