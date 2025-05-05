import parseTransform from "./parseTransform.js";
export default function flattenShapes(
  elements,
  inheritedTransform = new DOMMatrix()
) {
  const result = [];

  for (const el of elements) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;

    const ownTransform = parseTransform(el.getAttribute("transform"));

    const hasOwnTransform = ownTransform && !isIdentityMatrix(ownTransform);
    const combinedTransform = hasOwnTransform
      ? inheritedTransform.multiply(ownTransform)
      : inheritedTransform;

    if (el.tagName.toLowerCase() === "g") {
      result.push(...flattenShapes(Array.from(el.children), combinedTransform));
    } else {
      if (isIdentityMatrix(combinedTransform)) {
        el.removeAttribute("transform");
      } else {
        el.setAttribute("transform", formatTransform(combinedTransform));
      }
      result.push(el);
    }
  }

  return result;
}

function isIdentityMatrix(matrix) {
  return (
    matrix.a === 1 &&
    matrix.b === 0 &&
    matrix.c === 0 &&
    matrix.d === 1 &&
    matrix.e === 0 &&
    matrix.f === 0
  );
}
function formatTransform(m) {
  return `matrix(${m.a}, ${m.b}, ${m.c}, ${m.d}, ${m.e}, ${m.f})`;
}
