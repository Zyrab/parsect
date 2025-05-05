const TRANSFORM_REGEX = /(\w+)\(([^)]+)\)/g;

export default function parseTransform(transformStr) {
  if (!transformStr) return null;

  transformStr = transformStr.trim().replace(/\s+/g, " ");

  const regex = new RegExp(TRANSFORM_REGEX);
  let match;
  let hasAny = false;
  const matrix = new DOMMatrix();

  while ((match = regex.exec(transformStr))) {
    hasAny = true;
    const fn = match[1];
    const args = match[2].split(/[\s,]+/).map((arg) => +arg); // '+' is faster than Number()

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
      case "skewX": {
        const [angle] = args;
        const skewMatrix = new DOMMatrix([
          1,
          0,
          Math.tan((angle * Math.PI) / 180),
          1,
          0,
          0,
        ]);
        matrix.multiplySelf(skewMatrix);
        break;
      }
      case "skewY": {
        const [angle] = args;
        const skewMatrix = new DOMMatrix([
          1,
          Math.tan((angle * Math.PI) / 180),
          0,
          1,
          0,
          0,
        ]);
        matrix.multiplySelf(skewMatrix);
        break;
      }
    }
  }
  return hasAny ? matrix : null;
}
