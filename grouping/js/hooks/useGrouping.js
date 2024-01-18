const { useState, useCallback } = React;

function useGrouping(users, broadcast, onMessageEvent) {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState([]);
  const [isShuffling, setShuffling] = useState(false);
  const userCount = users.length || 0;
  const groupSizeList = [...new Array(userCount)]
    .map((_, index) => index + 1)
    .filter(index => index > 0);

  const shuffleGroup = () => {
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const groupedUsers = Array.from({ length: groupSize }, () => []);

    shuffledUsers.forEach((user, index) => {
      groupedUsers[index % groupSize].push(user);
    });

    return groupedUsers;
  };

  const handleGrouping = useCallback(() => {
    setShuffling(true);
    broadcast('shuffling', { isShuffling: true, groupSize: groupSize });

    setTimeout(() => {
      shuffleGroup();

      setShuffling(false);
      const result = shuffleGroup();
      broadcast('grouping', { groups: result });
      setGroups(result);
    }, 2000);
  }, [shuffleGroup, setShuffling, broadcast, groupSize]);

  useEffect(() => {
    onMessageEvent(event => {
      switch (event.event) {
        case 'grouping':
          if (event.message) {
            setShuffling(false);
            setGroups(event.message.groups);
          }
          break;
        case 'shuffling':
          if (event.message) {
            setGroupSize(event.message.groupSize);
            setShuffling(event.message.isShuffling);
          }
          break;
      }
    });
  }, [onMessageEvent, setGroups, setShuffling]);

  useEffect(() => {
    if (!isShuffling) return;
    let count = 0;
    const tick = setInterval(() => {
      count++;
      if (count > 30) {
        if (!tick) return;
        clearInterval(tick);
        setShuffling(false);
        return;
      }
      setGroups(shuffleGroup());
    }, 50);

    return () => {
      if (!tick) return;
      clearInterval(tick);
    };
  }, [isShuffling, shuffleGroup, setShuffling]);

  return {
    groupSize,
    groupSizeList,
    isShuffling,
    setGroupSize,
    groups,
    setGroups,
    handleGrouping,
  };
}
