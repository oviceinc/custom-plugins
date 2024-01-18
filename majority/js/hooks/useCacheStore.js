const { useState, useEffect, useCallback } = React;

const validateCacheData = data => {
  if (!data) return;
  if (typeof data !== 'object') return false;
  const keys = Object.keys(data);
  if (keys.length === 0) return true;
  if (
    keys.every(key => {
      switch (typeof data[key]) {
        case 'string':
        case 'bigint':
        case 'number':
        case 'undefined':
        case 'boolean':
          return true;
        case 'object':
          if (Array.isArray(data[key])) return false;
          return true;
        default:
          return false;
      }
    })
  )
    return true;
};

const useCacheStore = ({
  user,
  users,
  store,
  onEvent,
  onMessageEvent,
  broadcast,
  emitTo,
  saveStore,
  enableBackup = true,
}) => {
  const prefix = 'use-cache-';
  const eventNames = {
    transferData: `${prefix}transfer-data`,
    updateCache: `${prefix}update-cache`,
    updateRequest: `${prefix}update-request`,
    requestData: `${prefix}request-data`,
  };
  const [cache, setCache] = useState(null);
  const [isDataOwner, setIsDataOwner] = useState(false);

  const determineDataOwner = useCallback(() => {
    return users.length > 0 && users[0].id === user.id;
  }, [users, user]);

  const transferDataToNextUser = useCallback(
    currentUsers => {
      if (!currentUsers) return;
      const nextUser = currentUsers.find(u => u.id !== user.id);
      if (nextUser) {
        emitTo(nextUser.id, eventNames.transferData, cache);
      } else {
        if (!validateCacheData(cache)) {
          console.log('validate error');
        }
        if (JSON.stringify(cache) === JSON.stringify(store)) {
          // console.log('keep store');
        } else {
          if (!enableBackup) return;
          saveStore(cache);
          console.log('store backup done');
        }
      }
    },
    [user, emitTo, saveStore, cache, store, enableBackup]
  );

  const respondToDataRequest = useCallback(
    requestingUserId => {
      if (isDataOwner) {
        emitTo(requestingUserId, eventNames.updateCache, cache || {});
      }
    },
    [isDataOwner, emitTo, cache]
  );

  useEffect(() => {
    onMessageEvent(event => {
      if (event.event === eventNames.updateCache) {
        setCache(event.message);
      } else if (event.event === eventNames.updateRequest) {
        setCache(event.message);
        broadcast(eventNames.updateCache, event.message);
      } else if (
        event.event === eventNames.transferData &&
        event.to === user.id
      ) {
        setCache(event.message);
        setIsDataOwner(true);
      } else if (event.event === eventNames.requestData) {
        respondToDataRequest(event.source);
      }
    });
  }, [
    user,
    cache,
    isDataOwner,
    broadcast,
    onMessageEvent,
    respondToDataRequest,
  ]);

  useEffect(() => {
    onEvent(event => {
      if (!event.payload) return;
      if (
        event.type === 'ovice_participant_subscribed' ||
        event.type === 'ovice_participant_joined'
      ) {
        if (!event.payload.isSelf) return;
        if (cache) return;
        broadcast(eventNames.requestData, {});
      } else if (
        event.type === 'ovice_participant_unsubscribed' &&
        isDataOwner
      ) {
        if (!event.payload.isSelf) return;
        transferDataToNextUser(users);
      } else if (event.type === 'ovice_saved_data' && isDataOwner) {
        if (cache) return;
        setCache(event.payload);
      } else if (event.type === 'ovice_shared_data') {
        setCache(event.payload);
      }
    });
  }, [isDataOwner, users, cache, onEvent, broadcast, transferDataToNextUser]);

  useEffect(() => {
    setIsDataOwner(determineDataOwner());
  }, [users, determineDataOwner]);

  useEffect(() => {
    if (!isDataOwner) return;
    if (!users || users.length > 1) return;
    if (!cache) return;
    if (JSON.stringify(cache) === JSON.stringify(store)) return;
    if (!validateCacheData(cache)) return;
    if (!enableBackup) return;
    const t = setTimeout(() => {
      saveStore(cache);
    }, 5000);
    return () => {
      if (!t) return;
      clearTimeout(t);
    };
  }, [isDataOwner, users, cache, store, saveStore, enableBackup]);

  const updateCache = useCallback(
    newData => {
      setCache(newData);
      if (isDataOwner) {
        broadcast(eventNames.updateCache, newData);
      } else {
        broadcast(eventNames.updateRequest, newData);
      }
    },
    [isDataOwner, broadcast]
  );

  return { cache: cache || {}, updateCache };
};
