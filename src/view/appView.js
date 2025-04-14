import { Domo } from "../../lib/domo/index.js";
// import parseSVG from "./src/core/parseSVG.js";

// import displaySvgShapes from "./src/ui/displaySvgShapes.js";
// import displayCanvasShapes from "./src/ui/displayCanvasShapes.js";
// import displayJSON from "./src/ui/displayJSON.js";

import createUploadView from "./UploadView.js";
import createLoader from "../ui/loader.js";

export default function createAppView() {
  const view = new Domo()
    .css({
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    })
    .chld([createUploadView(getFile)]);
  function getFile(file) {
    const svgText = file.text();
    if (!svgText) {
      console.log("Please upload a valid SVG file.");
      return;
    }
    view.clear().chld([createLoader()]);
    console.log("file.", file);
    // const { viewBox, paths, shapes } = parseSVG(svgText);
    // displaySvgShapes({ shapes, viewBox }, svgContainer);
    // displayCanvasShapes(paths, viewBox);
    // displayJSON(output, paths);
    view.clear();
  }
  return view.build();
}

// const svgInput = document.getElementById("svgInput");
// const output = document.getElementById("output");

// const svgContainer = document.getElementById("svgContainer");

// svgInput.addEventListener("change", async function (e) {
//   const file = e.target.files[0];

//   if (!file) {
//     output.textContent = "Please upload a valid SVG file.";
//     return;
//   }
//   const svgText = await file.text();
//   const { viewBox, paths, shapes } = parseSVG(svgText);

//   // const parsedShapes = toJSON(svgNode);

//   displaySvgShapes({ shapes, viewBox }, svgContainer);
//   displayCanvasShapes(paths, viewBox);
//   displayJSON(output, paths);
// });
