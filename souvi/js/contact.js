'use strict';

// Initialize EmailJS - update with your actual keys
(function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: "YOUR_PUBLIC_KEY" });
  }
})();

const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');
const queryTA = document.getElementById('query');
const charCounter = document.getElementById('charCounter');

// Character counter
queryTA?.addEventListener('input', function() {
  const len = this.value.length;
  if (charCounter) {
    charCounter.textContent = `${len} character${len !== 1 ? 's' : ''}`;
    charCounter.style.color = len >= 10 ? 'var(--cyan)' : 'var(--gray-500)';
  }
});

// Validation
function validateForm(d) {
  const errors = [];
  if (d.name.trim().length < 2) errors.push('Please enter a valid name (at least 2 characters).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) errors.push('Please enter a valid email address.');
  if (d.mobile.replace(/\D/g, '').length < 10) errors.push('Please enter a valid mobile number (at least 10 digits).');
  if (d.query.trim().length < 10) errors.push('Please provide more details (at least 10 characters).');
  return errors;
}

function showStatus(msg, type) {
  if (!formStatus) return;
  formStatus.textContent = msg;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => { formStatus.style.display = 'none'; }, 10000);
}

// Email blur validation
document.getElementById('email')?.addEventListener('blur', function() {
  if (this.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) {
    this.style.borderColor = 'rgba(198,40,40,0.5)';
  } else { this.style.borderColor = ''; }
});

document.getElementById('mobile')?.addEventListener('blur', function() {
  if (this.value && this.value.replace(/\D/g, '').length < 10) {
    this.style.borderColor = 'rgba(198,40,40,0.5)';
  } else { this.style.borderColor = ''; }
});

document.querySelectorAll('.premium-input').forEach(inp => {
  inp.addEventListener('input', function() { this.style.borderColor = ''; });
});

// Form submission
let isSubmitting = false;

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  formStatus.style.display = 'none';

  const formData = {
    name: document.getElementById('name').value,
    mobile: document.getElementById('mobile').value,
    email: document.getElementById('email').value,
    service: document.getElementById('service').value || 'Not specified',
    query: document.getElementById('query').value
  };

  const errors = validateForm(formData);
  if (errors.length > 0) { showStatus(errors[0], 'error'); return; }

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').style.display = 'none';
  submitBtn.querySelector('.btn-loader').style.display = 'flex';

  try {
    if (typeof emailjs !== 'undefined') {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: formData.name,
        from_email: formData.email,
        mobile: formData.mobile,
        service: formData.service,
        message: formData.query,
        to_name: 'Souvi Engineering'
      });
    }
    showStatus('✓ Thank you! Your message has been sent. We\'ll get back to you within 24 hours.', 'success');
    contactForm.reset();
    if (charCounter) { charCounter.textContent = '0 characters'; charCounter.style.color = ''; }
    createConfetti();
  } catch (err) {
    console.error(err);
    showStatus('Something went wrong. Please contact us directly at souviengg79@gmail.com', 'error');
  } finally {
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').style.display = '';
    submitBtn.querySelector('.btn-loader').style.display = 'none';
  }
});

// Confetti
function createConfetti() {
  const colors = ['#0A2B6E','#00A8E8','#1565C0','#4FC3F7'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.style.cssText = `position:fixed;width:9px;height:9px;background:${colors[i%4]};
      top:-10px;left:${Math.random()*100}%;opacity:1;z-index:9999;pointer-events:none;
      border-radius:${Math.random()>0.5?'50%':'2px'}`;
    document.body.appendChild(c);
    c.animate([
      { transform: 'translateY(0) rotate(0)', opacity: 1 },
      { transform: `translateY(${window.innerHeight}px) rotate(${Math.random()*720}deg)`, opacity: 0 }
    ], { duration: 2000 + Math.random()*1000, easing: 'ease-in' }).onfinish = () => c.remove();
  }
}

// Keyboard shortcut
document.addEventListener('keydown', e => {
  if ((e.metaKey||e.ctrlKey) && e.key==='Enter' && document.activeElement===queryTA) {
    e.preventDefault();
    contactForm.dispatchEvent(new Event('submit'));
  }
});

// URL param auto-fill
function autoFillService() {
  const params = new URLSearchParams(window.location.search);
  const svc = params.get('service');
  const sel = document.getElementById('service');
  if (svc && sel) {
    const match = Array.from(sel.options).find(o => o.value.toLowerCase().includes(svc.toLowerCase()));
    if (match) sel.value = match.value;
  }
}
window.addEventListener('DOMContentLoaded', autoFillService);
