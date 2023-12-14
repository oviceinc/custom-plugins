const { useState, useEffect } = React;

// Custom hook to manage iframe communication
function useIframeCommunication(iframes) {
  useEffect(() => {
    const handleMessage = event => {
      // Handle incoming messages
      console.log('Received message:', event);
      // Add logic to handle different types of messages
    };

    // Attach event listener for incoming messages
    window.addEventListener('message', handleMessage);

    // Cleanup function to remove event listener when the component unmounts
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [iframes]);
}

function IframeComponent({
  id,
  src,
  userId,
  status,
  isHost,
  isVisitor,
  onLoad,
  onReady,
  onGetParticipants,
  onBroadcastMessage,
  onEmitMessage,
}) {
  const iframeRef = React.useRef(null);
  const hostType = isHost ? 'Host' : 'Guest';
  const visitorType = isVisitor ? 'Visitor' : 'Member';

  useEffect(() => {
    const iframe = iframeRef.current;
    function handleLoad() {
      onLoad(userId, iframe.contentWindow);
    }
    iframe.addEventListener('load', handleLoad);
    // Cleanup
    return () => {
      iframe.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source === iframeRef.current.contentWindow) {
        // Here you handle messages from this specific iframe
        const { type, payload } = event.data;
        switch (type) {
          case 'ovice_ready':
            onReady(userId, iframeRef.current.contentWindow);
            break;
          case 'ovice_get_participants':
            onGetParticipants(userId, iframeRef.current.contentWindow);
            break;
          case 'ovice_broadcast_message':
            onBroadcastMessage(userId, payload);
            break;
          case 'ovice_emit_message':
            onEmitMessage(userId, payload, payload.to);
            break;
          // ... other message types
        }
      }
    }
    window.addEventListener('message', handleMessage);
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onReady, onGetParticipants, onBroadcastMessage, onEmitMessage]);

  return (
    <div className="flex flex-col p-2">
      <div className="font-bold">
        {hostType} {visitorType} {status} User{userId}
      </div>
      <iframe
        ref={iframeRef}
        id={id}
        width="300px"
        height="350px"
        src={src}
        data-user-id={userId}
        data-status={status}
        data-host={isHost.toString()}
        className="border-2 m-2"
      ></iframe>
    </div>
  );
}

const objectTypes = ['static', 'dynamic'];

function TestApp() {
  const [url, setUrl] = useState(testUrls[0].url);
  const [objectType, setObjectType] = useState(objectTypes[0]);
  const iframes = mockUsers.map((item, index) => {
    return {
      ...item,
      id: `frame${item.userId}`,
      src: url,
      isHost: objectType === 'dynamic' ? index === 0 : false,
    };
  });
  const [postTargets, setPostTargets] = useState({});
  const users = iframes.map((item, index) => ({
    id: item.userId,
    status: item.status,
    isHost: item.isHost,
    isSelf: false,
    isVisitor: item.isVisitor,
    name: `user${item.userId}`,
    avatarUrl: '<https://example.com/avatar.jpg>',
    workspaceId: '1',
    objectId: 'object1',
    objectType: objectType,
  }));

  // Define handlers for different message types
  const handleLoad = (userId, iframeWindow) => {
    setPostTargets(prev => ({ ...prev, [userId]: iframeWindow }));
  };
  const handleReady = (userId, iframeWindow) => {
    iframeWindow.postMessage({ type: 'ovice_confirmation' }, '*');
  };
  const handleGetParticipants = (userId, iframeWindow) => {
    iframeWindow.postMessage(
      {
        type: 'ovice_participants',
        payload: users.map(user => ({ ...user, isSelf: userId === user.id })),
      },
      '*'
    );
  };
  const handleBroadcastMessage = (userId, payload) => {
    Object.keys(postTargets).forEach(key => {
      if (key === userId) return;
      postTargets[key].postMessage({
        type: 'ovice_message',
        payload: payload,
      });
    });
  };
  const handleEmitMessage = (userId, payload, to) => {
    Object.keys(postTargets).forEach(key => {
      if (key !== to) return;
      postTargets[key].postMessage({
        type: 'ovice_message',
        payload: payload,
      });
    });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (users.length === 0 || Object.keys(postTargets) === 0) return;
      Object.keys(postTargets).forEach(key => {
        users.forEach(user => {
          const iframe = postTargets[key];
          if (!iframe) return;
          iframe.postMessage({
            type: `ovice_participant_${user.status}`,
            payload: {
              ...user,
              isSelf: key.toString() === user.id,
            },
          });
        });
      });
    }, 1000);
    return () => {
      if (!timeout) return;
      clearTimeout(timeout);
    };
  }, [users, postTargets]);

  // Use the custom hook to manage iframe communication
  useIframeCommunication(iframes);

  return (
    <div className="min-h-screen flex flex-col bg-gray-300 bg-opacity-40 p-4">
      <div className="flex items-center gap-2">
        <div className="font-bold">Sample</div>
        <select
          className="p-2"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
          }}
        >
          {testUrls.map((item, index) => {
            return (
              <option key={index} value={item.url}>
                {item.name}
              </option>
            );
          })}
        </select>
        <div className="font-bold">Object Type</div>
        <select
          className="p-2"
          value={objectType}
          onChange={e => {
            setObjectType(e.target.value);
          }}
        >
          {objectTypes.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="flex flex-wrap">
        {iframes.map(iframe => (
          <IframeComponent
            key={iframe.id}
            {...iframe}
            onLoad={handleLoad}
            onReady={handleReady}
            onGetParticipants={handleGetParticipants}
            onBroadcastMessage={handleBroadcastMessage}
            onEmitMessage={handleEmitMessage}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<TestApp />, document.getElementById('root'));
