(() => {
 const players=window.FUTURE_STARS?.players||[];
 const reports=document.querySelector('#player-reports'),search=document.querySelector('#player-search'),language=document.querySelector('#report-language');
 const playerSelect=document.querySelector('#compare-player'),first=document.querySelector('#compare-first'),second=document.querySelector('#compare-second'),out=document.querySelector('#comparison-output');
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeFile=file=>/^assets\/reports\/[^/]+\.pdf$/.test(file)||/^https:\/\/drive\.google\.com\/file\/d\/[A-Za-z0-9_-]+\/view(?:\?usp=drivesdk)?$/.test(file)?file:'#';
 const link=(url,label)=>`<a class="text-link" href="${escape(safeFile(url))}" target="_blank" rel="noopener">${escape(label)} ↗</a>`;
 const sourceNotes=(p,a,b)=>`<div class="session-sources"><p class="small">${escape(a.note||'')} ${a.source===b?.source?'The linked retest report contains both score columns.':''}</p><div class="button-row">${link(a.source,'Baseline score source')}${b?link(b.source,'Retest 1 comparison report'):''}</div>${p.contactBaseline?`<p class="small">Original contact-quality baseline: ${p.contactBaseline.metrics.cqs.value}/100 CQS. CQS measures a different feature and is not compared with the mechanical score.</p>${link(p.contactBaseline.source,'Original contact-quality report')}`:''}${p.videos?.length?`<details><summary>View dated session videos (${p.videos.length})</summary><div class="video-links">${p.videos.map(v=>link(v.url,v.label)).join('')}</div></details>`:''}</div>`;
 const trend=p=>{const a=p.sessions?.[0]?.metrics?.total,b=p.sessions?.[1]?.metrics?.total;return a&&b?`<p class="player-status">BASELINE → RETEST 1</p><p><strong>${a.value}/60 → ${b.value}/60 · +${b.value-a.value} points</strong></p>`:`<p class="player-status">${escape(p.role||'INITIAL EVALUATION')}</p>`;};
 function renderReports(){
  const matched=players.filter(p=>p.name.toLowerCase().includes(search.value.trim().toLowerCase()));
  const visible=matched.map(p=>({...p,reports:p.reports.filter(r=>language.value==='all'||r.language===language.value)})).filter(p=>p.reports.length);
  const youth=visible.filter(p=>p.id!=='vincent').length,self=visible.some(p=>p.id==='vincent');
  document.querySelector('#report-count').textContent=`${youth} youth-player profile${youth===1?'':'s'}${self?' + founder self-analysis':''} · ${visible.reduce((n,p)=>n+p.reports.length,0)} report links`;
  reports.innerHTML=visible.length?visible.map(p=>`<article class="player-card" id="player-${escape(p.id)}"><h2>${escape(p.name)}</h2>${trend(p)}${p.summary?`<p class="small">${escape(p.summary)}</p>`:''}${p.reports.map(r=>`<a class="report-link" href="${escape(safeFile(r.file))}" target="_blank" rel="noopener"><span>${escape(r.label)}<small>${escape(r.kind)} · PDF ↗</small></span><b>${r.language==='zh'?'中文':'EN'}</b></a>`).join('')}<button class="text-link compare-link" data-player="${escape(p.id)}" style="border:0;background:none;padding:0;cursor:pointer">${p.sessions?.length>1?'Compare scores & videos ↓':'View evaluation details ↓'}</button></article>`).join(''):'<div class="empty-state"><h3>No matching reports.</h3><p>Try another player name or language.</p></div>';
  reports.querySelectorAll('[data-player]').forEach(b=>b.addEventListener('click',()=>{playerSelect.value=b.dataset.player;loadSessions();document.querySelector('#comparison').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
 }
 const currentPlayer=()=>players.find(p=>p.id===playerSelect.value);
 const datedSessions=()=>[...(currentPlayer()?.sessions||[])].filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s.date)).sort((a,b)=>a.date.localeCompare(b.date));
 const empty=(title,text)=>`<div class="empty-state"><h3>${escape(title)}</h3><p>${escape(text)}</p></div>`;
 function loadSessions(){
  const sessions=datedSessions();
  for(const select of [first,second]){
   select.replaceChildren();select.disabled=sessions.length<2;
   if(!sessions.length)select.add(new Option('Initial reports available above',''));
   else sessions.forEach(s=>select.add(new Option(`${s.date} · ${s.label}`,s.id)));
  }
  if(sessions.length===1)second.replaceChildren(new Option('Awaiting follow-up evaluation',''));
  if(sessions.length>1){first.value=sessions[0].id;second.value=sessions[sessions.length-1].id;}
  renderComparison();
 }
 function renderComparison(){
  const p=currentPlayer(),sessions=datedSessions();
  if(sessions.length<2){
   out.innerHTML=empty(p?.id==='vincent'?'Founder self-analysis':'Initial evaluation available',`${p?.name||'This player'}’s report links are listed above. No paired retest has been added for this profile.`)+(p?.videos?.length?`<div class="video-links">${p.videos.map(v=>link(v.url,v.label)).join('')}</div>`:'');return;
  }
  if(first.value===second.value){out.innerHTML=empty('Choose two different evaluations','Select another session to compare results.');return;}
  const a=sessions.find(s=>s.id===first.value),b=sessions.find(s=>s.id===second.value);
  if(!a||!b)return;
  const keys=Object.keys(a.metrics||{}).filter(k=>b.metrics?.[k]&&a.metrics[k].unit===b.metrics[k].unit&&Number.isFinite(a.metrics[k].value)&&Number.isFinite(b.metrics[k].value));
  if(!keys.length){out.innerHTML=empty('These evaluations use different measurements','A comparison requires matching metrics and units.');return;}
  const av=a.metrics.total?.value,bv=b.metrics.total?.value;
  out.innerHTML=(Number.isFinite(av)&&Number.isFinite(bv)?`<div class="score-trend"><div><span>${escape(a.date)}</span><strong>${av}/60</strong></div><b aria-hidden="true">→</b><div><span>${escape(b.date)}</span><strong>${bv}/60</strong></div><div><span>Mechanical change</span><strong>${bv-av>0?'+':''}${bv-av}/60</strong></div></div><p>${escape(p.summary||'')}</p>`:'')+`<div class="table-wrap"><table><caption>${escape(p.name)} · Six-category mechanical review</caption><thead><tr><th scope="col">Measurement</th><th scope="col">${escape(a.date)}</th><th scope="col">${escape(b.date)}</th><th scope="col">Change</th></tr></thead><tbody>${keys.map(k=>{const x=a.metrics[k],y=b.metrics[k],d=k==='normalized'&&Number.isFinite(av)&&Number.isFinite(bv)?Math.round((bv-av)/60*1000)/10:Math.round((y.value-x.value)*100)/100;return `<tr><th scope="row">${escape(x.label||k)}</th><td>${x.value} ${escape(x.unit)}</td><td>${y.value} ${escape(y.unit)}</td><td class="change">${d>0?'+':''}${d} ${k==='normalized'?'points':escape(y.unit)}</td></tr>`;}).join('')}</tbody></table></div><p class="small">Normalized changes are calculated from the unrounded /60 totals, then rounded to one decimal. Scores summarize observed mechanics; they do not measure ball speed or prove a training effect.</p>`+sourceNotes(p,a,b);
 }
 search.addEventListener('input',renderReports);language.addEventListener('change',renderReports);playerSelect.addEventListener('change',loadSessions);first.addEventListener('change',renderComparison);second.addEventListener('change',renderComparison);
 const requested=new URLSearchParams(location.search).get('player');if(players.some(p=>p.id===requested)){playerSelect.value=requested;search.value=players.find(p=>p.id===requested).name;}
 renderReports();loadSessions();
})();
