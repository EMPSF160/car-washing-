document.addEventListener('DOMContentLoaded', () => {
    // --- Lucide Icons initialization helper ---
    const refreshIcons = () => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    };
    refreshIcons();

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to sleek dark mode for auto detailing
    
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            htmlElement.classList.toggle('dark');
            const theme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            refreshIcons();
        });
    }

    // --- RTL Toggle ---
    const rtlBtn = document.getElementById('rtl-toggle');
    const currentDir = localStorage.getItem('dir') || 'ltr';
    htmlElement.setAttribute('dir', currentDir);

    if (rtlBtn) {
        rtlBtn.addEventListener('click', () => {
            const newDir = htmlElement.getAttribute('dir') === 'ltr' ? 'rtl' : 'ltr';
            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    }

    // --- Mobile Navigation ---
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            refreshIcons();
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            });
        });
    }

    // --- Scroll to Top ---
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn?.classList.remove('opacity-0', 'invisible');
            scrollTopBtn?.classList.add('opacity-100', 'visible');
        } else {
            scrollTopBtn?.classList.add('opacity-0', 'invisible');
            scrollTopBtn?.classList.remove('opacity-100', 'visible');
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Sticky Header Styling ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header?.classList.add('shadow-lg', 'shadow-emerald-950/20', 'py-3');
            header?.classList.remove('py-5');
        } else {
            header?.classList.remove('shadow-lg', 'shadow-emerald-950/20', 'py-3');
            header?.classList.add('py-5');
        }
    });

    // --- Active Link Highlight ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a, #mobile-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('text-emerald-400', 'font-black');
        }
    });

    // --- Interactive Price Estimator / Vehicle Calculator ---
    const vehicleButtons = document.querySelectorAll('[data-vehicle-tier]');
    const packageButtons = document.querySelectorAll('[data-pkg-price]');
    const addonCheckboxes = document.querySelectorAll('[data-addon-price]');
    const totalDisplay = document.getElementById('estimator-total');
    const vehicleLabel = document.getElementById('estimator-vehicle-label');
    const packageLabel = document.getElementById('estimator-pkg-label');
    const durationLabel = document.getElementById('estimator-duration');
    const bookEstimatorBtn = document.getElementById('estimator-book-btn');

    let currentVehicleMultiplier = 1.0;
    let currentVehicleName = 'Sedan / Coupe';
    let basePkgPrice = 89;
    let currentPkgName = 'Interior Pure Elite';
    let currentBaseDuration = 75;

    function calculateEstimate() {
        if (!totalDisplay) return;

        let addonsTotal = 0;
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                addonsTotal += parseFloat(cb.getAttribute('data-addon-price') || 0);
            }
        });

        const calculated = Math.round((basePkgPrice * currentVehicleMultiplier) + addonsTotal);
        totalDisplay.textContent = `$${calculated}`;

        if (vehicleLabel) vehicleLabel.textContent = currentVehicleName;
        if (packageLabel) packageLabel.textContent = currentPkgName;
        if (durationLabel) {
            const calculatedDuration = Math.round(currentBaseDuration * (currentVehicleMultiplier >= 1.2 ? 1.2 : 1.0));
            durationLabel.textContent = `~${calculatedDuration} mins`;
        }

        if (bookEstimatorBtn) {
            bookEstimatorBtn.href = `signup.html?plan=${encodeURIComponent(currentPkgName)}&vehicle=${encodeURIComponent(currentVehicleName)}&price=${calculated}`;
        }
    }

    vehicleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            vehicleButtons.forEach(b => {
                b.classList.remove('border-emerald-500', 'bg-emerald-500/10', 'text-emerald-400');
                b.classList.add('border-slate-700/60', 'text-slate-400');
            });
            btn.classList.remove('border-slate-700/60', 'text-slate-400');
            btn.classList.add('border-emerald-500', 'bg-emerald-500/10', 'text-emerald-400');

            currentVehicleMultiplier = parseFloat(btn.getAttribute('data-vehicle-tier') || 1.0);
            currentVehicleName = btn.getAttribute('data-vehicle-name') || 'Sedan';
            calculateEstimate();
        });
    });

    packageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            packageButtons.forEach(b => {
                b.classList.remove('border-emerald-500', 'bg-emerald-500/15', 'shadow-emerald-500/20');
                b.classList.add('border-slate-800', 'bg-slate-900/60');
            });
            btn.classList.remove('border-slate-800', 'bg-slate-900/60');
            btn.classList.add('border-emerald-500', 'bg-emerald-500/15', 'shadow-emerald-500/20');

            basePkgPrice = parseFloat(btn.getAttribute('data-pkg-price') || 89);
            currentPkgName = btn.getAttribute('data-pkg-name') || 'Interior Pure Elite';
            currentBaseDuration = parseInt(btn.getAttribute('data-pkg-duration') || 75);
            calculateEstimate();
        });
    });

    addonCheckboxes.forEach(cb => {
        cb.addEventListener('change', calculateEstimate);
    });

    calculateEstimate();

    // --- Before & After Slider Drag ---
    const comparisonWrapper = document.getElementById('comparison-wrapper');
    const beforeImageWrapper = document.getElementById('comparison-before-wrapper');
    const sliderHandle = document.getElementById('comparison-handle');

    if (comparisonWrapper && beforeImageWrapper && sliderHandle) {
        let isDown = false;

        const updateSliderPosition = (xCoord) => {
            const rect = comparisonWrapper.getBoundingClientRect();
            let x = xCoord - rect.left;
            if (x < 20) x = 20;
            if (x > rect.width - 20) x = rect.width - 20;
            const percent = (x / rect.width) * 100;
            beforeImageWrapper.style.width = `${percent}%`;
            sliderHandle.style.left = `${percent}%`;
        };

        const onStart = (e) => {
            isDown = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSliderPosition(clientX);
        };

        const onMove = (e) => {
            if (!isDown) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateSliderPosition(clientX);
        };

        const onEnd = () => {
            isDown = false;
        };

        comparisonWrapper.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        comparisonWrapper.addEventListener('touchstart', onStart, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onEnd);
    }

    // --- FAQ Accordions ---
    const faqItems = document.querySelectorAll('.faq-toggle-btn');
    faqItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const body = btn.nextElementSibling;
            const icon = btn.querySelector('.faq-icon');
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            faqItems.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    const otherBody = otherBtn.nextElementSibling;
                    const otherIcon = otherBtn.querySelector('.faq-icon');
                    if (otherBody) otherBody.classList.add('hidden');
                    if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle this one
            if (isExpanded) {
                btn.setAttribute('aria-expanded', 'false');
                body?.classList.add('hidden');
                if (icon) icon.style.transform = 'rotate(0deg)';
            } else {
                btn.setAttribute('aria-expanded', 'true');
                body?.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // --- ZIP Code Service Area Checker ---
    const zipInput = document.getElementById('zip-code-input');
    const zipBtn = document.getElementById('zip-code-btn');
    const zipResult = document.getElementById('zip-code-result');

    if (zipBtn && zipInput && zipResult) {
        zipBtn.addEventListener('click', () => {
            const val = zipInput.value.trim();
            if (val.length < 3) {
                zipResult.innerHTML = `<span class="text-rose-400 font-bold flex items-center gap-1.5"><i data-lucide="alert-circle" class="w-4 h-4"></i> Please enter a valid 5-digit ZIP code.</span>`;
                zipResult.classList.remove('hidden');
            } else {
                zipResult.innerHTML = `<span class="text-emerald-400 font-bold flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4"></i> Fantastic news! HydroShine mobile van teams operate daily in ZIP ${val}. Estimated arrival within 45 mins of booking.</span>`;
                zipResult.classList.remove('hidden');
            }
            refreshIcons();
        });
    }

    // --- Password Toggle ---
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.parentElement.querySelector('input');
            const icon = toggle.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            refreshIcons();
        });
    });

    // --- Video Showcase Play & Sound Controls ---
    const videoControlButtons = document.querySelectorAll('[data-video-control]');
    videoControlButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.getAttribute('data-video-control');
            const targetId = btn.getAttribute('data-target');
            const video = document.getElementById(targetId);
            if (!video) return;

            if (action === 'toggle-play') {
                const icon = btn.querySelector('.play-icon') || btn.querySelector('i');
                if (video.paused) {
                    video.play();
                    if (icon) icon.setAttribute('data-lucide', 'pause');
                    btn.setAttribute('aria-label', `Pause ${targetId}`);
                } else {
                    video.pause();
                    if (icon) icon.setAttribute('data-lucide', 'play');
                    btn.setAttribute('aria-label', `Play ${targetId}`);
                }
                refreshIcons();
            } else if (action === 'toggle-sound') {
                const icon = btn.querySelector('.sound-icon') || btn.querySelector('i');
                video.muted = !video.muted;
                if (video.muted) {
                    if (icon) icon.setAttribute('data-lucide', 'volume-x');
                    btn.setAttribute('aria-label', `Unmute ${targetId}`);
                } else {
                    if (icon) icon.setAttribute('data-lucide', 'volume-2');
                    btn.setAttribute('aria-label', `Mute ${targetId}`);
                }
                refreshIcons();
            }
        });
    });

    // Allow clicking directly on the video itself to toggle play/pause
    ['video-left', 'video-right'].forEach(id => {
        const vid = document.getElementById(id);
        if (vid) {
            vid.style.cursor = 'pointer';
            vid.addEventListener('click', () => {
                const playBtn = document.querySelector(`[data-video-control="toggle-play"][data-target="${id}"]`);
                if (playBtn) playBtn.click();
            });
        }
    });
});
