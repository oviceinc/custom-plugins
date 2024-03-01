const { useState, useCallback } = React;

function useMajorityDataStore({ user, cache, updateCache, onStoreEvent }) {
  const [choices, setChoices] = useState(
    (cache.choices && cache.choices.split(',')) || ['A', 'B', 'C', 'D', 'E']
  );
  const [majorityData, setMajority] = useState(cache.value || {});
  const [resultsVisible, setResultsVisible] = useState(
    cache.resultsVisible || false
  );
  const { Toast, successToast } = useToast();

  const startMajority = useCallback(() => {
    updateCache({
      choices: choices && choices.join(','),
      value: {},
      resultsVisible: resultsVisible,
    });
    successToast({ text: 'Success Save', position: 'rightTop' });
  }, [choices, majorityData, resultsVisible, updateCache]);

  const addMajority = useCallback(
    selectItem => {
      updateCache({
        ...cache,
        value: {
          ...cache.value,
          [user.id]: selectItem,
        },
      });
      successToast({ text: 'Success Save', position: 'rightTop' });
    },
    [cache, user.id, updateCache]
  );

  const clearMajority = useCallback(() => {
    updateCache({});
    successToast({ text: 'Success Save', position: 'rightTop' });
  }, [updateCache]);

  useEffect(() => {
    onStoreEvent(event => {
      if (event.type === 'ovice_data_saved_success') {
        successToast({ text: 'Success Backup', position: 'rightTop' });
      }
    });
  }, [onStoreEvent]);

  useEffect(() => {
    setChoices(
      (cache.choices && cache.choices.split(',')) || ['A', 'B', 'C', 'D', 'E']
    );
  }, [cache.choices, setChoices]);

  useEffect(() => {
    setMajority(cache.value || {});
  }, [cache.value, setMajority]);

  useEffect(() => {
    setResultsVisible(cache.resultsVisible || false);
  }, [cache.resultsVisible, setResultsVisible]);

  return {
    majorityData,
    choices,
    setChoices,
    resultsVisible,
    setResultsVisible,
    setMajority,
    addMajority,
    startMajority,
    clearMajority,
    Toast,
  };
}
