// CSS import
import "./GroceryListPage.css";

// React imports
import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";

// Dnd imports
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// MUI imports
import { Typography, Slide, Alert, Stack, List, Snackbar, Button, Grow } from "@mui/material";

// MUI Icons
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";

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
  actions,
} from "../../utils/enum";
import { getPublicList, postRequest, checkSession, getAllLists } from "../../utils/rest";
import { generateRandomUserName, mergeArrays } from "../../utils/helper";

// Component imports
import Listitem from "./ListItem/ListItem";
import BottomBar from "./BottomBar/BottomBar";
import Dialogue from "./Dialogues/Dialogue";
import PullToRefresh from "../PullToRefresh/PullToRefresh";
import Loading from "../Loading/Loading";

// Websocket
import {
  checkItemsWs,
  isWebSocketConnected,
  atomicConnectSubscribe,
  subscribeToRestrictedList,
  subscribeToPublicList,
  publicCheckItemsWs,
  unscubscribeFromRestrictedList,
  unscubscribeFromPublicList,
  stompClient,
  disconnectWebSocket,
  connectWebSocket,
} from "../../utils/WebSocket";

function GroceryListPage({ activeList, setActiveList, activeContainer, setActiveContainer, user, setUser, theme }) {
  // States
  const [loading, setLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [groupedByIdentifier, setGroupedByIdentifier] = useState([]);
  const [openDialogue, setOpenDialogue] = useState(dialogues.closed);
  const [showDone, setShowDone] = useState(true);
  const [modifiedIds, setModifiedIds] = useState(new Set());
  const [slide, setSlide] = useState(0);
  const [isRefarctored, setIsRefarctored] = useState(false);
  const [updateMarkCheckedTimer, setUpdateMarkCheckedTimer] = useState(null);
  const [updateLookupTimer, setUpdateLookupTimer] = useState(null);

  // Other globals
  const navigate = useNavigate();
  const location = useLocation();
  let groupedByCurrentIdx = 0; // global var that keeps the idx count to decide when to display the identifier in the lis item
  const urlParams = new URLSearchParams(location.search);
  const state = location?.state || {};
  const containerId = state.containerId || urlParams.get("containerId");
  const listId = state.listId || urlParams.get("listId");
  const listName = state.listName || urlParams.get("name");
  const scope = state.scope || urlParams.get("scope");
  const lookupRef = useRef(null);

  // Handlers
  const handleAtomicSubscription = (controlGate = false) => {
    setAlertMessage({ ...alertMessage, severity: "warning", snackBarMessage: "Connecting...", autoHideDuration: 10000 });

    if (!stompClient.connected || controlGate) {
      atomicConnectSubscribe(() => {
        const { onSuccess, onError } = makeWebsocketHandlers();
        if (scope === groceryListScopes.restricted) subscribeToRestrictedList(listId, onSuccess, onError);
        if (scope === groceryListScopes.public) subscribeToPublicList(listId, onSuccess, onError);
      });
    } else {
      const { onSuccess, onError } = makeWebsocketHandlers();
      if (scope === groceryListScopes.restricted) subscribeToRestrictedList(listId, onSuccess, onError);
      if (scope === groceryListScopes.public) subscribeToPublicList(listId, onSuccess, onError);
    }
  };

  const makeWebsocketHandlers = () => {
    setAlertMessage({ ...alertMessage, severity: "success", snackBarMessage: "Connected", autoHideDuration: 1000 });
    // Define websocket success handler
    const onSuccess = (message) => {
      const res = message?.body;
      const action = message?.body?.action;
      const entity = message?.body?.entity;
      console.log("USER: " + user?.username);
      console.log("ENTITY: " + entity);
      switch (action) {
        case actions.ADD_ITEM:
          setActiveList(res?.body);
          if (user?.username === entity) setOpenDialogue(dialogues.closed);
          break;
        case actions.EDIT_ITEM:
          setActiveList(res?.body);
          if (user?.username === entity) setOpenDialogue(dialogues.closed);
          break;
        case actions.DELETE_ITEM:
          setActiveList(res?.body);
          if (user?.username === entity) setLoading(false);
          break;
        case actions.REMOVE_ITEMS:
          setActiveList(res?.body);
          if (user?.username === entity) setOpenDialogue(dialogues.closed);
          break;
        case actions.CHECK_ITEMS:
          setActiveList(res?.body);
          setModifiedIds(new Set());
          if (user?.username === entity) setOpenDialogue(dialogues.closed);
          break;
        case actions.REMOVE_CHECKED_ITEMS:
          setActiveList(res?.body);
          if (user?.username === entity) setOpenDialogue(dialogues.closed);
          break;
        default:
          console.debug("No allowed action.");
          setLoading(false);
          break;
      }
    };
    // Define websocket error handler
    const onError = (message) => {
      const res = message?.body;
      const entity = message?.body?.entity;
      switch (res?.status) {
        case 400:
          if (user?.username === entity) navigate("/listNotFound");
          break;
        case 401:
          if (user?.username === entity) {
            setAlertMessage({ severity: "error", message: messages.unauthorizedAction });
            setOpenDialogue(dialogues.closed);
            setTimeout(() => setAlertMessage(null), 3000);
          }
          break;
        case 403:
          if (user?.username === entity) navigate("/");
          break;
        default:
          if (user?.username === entity) {
            setOpenDialogue(dialogues.closed);
            setAlertMessage({ severity: "error", message: messages.genericError });
            setTimeout(() => setAlertMessage(null), 3000);
          }
      }
    };

    return { onSuccess: onSuccess, onError: onError };
  };

  const handleLookupItems = (sequence) => {
    const matchingItems = [];
    activeList?.groceryListItems.forEach((e, i) => {
      if (e.name.toLowerCase().includes(sequence.toLowerCase())) matchingItems.push(e);
    });
    setFilteredItems(matchingItems);
  };

  const handleOnLookupInputChange = (event) => {
    if (!event.target.value) return;

    if (updateLookupTimer !== null) {
      // Haven't sent items yet, so clear the timeout and start a new attempt
      setLoading(true);
      clearTimeout(updateLookupTimer);
    }
    // Set a new timer to update the database after 3 seconds
    const timer = setTimeout(() => {
      // console.log("Searching items...");
      handleLookupItems(event.target.value);
      setLoading(false);
    }, 800); // Adjust the delay as needed

    setUpdateLookupTimer(timer);
  };

  const handleResetLookupBar = () => {
    if (lookupRef.current && lookupRef.current.value.length !== 0) {
      // console.debug("resetting search bar");
      lookupRef.current.value = null;
      setFilteredItems(activeList?.groceryListItems);
    }
  };

  const handleCheckItemsInterval = async () => {
    if (updateMarkCheckedTimer !== null) {
      // Haven't sent items yet, so clear the timeout and start a new attempt
      clearTimeout(updateMarkCheckedTimer);
    }
    // Set a new timer to update the database after 3 seconds
    const timer = setTimeout(() => {
      // console.log("Updating database with checked items:");
      handleCheckItems();
    }, 1000); // Adjust the delay as needed

    setUpdateMarkCheckedTimer(timer);
  };

  const handleCheckItems = async () => {
    console.log("Triggered handleCheckedItems");
    // Handling preconditions
    if (!(scope && containerId && listId)) {
      console.debug("Incomplete data. One of `scope` | `containerId` | `listId` is null or undefined.");
      setAlertMessage({
        severity: "error",
        message: messages.genericError,
      });
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

    // Websocket
    if (activeList?.scope !== groceryListScopes.private && isWebSocketConnected()) {
      const authResponse = await checkSession();
      if (authResponse?.status !== 200) {
        console.error("Cannot authenticate user.");
      }
      // Just in case...
      if (!isWebSocketConnected()) {
        setAlertMessage({ severity: "error", message: messages.lostConnection });
        setLoading(false);
        return;
      }
      // Derive correct sender
      if (scope === groceryListScopes.restricted) checkItemsWs(activeList?.id, data, actions.CHECK_ITEMS, authResponse?.token);
      if (scope === groceryListScopes.public) publicCheckItemsWs(activeList?.id, data, actions.CHECK_ITEMS, user?.username);
      return;
    }

    // Post data and return the response to the next controller
    // Derive public or authenticated uri
    const uri = activeList?.scope === groceryListScopes.public ? URLS.checkPublicListItemsUri : URLS.checkListItemsUri;
    const res = await postRequest(uri, data);
    if (res?.status === 200) {
      setModifiedIds(new Set());
      console.log("Done checking items.");
    }
    return res;
  };

  const handleBack = () => {
    if (scope === groceryListScopes.private) {
      // Reorder items if necessary for private lists only
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
    setIsRefarctored(true);
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
    // handle Webscocket reconnection/subscription atomically
    handleAtomicSubscription();
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
        bold: colors[theme]?.landingPageColors.bold,
        medium: colors[theme]?.landingPageColors.medium,
        low: colors[theme]?.landingPageColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.todo) {
      return {
        bold: colors[theme]?.todoColors.bold,
        medium: colors[theme]?.todoColors.medium,
        low: colors[theme]?.todoColors.low,
      };
    }
    if (activeContainer?.containerType === groceryContainerTypes.whishlist) {
      return {
        bold: colors[theme]?.shoppingColors.bold,
        medium: colors[theme]?.shoppingColors.medium,
        low: colors[theme]?.shoppingColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.grocery)) {
      return {
        bold: colors[theme]?.landingPageColors.bold,
        medium: colors[theme]?.landingPageColors.medium,
        low: colors[theme]?.landingPageColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.todo)) {
      return {
        bold: colors[theme]?.todoColors.bold,
        medium: colors[theme]?.todoColors.medium,
        low: colors[theme]?.todoColors.low,
      };
    }
    if (containerId.includes(groceryContainerTypes.whishlist)) {
      return {
        bold: colors[theme]?.shoppingColors.bold,
        medium: colors[theme]?.shoppingColors.medium,
        low: colors[theme]?.shoppingColors.low,
      };
    }
    return {
      bold: colors[theme]?.fallbackColors.bold,
      medium: colors[theme]?.fallbackColors.medium,
      low: colors[theme]?.fallbackColors.low,
    };
  };

  const handleFetchUserInfo = async () => {
    // Get user info if the user object is null
    if (!user || user?.anonymous) {
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

  const handleFetchPublicUserAndPull = async () => {
    const res = await checkSession();
    if (res?.status === 200) {
      setUser(res?.user);
    }
    handlePullList(true, true)
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
      containerId: activeContainer?.id || containerId,
      scope: scope,
    });

    return user, container;
  };

  const atomicFetchUserAndPull = async () => {
    const user = await handleFetchUserInfo();
    if (user?.user?.id) {
      await handlePullList(true, true);
    }

    return user;
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
    // Engineer data to be sent
    const data = {
      containerId: containerId,
      listId: listId,
      scope: scope,
    };
    // Send api request
    const res = scope === groceryListScopes.public ? await getPublicList(data) : await postRequest(URLS.getListUri, data);
    // Cache it in state
    if (res?.status === 200) {
      if (cache) {
        setActiveList({ ...res?.body, groceryListItems: res?.body?.groceryListItems });
        setFilteredItems(res?.body?.groceryListItems);
      }
    } else if (res?.status === 401) {
      setAlertMessage({ severity: "error", message: messages.unauthorizedAccess });
      setTimeout(() => navigate("/"), 3000);
    } else if (res?.status === 403) {
      console.debug(res);
      navigate("/");
    } else if (res?.status === 500) {
      setAlertMessage({ severity: "error", message: messages.lostConnection });
    } else if (res?.status === 400) {
      navigate("/listNotFound");
    } else {
      console.debug(res);

      setAlertMessage({ severity: "error", message: messages.genericError });

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

    if (!isRefarctored) {
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
      // Reset isRefactored
      setIsRefarctored(false);
    } else if (res?.status === 401) {
      setAlertMessage({ severity: "error", message: messages.unauthorizedAccess });
      setTimeout(() => setLoading(false), 900);
    } else if (res?.status === 403) {
      navigate("/");
    } else {
      setAlertMessage({ severity: "error", message: messages.genericError });
      setTimeout(() => setAlertMessage(null), 3000);
    }
    if (loadingControl) setTimeout(() => setLoading(false), 900);
    return res;
  };

  useMemo(() => {
    handleGroupByUsername(activeList?.groceryListItems);
    setFilteredItems(activeList?.groceryListItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList]);

  useMemo(() => {
    handleCheckItemsInterval();
  }, [modifiedIds.size]);

  useEffect(() => {
    if (showDone) setSlide(0);
  }, [showDone]);

  useEffect(() => {
    if (scope !== groceryListScopes.private) {
      // If not (connected or trying to connect...)
      if (!stompClient.active) {
        // Connect
        handleAtomicSubscription();
        return;
      }
    }
  }, [stompClient.connected]);

  // Main useEffect
  useEffect(() => {
    // Show checked items if public list
    setShowDone(scope === groceryListScopes.public);

    // Check for cached list items
    if (activeList?.id === listId && activeList?.listName === listName && activeList?.scope === scope && user) {
      console.debug("No need to fetch items.");
      setFilteredItems(activeList?.groceryListItems);
      setLoading(false);
      // Websocket Cleanup
      if (scope !== groceryListScopes.private) {
        return () => {
          if (scope === groceryListScopes.restricted) unscubscribeFromRestrictedList(listId);
          else if (scope === groceryListScopes.public) unscubscribeFromPublicList(listId);
          disconnectWebSocket();
        };
      }
    }

    // Reset groceryListItems to avoid displaying the wrong data when server is down
    setActiveList({ groceryListItems: [] });

    // Fetch user and pull list if not a public list
    if (scope !== groceryListScopes.public && (!user || user?.anonymous)) {
      // Set user and pull or deny access as needed
      atomicFetchUserAndPull();
    } else if (scope === groceryListScopes.public && (!user || user?.anonymous)) {
      // Set anonymous user and pull list items
      handleFetchPublicUserAndPull();
    } else {
      // We have an authorized user, so pull list items
      handlePullList(true, true);
    }

    // Cleanup Using WebSockets
    if (scope !== groceryListScopes.private) {
      return () => {
        if (scope === groceryListScopes.restricted) unscubscribeFromRestrictedList(listId);
        else if (scope === groceryListScopes.public) unscubscribeFromPublicList(listId);
        disconnectWebSocket();
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setting up event handlers
  useEffect(() => {
    const visibilityEventHandler = () => {
      if (document.visibilityState === "visible") {
        handlePullList(true, true);
        handleAtomicSubscription();
      }
      if (document.visibilityState === "hidden") {
        disconnectWebSocket();
      }
    };

    // Add visibility event handler to DOM only if list is restricted
    if (scope !== groceryListScopes.private) {
      document.addEventListener("visibilitychange", visibilityEventHandler);
    }

    // Remove visibility event handler on component unmount
    return () => document.removeEventListener("visibilitychange", visibilityEventHandler);
  }, []);

  return (
    <PullToRefresh onRefresh={() => handleSync(true)}>
      <meta name="theme-color" content={colors[theme]?.generalColors.outerBackground} />

      {/* Loading progress */}
      {loading && <Loading color={handleDeriveThemeColor().bold} />}

      {/* Alert messages*/}
      <Slide
        className="alert-slide"
        in={alertMessage?.message && true}
        sx={{ position: "absolute", zIndex: 100, minWidth: "92vw", maxWidth: mobileWidth }}
      >
        <Alert severity={alertMessage?.severity || "error"}>
          <Typography variant={"body2"} textAlign={"left"}>
            {alertMessage?.message}
          </Typography>
        </Alert>
      </Slide>

      {/* Dialogue (absolute positioned) */}
      {openDialogue && (
        <Dialogue
          user={user}
          theme={theme}
          item={activeItem}
          containerId={containerId}
          activeList={activeList}
          setActiveList={setActiveList}
          openDialogue={openDialogue}
          setOpenDialogue={setOpenDialogue}
        />
      )}

      {/* Top stack */}
      <Stack
        pl={2}
        pt={2}
        pr={1}
        direction={"row"}
        alignItems={"center"}
        zIndex={11}
        position={"fixed"}
        width={"100%"}
        maxWidth={mobileWidth}
        sx={{ backdropFilter: "blur(5px)" }}
      >
        {/* Back button */}
        <IconButton size="small" onClick={handleBack}>
          <ArrowBackIosIcon sx={{ color: colors[theme]?.generalColors.fontColor }} />
        </IconButton>

        {/* Searchbar */}
        <div style={{ width: "calc(80% - 5px)" }}>
          <input
            ref={lookupRef}
            onChange={handleOnLookupInputChange}
            id="lookupInput"
            className="noZoom"
            placeholder={"Lookup item"}
            style={{
              color: colors[theme]?.generalColors.fontColor,
              border: `1px solid ${colors[theme]?.generalColors.lightBorder}`,
              background: colors[theme].generalColors.outerBackground,
            }}
          />
          <IconButton
            className="reset-text-icon"
            onClick={handleResetLookupBar}
            size={"small"}
            sx={{
              position: "absolute",
              top: "calc(2 * 8px + 5px)",
              left: "calc(80% + 5px)",
            }}
          >
            <CloseIcon fontSize={"1rem"} sx={{ color: colors[theme]?.generalColors.lightBorder }} />
          </IconButton>
        </div>
      </Stack>

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
                  pt: 10,
                }}
              >
                {!loading &&
                  filteredItems.map((e, i) => {
                    if (!e.checked || showDone)
                      return (
                        <Draggable draggableId={`${i}`} index={i} key={i}>
                          {(provided) => (
                            <Listitem
                              loading={loading}
                              setLoading={setLoading}
                              theme={theme}
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
              pt: 10,
            }}
          >
            {!loading &&
              filteredItems.map((e, i) => {
                if (e.checked)
                  return (
                    <Listitem
                      loading={loading}
                      setLoading={setLoading}
                      theme={theme}
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

      {/* Page Selectors */}
      {!showDone && activeList?.id && filteredItems.length > 0 && (
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
              background:
                slide === 0 ? colors[theme]?.generalColors.slideSelector.active : colors[theme]?.generalColors.slideSelector.inactive,
            }}
          />
          <div
            onClick={() => setSlide(1)}
            style={{
              height: "8px",
              width: "8px",
              borderRadius: "50%",
              background:
                slide === 1 ? colors[theme]?.generalColors.slideSelector.active : colors[theme]?.generalColors.slideSelector.inactive,
            }}
          />
        </Stack>
      )}

      {/* Bottom Bar */}
      <BottomBar
        user={user}
        theme={theme}
        scope={scope}
        handleSync={handleSync}
        setOpenDialogue={setOpenDialogue}
        handleDeriveThemeColor={handleDeriveThemeColor}
        isEmptyList={activeList?.groceryListItems.length === 0}
        showDone={showDone}
        setShowDone={setShowDone}
      />

      {activeList?.id && filteredItems.length === 0 && !loading && (
        <Typography
          variant={"subtitle1"}
          fontFamily={"Urbanist"}
          color={colors[theme]?.generalColors.helperTextFontColor}
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
      {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
      <Snackbar
        open={alertMessage?.snackBarMessage && true}
        autoHideDuration={alertMessage?.autoHideDuration || 1000}
        key={"key"}
        TransitionComponent={TransitionUp}
        // message={alertMessage?.snackBarMessage}
        onClose={() => {
          setAlertMessage({ ...alertMessage, snackBarMessage: null });
        }}
        sx={{
          position: "absolute",
          bottom: 30,
        }}
      >
        <Alert
          sx={{ fontFamily: "Urbanist", width: "100%", boxShadow: "0 25.6px 57.6px 0 rgb(0 0 0 / 22%), 0 4.8px 14.4px 0 rgb(0 0 0 / 18%)" }}
          severity={alertMessage?.severity}
        >
          {alertMessage?.snackBarMessage}
        </Alert>
      </Snackbar>
    </PullToRefresh>
  );
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

export default GroceryListPage;
