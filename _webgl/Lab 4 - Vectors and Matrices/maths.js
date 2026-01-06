// Vector operations
function printVector(v) {
  return `[ ${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)} ]`;
}

function addVector(a, b) {
  return [ a[0] + b[0], a[1] + b[1], a[2] + b[2] ];
}

function subtractVector(a, b) {
  return [ a[0] - b[0], a[1] - b[1], a[2] - b[2] ];
}

function scaleVector(v, k) {
  return [ k * v[0], k * v[1], k * v[2] ];
}

function length(v) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

function normalize(v) {
  const len = length(v);
  if (len === 0) return [0, 0, 0];
  return scaleVector(v, 1 / len);
}

function dot(a, b) {
  return  a[0] * b[0] + a[1] * b[1] +a[2] * b[2];
}

function cross(a, b) {
  return [ 
    a[1] * b[2] - a[2] * b[1], 
    a[2] * b[0] - a[0] * b[2], 
    a[0] * b[1] - a[1] * b[0] 
  ];
}

// 4x4 Matrix class
class Mat4 {
  constructor() {
    this.elements = new Float32Array(16);
  }

  print() {
    const e = this.elements;
    let string = "";
    for (let i = 0; i < 4; i++) {
      const row = [
        e[i * 4 + 0].toFixed(2).padStart(8),
        e[i * 4 + 1].toFixed(2).padStart(8),
        e[i * 4 + 2].toFixed(2).padStart(8),
        e[i * 4 + 3].toFixed(2).padStart(8),
      ];
      string += "  [" + row.join(" ") + " ]\n";
    }
    return string;
  }
  
  set(...values) {
    if (values.length !== 16) {
      throw new Error("Mat4.set() requires 16 values");
    }
    for (let i = 0; i < 16; i++) {
      this.elements[i] = values[i];
    }
    return this;
  }

  transpose() {
    let e = this.elements;
    return new Mat4().set(
      e[0], e[4], e[8],  e[12],
      e[1], e[5], e[6],  e[13],
      e[2], e[6], e[10], e[14],
      e[3], e[7], e[11], e[15]
    );
  }

  multiply(matB) {
    const a = this.elements;
    const b = matB.elements;
    const c = new Mat4();
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        for (let i  = 0; i < 4; i++) {
          c.elements[col * 4 + row] += a[i * 4 + row] * b[col * 4 + i];
        }
      }
    }
    return c;
  }

  inverse() {
    let e = this.elements;
    const inv = new Float32Array([
      e[5] * e[10] * e[15] - e[5] * e[11] * e[14] - e[9] * e[6] * e[15] + e[9] * e[7] * e[14] + e[13] * e[6] * e[11] - e[13] * e[7] * e[10],
      -e[1] * e[10] * e[15] + e[1] * e[11] * e[14] + e[9] * e[2] * e[15] - e[9] * e[3] * e[14] - e[13] * e[2] * e[11] + e[13] * e[3] * e[10],      
      e[1] * e[6] * e[15] - e[1] * e[7] * e[14] - e[5] * e[2] * e[15] + e[5] * e[3] * e[14] + e[13] * e[2] * e[7]  - e[13] * e[3] * e[6],      
      -e[1] * e[6] * e[11] + e[1] * e[7] * e[10] + e[5] * e[2] * e[11] - e[5] * e[3] * e[10] - e[9] * e[2] * e[7]  + e[9] * e[3] * e[6],

      -e[4] * e[10] * e[15] + e[4] * e[11] * e[14] + e[8] * e[6] * e[15] - e[8] * e[7] * e[14] - e[12] * e[6] * e[11] + e[12] * e[7] * e[10],
      e[0] * e[10] * e[15] - e[0] * e[11] * e[14] - e[8] * e[2] * e[15] + e[8] * e[3] * e[14] + e[12] * e[2] * e[11] - e[12] * e[3] * e[10],
      -e[0] * e[6] * e[15] + e[0] * e[7] * e[14] + e[4] * e[2] * e[15] - e[4] * e[3] * e[14] - e[12] * e[2] * e[7]  + e[12] * e[3] * e[6],
      e[0] * e[6] * e[11] - e[0] * e[7] * e[10] - e[4] * e[2] * e[11] + e[4] * e[3] * e[10] + e[8] * e[2] * e[7]  - e[8] * e[3] * e[6],

      e[4] * e[9] * e[15] - e[4] * e[11] * e[13] - e[8] * e[5] * e[15] + e[8] * e[7] * e[13] + e[12] * e[5] * e[11] - e[12] * e[7] * e[9],
      -e[0] * e[9] * e[15] + e[0] * e[11] * e[13] + e[8] * e[1] * e[15] - e[8] * e[3] * e[13] - e[12] * e[1] * e[11] + e[12] * e[3] * e[9],
      e[0] * e[5] * e[15] - e[0] * e[7] * e[13] - e[4] * e[1] * e[15] + e[4] * e[3] * e[13] + e[12] * e[1] * e[7]  - e[12] * e[3] * e[5],
      -e[0] * e[5] * e[11] + e[0] * e[7] * e[9]  + e[4] * e[1] * e[11] - e[4] * e[3] * e[9]  - e[8] * e[1] * e[7]  + e[8] * e[3] * e[5],

      -e[4] * e[9] * e[14] + e[4] * e[10] * e[13] + e[8] * e[5] * e[14] - e[8] * e[6] * e[13] - e[12] * e[5] * e[10] + e[12] * e[6] * e[9],
      e[0] * e[9] * e[14] - e[0] * e[10] * e[13] - e[8] * e[1] * e[14] + e[8] * e[2] * e[13] + e[12] * e[1] * e[10] - e[12] * e[2] * e[9],
      -e[0] * e[5] * e[14] + e[0] * e[6] * e[13] + e[4] * e[1] * e[14] - e[4] * e[2] * e[13] - e[12] * e[1] * e[6]  + e[12] * e[2] * e[5],
      e[0] * e[5] * e[10] - e[0] * e[6] * e[9]  - e[4] * e[1] * e[10] + e[4] * e[2] * e[9]  + e[8] * e[1] * e[6]  - e[8] * e[2] * e[5]
    ]);

    let det = e[0] * inv[0] + e[1] * inv[4] + e[2] * inv[8] + e[3] * inv[12];
    if (det === 0) {
      console.error("Matrix is singular, no inverse exists");
      return null;
    }

    det = 1 / det;
    for (let i = 0; i < 16; i++) {
      inv[i] *= det;
    }
    return new Mat4().set(...inv);
  }
}