// alignment-ancestry-trait.js
// Adds a trait to the ancestry item of a PF2e actor

// List of all possible alignment trait slugs (lowercase)
const ALIGNMENT_TRAITS = [
  'lg', 'ln', 'le', 'ng', 'ne', 'cg', 'cn', 'ce', 'nn'
];

export async function addTraitToAncestry(actor, trait) {
  if (!actor) {
    ui.notifications?.warn("Invalid actor object.");
    return;
  }
  // Find ancestry item
  const ancestry = actor.items.find(i => i.type === 'ancestry');
  if (!ancestry) {
    ui.notifications?.warn(`${actor.name} has no ancestry item.`);
    return;
  }
  let traits = ancestry.system?.traits?.value || [];
  // Remove any existing alignment trait
  traits = traits.filter(t => !ALIGNMENT_TRAITS.includes(t));
  // Add the new alignment trait if not present
  if (!traits.includes(trait)) {
    traits.push(trait);
    await ancestry.update({ 'system.traits.value': traits });
  } else {
    await ancestry.update({ 'system.traits.value': traits }); // still update in case a trait was removed
  }
}

// Example usage:
// const myActor = game.actors.getName("CHARACTER NAME");
// addTraitToAncestry(myActor, "werecreature");
