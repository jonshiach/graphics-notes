class Player {
    constructor() {
        this.position = [0, 0, 0];
        this.rotation = new Quaternion();
        this.speed = 5;
    }

    update(dt, input, camera) {

        // Camera relative movement directions
        const forward = normalize([camera.front[0], 0, camera.front[2]]);
        const right = normalize([camera.right[0], 0, camera.right[2]]);
        let move = [0, 0, 0];

        if (input["w"]) move = addVector(move, forward);
        if (input["s"]) move = subtractVector(move, foward);
        if (input["a"]) move = subtractVector(move, right);
        if (input["d"]) move = addVector(move, right);

        if (length(move) > 0) {
            move = normalize(scaleVector(move, this.speed * dt));
            this.position = addVector(this.position, move);

            // Rotate player to face movement direction
            const yaw = Math.atan2(-move[0], -move[2]);
            this.rotation = Quaternion.fromAxisAngle([0, 1, 0], yaw);
        }
    }
}