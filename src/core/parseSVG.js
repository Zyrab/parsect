/**
 * Parses an SVG string into its viewBox and shapes.
 * @param {string} svgText - The raw SVG markup as a string.
 * @returns {Object} An object containing the viewBox and an array of shapes.
 */
export default function parseSVG(svgText) {
  try {
    // Parse the SVG string into a DOM document
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");

    // Check for any parsing errors in the SVG
    const parserError = doc.querySelector("parsererror");
    if (parserError) {
      throw new Error("Invalid SVG content");
    }

    // Extract the root <svg> element and its 'viewBox' attribute
    const svg = doc.children[0];
    const viewBox = svg.getAttribute("viewBox");

    // Collect all child elements (shapes) of the SVG
    const shapes = Array.from(svg.children);

    // Return an object containing the viewBox and an array of shapes
    return { viewBox, shapes };
  } catch (error) {
    // Log error message if the SVG parsing fails
    console.error("Error parsing SVG:", error.message);
    return {}; // Return empty object on failure to avoid returning an array when it should be an object
  }
}
