class Player {

  constructor(position = [0, 0, 0]) {
    this.position = position
    this.rotation = new Quaternion();

    // Movement
    this.moveSpeed = 5;
    this.turnSpeed = 10;

    // Physics
    this.velocity = [0, 0, 0];
    this.gravity = -9.81;
    this.jumpStrength = 5;
    this.isGrounded = false;

    // Collider
    this.height = 1.8;
  }

  update(input, dt, camera) {
    this.handleMovement(input, dt, camera);
    this.applyGravity(dt);
    this.applyVerticalMovement(dt);
  }

  handleMovement(input, dt, camera) {

    // Get camera vectors
    let forward = camera.getFront();
    forward[1] = 0;
    forward = normalize(forward);
    const right = camera.getRight();
    
    // Move player
    let moveDir = [0, 0, 0];
    if (input.isDown("w")) moveDir = addVector(moveDir, forward);
    if (input.isDown("s")) moveDir = subtractVector(moveDir, forward);
    if (input.isDown("a")) moveDir = subtractVector(moveDir, right);
    if (input.isDown("d")) moveDir = addVector(moveDir, right);

    if (length(moveDir) > 0) {
      moveDir = normalize(moveDir);
      this.position = addVector(
        this.position, 
        scaleVector(moveDir, this.moveSpeed * dt)
      );
      
      this.rotateToward(moveDir, dt);
    }

    // Jump player
    if (input.isDown(" ") && this.isGrounded) {
      this.velocity[1] = this.jumpStrength;
      this.isGrounded = false;
    }
  }

  rotateToward(direction, dt) {
    const forward = [0, 0, -1];
    const targetRotation = Quaternion.fromLookRotation(direction);
    this.rotation = Quaternion.slerp(
      this.rotation,
      targetRotation,
      this.turnSpeed * dt
    ).normalize();
  }

  applyGravity(dt) {
    this.velocity[1] += this.gravity * dt;
  }

  applyVerticalMovement(dt) {
    this.position[1] += this.velocity[1] * dt;

    // Simple ground plane at y = 0
    if (this.position[1] < 0) {
      this.position[1] = 0;
      this.velocity[1] = 0;
      this.isGrounded = true;
    }
  }

  getModelMatrix() {
    const translation = new Mat4().translate(this.position);
    const rotation = this.rotation.matrix();

    return new Mat4().multiply(translation).multiply(rotation);
  }
}