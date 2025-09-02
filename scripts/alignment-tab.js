export function ensureAlignmentTab(html) {
  const tabs = html[0].querySelector(".sheet-content");
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

  // Try to get the actor from the sheet context
  let actor = null;
  // Find the closest element with .app and get its app reference
  let appElement = null;
  if (typeof html !== "undefined" && html[0]) {
    appElement = html[0].closest('.app');
    if (appElement && appElement.app && appElement.app.actor) {
      actor = appElement.app.actor;
    }
  }
  // Get the actor from the sheet context
  // Sample history
  const sampleHistory = [
    "John moved to +1 righteous",
    "Jane moved to -1 evil",
    "Alex moved to +2 good",
    "Sam moved to -1 chaotic",
    "Chris moved to +1 lawful",
    "Morgan moved to +1 neutral",
    "Taylor moved to -2 evil",
    "Jordan moved to +1 good",
    "Casey moved to -1 neutral",
    "Riley moved to +1 righteous"
  ];

  // Sample alignment values
  const sampleAlignmentValues = { law: 14, moral: 14 };

  // Save to flags if actor is available
  if (actor) {
    actor.setFlag("alignment-tab", "history", sampleHistory);
    actor.setFlag("alignment-tab", "alignmentValues", sampleAlignmentValues);
  }

  // Try to get history from flags (sync fallback to sample if not found)
  let history = sampleHistory;
  let alignmentValues = sampleAlignmentValues;
  if (actor) {
    const flagHistory = actor.getFlag("alignment-tab", "history");
    if (Array.isArray(flagHistory) && flagHistory.length > 0) {
      history = flagHistory;
    }
    const flagAlignmentValues = actor.getFlag("alignment-tab", "alignmentValues");
    if (flagAlignmentValues && typeof flagAlignmentValues === "object") {
      alignmentValues = flagAlignmentValues;
    }
  }

  // Render history entries
  const historyHtml = history.map(entry => `<div class=\"alignment-history-entry\">${entry}</div>`).join("");

  // Translate law and moral values to words
  function lawToWord(val) {
    if (val >= 0 && val <= 14) return "chaotic";
    if (val >= 15 && val <= 29) return "neutral";
    if (val >= 30 && val <= 44) return "lawful";
    return "?";
  }
  function moralToWord(val) {
    if (val >= 0 && val <= 14) return "evil";
    if (val >= 15 && val <= 29) return "neutral";
    if (val >= 30 && val <= 44) return "good";
    return "?";
  }

  alignmentTab.innerHTML = `
    <div class="alignment-tab-sections" style="display: flex; flex-direction: row; width: 100%;">
      <div class="alignment-tab-left" style="min-width: 255px; flex: 0 0 255px; padding: 1em; box-sizing: border-box; border-right: 1px solid #ccc;">
        <canvas id="alignment-canvas" width="225" height="225" style="background:#f5eaff;border:2px dashed #bbb;display:block;"></canvas>
        <div style="font-size:1.1em;margin-top:0.5em;"><strong>Alignment</strong></div>
        <div>Laws: <strong>${lawToWord(alignmentValues.law)}</strong></div>
        <div>Morals: <strong>${moralToWord(alignmentValues.moral)}</strong></div>
      </div>
      <div class="alignment-tab-right" style="flex: 1 1 0; padding: 1em; box-sizing: border-box;">
        <h3 class="alignment-history-header">Alignment History</h3>
        <div class="alignment-history-list">
          ${historyHtml}
        </div>
      </div>
    </div>
    
      <div class="alignment-tab-modify" style="margin-top:2em; padding: 1em; border-top: 1px solid #ccc;">
        <h3>Modify alignment</h3>
        <div style="display: flex; align-items: center; gap: 0.5em; margin-top: 1em;">
          <span><strong>Laws:</strong></span>
          <button id="law-plus" type="button" style="width:2em;">+</button>
          <span id="law-delta" style="min-width:2em;display:inline-block;text-align:center;">0</span>
          <button id="law-minus" type="button" style="width:2em;">-</button>
          <span style="margin: 0 1em; color: #bbb;">|</span>
          <span><strong>Morals:</strong></span>
          <button id="moral-plus" type="button" style="width:2em;">+</button>
          <span id="moral-delta" style="min-width:2em;display:inline-block;text-align:center;">0</span>
          <button id="moral-minus" type="button" style="width:2em;">-</button>
        </div>
        <label for="alignment-info-input"><strong>Info:</strong></label>
        <input id="alignment-info-input" type="text" style="width: 100%; margin-bottom: 0.5em;" placeholder="Describe alignment change..." />
        <button id="alignment-add-btn" style="display: block; margin-top: 0.5em;">Add Alignment Change</button>
      </div>
      `;

  // Draw the grid and marker after the tab is in the DOM
  setTimeout(() => {
    // --- Law/Moral delta logic ---
    let lawDelta = 0;
    let moralDelta = 0;
    const lawDeltaSpan = alignmentTab.querySelector('#law-delta');
    const moralDeltaSpan = alignmentTab.querySelector('#moral-delta');
    const lawPlus = alignmentTab.querySelector('#law-plus');
    const lawMinus = alignmentTab.querySelector('#law-minus');
    const moralPlus = alignmentTab.querySelector('#moral-plus');
    const moralMinus = alignmentTab.querySelector('#moral-minus');
    function updateDeltaDisplay() {
      lawDeltaSpan.textContent = lawDelta > 0 ? `+${lawDelta}` : lawDelta < 0 ? `${lawDelta}` : '0';
      moralDeltaSpan.textContent = moralDelta > 0 ? `+${moralDelta}` : moralDelta < 0 ? `${moralDelta}` : '0';
    }
    if (lawPlus) lawPlus.addEventListener('click', () => { lawDelta++; updateDeltaDisplay(); });
    if (lawMinus) lawMinus.addEventListener('click', () => { lawDelta--; updateDeltaDisplay(); });
    if (moralPlus) moralPlus.addEventListener('click', () => { moralDelta++; updateDeltaDisplay(); });
    if (moralMinus) moralMinus.addEventListener('click', () => { moralDelta--; updateDeltaDisplay(); });
    updateDeltaDisplay();
    const canvas = alignmentTab.querySelector('#alignment-canvas');
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      // Draw big grid (3x3, thick lines, each 75x75)
      ctx.strokeStyle = '#b48be0';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 3; i++) {
        // vertical big lines
        ctx.beginPath();
        ctx.moveTo(i*75, 0);
        ctx.lineTo(i*75, 225);
        ctx.stroke();
        // horizontal big lines
        ctx.beginPath();
        ctx.moveTo(0, 225-i*75);
        ctx.lineTo(225, 225-i*75);
        ctx.stroke();
      }
      // Draw marker for (law, moral) on a 45x45 grid
      // Clamp values to [0,44]
      let law = Math.max(0, Math.min(44, alignmentValues.law));
      let moral = Math.max(0, Math.min(44, alignmentValues.moral));
      // (0,0) is right bottom, so x is flipped
      let x = 220 - law * 5;
      let y = 225 - (moral+1)*5;
      ctx.fillStyle = '#111';
      ctx.fillRect(x, y, 5, 5);
    }

    // Add event listener for the Add Alignment Change button (scoped to this tab)
    const addBtn = alignmentTab.querySelector("#alignment-add-btn");
    const infoInput = alignmentTab.querySelector("#alignment-info-input");
    if (addBtn && infoInput) {
      addBtn.addEventListener("click", async () => {
        const info = infoInput.value.trim();
        if (!info) return;
        // Get actor from closest .app
        let actor = null;
        let appElement = alignmentTab.closest('.app');
        if (appElement && appElement.app && appElement.app.actor) {
          actor = appElement.app.actor;
        }
        // Fallback: try window.actor if available
        if (!actor && window.actor) actor = window.actor;
        // Get current history
        let history = [];
        if (actor) {
          history = actor.getFlag("alignment-tab", "history") || [];
          history = Array.isArray(history) ? history : [];
          history = [...history, info];
          await actor.setFlag("alignment-tab", "history", history);
        } else {
          // fallback: update in-memory if no actor
          history = window._alignmentHistory = (window._alignmentHistory || []);
          history.push(info);
        }
        // Update UI: add to history list
        const historyList = alignmentTab.querySelector(".alignment-history-list");
        if (historyList) {
          const entryDiv = document.createElement("div");
          entryDiv.className = "alignment-history-entry";
          entryDiv.textContent = info;
          historyList.appendChild(entryDiv);
        }
        infoInput.value = "";
      });
    }
  }, 0);
  return alignmentTab;
}
