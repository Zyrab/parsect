import { Domo } from "@zyrab/domo";

export default function createFooter() {
  return Domo("footer")
    .child([
      Domo().child([
        Domo("p")
          .css({ margin: "0.5rem" })
          .child([
            "Want to help improve ",
            Domo("span").cls("hilight").txt("Parsect"),
            " ?",
          ]),
        Domo("p").child([
          "Check it out on ",
          Domo("a")
            .attr({
              href: "https://github.com/Zyrab/Parsect",
              target: "_blank",
            })
            .txt("GitHub"),
          " and submit contributions or report issues.",
        ]),
      ]),
      Domo("h2")
        .txt("\u00A9 " + new Date().getFullYear() + " Parsect - Created by ")
        .child([Domo("span").cls("hilight").txt("Zyrab")]),
    ])
    .build();
}
