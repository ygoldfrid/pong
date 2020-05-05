import Vector from "./vector.js";

export default class Rectangle {
  constructor(width, height, x = 0, y = 0) {
    this.size = new Vector(width, height);
    this.position = new Vector(x, y);
  }
  get left() {
    return this.position.x - this.size.x / 2;
  }
  get right() {
    return this.position.x + this.size.x / 2;
  }
  get top() {
    return this.position.y - this.size.y / 2;
  }
  get bottom() {
    return this.position.y + this.size.y / 2;
  }

  draw(context, color = "#fff") {
    context.fillStyle = color;
    context.fillRect(this.left, this.top, this.size.x, this.size.y);
  }
}
