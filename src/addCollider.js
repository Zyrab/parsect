export const addColliders = (canvas) => {
  const buttons = document.getElementById("colliders");
  let active = false;
  let sx, sy, ex, ey, shape;

  buttons.addEventListener("click", (e) => {
    e.preventDefault();
    let target = e.target.id;
    if (target === "colliders") return;
    shape = target;
    canvas.addEventListener("mousedown", handleMouseDown);
  });

  const handleMouseDown = (e) => {
    active = true;
    sx = e.clientX - canvas.getBoundingClientRect().left;
    sy = e.clientY - canvas.getBoundingClientRect().top;
    ex = sx;
    ey = sy;
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!active) return;
    ex = e.clientX - canvas.getBoundingClientRect().left;
    ey = e.clientY - canvas.getBoundingClientRect().top;
  };

  const handleMouseUp = () => {
    active = false;
    drawnShapes.push({ shape, sx, sy, ex, ey });
    canvas.removeEventListener("mousemove", handleMouseMove);
    canvas.removeEventListener("mouseup", handleMouseUp);
  };

  const drawUserShape = (ctx, { shape, sx, sy, ex, ey }) => {
    ctx.beginPath();
    if (shape === "rect") {
      ctx.rect(sx, sy, ex - sx, ey - sy);
    } else if (shape === "arc") {
      const radius = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
    }
    ctx.strokeStyle = "green";
    ctx.stroke();
  };

  return {
    active,
    draw: (ctx) => {
      drawnShapes.forEach((s) => drawUserShape(ctx, s));
    },
  };
};
