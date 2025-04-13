/**
 * Draws the shapes on the canvas context with applied styles (fill, stroke, gradients).
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context on which to draw the shapes.
 * @param {Object} object - An object containing the shape data and center coordinates.
 * @param {Array} object.shapes - Array of shape objects containing path data and style information.
 * @param {Object} object.center - The center point of the SVG (width, height).
 */
const drawShape = (ctx, object) => {
  const { shapes, center } = object;

  // If center data exists, adjust drawing position to center the SVG on the canvas
  if (center) {
    ctx.save();
    ctx.translate(
      (ctx.canvas.width - center.x * 1) / 2, // Center horizontally
      (ctx.canvas.height - center.y * 1) / 2 // Center vertically
    );
    ctx.scale(1, 1); // Apply scaling factor of 8
  }

  // Loop through each shape and draw it with its respective styles
  for (const shape of shapes) {
    // Determine the fill and stroke styles (solid color or gradient)
    let fillStyle =
      shape.fs ||
      applyGradient(ctx, shape.fsln) ||
      applyGradient(ctx, shape.fsrd);
    let strokeStyle =
      shape.st ||
      applyGradient(ctx, shape.stln) ||
      applyGradient(ctx, shape.strd);

    // Apply fill style if defined
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill(shape.path);
    }

    // Apply stroke style if defined
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = shape.stw || 1; // Use specified stroke width or default to 1
      ctx.stroke(shape.path);
    }
  }

  // Restore the context to its original state if center was used
  if (center) ctx.restore();
};

/**
 * Applies a gradient to a shape based on the provided gradient data.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas 2D context for gradient creation.
 * @param {Object} grad - The gradient data object containing gradient type and stops.
 * @returns {CanvasGradient|null} - The created gradient or null if no valid gradient is provided.
 */
const applyGradient = (ctx, grad) => {
  if (!grad) return null; // Return null if no gradient is provided

  // Handle linear gradients
  if (grad.type === "linear") {
    const { x1 = 0, y1 = 0, x2 = 100, y2 = 100, stops } = grad;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
  }

  // Handle radial gradients
  if (grad.type === "radial") {
    return console.warn("Radial gradient not supported yet.");
    const { cx, cy, r, r2, stops } = grad;
    const gradient = ctx.createRadialGradient(cx, cy, r1, cx, cy, r2);
    stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
  }

  return null; // Return null if the gradient type is not recognized
};

export default drawShape;
