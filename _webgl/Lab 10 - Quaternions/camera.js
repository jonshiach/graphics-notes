class Camera {

  constructor(canvas) {

    // Camera vectors
    this.eye     = new Vec3(0, 0, 0);
    this.worldUp = new Vec3(0, 1, 0);
    this.front   = new Vec3(0, 0, -1);
    this.right   = new Vec3(1, 0, 0);
    this.up      = new Vec3(0, 1, 0);

    // Projection settings
    this.fov    = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near   = 0.1;
    this.far    = 100;

    // Movement and settings
    this.keys      = {};
    this.speed     = 5;

    // Rotation
    this.yaw   = 0;
    this.pitch = 0;
    this.turnSpeed = 0.005;

    // Keyboard and mouse Input
    this.canvas = canvas;
    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup"  , e => this.keys[e.key] = false);
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("mousemove", e => this.mouseMove(e))
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

  // Update movement
  update(dt) {

    // Update camera vectors
    this.updateVectors();

    // Camera movement
    let vel = new Vec3(0, 0, 0);

    if (this.keys["w"]) vel = vel.add(this.front);
    if (this.keys["s"]) vel = vel.subtract(this.front);
    if (this.keys["a"]) vel = vel.subtract(this.right);
    if (this.keys["d"]) vel = vel.add(this.right);
    
    const move = this.speed * dt;
    if (vel.length() > 0) this.eye = this.eye.add(vel.normalize().scale(
    move));
  }

  // Move look
  mouseMove(e) {
    if (document.pointerLockElement !== this.canvas) return;
    this.yaw   += e.movementX * this.turnSpeed;
    this.pitch -= e.movementY * this.turnSpeed;

    // Limit the pitch angle to -89 degrees < pitch < 89 degrees
    const pitchLimit = 89 * Math.PI / 180;
    this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));
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
  orthographic(left, right, bottom, top, near, far) {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const fn = 1 / (far - near);

    return new Mat4().set(
      2 * rl, 0, 0, 0,
      0, 2 * tb, 0, 0,
      0, 0, -2 * fn, 0,
      -(right + left) * rl,
      -(top + bottom) * tb,
      -(far + near) * fn,
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
}

class quaternionCamera{
  constructor(canvas) {
    this.eye = new Vec3(0, 0, 0);
    this.orientation = new Quaternion(1, 0, 0, 1);

    // Projection settings
    this.fov    = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near   = 0.1;
    this.far    = 1000;

    // Movement
    this.speed = 5;
    this.keys  = [];

    // Mouse sensitivity
    this.turnSpeed = 0.005;

    // Keyboard and mouse Input
    this.canvas = canvas;
    window.addEventListener("keydown", e => this.keys[e.key] = true);
    window.addEventListener("keyup"  , e => this.keys[e.key] = false);
    canvas.addEventListener("click", () => canvas.requestPointerLock());
    document.addEventListener("mousemove", e => this.mouseMove(e))
  }

  // Update camera position
  update(dt) {

    // Update camera vectors
    this.updateVectors();

    // Camera movement
    let vel = new Vec3(0, 0, 0);

    if (this.keys["w"]) vel = vel.add(this.front);
    if (this.keys["s"]) vel = vel.subtract(this.front);
    if (this.keys["a"]) vel = vel.subtract(this.right);
    if (this.keys["d"]) vel = vel.add(this.right);
    
    const move = this.speed * dt;
    if (vel.length() > 0) this.eye = this.eye.add(vel.normalize().scale(
    move));
  }

}