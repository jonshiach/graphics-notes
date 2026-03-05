class Light {

  constructor(type) {
    this.type = type; // 0 = point, 1 = spot, 2 = directional
    this.position = [0, 0, 0];
    this.colour = [1, 1, 1];
    this.direction = [0, -1, 0];
    this.cutoff = Math.cos(50 * Math.PI / 180);
    this.outerCutoff = Math.cos(52 * Math.PI / 180);

    // Attenuation coefficients
    this.constant = 1.0;
    this.linear = 0.1;
    this.quadratic = 0.05;

    // Light model
    this.model;
  }

  toShader(gl, program, index) {
    const prefix = `uLights[${index}]`;

    // Light vectors
    gl.uniform1i(gl.getUniformLocation(program, `${prefix}.type`), this.type);
    gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.direction`), this.direction);
    gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.position`), this.position);
    gl.uniform3fv(gl.getUniformLocation(program, `${prefix}.colour`), this.colour);  

    // Attenuation coefficients
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.constant`), this.constant);
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.linear`), this.linear);
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.quadratic`), this.quadratic);

    // Spotlight parameters
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.cutoff`), this.cutoff);
    gl.uniform1f(gl.getUniformLocation(program, `${prefix}.outerCutoff`), this.outerCutoff);
  }
}

class LightSources {

  constructor(maxLights = 16) {
    this.lights = [];
    this.maxLights = maxLights;
    this.numLights = 0;
  }

  addLight(light) {

    if (this.lights.length < this.maxLights) {
      this.lights.push(light);
    } else {
      console.warn("Maximum number of lights reached.");
    }
    this.numLights = this.lights.length;
  }

  toShader(gl, program) {
    gl.uniform1i(gl.getUniformLocation(program, "uNumLights"), this.lights.length);

    for (let i = 0; i < this.lights.length; i++) {
      this.lights[i].toShader(gl, program, i);
    }
  }

  draw(gl, program) {

    for (let i = 0; i < this.numLights; i++) {

      const light = this.lights[i];

      // Don't draw directional light source
      if (light.type == 2) continue;

      // Calculate model matrix for light source
      const model = new Mat4()
        .translate(light.position)
        .scale([0.1, 0.1, 0.1]);

      // Send model matrix to the shader
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

      // Draw light model
      light.model.draw(program);
    }
  }
}