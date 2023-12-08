const { useState, useRef, useCallback, useEffect } = React;
// Managing user information
function useUsers() {
  const [user, setUser] = useState({});
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
      window.parent.postMessage(message, '*');
    },
    [window]
  );
  const emit = useCallback(
    (event, message) => {
      postMessage({
        type: 'ovice_emit_to_others',
        payload: {
          event: event,
          message: message,
          objectId: user.objectId && user.objectId.toString(),
          source: user.id && user.id.toString(),
        },
      });
    },
    [user, postMessage]
  );
  const emitTo = useCallback(
    (userId, event, message) => {
      postMessage({
        type: 'ovice_emit_to',
        payload: {
          event: event,
          message: message,
          objectId: user.objectId && user.objectId.toString(),
          source: user.id && user.id.toString(),
          to: userId && userId.toString(),
        },
      });
    },
    [user, postMessage]
  );
  return { postMessage, emit, emitTo };
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
  const isMaster =
    isHost ||
    (isStaticObject ? user.id.toString() === users[0].id.toString() : false);
  const isJoined =
    users.length &&
    user.id &&
    users.some(
      v => user.id.toString() === v.id.toString() && v.status === 'joined'
    );
  return { isStaticObject, isDynamicObject, isHost, isMaster, isJoined };
}
// Initialization and updating the user list
function useInitialization(postMessage) {
  const init = useCallback(() => {
    postMessage({
      type: 'ovice_ready',
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
  const { postMessage, emit, emitTo } = useMessageEmitter(user);
  // Calculating status
  const { isStaticObject, isDynamicObject, isHost, isMaster, isJoined } =
    useStatus(user, users);
  // Initialization and updating the user list
  const { init, updateUsers } = useInitialization(postMessage);
  // Message handler
  const handleMessage = useCallback(
    event => {
      console.log('handleMessage event', event.data);
      const { type, payload = {} } = event.data;
      eventFunction.current && eventFunction.current(event.data);
      setLastMessage(event.data);
      switch (type) {
        case 'ovice_participants':
          setUsers(payload);
          break;
        case 'ovice_participant_subscribed':
        case 'ovice_participant_unsubscribed':
        case 'ovice_participant_joined':
        case 'ovice_participant_left':
          setUser(payload);
          userEventFunction.current && userEventFunction.current(payload);
          break;
        case 'ovice_other_participant_subscribed':
        case 'ovice_other_participant_unsubscribed':
        case 'ovice_other_participant_joined':
        case 'ovice_other_participant_left':
          userEventFunction.current && userEventFunction.current(payload);
          break;
        case 'ovice_confirmation':
          postMessage({ type: 'ovice_ready_confirmed' });
          break;
        case 'ovice_event_message':
          messageEventFunction.current &&
            messageEventFunction.current({
              ...payload,
              eventType: payload.event,
            });
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
    emit,
    emitTo,
    onEvent,
    onUserEvent,
    onMessageEvent,
  };
}
