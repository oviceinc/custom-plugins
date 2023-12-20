const { useState, useCallback } = React;

function useGrouping(users, broadcast) {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState([]);

  const handleGrouping = useCallback(() => {
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const groupedUsers = [];
    const groupUserLimit = Math.ceil(users.length / groupSize);
    for (let i = 0; i < users.length; i += groupUserLimit) {
      const group = shuffledUsers.slice(i, i + groupUserLimit);
      groupedUsers.push(group);
    }
    broadcast('grouping', { groups: groupedUsers });
    setGroups(groupedUsers);
  }, [users, groupSize, broadcast]);

  return {
    groupSize,
    setGroupSize,
    groups,
    setGroups,
    handleGrouping,
  };
}
