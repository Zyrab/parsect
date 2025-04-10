import parseSVG from "./src/core/parseSVG.js";
import toJSON from "./src/core/toJSON.js";

import displaySvgShapes from "./src/ui/displaySvgShapes.js";
import displayCanvasShapes from "./src/ui/displayCanvasShapes.js";
import displayJSON from "./src/ui/displayJSON.js";

const svgInput = document.getElementById("svgInput");
const output = document.getElementById("output");

const svgContainer = document.getElementById("svgContainer");

svgInput.addEventListener("change", async function (e) {
  const file = e.target.files[0];

  if (!file) {
    output.textContent = "Please upload a valid SVG file.";
    return;
  }
  const svgText = await file.text();
  const svgNode = parseSVG(svgText);

  const parsedShapes = toJSON(svgNode);

  displaySvgShapes(svgNode, svgContainer);
  displayCanvasShapes(parsedShapes);
  displayJSON(output, parsedShapes);
});
