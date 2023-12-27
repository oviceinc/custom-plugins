function MemoApp() {
  const {
    store,
    saveStore,
    resetStore,
    onStoreEvent,
  } = useCustomObjectClient();
  const {
    memoData,
    updateMemo,
    saveMemo,
    clearMemo,
    isSavedMemo
  } = useMemoStore(store, saveStore, resetStore, onStoreEvent)

  return (
    <div className="h-screen flex flex-col gap-2 select-none">
      <h2 className="flex-none text-xl font-bold">Memo</h2>
      <div className="flex-1 flex relative">
        <textarea
          type="number"
          id="memo"
          value={memoData}
          onChange={e => updateMemo(e.target.value)}
          className="w-full border border-gray-400 rounded px-2 py-1"
        />
        <div className="absolute bottom-0 right-0 p-2 text-blue-500">
          {isSavedMemo ? 'saved' : ''}
        </div>
      </div>
      <div className="flex-none flex justify-end gap-2">
        <button
          className="rounded border px-3 py-1 bg-blue-400 text-white hover:bg-blue-500 active:bg-blue-700"
          onClick={saveMemo}
        >
          Save
        </button>
        <button
          className="rounded border px-3 py-1 bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-700"
          onClick={clearMemo}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<MemoApp />, document.getElementById('root'));
