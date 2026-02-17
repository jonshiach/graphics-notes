class Input {

  constructor() {
    this.keys = {};
    this.mouseDelta = { x: 0, y: 0 };

    window.addEventListener("keydown", e => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", e => {
      this.keys[e.key.toLowerCase()] = false;
    });

    canvas.addEventListener("click", () => 
        canvas.requestPointerLock()
    );

    document.addEventListener("mousemove", e => {
        if (document.pointerLockElement === canvas) {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;
        }
    });
  }

  isDown(key) {
    return !!this.keys[key.toLowerCase()];
  }

  consumeMouseDelta() {
    const d = { ...this.mouseDelta };
    this.mouseDelta.x = 0;
    this.mouseDelta.y = 0;
    return d;
  }
}
