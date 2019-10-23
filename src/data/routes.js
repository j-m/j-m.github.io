import { writable } from "svelte/store"

export const routes = writable({})

export function addRoute(title, component, path, props) {
  routes.update(value => {
    value[path] = {title, component, props}
    return value
  })
}
