import { Domo } from "@zyrab/domo";
import parseSVG from "../../core/parser/parseSVG.js";

import createUploadView from "./uploadView.js";
import createLoader from "../layout/loader.js";
import createDisplayView from "./displayView.js";

export default function createAppView() {
  const view = Domo("main").child([
    Domo()
      .css(styles.titleWrapper)
      .child([
        Domo("h3").txt("Easily Render Any SVG on Canvas"),
        Domo("h1").txt(
          "Convert SVG files to JSON and render them directly on canvas using Path2D"
        ),
      ]),
    createUploadView(getFile),
  ]);
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
  titleWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};
