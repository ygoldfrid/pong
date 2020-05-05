import Rectangle from "./rectangle.js";

export default class Player extends Rectangle {
  constructor(id) {
    super(20, 100);
    this.id = id;
    this.score = 0;
    this.CHAR_PIXEL = 10;
  }

  drawScore(context, canvas, color = "#0f0") {
    context.fillStyle = color;
    let baseX =
      (canvas.width * this.id) / 3 - 3 * this.CHAR_PIXEL * (this.id - 1);
    let baseY = 40;

    const prints = this.toArcadeBinary(this.score).split("");
    for (let [index, print] of prints.entries()) {
      let offsetX = (index % 3) * this.CHAR_PIXEL;
      let offsetY = ((index / 3) | 0) * this.CHAR_PIXEL;
      if (print === "1") {
        context.fillRect(
          baseX + offsetX,
          baseY + offsetY,
          this.CHAR_PIXEL,
          this.CHAR_PIXEL
        );
      }
    }
  }

  toArcadeBinary(number) {
    switch (number) {
      case 0:
        return "111101101101111";
      case 1:
        return "011001001001001";
      case 2:
        return "111001111100111";
      case 3:
        return "111001111001111";
      case 4:
        return "101101111001001";
      case 5:
        return "111100111001111";
      case 6:
        return "111100111101111";
      case 7:
        return "111001001001001";
      case 8:
        return "111101111101111";
      case 9:
        return "111101111001111";
    }
  }
}
