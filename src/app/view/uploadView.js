import { Domo } from "@zyrab/domo";
import createButton from "../ui/button.js";
import createFileInput from "../ui/file-input.js";

export default function createUploadView(getFile) {
  function handleDragOver(e, show = true, drop = false) {
    e.preventDefault();
    contentWrapper.css({
      backgroundColor: show ? "var(--color-hover)" : "transparent",
      opacity: show ? 0.8 : 1,
    });
    dropZoneText.css({ display: show ? "block" : "none" });
    if (drop) {
      const file = e.dataTransfer.files[0];
      getFile(file);
    }
  }

  const fileInput = createFileInput(getFile);

  const contentWrapper = Domo().css(styles.contentWrapper);
  const dropZoneText = Domo("p").txt("Drop !").css(styles.dropZoneText);

  return Domo()
    .css(styles.view)
    .child([
      contentWrapper
        .child([
          fileInput,
          createButton("Open SVG", "upload_2", () => fileInput.click(), "2rem"),
          Domo("p")
            .txt("or Drop it Here")
            .css({ color: "var(--color-accent)", fontSize: "1.5rem" })
            .build(),
        ])
        .build(),
      dropZoneText.build(),
    ])
    .on("dragenter", handleDragOver)
    .on("dragover", handleDragOver)
    .on("dragleave", (e) => handleDragOver(e, false))
    .on("drop", (e) => handleDragOver(e, false, true))
    .build();
}

const styles = {
  view: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "69vh",
    position: "relative",
    gap: "1rem",
  },
  contentWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    transition: "background-color 0.3s, opacity 0.3s",
  },
  dropZoneText: {
    position: "absolute",
    color: "var(--color-tertiary)",
    fontSize: "3rem",
    display: "none",
  },
};
