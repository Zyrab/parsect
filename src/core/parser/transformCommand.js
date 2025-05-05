// --- Transformation Phase ---
const EPSILON = 1e-6; // Tolerance for floating-point comparisons
export default function transformCommand(cmd, m) {
  const apply = (x, y) => {
    if (x === undefined || y === undefined) return {};
    const pt = new DOMPoint(x, y).matrixTransform(m);
    return { x: pt.x, y: pt.y };
  };

  const out = { ...cmd };

  switch (cmd.code) {
    case "M":
    case "L":
    case "T":
    case "H":
    case "V": {
      const p = apply(cmd.x, cmd.y);
      out.x = p.x;
      out.y = p.y;
      break;
    }
    case "C": {
      const p1 = apply(cmd.x1, cmd.y1);
      const p2 = apply(cmd.x2, cmd.y2);
      const p = apply(cmd.x, cmd.y);
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
    case "S": {
      // S command
      const p1 = apply(cmd.x1, cmd.y1); // Transform first control point (calculated reflection)
      const p2 = apply(cmd.x2, cmd.y2); // Transform second control point (from original S/s)
      const p = apply(cmd.x, cmd.y); // Transform end point

      Object.assign(out, {
        x1: p1.x,
        y1: p1.y,
        x2: p2.x, // Add transformed x2
        y2: p2.y, // Add transformed y2
        x: p.x,
        y: p.y,
      });
      break;
    }
    case "Q": {
      // Q command (only has x1, y1 and x, y)
      const p1 = apply(cmd.x1, cmd.y1); // Transform control point
      const p = apply(cmd.x, cmd.y); // Transform end point

      Object.assign(out, {
        x1: p1.x,
        y1: p1.y,
        x: p.x,
        y: p.y,
      });
      break;
    }
    case "A": {
      // Always transform the endpoint (x, y)
      const p = apply(cmd.x, cmd.y);
      out.x = p.x;
      out.y = p.y;

      // Arcs are complex. Check the matrix components.
      const hasSkew = Math.abs(m.b) > EPSILON || Math.abs(m.c) > EPSILON;
      const isNonUniformScale = Math.abs(m.a - m.d) > EPSILON;
      // Note: A matrix can be a combination of rotation and uniform scale (a=d, b=-c)
      // A simple rotation check can be Math.abs(m.a*m.a + m.b*m.b - 1) < EPSILON && Math.abs(m.c*m.c + m.d*m.d - 1) < EPSILON;

      if (hasSkew || isNonUniformScale) {
        // If matrix has skew or non-uniform scale, the transformation of rx, ry, rotation
        // is complex and not handled here. Log a warning.
        console.warn(
          `⚠️ Arc transform is incomplete for complex matrices (non-uniform scale, rotation, skew). ` +
            `rx (${cmd.rx}), ry (${cmd.ry}), and xAxisRotation (${cmd.xAxisRotation}) ` +
            `parameters are not being updated correctly by matrix: ${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.e}, ${m.f}`
        );
        // The original rx, ry, rotation values are copied by {...cmd} and remain in 'out'.
        // They will likely be incorrect for complex transforms.
      } else if (Math.abs(m.a - 1) > EPSILON || Math.abs(m.b) > EPSILON) {
        // Matrix is likely uniform scale, rotation about origin, or both.
        // These cases are simpler but still require updating rx, ry, or rotation.
        // Let's handle uniform scale and rotation about origin here.

        const scale = Math.sqrt(m.a * m.a + m.b * m.b); // Calculate uniform scale factor
        const rotation = Math.atan2(m.b, m.a); // Calculate rotation angle

        out.rx = cmd.rx * scale;
        out.ry = cmd.ry * scale;
        out.xAxisRotation = cmd.xAxisRotation + (rotation * 180) / Math.PI; // Add rotation angle in degrees
        // Ensure rotation is within 0-360 range if needed, though spec doesn't strictly require it
        // out.xAxisRotation = (out.xAxisRotation % 360 + 360) % 360;
      } else {
        // Matrix is just translation (m.a=1, m.d=1, b=0, c=0, e, f can be anything)
        // rx, ry, and xAxisRotation do not change under translation.
        // Their values are already copied by {...cmd} and remain in 'out'.
      }

      // largeArcFlag and sweepFlag typically remain unchanged.
      break;
    }
    case "Z":
      // Nothing to transform
      break;
    default:
      throw new Error(`Unknown command: ${cmd.code}`);
  }

  return out;
}
