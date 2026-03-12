class Player {

  constructor(position = [0, 0, 0]) {

    // Transform
    this.position = position;
    this.rotation = new Quaternion();

    // Rotations
    this.rotationSmooth = 8;

    // Movement
    this.maxSpeed = 5;
    this.acceleration = 20;
    this.deceleration = 0.8;

    // Player model
    this.model;
    this.scale = [0.4, 0.4, 0.4];
    this.height = 0.25;

    // Physics
    this.velocity = [0, 0, 0];
    this.jumpHeight = 1;
    this.gravity = 9.81;
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
    
    // Calculate horizontal velocity
    if (hasInput) {

      this.velocity[0] += this.acceleration * dt * moveDir[0];
      this.velocity[2] += this.acceleration * dt * moveDir[2];

      // Limit horizontal speed to max speed
      const speed = length([this.velocity[0], 0, this.velocity[2]]);
      const speedRatio = this.maxSpeed / speed;
      if (speedRatio < 1) {
        this.velocity[0] *= speedRatio;
        this.velocity[2] *= speedRatio;
      }

    } else if (this.onGround) {

      this.velocity[0] *= this.deceleration;
      this.velocity[2] *= this.deceleration;
    }

    // Jump player
    if (input.isDown(" ") && this.onGround) {
      this.velocity[1] = Math.sqrt(2 * this.jumpHeight * this.gravity);
      this.onGround = false;
    }

    // Apply gravity
    this.velocity[1] -= this.gravity * dt;

    // Check for ground collision
    if (this.position[1] < this.height) {
      this.position[1] = this.height;
      this.velocity[1] = 0;
      this.onGround = true;
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

  aabbInBox(box) {
    return (
      this.position[0] > box.xMin && this.position[0] < box.xMax &&
      this.position[1] > box.yMin && this.position[1] < box.yMax &&
      this.position[2] > box.zMin && this.position[2] < box.zMax
    );
  }
}