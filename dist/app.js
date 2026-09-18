// Optional production destinations. Empty values use the interactive demo flows.
const destinations = { signup: '', contact: '', login: '' };
const panels = {
  payments: ['مدفوعات تواكب أعمالك', 'اجمع مدفوعات أعمالك في مكان واحد، مع رؤية واضحة للأموال الواردة والصادرة.'],
  terms: ['امنح أعمالك مساحة للنمو', 'تساعدك آجال السداد المرنة على تنظيم مدفوعاتك بما يتناسب مع تدفقاتك النقدية.'],
  collections: ['تابع تحصيل مستحقاتك', 'نظّم فواتيرك وتذكيرات الدفع وعمليات التحصيل من مكان واحد.'],
  about: ['رؤية جديدة للمدفوعات', 'تجمع منصة عبدالرحمن المدفوعات وآجال السداد والتحصيل في تجربة واحدة، لمساعدة أعمالك على النمو.'],
  pricing: ['اختر ما يناسب أعمالك', 'ستتوفر تفاصيل الأسعار عند إطلاق الخدمة.'],
  accountants: ['رؤية أوضح لكل عميل', 'تابع مدفوعات العملاء ومستحقاتهم من واجهة واحدة تُسهّل مهامك اليومية.'],
  signup: ['ابدأ خطوتك التالية', 'اختر مساحة عمل لتجربتها. لا تحتاج إلى إنشاء حساب.'],
  contact: ['لنتحدث عن أعمالك', 'جرّب حجز لقاء تعريفي مدته ١٥ دقيقة. اختر أحد المواعيد التجريبية أدناه.'],
  login: ['مرحبًا بعودتك', 'استكشف حسابك التجريبي دون الحاجة إلى بيانات دخول.']
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
  mobileToggle.setAttribute('aria-label', 'فتح القائمة');
  closeDropdowns();
}
mobileToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  mobileToggle.setAttribute('aria-expanded', String(open));
  mobileToggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
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
  document.getElementById('dialog-extra').textContent = ['signup', 'login', 'contact', 'pricing'].includes(key) ? '' : 'استكشف هذه التجربة الأولية. سنعلن تفاصيل المنتجات وتوفرها عند الإطلاق.';
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
  const label = video.paused ? 'تشغيل حركة الخلفية' : 'إيقاف حركة الخلفية';
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
  document.querySelector('.dialog-eyebrow').textContent = 'عبدالرحمن · نسخة تجريبية';
  if (key === 'signup') {
    extra.innerHTML = '<div class="demo-options"><button data-workspace="الأعمال">الأعمال <span>المدفوعات وآجال السداد والتحصيل</span></button><button data-workspace="المحاسبة">المحاسبة <span>رؤية أوضح لحسابات عملائك</span></button></div><p class="demo-note">تجربة تفاعلية فقط. لن يتم إنشاء حساب.</p>';
    extra.querySelectorAll('[data-workspace]').forEach(button => button.addEventListener('click', () => showWorkspace(button.dataset.workspace)));
  } else if (key === 'login') {
    extra.innerHTML = '<div class="sample-user"><span class="avatar">ع</span><div><strong>عبدالرحمن</strong><br>مساحة عبدالرحمن · حساب تجريبي</div></div><button class="button primary" id="open-demo">افتح الحساب التجريبي</button><p class="demo-note">بيانات توضيحية فقط. لا يلزم تسجيل الدخول.</p>';
    done.hidden = true;
    extra.querySelector('#open-demo').addEventListener('click', () => showWorkspace('الأعمال'));
  } else if (key === 'contact') {
    extra.innerHTML = '<fieldset class="demo-times"><legend>مواعيد تجريبية · غدًا</legend><label><input type="radio" name="time" value="١٠:٠٠ صباحًا" checked>١٠:٠٠ صباحًا</label><label><input type="radio" name="time" value="١:٣٠ مساءً">١:٣٠ مساءً</label><label><input type="radio" name="time" value="٣:٠٠ مساءً">٣:٠٠ مساءً</label></fieldset><button class="button primary" id="book-demo">جرّب الحجز</button><p class="demo-note">تجربة فقط. لن يتم حجز لقاء فعلي.</p>';
    done.hidden = true;
    extra.querySelector('#book-demo').addEventListener('click', () => {
      const time = extra.querySelector('input:checked').value;
      document.getElementById('dialog-title').textContent = 'اكتملت تجربة الحجز';
      document.getElementById('dialog-description').textContent = 'موعدك التعريفي التجريبي غدًا الساعة ' + time + '. هذه معاينة فقط، ولم يتم حجز لقاء أو إرسال دعوة.';
      extra.replaceChildren(); done.hidden = false; done.focus();
    });
  }
}
function showWorkspace(type) {
  document.getElementById('dialog-title').textContent = 'نظرة عامة على ' + type;
  document.getElementById('dialog-description').textContent = 'مرحبًا بك في مساحة عبدالرحمن. إليك مثالًا على متابعة مدفوعاتك.';
  document.getElementById('dialog-extra').innerHTML = '<div class="demo-stats"><div><span>المبالغ المحصّلة هذا الشهر</span><strong>$24,850<span class="currency">.00</span></strong></div><div><span>بانتظار الدفع</span><strong>$8,420<span class="currency">.00</span></strong></div></div><div class="demo-invoice"><span>فاتورة ١٠٤٢ · شركة إشراق</span><span class="paid">مدفوعة</span></div><div class="demo-invoice"><span>فاتورة ١٠٤٣ · استوديو الشمال</span><span>قيد الانتظار</span></div><p class="demo-note">بيانات توضيحية. لا توجد حسابات أو معاملات فعلية.</p>';
  document.querySelector('.dialog-done').hidden = false;
  document.querySelector('.dialog-done').focus();
}
