import { writable } from "svelte/store"

export const routes = writable([])

export function addRoute(title, component, path) {
  routes.update(
    currentRoutes => [...currentRoutes, { 
      title, 
      component, 
      path
    }]
  )
}
