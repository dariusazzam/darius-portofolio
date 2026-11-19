export function initModal() {
  const overlay    = document.getElementById('modal-overlay')
  const closeBtn   = document.getElementById('modal-close')
  const liveSiteBtn= document.getElementById('modal-live-btn')
  const githubBtn  = document.getElementById('modal-github-btn')
  const iframeEl   = document.getElementById('modal-iframe')
  const loadingEl  = document.querySelector('.modal-iframe-loading')
  const titleEl    = document.getElementById('modal-title')
  const descEl     = document.getElementById('modal-desc')
  const urlEl      = document.getElementById('modal-url')

  if (!overlay) return

  document.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('click', () => {
      openModal({
        title:      row.dataset.title,
        description:row.dataset.description,
        liveUrl:    row.dataset.liveUrl,
        githubUrl:  row.dataset.githubUrl,
      })
    })
  })

  function openModal(p) {
    if (titleEl)    titleEl.textContent = p.title
    if (descEl)     descEl.textContent  = p.description
    if (urlEl)      urlEl.textContent   = p.liveUrl
    if (liveSiteBtn)liveSiteBtn.href    = p.liveUrl
    if (githubBtn)  githubBtn.href      = p.githubUrl

    if (iframeEl) {
      iframeEl.src = ''
      iframeEl.style.opacity = '0'
      if (loadingEl) loadingEl.style.display = 'flex'
      iframeEl.onload = () => {
        if (loadingEl) loadingEl.style.display = 'none'
        if (typeof gsap !== 'undefined') {
          gsap.to(iframeEl, { opacity: 1, duration: 0.4, ease: 'power2.out' })
        } else {
          iframeEl.style.opacity = '1'
        }
      }
      iframeEl.src = p.liveUrl
    }

    overlay.classList.add('is-open')
    document.body.style.overflow = 'hidden'

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(overlay.querySelector('.modal-window'),
        { y: 24, opacity: 0 },
        { y: 0,  opacity: 1, duration: 0.45, ease: 'expo.out' }
      )
    }
  }

  function closeModal() {
    const win = overlay.querySelector('.modal-window')
    const done = () => {
      overlay.classList.remove('is-open')
      document.body.style.overflow = ''
      if (iframeEl) iframeEl.src = ''
    }

    if (typeof gsap !== 'undefined') {
      gsap.to(win, { y: 16, opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: done })
    } else {
      done()
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal() })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal()
  })
}
