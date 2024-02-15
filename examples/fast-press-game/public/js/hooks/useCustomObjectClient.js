const { useState, useRef, useCallback, useEffect } = React;

class Participant {
  constructor(data = {}) {
    this.id = data.id && data.id.toString();
    this.email = data.email;
    this.name = data.name && data.name.replace(/\s+/g, ' ');
    this.objectId = data.objectId && data.objectId.toString();
    this.objectType = data.objectType;
    this.avatarUrl = data.avatarUrl;
    this.workspaceId = data.workspaceId && data.workspaceId.toString();
    this.isHost = data.isHost;
    this.isSelf = data.isSelf;
    this.isVisitor = data.isVisitor;
    this.language = data.language;
    this.status = data.status; // joined, subscribed, etc.
  }
}

class Message {
  constructor(data = {}) {
    this.source = data.source;
    this.event = data.event;
    this.objectId = data.objectId;
    this.message = data.message;
    this.to = data.to && data.to.toString(); // Optional, only used for direct messages
  }
}

class MessageEvent {
  constructor(data = {}) {
    this.type = data.type;
    this.payload = data.payload;
  }
}

// Managing user information
function useUsers() {
  const [user, setUser] = useState(new Participant());
  const [users, setUsers] = useState([]);
  return { user, users, setUser, setUsers };
}
// Managing data store information
function useDataStore() {
  const [store, setStore] = useState({});
  return { store, setStore };
}
// Event handling
function useEventHandlers() {
  const eventFunction = useRef(() => {});
  const userEventFunction = useRef(() => {});
  const storeEventFunction = useRef(() => {});
  const messageEventFunction = useRef(() => {});
  const onEvent = useCallback(callback => {
    eventFunction.current = callback;
  }, []);
  const onUserEvent = useCallback(callback => {
    userEventFunction.current = callback;
  }, []);
  const onStoreEvent = useCallback(callback => {
    storeEventFunction.current = callback;
  }, []);
  const onMessageEvent = useCallback(callback => {
    messageEventFunction.current = callback;
  }, []);
  return {
    onEvent,
    onUserEvent,
    onStoreEvent,
    onMessageEvent,
    eventFunction,
    userEventFunction,
    storeEventFunction,
    messageEventFunction,
  };
}
// Sending messages
function useMessageEmitter(user) {
  const postMessage = useCallback(
    message => {
      const messageInstance = new MessageEvent(message);
      window.parent.postMessage(messageInstance, '*');
    },
    [window]
  );
  const broadcast = useCallback(
    (event, message) => {
      postMessage({
        type: 'ovice_broadcast_message',
        payload: {
          event: event,
          message: message,
        },
      });
    },
    [user, postMessage]
  );
  const emitTo = useCallback(
    (userId, event, message) => {
      postMessage({
        type: 'ovice_emit_message',
        payload: {
          event: event,
          message: message,
          to: userId,
        },
      });
    },
    [user, postMessage]
  );
  return { postMessage, broadcast, emitTo };
}
// Calculating status
function useStatus(user, users) {
  const isStaticObject = users.length
    ? users.every(user => !user.isHost)
    : false;
  const isDynamicObject = users.length
    ? users.some(user => user.isHost)
    : false;
  const isHost = user.isHost === true;
  const isMaster = isHost || (isStaticObject ? user.id === users[0].id : false);
  const isJoined =
    users.length &&
    user.id &&
    users.some(v => user.id === v.id && v.status === 'joined');
  return { isStaticObject, isDynamicObject, isHost, isMaster, isJoined };
}
// Initialization and updating the user list
function useInitialization(postMessage) {
  const init = useCallback(() => {
    postMessage({
      type: 'ovice_get_data',
    });
    postMessage({
      type: 'ovice_get_participants',
    });
  }, [postMessage]);
  const updateUsers = useCallback(() => {
    postMessage({
      type: 'ovice_get_participants',
    });
  }, [postMessage]);
  return { init, updateUsers };
}
// Updating the data store
function useUpdateDataStore(postMessage, setStore) {
  const saveStore = useCallback(
    (data = {}) => {
      const message = new MessageEvent({
        type: 'ovice_save_and_emit_data',
        payload: data,
      });
      setStore(data);
      postMessage(message);
    },
    [setStore, postMessage]
  );
  const resetStore = useCallback(() => {
    saveStore({});
  }, [saveStore]);
  return { saveStore, resetStore };
}
function useCustomObjectClient() {
  const [lastMessage, setLastMessage] = useState(null);
  // Managing user information
  const { user, users, setUser, setUsers } = useUsers();
  // Managing data store information
  const { store, setStore } = useDataStore();
  // Managing event handlers
  const {
    onEvent,
    onUserEvent,
    onStoreEvent,
    onMessageEvent,
    eventFunction,
    userEventFunction,
    storeEventFunction,
    messageEventFunction,
  } = useEventHandlers();
  // Sending messages
  const { postMessage, broadcast, emitTo } = useMessageEmitter(user);
  // Calculating status
  const { isStaticObject, isDynamicObject, isHost, isMaster, isJoined } =
    useStatus(user, users);
  // Initialization and updating the user list
  const { init, updateUsers } = useInitialization(postMessage);
  // Updating the data store
  const { saveStore, resetStore } = useUpdateDataStore(postMessage, setStore);
  // Message handler
  const handleMessage = useCallback(
    event => {
      const eventInstance = new MessageEvent(event.data);
      eventFunction.current && eventFunction.current(eventInstance);
      setLastMessage(event.data);
      switch (eventInstance.type) {
        case 'ovice_participants':
          const participants = eventInstance.payload
            .map(p => (p.id && p.workspaceId ? new Participant(p) : null))
            .filter(v => v);
          setUsers(participants);
          setUser(
            participants.find(participant => {
              return participant.isSelf;
            }) || new Participant()
          );
          break;
        case 'ovice_participant_subscribed':
        case 'ovice_participant_unsubscribed':
        case 'ovice_participant_joined':
        case 'ovice_participant_left':
          const participant = new Participant(eventInstance.payload);
          if (participant.isSelf) {
            setUser(participant);
          }
          userEventFunction.current && userEventFunction.current(participant);
          break;
        case 'ovice_confirmation':
          postMessage({ type: 'ovice_ready_confirmed' });
          break;
        case 'ovice_shared_data':
        case 'ovice_saved_data':
          setStore(eventInstance.payload);
          storeEventFunction.current &&
            storeEventFunction.current(eventInstance);
          break;
        case 'ovice_data_saved_success':
          storeEventFunction.current &&
            storeEventFunction.current(eventInstance);
          break;
        case 'ovice_message':
          const message = new Message(eventInstance.payload);
          messageEventFunction.current && messageEventFunction.current(message);
          break;
        default:
          break;
      }
    },
    [setUsers, setUser, postMessage, setStore, setLastMessage]
  );
  // Registering event listener and cleanup on initialization
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    init();
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage, init]);
  // Updating user information
  useEffect(() => {
    let timeoutId = null;
    if (
      lastMessage &&
      lastMessage.type.startsWith('ovice_participant_')
    ) {
      timeoutId = setTimeout(updateUsers, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastMessage, updateUsers]);
  // Returning the set of values provided by the custom hook
  return {
    user,
    users,
    store,
    isStaticObject,
    isDynamicObject,
    isHost,
    isMaster,
    isJoined,
    saveStore,
    resetStore,
    updateUsers,
    postMessage,
    broadcast,
    emitTo,
    onEvent,
    onUserEvent,
    onStoreEvent,
    onMessageEvent,
  };
}
