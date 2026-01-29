function setupConsoleOutput(elementId) {
  const output = document.getElementById(elementId);

  function write(args) {
    const line = document.createElement("div");
    line.textContent = [...args].join(" ");
    output.appendChild(line);
  }
  console.log = (...args) => write(args);
}

setupConsoleOutput("console-output");
console.log('Lab 4 - Vectors and Matrices Exercises\n--------------------------------------');

// Exercise 2
a = new Vec3(5, 1, 3);
b = new Vec3(10, 7, 4);
c = new Vec3(0, 5, -3);

// (a)
const p = b.subtract(a);
console.log("(a) p =", p.print());

// (b)
const q = c.subtract(b);
console.log("(b) q =", q.print());

// (c)
const r = a.subtract(c);
console.log("(c) r =", r.print());

// (d)
console.log("(d) length(q) =", p.length());

// (e)
const qHat = q.normalize();
console.log("(e) qHat =", qHat.print());

// (f)
console.log("(f) p . q =", p.dot(q));

// (g)
const qCrossr = q.cross(r);
console.log("(g) q x r =", qCrossr.print());