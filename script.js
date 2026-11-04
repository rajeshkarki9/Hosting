/* ==========================================================================
   HANDCRAFTED STUDIO SCRIPT
   Genuine interactions: Live clock, project filtering, FAQ accordion,
   one-click email copy, budget selector, and dark/light mode toggle.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Live Local Clock
    function updateClock() {
        const timeEl = document.getElementById('liveClock');
        if (!timeEl) return;
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timeEl.textContent = `${hours}:${minutes}:${seconds} (${tz})`;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Dark / Light Mode with LocalStorage
    const themeBtn = document.getElementById('themeBtn');
    const savedTheme = localStorage.getItem('studio_theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', savedTheme);
    renderThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const target = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', target);
            localStorage.setItem('studio_theme', target);
            renderThemeIcon(target);
        });
    }

    function renderThemeIcon(theme) {
        if (!themeBtn) return;
        themeBtn.innerHTML = theme === 'dark'
            ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
            : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }

    // 3. Mobile Navigation Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 4. Sticky Header on Scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (!header) return;
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Spy
        const sections = document.querySelectorAll('section[id], div[id="home"]');
        const scrollPos = window.scrollY + 120;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // 5. Work / Project Filter Tabs
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 6. Interactive FAQ Accordion
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        if (trigger) {
            trigger.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                accordionItems.forEach(i => i.classList.remove('active'));
                if (!isOpen) {
                    item.classList.add('active');
                }
            });
        }
    });

    // 7. One-Click Copy Email to Clipboard
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = document.getElementById('studioEmail').textContent.trim();
            navigator.clipboard.writeText(email).then(() => {
                const prev = copyEmailBtn.textContent;
                copyEmailBtn.textContent = 'Copied!';
                copyEmailBtn.style.background = 'var(--text-main)';
                copyEmailBtn.style.color = 'var(--bg-page)';
                setTimeout(() => {
                    copyEmailBtn.textContent = prev;
                    copyEmailBtn.style.background = '';
                    copyEmailBtn.style.color = '';
                }, 2000);
            });
        });
    }

    // 8. Budget Chip Selection
    const budgetChips = document.querySelectorAll('.budget-chip');
    let selectedBudget = '';
    budgetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            budgetChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            selectedBudget = chip.getAttribute('data-budget');
        });
    });

    // 9. Contact Inquiry Form
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const email = document.getElementById('clientEmail').value.trim();
            const message = document.getElementById('clientMessage').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!name || !email || !message) {
                showStatus('Please complete all required fields.', 'error');
                return;
            }

            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!emailValid) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Button state
            const orig = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending inquiry...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = orig;
                const budgetNote = selectedBudget ? ` (Budget: ${selectedBudget})` : '';
                showStatus(`Thank you, ${name}! Your inquiry${budgetNote} has been received. We will reply within one business day.`, 'success');
                contactForm.reset();
                budgetChips.forEach(c => c.classList.remove('selected'));
                selectedBudget = '';
            }, 800);
        });
    }

    function showStatus(msg, type) {
        if (!formStatus) return;
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = msg;
        setTimeout(() => {
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
        }, 6000);
    }
});
