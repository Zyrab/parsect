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
    }
    // Store the shape only if a valid path exists
    if (path) {
      let shape = { path };

      // Assign fill color or gradient
      if (typeof p.fill === "string") {
        shape.fs = p.opacity ? hexToRgba(p.fill, p.opacity) : p.fill;
      }
      if (typeof p.stroke === "string") {
        shape.st = p.opacity ? hexToRgba(p.stroke, p.opacity) : p.stroke;
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
      // if (p.opacity) shape.op = p.opacity;

      shapes.push(shape); // Add the shape to the array
    }
  });

  return { shapes, center }; // Return the cached shapes and the center of the SVG
};

export default toPath2D;

function hexToRgba(hex, opacity = 1) {
  if (!hex.startsWith("#")) return hex; // already rgba, hsl, or named color

  let r, g, b;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    // Invalid format, return as-is
    return hex;
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
