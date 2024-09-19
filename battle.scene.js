export default class Battle extends Phaser.Scene {
  constructor() {
    super({ key: "battle" });
  }
  create() {
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
  }
}
