import { Domo } from "@zyrab/domo";
import createIconText from "./icon-text.js";

import { toPath2D, drawShape } from "../../core/render/index.js";

export default function createCanvasShapes(shapesJson) {
  const canvas = Domo("canvas").id("canvas");
  const view = Domo().css({
    width: "60%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "0.4rem",
    gap: "0.4rem",
    background: "var(--color-pre-primary)",
  });

  requestAnimationFrame(() => initCanvas(canvas.element, shapesJson));

  return view
    .child([
      createIconText("capture", "Canvas View"),
      Domo().css({ height: "100%" }).child([canvas.build()]),
    ])
    .build();
}

function initCanvas(canvas, shapesJson) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.parentElement.offsetWidth * dpr;
  canvas.height = canvas.parentElement.offsetHeight * dpr;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const { dims, shapes } = toPath2D(shapesJson);

  drawGrid(ctx);
  const scale = canvas.width / (dims.w * 3);
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
