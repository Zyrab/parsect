import { Domo } from "../../lib/domo/index.js";

export default function createHeader() {
  function handleThemeChange(e) {
    e.preventDefault();
    document.body.classList.toggle("dark");
  }

  const Header = new Domo("header")
    .cls("header")
    .chld([
      new Domo("h2").txt("Parsect").build(),
      new Domo("Span")
        .css({ cursor: "pointer" })
        .cls("material-symbols-outlined")
        .txt("clear_day")
        .on({ click: handleThemeChange })
        .build(),
    ]);

  return Header.build();
}
