import { Domo } from "@zyrab/domo";

export default function createIconText(icon, text) {
  return Domo("div")
    .css(styles.wrapper)
    .child([
      Domo("span").cls("material-symbols-outlined").txt(icon).build(),
      Domo("p").css(styles.text).txt(text).build(),
    ])
    .build();
}

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.2rem",
    width: "100%",
    background: "var(--color-primary)",
  },
  text: {
    fontSize: "0.8rem",
  },
};
