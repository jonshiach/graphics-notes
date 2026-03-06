class Player {

  constructor(position = [0, 0, 0]) {

    // Transform
    this.position = position;
    this.rotation = new Quaternion();

    // Rotations
    this.rotationSmooth = 8;

    // Movement
    this.velocity = [0, 0, 0];
    this.maxSpeed = 5;
    this.acceleration = 10;
    this.deceleration = 10;

    // Player model
    this.model;
    this.scale = [0.4, 0.4, 0.4];
    this.height = 0.25;

    // Physics
    this.jumpForce = 5;
    this.gravity = -9.81;
    this.onGround = true;
  }

  update(input, camera, dt) {

    // Camera vectors
    let forward = camera.rotation.rotateVector([0, 0, -1]);
    let right   = camera.rotation.rotateVector([1, 0, 0]);
    forward[1] = 0;
    right[1] = 0;
    forward = normalize(forward);
    right = normalize(right);

    // Build movement vector
    let moveDir = [0, 0, 0];
    if (input.isDown("w")) moveDir = addVector(moveDir, forward);
    if (input.isDown("s")) moveDir = subtractVector(moveDir, forward);
    if (input.isDown("a")) moveDir = subtractVector(moveDir, right);
    if (input.isDown("d")) moveDir = addVector(moveDir, right);

    const hasInput = length(moveDir) > 0;
    if (hasInput) normalize(moveDir);
    
    // Calculate velocity using dampened acceleration/deceleration
    const targetVelocity = scaleVector(moveDir, this.maxSpeed);

    if (hasInput) {

      // Lerp velocity to target velocity
      this.velocity = lerpVector(
        this.velocity,
        targetVelocity,
        1 - Math.exp(-this.acceleration * dt)
      );

    } else {

      const damping = Math.exp(-this.deceleration * dt);
      this.velocity = scaleVector(this.velocity, damping);
    }

    // Update position
    this.position = addVector(this.position, scaleVector(this.velocity, dt));

    // Yaw rotation towards camera direction
    if (hasInput) {
      const yaw = Math.atan2(moveDir[0], -moveDir[2]);
      const targetRotation = Quaternion.fromAxisAngle([0, 1, 0], -yaw);

      this.rotation = Quaternion.slerp(
        this.rotation, 
        targetRotation,
        1 - Math.exp(-this.rotationSmooth * dt)
      ).normalize();
    }

    this.jump(input, dt);
  }

  jump(input, dt) {

    if (input.isDown(" ") && this.onGround) {
      this.onGround = false;
      this.velocity[1] = this.jumpForce;
    }

    this.velocity[1] += this.gravity * dt;
    this.position[1] += this.velocity[1] * dt;

    if (this.position[1] <= this.height) {
      this.position[1] = 0;
      this.velocity[1] = 0;
      this.onGround = true;
    }

  }

  draw(gl, program) {

    const translation = new Mat4().translate(addVector(this.position, [0, 0, 0]));
    const rotation = this.rotation.matrix();
    const scale = new Mat4().scale(this.scale);
    const model =  new Mat4()
      .multiply(translation)
      .multiply(rotation)
      .multiply(scale);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModel"), false, model.m);

    this.model.draw(program);
  }
}