const cc = classNames;

function MajorityApp() {
  const client = useCustomObjectClient();
  const { user, users, isJoined } = client;
  const { cache, updateCache } = useCacheStore(client);
  const {
    majorityData,
    choices,
    setChoices,
    resultsVisible,
    setResultsVisible,
    addMajority,
    startMajority,
    clearMajority,
    Toast,
  } = useMajorityDataStore({
    ...client,
    cache,
    updateCache,
  });

  const results = users.map(user => {
    return majorityData ? majorityData[user.id] || 'other' : 'other';
  });

  const createChart = () => {
    const labels = [...(choices || []), 'other'];
    const labelColors = {
      0: '#4e78a7',
      1: '#e15658',
      2: '#f48d2c',
      3: '#79b6b0',
      4: '#59a24e',
      5: '#787878',
    };
    const optionLabelColors = {
      '○': '#e15658',
      'X': '#4e78a7',
      'other': '#787878',
    };
    const data = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data:
              labels.map(label => {
                if (!choices) return 0;
                if (label === 'other')
                  return results.filter(v => !choices.includes(v)).length;
                return results.filter(v => v === label).length;
              }) || [],
            backgroundColor: labels.map((label, index) => {
              if (Object.keys(optionLabelColors).includes(label))
                return optionLabelColors[label];
              return labelColors[index];
            }),
          },
        ],
      },
      options: {
        legend: {
          position: 'right',
          labels: {
            fontStyle: 'bold',
          },
        },
        plugins: {
          datalabels: {
            display: true,
            color: 'white',
            font: {
              size: 18,
              style: 'bold',
            },
          },
          doughnutlabel: {
            labels: [
              { text: users.length, font: { size: 28 } },
              { text: 'total' },
            ],
          },
        },
      },
    };
    return (
      <img
        className="object-contain max-w-[340px] w-full bg-white"
        src={`https://quickchart.io/chart?format=webp&width=250&height=150&chart=${encodeURIComponent(
          JSON.stringify(data)
        )}`}
      ></img>
    );
  };

  return (
    <div className="max-h-screen h-screen max-w-md mx-auto grid grid-rows-[auto,1fr,auto] gap-2 select-none">
      <div>
        <h2 className="text-xl font-bold">Majority</h2>
        {isJoined && (
          <div className="flex relative gap-1">
            <select
              type="string"
              id="majority"
              className="rounded px-2"
              value={choices.join(',')}
              onChange={e => setChoices(e.target.value.split(','))}
            >
              <option value="A,B,C,D,E">A, B, C, D, E</option>
              <option value="1,2,3,4,5">1, 2, 3, 4, 5</option>
              <option value="○,X">○, X</option>
            </select>
            <button
              className="rounded border px-3 py-1 bg-blue-400 text-white hover:bg-blue-500 active:bg-blue-700"
              onClick={startMajority}
            >
              Start
            </button>
            <button
              className="rounded border px-3 py-1 bg-orange-400 text-white hover:bg-orange-500 active:bg-orange-700"
              onClick={clearMajority}
            >
              Clear
            </button>
          </div>
        )}
      </div>
      <div className="flex bg-white">
        <div className="h-full w-full flex justify-center">{createChart()}</div>
      </div>
      <div className="flex justify-center relative gap-2 min-h-[80px]">
        {cache && choices && (
          <div className="flex flex-col justify-center items-center">
            <div>↓ Vote ↓</div>
            <div className="flex gap-1">
              {choices.map(choice => {
                return (
                  <button
                    className={cc([
                      'rounded text-6xl border-2 bg-white px-1 min-w-[60px]',
                      {
                        'border-red-300 text-red-500 font-bold':
                          majorityData[user.id] === choice,
                        'text-black hover:bg-gray-200 action:bg-gray-300':
                          majorityData[user.id] !== choice,
                      },
                    ])}
                    onClick={() => {
                      addMajority(choice);
                    }}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
}

ReactDOM.render(<MajorityApp />, document.getElementById('root'));
