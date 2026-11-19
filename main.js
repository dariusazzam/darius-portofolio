import { projects } from './src/data/projects.js'
import { initCursor, initHeroAnimations, initScrollAnimations, initPreviewFloater } from './src/scripts/animations.js'
import { initModal } from './src/scripts/modal.js'

function buildProjectRows() {
  const table = document.querySelector('.projects-table')
  if (!table) return

  projects.forEach((p) => {
    const row = document.createElement('div')
    row.className = 'project-row'
    row.dataset.title        = p.title
    row.dataset.description  = p.description
    row.dataset.liveUrl      = p.liveUrl
    row.dataset.githubUrl    = p.githubUrl
    row.dataset.previewColor = p.previewColor

    row.innerHTML = `
      <span class="project-index">${p.index}</span>
      <span class="project-title">${p.title}</span>
      <span class="project-category">${p.category}</span>
      <span class="project-year">${p.year}</span>
    `
    table.appendChild(row)
  })
}

function init() {
  buildProjectRows()

  if (typeof gsap !== 'undefined') {
    initCursor()
    initHeroAnimations()
    initScrollAnimations()
    initPreviewFloater()
  }

  initModal()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
