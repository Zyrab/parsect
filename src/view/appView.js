import { Domo } from "@zyrab/domo";
import parseSVG from "../parser/parseSVG.js";

import createUploadView from "./uploadView.js";
import createLoader from "../ui/loader.js";
import createDisplayView from "./displayView.js";

export default function createAppView() {
  const view = Domo()
    .css(styles.view)
    .child([createUploadView(getFile)]);

  async function getFile(file) {
    const fileName = file.name.replace(/\.[^/.]+$/, "");

    const svgText = await file.text();
    if (!svgText) {
      console.log("Please upload a valid SVG file.");
      return;
    }
    view.clear().child([createLoader()]);
    const result = parseSVG(svgText);
    view.clear().child([createDisplayView(result, fileName, getFile)]);
  }
  return view.build();
}

const styles = {
  view: {
    height: "95%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
};
