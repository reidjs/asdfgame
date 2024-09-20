const TEXT_PADDING = 5;
const FONT_SIZE = 20;
const FONT_FAMILY = "Courier";
const FONT_STYLE = { font: `${FONT_SIZE}px ${FONT_FAMILY}`, fill: "#000" };

function checkCondition(str, cond) {
  // Replace logical operators with JavaScript equivalents
  const safeCond = cond
    .replace(/&/g, "&&") // '&&' remains '&&'
    .replace(/\|/g, "||") // '||' remains '||'
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

function drawGrid(scene, gridSize) {
  const graphics = scene.add.graphics({
    lineStyle: { width: 1, color: 0x000000 },
  });

  const width = scene.sys.game.config.width;
  const height = scene.sys.game.config.height;

  for (let x = 0; x < width; x += gridSize) {
    graphics.moveTo(x, 0);
    graphics.lineTo(x, height);
  }

  for (let y = 0; y < height; y += gridSize) {
    graphics.moveTo(0, y);
    graphics.lineTo(width, y);
  }

  graphics.strokePath();
}

class Mob {
  x;
  y;
  condition;
  tokens = [];
  active = false;
  constructor(scene) {
    this.scene = scene;
  }
  moveDown(dy) {
    this.tokens.forEach((token) => {
      token[0].y += dy;
      token[1].y += dy;
    });
  }
  destroy() {
    this.active = false;
    this.tokens.forEach((token) => {
      token.forEach((instance) => {
        instance.destroy();
      });
    });
  }
  create(x, y, condition) {
    this.active = true;
    this.condition = condition;
    // this.x = x;
    // this.y = y;
    // const padding = 5; // Padding around the text
    // const fontSize = 20; // Font size of the text
    // const fontFamily = "Courier"; // Monospaced font

    let currentX = x;

    condition.split("").forEach((char) => {
      const text = this.scene.add
        .text(currentX, y, char, FONT_STYLE)
        .setOrigin(0.5, 0.5);
      const textWidth = text.width + TEXT_PADDING * 2;
      const textHeight = text.height + TEXT_PADDING * 2;

      const square = this.scene.add
        .rectangle(currentX, y, textWidth, textHeight, 0xffffff)
        .setOrigin(0, 0.5);

      this.tokens.push([text, square]);
      text.x = currentX + textWidth / 2;

      text.setDepth(1);
      currentX += textWidth;
    });

    this.x = currentX;
    this.y = y;

    // Create the text
    // const text = this.scene.add
    //   .text(x + padding, y, textContent, style)
    //   .setOrigin(0, 0.5);

    // // Calculate the width and height of the text, including padding
    // const textWidth = text.width + padding * 2;
    // const textHeight = text.height + padding * 2;

    // // Create the square
    // const square = this.scene.add.rectangle(
    //   x,
    //   y,
    //   textWidth,
    //   textHeight,
    //   0xffffff
    // );
    // square.setOrigin(0, 0.5);
    // this.width = square.width;

    // // Put the text above the square in terms of depth
    // text.setDepth(1);
  }
}

export default class Battle extends Phaser.Scene {
  mobs = [];
  constructor() {
    super({ key: "battle" });
  }
  getActiveTogglesString(toggles) {
    let activeToggles = "";

    if (this.toggles.A) activeToggles += "A";
    if (this.toggles.S) activeToggles += "S";
    if (this.toggles.D) activeToggles += "D";
    if (this.toggles.F) activeToggles += "F";

    return activeToggles;
  }
  mobFactory(scene, x, y, textContent) {
    const mob = new Mob(scene);
    mob.create(x, y, textContent);
    this.mobs.push(mob);
    return mob;
  }
  getMatchingActiveMobs(toggles, mobs) {
    const str = this.getActiveTogglesString(toggles);
    return mobs.filter((mob) => {
      if (checkCondition(str, mob.condition) && mob.active) {
        return true;
      }
      return false;
    });
  }
  destroyMatchingMobs(toggles, mobs) {
    const subset = this.getMatchingActiveMobs(toggles, mobs);
    subset.forEach((mob) => {
      mob.destroy();
      // remove from mobs array?
    });
    console.log("subset", subset);
  }
  resetToggles() {
    this.toggles = {
      A: false,
      S: false,
      D: false,
      F: false,
    };
  }
  create() {
    drawGrid(this, 23);
    this.cursorText = this.add
      .text(0, 0, "", {
        font: "16px Arial",
        fill: "#ffffff",
      })
      .setOrigin(0.5); // Center the text

    this.input.on("pointermove", (pointer) => {
      this.cursorText.setPosition(pointer.x, pointer.y);
      this.cursorText.setText(
        `(${pointer.x.toFixed(0)}, ${pointer.y.toFixed(0)})`
      );
    });
    // const a = mob.create(100, 100, "A | S");
    const spacer = 23;
    const a = this.mobFactory(this, spacer, 100, "A|S");
    const b = this.mobFactory(this, spacer, a.y + 50, "!A");
    const b2 = this.mobFactory(this, b.x + spacer, b.y, "!A");
    const b3 = this.mobFactory(this, b2.x + spacer, b2.y, "A");
    // const b2 = this.mobFactory(this, b.x + b.width + spacer, b.y, "A");
    const c = this.mobFactory(this, spacer, 200, "A&S");
    // mob.create(100 + a.width, 100, "A | S");
    // mob.create(100, 200, "A | !S");
    // mob.create(100, 300, "A | (!S & D)");
    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      S: Phaser.Input.Keyboard.KeyCodes.S,
      D: Phaser.Input.Keyboard.KeyCodes.D,
      F: Phaser.Input.Keyboard.KeyCodes.F,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.resetToggles();
    this.spacebar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.input.keyboard.on(
      "keydown",
      function (event) {
        if (event.code === "KeyA") {
          this.toggles.A = !this.toggles.A;
          console.log("A toggled to", this.toggles.A);
        }
        if (event.code === "KeyS") {
          this.toggles.S = !this.toggles.S;
          console.log("S toggled to", this.toggles.S);
        }
        if (event.code === "KeyD") {
          this.toggles.D = !this.toggles.D;
          console.log("D toggled to", this.toggles.D);
        }
        if (event.code === "KeyF") {
          this.toggles.F = !this.toggles.F;
          console.log("F toggled to", this.toggles.F);
        }
        if (event.code === "Space") {
          this.destroyMatchingMobs(this.toggles, this.mobs);
          this.mobs.forEach((mob) => {
            mob.moveDown(60);
          });
          this.resetToggles();
        }
      },
      this
    );
  }
}
