console.log("[alignment-tab] main.js loaded");
Hooks.on("renderCharacterSheetPF2e", (app, html, data) => {
  // Find the navigation bar
  const nav = html[0].querySelector("nav.sheet-navigation[data-group='primary']");
  if (nav) {
    // Find Effects tab
    const effectsTab = nav.querySelector("a[data-tab='effects']");
    if (effectsTab && !nav.querySelector("a[data-tab='custombutton']")) {
      // Create new button
      const newButton = document.createElement("a");
      newButton.className = "item";
      newButton.dataset.tab = "custombutton";
      newButton.dataset.tooltip = "Custom Button";
      newButton.setAttribute("role", "tab");
      newButton.setAttribute("aria-label", "Custom Button");
      newButton.innerHTML = '<i class="fa-solid fa-star"></i>';
      effectsTab.insertAdjacentElement("afterend", newButton);
    }
  }
  // Add custom tab content if not already present
  const tabs = html[0].querySelector("section.sheet-body .tab-panels");
  if (tabs && !tabs.querySelector(".tab[data-tab='custombutton']")) {
    const customTab = document.createElement("div");
    customTab.className = "tab";
    customTab.dataset.tab = "custombutton";
    customTab.innerHTML = '<div class="custom-tab-content">work!</div>';
    tabs.appendChild(customTab);
  }
});
