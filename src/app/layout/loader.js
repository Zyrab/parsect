import { Domo } from "@zyrab/domo";

export default function createLoader() {
  const loader = Domo("div").txt("Loading...").cls("loader").build();
  return loader;
}
