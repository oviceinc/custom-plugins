const { useState, useRef, useCallback, useEffect } = React;

class Participant {
  constructor(data = {}) {
    this._id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.objectId = data.objectId;
    this.objectType = data.objectType;
    this.avatarUrl = data.avatarUrl;
    this._workspaceId = data.workspaceId;
    this.isHost = data.isHost;
    this.isSelf = data.isSelf;
    this.isVisitor = data.isVisitor;
    this.language = data.language;
    this.status = data.status; // joined, subscribed, etc.
  }
  get id() {
    return this._id && this._id.toString();
  }
  get workspaceId() {
    return this._workspaceId && this._workspaceId.toString();
  }
}

class Message {
  constructor(data = {}) {
    this.source = data.source;
    this.event = data.event;
    this.objectId = data.objectId;
    this.message = data.message;
    this._to = data.to; // Optional, only used for direct messages
  }
  get to() {
    return this._to && this._to.toString();
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
// Event handling
function useEventHandlers() {
  const eventFunction = useRef(() => {});
  const userEventFunction = useRef(() => {});
  const messageEventFunction = useRef(() => {});
  const onEvent = useCallback(callback => {
    eventFunction.current = callback;
  }, []);
  const onUserEvent = useCallback(callback => {
    userEventFunction.current = callback;
  }, []);
  const onMessageEvent = useCallback(callback => {
    messageEventFunction.current = callback;
  }, []);
  return {
    onEvent,
    onUserEvent,
    onMessageEvent,
    eventFunction,
    userEventFunction,
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
          objectId: user.objectId && user.objectId.toString(),
          source: user.id && user.id,
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
          objectId: user.objectId && user.objectId.toString(),
          source: user.id && user.id,
          to: userId && userId,
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
function useCustomObjectClient() {
  const [lastMessage, setLastMessage] = useState(null);
  // Managing user information
  const { user, users, setUser, setUsers } = useUsers();
  // Managing event handlers
  const {
    onEvent,
    onUserEvent,
    onMessageEvent,
    eventFunction,
    userEventFunction,
    messageEventFunction,
  } = useEventHandlers();
  // Sending messages
  const { postMessage, broadcast, emitTo } = useMessageEmitter(user);
  // Calculating status
  const { isStaticObject, isDynamicObject, isHost, isMaster, isJoined } =
    useStatus(user, users);
  // Initialization and updating the user list
  const { init, updateUsers } = useInitialization(postMessage);
  // Message handler
  const handleMessage = useCallback(
    event => {
      const eventInstance = new MessageEvent(event.data);
      eventFunction.current && eventFunction.current(eventInstance);
      setLastMessage(event.data);
      switch (eventInstance.type) {
        case 'ovice_participants':
          const participants = eventInstance.payload.map(
            p => new Participant(p)
          );
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
        case 'ovice_message':
          const message = new Message(eventInstance.payload);
          messageEventFunction.current && messageEventFunction.current(message);
          break;
        default:
          break;
      }
    },
    [setUsers, setUser, postMessage]
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
      (lastMessage.type.startsWith('ovice_participant_') ||
        lastMessage.type.startsWith('ovice_other_participant_'))
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
    isStaticObject,
    isDynamicObject,
    isHost,
    isMaster,
    isJoined,
    updateUsers,
    postMessage,
    broadcast,
    emitTo,
    onEvent,
    onUserEvent,
    onMessageEvent,
  };
}
