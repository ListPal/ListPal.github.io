// React imports
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";

// Dnd imports
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
import PublicIcon from "@mui/icons-material/Public";

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
import { getPublicList, postRequest, checkSession, getAllLists } from "../../utils/rest";
import { mergeArrays } from "../../utils/helper";

// Component imports
import Listitem from "./ListItem/ListItem";
import BottomBar from "./BottomBar/BottomBar";
import Dialogue from "./Dialogues/Dialogue";

// Other imports
import PullToRefresh from "pulltorefreshjs";

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
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [groupedByIdentifier, setGroupedByIdentifier] = useState([]);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const [showDone, setShowDone] = useState(false);
  const [modifiedIds, setModifiedIds] = useState(new Set());
  const [slide, setSlide] = useState(0);

  // Other globals
  let groupedByCurrentIdx = 0; // global var that keeps the idx count to decide when to display the identifier in the lis item
  const urlParams = new URLSearchParams(location.search);
  const state = location?.state || {};
  const containerId = state.containerId || urlParams.get("containerId");
  const listId = state.listId || urlParams.get("listId");
  const listName = state.listName || urlParams.get("name");
  const scope = state.scope || urlParams.get("scope");
  const navigate = useNavigate();

  // Handlers
  const handleCheckItems = async () => {
    console.log("Triggered handleCheckedItems");
    // Handling preconditions
    if (!(scope && containerId && listId)) {
      console.debug(
        "Incomple data. One of `scope` | `containerId` | `listId` is null or undefined."
      );
      setAlertMessage("Apologies. Something went wrong. Try refreshing the page and retry.");
      return;
    } else if (activeList?.groceryListItems.length === 0) {
      console.debug("Empty list. No need to check items");
      return;
    } else if (modifiedIds.size === 0) {
      console.debug("No modified ids found");
      return;
    }

    const data = {
      scope: activeList?.scope,
      containerId: activeList?.containerId,
      listId: activeList?.id,
      itemIds: [...modifiedIds],
    };

    // Derive public or authenticated uri
    const uri =
      activeList?.scope === groceryListScopes.public
        ? URLS.checkPublicListItemsUri
        : URLS.checkListItemsUri;

    // Post data and return the response to the next controller
    const res = await postRequest(uri, data);
    return res;
  };

  const handleBack = () => {
    if (modifiedIds.size > 0) {
      handleCheckItems();
    }
    if (scope === groceryListScopes.private) {
      handlePushList(activeList?.groceryListItems, false, false);
    }
    navigate(-1);
  };

  const handleOnDragEnd = (result) => {
    // Prevents errors for dragging out of bounds
    if (!result.destination) return;

    const listItems = activeList?.groceryListItems;
    const [reorderedItem] = listItems.splice(result.source.index, 1);
    listItems.splice(result.destination.index, 0, reorderedItem);
    setActiveList({ ...activeList, groceryListItems: listItems });
  };

  const handleGroupByUsername = async (items) => {
    // Empty items, no need to group
    if (!items || items.length === 0) {
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
    const pull = await handlePullList(false, false);
    // Merge (current merge resolution is: "keep theirs")
    const mergedArray = await mergeArrays(activeList?.groceryListItems, pull?.groceryListItems);
    // Cache
    if (cache === true) setActiveList({ ...activeList, groceryListItems: mergedArray });
    // Reset relevant states
    setLoading(false);
  };

  const handleBorderColor = (identifier) => {
    // Handling preconditions
    if (!identifier) {
      console.error("No identifier was fed to derive borderColor");
      return handleDeriveThemeColor()?.bold;
    }

    if (
      // the identifier is the first element in groupedByIdentifier or not found at all
      groupedByIdentifier.indexOf(identifier) === -1 ||
      groupedByIdentifier.indexOf(identifier) === 0
    ) {
      return handleDeriveThemeColor()?.bold;
    }

    return borderColors[groupedByIdentifier.indexOf(identifier)];
  };

  const handleDeriveThemeColor = () => {
    if (activeContainer?.containerType === groceryContainerTypes.grocery) {
      return {
        bold: colors.landingPageColors.bold,
        medium: colors.landingPageColors.medium,
        low: colors.landingPageColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return {
        bold: colors.todoColors.bold,
        medium: colors.todoColors.medium,
        low: colors.todoColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return {
        bold: colors.shoppingColors.bold,
        medium: colors.shoppingColors.medium,
        low: colors.shoppingColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return {
        bold: colors.landingPageColors.bold,
        medium: colors.landingPageColors.medium,
        low: colors.landingPageColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return {
        bold: colors.todoColors.bold,
        medium: colors.todoColors.medium,
        low: colors.todoColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.whishlist)) {
      return {
        bold: colors.shoppingColors.bold,
        medium: colors.shoppingColors.medium,
        low: colors.shoppingColors.low,
      };
    }
    return {
      bold: colors.fallbackColors.bold,
      medium: colors.fallbackColors.medium,
      low: colors.fallbackColors.low,
    };
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
      if (cache) setActiveList({ ...res?.body, groceryListItems: res?.body?.groceryListItems });
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

  useMemo(() => {
    handleGroupByUsername(activeList?.groceryListItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList]);

  useEffect(() => {
    if (showDone) {
      setSlide(0);
    }
  }, [showDone]);

  useEffect(() => {
    // No pull to refresh in this component to avoid a bug when dragging and dropping
    PullToRefresh.destroyAll();

    // Fetch user and container if not a public list
    if (scope !== groceryListScopes.public && !user) {
      handleAtomicUserAndContainerFetch();
    }

    // Check for cached list items
    if (
      activeList?.id === listId &&
      activeList?.listName === listName &&
      activeList?.scope === scope
    ) {
      // console.debug("No need to fetch items.");
      return;
    }

    // Pull new list
    handlePullList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <meta name="theme-color" content={"white"} />
      {/* <meta name="theme-color" content={handleDeriveThemeColor().bold} /> */}
      {/* Alert messages*/}
      <Slide className="alert-slide" in={alertMessage && true}>
        <Alert severity={"error"} sx={{ position: "fixed", width: "96vw", top: "8vh", zIndex: 10 }}>
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
          <CircularProgress sx={{ color: handleDeriveThemeColor().bold, position: "absolute" }} />
          <IconButton>
            <CheckCircleRoundedIcon sx={{ color: handleDeriveThemeColor().bold }} />
          </IconButton>
        </Box>
      )}

      {/* Back button */}
      <IconButton
        size="small"
        onClick={handleBack}
        sx={{ mt: 3, position: "fixed", left: "15px", zIndex: 11 }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* List items */}
      <SwipeableViews disabled={showDone} index={slide} onChangeIndex={(slide) => setSlide(slide)}>
        {/* Active items */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="list-items">
            {(provided, snapshot) => (
              <List
                dense
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{
                  overflowX: "hidden",
                  maxWidth: mobileWidth,
                  height: "88vh",
                  pt:4,
                }}
              >
                {!loading &&
                  activeList?.groceryListItems.map((e, i) => {
                    if (!e.checked || showDone)
                      return (
                        <Draggable draggableId={`${i}`} index={i} key={i}>
                          {(provided) => (
                            <Listitem
                              provided={provided}
                              borderColor={handleBorderColor(e?.user?.username.split("@")[0])}
                              identifier={e?.user?.username.split("@")[0]}
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
                              key={i}
                              index={i}
                              containerId={containerId}
                              setAlertMessage={setAlertMessage}
                              modifiedIds={modifiedIds}
                              setModifiedIds={setModifiedIds}
                            />
                          )}
                        </Draggable>
                      );
                  })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        {/* Checked items */}
        {!showDone ? (
          <List
            dense
            sx={{
              overflowX: "hidden",
              maxWidth: mobileWidth,
              height: "88vh",
              pt:4,
            }}
          >
            {activeList?.groceryListItems.map((e, i) => {
              if (e.checked)
                return (
                  <Listitem
                    borderColor={handleBorderColor(e?.user?.username.split("@")[0])}
                    identifier={e?.user?.username.split("@")[0]}
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
                    key={i}
                    index={i}
                    containerId={containerId}
                    setAlertMessage={setAlertMessage}
                    modifiedIds={modifiedIds}
                    setModifiedIds={setModifiedIds}
                  />
                );
            })}
          </List>
        ) : (
          <></>
        )}
      </SwipeableViews>

      {/* Bottom Bar */}
      <BottomBar
        scope={scope}
        handleSync={handleSync}
        setOpenDialogue={setOpenDialogue}
        handleDeriveThemeColor={handleDeriveThemeColor}
        isEmptyList={activeList?.groceryListItems.length === 0}
        showDone={showDone}
        setShowDone={setShowDone}
      />
      {!showDone && (
        <Stack
          direction={"row"}
          position={"fixed"}
          left={"calc(50% - 15px)"}
          top={"90vh"}
          bottom={10}
          justifyContent={"space-around"}
          width={"30px"}
        >
          <div
            onClick={() => setSlide(0)}
            style={{
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              background: slide === 0 ? "black" : "lightgray",
            }}
          />
          <div
            onClick={() => setSlide(1)}
            style={{
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              background: slide === 1 ? "black" : "lightgray",
            }}
          />
        </Stack>
      )}

      {activeList?.groceryListItems.length === 0 && !loading && (
        <Typography
          variant={"subtitle1"}
          fontFamily={"Urbanist"}
          color={"GrayText"}
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          No items to display
        </Typography>
      )}

      {/* Background Wallpaper */}
      {/* <div
        id="background-image"
        style={{
          position: "fixed",
          top: "0",
          height: "100vh",
          width: "100vw",
          maxWidth: mobileWidth,
          zIndex: "-1",
          // backgroundImage: `url(${handleDeriveWallpaper()})`,
          backdropFilter:'',
          backgroundSize: "60%",
          overflowX: "hidden",
        }}
      /> */}
    </>
  );
}

export default GroceryListPage;
