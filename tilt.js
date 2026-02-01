const tiltCard = document.querySelector('.tilt-card');
const img = tiltCard.querySelector('img');

const maxTilt = 12;      // degrees
const perspective = 1000;
const speed = 0.15;      // transition time (seconds)

tiltCard.style.perspective = `${perspective}px`;
img.style.transition = `transform ${speed}s ease-out`;

tiltCard.addEventListener('mousemove', e => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * maxTilt;
    const tiltY = ((centerX - x) / centerX) * maxTilt;

    img.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.05)`;
});

tiltCard.addEventListener('mouseleave', () => {
    img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
});
