import { Domo } from "@zyrab/domo";
import createButton from "./button.js";
import createIconText from "./icon-text.js";

export default function createInspector(shapesJson, fileName, getFile) {
  const shapeString = JSON.stringify(shapesJson, null, 2);

  const fileInput = Domo("input")
    .attr({ type: "file", accept: ".svg" })
    .css({ display: "none" })
    .on({
      change: (e) => {
        const file = e.target.files[0];
        getFile(file);
      },
    })
    .build();
  const code = (codes) =>
    Domo("pre")
      .css(styles.code)
      .child([Domo("code").child(codes).build()])
      .build();
  const wrapper = (childs, style = "wrapper") =>
    Domo().css(styles[style]).child(childs).build();

  return Domo()
    .cls("inspector-display")
    .child([
      wrapper(
        [
          createIconText("file_save", "Copy It in Your Project"),
          code([toPath2d]),
        ],
        "wrapCol"
      ),
      wrapper(
        [
          createIconText("scan", "Upload new SVG"),
          fileInput,
          createButton("New SVG", "upload_2", () => fileInput.click()),
        ],
        "wrapCol"
      ),
      wrapper(
        [
          createIconText("data_object", "Shapes JSON"),
          wrapper([
            createButton("Save", "download_2", () =>
              downloadShapeJSON(shapeString, fileName)
            ),
            createButton("Copy", "content_copy", () =>
              copyShapeJSON(shapeString)
            ),
          ]),
        ],
        "wrapCol"
      ),
    ])
    .build();
}

const styles = {
  inspector: {},
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  wrapCol: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  code: {
    backgroundColor: "var(--color-primary)",
    width: "100%",
    maxHeight: "200px",
    overflow: "auto",
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
};

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

const toPath2d = `
const toPath2D = (shapeData) => {
  const shapes = []; 
  let dims = { w: 0, h: 0 };
  shapeData.forEach((p) => {
    let path = null;

    if (p.svg) {
      dims.w = p.svg.width;
      dims.h = p.svg.height;
      return; 
    }

    if (p.path) {
      path = new Path2D(p.path); 
    }
    if (path) {
      let shape = { path };

      if (typeof p.fill === "string") {
        shape.fs = p.opacity ? hexToRgba(p.fill, p.opacity) : p.fill;
      }
      if (typeof p.stroke === "string") {
        shape.st = p.opacity ? hexToRgba(p.stroke, p.opacity) : p.stroke;
        if (p.strokeWidth) shape.stw = p.strokeWidth;
      }

      if (typeof p.fill === "object") {
        if (p.fill.type === "linear") shape.fsln = p.fill;
        if (p.fill.type === "radial") shape.fsrd = p.fill;
      }

      if (typeof p.stroke === "object") {
        if (p.stroke.type === "linear") shape.stln = p.stroke;
        if (p.stroke.type === "radial") shape.strd = p.stroke;
        if (p.strokeWidth) shape.stw = p.strokeWidth;
      }

      shapes.push(shape); 
    }
  });

  return { shapes, dims };
};

export default toPath2D;

function hexToRgba(hex, opacity = 1) {
  if (!hex.startsWith("#")) return hex;

  let r, g, b;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    return hex;
  }

  return \`rgba(\${r},\${g}, \${b}, \${opacity})\`;
}
  

const drawShape = (ctx, shapes) => {
  for (const shape of shapes) {
    let fillStyle =
      shape.fs ||
      applyGradient(ctx, shape.fsln) ||
      applyGradient(ctx, shape.fsrd);
    let strokeStyle =
      shape.st ||
      applyGradient(ctx, shape.stln) ||
      applyGradient(ctx, shape.strd);

    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fill(shape.path);
    }

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = shape.stw || 1; 
      ctx.stroke(shape.path);
    }
  }

};

const applyGradient = (ctx, grad) => {
  if (!grad) return null;

  if (grad.type === "linear") {
    const { x1 = 0, y1 = 0, x2 = 100, y2 = 100, stops } = grad;
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    stops.forEach((stop) => gradient.addColorStop(stop.offset, stop.color));
    return gradient;
  }
  return null;
};`;
