import Ball from "./ball.js";
import Player from "./player.js";
import { displayText } from "./../utils/displayText.js";
import { player1Audio, player2Audio, pointAudio, menuAudio } from "./index.js";

export default class Pong {
  constructor(canvas, context, playersCount, pointsToWin, sound) {
    this.canvas = canvas;
    this.context = context;
    this.playersCount = playersCount;
    this.pointsToWin = pointsToWin;
    this.sound = sound;
    this.ball = new Ball();
    this.players = [new Player(1), new Player(2)];
    this.PADDING = 40;
    this.VELOCITY = 300;
    this.gameStarted = false;
    this.paused = false;
    this.pausedVelocity = { x: 0, y: 0 };
    this.winner = null;

    //Initializing players position
    this.initPlayers();

    // Adding Event Listeners
    this.canvas.addEventListener("click", this.handleClick);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    document.body.addEventListener("keydown", this.handleKeyDown);

    //Recursion for updating game every time
    this.handleCallback();
    this.reset();
  }

  handleCallback() {
    let lastTime;
    const callback = (millis) => {
      if (!this.winner) {
        if (lastTime) {
          this.update((millis - lastTime) / 1000);
        }
        lastTime = millis;
        requestAnimationFrame(callback);
      } else {
        this.drawWinner();
      }
    };
    callback();
  }

  update(dt) {
    //Ball movement
    this.ball.position.x += this.ball.velocity.x * dt;
    this.ball.position.y += this.ball.velocity.y * dt;

    //Ball bouncing with upper and lower walls
    if (this.ball.top < 0 || this.ball.bottom > this.canvas.height) {
      this.ball.velocity.y = -this.ball.velocity.y;
    }

    //Scoring points
    if (this.ball.left < 0) this.scorePlayer(this.players[1]);
    if (this.ball.right > this.canvas.width) this.scorePlayer(this.players[0]);

    //Player 2 following ball controller
    if (this.playersCount === 1)
      this.players[1].position.y = this.ball.position.y;

    //Ball bouncing with players
    for (let player of this.players) {
      this.collide(player);
    }

    this.draw();
  }

  playSound(audio) {
    if (this.sound) audio.play();
  }

  initPlayers() {
    this.players[0].position.x = this.PADDING;
    this.players[1].position.x = this.canvas.width - this.PADDING;
    for (let player of this.players) {
      player.position.y = this.canvas.height / 2;
    }
  }

  handleKeyDown = (event) => {
    if (event.code === "KeyW") this.players[0].position.y -= 15;
    if (event.code === "KeyS") this.players[0].position.y += 15;
    //If there is 1 player, we can move it either with arrows or w/s
    if (this.playersCount === 1) {
      if (event.code === "ArrowUp") this.players[0].position.y -= 15;
      if (event.code === "ArrowDown") this.players[0].position.y += 15;
    }
    //If there are 2 players, we move player1 with w/s and player2 with arrows
    if (this.playersCount === 2) {
      if (event.code === "ArrowUp") this.players[1].position.y -= 15;
      if (event.code === "ArrowDown") this.players[1].position.y += 15;
    }
    //Starting the game with Space
    if (event.code === "Space") {
      if (this.winner) this.restart();
      else if (!this.gameStarted) this.start();
    }
    //Pausing the game with P
    if (event.code === "KeyP" && this.gameStarted) this.pause();
  };

  handleMouseMove = (event) => {
    //We can also move player1 with Mouse
    this.players[0].position.y = event.offsetY;
  };

  handleClick = () => {
    //We can also start the game with a click
    if (this.winner) this.restart();
    else if (!this.gameStarted) this.start();
  };

  start() {
    this.gameStarted = true;
    this.playSound(menuAudio);
    // 50/50 chance for X direction chance (left or right)
    this.ball.velocity.x = this.VELOCITY * (Math.random() > 0.5 ? 1 : -1);
    // Continous chance for Y direction
    this.ball.velocity.y = this.VELOCITY * (Math.random() * 2) - 1;
    // Consistent Y velocity
    this.ball.velocity.len = this.VELOCITY;
  }

  restart() {
    for (let player of this.players) player.score = 0;
    this.playSound(menuAudio);
    this.winner = null;
    this.initPlayers();
    this.reset();
    this.handleCallback();
  }

  reset() {
    this.gameStarted = false;
    this.paused = false;
    this.ball.position.x = this.canvas.width / 2;
    this.ball.position.y = this.canvas.height / 2;
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
  }

  pause() {
    this.playSound(menuAudio);
    if (!this.paused) {
      this.pausedVelocity = { ...this.ball.velocity };
      this.ball.velocity.x = 0;
      this.ball.velocity.y = 0;
      this.paused = true;
    } else {
      this.ball.velocity = { ...this.pausedVelocity };
      this.paused = false;
    }
  }

  collide(player) {
    const audio = player.id === 1 ? player1Audio : player2Audio;
    if (
      player.left < this.ball.right &&
      player.right > this.ball.left &&
      player.top < this.ball.bottom &&
      player.bottom > this.ball.top
    ) {
      let len = this.ball.velocity.len;
      this.ball.velocity.x = -this.ball.velocity.x;
      this.ball.velocity.y = this.VELOCITY * (Math.random() - 0.5);
      //Increasing ball's velocitiy with each hit
      this.ball.velocity.len = len * 1.05;
      this.playSound(audio);
    }
  }

  scorePlayer(player) {
    player.score++;
    this.playSound(pointAudio);
    if (player.score == this.pointsToWin) this.winner = player;
    this.reset();
  }

  draw() {
    this.drawBackground();
    for (let player of this.players) {
      player.draw(this.context);
      player.drawScore(this.context, this.canvas);
    }
    if (!this.winner) {
      this.ball.draw(this.context);
      if (!this.gameStarted) this.drawStart("SpaceBar or Click to Start");
    } else this.drawStart("SpaceBar or Click to Start again");
  }

  drawBackground() {
    this.context.fillStyle = "#000";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStart(text) {
    displayText(
      this.context,
      this.canvas.width / 2,
      this.canvas.height - this.PADDING,
      "15px arcadeFontN",
      text
    );
  }

  drawWinner() {
    if (this.playersCount === 1) {
      const text = this.winner.id === 1 ? "You Win" : "You Lose";
      displayText(
        this.context,
        this.canvas.width / 2,
        this.canvas.height / 2,
        "50px arcadeFontN",
        text,
        "blue"
      );
    } else {
      displayText(
        this.context,
        this.canvas.width / 2,
        this.canvas.height / 2,
        "50px arcadeFontN",
        "Winner",
        "blue"
      );
      const text = this.winner.id === 1 ? "Player 1" : "Player 2";
      displayText(
        this.context,
        this.canvas.width / 2,
        this.canvas.height / 2 + 50,
        "30px arcadeFontN",
        text,
        "blue"
      );
    }
  }
}
