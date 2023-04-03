import { writable } from "svelte/store";

export const theme = writable("dark");
export const songSelectedUrl = writable("");
export const songsQueued = writable([""]);
