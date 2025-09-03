// alignment-view.js
import { alignmentAbbreviation } from './alignment-trait-abbrev.js';
// Displays all players' alignment values on a shared grid in the Alignment Tab module.
// This file will provide a function to render a shared alignment grid with markers for each player.

// === CONFIGURABLE GRID SIZE ===
const GRID_SIZE = 300; // Size of the grid in px (default: 450)
const GRID_CELLS = 3; // 3x3 big grid
const GRID_STEPS = 45; // 45x45 fine grid
const CELL_SIZE = GRID_SIZE / GRID_CELLS; // Size of one big cell
const STEP_SIZE = GRID_SIZE / GRID_STEPS; // Size of one fine step
// === MARKER SIZE (change this to affect both grid and legend markers) ===
const MARKER_DIAMETER = 10; // px, change this to set marker size everywhere
const MARKER_OUTER_RADIUS = MARKER_DIAMETER / 2;
const MARKER_RING_RADIUS = MARKER_OUTER_RADIUS * 0.72;  // visually match old ratio
const MARKER_FILL_RADIUS = MARKER_OUTER_RADIUS * 0.48;  // visually match old ratio
const MARKER_OUTLINE = 2; // px, fixed for clarity
const MARKER_RING_WIDTH = 6; // px, fixed for clarity
const MARKER_FONT = `bold ${Math.round(GRID_SIZE * 0.042)}px Arial, sans-serif`;

export function renderSharedAlignmentGrid(playersAlignments, container) {
  // Clear container
  container.innerHTML = '';
  // Create wrapper for labels and canvas
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.width = GRID_SIZE + 'px';
  wrapper.style.height = GRID_SIZE + 'px';
  wrapper.style.margin = '0 16px 0 8px'; // More space left/right of grid
  // Axis label font size
  const labelFontSize = (GRID_SIZE * 0.038) + 'px';
  const labelStyle = `position: absolute; font-size: ${labelFontSize}; color: #555; letter-spacing: 0.1em; font-weight: bold; white-space:nowrap;`;
  const labelL = document.createElement('span');
  labelL.style = labelStyle + `left: -30px; top: 50%; transform: translateY(-50%) rotate(-90deg);`;
  labelL.textContent = 'LAWFUL';
  wrapper.appendChild(labelL);
  const labelC = document.createElement('span');
  labelC.style = labelStyle + `right: -36px; top: 50%; transform: translateY(-50%) rotate(90deg);`;
  labelC.textContent = 'CHAOTIC';
  wrapper.appendChild(labelC);
  const labelG = document.createElement('span');
  labelG.style = labelStyle + `left: 50%; top: -10px; transform: translateX(-50%);`;
  labelG.textContent = 'GOOD';
  wrapper.appendChild(labelG);
  const labelE = document.createElement('span');
  labelE.style = labelStyle + `left: 50%; bottom: -16px; transform: translateX(-50%);`;
  labelE.textContent = 'EVIL';
  wrapper.appendChild(labelE);
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = GRID_SIZE;
  canvas.height = GRID_SIZE;
  canvas.style.background = '#f5eaff';
  canvas.style.border = '2px dashed #bbb';
  canvas.style.display = 'block';
  wrapper.appendChild(canvas);
  container.appendChild(wrapper);
  // Track highlighted player for legend hover
  let highlightedPlayerName = null;
  // Draw background image and grid
  const ctx = canvas.getContext('2d');
  const img = new window.Image();
  img.onload = function() {
    ctx.clearRect(0, 0, GRID_SIZE, GRID_SIZE);
    ctx.drawImage(img, 0, 0, GRID_SIZE, GRID_SIZE);
    // Draw big grid (3x3, thick lines)
    ctx.strokeStyle = '#bbb';
    ctx.lineWidth = 2;
    for (let i = 0; i <= GRID_CELLS; i++) {
      // vertical big lines
      ctx.beginPath();
      ctx.moveTo(i*CELL_SIZE, 0);
      ctx.lineTo(i*CELL_SIZE, GRID_SIZE);
      ctx.stroke();
      // horizontal big lines
      ctx.beginPath();
      ctx.moveTo(0, GRID_SIZE-i*CELL_SIZE);
      ctx.lineTo(GRID_SIZE, GRID_SIZE-i*CELL_SIZE);
      ctx.stroke();
    }
    // Draw player markers (adjusted for grid size)
    const markerInfos = [];
    (Array.isArray(playersAlignments) ? playersAlignments : []).forEach(player => {
      if (typeof player.law === 'number' && typeof player.moral === 'number') {
        let law = Math.max(0, Math.min(GRID_STEPS-1, player.law));
        let moral = Math.max(0, Math.min(GRID_STEPS-1, player.moral));
        let x = GRID_SIZE - STEP_SIZE - law * STEP_SIZE + STEP_SIZE/2;
        let y = GRID_SIZE - (moral+1)*STEP_SIZE + STEP_SIZE/2;
        ctx.save();
        // Highlight if this is the hovered legend
        let isHighlight = highlightedPlayerName && player.name === highlightedPlayerName;
        if (isHighlight) {
          // Draw a pointer arrow (triangle) to the marker
          ctx.save();
          ctx.beginPath();
          // Arrow points to the right of the marker
          const arrowLen = MARKER_DIAMETER * 4.4;
          const arrowWidth = MARKER_DIAMETER * 1.8;
          ctx.moveTo(x + MARKER_OUTER_RADIUS + arrowLen, y);
          ctx.lineTo(x + MARKER_OUTER_RADIUS + 2, y - arrowWidth/2);
          ctx.lineTo(x + MARKER_OUTER_RADIUS + 2, y + arrowWidth/2);
          ctx.closePath();
          ctx.fillStyle = '#f39c12';
          ctx.globalAlpha = 0.85;
          ctx.shadowColor = '#f39c12';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
          ctx.restore();
        }
        // Thin black outline around white halo
        ctx.beginPath();
        ctx.arc(x, y, MARKER_OUTER_RADIUS+0.5, 0, 2 * Math.PI, false);
        ctx.lineWidth = MARKER_OUTLINE;
        ctx.strokeStyle = isHighlight ? '#f39c12' : '#111';
        ctx.shadowBlur = isHighlight ? 12 : 0;
        ctx.shadowColor = isHighlight ? '#f39c12' : 'transparent';
        ctx.stroke();
        // Outer thick white border (halo) with drop shadow
        ctx.beginPath();
        ctx.arc(x, y, MARKER_OUTER_RADIUS, 0, 2 * Math.PI, false);
        ctx.lineWidth = MARKER_OUTLINE * 3;
        ctx.strokeStyle = '#fff';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.95;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
        // Colored ring (thicker, more saturated)
        ctx.beginPath();
        ctx.arc(x, y, MARKER_RING_RADIUS, 0, 2 * Math.PI, false);
        ctx.lineWidth = MARKER_RING_WIDTH;
        ctx.strokeStyle = shadeColor(player.color, -10);
        ctx.stroke();
        // Fill center with color
        ctx.beginPath();
        ctx.arc(x, y, MARKER_FILL_RADIUS, 0, 2 * Math.PI, false);
        ctx.fillStyle = player.color;
        ctx.globalAlpha = 0.95;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
        // Store marker info for hover
        markerInfos.push({
          x,
          y,
          r: MARKER_OUTER_RADIUS + (MARKER_OUTLINE * 1.5) + 0.5, // include halo
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
      tooltip.style.position = 'fixed';
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
        // Position tooltip just above and centered on the marker, relative to the canvas
        const canvasRect = canvas.getBoundingClientRect();
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
  flexRow.style.padding = '8px'; // Add space around the whole content
  flexRow.appendChild(wrapper);

  // Legend (now on the right)
  // Scrollable container for legend
  const legendScroll = document.createElement('div');
  legendScroll.style.maxHeight = (GRID_SIZE * 1.1) + 'px'; // slightly taller than grid
  legendScroll.style.overflowY = 'auto';
  legendScroll.style.minWidth = '160px';
  legendScroll.style.flex = '1 1 auto';
  // Actual legend content
  const legend = document.createElement('div');
  legend.style.marginLeft = '0px';
  legend.style.padding = '18px 18px';
  legend.style.display = 'flex';
  legend.style.flexDirection = 'column';
  legend.style.alignItems = 'flex-start';

  (Array.isArray(playersAlignments) ? playersAlignments : []).forEach(player => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '10px';
    // Marker: draw on canvas for perfect match
    const markerCanvas = document.createElement('canvas');
    markerCanvas.width = MARKER_DIAMETER + 12; // extra for outline/halo
    markerCanvas.height = MARKER_DIAMETER + 12;
    markerCanvas.style.display = 'inline-block';
    markerCanvas.style.marginRight = '8px';
    markerCanvas.style.background = 'transparent';
    // Draw marker using same logic as grid
    const mctx = markerCanvas.getContext('2d');
    // Clear canvas to transparent before drawing
    mctx.clearRect(0, 0, markerCanvas.width, markerCanvas.height);
    const cx = markerCanvas.width / 2;
    const cy = markerCanvas.height / 2;
    // Black outline
    mctx.beginPath();
    mctx.arc(cx, cy, MARKER_OUTER_RADIUS+0.5, 0, 2 * Math.PI, false);
    mctx.lineWidth = MARKER_OUTLINE;
    mctx.strokeStyle = '#111';
    mctx.shadowBlur = 0;
    mctx.stroke();
    // White halo
    mctx.beginPath();
    mctx.arc(cx, cy, MARKER_OUTER_RADIUS, 0, 2 * Math.PI, false);
    mctx.lineWidth = MARKER_OUTLINE * 3;
    mctx.strokeStyle = '#fff';
    mctx.shadowColor = '#000';
    mctx.shadowBlur = 8;
    mctx.globalAlpha = 0.95;
    mctx.stroke();
    mctx.globalAlpha = 1.0;
    mctx.shadowBlur = 0;
    // Colored ring
    mctx.beginPath();
    mctx.arc(cx, cy, MARKER_RING_RADIUS, 0, 2 * Math.PI, false);
    mctx.lineWidth = MARKER_RING_WIDTH;
    mctx.strokeStyle = shadeColor(player.color, -10);
    mctx.stroke();
    // Fill center
    mctx.beginPath();
    mctx.arc(cx, cy, MARKER_FILL_RADIUS, 0, 2 * Math.PI, false);
    mctx.fillStyle = player.color;
    mctx.globalAlpha = 0.95;
    mctx.fill();
    mctx.globalAlpha = 1.0;
    row.appendChild(markerCanvas);
    // Hover logic: highlight marker on grid when hovering legend row
    row.addEventListener('mouseenter', () => {
      highlightedPlayerName = player.name;
      img.onload(); // re-draw grid with highlight
    });
    row.addEventListener('mouseleave', () => {
      highlightedPlayerName = null;
      img.onload(); // re-draw grid without highlight
    });
    // Name
    const name = document.createElement('span');
    name.textContent = player.name;
    if (typeof player.law === 'number' && typeof player.moral === 'number') {
      const alignStr = ` (${lawToWord(player.law)} ${moralToWord(player.moral)})`;
      name.textContent += alignStr;
    }
    row.appendChild(name);
    legend.appendChild(row);
  });
  legendScroll.appendChild(legend);
  flexRow.appendChild(legendScroll);
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
        id: 'alignment-grid-app',
        title: 'Alignment Grid',
        width: GRID_SIZE * 2, // double the width
        height: GRID_SIZE * 1.3, // double the height
        resizable: false, // resizing disabled
        minimizable: true,
        popOut: true,
        classes: ['alignment-grid-app'],
        dragDrop: [],
        tabs: []
      });
    }

    /**
     * Override to inject our custom DOM directly.
     */
    async _renderInner(...args) {
      // Create a container div for the grid
      const container = document.createElement('div');
      container.style.width = '100%';
      container.style.height = '100%';
      // Use the same player data logic as before
      const playersAlignments = game.actors
        .filter(actor => actor.hasPlayerOwner && actor.type === 'character')
        .map((actor, idx) => {
          const alignmentValues = actor.getFlag('alignment-tab', 'alignmentValues') || { law: 22, moral: 22 };
          const palette = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#16a085', '#e67e22', '#34495e'];
          return {
            name: actor.name,
            color: palette[idx % palette.length],
            law: alignmentValues.law,
            moral: alignmentValues.moral
          };
        });
      renderSharedAlignmentGrid(playersAlignments, container);
      return $(container);
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
