(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const messages = {
    婷婷: '念起你的名字，连语气都会不自觉地变温柔。',
    浅浅: '名字是浅浅，喜欢你这件事，却一天比一天更深。',
    学姐: '想和你并肩走，也想认真听你说每一件小事。',
    妈妈: '这是我们之间亲昵的小暗号，藏着安心，也藏着依赖。',
    姐姐: '喜欢被你照顾，也想把同样细致的温柔还给你。'
  }
  const nameButtons = [...document.querySelectorAll('[data-name]')]
  nameButtons.forEach(button => {
    button.addEventListener('click', () => {
      nameButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)))
      document.getElementById('name-message').textContent = messages[button.dataset.name]
    })
  })

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    document.documentElement.classList.add('motion-ready')
  }

  const rail = document.getElementById('photo-rail')
  const memories = [...rail.querySelectorAll('.memory')]
  const railPrevious = document.getElementById('gallery-prev')
  const railNext = document.getElementById('gallery-next')
  const updateRail = () => {
    const index = Math.round(rail.scrollLeft / (memories[1].offsetLeft - memories[0].offsetLeft))
    document.getElementById('gallery-counter').textContent = `${String(index + 1).padStart(2, '0')} / 05`
    railPrevious.disabled = rail.scrollLeft < 2
    railNext.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2
  }
  const scrollRail = direction => {
    const step = memories[1].offsetLeft - memories[0].offsetLeft
    rail.scrollBy({ left: direction * step, behavior: reducedMotion.matches ? 'auto' : 'smooth' })
  }
  document.querySelector('.gallery-controls').hidden = false
  railPrevious.addEventListener('click', () => scrollRail(-1))
  railNext.addEventListener('click', () => scrollRail(1))
  rail.addEventListener('scroll', updateRail, { passive: true })
  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      scrollRail(event.key === 'ArrowRight' ? 1 : -1)
    }
  })
  window.addEventListener('resize', updateRail, { passive: true })
  updateRail()

  const lightbox = document.getElementById('lightbox')
  let activePhoto = 0
  const showPhoto = index => {
    activePhoto = (index + memories.length) % memories.length
    const memory = memories[activePhoto]
    const image = memory.querySelector('img')
    const displayImage = document.getElementById('lightbox-image')
    displayImage.src = image.src
    displayImage.alt = image.alt
    document.getElementById('lightbox-caption').textContent = memory.querySelector('h3').textContent
    document.getElementById('lightbox-counter').textContent = `${String(activePhoto + 1).padStart(2, '0')} / 05`
  }
  if (typeof lightbox.showModal === 'function') {
    document.querySelectorAll('[data-photo]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault()
        showPhoto(Number(link.dataset.photo))
        lightbox.showModal()
      })
    })
    document.getElementById('lightbox-close').addEventListener('click', () => lightbox.close())
    document.getElementById('lightbox-prev').addEventListener('click', () => showPhoto(activePhoto - 1))
    document.getElementById('lightbox-next').addEventListener('click', () => showPhoto(activePhoto + 1))
    lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close() })
    lightbox.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        showPhoto(activePhoto + (event.key === 'ArrowRight' ? 1 : -1))
      }
    })
  }

  let confettiTimer
  const letter = document.getElementById('love-letter')
  const action = document.getElementById('letter-action')
  const confetti = document.getElementById('confetti')
  letter.addEventListener('toggle', () => {
    action.replaceChildren(document.createTextNode(letter.open ? '把这封信轻轻收好 ' : '拆开给浅浅的信 '))
    const arrow = document.createElement('span')
    arrow.setAttribute('aria-hidden', 'true')
    arrow.textContent = letter.open ? '↙' : '↗'
    action.append(arrow)
    clearTimeout(confettiTimer)
    confetti.replaceChildren()
    if (!letter.open || reducedMotion.matches) return
    for (let i = 0; i < 13; i++) {
      const heart = document.createElement('span')
      heart.textContent = i % 3 === 0 ? '✧' : '♡'
      heart.style.setProperty('--x', `${(i - 6) * 32}px`)
      heart.style.setProperty('--y', `${-80 - Math.random() * 120}px`)
      heart.style.setProperty('--r', `${(Math.random() - 0.5) * 70}deg`)
      confetti.append(heart)
    }
    confettiTimer = setTimeout(() => confetti.replaceChildren(), 1600)
  })
})()
