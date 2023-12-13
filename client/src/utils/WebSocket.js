import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const stompClient = Stomp.over(
  () => new SockJS("http://joses-macbook-pro-4.local:8080/websocket-shared-list")
);

export const connectWebSocket = () => {
  const onConnectSuccessful = () => {
    console.log("Connected to WebSocket");
  };

  const onConnectUnsuccessful = () => {
    console.log("Not able to connect to WebSocket");
  };

  stompClient.connect({}, onConnectSuccessful, onConnectUnsuccessful);
};

export const subscribeTest = () => {
  stompClient.subscribe(`/topic/restricted/test`, (e) => {
    console.log("Attempting to subscribe..." + e.body);
  });
};

export const unsubscribeTest = () => {
  stompClient.unsubscribe(`/topic/restricted/test`, () => {
    console.log("Attempting to unsubscribe...");
  });
};

export const subscribeToList = (listId, onSuccess, onError) => {
  if (stompClient.connected) {
    stompClient.subscribe(`/topic/restricted/${listId}`, async (message) => {
      // console.log("Console logging message.body: " + message.body);
      const m = await JSON.parse(message.body);
      const res = m?.body;
      console.log(res?.status);
      if (res?.status === 200) {
        onSuccess(m);
      } else {
        onError();
      }
    });
  }
};

export const unscubscribeFromList = (listId) => {
  if (!stompClient.connected) {
    disconnectWebSocket();
    connectWebSocket();
  }

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
  stompClient.send(`/app/add-item/${listId}`, headers, JSON.stringify(message));
};

export const deleteItemWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`/app/delete-item/${listId}`, headers, JSON.stringify(message));
};

export const editItemWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`/app/edit-item/${listId}`, headers, JSON.stringify(message));
};

export const checkItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`/app/check-items/${listId}`, headers, JSON.stringify(message));
};

export const removeCheckedListItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`/app/remove-checked-list-items/${listId}`, headers, JSON.stringify(message));
};

export const removeListItemsWs = async (listId, message, action, token) => {
  const headers = {
    Authorization: `Bearer ${token}`,
    action: action,
  };

  stompClient.send(`/app/remove-list-items/${listId}`, headers, JSON.stringify(message));
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
