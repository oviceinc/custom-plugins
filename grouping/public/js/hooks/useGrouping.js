const { useState, useCallback } = React;

function useGrouping(users, emit) {
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
    emit('grouping', { groups: groupedUsers });
    setGroups(groupedUsers);
  }, [users, groupSize, emit]);

  return {
    groupSize,
    setGroupSize,
    groups,
    setGroups,
    handleGrouping,
  };
}
