// Resolves once the preloader has lifted (or immediately when there is none),
// so the hero's entrance never plays hidden behind it.
let resolveIntro
export const introDone = new Promise((resolve) => {
  resolveIntro = resolve
})

export function completeIntro() {
  resolveIntro()
}
