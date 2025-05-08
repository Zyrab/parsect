import { Domo } from "@zyrab/domo";

export default function createFileInput(getFile) {
  return Domo("input")
    .attr({ type: "file", accept: ".svg" })
    .css({ display: "none" })
    .on("change", (e) => {
      const file = e.target.files[0];
      getFile(file);
    })
    .build();
}
