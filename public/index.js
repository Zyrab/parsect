const app = document.getElementById("app");

import createHeader from "../src/app/layout/header.js";
import createAppView from "../src/app/view/appView.js";

function initApp() {
  app.appendChild(createHeader());
  app.appendChild(createAppView());
}

document.addEventListener("DOMContentLoaded", () => initApp());
