const { useEffect, useState } = React;
const cc = classNames;

function GroupingApp() {
  const copyToClipboard = useCopyToClipboard();
  const { successToast, errorToast, Toast } = useToast();

  const {
    user,
    users,
    isHost,
    isStaticObject,
    isJoined,
    broadcast,
    onMessageEvent,
  } = useCustomObjectClient();

  const {
    groupSize,
    groupSizeList,
    isShuffling,
    setGroupSize,
    groups,
    handleGrouping,
  } = useGrouping(users, broadcast, onMessageEvent);

  const isGroupMaster = isHost || (isStaticObject && isJoined);

  const formatUserName = userName => {
    if (!userName) return 'unknown';
    return userName;
  };

  const handleGroupsCopyClick = groups => {
    if (!groups) return;
    const text = groups
      .map((group, index) => {
        const groupUsersList = group
          .map(member => {
            return `- ${member.name || 'unknown'}`;
          })
          .join('\n');
        return `[ Group ${index + 1} ]\n${groupUsersList}`;
      })
      .join('\n\n');
    if (copyToClipboard(text)) {
      successToast({ text: 'Success Copy!' });
    } else {
      errorToast({ text: 'Failed Copy!' });
    }
  };

  const handleGroupUsersCopyClick = (groupName, groupUsers) => {
    if (!groupName || !groupUsers) return;
    const groupUsersList = groupUsers
      .map(member => {
        return `- ${member.name || 'unknown'}`;
      })
      .join('\n');
    const text = `[ ${groupName} ]\n${groupUsersList}`;
    if (copyToClipboard(text)) {
      successToast({ text: 'Success Copy!' });
    } else {
      errorToast({ text: 'Failed Copy!' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col gap-2 select-none relative">
      <h1 className="text-xl font-bold">Grouping</h1>
      {isGroupMaster && (
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">User Count</h2>
          <div className="text-lg font-bold">
            {users.length}
          </div>
          <h2 className="text-lg font-bold">Separate Groups Count</h2>
          <div className="flex gap-2">
            <select
              className="w-20 text-lg font-bold rounded border"
              value={groupSize}
              onChange={e => setGroupSize(parseInt(e.target.value))}
            >
              {groupSizeList &&
                groupSizeList.map(size => {
                  return (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  );
                })}
            </select>
            <button
              onClick={handleGrouping}
              disabled={isShuffling}
              className={cc([
                'flex font-bold p-2 rounded',
                {
                  'bg-blue-500 hover:bg-blue-700 text-white': !isShuffling,
                  'bg-gray-400 text-white': isShuffling,
                },
              ])}
            >
              <span className="material-symbols-outlined">shuffle</span>
            </button>
          </div>
        </div>
      )}
      <div>
        <div className="flex gap-1">
          <div>
            <h2 className="text-lg font-bold">Result</h2>
          </div>

          <div className="text-sm">
            <button
              onClick={() => {
                handleGroupsCopyClick(groups);
              }}
            >
              <span className="material-symbols-outlined text-base">
                content_copy
              </span>
            </button>
          </div>
        </div>

        <div className="select-text grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4">
          {groups.map((group, index) => {
            if (!group.length) return null;
            const isMyGroup = user.id && group.some(v => v.id === user.id);
            return (
              <div
                key={index}
                className={cc([
                  'border m-1 p-2 shadow',
                  {
                    'bg-gray-50': !isShuffling,
                    'bg-gray-300': isShuffling,
                  },
                ])}
              >
                <div className="flex gap-1">
                  <div>
                    <h3
                      className={cc([
                        'text-lg font-bold mb-2',
                        {
                          'text-blue-600': isMyGroup && !isShuffling,
                          'text-black': !isMyGroup || isShuffling,
                        },
                      ])}
                    >
                      [ Group {index + 1} ]
                    </h3>
                  </div>

                  <div className="text-sm select-none">
                    <button
                      onClick={() => {
                        handleGroupUsersCopyClick(`Group ${index + 1}`, group);
                      }}
                    >
                      <span className="material-symbols-outlined text-base">
                        content_copy
                      </span>
                    </button>
                  </div>
                </div>
                <ul>
                  {group.map(v => {
                    const isMyself = user.id && v.id === user.id;
                    return (
                      <li
                        key={v.id}
                        className={cc([
                          'mb-0.5 truncate',
                          {
                            'font-bold text-blue-600': isMyself && !isShuffling,
                            'text-black': !isMyself || isShuffling,
                          },
                        ])}
                      >
                        {formatUserName(v.name)}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <Toast />
    </div>
  );
}

ReactDOM.render(<GroupingApp />, document.getElementById('root'));
