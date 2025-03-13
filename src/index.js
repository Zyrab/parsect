import parseSVG from "./ParseSVG.js";
import parseShape from "./ParseShape.js";
import displaySvgShapes from "./displaySvgShapes.js";
import displayCanvasShapes from "./displayCanvasShapes.js";

const svgInput = document.getElementById("svgInput");
const output = document.getElementById("output");
const controls = document.getElementById("controls");

svgInput.addEventListener("change", async function (e) {
  const file = e.target.files[0];

  if (!file) {
    output.textContent = "Please upload a valid SVG file.";
    return;
  }
  const svgText = await file.text();
  const svgNode = parseSVG(svgText);
  const parsedShapes = parseShape(svgNode);
  displaySvgShapes(svgNode);
  displayCanvasShapes(parsedShapes);
  output.textContent = JSON.stringify(parsedShapes, null, 2);
  controls.style.display = "flex";
});
