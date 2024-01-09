function MemoApp() {
  const copyToClipboard = useCopyToClipboard();
  const client = useCustomObjectClient();
  const { cache, updateCache } = useCacheStore({
    ...client,
    enableBackup: false,
  });
  const {
    memoData,
    autoSaveMemo,
    addWriting,
    removeWriting,
    writingOtherUsers,
    successToast,
    errorToast,
    Toast,
  } = useMemoStore({
    ...client,
    cache,
    updateCache,
  });

  const handleCopyClick = () => {
    if (copyToClipboard(cache.value)) {
      successToast({ text: 'Success Copy!' });
    } else {
      errorToast({ text: 'Failed Copy!' });
    }
  };

  return (
    <div className="h-screen flex flex-col gap-1 select-none">
      <h2 className="flex-none text-xl font-bold">Memo</h2>
      <div className="flex-1 flex relative group">
        <textarea
          type="number"
          id="memo"
          value={memoData}
          onChange={e => autoSaveMemo(e.target.value)}
          onFocus={addWriting}
          onBlur={removeWriting}
          className="w-full border border-gray-400 rounded px-2 py-1"
        />
        <div className="absolute top-1 right-1 text-sm hidden group-hover:block">
          <button className="p-1 rounded" onClick={handleCopyClick}>
            <span className="material-symbols-outlined text-base">
              content_copy
            </span>
          </button>
        </div>
      </div>
      <div className="flex-none flex justify-start gap-2 h-5">
        <div className="text-gray-500 text-sm">
          {writingOtherUsers.length > 0 && (
            <div className="flex gap-1">
              <div>
                <span className="material-symbols-outlined text-sm">
                  person_edit
                </span>
              </div>
              <div>{writingOtherUsers.length}</div>
            </div>
          )}
        </div>
      </div>
      <Toast />
    </div>
  );
}

ReactDOM.render(<MemoApp />, document.getElementById('root'));
