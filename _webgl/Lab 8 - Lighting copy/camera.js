class Camera {

    constructor() {

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

        // Movement settings
        this.speed = 5;
        this.turnSpeed = 0.005;  
        this.yaw = 0;
        this.pitch = 0;
    }

    update(input, dt) {  

        const { dx, dy } = input.consumeMouseDelta();
        this.yaw += dx * this.turnSpeed;
        this.pitch -= dy * this.turnSpeed;

        // Limit the pitch angle to -89 degrees < pitch < 89 degrees
        const pitchLimit = 89 * Math.PI / 180;
        this.pitch = Math.max(-pitchLimit, Math.min(pitchLimit, this.pitch));

        const cy = Math.cos(this.yaw);
        const cp = Math.cos(this.pitch);
        const sy = Math.sin(this.yaw);
        const sp = Math.sin(this.pitch);

        this.front = normalize([cp * sy, sp, -cp * cy]);
        this.right = normalize(cross(this.front, this.worldUp));
        this.up    = normalize(cross(this.right, this.front));

        // Camera movement
        let vel = [0, 0, 0];
        if (input.isDown("w")) vel = addVector(vel, this.front);
        if (input.isDown("s")) vel = subtractVector(vel, this.front);
        if (input.isDown("a")) vel = subtractVector(vel, this.right);
        if (input.isDown("d")) vel = addVector(vel, this.right);

        if (length(vel) > 0) {
            vel = normalize(vel);
            this.eye = addVector(this.eye, scaleVector(vel, this.speed * dt));
        }
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