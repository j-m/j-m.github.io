import { writable } from "svelte/store"

export const routes = writable({})

export function addRoute(title, path, category, component, props) {
  routes.update(value => {
    value[path] = {title, category, component, props}
    return value
  })
}
