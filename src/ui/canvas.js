import { Domo } from "../../lib/domo/index.js";

import toPath2D from "../render/toPath2D.js";
import drawShape from "../render/drawShape.js";

export default function createCanvasShapes(shapesJson) {
  const canvas = new Domo("canvas").id("canvas");
  const view = new Domo().css({
    width: "60%",
    height: "80%",
  });

  requestAnimationFrame(() => initCanvas(canvas.element, shapesJson));

  return view.chld([canvas.build()]).build();
}

function initCanvas(canvas, shapesJson) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  console.log(dpr);
  canvas.width = canvas.parentElement.offsetWidth * dpr;
  canvas.height = canvas.parentElement.offsetHeight * dpr;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { dims, shapes } = toPath2D(shapesJson);

  drawGrid(ctx);
  const scale = canvas.width / (dims.w * 2);
  console.log(scale);
  ctx.save();
  ctx.translate(
    (ctx.canvas.width - dims.w * scale) / 2,
    (ctx.canvas.height - dims.h * scale) / 2
  );
  ctx.scale(scale, scale);
  drawShape(ctx, shapes);
  ctx.restore();
}

function drawGrid(ctx) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

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
}
