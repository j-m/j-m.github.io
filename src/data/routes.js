import { writable, get } from "svelte/store"

export const routes = writable({})

export function addRoute(title, component, path) {
  routes.update(value => {
    value[path] = {title, component}
    return value
  })
}
