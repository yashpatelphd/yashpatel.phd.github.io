/* =====================================================================
   YASH PATEL — site interactions
   No dependencies. Vanilla JS, defer-loaded.
   ===================================================================== */

(() => {
  'use strict';

  /* ──── 1. Year stamp ──── */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  /* ──── 2. Nav: scroll state + active section ──── */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__links a[data-nav]');

  const onScroll = () => {
    if (window.scrollY > 16) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Scrollspy via IntersectionObserver
  const sections = ['about', 'research', 'record', 'findings', 'recognition', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(s => spy.observe(s));
  }


  /* ──── 3. Mobile drawer ──── */
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');

  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) {
        drawer.setAttribute('hidden', '');
      } else {
        drawer.removeAttribute('hidden');
      }
    });

    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('hidden', '');
      });
    });
  }


  /* ──── 4. Publication filters ──── */
  const filterBtns = document.querySelectorAll('.filters__btn');
  const pubs = document.querySelectorAll('.pub');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;

      filterBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });

      pubs.forEach(p => {
        const match = f === 'all' || p.dataset.type === f;
        p.classList.toggle('is-hidden', !match);
      });
    });
  });


  /* ──── 5. Email reveal (anti-bot) ──── */
  const emailLink = document.querySelector('[data-email]');
  if (emailLink) {
    const display = emailLink.querySelector('[data-email-display]');
    let revealed = false;

    const reveal = (e) => {
      if (revealed) return;
      if (e) e.preventDefault();
      try {
        const email = atob(emailLink.dataset.email);
        emailLink.href = `mailto:${email}`;
        if (display) display.textContent = email;
        revealed = true;
      } catch (err) { /* noop */ }
    };

    emailLink.addEventListener('mouseenter', reveal);
    emailLink.addEventListener('focus', reveal);
    emailLink.addEventListener('click', (e) => {
      if (!revealed) reveal(e);
    });
  }


  /* ──── 6. Scroll reveal — sections, timeline items, pubs, awards ──── */
  const targets = document.querySelectorAll('.section, .timeline__item, .thrust, .pub, .award, .contact__card');
  targets.forEach(t => t.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });

    targets.forEach(t => io.observe(t));
  } else {
    // Fallback — show everything
    targets.forEach(t => t.classList.add('is-visible'));
  }


  /* ──── 7. Smooth offset for sticky nav ──── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
      const y = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', href);
    });
  });

})();
