import { writable } from "svelte/store"

export const routes = writable({})
export const sitemap = writable({})

export function addRoute(prefix, title, path, category, component, props) {
  routes.update(value => {
    value[path] = {prefix, title, category, component, props}
    return value
  })
  sitemap.update(value => {
    value[category] ? value[category].push({path, title}) : value[category]=[{path, title}]
    return value
  })
}
