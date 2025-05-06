import { Domo } from "@zyrab/domo";
import createSvgShapes from "../ui/svg-shapes.js";
import createCanvasShapes from "../ui/canvas-shapes.js";
import createInspector from "../ui/inspector.js";

export default function createDisplayView(
  { viewBox, paths, shapes },
  fileName,
  getFile
) {
  const view = Domo()
    .cls("display")
    .child([
      createSvgShapes({ viewBox, shapes }),
      createCanvasShapes(paths),
      createInspector(paths, fileName, getFile),
    ]);

  return view.build();
}
