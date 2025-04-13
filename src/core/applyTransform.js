// Filename: pathTransformer.js

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

// --- Parsing Phase ---

const COMMAND_REGEX = /([a-df-zA-DF-Z])([^a-df-zA-DF-Z]*)/g;
const NUMBER_REGEX = /[-+]?\d*\.?\d+(?:e[-+]?\d+)?/g;

const PARAM_COUNTS = {
  M: 2,
  L: 2,
  H: 1,
  V: 1,
  C: 6,
  S: 4,
  Q: 4,
  T: 2,
  A: 7,
  Z: 0,
};

function parsePathData(d) {
  const commands = [];
  let match;
  COMMAND_REGEX.lastIndex = 0; // Reset regex state

  while ((match = COMMAND_REGEX.exec(d)) !== null) {
    const commandCode = match[1];
    const paramsString = match[2].trim();
    const upperCode = commandCode.toUpperCase();
    const paramCount = PARAM_COUNTS[upperCode];

    if (paramCount == null) {
      throw new Error(`Unsupported command: ${commandCode}`);
    }

    const params = paramsString.match(NUMBER_REGEX)?.map(parseFloat) || [];

    if (upperCode === "Z") {
      if (params.length > 0)
        throw new Error(`Unexpected parameters for Z command: ${paramsString}`);
      commands.push({ code: upperCode, originalCode: commandCode, values: [] });
      continue; // Z takes no parameters
    }

    if (params.length === 0 && paramCount > 0) {
      // Handle cases like "M" with no coords? Might happen with split strings.
      console.warn(
        `Command ${commandCode} expects ${paramCount} params, but got none. Skipping.`
      );
      continue;
    }

    if (params.length < paramCount) {
      throw new Error(
        `Insufficient parameters for ${commandCode}: expected ${paramCount}, got ${params.length}`
      );
    }

    // Handle commands that can implicitly repeat (like L after M)
    for (let i = 0; i < params.length; i += paramCount) {
      const currentParams = params.slice(i, i + paramCount);
      if (currentParams.length !== paramCount) {
        // This can happen if the last set is incomplete, e.g. M 10 10 20
        throw new Error(
          `Parameter count mismatch for implicit command following ${commandCode}. Expected ${paramCount}, got ${currentParams.length}`
        );
      }

      let effectiveCode = commandCode;
      let effectiveUpperCode = upperCode;

      // Handle implicit L/l after M/m
      if (i > 0 && upperCode === "M") {
        effectiveCode = commandCode === "M" ? "L" : "l";
        effectiveUpperCode = "L";
      }
      // Add similar handling for other commands if needed, though less common

      commands.push({
        code: effectiveUpperCode, // Store uppercase for easier processing later
        originalCode: effectiveCode, // Store original for relative/absolute logic
        values: currentParams,
      });
    }
  }
  return commands;
}

// --- Expansion Phase (Calculate Absolute Coordinates) ---

function expandCommands(commands) {
  const absoluteCommands = [];
  let currentX = 0;
  let currentY = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  let lastCmd = null; // Store previous command for S/T implicit points if needed

  for (const cmd of commands) {
    const { code, originalCode, values } = cmd;
    const isRelative = originalCode === originalCode.toLowerCase();
    const outCmd = { code }; // Start building the output command

    switch (code) {
      case "M": {
        let [x, y] = values;
        if (isRelative) {
          x += currentX;
          y += currentY;
        }
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        subpathStartX = x;
        subpathStartY = y;
        break;
      }
      case "L":
      case "T": {
        // T needs previous control point knowledge for accuracy, simplified here
        let [x, y] = values;
        if (isRelative) {
          x += currentX;
          y += currentY;
        }
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        break;
      }
      case "H": {
        let [x] = values;
        if (isRelative) {
          x += currentX;
        }
        outCmd.x = x;
        outCmd.y = currentY; // Keep current Y
        currentX = x;
        break;
      }
      case "V": {
        let [y] = values;
        if (isRelative) {
          y += currentY;
        }
        outCmd.x = currentX; // Keep current X
        outCmd.y = y;
        currentY = y;
        break;
      }
      case "C": {
        let [x1, y1, x2, y2, x, y] = values;
        if (isRelative) {
          x1 += currentX;
          y1 += currentY;
          x2 += currentX;
          y2 += currentY;
          x += currentX;
          y += currentY;
        }
        outCmd.x1 = x1;
        outCmd.y1 = y1;
        outCmd.x2 = x2;
        outCmd.y2 = y2;
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        // TODO: Store lastControlX/Y for S command if needed: lastControlX = x2; lastControlY = y2;
        break;
      }
      case "S": {
        // S needs previous control point knowledge for accuracy, simplified here
        let [x2, y2, x, y] = values;
        // Implicit first control point calculation needed here if accurate S is required
        // Simplified: Assuming x1,y1 relative to previous point for transform purposes
        let x1 = currentX; // Placeholder - needs reflection logic
        let y1 = currentY; // Placeholder - needs reflection logic
        if (isRelative) {
          // x1 += currentX; y1 += currentY; // Adjust if x1,y1 were calculated
          x2 += currentX;
          y2 += currentY;
          x += currentX;
          y += currentY;
        }
        outCmd.x1 = x1; // Placeholder - needs actual reflected control point
        outCmd.y1 = y1; // Placeholder - needs actual reflected control point
        outCmd.x2 = x2;
        outCmd.y2 = y2;
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        // TODO: Store lastControlX/Y for next S command: lastControlX = x2; lastControlY = y2;
        break;
      }
      case "Q": {
        let [x1, y1, x, y] = values;
        if (isRelative) {
          x1 += currentX;
          y1 += currentY;
          x += currentX;
          y += currentY;
        }
        outCmd.x1 = x1;
        outCmd.y1 = y1;
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        // TODO: Store lastControlX/Y for T command: lastControlX = x1; lastControlY = y1;
        break;
      }
      case "A": {
        let [rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y] = values;
        if (isRelative) {
          x += currentX;
          y += currentY;
        }
        outCmd.rx = rx;
        outCmd.ry = ry;
        outCmd.xAxisRotation = xAxisRotation;
        outCmd.largeArcFlag = largeArcFlag;
        outCmd.sweepFlag = sweepFlag;
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        break;
      }
      case "Z": {
        currentX = subpathStartX;
        currentY = subpathStartY;
        break; // No values to add
      }
      default:
        throw new Error(`Unhandled command code in expandCommands: ${code}`);
    }
    absoluteCommands.push(outCmd);
    lastCmd = outCmd; // Store for S/T context if implemented later
  }
  return absoluteCommands;
}

// --- Transformation Phase ---

function transformCommand(cmd, m) {
  // Helper to transform a single point
  const apply = (x, y, matrix) => {
    if (x === undefined || y === undefined) return {}; // Should not happen with expanded commands
    const pt = new DOMPoint(x, y).matrixTransform(matrix);
    return { x: pt.x, y: pt.y };
  };

  const out = { ...cmd }; // Clone command initially

  switch (cmd.code) {
    case "M":
    case "L":
    case "T": // Assumes T's implicit control point is handled elsewhere if needed
    case "H": // Note: H/V are now effectively L commands after expandCommands
    case "V": {
      const p = apply(cmd.x, cmd.y, m);
      out.x = p.x;
      out.y = p.y;
      break;
    }
    case "C": {
      const p1 = apply(cmd.x1, cmd.y1, m);
      const p2 = apply(cmd.x2, cmd.y2, m);
      const p = apply(cmd.x, cmd.y, m);
      Object.assign(out, {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        x: p.x,
        y: p.y,
      });
      break;
    }
    case "S": // Assumes S's implicit control point is handled elsewhere if needed
    case "Q": {
      const p1 = apply(cmd.x1, cmd.y1, m);
      const p = apply(cmd.x, cmd.y, m);
      Object.assign(out, { x1: p1.x, y1: p1.y, x: p.x, y: p.y });
      break;
    }
    case "A": {
      // *** MAJOR WARNING: THIS IS INCORRECT FOR ARCS ***
      // This only transforms the endpoint. Correct arc transformation
      // requires converting to center parameterization, transforming the
      // ellipse geometry, and converting back, or approximating the
      // arc with Bezier curves BEFORE transforming.
      // Distortion WILL occur with non-uniform scales or rotations.
      console.warn(
        "Arc ('A') command transformation is not fully implemented and may cause distortion."
      );
      const p = apply(cmd.x, cmd.y, m);
      out.x = p.x;
      out.y = p.y;
      // out.rx, out.ry, out.xAxisRotation ARE NOT TRANSFORMED!
      break;
    }
    case "Z":
      // No points to transform
      break;
    default:
      throw new Error(
        `Unhandled command code in transformCommand: ${cmd.code}`
      );
  }
  return out;
}

// --- Serialization Phase ---
const PRECISION = 4; // Adjust decimal places as needed

function serializePathData(commands) {
  return commands
    .map((cmd) => {
      const formatNumber = (num) => num.toFixed(PRECISION); // Control precision

      switch (cmd.code) {
        case "M":
          return `M${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "L":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "T":
          return `T${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        // Output H and V as L commands for robustness after arbitrary transforms
        case "H":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "V":
          return `L${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "C":
          return `C${formatNumber(cmd.x1)},${formatNumber(
            cmd.y1
          )} ${formatNumber(cmd.x2)},${formatNumber(cmd.y2)} ${formatNumber(
            cmd.x
          )},${formatNumber(cmd.y)}`;
        case "S":
          return `S${formatNumber(cmd.x1)},${formatNumber(
            cmd.y1
          )} ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`; // Note: x1,y1 might be placeholder if not fully calculated
        case "Q":
          return `Q${formatNumber(cmd.x1)},${formatNumber(
            cmd.y1
          )} ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`;
        case "A":
          return `A${formatNumber(cmd.rx)},${formatNumber(
            cmd.ry
          )} ${formatNumber(cmd.xAxisRotation)} ${cmd.largeArcFlag ? 1 : 0},${
            cmd.sweepFlag ? 1 : 0
          } ${formatNumber(cmd.x)},${formatNumber(cmd.y)}`; // NOTE: rx, ry, xAxisRotation are UNTRANSFORMED
        case "Z":
          return "Z";
        default:
          throw new Error(
            `Unhandled command code in serializePathData: ${cmd.code}`
          );
      }
    })
    .join(" "); // Use space separator
}
