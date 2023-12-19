import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { URLS } from "./enum";

// Private functions
const subscribeToTopic = (topic, onSuccess, onError) => {
  if (stompClient.connected) {
    stompClient.subscribe(topic, async (message) => {
      const parsedMessage = await JSON.parse(message.body);
      const res = parsedMessage?.body;
      if (res?.status === 200) {
        onSuccess(parsedMessage);
      } else {
        onError(parsedMessage);
      }
    });
  }
};

const unscubscribeFromTopic = (topic) => {
  if (stompClient.connected) {
    stompClient.unsubscribe(topic, () => {
      console.log("Attempting to unsubscribe");
    });
  }
};

const engine = "https://katespracticespace.com/websocket-shared-list"
// const engine = "http://joses-macbook-pro-4.local:8080/websocket-shared-list"

// Stom client definitions
export const socket = new SockJS(engine);

export const stompClient = Stomp.over(() => new SockJS(engine));

// Stomp handlers
export const atomicConnectSubscribe = (onConnectSuccess) => {
  // stompClient.disconnect(() => {});
  stompClient.connect(
    {},
    () => {
      onConnectSuccess();
    },
    (e) => console.error(e)
  );
};

export const connectWebSocket = (onConnectSuccessful, onConnectUnsuccessful) => {
  stompClient.connect({}, onConnectSuccessful, onConnectUnsuccessful);
};

export const subscribeToRestrictedList = (listId, onSuccess, onError) => {
  console.debug("Subscribing to restricted topic")
  subscribeToTopic(`/topic/restricted/${listId}`, onSuccess, onError);
}

export const subscribeToPublicList = (listId, onSuccess, onError) => {
  console.debug("Subscribing to public topic")
  subscribeToTopic(`/topic/public/${listId}`, onSuccess, onError);
}

export const unscubscribeFromRestrictedList = (listId) => {
  unscubscribeFromTopic(`/topic/restricted/${listId}`)
}

export const unscubscribeFromPublicList = (listId) => {
  unscubscribeFromTopic(`/topic/public/${listId}`)
}

export const disconnectWebSocket = (onDisconnectSuccessful, onDisconnectUnssuccesful) => {
  if (stompClient) {
    stompClient.disconnect(onDisconnectSuccessful, onDisconnectUnssuccesful);
  }
};

export const isWebSocketConnected = () => {
  return stompClient.connected;
};

// Define authenticated requests senders
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

// Define public request senders
export const publicAddItemWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };

  // Send message
  stompClient.send(`${URLS.wsPublicAddItem}/${listId}`, headers, JSON.stringify(message));
};

export const publicDeleteItemWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };

  stompClient.send(`${URLS.wsPublicDeleteItem}/${listId}`, headers, JSON.stringify(message));
};

export const publicEditItemWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };

  stompClient.send(`${URLS.wsPublicEditItem}/${listId}`, headers, JSON.stringify(message));
};

export const publicCheckItemsWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };
  stompClient.send(`${URLS.wsPublicCheckItems}/${listId}`, headers, JSON.stringify(message));
};

export const publicRemoveCheckedListItemsWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };

  stompClient.send(`${URLS.wsPublicRemoveCheckedItems}/${listId}`, headers, JSON.stringify(message));
};

export const publicRemoveListItemsWs = async (listId, message, action, username) => {
  // Define headers
  const headers = {
    username: username,
    action: action,
  };

  stompClient.send(`${URLS.wsPublicRemoveItems}/${listId}`, headers, JSON.stringify(message));
};


