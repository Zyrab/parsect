import { Domo } from "../../lib/domo/index.js";
import parseSVG from "../parser/parseSVG.js";

import createUploadView from "./UploadView.js";
import createLoader from "../ui/loader.js";
import createDisplayView from "./displayView.js";

export default function createAppView() {
  const view = new Domo().css(styles.view).chld([createUploadView(getFile)]);
  async function getFile(file) {
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    const svgText = await file.text();
    if (!svgText) {
      console.log("Please upload a valid SVG file.");
      return;
    }
    view.clear().chld([createLoader()]);
    const result = parseSVG(svgText);
    view.clear().chld([createDisplayView(result, fileName)]);
  }
  return view.build();
}

const styles = {
  view: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
