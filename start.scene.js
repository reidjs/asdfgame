let NEXT_NODE_ID = 0;

class Player {
  constructor(scene) {
    this.isMoving = false;
    this.scene = scene;
  }
  create(node) {
    const player = this.scene.add.circle(node.x, node.y, 25, 0x00ff00);
    player.currentNode = node.id;

    return player;
  }
}

class Level {
  constructor(scene) {
    this.scene = scene;
    this.nodes = [];
    this.edges = [];
  }
  createNodeAt(x, y) {
    let node = this.scene.add.rectangle(x, y, 50, 50, 0xff0000);
    node.id = NEXT_NODE_ID++;
    this.nodes.push(node);
    return node;
  }
  isConnected(node1ID, node2ID) {
    return this.edges.some((edge) => {
      return (
        (edge[0] === node1ID && edge[1] === node2ID) ||
        (edge[0] === node2ID && edge[1] === node1ID)
      );
    });
  }
  createEdge(node1, node2) {
    // NOTE: would be cool to show 'traffic' between nodes that represents
    // how fast the player will move between them.
    // all nodes are two way
    let graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.beginPath();
    graphics.moveTo(node1.x, node1.y);
    graphics.lineTo(node2.x, node2.y);
    graphics.strokePath();
    this.edges.push([node1.id, node2.id]);
  }
  create() {
    const a = this.createNodeAt(100, 100);
    const b = this.createNodeAt(300, 100);
    const c = this.createNodeAt(100, 600);
    const d = this.createNodeAt(150, 200);
    this.createEdge(a, b);
    this.createEdge(b, c);
    this.createEdge(c, d);
    this.createEdge(d, a);
    this.nodes.forEach((node) => {
      node.setInteractive();
    });
    const x = this.isConnected(c.id, a.id);
    console.log("x", x);
    return this.nodes;
  }
}

export default class Start extends Phaser.Scene {
  constructor() {
    super({ key: "start" });
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
    this.input.on("gameobjectdown", (pointer, gameObject) => {
      if (this.player.isMoving) {
        return;
      }
      if (!level.isConnected(gameObject.id, this.player.currentNode)) {
        return;
      }
      this.player.isMoving = true;
      this.tweens.add({
        targets: this.player,
        x: gameObject.x,
        y: gameObject.y,
        duration: 300,
        onComplete: () => {
          this.player.isMoving = false;
          this.player.currentNode = gameObject.id;
        },
      });
    });

    const level = new Level(this);
    const player = new Player(this);
    this.nodes = level.create();
    this.player = player.create(this.nodes[0]);
  }
}
