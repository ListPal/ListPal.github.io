import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { URLS } from "./enum";

export const socket = new SockJS("http://joses-macbook-pro-4.local:8080/websocket-shared-list");

export const stompClient = Stomp.over(() => new SockJS("http://joses-macbook-pro-4.local:8080/websocket-shared-list"));

export const atomicConnectSubscribe = (onConnectSuccess) => {
  stompClient.disconnect(() => {});
  stompClient.connect(
    {},
    () => {
      onConnectSuccess();
    },
    (e) => console.error(e)
  );
};

export const connectWebSocket = () => {
  const onConnectSuccessful = () => {
    console.log("Connected to WebSocket");
  };

  const onConnectUnsuccessful = () => {
    console.log("Not able to connect to WebSocket");
  };

  stompClient.connect({}, onConnectSuccessful, onConnectUnsuccessful);
};

export const subscribeToList = (listId, onSuccess, onError) => {
  if (stompClient.connected) {
    stompClient.subscribe(`/topic/restricted/${listId}`, async (message) => {
      const parsedMessage = await JSON.parse(message.body);
      const res = parsedMessage?.body;
      console.log(res?.status);
      if (res?.status === 200) {
        onSuccess(parsedMessage);
      } else {
        onError(res);
      }
    });
  }
};

export const unscubscribeFromList = (listId) => {
  if (stompClient.connected) {
    stompClient.unsubscribe(`/topic/restricted/${listId}`, () => {
      console.log("Attempting to unsubscribe");
    });
  }
};

export const addItemWs = async (listId, message, action, token) => {
  // Define headers
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  // Send message
  stompClient.send(`${URLS.wsAddItem}/${listId}`, headers, JSON.stringify(message));
};

export const deleteItemWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`${URLS.wsDeleteItem}/${listId}`, headers, JSON.stringify(message));
};

export const editItemWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`${URLS.wsEditItem}/${listId}`, headers, JSON.stringify(message));
};

export const checkItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`${URLS.wsCheckItems}/${listId}`, headers, JSON.stringify(message));
};

export const removeCheckedListItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`${URLS.wsRemoveCheckedItems}/${listId}`, headers, JSON.stringify(message));
};

export const removeListItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`${URLS.wsRemoveItems}/${listId}`, headers, JSON.stringify(message));
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    console.log("disconnecting ws");
    stompClient.disconnect();
  }
};

export const isWebSocketConnected = () => {
  return stompClient.connected;
};
