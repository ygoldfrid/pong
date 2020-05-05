import Rectangle from "./rectangle.js";
import Pong from "./pong.js";
import { displayText } from "./../utils/displayText.js";
import { menuAudio } from "./index.js";

export default class Menu {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.context = context;
    this.pointsToWin = 3;
    this.sound = true;
    this.positions = [
      this.canvas.height / 2 - 27,
      this.canvas.height / 2 + 13,
      this.canvas.height / 2 + 53,
      this.canvas.height / 2 + 93,
    ];
    this.selected = 0;
    this.selector = new Rectangle(
      10,
      10,
      this.canvas.width / 2 - 100,
      this.positions[this.selected]
    );

    this.draw();
    document.body.addEventListener("keydown", this.handleKeyDown);
  }

  playSound(audio) {
    if (this.sound) audio.play();
  }

  handleKeyDown = (event) => {
    //Selecting option in the menu
    if (event.code === "Space") {
      if (this.sound) this.playSound(menuAudio);
      if (this.selected === 3) this.sound = !this.sound;
      else if (this.selected === 2) {
        this.pointsToWin = (this.pointsToWin + 1) % 10;
        if (this.pointsToWin < 3) this.pointsToWin = 3;
      } else {
        new Pong(
          this.canvas,
          this.context,
          this.selected + 1,
          this.pointsToWin,
          this.sound
        );
        document.body.removeEventListener("keydown", this.handleKeyDown);
      }
    }

    //Moving up/down in the menu
    const size = this.positions.length;
    if (event.code === "ArrowUp") {
      if (this.sound) this.playSound(menuAudio);

      this.selected = this.selected === 0 ? size - 1 : this.selected - 1;
      this.selector.position.y = this.positions[this.selected];
    }
    if (event.code === "ArrowDown") {
      if (this.sound) this.playSound(menuAudio);

      this.selected = (this.selected + 1) % size;
      this.selector.position.y = this.positions[this.selected];
    }

    this.draw();
  };

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //Background
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //White Square Selector
    this.selector.draw(this.context);

    // Game Title
    displayText(
      this.context,
      this.canvas.width / 2,
      100,
      "50px arcadeFontN",
      "Pong",
      "blue"
    );

    //Menu Options
    displayText(
      this.context,
      this.canvas.width / 2 - 30,
      this.canvas.height / 2 - 20,
      "15px arcadeFontN",
      "1 Player"
    );
    displayText(
      this.context,
      this.canvas.width / 2 - 88,
      this.canvas.height / 2 + 20,
      "15px arcadeFontN",
      "2 Players",
      "white",
      "left"
    );
    displayText(
      this.context,
      this.canvas.width / 2 - 88,
      this.canvas.height / 2 + 60,
      "15px arcadeFontN",
      `Points to win: ${this.pointsToWin}`,
      "white",
      "left"
    );
    displayText(
      this.context,
      this.canvas.width / 2 - 88,
      this.canvas.height / 2 + 100,
      "15px arcadeFontN",
      `Sound: ${this.sound ? "ON" : "OFF"}`,
      "white",
      "left"
    );
  }
}
