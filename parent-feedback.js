(() => {
  'use strict';
  const form = document.querySelector('#parent-feedback-form');
  const fields = document.querySelector('#feedback-fields');
  const anonymous = document.querySelector('#post-anonymous');
  const name = document.querySelector('#display-name');
  const status = document.querySelector('#submit-status');
  const list = document.querySelector('#community-list');
  const listStatus = document.querySelector('#community-status');
  const more = document.querySelector('#load-more');
  const retry = document.querySelector('#retry-feedback');
  const config = window.FUTURE_STARS_FEEDBACK || {};
  const base = String(config.supabaseUrl || '').replace(/\/+$/, '');
  const key = String(config.publishableKey || '');
  // Fail closed when setup has not been completed, or a secret key was pasted.
  if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(base) || !key.startsWith('sb_publishable_')) return;
  const endpoint = base + '/rest/v1/parent_feedback';
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  let offset = 0, loading = false, sending = false;
  const pageSize = 12;
  fields.disabled = false;
  status.textContent = '';
  const syncName = () => { name.disabled = anonymous.checked; name.required = !anonymous.checked; };
  anonymous.addEventListener('change', syncName);
  syncName();
  async function request(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers }, signal: controller.signal });
      if (!response.ok) throw new Error('Request failed');
      return response;
    } finally { clearTimeout(timer); }
  }
  function renderComment(row) {
    const article = document.createElement('article'); article.className = 'community-comment';
    const title = document.createElement('h3'); title.textContent = row.display_name;
    article.append(title);
    const date = new Date(row.created_at);
    if (!Number.isNaN(date.getTime())) { const time = document.createElement('time'); time.dateTime = row.created_at; time.textContent = date.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' }); article.append(time); }
    const message = String(row.message || '');
    const p = document.createElement('p');
    if (message.length > 420) {
      p.textContent = message.slice(0, 420) + '…'; article.append(p);
      const details = document.createElement('details'), summary = document.createElement('summary'), full = document.createElement('p');
      summary.textContent = 'Read full comment'; full.textContent = message;
      details.append(summary, full); article.append(details);
      details.addEventListener('toggle', () => { p.hidden = details.open; summary.textContent = details.open ? 'Show less' : 'Read full comment'; });
    } else { p.textContent = message; article.append(p); }
    return article;
  }
  async function loadComments() {
    if (loading) return;
    loading = true; more.disabled = true; retry.hidden = true;
    listStatus.textContent = 'Loading community feedback…';
    try {
      const params = new URLSearchParams({select:'id,display_name,message,created_at',status:'eq.approved',order:'created_at.desc,id.desc',limit:String(pageSize + 1),offset:String(offset)});
      const response = await request(endpoint + '?' + params);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error('Invalid response');
      const page = rows.slice(0, pageSize);
      page.forEach(row => list.append(renderComment(row)));
      offset += page.length;
      more.hidden = rows.length <= pageSize;
      listStatus.textContent = offset ? '' : 'Be the first to share your experience. Comments appear after review.';
    } catch (_) {
      listStatus.textContent = 'Community feedback could not load. Please try again.';
      retry.hidden = false;
    } finally { loading = false; more.disabled = false; }
  }
  more.addEventListener('click', loadComments);
  retry.addEventListener('click', loadComments);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    status.dataset.kind = 'error';
    if (form.elements.website.value) { status.textContent = 'Unable to submit this message.'; return; }
    const message = form.elements.message.value.trim();
    const displayName = anonymous.checked ? 'A baseball parent' : name.value.trim();
    if (message.length < 20 || message.length > 4000 || !displayName || displayName.length > 80) { status.textContent = 'Please enter a display name and feedback of 20–4,000 characters.'; return; }
    const payload = { display_name:displayName, message, is_anonymous:anonymous.checked, consent:form.elements.consent.checked };
    sending = true; fields.disabled = true; status.dataset.kind = ''; status.textContent = 'Sending your feedback…';
    try {
      await request(endpoint, {method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)});
      form.reset(); status.dataset.kind = 'success'; status.textContent = 'Thank you! Your feedback has been submitted and will appear after review.';
    } catch (_) {
      status.dataset.kind = 'error'; status.textContent = 'We could not confirm your submission. Your text is still here; please try again. If the connection was interrupted, your earlier attempt may already have arrived.';
    } finally { sending = false; fields.disabled = false; syncName(); }
  });
  loadComments();
})();
