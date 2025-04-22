import { Domo } from "@zyrab/domo";

export default function createIconText(icon, text) {
  return Domo()
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
    backgroundColor: "var(--color-primary)",
    width: "100%",
  },
  text: {
    fontSize: "0.8rem",
  },
};
