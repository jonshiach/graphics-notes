class BaseCamera {
  
  constructor() {
    this.eye = [0, 0, 0];
    this.Rotation = new Quaternion();
    this.targetRotation = new Quaternion();
    this.fov = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near = 0.1;
    this.far = 1000;
  }

  getFront() {
    return this.Rotation.rotateVector([0, 0, -1]);
  }

  getRight() {
    return this.Rotation.rotateVector([1, 0, 0]);
  }

  getViewMatrix() {
    const rotateMatrix = this.Rotation.inverse().matrix();
    const translateMatrix = new Mat4().translate([
      -this.eye[0],
      -this.eye[1],
      -this.eye[2]
    ]);

    return rotateMatrix.multiply(translateMatrix);
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

class FirstPersonCamera extends BaseCamera {

  constructor() {
    super();
    this.yaw = 0;
    this.pitch = 0;
    this.turnSpeed = 0.002;
  }

  update(input, player, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    // Rotate Rotation quaternion
    const qYaw = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);

    this.Rotation = qYaw.multiply(qPitch).normalize();

    // Move camera to player head
    this.eye = addVector(player.position, [0, player.height, 0]);
  }
}

class ThirdPersonCamera extends BaseCamera {

  constructor() {
    super();

    // Orbit settings
    this.distance = 6;
    this.height = 2;

    // Angles
    this.yaw = 0;
    this.pitch = 0;
    this.pitchLimit = Math.PI / 2 - 0.1;

    // Sensitivity
    this.turnSpeed = 0.002;

    // Smoothing
    this.positionSmooth = 8.0;
    this.rotationSmooth = 10.0;
  }

  update(input, player, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;
    this.pitch = Math.max(-this.pitchLimit, Math.min(this.pitchLimit, this.pitch));
    
    // Rotate Rotation quaternion
    const qYaw = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);
    this.targetRotation = qYaw.multiply(qPitch).normalize();

    // Calculate target position
    const offset = this.targetRotation.rotateVector([0, 0, this.distance]);
    const heightOffset = [0, this.height, 0];
    const targetPosition = addVector(
      player.position, 
      addVector(offset, heightOffset)
    );

    // Apply lerp to smooth camera position
    console.log(targetPosition)
    this.eye = lerpVector(
      this.eye, 
      targetPosition, 
      1 - Math.exp(-this.positionSmooth * dt)
    );

    // Apply slerp to smooth camera rotation
    this.Rotation = Quaternion.slerp(
      this.Rotation,
      this.targetRotation, 
      1 - Math.exp(-this.rotationSmooth * dt)
    );
  }
}
