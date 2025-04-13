export default function parseTransform(transformStr) {
  if (!transformStr) return null;

  transformStr = transformStr.replace(/\s+/g, " ").trim();
  const regex = /(\w+)\(([^)]+)\)/g;
  let match;
  const matrix = new DOMMatrix();

  while ((match = regex.exec(transformStr))) {
    const [, fn, rawArgs] = match;
    const args = rawArgs.split(/[\s,]+/).map((arg) => +arg); // '+' is faster than Number()

    switch (fn) {
      case "translate": {
        const [tx, ty = 0] = args;
        matrix.translateSelf(tx, ty);
        break;
      }
      case "scale": {
        const [sx, sy = sx] = args;
        matrix.scaleSelf(sx, sy);
        break;
      }
      case "rotate": {
        const [angle, cx = 0, cy = 0] = args;
        if (args.length === 1) {
          matrix.rotateSelf(angle);
        } else {
          matrix.translateSelf(cx, cy);
          matrix.rotateSelf(angle);
          matrix.translateSelf(-cx, -cy);
        }
        break;
      }
      case "matrix": {
        if (args.length === 6) {
          const [a, b, c, d, e, f] = args;
          matrix.multiplySelf(new DOMMatrix([a, b, c, d, e, f]));
        }
        break;
      }
      // Future support (e.g., skewX/skewY) could be added here.
    }
  }

  return matrix;
}
