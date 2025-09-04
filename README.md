
# Alignment Tab for PF2E

Adds a persistent, interactive Alignment Tab to the Pathfinder 2e (PF2E) character sheet in Foundry VTT v12+.

## Features

- **Alignment Grid:** Visual 9x9 grid with marker for current alignment (Lawful/Chaotic, Good/Evil axes).
- **Axis Labels:** Clear axis labels ("LAWFUL", "CHAOTIC", "GOOD", "EVIL") around the grid.
- **Modify Alignment:** Easily adjust alignment with + and - buttons for Laws and Morals, and add a reason for each change.
- **Alignment History:** All changes are logged with reasons and deltas, in a scrollable, visually separated history list.
- **Set Starting Alignment:** Use the gear button to set a starting alignment from classic 9-point options. This will reset history.
- **Persistent Data:** Alignment and history are stored on the actor and persist across sessions.
- **Modern UI:** Clean, responsive layout that matches the PF2E sheet.

## Installation

1. Copy this folder to your Foundry VTT `Data/modules` directory.
2. Enable the module in Foundry VTT.
3. Open a PF2E character sheet and look for the new "Alignment" tab.

## Usage

- Use the grid and controls to track and adjust a character's alignment over time.
- Click the gear icon to set a starting alignment (resets history).
- All changes are logged for easy reference.

## Compatibility

- Foundry VTT v12+
- Pathfinder 2e system v6+

## Additional settings
- In Configure Settings -> Pathfinder Second Edition -> Manage Homenbrew Elements add abbreviation for alignments and two new traits for alignment effects/damage as can be seen in assets\image.png
- Traits list to add: LG, LN, LE, NG, NN, NE, CN, CE, CG, Ordered, Unchained
