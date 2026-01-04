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
console.log('Lab 1 - Intro to JavaScript\n---------------------------');

// Variables
console.log('\nVariables\n---------')
let score;
score = 10;
console.log("score: " + score);
score += 20;
console.log("score: " + score);

let lives = 3;
lives -= 1;
console.log("lives: " + lives);

let myVariable;
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);

myVariable = 10;
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);

myVariable = "level one";
console.log(`\nThe assigned value of myVariable is ${myVariable}
The data type of myVariable is ${typeof(myVariable)}`);

// Arrays
console.log("\nArrays\n------");

const colours = [ "red", "green", "blue" ];
console.log("colours = " + colours);
console.log(`\nthe colours array contains ${colours.length} values`);

colours[1] = 2;
console.log("\ncolours = " + colours);

console.log("\nThe first two values of the array colours is: " + colours.slice(0, 2));

colours.push(3.1416);
console.log("\ncolours = " + colours);

// Objects
console.log("\nObjects\n-------");

const player = {
  name: "Mario",
  lives: 3,
  score: 0,
};

console.log("Name:     " + player.name);
console.log("Lives:    " + player["lives"]);

player.powerUp = "super";
player["score"] += 10;
console.log("Power up: " + player.powerUp);
console.log("Score:    " + player.score);

const enemies = [
  { name: "Goomba", hitPoints: 1},
  { name: "Koopa Troopa", hitPoints: 2},
];

// Conditional statements
console.log("\nConditional statments\n---------------------")

// Power up state
if (player.powerUp === "fire") {
  console.log("Mario can throw fireballs");
} else if (player.powerUp === "super") {
  console.log("Mario is bigger and can break blocks.");
} else {
  console.log("Mario is small.");
}

// Enemy interaction
const jumpedOnEnemy = true;
const enemyIndex = 0;
if (jumpedOnEnemy && enemies[enemyIndex].hitPoints === 1) {
  enemies[0].hitPoints--;
  console.log("Mario jumps on enemy and defeats it.");
} else if (jumpedOnEnemy) {
  enemies[0].hitPoints--;
  console.log("Enemy takes damage.");
} else if (player.powerUp === "fire" || player.powerUp === "super") {
  player.powerUp = null;
  console.log("Mario has lost his power ups.");
} else {
  player.lives--;
  console.log("Mario has lost a life.")
}

// Loops
console.log("\nLoops\n-----")

for (let i = 0; i < enemies.length; i++) {
  console.log(enemies[i].name);
}

let time = 0;
const maxTime = 100;

while (time < maxTime) {
  time += 10;
  console.log("time = " + time);
}

// Functions 
console.log("\nFunctions\n---------")

function jump() {
  console.log("Mario jumps!");
}

jump();

function moveRight(steps) {
  console.log(`Mario moves ${steps} steps to the right.`);
}

moveRight(5);
moveRight(10);

function checkGameOver(lives) {
  if (lives <= 0) {
    return "Game Over!";
  }
  return "Continue playing.";
}

console.log(checkGameOver(player.lives));

// EXercises 
console.log("\nExercise 1\n----------")

class Student {
  constructor(firstName, lastName, id, course, level) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
    this.course = course;
    this.level = level;
  }

  print() {
    console.log(
`
Student Details
---------------
Name   : ${this.firstName} ${this.lastName}
ID     : ${this.id}
Course : ${this.course}
Level  : ${this.level}
`
    );
  }
}

const ellie = new Student("Ellie", "Williams", 12345678, "Computer Science", 5);


ellie.print();