import { ensureAlignmentTab } from "./alignment-tab.js";
console.log("[alignment-tab] tabbutton.js loaded");
Hooks.on("renderCharacterSheetPF2e", (app, html, data) => {
  // Find the navigation bar
  const nav = html[0].querySelector("nav.sheet-navigation[data-group='primary']");
  if (nav) {
    // Find Effects tab
    const effectsTab = nav.querySelector("a[data-tab='effects']");
  if (effectsTab && !nav.querySelector("a[data-tab='alignment']")) {
      // Create new button
      const newButton = document.createElement("a");
      newButton.className = "item";
      newButton.dataset.tab = "alignment";
      newButton.dataset.tooltip = "Alignment";
      newButton.setAttribute("role", "tab");
      newButton.setAttribute("aria-label", "Alignment");
      newButton.innerHTML = '<i class="fa-solid fa-star"></i>';
      effectsTab.insertAdjacentElement("afterend", newButton);
    }
  }
  // Add custom tab content if not already present
  ensureAlignmentTab(html);
});
