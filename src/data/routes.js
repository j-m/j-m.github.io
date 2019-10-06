import { writable, get } from "svelte/store"

export const routes = writable({})

export function addRoute(title, component, path) {
  routes.set({[path]: {title, component}})
}
