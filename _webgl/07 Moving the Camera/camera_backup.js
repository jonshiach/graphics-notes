class Camera {

  constructor() {
    // Camera state
    this.eye     = new Vec3(0, 0, 0);
    this.worldUp = new Vec3(0, 1, 0);
    this.front   = new Vec3(0, 0, -1);
    this.right   = new Vec3(1, 0, 0);
    this.up      = new Vec3(0, 1, 0);

    // Projection settings
    this.left   = -2;
    this.right  = 2;
    this.bottom = -2;
    this.top    = 2;
    this.near   = 0.1;
    this.far    = 100;
    this.fov    = 45 * Math.PI / 180;
    this.aspect = canvas.width / canvas.height;

    // Movement and settings
    this.keys      = {};
    this.speed     = 5.0;

    // Rotation
    this.yaw   = 0;
    this.pitch = 0;
    this.turnSpeed = 0.002;

    // Input
    this.canvas = canvas;
    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup"  , e => this.keys[e.key] = false);
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("mousemove", e => this.mouseMove(e));
  }

  // LookAt
  lookAt() {
    return new Mat4().set(
      this.right.x, this.up.x, -this.front.x, 0,
      this.right.y, this.up.y, -this.front.y, 0,
      this.right.z, this.up.z, -this.front.z, 0,
      -this.eye.dot(this.right), 
      -this.eye.dot(this.up), 
       this.eye.dot(this.front), 
      1
    );
  }

  // Orthographic projection
  orthographic() {
    const rl = 1 / (this.right - this.left);
    const tb = 1 / (this.top - this.bottom);
    const fn = 1 / (this.far - this.near);

    return new Mat4().set(
      2 * rl, 0, 0, 0,
      0, 2 * tb, 0, 0,
      0, 0, -2 * fn, 0,
      -(this.right + this.left) * rl, 
      -(this.top + this.bottom) * tb, 
      -(this.far + this.near) * fn, 
      1
    );
  }

  // Perspective projection
  perspective() {
    const t  = this.near * Math.tan(this.fov / 2);
    const r  = this.aspect * t;
    const fn = 1 / (this.far - this.near);

    return new Mat4().set(
      this.near / r, 0, 0, 0,
      0, this.near / t, 0, 0,
      0, 0, -(this.far + this.near) * fn, -1,
      0, 0, -2 * this.far * this.near * fn, 0
    );
  }

  // Update movement
  update (dt) {

    this.updateVectors();

    // Camera movement
    let vel = new Vec3(0, 0, 0);
    const move = this.speed * dt;

    if (this.keys["w"]) vel = vel.add(this.front);
    if (this.keys["s"]) vel = vel.subtract(this.front);
    if (this.keys["a"]) vel = vel.subtract(this.right);
    if (this.keys["d"]) vel = vel.add(this.right);
    
    if (vel.length() > 0) this.eye = this.eye.add(vel.normalize().scale(move));
  }

  // Move look
  mouseMove(e) {
    if (document.pointerLockElement !== this.canvas) return;
    this.yaw   += e.movementX * this.turnSpeed;
    this.pitch -= e.movementY * this.turnSpeed;

    // Limit pitch
    const limit = Math.PI / 2 - 0.001;
    this.pitch = Math.max(-limit, Math.min(limit, this.pitch));
  }

  // Update camera vectors
  updateVectors() {
    const cy = Math.cos(this.yaw);
    const cp = Math.cos(this.pitch);
    const sy = Math.sin(this.yaw);
    const sp = Math.sin(this.pitch);

    this.front = new Vec3(cp * sy, sp, -cp * cy).normalize();
    this.right = this.front.cross(this.worldUp).normalize();
    this.up    = this.right.cross(this.front).normalize();
  }
}