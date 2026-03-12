class Camera {

  constructor() {

    // Camera vectors
    this.eye     = [0, 0, 0];
    this.worldUp = [0, 1, 0];
    this.front   = [0, 0, -1];
    this.right   = [1, 0, 0];
    this.up      = [0, 1, 0];

    // Projection settings
    this.fov    = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near   = 0.1;
    this.far    = 1000;

    // Movement settings
    this.maxSpeed = 5;
    this.turnSpeed = 0.002;  
    this.yaw = 0;
    this.pitch = 0;

    // Physics
    this.velocity = [0, 0, 0];
    this.acceleration = 10;
    this.deceleration = 0.9;
    this.onGround = true;
    this.jumpHeight = 1;
    this.gravity = 9.81;
  }

  update(input, dt) {
    const { dx, dy } = input.consumeMouseDelta();
    this.yaw += dx * this.turnSpeed;
    this.pitch -= dy * this.turnSpeed;

    // Limit the pitch angle tod -89 degrees < pitch < 89 degrees
    const pitchLimit = 89 * Math.PI / 180;
    this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));

    const cy = Math.cos(this.yaw);
    const cp = Math.cos(this.pitch);
    const sy = Math.sin(this.yaw);
    const sp = Math.sin(this.pitch);

    this.front = [0, 0, -1];
    this.front = normalize([cp * sy, sp, -cp * cy]);
    this.right = normalize(cross(this.front, this.worldUp));
    this.up    = normalize(cross(this.right, this.front));

    // Movement direction
    let moveDir = [0, 0, 0];
    if (input.isDown("w")) moveDir = addVector(moveDir, this.front);
    if (input.isDown("s")) moveDir = subtractVector(moveDir, this.front);
    if (input.isDown("a")) moveDir = subtractVector(moveDir, this.right);
    if (input.isDown("d")) moveDir = addVector(moveDir, this.right);
    moveDir[1] = 0;
    moveDir = normalize(moveDir);

    // Horizontal acceleration/deceleration
    if (length(moveDir) > 0) {
      if (this.onGround) {

        // Accelerate horizontal velocity
        this.velocity[0] += this.acceleration * dt * moveDir[0];
        this.velocity[2] += this.acceleration * dt * moveDir[2];

        // Limit horizontal velocity to max speed
        const speed = length([this.velocity[0], 0, this.velocity[2]])
        if (speed > this.maxSpeed) {
          this.velocity[0] = this.velocity[0] / speed * this.maxSpeed;
          this.velocity[2] = this.velocity[2] / speed * this.maxSpeed;
        }
      }
    } else {

      if (this.onGround) {
        this.velocity[0] *= this.deceleration;
        this.velocity[2] *= this.deceleration;
      }
    }

    // Start jump
    if (input.isDown(" ") && this.onGround) {
      this.onGround = false;
      this.velocity[1] = Math.sqrt(2 * this.jumpHeight * this.gravity);
    }

    // Apply gravity
    if (!this.onGround) this.velocity[1] -= this.gravity * dt;

    // Check for ground collision
    if (this.eye[1] < 0) {
      this.eye[1] = 0;
      this.velocity[1] = 0;
      this.onGround = true;
    }

    // Move camera
    this.eye = addVector(this.eye, scaleVector(this.velocity, dt));
  }

  getViewMatrix() {
    return new Mat4().set([
        this.right[0], this.up[0], -this.front[0], 0,
        this.right[1], this.up[1], -this.front[1], 0,
        this.right[2], this.up[2], -this.front[2], 0,
        -dot(this.eye, this.right),
        -dot(this.eye, this.up),
            dot(this.eye, this.front),
        1
    ]);
  }

  getOrthographicMatrix(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const fn = 1 / (far - near);

    return new Mat4().set([
        2 * rl, 0, 0, 0,
        0, 2 * tb, 0, 0,
        0, 0, -2 * fn, 0,
        -(right + left) * rl,
        -(top + bottom) * tb,
        -(far + near) * fn,
        1
    ]);
  }

  getPerspectiveMatrix() {
    const t  = this.near * Math.tan(this.fov / 2);
    const r  = this.aspect * t;
    const fn = 1 / (this.far - this.near);

    return new Mat4().set([
      this.near / r, 0, 0, 0,
      0, this.near / t, 0, 0,
      0, 0, -(this.far + this.near) * fn, -1,
      0, 0, -2 * this.far * this.near * fn, 0
    ]);
  }

  collision(object) { 
    const radius = 1;
    const toObject = subtractVector(object, this.eye);
    const delta = length(toObject) - radius;
    if (delta < 0) this.eye = addVector(this.eye, scaleVector(toObject, delta));
  }
}