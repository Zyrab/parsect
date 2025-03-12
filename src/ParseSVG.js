export default function parseSVG(svgText) {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    const parserError = doc.querySelector("parsererror");
    if (parserError) throw new Error("Invalid SVG content");
    const svg = doc.children[0];
    const viewBox = svg.getAttribute("viewBox");
    const shapes = Array.from(svg.children);

    return { viewBox, shapes };
  } catch (error) {
    console.error("Error parsing SVG:", error.message);
    return [];
  }
}
