const { useEffect } = React;

function GroupingApp() {
  const {
    user,
    users,
    isHost,
    isStaticObject,
    isJoined,
    emit,
    onEvent,
    onMessageEvent,
  } = useCustomObjectClient();

  const { groupSize, setGroupSize, groups, setGroups, handleGrouping } = useGrouping(
    users,
    emit
  );

  const isGroupMaster = isHost || (isStaticObject && isJoined);

  useEffect(() => {
    onEvent(event => {
      console.log(event);
    });
    onMessageEvent(event => {
      if (event.event && event.event === 'grouping' && event.message) {
        setGroups(event.message.groups);
      }
    });
  }, [onEvent, onMessageEvent, setGroups]);

  return (
    <div className="flex flex-col gap-2 select-none">
      {isGroupMaster && (
        <div>
          <h2 className="text-xl font-bold">Separate Groups Count</h2>
          <div className="flex">
            <input
              type="number"
              id="groupSize"
              value={groupSize}
              onChange={e => setGroupSize(parseInt(e.target.value))}
              className="border border-gray-400 rounded px-2 py-1"
            />
            <button
              onClick={handleGrouping}
              className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded"
            >
              <span className="material-symbols-outlined">shuffle</span>
            </button>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold">Grouping Result</h2>
        <div className="select-text">
          {groups.map((group, index) => {
            const isMyGroup =
              user.id &&
              group.some(v => v.id.toString() === user.id.toString());
            return (
              <div key={index} className="mb-8">
                <h3
                  className={classNames([
                    'text-lg font-bold mb-2',
                    {
                      'text-blue-600': isMyGroup,
                      'text-black': !isMyGroup,
                    },
                  ])}
                >
                  [ Group {index + 1} ]
                </h3>
                <ul>
                  {group.map(v => {
                    const isMyself =
                      user.id && v.id.toString() === user.id.toString();
                    return (
                      <li
                        key={v.id}
                        className={classNames([
                          'text-lg mb-2',
                          {
                            'font-bold text-blue-600': isMyself,
                            'text-black': !isMyself,
                          },
                        ])}
                      >
                        {v.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<GroupingApp />, document.getElementById('root'));
