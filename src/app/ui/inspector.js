import { Domo } from "@zyrab/domo";
import createCodeContainer from "./code-container.js";
import createFileInput from "./file-input.js";
import createButton from "./button.js";
import createIconText from "./icon-text.js";
import createFooter from "../layout/footer.js";

export default function createInspector(shapesJson, fileName, getFile, codes) {
  const shapeString = JSON.stringify(shapesJson, null, 2);

  const fileInput = createFileInput(getFile);

  return Domo()
    .cls("inspector-display")
    .child([
      createIconText("file_save", "Copy It in Your Project"),
      createCodeContainer(codes.toPath2D + codes.drawShape, "javascript"),
      createIconText("file_save", "Install Via NPM"),
      createCodeContainer(codes.npm, "terminal"),
      createIconText("integration_instructions", "Use"),
      createCodeContainer(codes.use, "javascript"),
      createIconText("scan", "Upload new SVG"),
      fileInput,
      createButton("New SVG", "upload_2", () => fileInput.click()),
      createIconText("data_object", "svgShapes.json"),
      createButton("Save", "download_2", () =>
        downloadShapeJSON(shapeString, fileName)
      ),
      createButton("Copy", "content_copy", () => copyShapeJSON(shapeString)),
      createFooter(),
    ])
    .onClosest("click", {
      ".copy-code": copyCode,
    })
    .build();
}

function downloadShapeJSON(shapeString, fileName) {
  const blob = new Blob([shapeString], {
    type: "application/json",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.json`;
  link.click();
}
function copyShapeJSON(shapeString) {
  navigator.clipboard.writeText(shapeString);
}

function copyCode(e) {
  e.preventDefault();
  navigator.clipboard.writeText(e.target.dataset.code);
  e.target.innerText = "Copied";
  setTimeout(() => (e.target.innerText = "Copy"), 3000);
}
