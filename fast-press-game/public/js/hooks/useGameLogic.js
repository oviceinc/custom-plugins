const { useState, useCallback, useEffect } = React;

function useGameLogic() {
  const { user, isHost, isStaticObject, isJoined, emit, onMessageEvent } =
    useCustomObjectClient();

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isStandby, setIsStandby] = useState(false);
  const [fastest, setFastest] = useState([]);
  const isGameMaster = isHost || (isStaticObject && isJoined);
  const winner = fastest.length > 0;

  const startGame = useCallback(() => {
    setIsGameStarted(true);
    setIsStandby(false);
    emit('gameStarted', { startTimestamp: new Date().getTime() });
  }, [emit]);

  const answer = useCallback(() => {
    if (winner) return;
    setIsGameStarted(false);
    setIsStandby(false);
    const now = new Date().getTime();
    setFastest(prev => [...prev, { name: user.name || 'unknown', time: now }]);
    emit('gameEnded', { name: user.name || 'unknown', endTimestamp: now });
  }, [winner, user.name, emit]);

  const reset = useCallback(() => {
    setIsGameStarted(false);
    setIsStandby(false);
    setFastest([]);
    emit('gameReset', {});
  }, [emit]);

  useEffect(() => {
    const handleEvent = event => {
      console.log('event', event);
      switch (event.event) {
        case 'gameStarted':
          setIsGameStarted(true);
          setIsStandby(false);
          setFastest([]);
          break;
        case 'gameEnded':
          setIsGameStarted(false);
          setIsStandby(false);
          setFastest(prev => [
            ...prev,
            { name: event.message.name, time: event.message.time },
          ]);
          break;
        case 'gameReset':
          setIsGameStarted(false);
          setIsStandby(false);
          setFastest([]);
          break;
      }
    };

    onMessageEvent(handleEvent);
  }, []);

  const playAudio = useCallback(volume => {
    const audio = new Audio('./asset/audio/correct001.mp3');
    audio.volume = volume;
    audio.play();
  }, []);

  useEffect(() => {
    if (winner) {
      playAudio(0.02);
    }
  }, [winner, playAudio]);

  useEffect(() => {
    if (user.id && isGameStarted) {
      playAudio(0);
    }
  }, [user.id, isGameStarted, playAudio]);

  return {
    user,
    isGameMaster,
    isGameStarted,
    isStandby,
    fastest,
    winner,
    startGame,
    answer,
    reset,
  };
}
