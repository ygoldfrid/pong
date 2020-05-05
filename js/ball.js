import Rectangle from "./rectangle.js";
import Vector from "./vector.js";

export default class Ball extends Rectangle {
  constructor() {
    super(10, 10);
    this.velocity = new Vector();
  }
}
