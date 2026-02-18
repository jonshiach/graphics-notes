class Camera {

  constructor(canvas) {

        // Camera vectors
        this.eye     = [0, 0, 0];

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

        // Rotation quaternion
        this.rotation = new Quaternion();

        // Keyboard and mouse input
        this.canvas = canvas;
        window.addEventListener("keydown", e => this.keys[e.key] = true);
        window.addEventListener("keyup",   e => this.keys[e.key] = false);
        canvas.addEventListener("click", () => canvas.requestPointerLock());
        document.addEventListener("mousemove", e => this.mouseMove(e));
  }

  update(dt) {  

        // Pitch rotation
        const localRight = this.rotation.rotateVector([1, 0, 0]);
        const pitchQuat = Quaternion.fromAxisAngle(localRight, this.pitch);

        // Yaw rotation
        const yawQuat = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);

        // Zero yaw and pitch angles
        this.yaw = 0;
        this.pitch = 0;

        // Combine rotations
        this.rotation = yawQuat
            .multiply(pitchQuat)
            .multiply(this.rotation)
            .normalize();

        // Calculate front and right camera vectors
        const front = this.rotation.rotateVector([0, 0, -1]);
        const right = this.rotation.rotateVector([1, 0, 0]);

        // Camera movement
        let vel = [0, 0, 0];
        if (this.keys["w"]) vel = addVector(vel, front);
        if (this.keys["s"]) vel = subtractVector(vel, front);
        if (this.keys["a"]) vel = subtractVector(vel, right);
        if (this.keys["d"]) vel = addVector(vel, right);
        console.log();

        if (length(vel) > 0) {
            vel = normalize(vel);
            this.eye = addVector(this.eye, scaleVector(vel, this.speed * dt));
        }
    }

    mouseMove(e) {
        if (document.pointerLockElement !== this.canvas) return;
        this.yaw   -= e.movementX * this.turnSpeed;
        this.pitch -= e.movementY * this.turnSpeed;

        // Limit the pitch angle to -89 degrees < pitch < 89 degrees
        const pitchLimit = 89 * Math.PI / 180;
        this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));
    }

    getViewMatrix() {
        const rotate = this.rotation.inverse().matrix();
        const translate = new Mat4().translate([
            -this.eye[0],
            -this.eye[1],
            -this.eye[2]
        ]);

        return rotate.multiply(translate);
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