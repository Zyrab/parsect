import { Domo } from "@zyrab/domo";
import createSvgShapes from "../ui/svg-shapes.js";
import createCanvasShapes from "../ui/canvas-shapes.js";
import createInspector from "../ui/inspector.js";

export default async function createDisplayView(
  { viewBox, paths, shapes },
  fileName,
  getFile
) {
  const respCodes = await fetch("../../../public/assets/codes.json");
  const dataCodes = await respCodes.json();

  const view = Domo()
    .cls("display")
    .child([
      createSvgShapes({ viewBox, shapes }),
      createCanvasShapes(paths),
      createInspector(paths, fileName, getFile, dataCodes),
    ]);

  return view.build();
}
