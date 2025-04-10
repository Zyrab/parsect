import {
  getShapeAttributes,
  getStyleAttributes,
  parseGradient,
  parsePoints,
} from "../utils/svgUtils.js";

/**
 * Converts SVG data to a structured JSON representation.
 *
 * @param {Object} svgData - The SVG data including viewBox and shapes.
 * @param {string} svgData.viewBox - The viewBox attribute of the SVG.
 * @param {Array} svgData.shapes - Array of SVG shape elements.
 * @returns {Array} - A structured JSON representation of the SVG.
 */
export default function toJSON({ viewBox, shapes }) {
  let shape = [
    {
      svg: {
        width: viewBox.split(" ")[2],
        height: viewBox.split(" ")[3],
        viewBox,
      },
    },
  ];

  shapes.forEach((child) => {
    if (child.tagName.toLowerCase() === "defs") return;
    shape.push({
      [child.tagName.toLowerCase()]: getShapeAttributes(child),
      ...getStyleAttributes(child),
    });
  });

  return shape;
}

// function getShapeAttributes(element) {
//   const attributesMap = {
//     circle: ["cx", "cy", "r"],
//     ellipse: ["cx", "cy", "rx", "ry"],
//     rect: ["x", "y", "width", "height", "rx", "ry"],
//     line: ["x1", "y1", "x2", "y2"],
//     polyline: ["points"],
//     polygon: ["points"],
//   };

//   const shapeType = element.tagName.toLowerCase();
//   const attributes = attributesMap[shapeType] || [];
//   if (shapeType === "path") {
//     return element.getAttribute("d");
//   }

//   return attributes.reduce((acc, attr) => {
//     const value = element.getAttribute(attr);
//     acc[attr] =
//       value !== null
//         ? attr === "points"
//           ? parsePoints(value)
//           : isNaN(value)
//           ? value
//           : parseFloat(value)
//         : null;
//     return acc;
//   }, {});
// }

// function parsePoints(points) {
//   return points
//     .trim()
//     .split(/\s+/)
//     .map((p) => p.split(",").map(Number));
// }
// function getStyleAttributes(element) {
//   const attributes = [
//     "fill",
//     "stroke",
//     "stroke-width",
//     // 'opacity',
//     // 'transform',
//     // 'clip-path',
//   ];
//   const atribtes = {};
//   attributes.forEach((attr) => {
//     const value = element.getAttribute(attr);
//     if (value === "none" || !value) return;
//     if (value.startsWith("url(")) {
//       const gradientId = value.match(/#(.*)\)/)?.[1];
//       if (gradientId) {
//         const gradient = element.ownerDocument.getElementById(gradientId);
//         atribtes[attr] = parseGradient(gradient);
//       }
//       return;
//     }
//     if (value) atribtes[attr] = value;
//   });
//   return atribtes;
// }

// function parseGradient(gradient) {
//   if (!gradient) return null;
//   const gradientAttributes = {
//     linearGradient: ["x1", "y1", "x2", "y2"],
//     radialGradient: ["cx", "cy", "r", "fx", "fy"],
//   };
//   const attrs = gradientAttributes[gradient.tagName] || [];
//   const gradientDetails = attrs.reduce((acc, attr) => {
//     acc[attr] = gradient.getAttribute(attr);
//     return acc;
//   }, {});
//   const stops = Array.from(gradient.getElementsByTagName("stop")).map(
//     (stop) => ({
//       off: stop.getAttribute("offset") || 0,
//       clr: stop.getAttribute("stop-color") || "#000000",
//     })
//   );
//   return {
//     type: gradient.tagName.replace("Gradient", "").toLowerCase(),
//     ...gradientDetails,
//     stops,
//   };
// }
