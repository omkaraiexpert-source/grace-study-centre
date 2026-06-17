// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.boxShadow = window.scrollY > 50
    ? '0 2px 15px rgba(0,0,0,0.15)'
    : '0 2px 10px rgba(0,0,0,0.1)';
});

// Animated counters
const counters = document.querySelectorAll('.num');
const speed = 80;

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
      const current = +counter.innerText;
      const inc = Math.ceil(target / speed);
      if (current < target) {
        counter.innerText = current + inc > target ? target : current + inc;
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
};

// Trigger counters on scroll
const aboutSection = document.querySelector('.about');
let counted = false;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      animateCounters();
    }
  });
}, { threshold: 0.5 });

observer.observe(aboutSection);

// Supabase Setup
const SUPABASE_URL = 'https://icvfsotopesbjenfavws.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uESOnu4q5dGfG02nI2qa8A_OlwimYOY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Contact form
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = this.querySelector('.btn');
  const orig = btn.textContent;

  const formData = {
    name: this.querySelectorAll('input')[0].value,
    email: this.querySelectorAll('input')[1].value,
    phone: this.querySelectorAll('input')[2].value,
    course: this.querySelector('select').value,
    message: this.querySelector('textarea').value
  };

  const { error } = await supabase.from('contact_submissions').insert([formData]);

  if (!error) {
    btn.textContent = 'Message Sent!';
    btn.style.background = '#27ae60';
    this.reset();
  } else {
    btn.textContent = 'Error! Try Again';
    btn.style.background = '#e74c3c';
  }

  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 3000);
});
