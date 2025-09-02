export function ensureAlignmentTab(html) {
  const tabs = html[0].querySelector("section.sheet-body .tab-panels");
  if (tabs && !tabs.querySelector(".tab[data-tab='alignment']")) {
    const alignmentTab = createAlignmentTab();
    tabs.appendChild(alignmentTab);
  }
}
// alignmentTab.js
// Handles the creation and content of the Alignment tab in the character sheet.

export function createAlignmentTab() {
  const alignmentTab = document.createElement("div");
  alignmentTab.className = "tab";
  alignmentTab.dataset.tab = "alignment";
  alignmentTab.innerHTML = '<div class="custom-tab-content">work!</div>';
  return alignmentTab;
}
