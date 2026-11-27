// Starter ovice Custom Plugin (no build step).
// - useCustomObjectClient: participants, self, broadcast/emit, object data store
// - useCacheStore: a shared object kept in sync across everyone on this object
// Replace the demo UI below with your plugin.

const EVENT_PREFIX = '__PLUGIN_ID__:'; // namespace for custom broadcast events

function App() {
  const client = useCustomObjectClient();
  const { user, users, isHost, isStaticObject, isJoined, broadcast, onMessageEvent } =
    client;

  // Shared state: everyone on this object sees the same `cache`.
  // enableBackup: true also persists it to the object data store when the last user leaves
  // (development builds of ovice only: production ovice ignores the data store).
  const { cache, updateCache } = useCacheStore({ ...client, enableBackup: true });
  const count = Number(cache.count || 0);

  // Who may control the plugin: the owner of a dynamic object, or anyone linked to a static one.
  const canControl = isHost || (isStaticObject && isJoined);

  // Fire-and-forget event example.
  const [lastWave, setLastWave] = React.useState(null);
  // onMessageEvent returns an unsubscribe function: return it from the effect.
  React.useEffect(
    () =>
      onMessageEvent(message => {
        if (message.event === EVENT_PREFIX + 'wave') {
          setLastWave(message.message.name);
        }
      }),
    [onMessageEvent]
  );

  const wave = () => {
    setLastWave(user.name); // optimistic: don't rely on receiving your own broadcast
    broadcast(EVENT_PREFIX + 'wave', { name: user.name });
  };

  return (
    <div className="h-screen flex flex-col gap-2 p-2 text-sm select-none">
      <h2 className="flex-none text-lg font-bold">__PLUGIN_TITLE__</h2>

      <div className="flex items-center gap-2">
        <span className="font-bold text-2xl">{count}</span>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-40"
          disabled={!canControl}
          onClick={() => updateCache({ ...cache, count: count + 1 })}
        >
          +1
        </button>
        <button className="px-3 py-1 rounded border" onClick={wave}>
          👋 Wave
        </button>
      </div>
      {lastWave && <div className="text-gray-500">{lastWave} waved</div>}

      <div className="flex-1 overflow-auto">
        <div className="text-gray-500">Participants ({users.length})</div>
        <ul>
          {users.map(u => (
            <li key={u.id} className="flex items-center gap-1">
              <span>{u.name || 'unknown'}</span>
              {u.isSelf && <span className="text-xs text-blue-600">(you)</span>}
              {u.isHost && <span className="text-xs text-amber-600">host</span>}
              <span className="text-xs text-gray-400">{u.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
