class BaseCamera {
  
  constructor() {
    this.eye = [0, 0, 0];

    // Quaternions
    this.orientation = new Quaternion();
    this.targetOrientation = new Quaternion();

    // Angles
    this.yaw = 0;
    this.pitch = 0;
    this.pitchLimit = Math.PI / 2 - 0.1;

    // Movement
    this.turnSpeed = 0.002;

    // Projection parameters
    this.fov = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near = 0.1;
    this.far = 1000;
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
  }

  update(input, player, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    // Rotate Rotation quaternion
    const qYaw = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);

    this.orientation = qYaw.multiply(qPitch).normalize();

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
    this.targetOrientation = qYaw.multiply(qPitch).normalize();

    // Calculate target position
    const offset = this.targetOrientation.rotateVector([0, 0, this.distance]);
    const heightOffset = [0, this.height, 0];
    const targetPosition = addVector(
      player.position, 
      addVector(offset, heightOffset)
    );

    // Apply lerp to smooth camera position
    this.eye = lerpVector(
      this.eye, 
      targetPosition, 
      1 - Math.exp(-this.positionSmooth * dt)
    );

    // Apply slerp to smooth camera rotation
    this.orientation = Quaternion.slerp(
      this.orientation,
      this.targetOrientation, 
      1 - Math.exp(-this.rotationSmooth * dt)
    );
  }
}

class FreeFlyCamera extends BaseCamera {

  constructor() {
    super();
    this.position = [0, 2, 5];
    this.speed = 5;
  }

  update(input, player, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    // Rotate orientation quaternion
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);
    const qYaw = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    this.orientation = qYaw.multiply(qPitch).normalize();

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
}

class CameraManager {

  constructor(player, input) {
    this.player = player;
    this.input = input;

    this.cameras = [
      new FreeFlyCamera(),
      new FirstPersonCamera(),
      new ThirdPersonCamera()
    ];

    this.activeIndex = 0;
  }

  get activeCamera() {
    return this.cameras[this.activeIndex];
  }

  update(dt) {
    // Switch cameras
    if (this.input.isDown("c") && !this._switchCooldown) {
      this.activeIndex = (this.activeIndex + 1) % this.cameras.length;
      this._switchCooldown = 0.3; // seconds to prevent rapid cycling
    }

    // Countdown cooldown timer
    if (this._switchCooldown) {
      this._switchCooldown -= dt;
      if (this._switchCooldown < 0) this._switchCooldown = 0;
    }

    // Update current camera
    this.activeCamera.update(this.input, this.player, dt);
  }
}