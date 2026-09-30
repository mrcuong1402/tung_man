/* ==========================================
   WEDDING INVITATION INTERACTIVE JAVASCRIPT
   Bride: Thu Mận | Groom: Thanh Tùng
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. ENVELOPE OPENING EFFECT & MUSIC AUTO-PLAY
    const envelopeScreen = document.getElementById('envelopeScreen');
    const openBtn = document.getElementById('openBtn');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = false;

    openBtn.addEventListener('click', () => {
        // Fade out envelope screen
        envelopeScreen.style.opacity = '0';
        envelopeScreen.style.transform = 'translateY(-100%)';

        setTimeout(() => {
            envelopeScreen.style.display = 'none';
            mainContent.classList.remove('hidden-content');
            initPetals(); // Start petals after opening
        }, 800);

        // Try playing background music
        bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        }).catch(err => {
            console.log("Autoplay prevented by browser:", err);
        });
    });

    // Music toggle button handler
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.classList.remove('playing');
            isMusicPlaying = false;
        } else {
            bgMusic.play();
            musicToggle.classList.add('playing');
            isMusicPlaying = true;
        }
    });

    // 2. COUNTDOWN TIMER TO 15/10/2026 10:00:00
    const targetDate = new Date('2026-10-15T10:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            document.getElementById('timer').innerHTML = "<h3>HÔN LỄ ĐANG DIỄN RA!</h3>";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 3. PHOTO CAROUSEL SYSTEM
    const carouselTrack = document.getElementById('carouselTrack');
    const slides = Array.from(carouselTrack.children);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    let currentIndex = 0;
    let autoSlideTimer;

    // Create thumbnail dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach(d => d.classList.remove('active'));
        dots[index].classList.add('active');
        currentIndex = index;
    }

    prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        resetAutoSlide();
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        resetAutoSlide();
    });

    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    startAutoSlide();

    // Touch Swipe Support for Mobile Carousel
    let startX = 0;
    let endX = 0;
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            goToSlide(currentIndex + 1);
            resetAutoSlide();
        } else if (endX - startX > 50) {
            goToSlide(currentIndex - 1);
            resetAutoSlide();
        }
    });

    // 4. LIGHTBOX MODAL FOR PHOTO ZOOM
    window.openLightbox = function(index) {
        const lightboxModal = document.getElementById('lightboxModal');
        const lightboxImg = document.getElementById('lightboxImg');
        const slideImgs = document.querySelectorAll('.carousel-slide img');
        
        window.currentLightboxIndex = index;
        lightboxImg.src = slideImgs[index].src;
        lightboxModal.classList.add('active');
    };

    window.closeLightbox = function() {
        document.getElementById('lightboxModal').classList.remove('active');
    };

    window.changeLightboxSlide = function(direction) {
        const slideImgs = document.querySelectorAll('.carousel-slide img');
        window.currentLightboxIndex = (window.currentLightboxIndex + direction + slideImgs.length) % slideImgs.length;
        document.getElementById('lightboxImg').src = slideImgs[window.currentLightboxIndex].src;
    };

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });

    // 5. GUEST WISHES FORM & WALL
    const wishForm = document.getElementById('wishForm');
    const wishesWall = document.getElementById('wishesWall');

    // Load stored wishes from LocalStorage
    function loadWishes() {
        const storedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        storedWishes.forEach(wish => appendWishToWall(wish.author, wish.content, wish.date));
    }

    function appendWishToWall(author, content, dateStr) {
        const wishCard = document.createElement('div');
        wishCard.classList.add('wish-card');
        wishCard.innerHTML = `
            <div class="wish-header">
                <strong>${escapeHtml(author)}</strong>
                <span class="wish-date">${dateStr}</span>
            </div>
            <p class="wish-text">"${escapeHtml(content)}"</p>
        `;
        wishesWall.prepend(wishCard);
    }

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('wishAuthor').value;
        const content = document.getElementById('wishContent').value;
        const dateStr = 'Vừa xong';

        appendWishToWall(author, content, dateStr);

        // Save to LocalStorage
        const storedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        storedWishes.push({ author, content, date: new Date().toLocaleDateString('vi-VN') });
        localStorage.setItem('wedding_wishes', JSON.stringify(storedWishes));

        wishForm.reset();
    });

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    loadWishes();

    // 6. FALLING PETALS ANIMATION
    function initPetals() {
        const canvas = document.getElementById('petalCanvas');
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const petalCount = 25;
        const petals = [];

        for (let i = 0; i < petalCount; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height - height,
                size: Math.random() * 10 + 8,
                speedY: Math.random() * 1.5 + 0.8,
                speedX: Math.random() * 1 - 0.5,
                angle: Math.random() * 360,
                spin: Math.random() * 2 - 1,
                opacity: Math.random() * 0.5 + 0.5
            });
        }

        function drawPetal(p) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;

            ctx.beginPath();
            ctx.fillStyle = '#e8a5b8'; // Soft pink/rose petal
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
            ctx.fill();

            ctx.restore();
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            petals.forEach(p => {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) + p.speedX;
                p.angle += p.spin;

                if (p.y > height + 20) {
                    p.y = -20;
                    p.x = Math.random() * width;
                }

                drawPetal(p);
            });

            requestAnimationFrame(render);
        }

        render();
    }

});
