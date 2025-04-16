import { Domo } from "../../lib/domo/index.js";
import createButton from "./button.js";
import createIconText from "./icon-text.js";

export default function createInspector(shapesJson, fileName) {
  const actions = new Domo()

    .css(styles.wrapper)
    .chld([
      createButton("Save", "download_2", () =>
        downloadShapeJSON(shapesJson, fileName)
      ),
      createButton("Copy", "content_copy", () => copyShapeJSON(shapesJson)),
    ])
    .build();
  return new Domo()
    .css(styles.inspector)
    .chld([createIconText("data_object", "Shapes JSON"), actions])
    .build();
}

const styles = {
  inspector: {
    width: "20%",
    height: "80%",
    overflow: "auto",
    padding: "1rem",
  },
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
};

function downloadShapeJSON(shapesJson, fileName) {
  const blob = new Blob([JSON.stringify(shapesJson, null, 2)], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  link.click();
}
function copyShapeJSON(shapesJson) {
  navigator.clipboard.writeText(JSON.stringify(shapesJson, null, 2));
}
