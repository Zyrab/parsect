import parseTransform from "./parseTransform.js";
import convertShapeToPath from "./convertShapesToPaths.js";

export default function flattenShapes(
  elements,
  inheritedTransform = new DOMMatrix()
) {
  const shapes = [];
  const paths = [];

  for (const el of elements) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;

    const ownTransform = parseTransform(el.getAttribute("transform"));
    const hasOwnTransform = ownTransform && !ownTransform.isIdentity;
    const combinedTransform = hasOwnTransform
      ? inheritedTransform.multiply(ownTransform)
      : inheritedTransform;

    const tag = el.tagName.toLowerCase();

    if (tag === "g") {
      const { shapes: nestedShapes, paths: nestedPaths } = flattenShapes(
        el.children,
        combinedTransform
      );
      shapes.push(...nestedShapes);
      paths.push(...nestedPaths);
    } else {
      if (combinedTransform.isIdentity) {
        el.removeAttribute("transform");
        convertShapeToPath(el, tag, paths, null);
      } else {
        const transform = formatTransform(combinedTransform);
        el.setAttribute("transform", transform);
        convertShapeToPath(el, tag, paths, combinedTransform);
      }
      shapes.push(el);
    }
  }

  return { shapes, paths };
}

function formatTransform(m) {
  const fmt = (n) => Number(n.toFixed(4));
  return `matrix(${fmt(m.a)}, ${fmt(m.b)}, ${fmt(m.c)}, ${fmt(m.d)}, ${fmt(
    m.e
  )}, ${fmt(m.f)})`;
}
