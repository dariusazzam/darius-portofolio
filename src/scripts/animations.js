export function initCursor() {
  const cursor = document.getElementById('cursor')
  const follower = document.getElementById('cursor-follower')
  if (!cursor || !follower || typeof gsap === 'undefined') return

  let mouseX = 0, mouseY = 0
  let fx = 0, fy = 0

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    gsap.set(cursor, { x: mouseX, y: mouseY })
  })

  gsap.ticker.add(() => {
    fx += (mouseX - fx) * 0.09
    fy += (mouseY - fy) * 0.09
    gsap.set(follower, { x: fx, y: fy })
  })

  document.querySelectorAll('a, button, .project-row, .skill-item, .footer-link-item').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 3, duration: 0.3, ease: 'power2.out' })
      gsap.to(follower, { scale: 1.6, duration: 0.4, ease: 'power2.out', opacity: 0.3 })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power2.out' })
      gsap.to(follower, { scale: 1, duration: 0.4, ease: 'power2.out', opacity: 1 })
    })
  })
}

export function initHeroAnimations() {
  if (typeof gsap === 'undefined') return

  const solid    = document.querySelector('.hero-title-solid')
  const outline  = document.querySelector('.hero-title-outline')
  const bar      = document.querySelector('.hero-bar')
  const metaTL   = document.querySelector('.hero-meta--tl')
  const metaTR   = document.querySelector('.hero-meta--tr')
  const metaBL   = document.querySelector('.hero-meta--bl')
  const metaBR   = document.querySelector('.hero-meta--br')
  const scrollEl = document.querySelector('.scroll-indicator')

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

  gsap.set(bar,    { scaleY: 0, transformOrigin: 'top center' })
  gsap.set(solid,  { y: 60, opacity: 0 })
  gsap.set(outline,{ y: 60, opacity: 0 })
  gsap.set([metaTL, metaTR, metaBL, metaBR], { opacity: 0 })
  gsap.set(scrollEl, { opacity: 0 })

  tl.to(bar, { scaleY: 1, duration: 0.9 })
    .to(solid,   { y: 0, opacity: 1, duration: 1 }, '-=0.5')
    .to(outline, { y: 0, opacity: 1, duration: 1 }, '-=0.85')
    .to([metaTL, metaTR], { opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.6')
    .to([metaBL, metaBR], { opacity: 1, duration: 0.6, stagger: 0.08 }, '-=0.5')
    .to(scrollEl, { opacity: 1, duration: 0.5 }, '-=0.3')

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2
    const cy = window.innerHeight / 2
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy

    gsap.to(solid, {
      x: dx * -22, y: dy * -12,
      duration: 1, ease: 'power2.out',
    })
    gsap.to(outline, {
      x: dx * 22, y: dy * 12,
      duration: 1, ease: 'power2.out',
    })
    gsap.to(bar, {
      x: dx * 8,
      duration: 1.1, ease: 'power2.out',
    })
  })
}

export function initScrollAnimations() {
  if (typeof gsap === 'undefined') return

  const targets = [
    { sel: '.works-title',   from: { y: 50, opacity: 0 }, stagger: false },
    { sel: '.project-row',   from: { x: -24, opacity: 0 }, stagger: 0.07 },
    { sel: '.about-heading', from: { y: 50, opacity: 0 }, stagger: false },
    { sel: '.about-body',    from: { y: 24, opacity: 0 }, stagger: 0.1 },
    { sel: '.skill-item',    from: { x: 20, opacity: 0 }, stagger: 0.06 },
  ]

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const el = entry.target
      const cfg = targets.find((t) => el.matches(t.sel))
      if (!cfg) return

      gsap.fromTo(el, cfg.from, {
        x: 0, y: 0, opacity: 1,
        duration: 0.75,
        ease: 'expo.out',
        delay: cfg.stagger
          ? Array.from(document.querySelectorAll(cfg.sel)).indexOf(el) * cfg.stagger
          : 0,
      })
      io.unobserve(el)
    })
  }, { threshold: 0.12 })

  targets.forEach(({ sel }) => {
    document.querySelectorAll(sel).forEach((el) => io.observe(el))
  })
}

export function initPreviewFloater() {
  const floater = document.getElementById('preview-floater')
  if (!floater) return

  let active = false
  let tx = 0, ty = 0, cx = 0, cy = 0
  let raf = null

  document.querySelectorAll('.project-row').forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      active = true
      floater.querySelector('.preview-inner').style.background = row.dataset.previewColor || '#191919'
      floater.querySelector('.preview-label').textContent = row.dataset.title || ''
      floater.style.display = 'block'
      tx = e.clientX + 20
      ty = e.clientY - 110
      cx = tx; cy = ty

      if (typeof gsap !== 'undefined') {
        gsap.to(floater, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' })
      } else {
        floater.style.opacity = '1'
      }
      loop()
    })

    row.addEventListener('mousemove', (e) => {
      tx = e.clientX + 20
      ty = e.clientY - 110
    })

    row.addEventListener('mouseleave', () => {
      active = false
      cancelAnimationFrame(raf)
      if (typeof gsap !== 'undefined') {
        gsap.to(floater, {
          opacity: 0, scale: 0.95, duration: 0.2, ease: 'power2.in',
          onComplete: () => { floater.style.display = 'none' },
        })
      } else {
        floater.style.opacity = '0'
        floater.style.display = 'none'
      }
    })
  })

  function loop() {
    if (!active) return
    cx += (tx - cx) * 0.1
    cy += (ty - cy) * 0.1
    if (typeof gsap !== 'undefined') {
      gsap.set(floater, { x: cx, y: cy })
    } else {
      floater.style.transform = `translate(${cx}px, ${cy}px)`
    }
    raf = requestAnimationFrame(loop)
  }
}
