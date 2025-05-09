const app = document.getElementById("app");

import createHeader from "../src/app/layout/header.js";
import createFooter from "../src/app/layout/footer.js";
import createAppView from "../src/app/view/appView.js";

function initApp() {
  app.appendChild(createHeader());
  app.appendChild(createAppView());
  app.appendChild(createFooter());
}

document.addEventListener("DOMContentLoaded", () => initApp());
