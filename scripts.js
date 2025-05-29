window.addEventListener('DOMContentLoaded', () => {
  const bubbleMenu = document.getElementById('bubble-menu');
  const splashMenu = document.getElementById('splash-menu');

  // --- Menu hierarchy definition ---
  const menuHierarchy = {
    main: [
      { label: 'portfolio', type: 'button', action: () => showSubmenu('portfolio') },
      { label: 'resumé', type: 'link', href: 'resources/resume.pdf' },
      { label: 'technology stack', type: 'button', action: () => showSubmenu('tech') },
      { label: 'about', type: 'button', action: () => showSubmenu('about') },
      { label: 'contact', type: 'button', action: () => showSubmenu('contact') }
    ],
    portfolio: [
      { label: '← back', type: 'button', action: () => showSubmenu('main') },
      { label: 'project 1', type: 'button', action: () => alert('Project 1') },
      { label: 'project 2', type: 'button', action: () => alert('Project 2') }
    ],
    tech: [
      { label: '← back', type: 'button', action: () => showSubmenu('main') },
      { label: 'frontend', type: 'button', action: () => alert('Frontend stack') },
      { label: 'backend', type: 'button', action: () => alert('Backend stack') }
    ],
    about: [
      { label: '← back', type: 'button', action: () => showSubmenu('main') },
      { label: 'bio', type: 'button', action: () => alert('Bio') }
    ],
    contact: [
      { label: '← back', type: 'button', action: () => showSubmenu('main') },
      { label: 'email', type: 'button', action: () => alert('Email: ...') }
    ]
  };

  function clearMenu() {
    while (bubbleMenu.firstChild) bubbleMenu.removeChild(bubbleMenu.firstChild);
  }

  function showSubmenu(key) {
    clearMenu();
    (menuHierarchy[key] || []).forEach(item => {
      let el;
      if (item.type === 'link') {
        el = document.createElement('a');
        el.href = item.href;
        el.target = item.target || item.label;
        el.rel = 'noopener';
        el.textContent = item.label;

      } else {
        el = document.createElement('button');
        el.type = 'button';
        el.textContent = item.label;
        if (typeof item.action === 'function') {
          el.addEventListener('click', item.action);
        }
      }
      el.onmouseenter = () => {
        document.querySelector('body').style.setProperty(
          '--background',
          item.backgroundImage || '#394041'
        );
      };
      el.onmouseleave = () => {
        document.querySelector('body').style.setProperty(
          '--background',
          '#394041'
        );
      };
      el.className = 'menu-bubble';
      el.style.setProperty('opacity', '0');
      el.style.setProperty('position', 'absolute');
      el.style.setProperty('left', `${Math.round(Math.random() * 80 + 10)}vw`);
      el.style.setProperty('top', `${Math.round(Math.random() * 80 + 10)}vh`);
      setTimeout(() => {
        initializeBubble(el);
      }, Math.random() * 1000);
      bubbleMenu.appendChild(el);
    });
  }

  function initializeBubble(el) {
    el.style.setProperty('animation', 'bubble_up 1s linear');
    el.style.setProperty('opacity', '1');
  }

  function start_site() {
    document.querySelector('body').style.setProperty('--background', '--splash-background');
    splashMenu.classList.add('show');
    el = document.createElement('img')
    el.src = `resources/splash_missing_stem.svg`;
    el.classList.add('splash-base');
    splashMenu.appendChild(el);
    el = document.createElement('img')
    el.src = `resources/splash_stem.svg`;
    el.classList.add('splash-stem')
    splashMenu.appendChild(el);

    setTimeout(() => {
      splashMenu.classList.add('hidden');
      document.querySelector('body').style.setProperty('--background', '#394041');
      bubbleMenu.classList.add('show');
      showSubmenu('main');
    }, 4000);
  }

  start_site();
});
