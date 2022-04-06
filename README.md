# Pathfinding Visualiser in Svelte

Sveltekit app to visualise pathfinding algorithms in real-time, making full use
of Svelte's first-class reactivity.  

Visual representation is based solely off of data in the real model of the
nodes being operated on. This makes for a simpler program and easy separation
of model and view.

## Issues

The computing delay specific with the slider will not be an accurate
 representation of the actual delay. This is not a performance issue
 with the algorithm, but instead is a result of Javascript itself.  
Javascript is single-threaded and uses an event loop system, meaning
 functions like `settimeout` can be extremely inaccurate.  
Because this is the only way (as far as I can tell) to implement a
 sleep function, this is unavoidable.  
The actual delay may be anywhere between 20 and 2000ms larger than the
 specified delay.
