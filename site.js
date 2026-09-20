(() => {
  const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('#main-nav');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});
  const dialog=document.querySelector('#photo-dialog');let lastPhoto;
  document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{lastPhoto=button;const photo=dialog.querySelector('img');photo.src=button.dataset.photo;photo.alt=button.dataset.caption;dialog.querySelector('p').textContent=button.dataset.caption;dialog.showModal();}));
  dialog?.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('close',()=>lastPhoto?.focus());
})();
