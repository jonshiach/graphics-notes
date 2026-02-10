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
        this.turnSpeed = 0.005;  

        // Rotation quaternion
        this.rotation = new Quaternion();
        this.targetRotation = new Quaternion();
        this.rotationSpeed = 10; // slerp smoothing strength

        // Third person camera
        this.mode = "first";

        // Keyboard and mouse input
        this.canvas = canvas;
        window.addEventListener("keydown", e => this.keys[e.key] = true);
        window.addEventListener("keyup",   e => this.keys[e.key] = false);
        canvas.addEventListener("click", () => canvas.requestPointerLock());
        document.addEventListener("mousemove", e => this.mouseMove(e));
    }

    update(dt) {  
    
        // Apply slerp
        const t = 1 - Math.exp(-this.rotationSpeed * dt);
        this.rotation = Quaternion
            .slerp(this.rotation, this.targetRotation, t)
            .normalize();

        // Update direction vectors using the rotation quaternion
        this.front = normalize(this.rotation.rotateVector([0, 0, -1]));
        this.right = normalize(this.rotation.rotateVector([1, 0, 0]));
        this.up    = normalize(this.rotation.rotateVector([0, 1, 0]));

        // Camera movement
        let vel = [0, 0, 0];
        if (this.keys["w"]) vel = addVector(vel, this.front);
        if (this.keys["s"]) vel = subtractVector(vel, this.front);
        if (this.keys["a"]) vel = subtractVector(vel, this.right);
        if (this.keys["d"]) vel = addVector(vel, this.right);

        if (length(vel) > 0) {
            vel[1] = 0;
            const move = scaleVector(normalize(vel), this.speed * dt);
            this.eye = addVector(this.eye, move);
        }
    }

    mouseMove(e) {
        if (document.pointerLockElement !== this.canvas) return;
        const yaw   = -e.movementX * this.turnSpeed;
        const pitch = -e.movementY * this.turnSpeed;

        // Yaw quaternion (rotate around worldUp)
        const yawQuat = new Quaternion().fromAxisAngle(this.worldUp, yaw);
        
        // Pitch quaternion (rotate around camera's local right axis)
        const right = this.targetRotation.rotateVector([1, 0, 0]);
        const pitchQuat = new Quaternion().fromAxisAngle(right, pitch);

        // Apply rotations
        this.targetRotation = yawQuat
            .multiply(pitchQuat)
            .multiply(this.targetRotation)
            .normalize();
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

    lookAt(target) {
        const dir = normalize(subtractVector(target, this.eye));
        const yaw = Math.atan2(-dir[0], -dir[2]);
        const pitch = Math.sin(dir[1]);
        this.rotation = new Quaternion().fromEuler(yaw, pitch, 0.0);
    }
}

class ThirdPersonCamera {

    constructor (canvas, player) {
        this.player = player;
        this.distance = 6;
        this.height = 2;

        this.rotation = new Quaternion();
        this.targetRotation = new Quaternion();
        this.rotationSpeed = 10;

        this.eye = [0, 0, 0];
        this.front = [0, 0, -1];
        this.right = [1, 0, 0];
        this.up = [0, 1, 0];

        this.worldUp = [0, 1, 0];
        this.turnSpeed = 0.005;
        this.canvas = canvas;

        canvas.addEventListener("click", () => canvas.requestPointerLock());
        document.addEventListener("mousemove", e => this.mouseMove(e));
    } 

    mouseMove(e) {
        if (document.pointerLockElement !== this.canvas) return;

        const yaw   = -e.movementX * this.turnSpeed;
        const pitch = -e.movementY * this.turnSpeed;

        const yawQuat = new Quaternion().fromAxisAngle(this.worldUp, yaw);
        const right = this.targetRotation.rotateVector([1, 0, 0]);
        const pitchQuat = new Quaternion().fromAxisAngle(right, pitch);

        this.targetRotation = yawQuat
            .multiply(pitchQuat)
            .multiply(this.targetRotation)
            .normalize();
    }

    update(dt) {

        // Smooth orbit rotation
        const t = 1 - Math.exp(-this.rotationSpeed * dt);
        this.rotation = Quaternion
            .slerp(this.rotation, this.targetRotation, t)
            .normalize();

        // Offset behind player
        const localOffset = [0, this.height, this.distance];
        const offset = this.rotation.rotateVector(localOffset);

        this.eye = subtractVector(this.player.position, offset);

        this.front = normalize(subtractVector(this.player.position, this.eye)
        );

        this.right = normalize(cross(this.front, this.worldUp));
        this.up    = normalize(cross(this.right, this.front));
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
}

class Input {

  constructor() {
    this.keys = {};

    window.addEventListener("keydown", e => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", e => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  isDown(key) {
    return !!this.keys[key.toLowerCase()];
  }
}
