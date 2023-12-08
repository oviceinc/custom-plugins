const { Fragment, useEffect, useState } = React;

function InitView({ isInit, loadingNode, children }) {
  if (!isInit) return loadingNode;
  return <React.Fragment>{children}</React.Fragment>;
}

function StandbyView({ isStandby, children }) {
  if (!isStandby) return null;
  return <React.Fragment>{children}</React.Fragment>;
}

function PlayingView({ isPlaying, children }) {
  if (!isPlaying) return null;
  return <React.Fragment>{children}</React.Fragment>;
}

function ResultView({ hasResult, children }) {
  if (!hasResult) return null;
  return <React.Fragment>{children}</React.Fragment>;
}

function HostView({ isHost, children }) {
  if (!isHost) return null;
  return <React.Fragment>{children}</React.Fragment>;
}

function GuestView({ isHost, children }) {
  if (isHost) return null;
  return <React.Fragment>{children}</React.Fragment>;
}

function FastPressGameApp() {
  const {
    user,
    isGameMaster,
    isGameStarted,
    isStandby,
    fastest,
    winner,
    startGame,
    answer,
    reset,
  } = useGameLogic();

  return (
    <div className="container mx-auto text-center min-h-screen bg-white flex flex-col justify-center items-center gap-4 select-none">
      <InitView
        isInit={user.id}
        loadingNode={<div className="text-4xl">Connect to object</div>}
      >
        <StandbyView isStandby={!isGameStarted && !isStandby && !winner}>
          <HostView isHost={isGameMaster}>
            <div className="flex flex-col gap-4">
              <div className="text-xl">Fast Press Game</div>
              <button
                onClick={startGame}
                className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 p-6 rounded shadow text-4xl"
              >
                Start
              </button>
            </div>
          </HostView>
          <GuestView isHost={isGameMaster}>
            <div className="flex flex-col gap-4">
              <div className="text-xl">Fast Press Game</div>
              <div className="text-4xl">Game Standby</div>
            </div>
          </GuestView>
        </StandbyView>
        <PlayingView isPlaying={isGameStarted && !isStandby && !winner}>
          <button
            onClick={answer}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white p-6 rounded-full h-36 w-36 shadow text-4xl"
          >
            Press
          </button>
          <HostView isHost={isGameMaster}>
            <button onClick={reset} className="border-2 py-1 px-2 rounded">
              Reset
            </button>
          </HostView>
        </PlayingView>
        <ResultView hasResult={winner}>
          <div className="flex flex-col gap-2 p-4">
            <div className="text-2xl font-bold">Fastest</div>
            <div className="text-5xl font-bold whitespace-pre-wrap break-all select-text">
              {winner && fastest.sort((a, b) => a.time - b.time)[0].name}
            </div>
          </div>
          <HostView isHost={isGameMaster}>
            <button onClick={reset} className="border-2 py-1 px-2 rounded">
              Reset
            </button>
          </HostView>
        </ResultView>
      </InitView>
    </div>
  );
}

ReactDOM.render(<FastPressGameApp />, document.getElementById('root'));
