// ========== Style Attribute Parsing ==========

/**
 * Parses style and appearance-related attributes from SVG elements.
 * @param {Element} element - SVG shape element.
 * @returns {Object} Style attribute map.
 */
export default function getStyleAttributes(element) {
  const attributes = [
    "fill",
    "stroke",
    "stroke-width",
    "opacity",
    // "transform",
    "clip-path",
  ];
  const styles = {};

  // Inline style attribute (style="fill:red;stroke:blue")
  const inlineStyle = element.getAttribute("style");
  if (inlineStyle) {
    const styleObject = Object.fromEntries(
      inlineStyle
        .split(";")
        .filter(Boolean)
        .map((s) => s.split(":").map((part) => part.trim()))
    );
    Object.assign(styles, styleObject);
  }

  // Direct attributes or gradient reference
  attributes.forEach((attr) => {
    const value = element.getAttribute(attr);
    if (!value || value === "none") return;

    if (value.startsWith("url(")) {
      const gradientId = value.match(/#(.*)\)/)?.[1];
      if (gradientId) {
        const gradient = element.ownerDocument.getElementById(gradientId);
        if (gradient) styles[attr] = parseGradient(gradient);
      }
    } else {
      if (!styles.hasOwnProperty(attr)) styles[attr] = value;
    }
  });
  if (Object.keys(styles).length === 0) {
    styles.fill = "000";
  }
  return styles;
}

// ========== Gradient Parsing ==========

/**
 * Parses <linearGradient> or <radialGradient> into usable format.
 * @param {Element} gradient - SVG gradient element.
 * @returns {Object|null} Parsed gradient data.
 */
export function parseGradient(gradient) {
  if (!gradient) return null;
  const gradientAttributes = {
    linearGradient: ["x1", "y1", "x2", "y2"],
    radialGradient: ["cx", "cy", "r", "fx", "fy"],
  };

  const tag = gradient.tagName;
  const attrs = gradientAttributes[tag] || [];
  const details = attrs.reduce((acc, attr) => {
    acc[attr] = gradient.getAttribute(attr);
    return acc;
  }, {});

  const stops = Array.from(gradient.getElementsByTagName("stop")).map(
    (stop) => ({
      offset: stop.getAttribute("offset") || 0,
      color: stop.getAttribute("stop-color") || "#000000",
    })
  );

  return {
    type: tag.replace("Gradient", "").toLowerCase(),
    ...details,
    stops,
  };
}
