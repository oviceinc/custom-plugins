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
  host,
  onLoad,
  onReady,
  onGetParticipants,
  onEmitToOthers,
  onEmitTo,
}) {
  const iframeRef = React.useRef(null);

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
          case 'ovice_emit_to_others':
            onEmitToOthers(userId, payload);
            break;
          case 'ovice_emit_to':
            onEmitTo(userId, payload, payload.to);
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
  }, [onReady, onGetParticipants, onEmitToOthers, onEmitTo]);

  return (
    <div className="flex flex-col p-2">
      <div className="font-bold">
        {host ? 'Host' : 'Guest'} {status} User{userId}
      </div>
      <iframe
        ref={iframeRef}
        id={id}
        width="300px"
        height="350px"
        src={src}
        data-user-id={userId}
        data-status={status}
        data-host={host.toString()}
        className="border-2 m-2"
      ></iframe>
    </div>
  );
}

const urls = [
  {
    name: 'Fast Press Game',
    url: '../public/fast-press-game/',
  },
  {
    name: 'Grouping',
    url: '../public/grouping/',
  },
];

function TestApp() {
  const [url, setUrl] = useState(urls[0].url);
  const iframes = [
    {
      id: 'frame1',
      src: url,
      userId: '1',
      status: 'joined',
      host: true,
    },
    {
      id: 'frame2',
      src: url,
      userId: '2',
      status: 'joined',
      host: false,
    },
    {
      id: 'frame3',
      src: url,
      userId: '3',
      status: 'subscribed',
      host: false,
    },
  ];
  const [postTargets, setPostTargets] = useState({});
  const users = iframes.map(item => ({
    id: item.userId,
    status: item.status,
    isHost: item.host,
    name: `user${item.userId}`,
    avatarUrl: '<https://example.com/avatar.jpg>',
    workspaceId: '1',
    objectId: 'object1',
    objectType: 'static',
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
        payload: users,
      },
      '*'
    );
  };
  const handleEmitToOthers = (userId, payload) => {
    Object.keys(postTargets).forEach(key => {
      if (key === userId) return;
      postTargets[key].postMessage({
        type: 'ovice_event_message',
        payload: payload,
      });
    });
  };
  const handleEmitTo = (userId, payload, to) => {
    Object.keys(postTargets).forEach(key => {
      if (key !== to) return;
      postTargets[key].postMessage({
        type: 'ovice_event_message',
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
            type: `ovice_${key === user.id ? '' : 'other_'}participant_${
              user.status
            }`,
            payload: user,
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
    <div className="h-screen flex flex-col bg-gray-300 bg-opacity-40 p-4">
      <div className="flex items-center gap-2">
        <div className="font-bold">Sample</div>
        <select
          className="p-2"
          value={url}
          onChange={e => {
            setUrl(e.target.value);
          }}
        >
          {urls.map((item, index) => {
            return (
              <option key={index} value={item.url}>
                {item.name}
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
            onEmitToOthers={handleEmitToOthers}
            onEmitTo={handleEmitTo}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<TestApp />, document.getElementById('root'));
