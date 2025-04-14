import { InitDomo } from "./lib/domo/index.js";
import createHeader from "./src/ui/header.js";
import createAppView from "./src/view/appView.js";

const app = new InitDomo("app");
app.add(createHeader());
app.add(createAppView());
