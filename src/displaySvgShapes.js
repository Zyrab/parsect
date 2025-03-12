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
