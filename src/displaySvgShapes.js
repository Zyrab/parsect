export default function displaySvgShapes({ viewBox, shapes }) {
  const svgContainer = document.getElementById("svgContainer");
  svgContainer.replaceChildren();
  shapes.forEach((shape) => {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", viewBox);
    svgElement.classList.add("svgShape");
    const shapeClone = shape.cloneNode(true);
    svgElement.appendChild(shapeClone);
    svgContainer.appendChild(svgElement);
  });
}

// // Create an SVG element
// let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
// svg.setAttribute("width", "200");
// svg.setAttribute("height", "200");

// // Create a circle
// let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// circle.setAttribute("cx", "50");
// circle.setAttribute("cy", "50");
// circle.setAttribute("r", "40");
// circle.setAttribute("fill", "blue");

// // Create a rectangle
// let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
// rect.setAttribute("x", "80");
// rect.setAttribute("y", "30");
// rect.setAttribute("width", "60");
// rect.setAttribute("height", "60");
// rect.setAttribute("fill", "red");

// // Append shapes to SVG
// svg.appendChild(circle);
// svg.appendChild(rect);

// // Append SVG to body or any other container
// document.body.appendChild(svg);
