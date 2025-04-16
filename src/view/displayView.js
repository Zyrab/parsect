import { Domo } from "../../lib/domo/index.js";
import createSvgShapes from "../ui/svg-shapes.js";
import createCanvasShapes from "../ui/canvas.js";
import createInspector from "../ui/inspector.js";

export default function createDisplayView(
  { viewBox, paths, shapes },
  fileName
) {
  const view = new Domo()
    .css({
      height: "100%",
      width: "100%",
      display: "flex",
    })
    .chld([
      createSvgShapes({ viewBox, shapes }),
      createCanvasShapes(paths),
      createInspector(paths, fileName),
    ]);

  return view.build();
}
