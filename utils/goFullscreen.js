export function goFullscreen(canvas) {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.mozRequestFullScreen) {
    /* Firefox */
    canvas.mozRequestFullScreen();
  } else if (canvas.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {
    /* IE/Edge */
    canvas.msRequestFullscreen();
  }
}
