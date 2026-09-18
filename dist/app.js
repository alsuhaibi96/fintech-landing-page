// Optional production destinations. Empty values use the interactive demo flows.
const destinations = { signup: '', contact: '', login: '' };
const panels = {
  payments: ['Payments that move with you', 'Bring business payments into one place, with a clear view of what’s coming in and what’s going out.'],
  terms: ['Give your business room to grow', 'Flexible payment terms can help businesses align payments with their cash flow.'],
  collections: ['Keep receivables moving', 'A more organized approach to invoices, payment reminders and collections.'],
  about: ['A new perspective on payments', 'Nickel brings payments, net terms and collections together around one idea: helping businesses move forward.'],
  pricing: ['Let’s find the right fit', 'Pricing details will be available when this service launches.'],
  accountants: ['More clarity for every client', 'A shared view of business payments and receivables, designed to make the day-to-day easier.'],
  signup: ['Make your next move', 'Choose a workspace to explore. No signup required.'],
  contact: ['Let’s talk business', 'Try a 15-minute introduction. Choose a sample time below.'],
  login: ['Welcome back', 'Take a look around your sample account. No credentials needed.']
};
const dialog = document.querySelector('dialog');
const nav = document.querySelector('nav');
const mobileToggle = document.querySelector('.mobile-toggle');
const dropdownTriggers = [...document.querySelectorAll('.nav-dropdown > button')];
function closeDropdowns(except) {
  dropdownTriggers.forEach(button => {
    if (button === except) return;
    button.setAttribute('aria-expanded', 'false');
    document.getElementById(button.getAttribute('aria-controls')).hidden = true;
  });
}
function closeNavigation() {
  nav.classList.remove('open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', 'Open navigation');
  closeDropdowns();
}
mobileToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
dropdownTriggers.forEach(button => button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  closeDropdowns(button);
  button.setAttribute('aria-expanded', String(open));
  document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
}));
document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) closeDropdowns();
  if (!event.target.closest('.header')) closeNavigation();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const expanded = dropdownTriggers.find(button => button.getAttribute('aria-expanded') === 'true');
    if (expanded) { closeDropdowns(); expanded.focus(); }
    else if (nav.classList.contains('open')) { closeNavigation(); mobileToggle.focus(); }
  }
});
document.querySelectorAll('[data-panel], [data-action]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.panel || button.dataset.action;
  if (destinations[key]) { window.location.assign(destinations[key]); return; }
  closeNavigation();
  document.getElementById('dialog-title').textContent = panels[key][0];
  document.getElementById('dialog-description').textContent = panels[key][1];
  document.getElementById('dialog-extra').textContent = ['signup', 'login', 'contact', 'pricing'].includes(key) ? '' : 'Explore the concept. Product availability and details will be announced at launch.';
  renderDemo(key);
  dialog.showModal();
  document.body.classList.add('dialog-open');
}));
document.querySelectorAll('.close-dialog, .dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
const video = document.querySelector('video');
const motionToggle = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateMotionButton() {
  motionToggle.classList.toggle('is-paused', video.paused);
  const label = video.paused ? 'Play background animation' : 'Pause background animation';
  motionToggle.setAttribute('aria-label', label);
  motionToggle.title = label;
}
function applyMotionPreference() { if (reducedMotion.matches) { video.removeAttribute('autoplay'); video.pause(); } else { video.play().catch(updateMotionButton); } }
motionToggle.addEventListener('click', () => { if (video.paused) video.play().catch(updateMotionButton); else video.pause(); });
video.addEventListener('play', updateMotionButton);
video.addEventListener('pause', updateMotionButton);
reducedMotion.addEventListener('change', applyMotionPreference);
applyMotionPreference();
updateMotionButton();

function renderDemo(key) {
  const extra = document.getElementById('dialog-extra');
  const done = document.querySelector('.dialog-done');
  done.hidden = false;
  document.querySelector('.dialog-eyebrow').textContent = 'NICKEL · DEMO';
  if (key === 'signup') {
    extra.innerHTML = '<div class="demo-options"><button data-workspace="Business">Business <span>Payments, terms and collections</span></button><button data-workspace="Accountant">Accountant <span>A clearer view of your clients</span></button></div><p class="demo-note">Interactive preview. No account is created.</p>';
    extra.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => showWorkspace(button.dataset.workspace)));
  } else if (key === 'login') {
    extra.innerHTML = '<div class="sample-user"><span class="avatar">AC</span><div><strong>Alex Carter</strong><br>Acme Studio · Demo account</div></div><button class="button primary" id="open-demo">Open demo account</button><p class="demo-note">Sample data only. No sign-in required.</p>';
    done.hidden = true;
    extra.querySelector('#open-demo').addEventListener('click', () => showWorkspace('Business'));
  } else if (key === 'contact') {
    extra.innerHTML = '<fieldset class="demo-times"><legend>Sample availability · Tomorrow</legend><label><input type="radio" name="time" value="10:00 AM" checked>10:00 AM</label><label><input type="radio" name="time" value="1:30 PM">1:30 PM</label><label><input type="radio" name="time" value="3:00 PM">3:00 PM</label></fieldset><button class="button primary" id="book-demo">Preview booking</button><p class="demo-note">Demo only. No meeting will be booked.</p>';
    done.hidden = true;
    extra.querySelector('#book-demo').addEventListener('click', () => {
      const time = extra.querySelector('input:checked').value;
      document.getElementById('dialog-title').textContent = 'You’re all set. In theory.';
      document.getElementById('dialog-description').textContent = 'Your sample introduction is tomorrow at ' + time + '. This is a preview—no meeting was booked or invitation sent.';
      extra.replaceChildren(); done.hidden = false; done.focus();
    });
  }
}
function showWorkspace(type) {
  document.getElementById('dialog-title').textContent = type + ' overview';
  document.getElementById('dialog-description').textContent = 'Welcome to Acme Studio. Here’s how your payments could look.';
  document.getElementById('dialog-extra').innerHTML = '<div class="demo-stats"><div><span>Collected this month</span><strong>$24,850<span class="currency">.00</span></strong></div><div><span>Awaiting payment</span><strong>$8,420<span class="currency">.00</span></strong></div></div><div class="demo-invoice"><span>INV–1042 · Bright & Co.</span><span class="paid">Paid</span></div><div class="demo-invoice"><span>INV–1043 · North Studio</span><span>Pending</span></div><p class="demo-note">Illustrative data. No real accounts or transactions.</p>';
  document.querySelector('.dialog-done').hidden = false;
  document.querySelector('.dialog-done').focus();
}
