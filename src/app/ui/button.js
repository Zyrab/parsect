import { Domo } from "@zyrab/domo";
export default function createButton(text, icon, onClick, fontSize = "1rem") {
  return Domo("button")
    .cls("button")
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
