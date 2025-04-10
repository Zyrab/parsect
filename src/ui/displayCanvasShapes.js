import toPath2D from "../render/toPath2D.js";
import drawShape from "../render/drawShape.js";

const canvas = document.getElementById("canvas");
canvas.style.backgroundColor = "#9a9a9a"; // #9a9a9a
const ctx = canvas.getContext("2d");
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.parentElement.clientWidth * dpr;
canvas.height = canvas.parentElement.clientHeight * dpr;
const width = canvas.width;
const height = canvas.height;

export default function displayCanvasShapes(newShapeObjects) {
  ctx.clearRect(0, 0, width, height);
  const cachedShapes = toPath2D(newShapeObjects);

  drawGrid(ctx);
  drawShape(ctx, cachedShapes);
}

const drawGrid = (ctx) => {
  ctx.beginPath();
  ctx.strokeStyle = "#676767";
  ctx.lineWidth = 0.5;
  for (let x = 0; x < width; x += 36) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += 36) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
};
