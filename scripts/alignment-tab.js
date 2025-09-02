export function ensureAlignmentTab(html) {
  // Use the app argument (sheet instance) to get the actor
  let actor = null;
  if (arguments.length > 1 && arguments[1] && arguments[1].actor) {
    actor = arguments[1].actor;
  } else if (window.actor) {
    actor = window.actor;
  }
  const tabs = html[0].querySelector(".sheet-content");
  if (tabs && !tabs.querySelector(".tab[data-tab='alignment']")) {
    const alignmentTab = createAlignmentTab(actor);
    tabs.appendChild(alignmentTab);
  }

  // If a flag is set, activate the alignment tab after render
  if (sessionStorage.getItem('alignment-tab-keep-active')) {
    const nav = html[0].querySelector("nav.sheet-navigation[data-group='primary']");
    const tabButton = nav && nav.querySelector("a[data-tab='alignment']");
    const tabContent = html[0].querySelector(".tab[data-tab='alignment']");
    if (tabButton && tabContent) {
      // Deactivate all tabs
      nav.querySelectorAll('a.item').forEach(a => a.classList.remove('active'));
      html[0].querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      // Activate alignment tab
      tabButton.classList.add('active');
      tabContent.classList.add('active');
    }
    sessionStorage.removeItem('alignment-tab-keep-active');
  }
}
// alignmentTab.js
// Handles the creation and content of the Alignment tab in the character sheet.

export function createAlignmentTab(actor) {
  const alignmentTab = document.createElement("div");
  alignmentTab.className = "tab";
  alignmentTab.dataset.tab = "alignment";
  // Get the actor from the sheet context
  let history = [];
  let alignmentValues = { law: 14, moral: 14 };

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
  // Add style for subtle line between history entries
  if (!document.getElementById('alignment-history-entry-style')) {
    const style = document.createElement('style');
    style.id = 'alignment-history-entry-style';
    style.textContent = `
      .alignment-history-list .alignment-history-entry {
        padding: 0.2em 0.3em;
        border-bottom: 1px solid #e0dbe7;
      }
      .alignment-history-list .alignment-history-entry:last-child {
        border-bottom: none;
      }
    `;
    document.head.appendChild(style);
  }

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
      <div class="alignment-tab-left" style="min-width: 255px; flex: 0 0 255px; padding: 1em; box-sizing: border-box; position: relative;">
        <div style="position: relative; width: 225px; height: 225px; margin: 0 auto;">
          <span style="position: absolute; left: -38px; top: 50%; transform: translateY(-50%) rotate(-90deg); font-size: 0.85em; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;">LAWFUL</span>
          <span style="position: absolute; right: -44px; top: 50%; transform: translateY(-50%) rotate(90deg); font-size: 0.85em; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;">CHAOTIC</span>
          <span style="position: absolute; left: 50%; top: -12px; transform: translateX(-50%); font-size: 0.85em; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;">GOOD</span>
          <span style="position: absolute; left: 50%; bottom: -18px; transform: translateX(-50%); font-size: 0.85em; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;">EVIL</span>
          <canvas id="alignment-canvas" width="225" height="225" style="background:#f5eaff;border:2px dashed #bbb;display:block;"></canvas>
        </div>
  <div style="font-size:1.1em;margin-top:1.5em;"><strong>Alignment</strong></div>
        <div>Laws: <strong>${lawToWord(alignmentValues.law)}</strong></div>
        <div>Morals: <strong>${moralToWord(alignmentValues.moral)}</strong></div>
      </div>
      <div class="alignment-tab-right" style="flex: 1 1 0; padding: 1em; box-sizing: border-box;">
        <div style="display: flex; flex-direction: column; height: 320px;">
          <h3 class="alignment-history-header" style="flex: 0 0 auto;">Alignment History</h3>
          <div class="alignment-history-list" style="flex: 1 1 0; min-height: 0; overflow-y: auto; border: 1px solid #eee; border-radius: 4px; background: transparent; padding: 0.5em;">
            ${historyHtml}
          </div>
        </div>
      </div>
    </div>
    
      <div class="alignment-tab-modify" style="margin-top:2em; padding: 1em; border-top: 1px solid #ccc;">
  <h3 style="margin-top:0;">Modify alignment</h3>
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
          <span style="flex:1 1 auto;"></span>
          <button id="alignment-config-btn" type="button" title="Configure starting alignment" style="width:2em;">
            <span style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;">
              <svg viewBox="0 0 20 20" width="18" height="18" style="display:block;margin:auto;" aria-hidden="true">
                <circle cx="10" cy="10" r="8" stroke="#222" stroke-width="2" fill="none"/>
                <path d="M10 5v2M10 13v2M5 10h2M13 10h2M7.5 7.5l1 1M11.5 11.5l1 1M7.5 12.5l1-1M11.5 8.5l1-1" stroke="#222" stroke-width="1.4" fill="none"/>
              </svg>
            </span>
          </button>
        </div>
        <label for="alignment-info-input"><strong>Info:</strong></label>
        <input id="alignment-info-input" type="text" style="width: 100%; margin-bottom: 0.5em;" placeholder="Describe alignment change..." />
        <button id="alignment-add-btn" style="display: block; margin-top: 0.5em;">Add Alignment Change</button>

        <!-- Modal for starting alignment config -->
        <div id="alignment-config-modal" style="display:none; position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); z-index:10000; background:#fff; border:2px solid #888; border-radius:8px; box-shadow:0 2px 16px #0003; padding:1.5em; min-width:260px;">
          <div style="margin-bottom:0.5em; font-weight:bold;">Set Starting Alignment</div>
          <div style="color:#b00; background:#fff0f0; border:1px solid #b00; border-radius:4px; padding:0.5em 0.7em; margin-bottom:1em; font-size:1.1em; text-align:center; font-weight:bold;">This action will reset any alignment history you have!</div>
          <select id="alignment-preset-select" style="width:100%; margin-bottom:1em;">
            <option value="">Select...</option>
            <option value="Lawful Good">Lawful Good</option>
            <option value="Lawful Neutral">Lawful Neutral</option>
            <option value="Lawful Evil">Lawful Evil</option>
            <option value="Neutral Good">Neutral Good</option>
            <option value="Neutral Neutral">Neutral Neutral</option>
            <option value="Neutral Evil">Neutral Evil</option>
            <option value="Chaotic Good">Chaotic Good</option>
            <option value="Chaotic Neutral">Chaotic Neutral</option>
            <option value="Chaotic Evil">Chaotic Evil</option>
          </select>
          <button id="alignment-preset-set-btn" style="width:100%;">Set Starting Alignment</button>
          <button id="alignment-preset-cancel-btn" style="width:100%; margin-top:0.5em;">Cancel</button>
        </div>
      </div>
      `;

  // Draw the grid and marker after the tab is in the DOM
  setTimeout(() => {
  // --- Config modal logic ---
  const configBtn = alignmentTab.querySelector('#alignment-config-btn');
  const configModal = alignmentTab.querySelector('#alignment-config-modal');
  const presetSelect = alignmentTab.querySelector('#alignment-preset-select');
  const presetSetBtn = alignmentTab.querySelector('#alignment-preset-set-btn');
  const presetCancelBtn = alignmentTab.querySelector('#alignment-preset-cancel-btn');

  if (configBtn && configModal) {
    configBtn.addEventListener('click', () => {
      configModal.style.display = 'block';
    });
  }
  if (presetCancelBtn && configModal) {
    presetCancelBtn.addEventListener('click', () => {
      configModal.style.display = 'none';
      presetSelect.value = '';
    });
  }
  if (presetSetBtn && presetSelect) {
    presetSetBtn.addEventListener('click', async () => {
      const preset = presetSelect.value;
      const presetMap = {
        'Lawful Good':   { law: 37, moral: 37 },
        'Lawful Neutral':{ law: 37, moral: 22 },
        'Lawful Evil':   { law: 37, moral: 7 },
        'Neutral Good':  { law: 22, moral: 37 },
        'Neutral Neutral':{ law: 22, moral: 22 },
        'Neutral Evil':  { law: 22, moral: 7 },
        'Chaotic Good':  { law: 7,  moral: 37 },
        'Chaotic Neutral':{ law: 7,  moral: 22 },
        'Chaotic Evil':  { law: 7,  moral: 7 }
      };
      if (preset && presetMap[preset]) {
        if (actor) {
          await actor.setFlag('alignment-tab', 'alignmentValues', { ...presetMap[preset] });
          // Add history entry for setting starting alignment
          await actor.setFlag('alignment-tab', 'history', [
            `You set starting alignment to ${preset}`
          ]);
          sessionStorage.setItem('alignment-tab-keep-active', '1');
          let appElementForRender = alignmentTab.closest('.app');
          if (appElementForRender && appElementForRender.app && typeof appElementForRender.app.render === 'function') {
            appElementForRender.app.render(false);
          }
        }
        configModal.style.display = 'none';
        presetSelect.value = '';
      }
    });
  }
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
      // Fill each cell with interpolated color (intense red/gray/green)
      for (let law = 0; law < 45; law++) {
        for (let moral = 0; moral < 45; moral++) {
          // Calculate color: interpolate from red (0,0) through gray (21,21) to green (44,44)
          // Red: (255,0,0), Gray: (180,180,180), Green: (0,128,0)
          // Interpolate law axis (horizontal)
          let tLaw = law / 44;
          let tMoral = moral / 44;
          // Interpolate to gray at center, then to green at max
          function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
          // First, interpolate red to gray, then gray to green
          let r, g, b;
          if (tLaw < 0.5) {
            // Red to gray
            let t = tLaw * 2;
            r = lerp(255, 180, t);
            g = lerp(0, 180, t);
            b = lerp(0, 180, t);
          } else {
            // Gray to green
            let t = (tLaw - 0.5) * 2;
            r = lerp(180, 0, t);
            g = lerp(180, 128, t);
            b = lerp(180, 0, t);
          }
          // Now blend with moral axis: blend with same logic, then average
          let r2, g2, b2;
          if (tMoral < 0.5) {
            let t = tMoral * 2;
            r2 = lerp(255, 180, t);
            g2 = lerp(0, 180, t);
            b2 = lerp(0, 180, t);
          } else {
            let t = (tMoral - 0.5) * 2;
            r2 = lerp(180, 0, t);
            g2 = lerp(180, 128, t);
            b2 = lerp(180, 0, t);
          }
          // Mix both axes (average)
          let rf = Math.round((r + r2) / 2);
          let gf = Math.round((g + g2) / 2);
          let bf = Math.round((b + b2) / 2);
          ctx.fillStyle = `rgb(${rf},${gf},${bf})`;
          // (0,0) is right bottom
          let x = 220 - law * 5;
          let y = 225 - (moral+1)*5;
          ctx.fillRect(x, y, 5, 5);
        }
      }
      // Draw big grid (3x3, thick lines, each 75x75) with lighter color
      ctx.strokeStyle = '#bbb';
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
     console.log('[alignment-tab] Drawing marker with alignmentValues:', alignmentValues);
      let law = Math.max(0, Math.min(44, alignmentValues.law));
      let moral = Math.max(0, Math.min(44, alignmentValues.moral));
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
      let lawDeltaVal = alignmentTab.querySelector('#law-delta').textContent.trim();
      let moralDeltaVal = alignmentTab.querySelector('#moral-delta').textContent.trim();
      let lawDeltaNum = parseInt(lawDeltaVal) || 0;
      let moralDeltaNum = parseInt(moralDeltaVal) || 0;
      // Prevent adding if info is empty or both deltas are zero
      if (!info || (lawDeltaNum === 0 && moralDeltaNum === 0)) return;
      // Use the actor passed to the tab
      let history = [];
      let alignmentValues = { law: 0, moral: 0 };
      let entry = info;
      // Only add delta info if nonzero, and format as in the examples
      let deltaStr = [];
      if (lawDeltaNum !== 0) deltaStr.push(`${lawDeltaNum > 0 ? '+' : ''}${lawDeltaNum} law${Math.abs(lawDeltaNum) === 1 ? '' : 's'}`);
      if (moralDeltaNum !== 0) deltaStr.push(`${moralDeltaNum > 0 ? '+' : ''}${moralDeltaNum} moral${Math.abs(moralDeltaNum) === 1 ? '' : 's'}`);
      if (deltaStr.length > 0) {
        entry += ` (${deltaStr.join(', ')})`;
      }

      if (actor) {
        history = actor.getFlag("alignment-tab", "history") || [];
        history = Array.isArray(history) ? history : [];
        // Get and update alignment values
        alignmentValues = actor.getFlag("alignment-tab", "alignmentValues") || { law: 0, moral: 0 };
        // Update values and clamp to [0,44]
        alignmentValues.law = Math.max(0, Math.min(44, alignmentValues.law + lawDeltaNum));
        alignmentValues.moral = Math.max(0, Math.min(44, alignmentValues.moral + moralDeltaNum));
        // Log updated values and deltas before any async/await or re-render
        console.log('[alignment-tab] Updated alignmentValues after change:', alignmentValues, 'Deltas:', lawDeltaNum, moralDeltaNum);
        // Save updated values
        await actor.setFlag("alignment-tab", "alignmentValues", alignmentValues);
        // Save new history entry
        history = [...history, entry];
        await actor.setFlag("alignment-tab", "history", history);
      } else {
        // fallback: update in-memory if no actor
        history = window._alignmentHistory = (window._alignmentHistory || []);
        history.push(entry);
        // Not updating alignmentValues in-memory fallback
      }
      // Update UI: add to history list
      const historyList = alignmentTab.querySelector(".alignment-history-list");
      if (historyList) {
        const entryDiv = document.createElement("div");
        entryDiv.className = "alignment-history-entry";
        entryDiv.textContent = entry;
        historyList.appendChild(entryDiv);
      }
      infoInput.value = "";
      // Always reset deltas in UI after adding
      alignmentTab.querySelector('#law-delta').textContent = '0';
      alignmentTab.querySelector('#moral-delta').textContent = '0';
      // Set a flag to keep the alignment tab active after re-render
      sessionStorage.setItem('alignment-tab-keep-active', '1');
      // Re-render the character sheet app to update the alignment tab
      let appElementForRender = alignmentTab.closest('.app');
      if (appElementForRender && appElementForRender.app && typeof appElementForRender.app.render === 'function') {
        appElementForRender.app.render(false);
      }
    });
  }
  }, 0);
  return alignmentTab;
}
