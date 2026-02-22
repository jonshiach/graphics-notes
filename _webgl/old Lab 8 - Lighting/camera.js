class Camera {

  constructor(canvas) {

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

    // Movement and settings
    this.keys = {};
    this.speed = 5;

    // Rotation
    this.yaw       = 0;
    this.pitch     = 0;
    this.turnSpeed = 0.005;  

    // Keyboard and mouse input
    this.canvas = canvas;
    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup",   e => this.keys[e.key] = false);
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("mousemove", e => this.mouseMove(e));
  }

  update(dt) {  
    const cy = Math.cos(this.yaw);
    const cp = Math.cos(this.pitch);
    const sy = Math.sin(this.yaw);
    const sp = Math.sin(this.pitch);
    this.front = normalize([cp * sy, sp, -cp * cy]);
    this.right = normalize(cross(this.front, this.worldUp));
    this.up    = normalize(cross(this.right, this.front));

    // Camera movement
    let vel = [0, 0, 0];
    if (this.keys["w"]) vel = addVector(vel, this.front);
    if (this.keys["s"]) vel = subtractVector(vel, this.front);
    if (this.keys["a"]) vel = subtractVector(vel, this.right);
    if (this.keys["d"]) vel = addVector(vel, this.right);

    const move = this.speed * dt;
    if (length(vel) > 0) {
      this.eye = addVector(this.eye, scaleVector(normalize(vel), move));
    }
  }

  mouseMove(e) {
    if (document.pointerLockElement !== this.canvas) return;
    this.yaw   += e.movementX * this.turnSpeed;
    this.pitch -= e.movementY * this.turnSpeed;

    // Limit the pitch angle to -89 degrees < pitch < 89 degrees
    const pitchLimit = 89 * Math.PI / 180;
    this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));
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
}