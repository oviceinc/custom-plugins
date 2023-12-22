const { useState, useCallback } = React;

function useGrouping(users, broadcast) {
  const [groupSize, setGroupSize] = useState(2);
  const [groups, setGroups] = useState([]);

  const handleGrouping = useCallback(() => {
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const groupedUsers = Array.from({ length: groupSize }, () => []);

    shuffledUsers.forEach((user, index) => {
      groupedUsers[index % groupSize].push(user);
    });

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
