const lenis = new Lenis({
    duration: 1.5, 
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        lenis.scrollTo(targetId, { offset: -100, duration: 1.5 });
    });
});

const phrases = ["Initializing system...", "Loading IT Student profile...", "Senior Council Officer...", "Ready for Internship..."];
let i = 0, j = 0; let currentPhrase = []; let isDeleting = false; const textElement = document.getElementById('type');

function typeLoop() {
    textElement.innerHTML = currentPhrase.join('');
    if (i < phrases.length) {
        if (!isDeleting && j <= phrases[i].length) { currentPhrase.push(phrases[i][j]); j++; }
        if (isDeleting && j <= phrases[i].length) { currentPhrase.pop(phrases[i][j]); j--; }
        textElement.innerHTML = currentPhrase.join('');
        if (j == phrases[i].length) { isDeleting = true; setTimeout(typeLoop, 1500); return; }
        if (isDeleting && j === 0) { currentPhrase = []; isDeleting = false; i++; if (i == phrases.length) { i = 2; } }
    }
    setTimeout(typeLoop, isDeleting ? 30 : 60 + Math.random() * 40);
}
setTimeout(typeLoop, 500);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.observer-item').forEach(item => {
    observer.observe(item);
});

const modal = document.getElementById('card-modal');
const modalBody = document.getElementById('modal-body-content');
const closeBtn = document.getElementById('close-modal-btn');
const cards = document.querySelectorAll('.tech-card');
let modalLenis;

cards.forEach(card => {
    card.addEventListener('click', () => {
        modalBody.innerHTML = card.innerHTML;
        modal.classList.add('active');
        
        lenis.stop(); 

        const modalBox = document.getElementById('modal-box');
        modalBox.scrollTop = 0;

        modalLenis = new Lenis({
            wrapper: modalBox,
            content: document.querySelector('.modal-scroll-content'),
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
        });

        function modalRaf(time) {
            if (modalLenis) {
                modalLenis.raf(time);
                requestAnimationFrame(modalRaf);
            }
        }
        requestAnimationFrame(modalRaf);
    });
});

function closeModal() {
    modal.classList.remove('active');
    lenis.start();
    
    if (modalLenis) {
        modalLenis.destroy();
        modalLenis = null;
    }
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });