// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Project screenshots: fall back to the dashed placeholder box until a
// real image file exists at the placeholder path in the assets folder.
document.querySelectorAll('.card-img').forEach(img => {
  img.addEventListener('error', () => {
    const placeholder = document.createElement('div');
    placeholder.className = 'img-placeholder';
    const label = img.dataset.placeholderText || '+ add screenshot';
    placeholder.innerHTML = `<span>${label}</span>`;
    img.replaceWith(placeholder);
  }, { once: true });
});

// Respect reduced-motion for the SVG skills band (SMIL animate isn't
// controllable via a CSS media query, so handle it here)
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.skill-band-text animate').forEach(a => a.remove());
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => observer.observe(section));

// Friendly console nudge for placeholder links (LinkedIn / GitHub)
document.querySelectorAll('[data-placeholder]').forEach(el => {
  el.addEventListener('click', (e) => {
    if (el.getAttribute('href') === '#') {
      e.preventDefault();
      console.warn(`Update the "${el.dataset.placeholder}" link with your real URL.`);
    }
  });
});

// ------------------------------------------------------------
// Projects section: collapsed by default so the homepage stays short
// for casual scrolling. The arrow expands it in place to reveal the
// project cards, and collapses it again on a second click.
// ------------------------------------------------------------
const projectsToggle = document.getElementById('projectsToggle');
const projectsCollapse = document.getElementById('projectsCollapse');
const projectsToggleLabel = projectsToggle?.querySelector('.toggle-pill-label');

function setProjectsExpanded(expanded) {
  if (!projectsToggle || !projectsCollapse) return;
  if (expanded) {
    projectsCollapse.style.maxHeight = projectsCollapse.scrollHeight + 'px';
    projectsToggle.setAttribute('aria-expanded', 'true');
    if (projectsToggleLabel) projectsToggleLabel.textContent = 'collapse';
  } else {
    if (openCard) closeFlipCard(openCard, true);
    // make sure there's a concrete pixel height to transition from,
    // in case it was previously left at "none" after fully opening
    projectsCollapse.style.maxHeight = projectsCollapse.scrollHeight + 'px';
    projectsCollapse.offsetHeight; // force reflow
    projectsCollapse.style.maxHeight = '0px';
    projectsToggle.setAttribute('aria-expanded', 'false');
    if (projectsToggleLabel) projectsToggleLabel.textContent = 'expand';
  }
}

if (projectsToggle && projectsCollapse) {
  projectsToggle.addEventListener('click', () => {
    setProjectsExpanded(projectsToggle.getAttribute('aria-expanded') !== 'true');
  });

  // once fully open, let the content grow freely (e.g. on window resize)
  // instead of staying capped at the height it had when it opened
  projectsCollapse.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'max-height' && projectsToggle.getAttribute('aria-expanded') === 'true') {
      projectsCollapse.style.maxHeight = 'none';
    }
  });

  // clicking "projects" in the nav, or the hero's "view projects" button,
  // should expand the section as well as scroll to it
  document.querySelectorAll('a[href="#projects"]').forEach(link => {
    link.addEventListener('click', () => setProjectsExpanded(true));
  });
}

// ------------------------------------------------------------
// Flip cards (Projects page): click a panel and it first shifts to
// the centre of the screen and enlarges (a FLIP animation from its
// original grid position), then flips open once it's settled.
// Closing reverses the sequence: flip back to the front, then
// shrink back down into its original spot.
// ------------------------------------------------------------
const flipCards = document.querySelectorAll('.flip-card');
const backdrop = document.getElementById('cardBackdrop');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cardState = new Map();
let openCard = null;
let animating = false;

function getTargetRect() {
  const width = Math.min(640, window.innerWidth * 0.9);
  const height = Math.min(window.innerHeight * 0.78, 560);
  return {
    width, height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

function openFlipCard(card) {
  if (animating || card.classList.contains('popped')) return;
  if (openCard && openCard !== card) closeFlipCard(openCard, true);

  const startRect = card.getBoundingClientRect();
  const target = getTargetRect();

  // Leave a same-sized placeholder in the grid so the other tiles don't
  // reflow into the gap while this card is popped out and moved to <body>.
  const placeholder = document.createElement('div');
  placeholder.className = 'flip-card flip-card-placeholder';
  placeholder.style.visibility = 'hidden';
  placeholder.setAttribute('aria-hidden', 'true');
  card.parentNode.insertBefore(placeholder, card);
  document.body.appendChild(card);

  cardState.set(card, { startRect, placeholder });

  // Pin the card exactly where it already was, with no transition, so
  // moving it to <body> and switching to fixed positioning doesn't
  // cause a visible jump.
  card.style.transition = 'none';
  card.style.left = startRect.left + 'px';
  card.style.top = startRect.top + 'px';
  card.style.width = startRect.width + 'px';
  card.style.height = startRect.height + 'px';
  card.classList.add('popped');
  card.setAttribute('aria-pressed', 'true');
  backdrop?.classList.add('show');
  openCard = card;

  if (reduceMotion) {
    card.style.transition = '';
    card.style.left = target.left + 'px';
    card.style.top = target.top + 'px';
    card.style.width = target.width + 'px';
    card.style.height = target.height + 'px';
    card.classList.add('flipped');
    return;
  }

  // force reflow so the pinned starting position is registered
  card.offsetHeight;

  animating = true;
  card.style.transition = '';
  requestAnimationFrame(() => {
    card.style.left = target.left + 'px';
    card.style.top = target.top + 'px';
    card.style.width = target.width + 'px';
    card.style.height = target.height + 'px';
  });

  card.addEventListener('transitionend', function onPopIn(e) {
    if (e.target !== card || e.propertyName !== 'width') return;
    card.removeEventListener('transitionend', onPopIn);
    animating = false;
    if (openCard === card) card.classList.add('flipped');
  });
}

function resetCardInline(card) {
  card.style.transition = '';
  card.style.left = '';
  card.style.top = '';
  card.style.width = '';
  card.style.height = '';
}

// Moves the card back into its original spot in the grid and removes
// the placeholder that was holding its place.
function restoreCardPosition(card, placeholder) {
  if (placeholder && placeholder.parentNode) {
    placeholder.parentNode.insertBefore(card, placeholder);
    placeholder.remove();
  }
}

function closeFlipCard(card, instant) {
  const state = cardState.get(card);
  card.setAttribute('aria-pressed', 'false');
  if (openCard === card) openCard = null;

  if (instant || reduceMotion || !state) {
    card.classList.remove('flipped', 'popped');
    resetCardInline(card);
    if (state) restoreCardPosition(card, state.placeholder);
    cardState.delete(card);
    backdrop?.classList.remove('show');
    return;
  }

  const { startRect, placeholder } = state;
  animating = true;
  const inner = card.querySelector('.flip-card-inner');
  card.classList.remove('flipped');

  inner.addEventListener('transitionend', function onFlipBack(e) {
    if (e.propertyName !== 'transform') return;
    inner.removeEventListener('transitionend', onFlipBack);

    requestAnimationFrame(() => {
      card.style.left = startRect.left + 'px';
      card.style.top = startRect.top + 'px';
      card.style.width = startRect.width + 'px';
      card.style.height = startRect.height + 'px';
    });

    card.addEventListener('transitionend', function onPopOut(e2) {
      if (e2.target !== card || e2.propertyName !== 'width') return;
      card.removeEventListener('transitionend', onPopOut);
      card.classList.remove('popped');
      resetCardInline(card);
      restoreCardPosition(card, placeholder);
      cardState.delete(card);
      backdrop?.classList.remove('show');
      animating = false;
    });
  });
}

flipCards.forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.card-close')) {
      closeFlipCard(card);
      return;
    }
    if (e.target.closest('a')) return; // let links inside the back panel work normally
    if (card.classList.contains('popped')) {
      if (card.classList.contains('flipped')) closeFlipCard(card);
    } else {
      openFlipCard(card);
    }
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (card.classList.contains('popped')) {
        if (card.classList.contains('flipped')) closeFlipCard(card);
      } else {
        openFlipCard(card);
      }
    }
  });
});

backdrop?.addEventListener('click', () => {
  if (openCard) closeFlipCard(openCard);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && openCard) closeFlipCard(openCard);
});

// ------------------------------------------------------------
// Contact form: submits via fetch to FormSubmit's AJAX endpoint so
// the message arrives as an email without needing a custom backend,
// and the page can show a status message instead of redirecting.
// ------------------------------------------------------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = 'Sending…';
    statusEl.className = 'form-status';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const ajaxAction = contactForm.action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
      const res = await fetch(ajaxAction, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Request failed');

      statusEl.textContent = "Message sent. Thanks, I'll get back to you soon.";
      statusEl.classList.add('success');
      contactForm.reset();
    } catch (err) {
      statusEl.textContent = 'Something went wrong. Email me directly at 45.nathan.lopes@gmail.com instead.';
      statusEl.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}