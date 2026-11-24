import { useState } from 'react';
import { useOvice, useOviceMessage } from './ovice/useOvice';

const EVENT = {
  wave: '__PLUGIN_ID__:wave',
} as const;

export default function App() {
  const { self, participants, isLeader, isStaticObject, isJoined, client } = useOvice();
  const [lastWave, setLastWave] = useState<string>();

  useOviceMessage<{ name: string }>(client, EVENT.wave, m => setLastWave(m.name));

  const wave = () => {
    if (!self) return;
    setLastWave(self.name); // optimistic: you may not receive your own broadcast
    client.broadcast(EVENT.wave, { name: self.name });
  };

  // Who may control: dynamic-object owner, or anyone linked to a static object.
  const canControl = self?.isHost === true || (isStaticObject && isJoined);

  if (!self) return <div style={{ padding: 8 }}>Connecting to ovice…</div>;

  return (
    <div style={{ padding: 8, fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
      <h2 style={{ margin: '0 0 8px' }}>__PLUGIN_TITLE__</h2>
      <button onClick={wave}>👋 Wave</button>
      {lastWave && <p>{lastWave} waved</p>}
      <p style={{ color: '#666' }}>
        {isLeader ? 'You are the leader' : 'Follower'} · {canControl ? 'can control' : 'view only'}
      </p>
      <ul>
        {participants.map(p => (
          <li key={p.id}>
            {p.name} {p.isSelf && '(you)'} {p.isHost && '★'} <small>{p.status}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
