const app = document.getElementById("app");

import createHeader from "../src/ui/header.js";
import createAppView from "../src/view/appView.js";

function initApp() {
  app.appendChild(createHeader());
  app.appendChild(createAppView());
}

document.addEventListener("DOMContentLoaded", () => initApp());
