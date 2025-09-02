// alignment-view.js
// Displays all players' alignment values on a shared grid in the Alignment Tab module.
// This file will provide a function to render a shared alignment grid with markers for each player.

export function renderSharedAlignmentGrid(playersAlignments, container) {
  // Clear container
  container.innerHTML = '';
  // Create wrapper for labels and canvas
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  // Double grid size
  const gridSize = 450; // 225 * 2
  wrapper.style.width = gridSize + 'px';
  wrapper.style.height = gridSize + 'px';
  wrapper.style.margin = '0 32px 0 32px'; // More space left/right of grid
  // Make axis labels 50% bigger
  const labelFontSize = '1.275em'; // 0.85em * 1.5
  const labelStyle = `position: absolute; font-size: ${labelFontSize}; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;`;
  const labelL = document.createElement('span');
  labelL.style = labelStyle + 'left: -48px; top: 50%; transform: translateY(-50%) rotate(-90deg);';
  labelL.textContent = 'LAWFUL';
  wrapper.appendChild(labelL);
  const labelC = document.createElement('span');
  labelC.style = labelStyle + 'right: -54px; top: 50%; transform: translateY(-50%) rotate(90deg);';
  labelC.textContent = 'CHAOTIC';
  wrapper.appendChild(labelC);
  const labelG = document.createElement('span');
  labelG.style = labelStyle + 'left: 50%; top: -18px; transform: translateX(-50%);';
  labelG.textContent = 'GOOD';
  wrapper.appendChild(labelG);
  const labelE = document.createElement('span');
  labelE.style = labelStyle + 'left: 50%; bottom: -22px; transform: translateX(-50%);';
  labelE.textContent = 'EVIL';
  wrapper.appendChild(labelE);
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = gridSize;
  canvas.height = gridSize;
  canvas.style.background = '#f5eaff';
  canvas.style.border = '2px dashed #bbb';
  canvas.style.display = 'block';
  wrapper.appendChild(canvas);
  container.appendChild(wrapper);
  // Draw background image and grid
  const ctx = canvas.getContext('2d');
  const img = new window.Image();
  img.onload = function() {
    ctx.clearRect(0, 0, gridSize, gridSize);
    ctx.drawImage(img, 0, 0, gridSize, gridSize);
    // Draw big grid (3x3, thick lines, each 150x150)
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 3; i++) {
      // vertical big lines
      ctx.beginPath();
      ctx.moveTo(i*150, 0);
      ctx.lineTo(i*150, gridSize);
      ctx.stroke();
      // horizontal big lines
      ctx.beginPath();
      ctx.moveTo(0, gridSize-i*150);
      ctx.lineTo(gridSize, gridSize-i*150);
      ctx.stroke();
    }
    // Draw player markers (adjusted for new grid size)
    // For hover tooltips, store marker positions and info
    const markerInfos = [];
    players.forEach(player => {
      if (typeof player.law === 'number' && typeof player.moral === 'number') {
        let law = Math.max(0, Math.min(44, player.law));
        let moral = Math.max(0, Math.min(44, player.moral));
        let x = gridSize-10 - law * 10 + 5;
        let y = gridSize - (moral+1)*10 + 5;
        ctx.save();
        // Thin black outline around white halo
        ctx.beginPath();
        ctx.arc(x, y, 15.5, 0, 2 * Math.PI, false);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#111';
        ctx.shadowBlur = 0;
        ctx.stroke();
        // Outer thick white border (halo) with drop shadow
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI, false);
        ctx.lineWidth = 7;
        ctx.strokeStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        // Colored ring (thicker, more saturated)
        ctx.beginPath();
        ctx.arc(x, y, 10.8, 0, 2 * Math.PI, false);
        ctx.lineWidth = 8;
        ctx.strokeStyle = shadeColor(player.color, -10); // slightly more saturated
        ctx.stroke();
        // Fill center with color
        ctx.beginPath();
        ctx.arc(x, y, 7.2, 0, 2 * Math.PI, false);
        ctx.fillStyle = player.color;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
        // Store marker info for hover
        markerInfos.push({
          x, y, r: 15.5, // use outer radius for hit test
          name: player.name,
          alignment: `(${lawToWord(player.law)} ${moralToWord(player.moral)})`,
          color: player.color
        });
      }
    });
    // Tooltip div
    let tooltip = container.querySelector('.alignment-marker-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'alignment-marker-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.background = 'rgba(30,30,30,0.97)';
      tooltip.style.color = '#fff';
      tooltip.style.padding = '6px 12px';
      tooltip.style.borderRadius = '6px';
      tooltip.style.fontSize = '1.1em';
      tooltip.style.fontWeight = 'bold';
      tooltip.style.zIndex = 1000;
      tooltip.style.display = 'none';
      container.appendChild(tooltip);
    }
    // Mouse move handler for hover
    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found = null;
      for (const info of markerInfos) {
        const dx = mx - info.x;
        const dy = my - info.y;
        if (dx*dx + dy*dy <= info.r*info.r) {
          found = info;
          break;
        }
      }
      if (found) {
        tooltip.textContent = `${found.name} ${found.alignment}`;
        tooltip.style.visibility = 'hidden';
        tooltip.style.display = 'block';
        // Position tooltip just above and centered on the marker, relative to the window
        const canvasRect = canvas.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const tooltipLeft = canvasRect.left + found.x - tooltip.offsetWidth / 2;
        const tooltipTop = canvasRect.top + found.y - found.r - 6;
        tooltip.style.position = 'fixed';
        tooltip.style.left = tooltipLeft + 'px';
        tooltip.style.top = tooltipTop + 'px';
        tooltip.style.visibility = 'visible';
      } else {
        tooltip.style.display = 'none';
      }
    };
    canvas.onmouseleave = () => { tooltip.style.display = 'none'; tooltip.style.position = 'absolute'; };
  };
  img.src = 'modules/alignment-tab/assets/grid_background.png';

  // Create a flex row to hold grid and legend side by side
  const flexRow = document.createElement('div');
  flexRow.style.display = 'flex';
  flexRow.style.flexDirection = 'row';
  flexRow.style.alignItems = 'flex-start';
  flexRow.style.padding = '16px'; // Add space around the whole content
  flexRow.appendChild(wrapper);

  // Legend (now on the right)
  const legend = document.createElement('div');
  legend.style.marginLeft = '36px';
  legend.style.padding = '18px 18px';
  legend.style.display = 'flex';
  legend.style.flexDirection = 'column';
  legend.style.alignItems = 'flex-start';
  // Example players (replace with real data later)
  const players = playersAlignments.length ? playersAlignments : [
    { name: 'Alice', color: '#e74c3c' },
    { name: 'Bob', color: '#3498db' },
    { name: 'Cara', color: '#27ae60' }
  ];
  players.forEach(player => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '10px'; // More space between player names
    // Marker
    const marker = document.createElement('span');
    marker.style.display = 'inline-block';
    marker.style.width = '18px';
    marker.style.height = '18px';
    marker.style.borderRadius = '50%';
    marker.style.background = player.color;
    marker.style.border = '2px solid #222';
    marker.style.marginRight = '8px';
    row.appendChild(marker);
    // Name
    const name = document.createElement('span');
    name.textContent = player.name;
    // Alignment words
    if (typeof player.law === 'number' && typeof player.moral === 'number') {
      const alignStr = ` (${lawToWord(player.law)} ${moralToWord(player.moral)})`;
      name.textContent += alignStr;
    }
    row.appendChild(name);
    legend.appendChild(row);
  });
  flexRow.appendChild(legend);
  container.appendChild(flexRow);
}

export function openAlignmentGridWindow() {
  // Gather player character data from the game
  const playersAlignments = game.actors
    .filter(actor => actor.hasPlayerOwner && actor.type === 'character')
    .map((actor, idx) => {
      // Try to get alignment values from flags, fallback to center
      const alignmentValues = actor.getFlag('alignment-tab', 'alignmentValues') || { law: 22, moral: 22 };
      // Assign a color (cycle through a palette)
      const palette = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#16a085', '#e67e22', '#34495e'];
      return {
        name: actor.name,
        color: palette[idx % palette.length],
        law: alignmentValues.law,
        moral: alignmentValues.moral
      };
    });

  class AlignmentGridApp extends Application {
    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        id: "alignment-grid-app",
        title: "Alignment Grid",
        template: null,
        width: 900, // double the width
        height: 600, // double the height
        resizable: false,
        popOut: true,
      });
    }
    getData() { return {}; }
    async _renderInner(data, options) {
      const $div = $(`<div id='alignment-grid-container' style='width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;'></div>`);
      setTimeout(() => {
        const container = $div[0];
        if (container) renderSharedAlignmentGrid(playersAlignments, container);
      }, 0);
      return $div;
    }
  }
  new AlignmentGridApp().render(true);
}

// Utility to darken a hex color
function shadeColor(color, percent) {
  let f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent;
  let R = f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+
    (Math.round((t-R)*p/100)+R)*0x10000+
    (Math.round((t-G)*p/100)+G)*0x100+
    (Math.round((t-B)*p/100)+B)).toString(16).slice(1);
}

// Helper functions to translate law/moral values to words
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
