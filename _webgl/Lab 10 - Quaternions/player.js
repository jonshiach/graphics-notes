class Player {

    constructor() {
        this.position = [0, 0, 0];
        this.rotation = new Quaternion();
        this.speed = 5;
        this.turnSpeed = 10;
    }

    update(dt, input, camera) {


        // Camera forward
        let forward = camera.rotation.rotateVector([0, 0, -1]);

        // Remove vertical component (stay on ground)
        forward[1] = 0;
        forward = normalize(forward);

        // Camera right
        let right = camera.rotation.rotateVector([1, 0, 0]);
        right[1] = 0;
        right = normalize(right);

        // Camera relative movement directions
        let move = [0, 0, 0];

        if (input.isDown("w")) move = addVector(move, forward);
        if (input.isDown("s")) move = subtractVector(move, forward);
        if (input.isDown("a")) move = subtractVector(move, right);
        if (input.isDown("d")) move = addVector(move, right);

        move = normalize(move);

        // Move player
        if (length(move) > 0) {
            move = scaleVector(move, this.speed * dt);
            this.position = addVector(this.position, move);

            // Rotate player to face movement direction
            const targetYaw = Math.atan2(move[0], -move[2]);
            const targetRotation = Quaternion.fromAxisAngle(
                [0, 1, 0], 
                targetYaw
            );
            const alpha = 1 - Math.exp(-this.turnSpeed * dt);

            this.rotation = Quaternion.slerp(
                this.rotation,
                targetRotation,
                this.turnSpeed
            ).normalize();
        }
    }
}