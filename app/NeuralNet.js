class NeuralNet {
  init(annotations, hiddenLayers, labels, learningRate, epochs) {
    this.annotations = annotations;

    this.layer1 = annotations[0].value.length;
    this.layer2 = hiddenLayers;
    this.layer3 = labels.length;

    this.labels = labels;
    this.learningRate = learningRate;
    this.epochs = epochs;

    this.w12 = getNormallyDistributedMatrix(
      0,
      Math.pow(this.layer2, -0.5),
      this.layer2,
      this.layer1
    );
    this.w23 = getNormallyDistributedMatrix(
      0,
      Math.pow(this.layer3, -0.5),
      this.layer3,
      this.layer2
    );

    this.expectation = this.#getExpectation();

    console.log('init', this);
  }

  hasModel() {
    const { w12, w23 } = this;
    return !!(w12 && w12.length && w23 && w23.length);
  }

  loadModel() {}

  query(pixels) {
    const input = pixels.map((pixel) => {
      return (pixel / 255) * 0.99 + 0.01;
    });
    const [out1, out2, out3] = this.#forwardPropagate(input);
    const out3Array = out3.flat();
    const maxValue = Math.max(...out3Array);
    const indexOfMaxValue = out3Array.indexOf(maxValue);
    const label = this.labels[indexOfMaxValue];
    return {
      label,
      accuracy: maxValue,
      output: out3Array,
    };
  }

  runEpoch(epochs) {
    const epochCount = this.epochs - epochs + 1;
    console.log('------ Epoch ------ (', epochCount, ')');
    const { annotations, onEnd, onEpoch } = this;

    // annotations.forEach(({ label, value: pixels }) => {
    //   const input = pixels.map((pixel) => {
    //     return (pixel / 255) * 0.99 + 0.01;
    //   });
    //   this.#trainRecord(label, input);
    // });

    const promises = annotations.map((annotation) => {
      const { label, value: pixels } = annotation;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const input = pixels.map((pixel) => {
            return (pixel / 255) * 0.99 + 0.01;
          });
          this.#trainRecord(label, input);
          resolve();
        });
      });
    });

    Promise.all(promises).then(() => {
      if (typeof onEpoch === 'function') {
        onEpoch(epochCount);
      }
      const remainEpoch = epochs - 1;
      if (remainEpoch) {
        this.runEpoch(remainEpoch);
      } else {
        if (typeof onEnd === 'function') {
          onEnd();
        }
      }
    });

    // if (typeof onEpoch === 'function') {
    //   onEpoch(epochCount);
    // }

    // setTimeout(() => {
    //   const remainEpoch = epochs - 1;
    //   if (remainEpoch) {
    //     this.runEpoch(remainEpoch);
    //   } else {
    //     if (typeof onEnd === 'function') {
    //       onEnd();
    //     }
    //   }
    // });
  }

  saveModel() {}

  test() {}

  train() {
    this.runEpoch(this.epochs);
  }

  #backPropagate(label, out1, out2, out3) {
    const expectation = transpose(this.expectation[label]);
    // console.log('backPropagate expectation', expectation);
    // console.log('this.w23', size(this.w23));

    const err3 = subtractVectors(expectation, out3);

    // console.log('backPropagate out2', size(out2));
    // console.log('backPropagate out3', size(out3));

    // this.w23 += this.learningRate * np.dot(err3 * out3 * (1 - out3), out2.T);

    const delta23 = multiplyVector(
      matrixMultiply(
        multiplyVectors(
          multiplyVectors(err3, out3),
          subtractVectors(getVectors(1, out3.length), out3)
        ),
        transpose(out2)
      ),
      this.learningRate
    );

    this.w23 = addVectors(this.w23, delta23);

    // console.log('out2.T', size(transpose(out2)));
    // console.log('delta23', size(delta23));
    // console.log('err3', size(err3));
    // console.log('delta23', delta23);
    // console.log('this.w23', this.w23);

    const err2 = matrixMultiply(transpose(this.w23), err3);
    // console.log('err2', err2);

    const delta12 = multiplyVector(
      matrixMultiply(
        multiplyVectors(
          multiplyVectors(err2, out2),
          subtractVectors(getVectors(1, out2.length), out2)
        ),
        transpose(out1)
      ),
      this.learningRate
    );

    this.w12 = addVectors(this.w12, delta12);

    if (typeof this.onTrainRecord === 'function') {
      this.onTrainRecord(err3);
    }
  }

  #forwardPropagate(input) {
    const out1 = transpose(input); // [748 x 1]
    const sum2 = matrixMultiply(this.w12, out1);
    const out2 = transpose(sum2.map(sigmoid)); // [100 x 1]
    const sum3 = matrixMultiply(this.w23, out2);
    const out3 = transpose(sum3.map(sigmoid)); // [10, 1]
    return [out1, out2, out3];
  }

  #getExpectation() {
    const { labels, layer3 } = this;
    const expectations = {};
    labels.forEach((label, i) => {
      const expectation = [];
      for (let j = 0; j < layer3; j++) {
        expectation[j] = 0.01;
      }
      expectation[i] = 0.99;
      expectations[label] = expectation;
    });
    return expectations;
  }

  #trainRecord(label, input) {
    // console.log('trainRecord label', label);
    // console.log('trainRecord input', input);
    const [out1, out2, out3] = this.#forwardPropagate(input);
    this.#backPropagate(label, out1, out2, out3);
  }
}
