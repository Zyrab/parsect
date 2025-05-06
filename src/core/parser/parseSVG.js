import flattenShapes from "./src/flattenShapes.js";
/**
 * Parses an SVG string into its viewBox and shapes.
 * @param {string} svgText - The raw SVG markup as a string.
 * @returns {Object} An object containing the viewBox and an array of shapes.
 */
export default function parseSVG(svgText) {
  // Parse the SVG string into a DOM document
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");

  // Check for any parsing errors in the SVG
  const parserError = doc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Invalid SVG content");
  }

  // Extract the root <svg> element and its 'viewBox' attribute
  const svg = doc.children[0];
  const viewBox = svg.getAttribute("viewBox") || "500 500 0 0";
  // Collect all child elements (shapes) of the SVG

  const { shapes, paths } = flattenShapes(svg.children);
  paths.unshift({
    svg: {
      width: viewBox.split(" ")[2],
      height: viewBox.split(" ")[3],
      viewBox,
    },
  });
  return { viewBox, shapes, paths };
}
