async function updateRepoDate() {
    try {
        const r = await fetch('https://api.github.com/repos/moonlightrblx/roblox-script');
        if (!r.ok) throw new Error('API error');
        const d = await r.json();
        const date = new Date(d.updated_at); // or d.pushed_at if you want last push
        const txt = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        document.getElementById('update-info').textContent = `(Last updated: ${txt})`;
    } catch (e) {
        console.error(e);
        document.getElementById('update-info').textContent = 'Failed to fetch update date (try using a vpn)';
    }
}
window.addEventListener('load', updateRepoDate);

window.addEventListener('load', () => {
    document.querySelector('.loader-wrapper').classList.add('fade-out');
});

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});


document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-target');
        const code = document.getElementById(id).innerText;
        try {
            await navigator.clipboard.writeText(code);
            btn.innerText = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.innerText = 'Copy';
                btn.classList.remove('copied');
            }, 1500);
        } catch (e) {
            btn.innerText = 'Failed';
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const expanded = q.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.faq-question').forEach(other => {
            other.setAttribute('aria-expanded', 'false');
            other.nextElementSibling.classList.remove('active');
        });
        if (!expanded) {
            q.setAttribute('aria-expanded', 'true');
            q.nextElementSibling.classList.add('active');
        }
    });
});

window.addEventListener('load', () => {
    setTimeout(() => document.querySelector('.loader-wrapper').classList.add('fade-out'), 600);

});
