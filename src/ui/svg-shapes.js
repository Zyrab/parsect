import { Domo } from "../../lib/domo/index.js";
import createIconText from "./icon-text.js";

export default function createSvgShapes({ viewBox, shapes }) {
  return new Domo()
    .css(styles.container)
    .chld([
      createIconText("category", "Shapes Inspector"),
      new Domo()
        .css(styles.svgWrapper)
        .chld([
          shapes.map((shape) => {
            return new Domo("svg", "http://www.w3.org/2000/svg")
              .css(styles.svg)
              .attr({ viewBox })
              .chld([shape.cloneNode(true)])
              .build();
          }),
        ])
        .build(),
    ])
    .build();
}

const styles = {
  container: {
    width: "24%",
    height: "80%",
    padding: "0.4rem",
    gap: "0.4rem",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--color-pre-primary)",
    borderRight: "1px solid var(--color-hover)",
  },
  svgWrapper: {
    overflow: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "start",
    width: "100%",
    height: "100%",
    gap: "0.4rem",
  },
  svg: {
    width: "48%",
    backgroundColor: "var(--color-hover)",
  },
};
