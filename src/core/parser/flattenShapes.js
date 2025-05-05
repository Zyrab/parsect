import parseTransform from "./parseTransform.js";

export default function flattenShapes(
  elements,
  inheritedTransform = new DOMMatrix()
) {
  const result = [];

  for (const el of elements) {
    if (el.nodeType !== Node.ELEMENT_NODE) continue;

    const ownTransform = parseTransform(el.getAttribute("transform"));
    const hasOwnTransform = ownTransform && !ownTransform.isIdentity;
    const combinedTransform = hasOwnTransform
      ? inheritedTransform.multiply(ownTransform)
      : inheritedTransform;

    const tag = el.tagName.toLowerCase();

    if (tag === "g") {
      result.push(...flattenShapes(el.children, combinedTransform));
    } else {
      if (combinedTransform.isIdentity) {
        el.removeAttribute("transform");
      } else {
        el.setAttribute("transform", formatTransform(combinedTransform));
      }
      result.push(el);
    }
  }

  return result;
}

function formatTransform(m) {
  const fmt = (n) => Number(n.toFixed(4));
  return `matrix(${fmt(m.a)}, ${fmt(m.b)}, ${fmt(m.c)}, ${fmt(m.d)}, ${fmt(
    m.e
  )}, ${fmt(m.f)})`;
}
