const cacheShapes = (coordinates) => {
  const shapes = [];
  let center = { x: 0, y: 0 };

  coordinates.forEach((p) => {
    let path = null;

    if (p.svg) {
      center.x = p.svg.width;
      center.y = p.svg.height;
      return;
    }

    if (p.path) {
      path = new Path2D(p.path);
    } else if (p.circle) {
      let c = p.circle;
      path = new Path2D();
      path.arc(c.cx, c.cy, c.r, 0, 2 * Math.PI);
    } else if (p.ellipse) {
      let e = p.ellipse;
      path = new Path2D();
      path.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, 2 * Math.PI);
    } else if (p.rect) {
      let r = p.rect;
      path = new Path2D();
      path.rect(r.x, r.y, r.width, r.height);
    } else if (p.line) {
      let l = p.line;
      path = new Path2D();
      path.moveTo(l.x1, l.y1);
      path.lineTo(l.x2, l.y2);
    } else if (p.polygon) {
      let poly = p.polygon;
      path = new Path2D();
      path.moveTo(poly.points[0].x, poly.points[0].y);
      poly.points.slice(1).forEach((pt) => path.lineTo(pt.x, pt.y));
      path.closePath();
    }

    // Store the shape only if a valid path exists
    if (path) {
      let shape = { path };

      // Assign fill or stroke
      if (typeof p.fill === "string") shape.fs = p.fill;
      if (typeof p.stroke === "string") {
        shape.st = p.stroke;
        if (p.strokeWidth) shape.stw = p.strokeWidth;
      }

      // Handle gradient fills
      if (typeof p.fill === "object") {
        if (p.fill.type === "linear") shape.fsln = p.fill;
        if (p.fill.type === "radial") shape.fsrd = p.fill;
      }

      // Handle gradient strokes
      if (typeof p.stroke === "object") {
        if (p.stroke.type === "linear") shape.stln = p.stroke;
        if (p.stroke.type === "radial") shape.strd = p.stroke;
        if (p.strokeWidth) shape.stw = p.strokeWidth;
      }

      shapes.push(shape);
    }
  });

  return { shapes, center };
};

export default cacheShapes;
