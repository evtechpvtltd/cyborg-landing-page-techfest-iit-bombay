(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  // Mobile navigation is keyboard-accessible and closes on selection / Escape.
  const menuButton = $('#menu-toggle');
  const mobileNav = $('#mobile-nav');
  function closeMenu() {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    mobileNav.classList.remove('is-open');
    mobileNav.inert = true;
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileNav.classList.toggle('is-open', open);
    mobileNav.inert = !open;
    if (open) $('#mobile-nav a')?.focus();
  });
  $$('#mobile-nav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', (event) => {
    if (!mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  // Reveals are enhancement only; content remains visible on browsers without IntersectionObserver.
  const revealElements = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.085, rootMargin: '0px 0px 40px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 3 selectable architecture modules. All copy is demo/concept content.
  const modules = {
    neural: { index: '01 // 03', id: 'MODULE / NX-CORE-01', name: 'NEURAL ENGINE', description: 'A thought-driven interface bridging instinct and computation.', glyph: '✳' },
    optic: { index: '02 // 03', id: 'MODULE / NX-VSN-02', name: 'OPTIC MATRIX', description: 'A responsive sensory layer that reimagines the way we perceive.', glyph: '◉' },
    armor: { index: '03 // 03', id: 'MODULE / NX-SHL-03', name: 'TITANIUM SHELL', description: 'An adaptive framework inspired by resilience and precision.', glyph: '⬡' }
  };
  const tabs = $$('.module-tab');
  function activateModule(tab) {
    tabs.forEach(el => {
      const selected = el === tab;
      el.classList.toggle('is-active', selected);
      el.setAttribute('aria-selected', String(selected));
      el.tabIndex = selected ? 0 : -1;
    });
    const module = modules[tab.dataset.module];
    $('#display-index').textContent = module.index;
    $('#module-id').textContent = module.id;
    $('#module-name').textContent = module.name;
    $('#module-description').textContent = module.description;
    $('#core-glyph').textContent = module.glyph;
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { activateModule(tab); playTick(); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateModule(tabs[next]);
      tabs[next].focus();
      playTick();
    });
  });

  // Optional sounds use Web Audio; no downloads or third-party services.
  let soundOn = false;
  let audioContext;
  const soundToggle = $('#sound-toggle');
  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.setAttribute('aria-label', soundOn ? 'Disable interface sounds' : 'Enable interface sounds');
    playTick();
  });
  function playTick() {
    if (!soundOn) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      audioContext ??= new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(680, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(430, audioContext.currentTime + 0.055);
      gain.gain.setValueAtTime(0.036, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.07);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.075);
    } catch (_) { /* Sound is always optional. */ }
  }

  // Simulated experience: intentionally local, does not collect information.
  const modal = $('#simulation-modal');
  let progressTimer = null;
  let previousFocus = null;
  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    clearInterval(progressTimer);
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.body.classList.remove('modal-open');
    previousFocus?.focus?.();
  }
  function openModal() {
    closeMenu();
    previousFocus = document.activeElement;
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    $('#sim-progress').style.width = '0%';
    $('#sim-progress-label').textContent = '0% SYNCHRONIZED';
    $('#sim-status').textContent = 'INITIALIZING...';
    $('.modal-close').focus();
    playTick();
    clearInterval(progressTimer);
    let progress = 0;
    progressTimer = setInterval(() => {
      progress = Math.min(100, progress + (progress < 80 ? 4 : 2));
      $('#sim-progress').style.width = `${progress}%`;
      $('#sim-progress-label').textContent = `${progress}% SYNCHRONIZED`;
      if (progress >= 100) {
        clearInterval(progressTimer);
        $('#sim-status').textContent = 'CONNECTED.';
        playTick();
      }
    }, 90);
  }
  $$('[data-open-simulation]').forEach(button => button.addEventListener('click', openModal));
  $$('[data-close-simulation]').forEach(button => button.addEventListener('click', closeModal));
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusables = $$('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])', modal).filter(el => !el.inert);
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (modal.classList.contains('is-open')) closeModal(); else closeMenu(); }
  });

  // Highlight the current main navigation item while exploring the site.
  if ('IntersectionObserver' in window) {
    const sections = $$('main section[id]');
    const navLinks = $$('.desktop-nav a');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }
})();
