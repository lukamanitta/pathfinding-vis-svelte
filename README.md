# Pathfinding Visualiser in Svelte

Sveltekit app to visualise pathfinding algorithms in real-time, making full use
of Svelte's first-class reactivity.  

Visual representation is based solely off of data in the real model of the
nodes being operated on. This makes for a simpler program and easy separation
of model and view.

## Issues

Performance of algorithms could be better, problems mostly lie in the fact that
visualisation is done real-time and some accommodations need to be made to
maintain reactivity.
