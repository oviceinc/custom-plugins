const { useState, useCallback } = React;

function useMemoStore(store, saveStore, resetStore, onStoreEvent) {
  const [memoData, updateMemo] = useState(store.value || '');
  const [isSavedMemo, setSaved] = useState(false);

  const saveMemo = useCallback(() => {
    saveStore({ value: memoData });
  }, [memoData, saveStore]);

  const clearMemo = useCallback(() => {
    resetStore();
  }, [resetStore]);

  useEffect(() => {
    onStoreEvent(event => {
      let t = null;
      if (event.type === 'ovice_data_saved_success') {
        setSaved(true);
        t = setTimeout(() => {
          setSaved(false);
        }, 1000);
      }
      return () => {
        if (!t) return;
        clearTimeout(t);
      };
    });
  }, [onStoreEvent]);

  useEffect(() => {
    updateMemo(store.value || '');
  }, [store.value, updateMemo]);

  return {
    memoData,
    updateMemo,
    saveMemo,
    clearMemo,
    isSavedMemo,
  };
}
