let bubbleElements = [];
const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);


window.addEventListener('DOMContentLoaded', () => {
  const bubbleMenu = document.getElementById('bubble-menu');
  const splashMenu = document.getElementById('splash-menu');
  document.querySelector('body').style.setProperty('--screen-height', `${screenHeight}px`);
  document.querySelector('body').style.setProperty('--screen-width', `${screenWidth}px`);

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
      { label: '←return', type: 'button', action: () => showSubmenu('main') },
      { label: 'AutomateDV', type: 'button', action: () => alert('AutomateDV') },
      { label: 'Business Logic Test Harness', type: 'button', action: () => alert('Business Logic Test Harness') },
      { label: 'Insurance Warehouse', type: 'button', action: () => alert('Insurance Warehouse') },
      { label: 'Solar Farm Data', type: 'button', action: () => alert('Solar Farm Data') },
      { label: 'Service Station Integration', type: 'button', action: () => alert('Service Station Integration') },
      { label: 'Car Finance', type: 'button', action: () => alert('Car Finance') }
    ],
    tech: [
      { label: '←return', type: 'button', action: () => showSubmenu('main') },
      { label: 'Data Ingestion', type: 'button', action: () => alert('Data Ingestion') },
      { label: 'Data Warehousing', type: 'button', action: () => alert('Data Warehousing') },
      { label: 'ETL Tools', type: 'button', action: () => alert('ETL Tools') },
      { label: 'Data Governance', type: 'button', action: () => alert('Data Governance') },
      { label: 'Cloud Platforms', type: 'button', action: () => alert('Cloud Platforms') },
      { label: 'Infrastructure', type: 'button', action: () => alert('Infrastructure') }
    ],
    about: [
      { label: '←return', type: 'button', action: () => showSubmenu('main') },
      { label: 'bio', type: 'button', action: () => alert('Bio') }
    ],
    contact: [
      { label: '←return', type: 'button', action: () => showSubmenu('main') },
      { label: 'E-mail', type: 'button', action: () => alert('Email: ...') },
      { label: 'LinkedIn', type: 'button', action: () => alert('LinkedIn: ...') },
      { label: 'GitHub', type: 'button', action: () => alert('GitHub: ...') }
    ]
  };

  // Helper: get minimum distance between bubbles (in vw/vh units)
  function minBubbleDistance() {
    // 15vmin bubble size, so ~15vw/vh, but let's use 18 for padding
    return 18;
  }

  // Helper: check if a position is too close to existing bubbles
  function isTooClose(x, y, placedBubbles, minDist) {
    for (let b of placedBubbles) {
      const dx = x - b.x;
      const dy = y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < minDist) return true;
    }
    return false;
  }

  class bubble_object {
    constructor(item, placedBubbles = []) {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      if (item.type === 'link') {
        this.el = document.createElement('a');
        this.el.href = item.href;
        this.el.target = item.target || item.label;
        this.el.rel = 'noopener';
        this.el.textContent = item.label;

      } else {
        this.el = document.createElement('button');
        this.el.type = 'button';
        this.el.textContent = item.label;
        if (typeof item.action === 'function') {
          this.el.addEventListener('click', item.action);
        }
      }
      this.el.onmouseenter = () => {
        document.querySelector('body').style.setProperty(
          '--background',
          item.backgroundImage || '#394041'
        );
      };
      this.el.onmouseleave = () => {
        document.querySelector('body').style.setProperty(
          '--background',
          '#394041'
        );
      };
      this.el.className = 'menu-bubble';
      this.el.style.setProperty('opacity', '0');
      this.el.style.setProperty('position', 'absolute');
      this.set_random_position(placedBubbles);
    }
    set_random_position(placedBubbles = []) {
      // Try up to 50 times to find a non-overlapping position
      const minDist = minBubbleDistance();
      let tries = 0;
      let x, y;
      do {
        x = Math.random() * 60 + 20;
        y = Math.random() * 60 + 20;
        tries++;
      } while (isTooClose(x, y, placedBubbles, minDist) && tries < 50);
      this.x = x;
      this.y = y;
    }
    update_velocities() {
      let ax = (Math.random() - 0.5) * 0.001;
      let ay = (Math.random() - 0.5) * 0.001;
      this.vx += ax;
      this.vy += ay;
      let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      let maxSpeed = 0.01;
      if (speed > maxSpeed) {
        this.vx /= speed / maxSpeed;
        this.vy /= speed / maxSpeed;
      }
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 20) this.x = 20;
      if (this.x > 80) this.x = 80;
      if (this.y < 20) this.y = 20;
      if (this.y > 80) this.y = 80;
    }
    update_collisions() {
      // Get radius in vh units (since y is in vh)
      const style = getComputedStyle(this.el);
      const bubbleRadius = parseFloat(style.height) / screenHeight * 100 / 2; // in vh
      for (let other of bubbleElements) {
        if (other === this) continue;
        // Use vh/vw units for both x/y
        let dx = (this.x - other.x) * screenWidth / 100;
        let dy = (this.y - other.y) * screenHeight / 100;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Get other bubble's radius in vh units
        const otherStyle = getComputedStyle(other.el);
        const otherRadius = parseFloat(otherStyle.height) / screenHeight * 100 / 2; // in vh

        // Minimum distance for no overlap (in px)
        const minDist = (bubbleRadius + otherRadius) * screenHeight / 100;

        if (distance < minDist && distance > 0) {
          // Move each bubble away from each other equally
          const overlap = (minDist - distance) / 2;
          const nx = dx / distance;
          const ny = dy / distance;
          this.x += (nx * overlap * 100 / screenWidth);
          this.y += (ny * overlap * 100 / screenHeight);
          other.x -= (nx * overlap * 100 / screenWidth);
          other.y -= (ny * overlap * 100 / screenHeight);

          // Exchange velocities for a simple bounce effect
          const tx = this.vx;
          const ty = this.vy;
          this.vx = other.vx;
          this.vy = other.vy;
          other.vx = tx;
          other.vy = ty;
        }
      }
    }

    update_style() {
      this.el.style.setProperty('left', `${this.x}vw`);
      this.el.style.setProperty('top', `${this.y}vh`);
      // this.el.textContent = `x: ${this.x.toFixed(2)},\n y: ${this.y.toFixed(2)}`;
    }

    initializeBubble() {
      this.el.style.setProperty('animation', 'bubble_up 1s linear');
      this.el.style.setProperty('opacity', '1');
    }
  }

  function clearMenu() {
    while (bubbleMenu.firstChild) bubbleMenu.removeChild(bubbleMenu.firstChild);
    bubbleElements = [];
  }

  function showSubmenu(key) {
    clearMenu();
    const placedBubbles = [];
    (menuHierarchy[key] || []).forEach(item => {
      let bubble = new bubble_object(item, placedBubbles);
      placedBubbles.push({ x: bubble.x, y: bubble.y });
      bubbleElements.push(bubble);
      bubbleMenu.appendChild(bubble.el);
      setTimeout(() => {
        bubble.initializeBubble();
      }, Math.random() * 1000);
    });
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
    update_loop();
    setTimeout(() => {
      splashMenu.classList.add('hidden');
      document.querySelector('body').style.setProperty('--background', '#394041');
      bubbleMenu.classList.add('show');
      showSubmenu('main');
    }, 4000);
  }

  function update_loop() {
    for (let bubble of bubbleElements) { bubble.update_collisions(); }
    for (let bubble of bubbleElements) { bubble.update_velocities(); }
    for (let bubble of bubbleElements) { bubble.update_style(); }
    requestAnimationFrame(update_loop);
  }
  start_site();
});
