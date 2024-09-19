const repl = require("repl");
// player
class Player {
  health = 10;
  constructor() {}
}

function satisfiesCondition(str, cond) {
  // example strings:
  // a
  // ab
  // ba (same as ab)
  // b
  // example conditions:
  // a
  // a || b
  // a || !b
  // a && b
  // b
  // !a && b
}

function checkCondition(str, cond) {
  // Replace logical operators with JavaScript equivalents
  const safeCond = cond
    .replace(/&&/g, "&&") // '&&' remains '&&'
    .replace(/\|\|/g, "||") // '||' remains '||'
    .replace(/!/g, "!"); // '!' remains '!'

  // Replace each letter in the condition with a check for its presence in `str`
  const finalCond = safeCond.replace(/[a-zA-Z]/g, (char) => {
    return `(${str.includes(char)})`;
  });

  // Evaluate the final condition
  try {
    return eval(finalCond);
  } catch (e) {
    throw new Error("Invalid condition");
  }
}

const x = checkCondition("ba", "a && (b || c)");
console.log("x", x);

// enemy
class Goblin {
  health = 5;
  cond = "a";
  constructor() {}
  triggered() {
    this.health -= 1;
  }
  attack(target) {
    target.health -= 1;
  }
}
class Orc {
  health = 5;
  cond = "a && b";
  constructor() {}
  triggered() {
    this.health -= 1;
  }
  attack(target) {
    target.health -= 1;
  }
}

const enemies = [new Goblin(), new Orc()];
const player = new Player();

function attackEnemies(command) {
  enemies.forEach((enemy) => {
    if (checkCondition(command, enemy.cond)) {
      enemy.triggered();
    }
  });
}

function enemyTurn() {
  enemies.forEach((enemy) => {
    enemy.attack(player);
  });
}

function update(command) {
  attackEnemies(command);
  enemyTurn();
}

function logState() {
  console.log("Health: ", player.health);
  enemies.forEach((enemy) => {
    console.log("enemy.health:", enemy.health);
  });
}

// Start the REPL
repl.start({
  prompt: "> ",
  eval: (input, context, filename, callback) => {
    const command = input.trim();
    update(command);
    callback(null);
    logState();
  },
});
