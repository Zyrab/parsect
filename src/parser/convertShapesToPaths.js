import parseTransform from "./parseTransform.js";
import applyTransformToPath from "./applyTransform.js";
import getStyleAttributes from "./getStyleAttributes.js";
export default function convertShapesToPaths(elements, viewBox) {
  const paths = [
    {
      svg: {
        width: viewBox.split(" ")[2],
        height: viewBox.split(" ")[3],
        viewBox,
      },
    },
  ];
  for (const el of elements) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;
    if (toSkip[el.tagName.toLowerCase()]) {
      console.warn("skipped shape", el.tagName.toLowerCase());
      continue;
    }

    const converter = shapeConverters[el.tagName.toLowerCase()];

    if (!converter) return;

    const d = converter(el);

    if (!d) return;

    const matrix = parseTransform(el.getAttribute("transform"));
    const transformedD = applyTransformToPath(d, matrix);

    const styles = getStyleAttributes(el);
    const newPah = { path: transformedD, ...styles };
    paths.push(newPah);
  }
  return paths;
}

const shapeConverters = {
  rect: (el) => {
    const x = num(el, "x"),
      y = num(el, "y"),
      w = num(el, "width"),
      h = num(el, "height");
    return w && h ? `M${x},${y} H${x + w} V${y + h} H${x} Z` : "";
  },

  circle: (el) => {
    const cx = num(el, "cx"),
      cy = num(el, "cy"),
      r = num(el, "r");
    return r
      ? `M${cx + r},${cy} A${r},${r} 0 1 0 ${cx - r},${cy} A${r},${r} 0 1 0 ${
          cx + r
        },${cy} Z`
      : "";
  },

  ellipse: (el) => {
    const cx = num(el, "cx"),
      cy = num(el, "cy"),
      rx = num(el, "rx"),
      ry = num(el, "ry");
    return rx && ry
      ? `M${cx + rx},${cy} A${rx},${ry} 0 1 0 ${
          cx - rx
        },${cy} A${rx},${ry} 0 1 0 ${cx + rx},${cy} Z`
      : "";
  },

  line: (el) => {
    const x1 = num(el, "x1"),
      y1 = num(el, "y1"),
      x2 = num(el, "x2"),
      y2 = num(el, "y2");
    return `M${x1},${y1} L${x2},${y2}`;
  },

  polyline: convertPoly,
  polygon: convertPoly,

  path: (el) => el.getAttribute("d")?.trim() || "",
};

function convertPoly(el) {
  const raw = el.getAttribute("points")?.trim();
  if (!raw) return "";

  const coords = raw.split(/[\s,]+/).map(parseFloat);
  if (coords.length < 4) return ""; // at least one pair

  let d = `M${coords[0]},${coords[1]}`;
  for (let i = 2; i < coords.length; i += 2) {
    d += ` L${coords[i]},${coords[i + 1]}`;
  }

  return el.tagName.toLowerCase() === "polygon" ? d + " Z" : d;
}

function num(el, name, fallback = 0) {
  const val = el.getAttribute(name);
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

const toSkip = {
  title: true,
  style: true,
  script: true,
  defs: true,
  desc: true,
  metadata: true,
  foreignObject: true,
  switch: true,
  symbol: true,
  use: true,
  mask: true,
};
