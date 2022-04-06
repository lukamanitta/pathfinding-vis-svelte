import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export const nodes: Writable<Path.Node[]> = writable([]);
