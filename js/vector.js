export default class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
    let factor = value / this.len;
    this.x *= factor;
    this.y *= factor;
  }
}
