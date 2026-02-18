class BaseCamera {
    
    constructor() {
        this.eye = [0, 0, 5];
        this.rotation = new Quaternion();
        this.fov = 45 * Math.PI / 180;
        this.aspect = 800 / 600;
        this.near = 0.1;
        this.far = 1000;
    }

    getViewMatrix() {
        const rotationMatrix = this.rotation.inverse().matrix();
        const translationMatrix = new Mat4().translate([
            -this.eye[0],
            -this.eye[1],
            -this.eye[2]
        ]);

        return rotationMatrix.multiply(translationMatrix);
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

    update(dt, input) {
        // overridden in subclasses
    }
}

class FirstPersonCamera extends BaseCamera {

    constructor(player) {
        super();

        this.player = player;
        this.turnSpeed = 0.002;
        this.speed = 5;
    }

    update(dt, input) {

        const mouse = input.consumeMouseDelta();
        const yaw = -mouse.x * this.turnSpeed;
        const pitch = -mouse.y * this.turnSpeed;

        // Yaw rotation
        const yawQuat = Quaternion.fromAxisAngle([0, 1, 0], yaw);

        // Pitch rotation
        let right = this.rotation.rotateVector([1, 0, 0]);
        const pitchQuat = Quaternion.fromAxisAngle(right, pitch);

        // Combine rotations
        this.rotation = yawQuat
            .multiply(pitchQuat)
            .multiply(this.rotation)
            .normalize();

        // Movement
        let velocity = [0, 0, 0];
        const front = this.rotation.rotateVector([0, 0, -1]);
        right = this.rotation.rotateVector([1, 0, 0]);

        if (input.isDown["w"]) velocity = addVector(velocity, front);
        if (input.isDown["s"]) velocity = subtractVector(velocity, front);
        if (input.isDown["a"]) velocity = subtractVector(velocity, right);
        if (input.isDown["d"]) velocity = addVector(velocity, right);

        if (length(velocity) > 0) {
            velocity = normalize(velocity);
            this.player.position = 
                addVector(
                    this.player.position, 
                    scaleVector(velocity, this.speed * dt)
                );
        }

        // Camera sit at player position
        this.eye = this.player.position;
    }
}

class ThirdPersonCamera extends BaseCamera {

    constructor(player, options = {}) {
        super();
        this.player = player;

        // Orbit settings
        this.distance = options.distance || 6;
        this.height = options.height || 2;

        // Angles
        this.yaw = 0;
        this.pitch = 0;
        this.pitchLimit = Math.PI / 2 - 0.1;

        // Sensitivity
        this.turnSpeed = 0.002;

        // Smoothing (higher = snappier)
        this.positionSmooth = 8.0;
        this.rotationSmooth = 10.0;

        this.targetPosition = [0, 0, 0];
        this.targetRotation = new Quaternion();
    }

    update(dt, input) {

        // Update angles
        const mouse = input.consumeMouseDelta();

        this.yaw = -mouse.x * this.turnSpeed;
        this.pitch = -mouse.y * this.turnSpeed; 
        this.pitch = Math.max(
            -this.pitchLimit,
            Math.min(this.pitchLimit, this.pitch)
        );

        // Build target rotation
        const yawQuat = Quaternion.fromAxisAngle([0, 1, 0], this.yaw);
        const pitchQuat = Quaternion.fromAxisAngle([1, 0, 0], this.pitch);

        // Yaw first then pitch
        this.targetRotation = yawQuat.multiply(pitchQuat);
        console.log(this.yaw);

        // Compute target position
        const orbitOffset = this.targetRotation.rotateVector(
            [0, 0, this.distance]
        );
        const heightOffset = [0, this.height, 0];
        this.targetPosition = addVector(
            addVector(this.player.position, orbitOffset), 
            heightOffset
        );

        // Smooth position
        const posAlpha = 1 - Math.exp(-this.positionSmooth * dt);
        this.eye = lerpVector(this.eye, this.targetPosition, posAlpha);

        // Smooth rotation
        const rotAlpha = 1 - Math.exp(-this.rotationSmooth * dt);
        this.rotation = Quaternion.slerp(
            this.rotation,
            this.targetRotation,
            rotAlpha
        ).normalize();
    }
}

class CameraController {
    
    constructor(cameras) {
        this.cameras = cameras;
        this.activeIndex = 0;
        this.switchPressedLastFrame = false;
    }

    update(dt, input) {

        // Switch camera (press C)
        const switchPressed = input.isDown("c");

        if (switchPressed && !this.switchPressedLastFrame) {
            this.activeIndex = (this.activeIndex + 1) % this.cameras.length;
        }

        this.switchPressedLastFrame = switchPressed;

        // Update active camera
        this.active.update(dt, input);
    }

    get active() {
        return this.cameras[this.activeIndex];
    }
}