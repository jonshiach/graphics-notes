class Model {

  constructor(gl) {
    this.gl = gl;

    // Vertex data
    this.vertices = [];
    this.indices = [];
    this.texCoords = [];
    this.normals = [];
    this.tangents = [];

    // Buffers
    this.vertexBuffer = null;
    this.texCoordBuffer = null;
    this.normalBuffer = null;
    this.tangentBuffer = null;
    this.indexBuffer = null;

    // Textures
    this.diffuseTexture = null;
    this.normalTexture = null;
    this.specularTexture = null;

    // Lighting properties
    this.ka = 0.2;
    this.kd = 0.7;
    this.ks = 1.0;
    this.shininess = 32;

    // Model colour
    this.colour = [1, 1, 1];
  }

  // Async factory method
  static async create(gl, objPath) {
    const model = new Model(gl);
    await model.loadOBJFromPath(objPath);
    return model;
  }

  async loadOBJFromPath(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load OBJ: ${path}`);
    const objText = await response.text();
    await this.loadFromOBJ(objText);
  }

  async loadFromOBJ(objText) {
    const tempVertices = [];
    const tempNormals = [];
    const tempTexCoords = [];
    const vertexMap = new Map(); // For indexing unique vertices

    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    let indexCounter = 0;

    const lines = objText.split("\n");
    for (let line of lines) {
      line = line.trim();
      if (!line || line.startsWith("#")) continue;

      const parts = line.split(/\s+/);
      switch (parts[0]) {
        case "v":
          tempVertices.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
          break;
        case "vn":
          tempNormals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
          break;
        case "vt":
          tempTexCoords.push([parseFloat(parts[1]), parseFloat(parts[2])]);
          break;
        case "f":
          for (let i = 1; i <= 3; i++) {
            const vals = parts[i].split("/");
            const key = parts[i]; // unique key for combination
            if (!vertexMap.has(key)) {
              const v = tempVertices[parseInt(vals[0]) - 1];
              vertices.push(...v);

              if (vals[1]) {
                const vt = tempTexCoords[parseInt(vals[1]) - 1];
                texCoords.push(...vt);
              } else texCoords.push(0, 0);

              if (vals[2]) {
                const vn = tempNormals[parseInt(vals[2]) - 1];
                normals.push(...vn);
              } else normals.push(0, 0, 0);

              vertexMap.set(key, indexCounter++);
            }
            indices.push(vertexMap.get(key));
          }
          break;
        }
    }

    this.vertices = vertices;
    this.normals = normals;
    this.texCoords = texCoords;
    this.indices = indices;

    // Compute tangents
    this.tangents = this.computeTangents(vertices, texCoords, indices)

    // Create buffers
    const gl = this.gl;
    this.vertexBuffer = this.createBuffer(this.vertices, gl.ARRAY_BUFFER);
    this.normalBuffer = this.createBuffer(this.normals, gl.ARRAY_BUFFER);
    this.texCoordBuffer = this.createBuffer(this.texCoords, gl.ARRAY_BUFFER);
    this.tangentBuffer = this.createBuffer(this.tangents, gl.ARRAY_BUFFER);
    this.indexBuffer = this.createBuffer(this.indices, gl.ELEMENT_ARRAY_BUFFER, Uint16Array);
  }

  computeTangents(vertices, texCoords, indices) {

    const vertexCount = vertices.length / 3;

    // Allocate 3 floats per vertex
    const tangents = new Array(vertexCount * 3).fill(0);

    for (let i = 0; i < indices.length; i += 3) {

      const i0 = indices[i];
      const i1 = indices[i + 1];
      const i2 = indices[i + 2];

      const v0 = [
        vertices[i0 * 3],
        vertices[i0 * 3 + 1],
        vertices[i0 * 3 + 2]
      ];

      const v1 = [
        vertices[i1 * 3],
        vertices[i1 * 3 + 1],
        vertices[i1 * 3 + 2]
      ];

      const v2 = [
        vertices[i2 * 3],
        vertices[i2 * 3 + 1],
        vertices[i2 * 3 + 2]
      ];

      const uv0 = [
        texCoords[i0 * 2],
        texCoords[i0 * 2 + 1]
      ];

      const uv1 = [
        texCoords[i1 * 2],
        texCoords[i1 * 2 + 1]
      ];

      const uv2 = [
        texCoords[i2 * 2],
        texCoords[i2 * 2 + 1]
      ];

      const edge1 = v1.map((v, idx) => v - v0[idx]);
      const edge2 = v2.map((v, idx) => v - v0[idx]);

      const deltaUV1 = [uv1[0] - uv0[0], uv1[1] - uv0[1]];
      const deltaUV2 = [uv2[0] - uv0[0], uv2[1] - uv0[1]];

      const denom = deltaUV1[0] * deltaUV2[1] - deltaUV2[0] * deltaUV1[1];
      const f = denom !== 0 ? 1.0 / denom : 0.0;

      const tangent = [
        f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
        f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
        f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
      ];

      // Accumulate per vertex
      for (let idx of [i0, i1, i2]) {
        tangents[idx * 3]     += tangent[0];
        tangents[idx * 3 + 1] += tangent[1];
        tangents[idx * 3 + 2] += tangent[2];
      }
    }

    // Normalize per vertex
    for (let i = 0; i < vertexCount; i++) {
        const x = tangents[i * 3];
        const y = tangents[i * 3 + 1];
        const z = tangents[i * 3 + 2];

        const len = Math.hypot(x, y, z) || 1.0;

        tangents[i * 3]     /= len;
        tangents[i * 3 + 1] /= len;
        tangents[i * 3 + 2] /= len;
    }

    return tangents;
  }

  createBuffer(data, type = this.gl.ARRAY_BUFFER, arrayType = Float32Array) {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, new arrayType(data), gl.STATIC_DRAW);
    gl.bindBuffer(type, null);
    return buffer;
  }

  loadTexture(url, type = "diffuse") {
    const gl = this.gl;
    const texture = gl.createTexture();
    const image = new Image();
    image.src = url;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);  

      // Auto-generate mipmaps (requires power-of-2 image)
      if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        // Non-POT textures must be clamped & non-mipmapped
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    }

    if (type === "diffuse") {
      this.diffuseTexture = texture;
      this.hasDiffuseMap = true;
    } else if (type === "normal") {
      this.normalTexture = texture;
    } else if (type === "specular") {
      this.specularTexture = texture;
    }
  }

  isPowerOf2(x) {
    return (x & (x - 1)) === 0;
  }

  setTextureRepeat(repeatU = 1, repeatV = 1) {
    if (!this.texCoords || this.texCoords.length === 0) return;

    // Scale original coordinates
    const scaledTexCoords = this.texCoords.map((val, idx) => {
      if (idx % 2 === 0) {
        return val * repeatU;
      } else {
        return val * repeatV;
      }
    });

    // Update buffer on GPU
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scaledTexCoords), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  draw(program) {
    const gl = this.gl;
    
    // Positions
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    // Texture coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    const texCoordsLocation = gl.getAttribLocation(program, "aTexCoord");
    gl.enableVertexAttribArray(texCoordsLocation);
    gl.vertexAttribPointer(texCoordsLocation, 2, gl.FLOAT, false, 0, 0);

    // Normals
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    const normalLocation = gl.getAttribLocation(program, "aNormal");
    gl.enableVertexAttribArray(normalLocation);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

    // Tangents
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tangentBuffer);
    const tangentLocation = gl.getAttribLocation(program, "aTangent");
    gl.enableVertexAttribArray(tangentLocation);
    gl.vertexAttribPointer(tangentLocation, 3, gl.FLOAT, false, 0, 0);

    // Colour
    gl.uniform3fv(gl.getUniformLocation(program, "uColour"), this.colour);

    // Diffuse texture
    gl.uniform1i(gl.getUniformLocation(program, "uHasDiffuseMap"), !!this.diffuseTexture);
    gl.uniform3fv(gl.getUniformLocation(program, "uColour"), this.colour);

    // if (this.diffuseTexture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.diffuseTexture || null);
      gl.uniform1i(gl.getUniformLocation(program, "uDiffuseMap"), 0);
    // }

    // Normal texture
    // if (this.normalTexture) {
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.normalTexture || null);
      gl.uniform1i(gl.getUniformLocation(program, "uNormalMap"), 1);
    // }

    // Specular texture
    // if (this.specularTexture) {
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.specularTexture || null);
      gl.uniform1i(gl.getUniformLocation(program, "uSpecularMap"), 2);
    // }

    // Send lighting properties to the shader
    gl.uniform1f(gl.getUniformLocation(program, "uKa"), this.ka);
    gl.uniform1f(gl.getUniformLocation(program, "uKd"), this.kd);
    gl.uniform1f(gl.getUniformLocation(program, "uKs"), this.ks);
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), this.shininess);

    // Draw elements
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    // Disable attributes
    gl.disableVertexAttribArray(positionLocation);
    gl.disableVertexAttribArray(texCoordsLocation);
    gl.disableVertexAttribArray(normalLocation);
    gl.disableVertexAttribArray(tangentLocation);
  }
}