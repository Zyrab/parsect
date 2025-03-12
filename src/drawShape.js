const drawShape = (ctx, object) => {
  const { shapes, center } = object;

  if (center) {
    ctx.save();
    ctx.translate(
      (ctx.canvas.width - center.x * 5) / 2,
      (ctx.canvas.height - center.y * 5) / 2
    );
    ctx.scale(5, 5);
  }

  for (const shape of shapes) {
    let fillStyle =
      shape.fs ||
      applyGradient(ctx, shape.fsln) ||
      applyGradient(ctx, shape.fsrd);
    let strokeStyle =
      shape.st ||
      applyGradient(ctx, shape.stln) ||
      applyGradient(ctx, shape.strd);

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill(shape.path);
    }

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = shape.stw || 1;
      ctx.stroke(shape.path);
    }
  }

  if (center) ctx.restore();
};

const applyGradient = (ctx, grad) => {
  if (!grad) return null;

  if (grad.type === "linear") {
    const { x1 = 0, y1 = 0, x2 = 100, y2 = 100, stops } = grad;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach((stop) => gradient.addColorStop(stop.off, stop.clr));
    return gradient;
  }

  if (grad.type === "radial") {
    const { cx, cy, r1, r2, stops } = grad;
    const gradient = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2);
    stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
  }

  return null;
};

export default drawShape;
