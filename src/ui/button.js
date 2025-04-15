import { Domo } from "../../lib/domo/index.js";

export default function createButton(text, icon, onClick, fontSize = "1rem") {
  return new Domo("button")
    .cls("button")
    .css({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
      cursor: "pointer",
      padding: "0.5rem 0.5rem",
      fontFamily: "var(--ff)",
      backgroundColor: "transparent",
      color: "var(--color-secondary)",
      border: "2px solid var(--color-tertiary)",
    })
    .chld([
      new Domo("span")
        .cls("material-symbols-outlined")
        .css({ fontSize, color: "var(--color-tertiary)" })
        .txt(icon)
        .build(),
      new Domo("p").css({ fontSize }).txt(text).build(),
    ])
    .on({ click: onClick })
    .build();
}
