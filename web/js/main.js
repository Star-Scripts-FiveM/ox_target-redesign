import { createOptions } from "./createOptions.js";
import { fetchNui } from "./fetchNui.js";
import { initEditor, openEditor } from "./editor.js";

const optionsWrapper = document.getElementById("options-wrapper");
const body = document.body;
const markers = document.querySelectorAll("#eye .eyeSvg, #eye .dot");

const setHover = (on) => markers.forEach((m) => m.classList.toggle("eye-hover", on));

export function applyDesign(name) {
  if (!name || name === "gta6") body.removeAttribute("data-theme");
  else body.setAttribute("data-theme", name);
}

initEditor();

// ask the client for the saved design as soon as the page is ready
fetchNui("getDesign", {}).then((d) => applyDesign(d)).catch(() => {});

window.addEventListener("message", (event) => {
  switch (event.data.event) {
    case "setDesign":
      return applyDesign(event.data.design);

    case "openEditor":
      return openEditor(event.data.design, event.data.designs);

    case "visible": {
      optionsWrapper.innerHTML = "";
      body.style.visibility = event.data.state ? "visible" : "hidden";
      return setHover(false);
    }

    case "leftTarget": {
      optionsWrapper.innerHTML = "";
      return setHover(false);
    }

    case "setTarget": {
      optionsWrapper.innerHTML = "";
      setHover(true);

      if (event.data.options) {
        for (const type in event.data.options) {
          event.data.options[type].forEach((data, id) => {
            createOptions(type, data, id + 1);
          });
        }
      }

      if (event.data.zones) {
        for (let i = 0; i < event.data.zones.length; i++) {
          event.data.zones[i].forEach((data, id) => {
            createOptions("zones", data, id + 1, i + 1);
          });
        }
      }
    }
  }
});
