import { writable } from "svelte/store"

export const path = writable()

window.onload = function () {
  var bodyList = document.querySelector("body");
  new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      console.log(document.location.href)
      path.set(document.location.href)
    })
  }).observe(bodyList, {
    childList: true,
    subtree: true
  })
}
