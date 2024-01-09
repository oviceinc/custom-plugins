const { useState, useCallback } = React;

function useMemoStore({ user, users, cache, updateCache, onStoreEvent }) {
  const [memoData, updateMemo] = useState(cache.value || '');
  const [writingUsersList, updateWritingUsersList] = useState(
    (cache.writingUsersList && cache.writingUsersList.split(',')) || []
  );
  const { Toast, successToast, errorToast } = useToast();
  const userIdList = users ? users.map(v => v.id) : [];
  const otherUserIdList = userIdList
    ? userIdList.filter(id => id !== user.id)
    : [];
  const isWriting = writingUsersList.some(id => id === user.id);
  const writingOtherUsers = writingUsersList.filter(id =>
    otherUserIdList.some(v => v === id)
  );

  const saveMemo = useCallback(() => {
    updateCache({
      ...cache,
      value: memoData,
    });
  }, [memoData, cache, updateCache]);

  const clearMemo = useCallback(() => {
    updateCache({});
  }, [updateCache]);

  const autoSaveMemo = useCallback(
    memoText => {
      updateMemo(memoText);
    },
    [updateMemo]
  );

  const addWriting = useCallback(() => {
    updateCache({
      ...cache,
      writingUsersList: [...new Set([...writingUsersList, user.id])].join(','),
    });
  }, [writingUsersList, user, cache, updateCache]);

  const removeWriting = useCallback(() => {
    updateCache({
      ...cache,
      writingUsersList: writingUsersList
        .filter(item => item !== user.id)
        .join(','),
    });
  }, [writingUsersList, user, cache, updateCache]);

  useEffect(() => {
    onStoreEvent(event => {
      if (event.type === 'ovice_data_saved_success') {
        successToast({ text: 'Success Save', position: 'rightTop' });
      }
    });
  }, [onStoreEvent]);

  useEffect(() => {
    if (!isWriting) return;
    if (cache.value === memoData) return;
    const t = setTimeout(() => {
      updateCache({
        ...cache,
        value: memoData,
      });
    }, 1000);
    return () => {
      if (!t) return;
      clearTimeout(t);
    };
  }, [isWriting, memoData, cache, updateCache]);

  useEffect(() => {
    updateMemo(cache.value || '');
    if (!cache.value) return;
    successToast({ text: 'Updated', position: 'rightTop' });
  }, [cache.value, updateMemo]);

  useEffect(() => {
    updateWritingUsersList(
      (cache.writingUsersList && cache.writingUsersList.split(',')) || []
    );
  }, [cache.writingUsersList, updateWritingUsersList]);

  return {
    memoData,
    updateMemo,
    saveMemo,
    clearMemo,
    autoSaveMemo,
    addWriting,
    removeWriting,
    writingUsersList,
    writingOtherUsers,
    successToast,
    errorToast,
    Toast,
  };
}
