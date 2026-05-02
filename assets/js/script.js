// Main Scripts
document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle Icon
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;
    const logoImg = document.querySelector('.logo img');

    // Helper: Update Logo based on theme
    const updateLogo = (theme) => {
        // 1. Main Logo
        if (logoImg) {
            const currentSrc = logoImg.getAttribute('src');
            if (theme === 'dark') {
                if (currentSrc.includes('logo.png')) {
                    logoImg.src = currentSrc.replace('logo.png', 'white.png');
                }
            } else {
                if (currentSrc.includes('white.png')) {
                    logoImg.src = currentSrc.replace('white.png', 'logo.png');
                }
            }
        }

        // 2. About Page Image
        const aboutImg = document.querySelector('.about-theme-img');
        if (aboutImg) {
            const currentAboutSrc = aboutImg.getAttribute('src');
            if (theme === 'dark') {
                // Determine if we need to switch to white (dark mode version)
                // Assuming default is 'about-logo.png' (light) and we want 'about-white.png' (dark)
                if (currentAboutSrc.includes('about-logo.png')) {
                    aboutImg.src = currentAboutSrc.replace('about-logo.png', 'about-white.png');
                }
            } else {
                // Switch back to light
                if (currentAboutSrc.includes('about-white.png')) {
                    aboutImg.src = currentAboutSrc.replace('about-white.png', 'about-logo.png');
                }
            }
        }
    };

    // Check LocalStorage
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (icon) icon.classList.replace('fa-moon', 'fa-sun');
        updateLogo('dark');
    } else {
        updateLogo('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (icon) icon.classList.replace('fa-sun', 'fa-moon');
                updateLogo('light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (icon) icon.classList.replace('fa-moon', 'fa-sun');
                updateLogo('dark');
            }
        });
    }

    // --- Modal Logic (Projects & Clients) ---
    const modal = document.getElementById('projectModal');
    const closeModal = document.querySelector('.close-modal');

    // Open Modal
    document.querySelectorAll('.view-project-btn, .client-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!modal) return;

            // Get Data Attributes (Fallback to defaults if not present)
            const title = this.getAttribute('data-title') || this.innerText;
            const desc = this.getAttribute('data-desc') || "Detailed view of the project including structural analysis and design specifications.";
            const img = this.getAttribute('data-img'); // For projects

            // Populate Modal
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalDesc').innerText = desc;

            const modalMainImg = document.getElementById('modalMainImg');
            const modalGallery = document.querySelector('.modal-gallery');

            // Clear existing gallery
            modalGallery.innerHTML = '';

            if (img && modalMainImg) {
                modalMainImg.src = img;
                modalMainImg.style.display = 'block';

                // --- Dynamic Construction Gallery Logic ---
                const type = this.getAttribute('data-type');
                const id = parseInt(this.getAttribute('data-id'));

                if (type === 'construction' && id) {
                    // Show next 4 images (looping if needed, max 16)
                    const totalImages = 16;

                    for (let i = 1; i <= 4; i++) {
                        let nextId = id + i;
                        if (nextId > totalImages) nextId = nextId - totalImages; // Loop back to 1

                        // Handle special case filenames if any (e.g. 5..jpg)
                        // Based on directory listing: 5..jpg exists, others are standard
                        let filename = nextId + '.jpg';
                        if (nextId === 5) filename = '5..jpg';

                        const imgEl = document.createElement('img');
                        imgEl.src = `../assets/images/construction/${filename}`;
                        imgEl.alt = `Gallery Image ${nextId}`;

                        // Add click event to swap main image
                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                        });


                        modalGallery.appendChild(imgEl);
                    }
                } else if (type === 'detailed' && id) {
                    // --- Detailed Drawings Gallery Logic ---
                    const totalImages = 4;

                    // Show all other 3 images as gallery
                    for (let i = 1; i <= 3; i++) {
                        let nextId = id + i;
                        if (nextId > totalImages) nextId = nextId - totalImages;

                        const imgEl = document.createElement('img');
                        imgEl.src = `../assets/images/Detailed Drawings/${nextId}.jpg`;
                        imgEl.alt = `Detailed Drawing ${nextId}`;

                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                        });

                        modalGallery.appendChild(imgEl);
                    }
                } else if (type === '3d-design' && id) {
                    // --- 3D Designs Gallery Logic ---
                    // Range: 7 to 19
                    const minId = 7;
                    const maxId = 19;

                    // Show next 5 images
                    for (let i = 1; i <= 5; i++) {
                        let nextId = id + i;
                        // Wrap around logic
                        if (nextId > maxId) {
                            nextId = minId + (nextId - maxId) - 1;
                        }

                        const imgEl = document.createElement('img');
                        imgEl.src = `../assets/images/3D Designs/${nextId}.jpg`;
                        imgEl.alt = `3D Design ${nextId}`;

                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                        });

                        modalGallery.appendChild(imgEl);
                    }
                } else if (type === 'client') {
                    // --- Client Gallery Logic ---
                    const clientImages = [
                        'DR Collage of Pharmacy.jpg',
                        'DR International School.jpg',
                        'Mkg mega food.jpg',
                        'SR GLOBAL SCHOOL.jpg',
                        'sg ornate.jpg',
                        'shri ramkeshwar global school.jpg'
                    ];

                    // Identify current image filename to exclude it (optional, but good UX)
                    const currentSrc = modalMainImg.src;
                    const currentFilename = currentSrc.substring(currentSrc.lastIndexOf('/') + 1);

                    // Filter out current image
                    const availableImages = clientImages.filter(img => decodeURIComponent(currentFilename) !== img);

                    // Shuffle and pick 3
                    const shuffled = availableImages.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 3);

                    selected.forEach(filename => {
                        const imgEl = document.createElement('img');
                        imgEl.src = `../assets/images/client/${filename}`;
                        imgEl.alt = `Related Client Project`;

                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                        });

                        modalGallery.appendChild(imgEl);
                    });
                } else {
                    // Fallback / Standard Logic (Placeholders)
                    // Placeholder gallery images (reusing placeholders)
                    const placeholderUrls = [
                        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
                        "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    ];

                    placeholderUrls.forEach(url => {
                        const imgEl = document.createElement('img');
                        imgEl.src = url;
                        imgEl.addEventListener('click', function () {
                            modalMainImg.src = this.src;
                        });
                        modalGallery.appendChild(imgEl);
                    });
                }

            } else if (modalMainImg) {
                modalMainImg.style.display = 'none';
            }

            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', function () {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
    // --- Service Image Sliders ---
    function initServiceSliders() {
        const sliders = document.querySelectorAll('.service-slider');

        sliders.forEach(slider => {
            const slides = slider.querySelectorAll('.slide');
            if (slides.length === 0) return;

            let currentSlide = 0;

            // Set first slide active if not already
            if (!slider.querySelector('.slide.active')) {
                slides[0].classList.add('active');
            }

            setInterval(() => {
                slides[currentSlide].classList.remove('active');
                currentSlide = (currentSlide + 1) % slides.length;
                slides[currentSlide].classList.add('active');
            }, 3500); // Change every 3.5 seconds
        });
    }

    initServiceSliders();

    // --- Floating WhatsApp Button Injection ---
    const waFloat = document.createElement('a');
    waFloat.href = "https://wa.me/918439007837";
    waFloat.className = "whatsapp-float";
    waFloat.target = "_blank";
    waFloat.innerHTML = '<i class="fab fa-whatsapp whatsapp-icon"></i>';
    document.body.appendChild(waFloat);

    // --- Contact Form Auto-Fill ---
    const urlParams = new URLSearchParams(window.location.search);
    const subject = urlParams.get('subject');
    const subjectInput = document.getElementById('subjectInput');

    if (subject && subjectInput) {
        subjectInput.value = "Enquiry about: " + subject;
    }

    // --- Services Page - Sticky Scrollspy ---
    const serviceSections = document.querySelectorAll('.service-section');
    const serviceLinks = document.querySelectorAll('.service-link');

    if (serviceSections.length > 0) {
        // 1. Reveal Animation Observer
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        serviceSections.forEach(section => revealObserver.observe(section));

        // 2. Navigation Active State Observer
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all
                    serviceLinks.forEach(link => link.classList.remove('active'));

                    // Add active to corresponding link
                    const id = entry.target.getAttribute('id');
                    const activeLink = document.querySelector(`.service-link[href="#${id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' }); // Trigger when section is in middle of viewport

        serviceSections.forEach(section => navObserver.observe(section));
    }
    // --- Contact Form Handling with Google Apps Script ---
    const contactForm = document.getElementById('contactForm');

    // REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT URL
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxu-DfbgqKr0kOaqNMSgv6iX835DmDBO3kb1ULusjQwTzMEIe0zCCnnznbQVwwx0Ls/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');

            // 1. Show Loading State
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';

            // 2. Prepare Data
            const formData = new FormData(contactForm);

            // 3. Send to Google Sheets
            fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        showToast('Message sent successfully!', 'success');
                        contactForm.reset();
                    } else {
                        showToast('Error sending message: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    showToast('Network error! Check console.', 'error');
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    // 4. Reset Button
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                });
        });
    }

    // --- Toast Notification Logic ---
    window.showToast = function (message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;

        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }


    // --- About Page: Number Counters ---
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + "+"; // Add + sign
                        }
                    };
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // --- Founder Page: Skill Bars Animation ---
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width;
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }
    // --- Global Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // --- Dynamic Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Legal & Page Layouts: Scrollspy & Sticky TOC Logic ---
    // Target both .legal-card (legacy) and .content-card (new standard)
    const contentCards = document.querySelectorAll('.legal-card, .content-card');
    const tocLinks = document.querySelectorAll('.toc-link');

    if (contentCards.length > 0 && tocLinks.length > 0) {
        const pageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active from all
                    tocLinks.forEach(link => link.classList.remove('active'));

                    // Add active to corresponding link
                    const id = entry.target.getAttribute('id');
                    if (id) {
                        const activeLink = document.querySelector(`.toc-link[href="#${id}"]`);
                        if (activeLink) {
                            activeLink.classList.add('active');
                            // Optional: Scroll TOC to keep active link in view
                            // activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }
                }
            });
        }, { rootMargin: '-30% 0px -60% 0px' });

        contentCards.forEach(card => pageObserver.observe(card));
    }
    // --- View More / View Less Logic ---
    const grids = document.querySelectorAll('.services-grid');
    const LIMIT = 6;

    grids.forEach(grid => {
        const cards = grid.querySelectorAll('.service-card');
        if (cards.length > LIMIT) {
            // 1. Hide items beyond limit
            for (let i = LIMIT; i < cards.length; i++) {
                cards[i].style.display = 'none';
            }

            // 2. Add Button Container
            const btnContainer = document.createElement('div');
            btnContainer.style.textAlign = 'center';
            btnContainer.style.marginTop = '30px';
            btnContainer.style.width = '100%';
            btnContainer.style.gridColumn = '1 / -1'; // Span full width if inserted into grid, but we will put it after

            // 3. Add Button
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.innerText = 'View More';
            btnContainer.appendChild(btn);

            // Insert after the grid
            grid.parentNode.insertBefore(btnContainer, grid.nextSibling);

            // 4. Click Event
            btn.addEventListener('click', () => {
                const isExpanded = btn.innerText === 'View Less';

                if (isExpanded) {
                    // Collapse
                    for (let i = LIMIT; i < cards.length; i++) {
                        cards[i].style.display = 'none';
                    }
                    btn.innerText = 'View More';
                    // Scroll back to top of grid
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    // Expand
                    for (let i = LIMIT; i < cards.length; i++) {
                        cards[i].style.display = 'flex'; // Restore display (flex used in css)
                    }
                    btn.innerText = 'View Less';
                }
            });
        }
    });

});
