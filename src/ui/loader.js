import { Domo } from "../../lib/domo/index.js";

export default function createLoader() {
  const loader = new Domo("div").txt("Loading...").cls("loader").build();
  return loader;
}
