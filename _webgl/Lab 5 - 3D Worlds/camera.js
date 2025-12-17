class Camera {

  constructor() {

    // Camera vectors
    this.eye     = new Vec3(0, 0, 0);
    this.worldUp = new Vec3(0, 1, 0);
    this.front   = new Vec3(0, 0, -1);
    this.right   = new Vec3(1, 0, 0);
    this.up      = new Vec3(0, 1, 0);

    // Projection settings
    this.fov    = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near    = 0.1;
    this.far    = 100;
  }

  // Update camera vectors
  updateVectors() {
    this.right = this.front.cross(this.worldUp).normalize();
    this.up    = this.right.cross(this.front).normalize();
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