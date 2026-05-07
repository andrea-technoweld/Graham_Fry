/* Graham Fry Website — Main JS */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky nav shadow on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ---- Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.nav__mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ---- Scroll-reveal fade-up
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
  }

  // ---- Blog / article category filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card[data-cat]');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        articleCards.forEach(card => {
          card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  // ---- Contact form
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) { valid = false; field.style.borderColor = '#e53e3e'; }
        else { field.style.borderColor = ''; }
      });
      if (!valid) return;
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      setTimeout(() => {
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('show');
      }, 1200);
    });
  }

  // ---- Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.querySelector('.nav')?.offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Timeline modal
  const overlay = document.getElementById('tl-modal-overlay');
  if (overlay) {
    const modalHeader = overlay.querySelector('.modal-header');
    const modalYear   = overlay.querySelector('.modal-year');
    const modalTitle  = overlay.querySelector('.modal-title');
    const modalTag    = overlay.querySelector('.modal-type-tag');
    const modalDesc   = overlay.querySelector('.modal-desc');
    const modalImport = overlay.querySelector('.modal-importance p');
    const modalClose  = overlay.querySelector('.modal-close');

    function openModal(btn) {
      const type        = btn.dataset.type;   // 'qual' or 'pd'
      const year        = btn.dataset.year;
      const title       = btn.dataset.title;
      const description = btn.dataset.desc;
      const importance  = btn.dataset.importance;
      const tag         = btn.dataset.tag || (type === 'qual' ? 'Qualification' : 'Professional Development');

      modalYear.textContent  = year;
      modalTitle.textContent = title;
      modalTag.textContent   = tag;
      modalDesc.textContent  = description;
      modalImport.textContent = importance;

      if (type === 'pd') {
        modalHeader.classList.add('modal-header--pd');
      } else {
        modalHeader.classList.remove('modal-header--pd');
      }

      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalClose.focus();
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('.tl-entry[data-title]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn));
      btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(btn); } });
    });

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }

});
