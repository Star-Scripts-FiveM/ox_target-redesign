import { fetchNui } from "./fetchNui.js";
import { applyDesign } from "./main.js";

const editor = document.getElementById("editor");
const grid = document.getElementById("editor-grid");
const body = document.body;
const eyeTemplate = document.getElementById("eyeSvg");

const NAMES = {
  gta6: "GTA 6 Sunset",
  classic: "Classic",
  minimal: "Minimal",
  neon: "Neon",
  solid: "Solid",
  outline: "Outline",
  retro: "Retro Terminal",
  cyber: "Cyber",
  gold: "Royal Gold",
  ice: "Ice",
  crimson: "Crimson",
  pill: "Pill",
};
const EYE_DESIGNS = ["gta6"];

let saved = "gta6";
let selected = "gta6";
let prevVisibility = "hidden";

function preview(name) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.design = name;

  const pv = document.createElement("div");
  pv.className = "pv";
  if (name !== "gta6") pv.dataset.theme = name;

  const mark = document.createElement("div");
  mark.className = "pv-mark";
  if (EYE_DESIGNS.includes(name)) {
    const eye = eyeTemplate.cloneNode(true);
    eye.removeAttribute("id");
    eye.classList.add("eye-hover");
    mark.appendChild(eye);
  } else {
    const dot = document.createElement("div");
    dot.className = "dot eye-hover";
    mark.appendChild(dot);
  }

  const opts = document.createElement("div");
  opts.className = "pv-opts";
  for (const [icon, text] of [
    ["fa-solid fa-hand", "Interact"],
    ["fa-solid fa-magnifying-glass", "Search"],
  ]) {
    const o = document.createElement("div");
    o.className = "option-container";
    o.innerHTML = `<i class="fa-fw ${icon} option-icon"></i><p class="option-label">${text}</p>`;
    opts.appendChild(o);
  }

  pv.append(mark, opts);

  const label = document.createElement("span");
  label.className = "card-name";
  label.textContent = NAMES[name] || name;

  card.append(pv, label);
  card.addEventListener("click", () => select(name));
  return card;
}

function select(name) {
  selected = name;
  grid.querySelectorAll(".card").forEach((c) => c.classList.toggle("selected", c.dataset.design === name));
}

export function openEditor(current, designs) {
  saved = current || "gta6";
  grid.innerHTML = "";
  (designs || Object.keys(NAMES)).forEach((d) => grid.appendChild(preview(d)));
  applyDesign("gta6"); // keep the page neutral so each preview card shows only its own design
  prevVisibility = body.style.visibility || "hidden";
  body.style.visibility = "visible";
  editor.classList.add("open");
  select(saved);
}

function close(save) {
  editor.classList.remove("open");
  body.style.visibility = prevVisibility;
  if (save) {
    saved = selected;
    applyDesign(saved);
    fetchNui("saveDesign", { design: selected });
  } else {
    applyDesign(saved);
  }
  fetchNui("closeEditor", {});
}

export function initEditor() {
  document.getElementById("editor-save").addEventListener("click", () => close(true));
  document.getElementById("editor-cancel").addEventListener("click", () => close(false));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && editor.classList.contains("open")) close(false);
  });
}
