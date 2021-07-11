const { useCallback, useState } = React;

const net = new NeuralNet();

const App = () => {
  console.log('App');
  const [label, setLabel] = useState('');
  const [labelMap, setLabelMap] = useState({});
  const [epochs, setEpochs] = useState('1');
  const [training, setTraining] = useState(false);
  const [annotations, setAnnotations] = useState([]);
  const [inference, setInference] = useState({
    label: undefined,
    accuracy: 0,
    output: null,
  });

  net.onEnd = () => {
    setTraining(false);
  };

  return (
    <div className='app'>
      <div className='control'>
        <button
          onClick={() => {
            const _labelMap = {};
            const rows = mnist.split('\n');
            const x = rows.map((row) => {
              const tokens = row.split(',');
              const label = tokens[0];
              _labelMap[label] =
                _labelMap[label] !== undefined ? _labelMap[label] + 1 : 1;
              return {
                label,
                value: tokens.slice(1),
              };
            });
            console.log(x);
            console.log(_labelMap);
            setAnnotations(x);
            setLabelMap(_labelMap);
          }}
        >
          Load MNIST 100
        </button>
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
            setLabelMap({ ...labelMap, [label]: undefined });
          }}
        >
          Add label
        </button>
        <input
          className='epoch'
          onChange={({ target }) => {
            setEpochs(target.value);
          }}
          placeholder='epochs'
          value={epochs}
        />
        <button
          disabled={training}
          onClick={() => {
            setTraining(true);
            setTimeout(() => {
              const labels = Object.keys(labelMap);
              net.init(annotations, 100, labels, 0.1);
              net.train(epochs);
            });
          }}
        >
          Train {training ? '(training)' : null}
        </button>
      </div>
      <div className='testBox'>
        <Editor
          hideLabel={true}
          label={''}
          onDraw={(imageData) => {
            console.log(imageData);
            const result = net.query(imageData);
            setInference(result);
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
    </div>
  );
};
