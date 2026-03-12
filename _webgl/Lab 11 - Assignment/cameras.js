class BaseCamera {
  
  constructor() {

    // Position and rotation
    this.eye = [0, 0, 0];
    this.rotation = new Quaternion();

    // Projection parameters
    this.fov = 45 * Math.PI / 180;
    this.aspect = 800 / 600;
    this.near = 0.1;
    this.far = 1000;

    // Angles
    this.turnSpeed = 0.002;
    this.yaw = 0;
    this.pitch = 0;
    this.pitchLimit = 85 * Math.PI / 180;
  }

  getViewMatrix() {
    const rotateMatrix = this.rotation.inverse().matrix();
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
    this.rotationSmooth = 20;
  }

  update(input, player, dt) {
    
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    // Clamp pitch
    this.pitch = Math.max(
      -this.pitchLimit,
      Math.min(this.pitchLimit, this.pitch)
    );

    // Rotate camera
    const qYaw   = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);
    const targetRotation = qYaw.multiply(qPitch).normalize();

    // Set camera position at player position
    this.eye = player.position;

    // Slerp camera rotation towards target rotation
    this.rotation = Quaternion.slerp(
      this.rotation,
      targetRotation,
      1 - Math.exp(-this.rotationSmooth)
    );
  }
}

class ThirdPersonCamera extends BaseCamera {

  constructor() {
    super();

    // Orbit settings
    this.distance = 5;
    this.height = 1;
    this.shoulderOffset = 0.5;

    // Smoothing
    this.positionSmooth = 10;
    this.rotationSmooth = 20;
    this.fovSmooth      = 10;

    // Aim FOV
    this.normalFov = this.fov;
    this.aimFov = 30 * Math.PI / 180;

    // Toggle timers
    this.shoulderCoolDown = 0.3;
    this.shoulderCoolDownTimer = 0;

    // Alignment to player
    this.alignSpeed = 1;
  }

  update(input, player, dt) {
    
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    this.pitch = Math.max(
      -this.pitchLimit,
      Math.min(this.pitchLimit, this.pitch)
    );

    // Rotate camera
    const qYaw   = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);
    const targetRotation = qYaw.multiply(qPitch).normalize();

    // Get forward, right and up vectors
    const forward = targetRotation.rotateVector([0, 0, -1]);
    const right   = targetRotation.rotateVector([1, 0, 0]);
    const up      = targetRotation.rotateVector([0, 1, 0]);

    // Shoulder offset
    if (this.shoulderCoolDownTimer > 0) this.shoulderCoolDownTimer -= dt;

    if (input.isDown("q") && this.shoulderCoolDownTimer <= 0) {
      this.shoulderOffset *= -1;
      this.shoulderCoolDownTimer = this.shoulderCoolDown;
    }

    // Calculate target position
    let offset = [0, 0, 0];
    offset = addVector(offset, scaleVector(up, this.height));
    offset = addVector(offset, scaleVector(forward, -this.distance));
    offset = addVector(offset, scaleVector(right, this.shoulderOffset));
    const targetPosition = addVector(player.position, offset);

    // Lerp camera position towards target position
    this.eye = lerpVector(
      this.eye, 
      targetPosition, 
      1 - Math.exp(-this.positionSmooth * dt)
    );

    // Slerp camera rotation towards target rotation
    this.rotation = Quaternion.slerp(
      this.rotation,
      targetRotation,
      1 - Math.exp(-this.rotationSmooth * dt)
    );

    // Switch to aim mode if alt key is held down
    let targetFov = this.normalFov;
    if (input.isDown("e")) {
      targetFov = this.aimFov;
    }
    this.fov += (targetFov - this.fov) * dt * this.fovSmooth;
  }

}

class FreeFlyCamera extends BaseCamera {

  constructor(position = [0, 0, 0]) {
    super();
    this.position = position;
    this.speed = 5;
  }

  update(input, player, dt) {
    
    // Get yaw and pitch angles from mouse input
    const mouse = input.consumeMouseDelta();
    this.yaw   -= mouse.x * this.turnSpeed;
    this.pitch -= mouse.y * this.turnSpeed;

    // Rotate rotation quaternion
    const qPitch = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);
    const qYaw = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
    this.rotation = qYaw.multiply(qPitch).normalize();

    // Calculate forward and right vectors
    const forward = this.rotation.rotateVector([0, 0, -1]);
    const right   = this.rotation.rotateVector([1, 0, 0]);

    // Camera movement
    let vel = [0, 0, 0];
    if (input.isDown("w")) vel = addVector(vel, forward);
    if (input.isDown("s")) vel = subtractVector(vel, forward);
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
      new FirstPersonCamera(),
      new ThirdPersonCamera(),
      new FreeFlyCamera(),
    ];

    this.activeIndex = 0;
  }

  get activeCamera() {
    return this.cameras[this.activeIndex];
  }

  update(dt) {
    // Switch cameras
    if (this.input.isDown("c") && !this.switchCooldown) {

      const oldCamera = this.activeCamera;
      this.activeIndex = (this.activeIndex + 1) % this.cameras.length;
      const newCamera = this.activeCamera;
      this.copyRotation(oldCamera, newCamera);
      this.switchCooldown = 0.3; // seconds to prevent rapid cycling

      if (newCamera instanceof ThirdPersonCamera) {
        this.player.rotation = newCamera.rotation;
      }
    }

    // Countdown cool down timer
    if (this.switchCooldown) {
      this.switchCooldown -= dt;
      if (this.switchCooldown < 0) this.switchCooldown = 0;
    }

    // Update current camera
    this.activeCamera.update(this.input, this.player, dt);
  }

  copyRotation(fromCam, toCam) {
    toCam.yaw = fromCam.yaw;
    toCam.pitch = fromCam.pitch;
    toCam.rotation = fromCam.rotation;
  }
}