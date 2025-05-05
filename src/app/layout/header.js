import { Domo } from "@zyrab/domo";

export default function createHeader() {
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (prefersDarkScheme) {
    document.body.classList.add("dark");
  }
  function handleThemeChange(e) {
    e.preventDefault();
    document.body.classList.toggle("dark");
  }

  const Header = Domo("header")
    .cls("header")
    .child([
      Domo()
        .css({ display: "flex", gap: "0.1rem", alignItems: "center" })
        .child([
          Domo("img").css({ width: "25px", height: "25px" }).attr({
            src: "/public/assets/parsect.png",
            alt: "parsect Logo",
          }),
          Domo("h2").txt("Parsect").build(),
        ]),
      Domo("Span")
        .css({ cursor: "pointer" })
        .cls("material-symbols-outlined")
        .txt("clear_day")
        .on("click", handleThemeChange)
        .build(),
    ]);

  return Header.build();
}
