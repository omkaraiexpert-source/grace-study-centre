// === SUPABASE SETUP ===
const SUPABASE_URL = 'https://icvfsotopesbjenfavws.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uESOnu4q5dGfG02nI2qa8A_OlwimYOY';
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// === MOBILE MENU ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('active')));

// === NAVBAR SCROLL ===
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// === COUNTER ANIMATION ===
const counters = document.querySelectorAll('.counter');
let counterDone = false;

const animateCounters = () => {
  counters.forEach(c => {
    const target = +c.getAttribute('data-target');
    const inc = Math.ceil(target / 80);
    const update = () => {
      const cur = +c.innerText;
      if (cur < target) { c.innerText = cur + inc > target ? target : cur + inc; requestAnimationFrame(update); }
      else c.innerText = target;
    };
    update();
  });
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting && !counterDone) { counterDone = true; animateCounters(); } });
}, { threshold: 0.3 });
const trustBar = document.querySelector('.trust-bar');
if (trustBar) counterObserver.observe(trustBar);

// === TESTIMONIAL SLIDER ===
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-card');
const dots = document.querySelector('.slider-dots');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

if (slides.length && dots) {
  slides.forEach((_, i) => { const d = document.createElement('span'); if (i === 0) d.classList.add('active'); dots.appendChild(d); });
  const dotEls = dots.querySelectorAll('span');

  const goToSlide = (idx) => {
    currentSlide = idx;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  };

  prevBtn?.addEventListener('click', () => goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1));
  nextBtn?.addEventListener('click', () => goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1));
  dotEls.forEach((d, i) => d.addEventListener('click', () => goToSlide(i)));

  setInterval(() => goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1), 5000);
}

// === GALLERY FILTERS ===
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.classList.contains(filter)) item.style.display = 'block';
      else item.style.display = 'none';
    });
  });
});

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  });
});

// === FADE-UP ANIMATION ===
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
fadeEls.forEach(el => fadeObserver.observe(el));

// === FORM SUBMISSION ===
document.getElementById('contactForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn');
  const orig = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.disabled = true;

  const inputs = this.querySelectorAll('input');
  const formData = {
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    course: this.querySelectorAll('select')[0].value,
    batch: this.querySelectorAll('select')[1]?.value || '',
    message: this.querySelector('textarea').value
  };

  try {
    const { error } = await sb.from('contact_submissions').insert([formData]);
    if (error) throw error;
    btn.innerHTML = '✓ Demo Booked!';
    btn.style.background = '#22c55e';
    this.reset();
  } catch (err) {
    btn.innerHTML = 'Error! Try Again';
    btn.style.background = '#ef4444';
  }

  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 3000);
});

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
