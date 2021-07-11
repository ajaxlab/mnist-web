const { useCallback, useState } = React;

const net = new NeuralNet();

const CustomApp = () => {
  const [label, setLabel] = useState('');
  const [labelMap, setLabelMap] = useState({});
  const [epochs, setEpochs] = useState('10');
  const [errorOut, setErrorOut] = useState([]);
  const [finishedEpoch, setFinishedEpoch] = useState(0);
  const [training, setTraining] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [mnistData, setMnistData] = useState([]);
  const [inference, setInference] = useState({
    label: undefined,
    accuracy: 0,
    output: null,
  });

  net.onEpoch = (count) => {
    setFinishedEpoch(count);
  };

  net.onTrainRecord = (err) => {
    setErrorOut(err.flatMap((v) => v));
  };

  net.onEnd = () => {
    setTraining(false);
  };

  const trainButtonTitle = (
    <React.Fragment>{training ? 'Training ' : 'Train '}</React.Fragment>
  );

  const runningEpoch = finishedEpoch ? `${finishedEpoch}/${epochs}` : null;
  const hasAnnotations = !!annotations.length;
  const hasMnistData = !!mnistData.length;

  return (
    <div className='app'>
      <h1>Custom data annotations</h1>
      <div className='custom'>
        <h2>Add custom labels and train model</h2>
        <div className='control'>
          Label
          <input
            className='label'
            onChange={({ target }) => {
              setLabel(target.value);
            }}
            placeholder='label'
            value={label}
          />
          <button
            onClick={() => {
              setAnnotations([...annotations, { label, value: undefined }]);
              const currentLabelCount = labelMap[label];
              setLabelMap({
                ...labelMap,
                [label]: currentLabelCount ? currentLabelCount + 1 : 1,
              });
            }}
          >
            Add label
          </button>
          Epoch
          <input
            className='epoch'
            onChange={({ target }) => {
              setEpochs(target.value);
            }}
            placeholder='epochs'
            type='number'
            value={epochs}
          />
          <button
            disabled={training || !annotations.length}
            onClick={() => {
              setTraining(true);
              setTimeout(() => {
                const labels = Object.keys(labelMap);
                net.init(annotations, 100, labels, 0.1, epochs);
                net.train();
              });
            }}
          >
            {trainButtonTitle}
          </button>
          <span>{hasAnnotations && runningEpoch}</span>
        </div>
        <div>
          {Object.keys(labelMap).length ? (
            <React.Fragment>
              <h3>Sample counts</h3>
              <table>
                <tbody>
                  <tr>
                    {Object.keys(labelMap).map((label) => {
                      return (
                        <React.Fragment key={label}>
                          <th>{label}</th>
                          <td>{labelMap[label]}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          ) : null}
        </div>
        <div>
          {Object.keys(errorOut).length ? (
            <React.Fragment>
              <h3>Loss</h3>
              <table>
                <tbody>
                  <tr>
                    {errorOut.map((error, i) => {
                      return (
                        <React.Fragment key={i}>
                          <th>{Object.keys(labelMap)[i]}</th>
                          <td>{Math.round(error * 1000) / 1000}</td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          ) : null}
        </div>
        {annotations.length ? (
          <React.Fragment>
            <h3>Annotations</h3>
            <div className='editors'>
              {annotations.map(({ label, value }, i) => {
                return (
                  <Editor
                    key={i}
                    label={label}
                    value={value}
                    onDraw={(imageData) => {
                      annotations[i].value = imageData;
                    }}
                  />
                );
              })}
            </div>
          </React.Fragment>
        ) : null}
      </div>
      <div className='test'>
        <h2>Test model</h2>
        <div className='testBox'>
          <Editor
            hideLabel={true}
            label={''}
            onDraw={(imageData) => {
              console.log(imageData);
              console.log('hasModel', net.hasModel());
              if (net.hasModel()) {
                const result = net.query(imageData);
                setInference(result);
              } else {
                window.alert('Add your custom annotations first.');
              }
            }}
          />
          <div className='inferenceBox'>
            <div className='inference'>{inference.label}</div>
            <div className='accuracy'>
              Accuracy: {Math.round(inference.accuracy * 10000) / 10000}
            </div>
            <div className='output'>
              {JSON.stringify(
                inference.output &&
                  inference.output.map((v) => Math.round(v * 1000) / 1000),
                null,
                2
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
