import parseSVG from "./ParseSVG.js";
import parseShape from "./ParseShape.js";
import displaySvgShapes from "./displaySvgShapes.js";
import displayCanvasShapes from "./displayCanvasShapes.js";
document
  .getElementById("svgInput")
  .addEventListener("change", async function (e) {
    const file = e.target.files[0];
    if (!file) {
      document.getElementById("output").textContent =
        "Please upload a valid SVG file.";
      return;
    }
    const svgText = await file.text();
    const svgNode = parseSVG(svgText);
    displaySvgShapes(svgNode);
    const parsedShapes = parseShape(svgNode);
    document.getElementById("output").textContent = JSON.stringify(
      parsedShapes,
      null,
      2
    );
    document.getElementById("controls").style.display = "flex";
    displayCanvasShapes(parsedShapes);
  });
