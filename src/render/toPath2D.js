/**
 * Caches the SVG shapes into Path2D objects, handling different types of shapes and their styles.
 *
 * @param {Array} shapeData - An array of objects representing the shape data.
 * @returns {Object} - An object containing the list of cached shapes and the center point.
 * @returns {Array} return.shapes - Array of cached Path2D shapes with corresponding styles.
 * @returns {Object} return.center - The center point of the SVG (width, height).
 */
const toPath2D = (shapeData) => {
  const shapes = []; // Array to store cached shapes
  let center = { x: 0, y: 0 }; // Default center

  shapeData.forEach((p) => {
    let path = null; // Initialize path variable for each shape

    // Set the center based on SVG width and height
    if (p.svg) {
      center.x = p.svg.width;
      center.y = p.svg.height;
      return; // Skip this iteration as it's the svg container
    }

    // Check for different shape types and create corresponding Path2D objects
    if (p.path) {
      path = new Path2D(p.path); // Path element
    } else if (p.circle) {
      let c = p.circle;
      path = new Path2D();
      path.arc(c.cx, c.cy, c.r, 0, 2 * Math.PI); // Circle element
    } else if (p.ellipse) {
      let e = p.ellipse;
      path = new Path2D();
      path.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, 2 * Math.PI); // Ellipse element
    } else if (p.rect) {
      let r = p.rect;
      path = new Path2D();
      path.rect(r.x, r.y, r.width, r.height); // Rectangle element
    } else if (p.line) {
      let l = p.line;
      path = new Path2D();
      path.moveTo(l.x1, l.y1);
      path.lineTo(l.x2, l.y2); // Line element
    } else if (p.polygon) {
      let poly = p.polygon;
      path = new Path2D();
      path.moveTo(poly.points[0][0], poly.points[0][1]);
      poly.points.slice(1).forEach((pt) => path.lineTo(pt[0], pt[1])); // Polygon element

      path.closePath();
    }

    // Store the shape only if a valid path exists
    if (path) {
      let shape = { path };

      // Assign fill color or gradient
      if (typeof p.fill === "string") shape.fs = p.fill; // Solid fill color
      if (typeof p.stroke === "string") {
        shape.st = p.stroke; // Solid stroke color
        if (p.strokeWidth) shape.stw = p.strokeWidth; // Stroke width
      }

      // Handle gradient fills
      if (typeof p.fill === "object") {
        if (p.fill.type === "linear") shape.fsln = p.fill; // Linear gradient fill
        if (p.fill.type === "radial") shape.fsrd = p.fill; // Radial gradient fill
      }

      // Handle gradient strokes
      if (typeof p.stroke === "object") {
        if (p.stroke.type === "linear") shape.stln = p.stroke; // Linear gradient stroke
        if (p.stroke.type === "radial") shape.strd = p.stroke; // Radial gradient stroke
        if (p.strokeWidth) shape.stw = p.strokeWidth; // Stroke width for gradients
      }

      shapes.push(shape); // Add the shape to the array
    }
  });

  return { shapes, center }; // Return the cached shapes and the center of the SVG
};

export default toPath2D;
