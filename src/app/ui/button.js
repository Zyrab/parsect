import { Domo } from "@zyrab/domo";
export default function createButton(text, icon, onClick, fontSize = "1rem") {
  return Domo("button")
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
    .child([
      Domo("span")
        .cls("material-symbols-outlined")
        .css({ fontSize, color: "var(--color-tertiary)" })
        .txt(icon)
        .build(),
      Domo("p").css({ fontSize }).txt(text).build(),
    ])
    .on("click", onClick)
    .build();
}
