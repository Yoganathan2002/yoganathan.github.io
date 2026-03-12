/* script.js — Unified site script
   - Robust selectors and fallbacks
   - Spotlight (cursor spotlight) fixed and defensive
   - Portfolio links redirect to index.html
   - Smooth scroll + active nav
   - Particles, water parallax, contact form, chat mock, admin UI
*/

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------
       Helpers
    ------------------------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const isAnchorTo = (el, fragment) => {
      if (!el || !el.getAttribute) return false;
      const href = el.getAttribute('href') || '';
      return href.toLowerCase().includes(fragment.toLowerCase()) || (el.textContent || '').toLowerCase().includes(fragment.toLowerCase());
    };

    /* -------------------------
       NAV: ensure .nav-link class on top-nav anchors
    ------------------------- */
    $$('.top-nav a').forEach(a => {
      if (!a.classList.contains('nav-link')) a.classList.add('nav-link');
    });

    /* -------------------------
       Portfolio redirect: any link that looks like "portfolio" -> index.html
       (handles href="/portfolio", "#portfolio", text "Portfolio", etc.)
    ------------------------- */
    $$('.top-nav a, a').forEach(a => {
      try {
        if (isAnchorTo(a, 'portfolio')) {
          a.addEventListener('click', (ev) => {
            // If it's an in-page anchor to portfolio section, still redirect to index.html
            ev.preventDefault();
            // If already on index.html, scroll to portfolio section if present
            const current = window.location.pathname.split('/').pop() || 'index.html';
            if (current === 'index.html' || current === '') {
              // try to scroll to #work or #portfolio if exists
              const target = document.getElementById('work') || document.getElementById('portfolio');
              if (target) {
                const headerOffset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
                window.scrollTo({ top: Math.max(0, Math.floor(top)), behavior: 'smooth' });
                return;
              }
            }
            // Otherwise navigate to index.html
            window.location.href = 'index.html';
          }, { passive: false });
        }
      } catch (err) { /* ignore */ }
    });

    /* -------------------------
       Smooth scroll for nav links (anchors)
    ------------------------- */
    const headerOffset = 80;
    $$('.nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: Math.max(0, Math.floor(top)), behavior: 'smooth' });
      }, { passive: false });
    });

    /* -------------------------
       Active nav on scroll (throttled via rAF)
    ------------------------- */
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    function updateActiveNav() {
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
      let currentId = '';
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const top = sec.offsetTop - 120;
        if (scrollPos >= top) currentId = sec.id;
      }
      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = (link.getAttribute('href') || '').trim();
        if (href.startsWith('#') && href.slice(1) === currentId) link.classList.add('active');
      });
    }
    updateActiveNav();
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    /* -------------------------
       THEME / LAMP toggle (defensive)
    ------------------------- */
    const htmlEl = document.documentElement;
    const lampToggle = document.getElementById('lampToggle') || document.getElementById('header-lamp') || document.querySelector('.lamp-toggle');
    if (lampToggle) {
      const halo = lampToggle.querySelector('.lamp-halo');
      const setHaloState = (theme) => {
        if (!halo) return;
        if (theme === 'dark') {
          halo.style.opacity = '1';
          halo.style.transform = 'scale(1)';
        } else {
          halo.style.opacity = '0';
          halo.style.transform = 'scale(0.7)';
        }
      };
      lampToggle.addEventListener('click', () => {
        lampToggle.classList.add('lamp-anim');
        setTimeout(() => lampToggle.classList.remove('lamp-anim'), 450);
        const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', nextTheme);
        setHaloState(nextTheme);
      });
      setHaloState(htmlEl.getAttribute('data-theme') || 'dark');
    }

    /* -------------------------
       PARTICLE CANVAS (create if missing)
    ------------------------- */
    let canvas = document.getElementById('particle-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'particle-canvas';
      canvas.style.position = 'fixed';
      canvas.style.inset = '0';
      canvas.style.zIndex = '-2';
      canvas.style.pointerEvents = 'none';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (ctx) {
      let particles = [];
      let w = 0, h = 0;
      function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();

      function createParticles(count = 60) {
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
          });
        }
      }
      createParticles(60);

      function getParticleColor() {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--particle-color').trim() || 'rgba(0,174,239,0.8)';
      }

      function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = getParticleColor();
        particles.forEach(p => {
          p.x += p.dx; p.y += p.dy;
          if (p.x < 0 || p.x > w) p.dx *= -1;
          if (p.y < 0 || p.y > h) p.dy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(animateParticles);
      }
      animateParticles();
    }

    /* -------------------------
       WATER SURFACE + REFLECTIVE MOTION (defensive)
    ------------------------- */
    const waterSurface = document.querySelector('.water-surface') || document.querySelector('.water-surface-main') || document.querySelector('.bg-waves');
    const bgWaves = document.querySelector('.bg-waves') || waterSurface;
    if (waterSurface && bgWaves) {
      let lastScrollY = window.scrollY || 0;
      let lastTime = performance.now();
      let smoothedSpeed = 0;
      function updateWaterAndReflection() {
        const now = performance.now();
        const dt = Math.max(16, now - lastTime);
        const currentY = window.scrollY || window.pageYOffset || 0;
        const dy = currentY - lastScrollY;
        const speed = Math.abs(dy) / dt;
        smoothedSpeed = smoothedSpeed * 0.9 + speed * 0.1;
        const intensity = Math.min(0.6, 0.18 + smoothedSpeed * 1.2);
        document.documentElement.style.setProperty('--reflect-intensity', intensity.toFixed(3));
        try { waterSurface.style.transform = `translate3d(0, ${currentY * 0.12}px, 0) scale(${1 + smoothedSpeed * 0.15})`; } catch (e) {}
        try { bgWaves.style.transform = `translate3d(0, ${currentY * 0.06}px, 0)`; } catch (e) {}
        lastScrollY = currentY; lastTime = now;
        requestAnimationFrame(updateWaterAndReflection);
      }
      requestAnimationFrame(updateWaterAndReflection);
    }

    /* -------------------------
       CONTACT FORM: validation + button animation (defensive)
    ------------------------- */
    const contactForm = document.getElementById('contactForm') || document.querySelector('.contact-form');
    if (contactForm) {
      const nameInput = contactForm.querySelector('#name') || contactForm.querySelector('input[name="name"]') || contactForm.querySelector('input');
      const emailInput = contactForm.querySelector('#email') || contactForm.querySelector('input[type="email"]') || contactForm.querySelector('input[name="email"]');
      const subjectInput = contactForm.querySelector('#subject') || contactForm.querySelector('input[name="subject"]');
      const messageInput = contactForm.querySelector('#message') || contactForm.querySelector('textarea') || contactForm.querySelector('textarea[name="message"]');

      function ensureErrorSpan(id) {
        let span = contactForm.querySelector(`.error-msg[data-for="${id}"]`);
        if (!span) {
          span = document.createElement('span');
          span.className = 'error-msg';
          span.setAttribute('data-for', id);
          const ref = contactForm.querySelector(`#${id}`) || contactForm.querySelector(`[name="${id}"]`);
          if (ref && ref.parentNode) ref.parentNode.appendChild(span);
          else contactForm.appendChild(span);
        }
        return span;
      }

      let sendBtn = contactForm.querySelector('.send-btn');
      if (!sendBtn) {
        const btn = contactForm.querySelector('button[type="submit"], .btn.primary, .btn');
        if (btn) {
          sendBtn = document.createElement('button');
          sendBtn.type = 'submit';
          sendBtn.className = 'send-btn btn primary';
          sendBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-ripple"></span><span class="btn-check" style="opacity:0;transform:translateY(4px)">✓</span>';
          btn.replaceWith(sendBtn);
        }
      } else {
        if (!sendBtn.querySelector('.btn-ripple')) sendBtn.appendChild(Object.assign(document.createElement('span'), { className: 'btn-ripple' }));
        if (!sendBtn.querySelector('.btn-check')) {
          const check = document.createElement('span');
          check.className = 'btn-check';
          check.textContent = '✓';
          check.style.opacity = '0';
          check.style.transform = 'translateY(4px)';
          sendBtn.appendChild(check);
        }
        if (!sendBtn.querySelector('.btn-text')) {
          const text = document.createElement('span');
          text.className = 'btn-text';
          text.textContent = 'Send Message';
          sendBtn.insertBefore(text, sendBtn.firstChild);
        }
      }

      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        function setError(id, msg) { const s = ensureErrorSpan(id); s.textContent = msg; }
        function clearError(id) { const s = contactForm.querySelector(`.error-msg[data-for="${id}"]`); if (s) s.textContent = ''; }

        if (nameInput && !nameInput.value.trim()) { setError('name', 'Name is required'); valid = false; } else clearError('name');
        if (emailInput) {
          const v = (emailInput.value || '').trim();
          if (!v) { setError('email', 'Email is required'); valid = false; }
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setError('email', 'Enter a valid email'); valid = false; }
          else clearError('email');
        }
        if (subjectInput && !subjectInput.value.trim()) { setError('subject', 'Subject is required'); valid = false; } else clearError('subject');
        if (messageInput && !messageInput.value.trim()) { setError('message', 'Message is required'); valid = false; } else clearError('message');
        if (!valid) return;

        if (sendBtn) {
          const ripple = sendBtn.querySelector('.btn-ripple');
          const check = sendBtn.querySelector('.btn-check');
          const text = sendBtn.querySelector('.btn-text');
          if (ripple && text) {
            const rect = sendBtn.getBoundingClientRect();
            ripple.style.left = rect.width / 2 + 'px';
            ripple.style.top = rect.height / 2 + 'px';
            ripple.style.width = ripple.style.height = '0px';
            ripple.style.opacity = '1';
            ripple.style.transition = 'none';
            requestAnimationFrame(() => {
              const size = Math.max(rect.width, rect.height) * 2;
              ripple.style.transition = 'width 0.4s ease, height 0.4s ease, opacity 0.4s ease';
              ripple.style.width = ripple.style.height = size + 'px';
              ripple.style.opacity = '0';
            });
          }
          if (text) text.textContent = 'Sent';
          if (check) { check.style.opacity = '1'; check.style.transform = 'translateY(0)'; }
          setTimeout(() => {
            if (text) text.textContent = 'Send Message';
            if (check) { check.style.opacity = '0'; check.style.transform = 'translateY(4px)'; }
            contactForm.reset();
          }, 1400);
        } else {
          contactForm.reset();
          alert('Message sent (demo).');
        }
      });
    }

    /* -------------------------
       CHAT UI (mock) — defensive
    ------------------------- */
    const chatMessagesEl = document.getElementById('chatMessages');
    const chatForm = document.getElementById('chatForm') || document.querySelector('.chat-form');
    const chatInput = document.getElementById('chatInput') || (chatForm && chatForm.querySelector('input, textarea'));
    const connectionStatus = document.getElementById('connectionStatus');
    const conversationList = document.getElementById('conversationList');
    const friendsCountEl = document.getElementById('friendsCount');
    const unknownCountEl = document.getElementById('unknownCount');

    // mock state
    let isAdmin = false;
    let templateRequests = [{ id: 1, user: 'viewer-123', status: 'pending' }, { id: 2, user: 'friend-001', status: 'approved' }];
    let friendsOnline = 2, unknownActive = 3, totalUsers = 12;
    const conversations = [{ id: 'public', label: 'Public Inbox' }, { id: 'friend-001', label: 'Friend · Dev Buddy' }, { id: 'unknown-xyz', label: 'Unknown · Visitor' }];
    let currentConversationId = 'public';

    function addSystemMessage(text) {
      if (!chatMessagesEl) return;
      const div = document.createElement('div');
      div.style.marginBottom = '6px';
      div.style.fontSize = '11px';
      div.style.color = 'var(--text-muted)';
      div.textContent = text;
      chatMessagesEl.appendChild(div);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
    function addMessage(from, text) {
      if (!chatMessagesEl) return;
      const div = document.createElement('div');
      div.style.marginBottom = '6px';
      div.innerHTML = `<span style="color:var(--accent-soft);">${from}:</span> <span style="color:var(--text-main);">${text}</span>`;
      chatMessagesEl.appendChild(div);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
    function renderConversations() {
      if (!conversationList) return;
      conversationList.innerHTML = '';
      conversations.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.label;
        li.style.cursor = 'pointer';
        li.style.padding = '4px 0';
        li.style.color = c.id === currentConversationId ? 'var(--accent)' : 'var(--text-muted)';
        li.addEventListener('click', () => {
          currentConversationId = c.id;
          const labelEl = document.getElementById('chatTargetLabel');
          if (labelEl) labelEl.textContent = c.label;
          renderConversations();
          if (chatMessagesEl) chatMessagesEl.innerHTML = '';
          addSystemMessage(`Switched to ${c.label}`);
        });
        conversationList.appendChild(li);
      });
    }
    if (friendsCountEl) friendsCountEl.textContent = `${friendsOnline} online`;
    if (unknownCountEl) unknownCountEl.textContent = `${unknownActive} active`;
    renderConversations();
    addSystemMessage('Connected to mock chat. Replace with real WebSocket backend.');

    // init mock websocket state
    if (connectionStatus) connectionStatus.textContent = 'Connected (mock)';
    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = (chatInput.value || '').trim();
        if (!text) return;
        addMessage('You', text);
        // mock echo
        setTimeout(() => {
          addMessage('Server', `Echo: ${text}`);
          // push to admin monitor if admin
          if (isAdmin) {
            const adminMessagesMonitor = document.getElementById('adminMessagesMonitor');
            if (adminMessagesMonitor) {
              const div = document.createElement('div');
              div.style.marginBottom = '4px';
              div.style.color = 'var(--text-main)';
              div.innerHTML = `<span style="color:var(--accent-soft);">${currentConversationId}</span>: ${text}`;
              adminMessagesMonitor.appendChild(div);
              adminMessagesMonitor.scrollTop = adminMessagesMonitor.scrollHeight;
            }
          }
        }, 400);
        chatInput.value = '';
      });
    }

    /* -------------------------
       TEMPLATE REQUEST (user side) — defensive
    ------------------------- */
    const requestTemplateBtn = document.getElementById('requestTemplateBtn');
    const templateRequestStatus = document.getElementById('templateRequestStatus');
    if (requestTemplateBtn) {
      requestTemplateBtn.addEventListener('click', () => {
        if (templateRequestStatus) templateRequestStatus.textContent = 'Request sent. Waiting for admin approval…';
        // push to mock list
        templateRequests.push({ id: Date.now(), user: 'visitor-' + Math.floor(Math.random() * 1000), status: 'pending' });
      });
    }

    /* -------------------------
       ADMIN LOGIN + DASHBOARD (defensive)
    ------------------------- */
    const adminLoginView = document.getElementById('adminLoginView');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminKeyInput = document.getElementById('adminKey');
    const adminLoginError = document.getElementById('adminLoginError');
    const adminFriendsOnline = document.getElementById('adminFriendsOnline');
    const adminUnknownActive = document.getElementById('adminUnknownActive');
    const adminTotalUsers = document.getElementById('adminTotalUsers');
    const templateRequestsList = document.getElementById('templateRequestsList');

    function renderTemplateRequests() {
      if (!templateRequestsList) return;
      templateRequestsList.innerHTML = '';
      if (templateRequests.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No requests yet.';
        li.style.color = 'var(--text-muted)';
        templateRequestsList.appendChild(li);
        return;
      }
      templateRequests.forEach(req => {
        const li = document.createElement('li');
        li.style.marginBottom = '6px';
        li.innerHTML = `<div><strong>${req.user}</strong> – <span style="color:var(--text-muted);">${req.status}</span></div>`;
        if (req.status === 'pending') {
          const btnApprove = document.createElement('button');
          btnApprove.textContent = 'Approve';
          btnApprove.className = 'btn primary';
          btnApprove.style.padding = '4px 10px';
          btnApprove.style.fontSize = '11px';
          btnApprove.style.marginRight = '4px';
          const btnDeny = document.createElement('button');
          btnDeny.textContent = 'Deny';
          btnDeny.className = 'btn ghost';
          btnDeny.style.padding = '4px 10px';
          btnDeny.style.fontSize = '11px';
          btnApprove.addEventListener('click', () => updateRequestStatus(req.id, 'approved'));
          btnDeny.addEventListener('click', () => updateRequestStatus(req.id, 'denied'));
          li.appendChild(btnApprove);
          li.appendChild(btnDeny);
        }
        templateRequestsList.appendChild(li);
      });
    }
    function updateRequestStatus(id, status) {
      templateRequests = templateRequests.map(r => r.id === id ? { ...r, status } : r);
      renderTemplateRequests();
    }
    function loadAdminData() {
      if (adminFriendsOnline) adminFriendsOnline.textContent = friendsOnline;
      if (adminUnknownActive) adminUnknownActive.textContent = unknownActive;
      if (adminTotalUsers) adminTotalUsers.textContent = totalUsers;
      renderTemplateRequests();
    }
    if (adminLoginForm && adminKeyInput) {
      adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = (adminKeyInput.value || '').trim();
        if (key === 'admin123') {
          isAdmin = true;
          if (adminLoginView) adminLoginView.style.display = 'none';
          if (adminDashboard) adminDashboard.style.display = 'block';
          if (adminLoginError) adminLoginError.textContent = '';
          loadAdminData();
        } else {
          if (adminLoginError) adminLoginError.textContent = "Invalid admin key (mock). Use 'admin123' for now.";
        }
      });
    }

    /* -------------------------
       Admin UI controls (defensive)
    ------------------------- */
    const toggleWaterEffects = document.getElementById('toggleWaterEffects');
    const defaultLampSelect = document.getElementById('defaultLampSelect');
    if (toggleWaterEffects) {
      toggleWaterEffects.addEventListener('change', () => {
        const enabled = toggleWaterEffects.checked;
        const main = document.querySelector('.water-surface-main');
        const deep = document.querySelector('.water-surface-deep');
        if (main) main.style.display = enabled ? 'block' : 'none';
        if (deep) deep.style.display = enabled ? 'block' : 'none';
      });
    }
    if (defaultLampSelect) {
      defaultLampSelect.addEventListener('change', () => {
        const style = defaultLampSelect.value;
        document.documentElement.setAttribute('data-lamp-style', style);
      });
    }

    /* -------------------------
       SPOTLIGHT (cursor spotlight) — fixed implementation
       - Creates #spotlight if missing
       - Smooth follow using rAF
       - Respects prefers-reduced-motion and coarse pointers
    ------------------------- */
    (function initSpotlight() {
      // Respect reduced motion and touch devices
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      if (prefersReducedMotion || isCoarse) {
        // remove existing spotlight if present
        const existing = document.getElementById('spotlight');
        if (existing) existing.remove();
        return;
      }

      let spotlight = document.getElementById('spotlight');
      if (!spotlight) {
        spotlight = document.createElement('div');
        spotlight.id = 'spotlight';
        spotlight.className = 'spotlight';
        // minimal inline styles to ensure it's above content and centered; visual styling handled by CSS
        spotlight.style.position = 'fixed';
        spotlight.style.left = '50%';
        spotlight.style.top = '50%';
        spotlight.style.width = '1px';
        spotlight.style.height = '1px';
        spotlight.style.pointerEvents = 'none';
        spotlight.style.zIndex = '9998';
        document.body.appendChild(spotlight);
      }

      // state
      let targetX = window.innerWidth / 2;
      let targetY = window.innerHeight / 2;
      let currentX = targetX;
      let currentY = targetY;
      const followSpeed = 0.18; // 0..1 (higher = snappier)
      let lastMoveAt = 0;
      let rafId = null;

      function setSpotImmediate(x, y) {
        spotlight.style.left = x + 'px';
        spotlight.style.top = y + 'px';
        spotlight.style.transform = 'translate(-50%, -50%)';
      }

      function animate() {
        currentX += (targetX - currentX) * followSpeed;
        currentY += (targetY - currentY) * followSpeed;
        spotlight.style.left = currentX + 'px';
        spotlight.style.top = currentY + 'px';
        // dim overlay active for a short time after movement
        if (Date.now() - lastMoveAt < 600) spotlight.classList.add('active');
        else spotlight.classList.remove('active');
        rafId = requestAnimationFrame(animate);
      }

      function onMove(e) {
        targetX = e.clientX;
        targetY = e.clientY;
        lastMoveAt = Date.now();
        spotlight.style.opacity = '1';
      }
      function onLeave() {
        spotlight.style.opacity = '0';
      }
      function onFocusIn(e) {
        const tag = (e.target && e.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) spotlight.style.opacity = '0';
      }
      function onFocusOut() { spotlight.style.opacity = '1'; }
      function onResize() {
        targetX = Math.min(window.innerWidth, Math.max(0, targetX));
        targetY = Math.min(window.innerHeight, Math.max(0, targetY));
        currentX = targetX; currentY = targetY;
        setSpotImmediate(currentX, currentY);
      }

      document.addEventListener('mousemove', onMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('blur', onLeave);
      document.addEventListener('focusin', onFocusIn);
      document.addEventListener('focusout', onFocusOut);
      window.addEventListener('resize', onResize);

      // initialize and start loop
      setSpotImmediate(currentX, currentY);
      rafId = requestAnimationFrame(animate);

      // cleanup on unload
      window.addEventListener('beforeunload', () => {
        if (rafId) cancelAnimationFrame(rafId);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
        window.removeEventListener('blur', onLeave);
        document.removeEventListener('focusin', onFocusIn);
        document.removeEventListener('focusout', onFocusOut);
        window.removeEventListener('resize', onResize);
      });
    })();

    /* -------------------------
       End DOMContentLoaded
    ------------------------- */
  }); // DOMContentLoaded
})();
