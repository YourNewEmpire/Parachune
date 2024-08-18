import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

//? TYPES
export type LinkToast = {
  message: string;
  link: string;
  type: "failure" | "success" | "info" | "warning";
  timeout: number;
  id: number;
};
export type NewLinkToast = {
  message: string;
  link: string;
  type: "failure" | "success" | "info" | "warning";
  timeout: number;
};
export type Toast = {
  message: string;
  type: "failure" | "success" | "info" | "warning";
  dismissable: boolean;
  timeout: number;
  id: number;
};
export type NewToast = {
  message: string;
  type: "failure" | "success" | "info" | "warning";
  dismissable: boolean;
  timeout: number;
};

export type StoreSong = {
  id: string;
  artistId: string;
  name: string;
  songUrl: string;
  artistName: string;
};
//? SONGS STORES
export const songsQueued: Writable<StoreSong[]> = writable([]);
export const songPlaying: Writable<boolean> = writable(false);
export const songsPlayed: Writable<StoreSong[]> = writable([]);

//? TOAST STORES
export const toasts: Writable<Toast[]> = writable([]);
export const linkToasts: Writable<LinkToast[]> = writable([]);

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
export const dismissLinkToast = (id: number) => {
  linkToasts.update((all) => all.filter((t) => t.id !== id));
};

export const addToast = (toast: NewToast) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000);

  // Setup some sensible defaults for a toast.
  const defaults = {
    id,
    type: "info",
    dismissable: true,
    timeout: 3000,
  };

  // Push the toast to the top of the list of toasts
  const t = { ...defaults, ...toast };
  toasts.update((all) => [t, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (t.timeout) setTimeout(() => dismissToast(id), t.timeout);
};

export const addLinkToast = (toast: NewLinkToast) => {
  // Create a unique ID so we can easily find/remove it
  // if it is dismissible/has a timeout.
  const id = Math.floor(Math.random() * 10000);

  // Setup some sensible defaults for a toast.
  const defaults = {
    id,
    type: "info",
    timeout: 5000,
  };

  // Push the toast to the top of the list of toasts
  const t = { ...defaults, ...toast };
  linkToasts.update((all) => [t, ...all]);

  // If toast is dismissible, dismiss it after "timeout" amount of time.
  if (t.timeout) setTimeout(() => dismissLinkToast(id), t.timeout);
};
