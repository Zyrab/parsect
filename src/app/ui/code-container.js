import { Domo } from "@zyrab/domo";

export default function createCodeContainer(code, icon) {
  return Domo()
    .css(styles.container)
    .child([
      Domo()
        .css(styles.head)
        .child([
          Domo("span").cls("material-symbols-outlined").txt(icon).build(),
          Domo("span").css(styles.copy).txt("Copy").build(),
        ]),
      Domo("pre")
        .css(styles.pre)
        .child([Domo("code").child([code])]),
    ]);
}

const styles = {
  container: {
    width: "100%",
  },
  head: {
    display: "flex",
    justifyContent: "space-between",
    allignItems: "center",
    padding: "0 0.4rem",
    backgroundColor: "var(--color-accent)",
    color: "var(--color-primary)",
  },
  copy: {
    fontSize: "0.8rem",
    alignSelf: "center",
  },
  pre: {
    backgroundColor: "var(--color-primary)",
    padding: "0.4rem",
    overflow: "auto",
    maxHeight: "6rem",
    tabSize: "2",
  },
};
