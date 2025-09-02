import { ensureAlignmentTab } from "./alignment-tab.js";
import { openAlignmentGridWindow } from "./alignment-view.js";
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
  ensureAlignmentTab(html, app);
});

// Add a button to the Journal Notes controls submenu (sidebar)
Hooks.on('getSceneControlButtons', controls => {
  const notes = controls.find(c => c.name === 'notes');
  if (notes && notes.tools) {
    notes.tools.push({
      name: 'alignment-view',
      title: 'Alignment Grid',
      icon: 'fa-solid fa-scale-balanced', // balance scale icon for alignment
      visible: true,
      onClick: () => {
        openAlignmentGridWindow();
      },
      button: true
    });
  }
});