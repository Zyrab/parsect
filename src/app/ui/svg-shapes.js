import { Domo, DSVG } from "@zyrab/domo";
import createIconText from "./icon-text.js";

export default function createSvgShapes({ viewBox, shapes }) {
  return Domo()
    .cls("svg-display")
    .child([
      createIconText("category", "Shapes Inspector"),
      Domo()
        .cls("svg-shapes")
        .child([
          shapes.map((shape) => {
            return DSVG("svg", "http://www.w3.org/2000/svg")
              .attr({ viewBox })
              .child([shape.cloneNode(true)])
              .build();
          }),
        ])
        .build(),
    ])
    .build();
}
