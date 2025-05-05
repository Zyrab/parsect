// Filename: pathTransformer.js
import parsePathData from "./parsePathData.js";
import expandCommands from "./expandCommands.js";
import transformCommand from "./transformCommand.js";
import serializePathData from "./serializePathData.js";

/**
 * Applies a DOMMatrix transformation to an SVG path d string.
 * WARNING: Does NOT correctly transform Arc ('A') command parameters (rx, ry, xAxisRotation).
 * It transforms endpoints and control points correctly for other commands (M, L, H, V, C, S, Q, T, Z).
 *
 * @param {string} d - The SVG path d attribute string.
 * @param {DOMMatrix} matrix - The DOMMatrix to apply.
 * @returns {string} The transformed path d string, or the original on error/invalid input.
 */
export default function applyTransformToPath(d, matrix) {
  if (!d || typeof d !== "string") return "";
  // If no matrix or it's the identity matrix, return original
  if (!matrix || matrix.isIdentity) return d;

  try {
    // 1. Parse into basic command structures, keeping original case for context
    const parsedCommands = parsePathData(d);
    if (!parsedCommands.length) return "";

    // 2. Expand commands to use absolute coordinates for all points
    const expandedCommands = expandCommands(parsedCommands);

    // 3. Transform the absolute coordinates in each command
    const transformedCommands = expandedCommands.map((cmd) =>
      transformCommand(cmd, matrix)
    );

    // 4. Serialize back into a path string
    return serializePathData(transformedCommands);
  } catch (err) {
    console.error("Error transforming path:", err.message || err);
    return d; // Return original on error
  }
}
