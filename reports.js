(() => {
 const players=window.FUTURE_STARS?.players||[];
 const reports=document.querySelector('#player-reports'),search=document.querySelector('#player-search'),language=document.querySelector('#report-language');
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeFile=file=>/^assets\/reports\/[^/]+\.pdf$/.test(file)?file:'#';
 function renderReports(){
  const matched=players.filter(p=>p.name.toLowerCase().includes(search.value.trim().toLowerCase()));
  const visible=matched.map(p=>({...p,reports:p.reports.filter(r=>language.value==='all'||r.language===language.value)})).filter(p=>p.reports.length);
  document.querySelector('#report-count').textContent=`${visible.length} player${visible.length===1?'':'s'} · ${visible.reduce((n,p)=>n+p.reports.length,0)} reports`;
  reports.innerHTML=visible.length?visible.map(p=>`<article class="player-card" id="player-${escape(p.id)}"><p class="eyebrow">${escape(p.role||'PLAYER EVALUATION')}</p><h2>${escape(p.name)}</h2>${p.reports.map(r=>`<a class="report-link" href="${escape(safeFile(r.file))}" target="_blank" rel="noopener"><span>${escape(r.label)}<small>${escape(r.kind)} · PDF ↗</small></span><b>${r.language==='zh'?'中文':'EN'}</b></a>`).join('')}<button class="text-link compare-link" data-player="${escape(p.id)}" style="border:0;background:none;padding:0;cursor:pointer">View progress ↓</button></article>`).join(''):'<div class="empty-state"><h3>No matching reports.</h3><p>Try another player name or language.</p></div>';
  reports.querySelectorAll('[data-player]').forEach(b=>b.addEventListener('click',()=>{playerSelect.value=b.dataset.player;loadSessions();document.querySelector('#comparison').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
 }
 const playerSelect=document.querySelector('#compare-player'),first=document.querySelector('#compare-first'),second=document.querySelector('#compare-second'),out=document.querySelector('#comparison-output');
 const currentPlayer=()=>players.find(p=>p.id===playerSelect.value);
 const datedSessions=()=>[...(currentPlayer()?.sessions||[])].filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s.date)).sort((a,b)=>a.date.localeCompare(b.date));
 const empty=(title,text)=>`<div class="empty-state"><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`;
 function loadSessions(){
  const sessions=datedSessions();
  for(const select of [first,second]){
   select.replaceChildren();select.disabled=sessions.length<2;
   if(!sessions.length){select.add(new Option('Awaiting dated evaluations',''));}
   else sessions.forEach(s=>select.add(new Option(`${s.date} · ${s.label}`,s.id)));
  }
  if(sessions.length===1){second.replaceChildren(new Option('Awaiting follow-up evaluation',''));}
  if(sessions.length>1){first.value=sessions[0].id;second.value=sessions[sessions.length-1].id;}
  renderComparison();
 }
 function renderComparison(){
  const p=currentPlayer(),sessions=datedSessions();
  if(sessions.length<2){
   const base=sessions[0];
   out.innerHTML=base?`<div class="baseline-heading"><p class="eyebrow">${escape(p.name)} / ${escape(base.date)}</p><h3>Baseline recorded. Next session ahead.</h3><p class="small">${escape(base.note||'')}</p></div><div class="baseline-grid">${Object.values(base.metrics||{}).map(m=>`<div><strong>${m.value}<small>${escape(m.unit)}</small></strong><span>${escape(m.label)}</span></div>`).join('')}</div><a class="text-link" href="${escape(safeFile(base.source))}" target="_blank" rel="noopener">View source report ↗</a><p class="small baseline-note">A side-by-side comparison will appear once a dated follow-up evaluation is available.</p>`:empty('Progress comparisons coming soon',`${p?.name||'This player'}’s reports are available above. Comparisons will appear when two dated evaluations with matching measurements are added.`);return;
  }
  if(first.value===second.value){out.innerHTML=empty('Choose two different evaluations','Select another session to compare results.');return;}
  const a=sessions.find(s=>s.id===first.value),b=sessions.find(s=>s.id===second.value);
  if(!a||!b)return;
  const keys=Object.keys(a.metrics||{}).filter(k=>b.metrics?.[k]&&a.metrics[k].unit===b.metrics[k].unit&&Number.isFinite(a.metrics[k].value)&&Number.isFinite(b.metrics[k].value));
  if(!keys.length){out.innerHTML=empty('These evaluations use different measurements','A comparison requires matching metrics and units.');return;}
  out.innerHTML=`<div class="table-wrap"><table><caption class="small">${escape(p.name)} · Change = second evaluation minus first</caption><thead><tr><th scope="col">Measurement</th><th scope="col">${escape(a.date)}</th><th scope="col">${escape(b.date)}</th><th scope="col">Change</th></tr></thead><tbody>${keys.map(k=>{const x=a.metrics[k],y=b.metrics[k],d=Math.round((y.value-x.value)*100)/100;return `<tr><th scope="row">${escape(x.label||k)}</th><td>${x.value} ${escape(x.unit)}</td><td>${y.value} ${escape(y.unit)}</td><td class="change">${d>0?'+':''}${d} ${escape(y.unit)}</td></tr>`;}).join('')}</tbody></table></div><p class="small">Changes describe the recorded measurements; a higher number does not always mean improvement.</p>`;
 }
 search.addEventListener('input',renderReports);language.addEventListener('change',renderReports);playerSelect.addEventListener('change',loadSessions);first.addEventListener('change',renderComparison);second.addEventListener('change',renderComparison);
 const requested=new URLSearchParams(location.search).get('player');if(players.some(p=>p.id===requested)){playerSelect.value=requested;search.value=players.find(p=>p.id===requested).name;}
 renderReports();loadSessions();
})();
