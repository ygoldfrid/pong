import Menu from "./menu.js";
import { goFullscreen } from "./../utils/goFullscreen.js";

const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");
const fullscreenBtn = document.getElementById("fullscreen");
export const menuAudio = document.getElementById("menuAudio");
export const pointAudio = document.getElementById("pointAudio");
export const player1Audio = document.getElementById("player1Audio");
export const player2Audio = document.getElementById("player2Audio");

new Menu(canvas, context);

fullscreenBtn.addEventListener("click", () => {
  goFullscreen(canvas);
});
