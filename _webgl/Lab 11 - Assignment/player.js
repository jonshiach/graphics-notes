class Player {

  constructor(position = [0, 0, 0]) {
    this.position = position;
    this.velocity = [0, 0, 0];
    this.rotation = new Quaternion();
    this.yaw = 0;

    // Movement
    this.moveSpeed = 5;
    this.acceleration = 10;
    this.turnSpeed = 2.5;

    // Vertical physics
    this.verticalVelocity = 0;
    this.gravity = -9.81;
    this.jumpForce = 5;
    this.isGrounded = false;

    // Collider
    this.height = 0.0;

    // Player model
    // this.model;
  }

  update(input, camera, dt) {

    // Rotate player
    if (input.isDown("a")) this.yaw += this.turnSpeed * dt;
    if (input.isDown("d")) this.yaw -= this.turnSpeed * dt;

    this.rotation = Quaternion.fromAxisAngle([0, 1, 0], this.yaw).normalize();
    const forward = this.rotation.rotateVector([0, 0, -1]);

    // Horizontal movement
    let moveInput = 0;
    if (input.isDown("w")) moveInput += 1;
    if (input.isDown("s")) moveInput -= 1;
    const targetVelocity = scaleVector(forward, moveInput * this.moveSpeed);

    // LERP towards target velocity
    const t = 1 - Math.exp(-this.acceleration * dt);
    this.velocity = lerpVector(this.velocity, targetVelocity, t);

    // Jump player
    if (input.isDown(" ") && this.isGrounded) {
      this.verticalVelocity = this.jumpForce;
      this.isGrounded = false;
    }
    
    // Apply gravity
    this.verticalVelocity += this.gravity * dt;

    // Calculate position
    this.position = addVector(this.position, scaleVector(this.velocity, dt));

    // Ground collision
    this.position[1] += this.velocity[1] * dt;

    // Simple ground plane at y = 0
    if (this.position[1] < this.height) {
      this.position[1] = this.height;
      this.velocity[1] = 0;
      this.isGrounded = true;
    }
  }

  getModelMatrix() {
    const translation = new Mat4().translate(this.position);
    const rotation = this.rotation.matrix();

    return new Mat4().multiply(translation).multiply(rotation);
  }

  draw(gl, program) {

    // const correction = Quaternion.fromAxisAngle([0, 1, 0], Math.PI);
    const translate = new Mat4().translate(
      addVector(this.position, [0, this.height, 0]));
    const rotate = this.rotation.matrix();
    const scale = new Mat4().scale([0.5, 0.5, 0.5]);

    const model = translate.multiply(rotate).multiply(scale);

    // Send model matrix to the shader
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    // Draw player model
    this.model.draw(program);
  }
}