// --- Expansion Phase (Calculate Absolute Coordinates) ---

export default function expandCommands(commands) {
  const absoluteCommands = [];
  let currentX = 0;
  let currentY = 0;
  let subpathStartX = 0;
  let subpathStartY = 0;
  let lastControlX = null;
  let lastControlY = null;
  let lastCmd = null;

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
        lastControlX = null;
        lastControlY = null;
        break;
      }
      case "L":
      case "T": {
        let [x, y] = values;
        if (isRelative) {
          x += currentX;
          y += currentY;
        }
        outCmd.x = x;
        outCmd.y = y;
        currentX = x;
        currentY = y;
        if (code === "T" && (lastCmd?.code === "Q" || lastCmd?.code === "T")) {
          // T reflects previous Q's control point
          outCmd.x1 = 2 * currentX - lastControlX;
          outCmd.y1 = 2 * currentY - lastControlY;
          lastControlX = outCmd.x1;
          lastControlY = outCmd.y1;
        } else {
          lastControlX = null;
          lastControlY = null;
        }
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
        outCmd.y = currentY;
        currentX = x;
        lastControlX = null;
        lastControlY = null;
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
        lastControlX = null;
        lastControlY = null;
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
        Object.assign(outCmd, { x1, y1, x2, y2, x, y });
        currentX = x;
        currentY = y;
        lastControlX = x2;
        lastControlY = y2;
        break;
      }
      case "S": {
        let [x2, y2, x, y] = values;
        let x1 = currentX;
        let y1 = currentY;

        if (lastCmd?.code === "C" || lastCmd?.code === "S") {
          x1 = 2 * currentX - lastControlX;
          y1 = 2 * currentY - lastControlY;
        }

        if (isRelative) {
          x2 += currentX;
          y2 += currentY;
          x += currentX;
          y += currentY;
        }

        Object.assign(outCmd, { x1, y1, x2, y2, x, y });
        currentX = x;
        currentY = y;
        lastControlX = x2;
        lastControlY = y2;
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
        Object.assign(outCmd, { x1, y1, x, y });
        currentX = x;
        currentY = y;
        lastControlX = x1;
        lastControlY = y1;
        break;
      }
      case "A": {
        let [rx, ry, rot, large, sweep, x, y] = values;
        if (isRelative) {
          x += currentX;
          y += currentY;
        }
        Object.assign(outCmd, {
          rx,
          ry,
          xAxisRotation: rot,
          largeArcFlag: +large,
          sweepFlag: +sweep,
          x,
          y,
        });
        currentX = x;
        currentY = y;
        lastControlX = null;
        lastControlY = null;
        break;
      }
      case "Z": {
        outCmd.x = subpathStartX;
        outCmd.y = subpathStartY;
        currentX = subpathStartX;
        currentY = subpathStartY;
        lastControlX = null;
        lastControlY = null;
        break;
      }
      default:
        throw new Error(`Unhandled command code in expandCommands: ${code}`);
    }
    absoluteCommands.push(outCmd);
    lastCmd = outCmd;
  }
  return absoluteCommands;
}
