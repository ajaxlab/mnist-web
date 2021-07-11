function addVectors(m1, m2) {
  if (m1.length !== m2.length) {
    throw new Error('Dimensions does not match');
  }
  return m1.map((row1, i) => {
    return row1.map((v1, j) => {
      return v1 + m2[i][j];
    });
  });
}

// https://onlinestatbook.com/2/calculators/normal_dist.html

/**
 * https://mika-s.github.io/javascript/random/normal-distributed/2019/05/15/generating-normally-distributed-random-numbers-in-javascript.html
 */
function boxMullerTransform() {
  const u1 = Math.random();
  const u2 = Math.random();

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

  return { z0, z1 };
}

/**
 * https://mika-s.github.io/javascript/random/normal-distributed/2019/05/15/generating-normally-distributed-random-numbers-in-javascript.html
 
  const generatedNumbers = []

  const mean   = 30.0;
  const stddev = 2.0;

  for (let i = 0; i < 100000; i += 1) {
      generatedNumbers.push(getNormallyDistributedRandomNumber(mean, stddev))
  }

  const sum = generatedNumbers.reduce((acc, i) => acc += i);
  const count = generatedNumbers.length;
  const calculatedMean = sum/count;

  console.log(calculatedMean);
 */
function getNormallyDistributedRandomNumber(mean, stddev) {
  const { z0, _ } = boxMullerTransform();

  return z0 * stddev + mean;
}

function getNormallyDistributedArray(mean, stddev, length) {
  const generatedNumbers = [];
  for (let i = 0; i < length; i += 1) {
    generatedNumbers.push(getNormallyDistributedRandomNumber(mean, stddev));
  }
  return generatedNumbers;
}

function getNormallyDistributedMatrix(mean, stddev, rows, cols) {
  const array = getNormallyDistributedArray(mean, stddev, rows * cols);
  return reshapeArray(array, rows, cols);
}

function getRandomMatrix(rows, cols) {
  const length = rows * cols;
  const result = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i < length) {
        row.push(Math.random() - 0.5);
      }
    }
    result.push(row);
  }
  return result;
}

/**
 * @param {*} m1 M x N
 * @param {*} m2 N x O
 * @retrun M x O
 */
function matrixMultiply(m1, m2) {
  const result = [];
  const M = m1.length;
  const N = m1[0].length;
  const O = m2[0].length;
  if (N !== m2.length) {
    throw new Error('Number of rows and cols does not match');
  }
  for (let i = 0; i < M; i++) {
    const row = [];
    for (let k = 0; k < O; k++) {
      let sum = 0;
      for (let j = 0; j < N; j++) {
        sum += m1[i][j] * m2[j][k];
      }
      row.push(sum);
    }
    result.push(row);
  }
  return result;
}

function multiplyVector(m1, value) {
  return m1.map((row1, i) => {
    return row1.map((v1, j) => {
      return v1 * value;
    });
  });
}

function multiplyVectors(m1, m2) {
  if (m1.length !== m2.length) {
    throw new Error('Dimensions does not match');
  }
  return m1.map((row1, i) => {
    return row1.map((v1, j) => {
      return v1 * m2[i][j];
    });
  });
}

function reshapeArray(array, rows, cols) {
  const { length } = array;
  const result = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      if (i < length) {
        row.push(array[i]);
      }
    }
    result.push(row);
  }
  return result;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function size(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  return [rows, cols];
}

function subtractVectors(m1, m2) {
  if (m1.length !== m2.length) {
    throw new Error('Dimensions does not match');
  }
  return m1.map((row1, i) => {
    return row1.map((v1, j) => {
      return v1 - m2[i][j];
    });
  });
}

function transpose(matrix) {
  if (Array.isArray(matrix[0])) {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  }
  return reshapeArray(matrix, matrix.length, 1);
}

function getVectors(value, length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array[i] = value;
  }
  return transpose(array);
}
