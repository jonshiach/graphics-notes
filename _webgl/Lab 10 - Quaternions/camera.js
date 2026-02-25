class Camera {

  constructor() {

    // Camera vectors
    this.eye     = [0, 0, 0];

    // Projection settings
    this.fov    = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near   = 0.1;
    this.far    = 1000;

    // Movement settings
    this.speed = 5;
    this.turnSpeed = 0.005;

    // Orientation quaternion
    this.orientation = new Quaternion();
  }

  update(input, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    const yaw   = -mouse.x * this.turnSpeed;
    const pitch = -mouse.y * this.turnSpeed;

    // Pitch rotation (rotate around local right vector)
    const localRight = this.orientation.rotateVector([1, 0, 0]);
    const pitchQ = Quaternion.fromAxisAngle(localRight, pitch);

    // Yaw rotation (rotate around y-axis)
    const yawQ = Quaternion.fromAxisAngle([0, 1, 0], yaw);

    // Rotate camera orientation
    this.orientation = yawQ.multiply(pitchQ).multiply(this.orientation).normalize();

    // Calculate front and right vectors
    const front = this.orientation.rotateVector([0, 0, -1]);
    const right = this.orientation.rotateVector([1, 0, 0]);

    // Camera movement
    let vel = [0, 0, 0];
    if (input.isDown("w")) vel = addVector(vel, front);
    if (input.isDown("s")) vel = subtractVector(vel, front);
    if (input.isDown("a")) vel = subtractVector(vel, right);
    if (input.isDown("d")) vel = addVector(vel, right);

    if (length(vel) > 0) {
      vel = normalize(vel);
      this.eye = addVector(this.eye, scaleVector(vel, this.speed * dt));
    }
  }

  getViewMatrix() {
    const rotateMatrix = this.orientation.inverse().matrix();
    const translateMatrix = new Mat4().translate([
      -this.eye[0],
      -this.eye[1],
      -this.eye[2]
    ]);

    return rotateMatrix.multiply(translateMatrix);
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
}