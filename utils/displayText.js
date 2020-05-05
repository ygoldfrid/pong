export function displayText(
  context,
  x,
  y,
  font,
  text,
  fillStyle = "white",
  textAlign = "center"
) {
  context.font = font;
  context.fillStyle = fillStyle;
  context.textAlign = textAlign;
  context.fillText(text, x, y);
}
