import { Domo } from "@zyrab/domo";
import createSvgShapes from "../ui/svg-shapes.js";
import createCanvasShapes from "../ui/canvas.js";
import createInspector from "../ui/inspector.js";

export default function createDisplayView(
  { viewBox, paths, shapes },
  fileName,
  getFile
) {
  const view = Domo()
    .css({
      height: "100%",
      width: "100%",
      display: "flex",
    })
    .child([
      createSvgShapes({ viewBox, shapes }),
      createCanvasShapes(paths),
      createInspector(paths, fileName, getFile),
    ]);

  return view.build();
}
