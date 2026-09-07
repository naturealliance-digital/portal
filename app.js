if(window.Chart&&Chart.defaults.animation){Chart.defaults.animation.duration=900;Chart.defaults.animation.easing='easeOutCubic'}
const menu=[['🏠','Dashboard','Overall IT management view'],['👥','Manpower','Digital team & workload'],['💰','Budget & Expense','Budget planning, spending and cost control'],['🎫','Service Tickets','IT support & SLA'],['💻','Fixed Assets','Computers & IT equipment'],['☁️','Microsoft 365','Users & licenses'],['🔐','IT Security','Cybersecurity'],['🌐','Infrastructure','Network, servers & systems']];const sample={Dashboard:[{Metric:'System Availability',Value:99.8,Status:'Healthy'},{Metric:'Open Tickets',Value:24,Status:'Attention'},{Metric:'IT Budget Used',Value:68,Status:'On Track'},{Metric:'Security Score',Value:92,Status:'Healthy'}],Manpower:[{Employee:'Aung Min',Role:'IT Manager',Workload:78,Status:'On Track'},{Employee:'Su Su Win',Role:'Systems Engineer',Workload:92,Status:'High'},{Employee:'Ko Ko',Role:'IT Support',Workload:65,Status:'On Track'}],'Budget & Expense':[{Category:'Cloud Services',Budget:12500,Actual:9780,Status:'On Track'},{Category:'Software Licenses',Budget:8600,Actual:7420,Status:'On Track'},{Category:'Hardware',Budget:15000,Actual:16450,Status:'Over Budget'}],'Service Tickets':[{Ticket:'#INC-1842',Subject:'VPN access issue',Priority:'High',Status:'Open',SLA:'1h 24m'},{Ticket:'#INC-1841',Subject:'Laptop provisioning',Priority:'Medium',Status:'In Progress',SLA:'5h 10m'},{Ticket:'#INC-1839',Subject:'Email delivery delay',Priority:'High',Status:'Resolved',SLA:'Met'}],'Fixed Assets':[{Asset:'Dell Latitude 5440',Owner:'Aung Min',Location:'Head Office',Status:'In Use'},{Asset:'MacBook Pro M3',Owner:'May Thazin',Location:'Head Office',Status:'In Use'},{Asset:'HP LaserJet Pro',Owner:'Shared',Location:'Branch 04',Status:'Maintenance'}],'Microsoft 365':[{License:'Microsoft 365 Business Premium',Assigned:124,Available:26,Status:'Healthy'},{License:'Power BI Pro',Assigned:42,Available:8,Status:'Healthy'},{License:'Teams Phone Standard',Assigned:58,Available:2,Status:'Low Stock'}],'IT Security':[{Control:'Endpoint Protection',Coverage:98,Status:'Healthy'},{Control:'MFA Enrollment',Coverage:94,Status:'Healthy'},{Control:'Security Awareness',Coverage:76,Status:'Attention'}],Infrastructure:[{Service:'Core Network',Availability:99.98,Status:'Healthy'},{Service:'ERP Server',Availability:99.82,Status:'Healthy'},{Service:'Internet Link',Availability:98.91,Status:'Attention'}]};let data=JSON.parse(JSON.stringify(sample)),active='Dashboard',bar,donut;function numeric(r){return Object.keys(r[0]||{}).filter(k=>r.some(x=>typeof x[k]==='number'))}function state(s){s=(s||'').toLowerCase();return /healthy|track|resolved|approved|ready|use/.test(s)?'good':/high|over|attention|maintenance|low|open|review/.test(s)?'warn':'bad'}function show(x){toast.textContent=x;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}function buildNav(){nav.innerHTML=tabs.innerHTML='';Object.keys(data).forEach(n=>{let m=menu.find(x=>x[1]===n),a=document.createElement('button'),b=document.createElement('button');a.innerHTML=(m?m[0]:'▦')+' '+n;a.onclick=()=>page(n);b.textContent=n;b.onclick=()=>page(n);nav.append(a);tabs.append(b)})}function page(n){active=n;h1.textContent=n==='Dashboard'?'IT Management Overview':n;crumb.textContent=n;sub.textContent=(menu.find(x=>x[1]===n)||[])[2]||'Imported worksheet dashboard';document.getElementById('search').value='';side.classList.remove('open');[...nav.children].forEach(x=>x.classList.toggle('active',x.textContent.trim().endsWith(n)));[...tabs.children].forEach(x=>x.classList.toggle('active',x.textContent===n));render()}function render(){if(!document.getElementById('filter')||!document.getElementById('table')||!document.getElementById('foot'))return;kpis.className='unified-kpi-grid';let r=data[active]||[],ns=numeric(r),cards=ns.slice(0,4).map((n,i)=>{let a=r.reduce((s,x)=>s+(+x[n]||0),0)/r.length;return[n,a,['◈','◌','◒','✦'][i]]});if(!cards.length)cards=Object.keys(r[0]||{}).slice(0,4).map((n,i)=>[n,r.length,['◈','◌','◒','✦'][i]]);kpis.innerHTML=cards.map((x,i)=>'<article class="unified-kpi-card"><div class="kt"><span>'+x[0]+'</span><b class="ico">'+x[2]+'</b></div><div class="num">'+x[1].toLocaleString(undefined,{maximumFractionDigits:2})+'</div><div class="up '+(i==1?'down':'')+'">'+(i==1?'↓ 4.2%':'↑ 8.4%')+' from last month</div></article>').join('');const genericChartTitle=document.getElementById('ctitle');if(genericChartTitle)genericChartTitle.textContent=active+' performance';const tableTitle=document.getElementById('ttitle');if(tableTitle)tableTitle.textContent=active+' records';let ss=[...new Set(r.map(x=>x.Status).filter(Boolean))];const statusFilter=document.getElementById('filter');if(statusFilter)statusFilter.innerHTML='<option>All</option>'+ss.map(x=>'<option>'+x+'</option>').join('');charts();table()}function charts(){const chartTypeControl=document.getElementById('m365CompanyChartType')||document.getElementById('type'),selectedChartType=chartTypeControl?.value||'bar';let r=data[active]||[],n=numeric(r)[0],labs=r.map((x,i)=>x[Object.keys(x)[0]]||'Record '+(i+1));if(bar)bar.destroy();bar=new Chart(chart,{type:selectedChartType,data:{labels:labs,datasets:[{data:n?r.map(x=>x[n]):r.map((_,i)=>i+1),backgroundColor:selectedChartType==='bar'?'#d12a31':'#d12a3122',borderColor:'#d12a31',borderWidth:2,borderRadius:6,fill:selectedChartType==='line',tension:.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{grid:{color:'#eef2f7'},ticks:{font:{size:10}}}}}});let c={};r.forEach(x=>{let s=x.Status||'Active';c[s]=(c[s]||0)+1});let colors=['#d12a31','#f06428','#d6a13b','#8d5754'];if(donut)donut.destroy();donut=new Chart(pie,{type:'doughnut',data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:colors,borderColor:'#fff',borderWidth:3,cutout:'66%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});(document.getElementById('microsoft365LicenseLegend')||document.getElementById('legend')).innerHTML=Object.entries(c).map(([x,y],i)=>'<div><span><i class="dot" style="background:'+colors[i]+'"></i>'+x+'</span><b>'+y+' records</b></div>').join('')}function table(){let r=data[active].filter(x=>((document.getElementById('filter')?.value||'All')==='All'||x.Status===(document.getElementById('filter')?.value||'All'))&&Object.values(x).join(' ').toLowerCase().includes((document.getElementById('search')?.value||'').toLowerCase())),ks=Object.keys(data[active][0]||{});document.getElementById('table').innerHTML='<table><thead><tr>'+ks.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+r.map(x=>'<tr data-id="'+data[active].indexOf(x)+'">'+ks.map(k=>k==='Status'?'<td><b class="status '+state(x[k])+'">'+x[k]+'</b></td>':'<td contenteditable data-k="'+k+'">'+x[k]+'</td>').join('')+'</tr>').join('')+'</tbody></table>';document.querySelectorAll('td[contenteditable]').forEach(x=>x.onblur=e=>{let v=e.target.textContent;data[active][e.target.parentElement.dataset.id][e.target.dataset.k]=isNaN(+v)||!v.trim()?v:+v;charts()});foot.textContent='Showing '+r.length+' of '+data[active].length+' records · Click any value to edit'}file.onchange=e=>{let rd=new FileReader();rd.onload=z=>{let wb=XLSX.read(z.target.result,{type:'array'}),o={};wb.SheetNames.forEach(s=>{let r=XLSX.utils.sheet_to_json(wb.Sheets[s],{defval:''});if(r.length)o[s]=r});if(!Object.keys(o).length)return show('No data rows found');data=o;buildNav();page(Object.keys(o)[0]);show(Object.keys(o).length+' worksheet(s) imported')};rd.readAsArrayBuffer(e.target.files[0])};function exportXlsx(){let w=XLSX.utils.book_new();Object.entries(data).forEach(([n,r])=>XLSX.utils.book_append_sheet(w,XLSX.utils.json_to_sheet(r),n.slice(0,31)));XLSX.writeFile(w,'Digital-IT-Hub.xlsx');show('Excel workbook exported')}function exportPpt(){let p=new PptxGenJS(),s=p.addSlide(),r=data[active],ks=Object.keys(r[0]||{});s.background={color:'F4F7FB'};s.addText('Digital IT Hub – '+active,{x:.5,y:.4,w:9,h:.4,fontSize:22,bold:true,color:'101A35'});s.addTable([ks,...r.slice(0,8).map(x=>ks.map(k=>String(x[k])))],{x:.5,y:1.2,w:9,h:4.5,fontSize:10});p.writeFile({fileName:'Digital-IT-Hub-'+active+'.pptx'});show('PowerPoint export started')}function save(){localStorage.setItem('itHubData',JSON.stringify(data));show('Changes saved in this browser')}try{data=JSON.parse(localStorage.getItem('itHubData'))||data}catch(e){}buildNav();active=Object.keys(data)[0];


document.addEventListener("disabled-manpower-table-renderer",function(){(function(){
const icons={structure:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v5M6 17v-3h12v3"/></svg>',onsite:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 19.2 5 21m10.5-1.8L19 21"/></svg>',scope:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 6.5h0M17.5 6.5h0M6.5 17.5h0M17.5 17.5h0"/></svg>',future:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/><path d="M15 7h4v4"/><circle cx="7" cy="15" r="1"/><circle cx="11" cy="11" r="1"/><circle cx="14" cy="13" r="1"/></svg>'};
const defaults={
structure:[
{Employee:'U Wai Toe Kyaw',Position:'Director',Division:'Director','Role Level':'D-1',Responsibility:'Digital strategy and governance'},
{Employee:'U Myo Aung',Position:'IT Manager',Division:'Manager','Role Level':'P-3',Responsibility:'Operations, planning and service delivery'},
{Employee:'U Soe Maung Maung',Position:'Senior System Administrator',Division:'Infrastructure','Role Level':'P-1',Responsibility:'Infrastructure architecture and standards'},
{Employee:'U Khin Maung Thant',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5',Responsibility:'Network and server operations'},
{Employee:'U Khon Tay Za',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5',Responsibility:'Cloud and Microsoft 365 administration'},
{Employee:'U Khaing Zaw Shein',Position:'Software Engineer',Division:'Software Development','Role Level':'G-5',Responsibility:'Business applications and automation'}],
onsite:[
{Site:'Head Office',Company:'Nature Alliance',Assignee:'U Soe Maung Maung',Coverage:'Full-time','Support Scope':'Core infrastructure',Status:'Active'},
{Site:'Head Office',Company:'Nature Alliance',Assignee:'U Khaing Zaw Shein',Coverage:'Full-time','Support Scope':'Applications and automation',Status:'Active'},
{Site:'AIP Office',Company:'AIP',Assignee:'U Khin Maung Thant',Coverage:'Scheduled','Support Scope':'Network and endpoints',Status:'Active'},
{Site:'PIP Myanmar',Company:'PIP Myanmar',Assignee:'U Khon Tay Za',Coverage:'Scheduled','Support Scope':'Microsoft 365 and users',Status:'Active'},
{Site:'Nature Valley',Company:'Nature Valley',Assignee:'U Than Toe Aung',Coverage:'On demand','Support Scope':'Identity and devices',Status:'Planned'}],
scope:[
{Function:'IT Governance',Category:'Leadership',Owner:'Director / IT Manager',Scope:'Strategy, policy, risk and investment',Coverage:'Group-wide'},
{Function:'Infrastructure Operations',Category:'Operations',Owner:'Infrastructure Team',Scope:'Network, servers, cloud and availability',Coverage:'Critical services'},
{Function:'Microsoft 365 Services',Category:'Cloud',Owner:'System Administration',Scope:'Identity, licenses, collaboration and security',Coverage:'Group-wide'},
{Function:'Software Development',Category:'Engineering',Owner:'Software Engineer',Scope:'Applications, integrations and automation',Coverage:'Approved initiatives'},
{Function:'Cybersecurity',Category:'Security',Owner:'Infrastructure Team',Scope:'Protection, monitoring, response and awareness',Coverage:'Group-wide'},
{Function:'End-User Support',Category:'Service Delivery',Owner:'Digital Support Team',Scope:'Incidents, requests, devices and onboarding',Coverage:'Business hours'}],
future:[
{'Proposed Role':'Head of Digital Technology',Function:'Leadership','Planned Headcount':1,Priority:'High',Responsibility:'Strategy, governance and transformation'},
{'Proposed Role':'Infrastructure Lead',Function:'Infrastructure','Planned Headcount':1,Priority:'High',Responsibility:'Architecture, resilience and standards'},
{'Proposed Role':'Cybersecurity Specialist',Function:'Security','Planned Headcount':1,Priority:'High',Responsibility:'Security operations, risk and compliance'},
{'Proposed Role':'Cloud & M365 Administrator',Function:'Cloud Services','Planned Headcount':1,Priority:'Medium',Responsibility:'Cloud, identity and collaboration'},
{'Proposed Role':'Software Engineer',Function:'Engineering','Planned Headcount':2,Priority:'Medium',Responsibility:'Applications, integration and automation'},
{'Proposed Role':'Service Desk Analyst',Function:'Service Delivery','Planned Headcount':2,Priority:'Planned',Responsibility:'Support, requests and knowledge management'}]};
const config={structure:{tab:'Current Structure',title:'Current Digital Department',sub:'Structure and Responsibility Matrix',filter:'Division'},onsite:{tab:'Current On-Site',title:'Current On-Site Coverage',sub:'Assignments and Support Coverage',filter:'Status'},scope:{tab:'Functions & Scope',title:'Digital Team Functions & Scope',sub:'Service Ownership and Coverage',filter:'Category'},future:{tab:'Future Structure',title:'Future Digital Department',sub:'Target Structure and Responsibility Matrix',filter:'Priority'}};
let db;try{db=JSON.parse(localStorage.getItem('manpowerPlanningDB'))}catch(e){}if(!db)db=JSON.parse(JSON.stringify(defaults));Object.keys(defaults).forEach(k=>{if(!Array.isArray(db[k]))db[k]=JSON.parse(JSON.stringify(defaults[k]))});
let selected=sessionStorage.getItem('manpowerPlanningTab')||'structure';const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function badge(k,v){if(k==='Role Level')return '<span class="planning-badge level">'+esc(v)+'</span>';if(k==='Status')return '<span class="planning-badge status">'+esc(v)+'</span>';if(k==='Priority')return '<span class="planning-badge '+String(v).toLowerCase()+'">'+esc(v)+'</span>';return esc(v)}
function section(){let el=document.getElementById('manpowerPlanningCard');if(!el){el=document.createElement('section');el.id='manpowerPlanningCard';el.className='card manpower-planning-card';const base=document.querySelector('main>section.card.tablecard');base.after(el)}return el}
function render(){const el=section();el.hidden=active!=='Manpower';if(active!=='Manpower')return;const cfg=config[selected],rows=db[selected],q=(document.getElementById('planningSearch')?.value||'').toLowerCase(),f=document.getElementById('planningFilter')?.value||'All',keys=Object.keys(rows[0]||{}),opts=[...new Set(rows.map(r=>String(r[cfg.filter])))],shown=rows.filter(r=>(f==='All'||String(r[cfg.filter])===f)&&Object.values(r).join(' ').toLowerCase().includes(q));
el.innerHTML='<nav class="manpower-planning-tabs">'+Object.entries(config).map(([k,c])=>'<button class="manpower-planning-tab '+(k===selected?'active':'')+'" data-tab="'+k+'">'+icons[k]+'<span>'+c.tab+'</span></button>').join('')+'</nav><div class="manpower-planning-head"><div class="manpower-planning-title"><span class="manpower-planning-icon">'+icons[selected]+'</span><div><h2>'+cfg.title+'</h2><p>'+cfg.sub+' · Sample Data</p></div></div><div class="manpower-planning-tools"><input id="planningSearch" class="search" placeholder="Search records..." value="'+esc(q)+'"><select id="planningFilter" class="filter"><option>All</option>'+opts.map(v=>'<option '+(v===f?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></div></div><div class="manpower-planning-scroll"><table class="manpower-planning-table"><thead><tr>'+keys.map(k=>'<th>'+esc(k)+'</th>').join('')+'</tr></thead><tbody>'+shown.map(r=>'<tr data-index="'+rows.indexOf(r)+'">'+keys.map(k=>'<td contenteditable data-key="'+esc(k)+'">'+badge(k,r[k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="manpower-planning-foot">Showing '+shown.length+' of '+rows.length+' records · Editable sample data</div>';
el.querySelectorAll('.manpower-planning-tab').forEach(b=>b.onclick=()=>{selected=b.dataset.tab;sessionStorage.setItem('manpowerPlanningTab',selected);render()});el.querySelector('#planningSearch').oninput=render;el.querySelector('#planningFilter').onchange=render;el.querySelectorAll('td[contenteditable]').forEach(td=>td.onblur=e=>{const i=+e.target.closest('tr').dataset.index,k=e.target.dataset.key,raw=e.target.textContent.trim();db[selected][i][k]=raw!==''&&!isNaN(+raw)?+raw:raw;localStorage.setItem('manpowerPlanningDB',JSON.stringify(db));render()});}
const nav=window.navigateHubPage;window.navigateHubPage=function(n,p=true){nav(n,p);render()};const pg=window.page;window.page=function(n){pg(n);render()};render();
})();
});

/* Site Coverage table search, filter and editable coverage controls */
(function(){
 function filterSiteCoverage(){const table=document.querySelector('.site-assignment-matrix');if(!table)return;const query=(document.getElementById('siteCoverageSearch')?.value||'').trim().toLowerCase(),coverage=document.getElementById('siteCoverageFilter')?.value||'All coverage';let shown=0;table.querySelectorAll('tbody tr').forEach(row=>{const model=row.querySelector('.coverage-select')?.value||row.querySelector('.coverage-badge')?.textContent.trim()||'',searchable=(row.textContent+' '+(row.dataset.team||'')).toLowerCase(),visible=(!query||searchable.includes(query))&&(coverage==='All coverage'||coverage===model);row.hidden=!visible;if(visible)shown++});const count=document.getElementById('siteCoverageCount');if(count)count.textContent='Showing '+shown+' of '+table.tBodies[0].rows.length+' locations - 7 Members'}
 const storageKey='siteCoverageMatrixDB';
 function updateRowTeam(row){const headers=[...row.closest('table').querySelectorAll('thead th')].slice(3),cells=[...row.querySelectorAll('.assignment-cell')];row.dataset.team=cells.map((cell,index)=>cell.textContent.includes('✓')?headers[index]?.textContent.trim():'').filter(Boolean).join(' ')}
 function saveSiteCoverage(){const table=document.querySelector('.site-assignment-matrix');if(!table||table.dataset.storageReady!=='true')return;const rows=[...table.tBodies[0].rows].map(row=>({location:row.cells[0].textContent.trim(),coverage:row.querySelector('.coverage-select')?.value||'Scheduled',assignments:[...row.querySelectorAll('.assignment-cell')].map(cell=>cell.textContent.includes('✓'))}));localStorage.setItem(storageKey,JSON.stringify(rows))}
 function restoreSiteCoverage(table){if(!table||table.dataset.storageReady==='true')return;if(table.dataset.readonly==='true'){table.dataset.storageReady='true';return}let saved;try{saved=JSON.parse(localStorage.getItem(storageKey))}catch(e){}const rows=[...table.tBodies[0].rows];if(Array.isArray(saved)&&saved.length===rows.length)rows.forEach((row,index)=>{const record=saved[index];if(!record)return;row.cells[0].textContent=record.location||row.cells[0].textContent;const select=row.querySelector('.coverage-select');if(select&&['Full-Time','Scheduled','Planned'].includes(record.coverage)){select.value=record.coverage;select.className='coverage-select '+record.coverage.toLowerCase().replace('-','')}[...row.querySelectorAll('.assignment-cell')].forEach((cell,cellIndex)=>{const assigned=!!record.assignments?.[cellIndex];cell.textContent=assigned?'✓':'';cell.setAttribute('aria-checked',assigned?'true':'false')});updateAssignedCount(row);updateRowTeam(row)});table.dataset.storageReady='true'}
 function updateAssignedCount(row){if(!row)return;const count=[...row.querySelectorAll('.assignment-cell')].filter(cell=>cell.textContent.includes('✓')).length,target=row.cells[2];if(target)target.textContent=count}
 function toggleAssignment(cell){const row=cell.closest('tr'),assigned=!cell.textContent.includes('✓');cell.textContent=assigned?'✓':'';cell.setAttribute('aria-checked',assigned?'true':'false');updateAssignedCount(row);updateRowTeam(row);saveSiteCoverage();filterSiteCoverage()}
 document.addEventListener('input',event=>{if(event.target.id==='siteCoverageSearch')filterSiteCoverage();if(event.target.matches('.site-assignment-matrix .assignment-cell')){const row=event.target.closest('tr');updateAssignedCount(row);updateRowTeam(row);saveSiteCoverage()}else if(event.target.matches('.site-assignment-matrix tbody td:first-child'))saveSiteCoverage()});
 document.addEventListener('change',event=>{if(event.target.id==='siteCoverageFilter')filterSiteCoverage();if(event.target.matches('.coverage-select')){event.target.className='coverage-select '+event.target.value.toLowerCase().replace('-','');saveSiteCoverage();filterSiteCoverage()}});
 document.addEventListener('click',event=>{const cell=event.target.closest('.site-assignment-matrix:not([data-readonly="true"]) .assignment-cell');if(cell){event.preventDefault();toggleAssignment(cell)}});
 document.addEventListener('keydown',event=>{const cell=event.target.closest?.('.site-assignment-matrix:not([data-readonly="true"]) .assignment-cell');if(cell&&(event.key==='Enter'||event.key===' ')){event.preventDefault();toggleAssignment(cell)}});
 document.addEventListener('click',event=>{const button=event.target.closest('.btn.primary'),table=document.querySelector('.site-assignment-matrix:not([data-readonly="true"])');if(!button||!table||active!=='Manpower')return;event.preventDefault();event.stopImmediatePropagation();saveSiteCoverage();sessionStorage.setItem('manpowerVisualTab','onsite');show('Site coverage changes saved')},true);
 function addSiteSummary(card){if(!card||card.parentElement?.querySelector('.unified-kpi-grid'))return;const chartCard=card.previousElementSibling?.classList.contains('site-team-coverage-card')?card.previousElementSibling:null,target=chartCard||card;target.insertAdjacentHTML('beforebegin','<section class="unified-kpi-grid"><article class="summary-card tone-orange"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><div><b>Total Locations</b><small>All supported sites</small></div><strong>12</strong></article><article class="summary-card tone-green"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 12-4.9M16 19l2 2 4-5"/></svg></span><div><b>Full-Time</b><small>Dedicated coverage</small></div><strong>5</strong></article><article class="summary-card tone-yellow"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M8 14h3M8 17h6"/><circle cx="17" cy="16" r="2"/></svg></span><div><b>Scheduled</b><small>Recurring support</small></div><strong>6</strong></article><article class="summary-card tone-red"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="M4 20V6a2 2 0 0 1 2-2h9l5 5v11H4Z"/><path d="M15 4v5h5M8 14h8M8 17h5"/></svg></span><div><b>Planned</b><small>Upcoming coverage</small></div><strong>1</strong></article></section>')}
 function addSiteOverviewTitle(card){const summary=card?.parentElement?.querySelector('.unified-kpi-grid');if(!summary||summary.previousElementSibling?.classList.contains('site-overview-heading'))return;summary.insertAdjacentHTML('beforebegin','<div class="planning-visual-heading site-overview-heading"><div><h2>Site Coverage Overview</h2><p>Support presence across business locations</p></div></div>')}
 function clearUnassigned(){document.querySelectorAll('.site-assignment-matrix:not([data-readonly="true"]) .assignment-cell').forEach(cell=>{if(cell.textContent.trim()==='—')cell.textContent='';cell.removeAttribute('contenteditable');cell.setAttribute('role','checkbox');cell.setAttribute('tabindex','0');cell.setAttribute('aria-checked',cell.textContent.includes('✓')?'true':'false')});document.querySelectorAll('.site-assignment-matrix tbody td:nth-child(3)').forEach(cell=>{cell.removeAttribute('contenteditable');cell.classList.add('assigned-total');cell.setAttribute('aria-readonly','true')});document.querySelectorAll('.site-assignment-matrix').forEach(restoreSiteCoverage);document.querySelectorAll('.site-assignment-matrix').forEach(table=>{const card=table.closest('.unified-table-card');addSiteSummary(card);addSiteOverviewTitle(card)})}
 clearUnassigned();new MutationObserver(records=>records.some(record=>record.addedNodes.length)&&clearUnassigned()).observe(document.body,{childList:true,subtree:true});
})();


/* Keep Microsoft 365 License totals permanently read-only */
(function(){
 function lockLicenseTotal(){const table=document.querySelector('[data-table="license-utilization"] table');if(table)table.classList.add('m365-license-table');document.querySelectorAll('[data-table="license-utilization"] tr.total-row td').forEach(cell=>{cell.removeAttribute('contenteditable');cell.removeAttribute('data-key');cell.removeAttribute('tabindex');cell.classList.remove('is-editing','is-click-focused');cell.classList.add('derived-cell');cell.setAttribute('aria-readonly','true')})}
 document.addEventListener('beforeinput',event=>{if(event.target.closest?.('[data-table="license-utilization"] tr.total-row'))event.preventDefault()},true);
 lockLicenseTotal();new MutationObserver(records=>records.some(record=>record.addedNodes.length)&&lockLicenseTotal()).observe(document.body,{childList:true,subtree:true});
})();



(function(){
 function recolorCharts(){
   const dark=document.body.classList.contains('dark');
   if(window.bar){const ds=bar.data.datasets[0];ds.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,139,87,.16)':'rgba(209,42,49,.12)'):(dark?'#f27642':'#d12a31');ds.borderColor=dark?'#ff9b6f':'#d12a31';ds.borderWidth=3;bar.options.scales.x.ticks.color=dark?'#d9c4c2':'#827477';bar.options.scales.y.ticks.color=dark?'#d9c4c2':'#827477';bar.options.scales.y.grid.color=dark?'#522e35':'#f1e4dd';bar.update()}
   if(window.donut){donut.data.datasets[0].backgroundColor=dark?['#ff8755','#f6c768','#da5a62','#9e7942']:['#d12a31','#f06428','#d6a13b','#8d5754'];donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf6';donut.update()}
 }
 window.toggleTheme=function(){document.body.classList.toggle('dark');localStorage.setItem('itHubTheme',document.body.classList.contains('dark')?'dark':'light');recolorCharts()};
 const toggle=document.querySelector('.theme-toggle');if(toggle){toggle.onclick=window.toggleTheme;toggle.setAttribute('aria-label','Toggle dark mode');toggle.setAttribute('title','Switch light or dark theme')}
 const baseCharts=window.charts;window.charts=function(){baseCharts();recolorCharts()};
 recolorCharts();
})();



(function(){
 const navEl=document.getElementById('nav');
 function decorateNav(){
  navEl.querySelectorAll('button').forEach(button=>{if(button.dataset.decorated)return;const text=button.textContent.trim();const found=menu.find(item=>text.endsWith(item[1]));if(found){button.innerHTML='<span class="nav-icon">'+found[0]+'</span><span class="nav-text">'+found[1]+'</span>';button.dataset.decorated='yes'}})
 }
 const observer=new MutationObserver(decorateNav);observer.observe(navEl,{childList:true});decorateNav();
 const brand=document.querySelector('.brand');
 if(brand&&!document.querySelector('.collapse-btn')){const collapse=document.createElement('button');collapse.className='collapse-btn';collapse.innerHTML='‹';collapse.title='Collapse menu';collapse.onclick=()=>{side.classList.toggle('collapsed');localStorage.setItem('itHubSidebar',side.classList.contains('collapsed')?'collapsed':'open')};brand.append(collapse);if(localStorage.getItem('itHubSidebar')==='collapsed')side.classList.add('collapsed')}
 function updateBrandCharts(){
   const dark=document.body.classList.contains('dark');
   if(window.bar){const dataSet=bar.data.datasets[0],ctx=bar.ctx,gradient=ctx.createLinearGradient(0,0,0,bar.height);gradient.addColorStop(0,dark?'#ff9365':'#d12a31');gradient.addColorStop(1,dark?'#b64138':'#f5a044');dataSet.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,139,87,.16)':'rgba(209,42,49,.10)'):gradient;dataSet.borderColor=dark?'#ff986c':'#d12a31';dataSet.borderWidth=3;dataSet.pointRadius=4;dataSet.pointHoverRadius=6;dataSet.pointBackgroundColor=dark?'#ffc06b':'#f06428';bar.options.scales.x.ticks.color=dark?'#dfc8c5':'#7d6663';bar.options.scales.y.ticks.color=dark?'#dfc8c5':'#7d6663';bar.options.scales.y.grid.color=dark?'#533035':'#f1e2db';bar.update()}
   if(window.donut){donut.data.datasets[0].backgroundColor=dark?['#ff8452','#f7c66a','#d85962','#a57943']:['#d12a31','#f06428','#d6a13b','#8d5754'];donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf7';donut.data.datasets[0].borderWidth=5;donut.options.plugins.brandCentre={label:'TOTAL',value:donut.data.datasets[0].data.reduce((a,b)=>a+b,0),dark};donut.update()}
 }
 if(!Chart.registry.plugins.get('brandCentre'))Chart.register({id:'brandCentre',afterDraw(chart,args,opts){if(chart.canvas.id!=='pie'||!opts)return;const c=chart.ctx,a=chart.chartArea,x=(a.left+a.right)/2,y=(a.top+a.bottom)/2;c.save();c.textAlign='center';c.fillStyle=opts.dark?'#e4cbc6':'#8b5d52';c.font='700 10px Arial';c.fillText(opts.label,x,y-4);c.fillStyle=opts.dark?'#fff3e9':'#3d2525';c.font='700 22px Arial';c.fillText(opts.value,x,y+19);c.restore()}});
 const previousCharts=window.charts;window.charts=function(){previousCharts();updateBrandCharts()};
 const previousToggle=window.toggleTheme;window.toggleTheme=function(){previousToggle();updateBrandCharts()};updateBrandCharts();
 file.onchange=e=>{const upload=e.target.files[0];if(!upload)return;const reader=new FileReader();reader.onload=result=>{const workbook=XLSX.read(result.target.result,{type:'array'});let changed=[],first='';workbook.SheetNames.forEach(sheet=>{const rows=XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{defval:''});if(!rows.length)return;const normal=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');const target=Object.keys(data).find(name=>normal(name)===normal(sheet))||sheet;data[target]=rows;changed.push(target);if(!first)first=target});if(!changed.length)return show('No data rows found');buildNav();page(first);show(changed.length+' page'+(changed.length>1?'s':'')+' updated; other pages kept unchanged')};reader.readAsArrayBuffer(upload)};
})();



(function(){
 buildNav();page(active);
 function applyProfessionalCharts(){
   const dark=document.body.classList.contains('dark');
   const colors=dark?['#ff8452','#f7c66a','#d85962','#a57943','#d98957','#c75b71','#e2af4d']:['#d12a31','#f06428','#d6a13b','#8d5754','#e48654','#b94958','#c89435'];
   if(window.bar){const set=bar.data.datasets[0],ctx=bar.ctx,g=ctx.createLinearGradient(0,0,0,bar.height);g.addColorStop(0,dark?'#ff9569':'#d12a31');g.addColorStop(1,dark?'#cc4e40':'#f4a044');set.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,132,82,.16)':'rgba(209,42,49,.12)'):g;set.borderColor=dark?'#ff9569':'#d12a31';set.pointBackgroundColor='#f3ad4a';set.pointBorderColor=dark?'#32171e':'#fffaf7';set.pointRadius=4;set.pointHoverRadius=7;set.borderWidth=3;bar.update()}
   if(window.donut){donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>colors[i%colors.length]);donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf7';donut.data.datasets[0].borderWidth=5;donut.options.plugins.brandCentre={label:'STATUS',value:donut.data.datasets[0].data.reduce((a,b)=>a+b,0),dark};donut.update();(document.getElementById('microsoft365LicenseLegend')||document.getElementById('legend')).innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+colors[i%colors.length]+'"></i>'+label+'</span><b>'+donut.data.datasets[0].data[i]+' records</b></div>').join('')}
 }
 const oldCharts=window.charts;window.charts=function(){oldCharts();applyProfessionalCharts()};
 const oldTheme=window.toggleTheme;window.toggleTheme=function(){oldTheme();applyProfessionalCharts()};
 /* A file updates the currently open page only. Sheet names never create menus. */
 file.onchange=e=>{const upload=e.target.files[0];if(!upload)return;const reader=new FileReader();reader.onload=result=>{const workbook=XLSX.read(result.target.result,{type:'array'});const normal=x=>String(x).toLowerCase().replace(/[^a-z0-9]/g,'');const preferred=workbook.SheetNames.find(name=>normal(name)===normal(active))||workbook.SheetNames[0];const rows=XLSX.utils.sheet_to_json(workbook.Sheets[preferred],{defval:''});if(!rows.length)return show('No data rows found in the selected worksheet');data[active]=rows;page(active);show('Excel data updated for '+active+' only')};reader.readAsArrayBuffer(upload)};
 applyProfessionalCharts();
})();



(function(){
 /* Replace the earlier centre-label renderer so no undefined text can be drawn. */
 const previousCentre=Chart.registry.plugins.get('brandCentre'); if(previousCentre) Chart.unregister(previousCentre);
 Chart.register({id:'brandCentre',afterDraw(chart,args,opts){if(chart.canvas.id!=='pie'||!opts||!Number.isFinite(opts.total))return;const dark=document.body.classList.contains('dark'),area=chart.chartArea,ctx=chart.ctx,x=(area.left+area.right)/2,y=(area.top+area.bottom)/2;ctx.save();ctx.textAlign='center';ctx.fillStyle=dark?'#f2dcd6':'#7d5048';ctx.font='700 10px Poppins, Arial';ctx.fillText(opts.label||'PORTFOLIO',x,y-5);ctx.fillStyle=dark?'#fff7f0':'#351d20';ctx.font='700 22px Poppins, Arial';ctx.fillText(String(opts.total),x,y+19);ctx.restore()}});
 function syncDashboardVisuals(){
   const dark=document.body.classList.contains('dark');
   const palette=dark?['#ff8755','#f5c66b','#d85b64','#ad7d45','#dd925e','#c75f78','#e1b253']:['#d12a31','#f06428','#d6a13b','#8d5754','#e38152','#b84758','#c28e34'];
   if(typeof bar!=='undefined'&&bar){const dataset=bar.data.datasets[0],gradient=bar.ctx.createLinearGradient(0,0,0,bar.height);gradient.addColorStop(0,dark?'#ff9469':'#d12a31');gradient.addColorStop(1,dark?'#bd493e':'#f3a047');dataset.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,135,85,.17)':'rgba(209,42,49,.12)'):gradient;dataset.borderColor=dark?'#ff986d':'#d12a31';dataset.pointBackgroundColor='#f0a541';dataset.pointBorderColor=dark?'#32171e':'#fffaf7';dataset.borderWidth=3;dataset.pointRadius=4;dataset.pointHoverRadius=7;bar.options.scales.x.ticks.color=dark?'#e5ccc7':'#806864';bar.options.scales.x.ticks.callback=function(v){const label=this.getLabelForValue(v);return label.length>22?label.slice(0,21)+'…':label};bar.options.scales.x.ticks.maxRotation=35;bar.options.scales.x.ticks.minRotation=35;bar.options.scales.y.ticks.color=dark?'#e5ccc7':'#806864';bar.options.scales.y.grid.color=dark?'#553137':'#f1e2db';bar.update()}
   if(typeof donut!=='undefined'&&donut){const values=donut.data.datasets[0].data;donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>palette[i%palette.length]);donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf7';donut.data.datasets[0].borderWidth=5;donut.options.plugins.brandCentre={total:values.reduce((a,b)=>a+b,0),dark};donut.update();(document.getElementById('microsoft365LicenseLegend')||document.getElementById('legend')).innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+palette[i%palette.length]+'"></i>'+label+'</span><b>'+values[i]+' records</b></div>').join('')}
 }
 /* Any edit to the table now refreshes KPI cards, the line/bar chart, and the pie chart. */
 document.addEventListener('focusout',event=>{if(event.target.matches('td[contenteditable]'))setTimeout(()=>{render();syncDashboardVisuals()},0)});
 const chartFunction=window.charts;window.charts=function(){chartFunction();syncDashboardVisuals()};
 const themeFunction=window.toggleTheme;window.toggleTheme=function(){themeFunction();syncDashboardVisuals()};
 syncDashboardVisuals();
})();



(function(){
 const serviceTicketDefaults=[];
 sample['Copier & Printer Usage']=[{Device:'Head Office Copier',Company:'Nature Alliance',Location:'Head Office',MonoPages:4280,ColorPages:760,Status:'Active'},{Device:'Finance Printer',Company:'Nature Valley',Location:'Finance Office',MonoPages:2150,ColorPages:320,Status:'Active'},{Device:'Operations Copier',Company:'Innobuilder',Location:'Operations Office',MonoPages:3340,ColorPages:510,Status:'Active'},{Device:'Branch Printer',Company:'Arise',Location:'Branch Office',MonoPages:1840,ColorPages:245,Status:'Maintenance'}];
 const allowed=['Dashboard','Manpower','Budget & Expense','Copier & Printer Usage','Service Tickets','Fixed Assets','Microsoft 365'];
 const routes={'Dashboard':'#/','Manpower':'#/manpower','Budget & Expense':'#/budget-expense','Copier & Printer Usage':'#/copier-printer-usage','Service Tickets':'#/service-tickets','Fixed Assets':'#/fixed-assets','Microsoft 365':'#/microsoft-365'};
 const routePages=Object.fromEntries(Object.entries(routes).map(([page,path])=>[path.toLowerCase(),page]));const routeKey=()=>location.hash.toLowerCase()||'#/';
 const icons={'Dashboard':'🏠','Manpower':'👥','Budget & Expense':'💰','Copier & Printer Usage':'🖨️','Service Tickets':'🎫','Fixed Assets':'💻','Microsoft 365':'<img src="assets/images/microsoft-365.png?v=4" alt="" width="21" height="21">'};
 function limitPages(){
   const refreshTicketSample=localStorage.getItem('serviceTicketSampleVersion')!=='3';
   if(refreshTicketSample)data['Service Tickets']=JSON.parse(JSON.stringify(serviceTicketDefaults));
   const clean={};allowed.forEach(name=>{clean[name]=Array.isArray(data[name])?data[name]:(Array.isArray(sample[name])?JSON.parse(JSON.stringify(sample[name])):[])});data=clean;
   try{const saved=JSON.parse(localStorage.getItem('itHubData')||'{}'),savedClean={};allowed.forEach(name=>{savedClean[name]=name==='Service Tickets'&&refreshTicketSample?clean[name]:(Array.isArray(saved[name])?saved[name]:clean[name])});data=savedClean;localStorage.setItem('itHubData',JSON.stringify(savedClean));if(refreshTicketSample)localStorage.setItem('serviceTicketSampleVersion','3')}catch(e){}
 }
 function syncActive(name){[...nav.children].forEach(button=>{const selected=button.querySelector('.nav-text')?.textContent===name;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false')});[...tabs.children].forEach(button=>button.classList.toggle('active',button.textContent===name))}function go(name,push=true){if(push&&routeKey()!==routes[name].toLowerCase())history.pushState({page:name},'',routes[name]);page(name);syncActive(name)}
 window.buildNav=function(){
   limitPages();nav.innerHTML=tabs.innerHTML='';
   allowed.forEach(name=>{const a=document.createElement('button'),b=document.createElement('button');a.innerHTML='<span class="nav-icon">'+icons[name]+'</span><span class="nav-text">'+name+'</span>';a.dataset.decorated='yes';a.dataset.href=routes[name];a.dataset.page=name;a.onclick=()=>go(name);b.textContent=name;b.onclick=()=>go(name);nav.append(a);tabs.append(b)});
 };
 window.addEventListener('popstate',()=>go(routePages[routeKey()]||'Dashboard',false));window.addEventListener('hashchange',()=>go(routePages[routeKey()]||'Dashboard',false));
 limitPages();buildNav();const requested=routePages[routeKey()]||'Dashboard';if(!routePages[routeKey()])history.replaceState({page:requested},'',routes[requested]);go(requested,false);
 const brand=document.querySelector('.brand span');if(brand)brand.innerHTML='<strong>Nature A</strong><small>Digital Hub</small>';
})();



(function(){
 if(typeof Chart==='undefined')return;
 Chart.defaults.animation.duration=900;
 Chart.defaults.animation.easing='easeOutQuart';
 if(typeof window.charts==='function')window.charts();
})();



(function(){
 function applyChartThemeNoAnimation(){
   const dark=document.body.classList.contains('dark');
   const text=dark?'#e8d1cc':'#806864',grid=dark?'#553137':'#f1e2db',card=dark?'#32171e':'#fffaf7';
   const status=dark?['#ff8755','#f5c66b','#d85b64','#ad7d45']:['#d12a31','#f06428','#d6a13b','#8d5754'];
   Chart.defaults.color=text;
   if(window.bar){
     const ds=bar.data.datasets[0],ctx=bar.ctx,gradient=ctx.createLinearGradient(0,0,0,bar.height||250);
     gradient.addColorStop(0,dark?'#ff9569':'#d12a31');gradient.addColorStop(1,dark?'#bd493e':'#f3a047');
     ds.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,135,85,.18)':'rgba(209,42,49,.12)'):gradient;
     ds.borderColor=dark?'#ff986d':'#d12a31';ds.pointBackgroundColor=dark?'#ffc06b':'#f06428';ds.pointBorderColor=card;
     bar.options.scales.x.ticks.color=text;bar.options.scales.y.ticks.color=text;bar.options.scales.x.grid.color='transparent';bar.options.scales.y.grid.color=grid;
     bar.options.plugins.tooltip={backgroundColor:'#3b2024',titleColor:'#fff',bodyColor:'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1};
     bar.update('none');
   }
   if(window.donut){
     const values=donut.data.datasets[0].data;
     donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>status[i%status.length]);donut.data.datasets[0].borderColor=card;donut.data.datasets[0].borderWidth=5;
     donut.options.plugins.brandCentre={total:values.reduce((a,b)=>a+b,0),dark};
     donut.options.plugins.tooltip={backgroundColor:'#3b2024',titleColor:'#fff',bodyColor:'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1};
     donut.update('none');(document.getElementById('microsoft365LicenseLegend')||document.getElementById('legend')).innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+status[i%status.length]+'"></i>'+label+'</span><b>'+values[i]+' records</b></div>').join('');
   }
 }
 window.toggleTheme=function(){const dark=!document.body.classList.contains('dark');document.body.classList.toggle('dark',dark);localStorage.setItem('itHubTheme',dark?'dark':'light');const label=document.getElementById('themeText');if(label)label.textContent=dark?'Dark':'Light';if(window.bar&&bar.stop)bar.stop();if(window.donut&&donut.stop)donut.stop();window.charts();applyChartThemeNoAnimation()};
 const toggle=document.querySelector('.theme-toggle');if(toggle)toggle.onclick=window.toggleTheme;
 applyChartThemeNoAnimation();
})();



window.exportXlsx=function(){
 const visibleTable=document.querySelector('#table table');
 if(!visibleTable)return show('No table data to export');
 const workbook=XLSX.utils.table_to_book(visibleTable,{sheet:active.slice(0,31),raw:true});
 const filePage=active.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 XLSX.writeFile(workbook,'Nature-A-Digital-Hub-'+filePage+'.xlsx');
 show(active+' table exported');
};



(function(){
 const companyDefaults=[
  {Company:'AIP','Total Account':25,'Business Basic':5,'Business Standard':9,'Premium P1':1,'E3 (No Team)':3,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':4,'Defender for Office (Plan 2)':1,'Power BI Pro':2,'Exchange Online Archiving':0},
  {Company:'Nature Allliance','Total Account':152,'Business Basic':95,'Business Standard':44,'Premium P1':4,'E3 (No Team)':0,F1:1,'Defender for Business':1,'Defender for Office (Plan 1)':4,'Defender for Office (Plan 2)':1,'Power BI Pro':1,'Exchange Online Archiving':1},
  {Company:'Innobuilder','Total Account':75,'Business Basic':52,'Business Standard':23,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Nature Valley','Total Account':33,'Business Basic':19,'Business Standard':14,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'PIP Myanmar','Total Account':48,'Business Basic':35,'Business Standard':13,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Prime Asset','Total Account':4,'Business Basic':1,'Business Standard':3,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Kuthen Estate','Total Account':5,'Business Basic':3,'Business Standard':2,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Solid Alliance','Total Account':1,'Business Basic':0,'Business Standard':1,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Nature Build','Total Account':1,'Business Basic':0,'Business Standard':1,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Total','Total Account':344,'Business Basic':210,'Business Standard':110,'Premium P1':5,'E3 (No Team)':3,F1:1,'Defender for Business':1,'Defender for Office (Plan 1)':8,'Defender for Office (Plan 2)':2,'Power BI Pro':3,'Exchange Online Archiving':1}
 ];
 const licenseDefaults=[
  {Licenses:'Exchange Online Archiving',Features:'Add-on','Total Licenses':2,'Active Users':1,'Available License':1},
  {Licenses:'Business Basic',Features:'Business','Total Licenses':215,'Active Users':210,'Available License':5},
  {Licenses:'Business Standard',Features:'Business','Total Licenses':115,'Active Users':110,'Available License':5},
  {Licenses:'E3 (No Team)',Features:'Enterprise','Total Licenses':3,'Active Users':3,'Available License':0},
  {Licenses:'F1',Features:'Frontline','Total Licenses':3,'Active Users':1,'Available License':2},
  {Licenses:'Defender for Business',Features:'Security Add-on','Total Licenses':3,'Active Users':1,'Available License':2},
  {Licenses:'Defender for Office (Plan 1)',Features:'Security Add-on','Total Licenses':8,'Active Users':8,'Available License':0},
  {Licenses:'Defender for Office (Plan 2)',Features:'Security Add-on','Total Licenses':3,'Active Users':2,'Available License':1},
  {Licenses:'Premium P1',Features:'Identity / Security','Total Licenses':5,'Active Users':5,'Available License':0},
  {Licenses:'Power BI Pro',Features:'Analytics','Total Licenses':3,'Active Users':3,'Available License':0},
  {Licenses:'Total',Features:'','Total Licenses':360,'Active Users':344,'Available License':16}
 ];
 const clone=x=>JSON.parse(JSON.stringify(x));
 function validCompany(rows){return Array.isArray(rows)&&rows.length&&Object.prototype.hasOwnProperty.call(rows[0],'Company')}
 function loadCompany(){try{const saved=JSON.parse(localStorage.getItem('m365CompanyDB'));if(validCompany(saved))return saved}catch(e){}return clone(companyDefaults)}
 function loadLicenses(){try{const saved=JSON.parse(localStorage.getItem('m365LicensesDB'));if(Array.isArray(saved)&&saved.length&&saved[0].Licenses)return saved}catch(e){}return clone(licenseDefaults)}
 let licenseRows=loadLicenses();
 data['Microsoft 365']=loadCompany();
 function escCell(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function renderLicenses(){
  let card=document.querySelector('[data-table="license-utilization"]');
  if(active!=='Microsoft 365'){if(card)card.remove();return}
  if(!card){card=document.createElement('section');card.className='card unified-table-card';card.dataset.table='license-utilization';document.querySelector('.tablecard').after(card)}
  const keys=Object.keys(licenseRows[0]||{});
  card.className='card unified-table-card';card.innerHTML='<div class="head"><div><h2>License Summary</h2><div class="table-note">LicensesDB · '+(licenseRows.length-1)+' license types</div></div></div><div class="table-scroll"><table><thead><tr>'+keys.map(k=>'<th>'+escCell(k)+'</th>').join('')+'</tr></thead><tbody>'+licenseRows.map((row,index)=>'<tr data-index="'+index+'" class="'+(row.Licenses==='Total'?'total-row':'')+'">'+keys.map(k=>'<td '+(row.Licenses==='Total'?'':'contenteditable data-key="'+escCell(k)+'"')+'>'+escCell(row[k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="foot">Showing '+(licenseRows.length-1)+' license records plus totals · Click a value to edit</div>';
  card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),raw=event.target.textContent.trim();licenseRows[+tr.dataset.index][event.target.dataset.key]=raw!==''&&!isNaN(+raw)?+raw:raw;localStorage.setItem('m365LicensesDB',JSON.stringify(licenseRows));charts()});
 }
 const baseTable=window.table;
 window.table=function(){baseTable();if(active==='Microsoft 365'){document.getElementById('ttitle').textContent='Company License Allocation';const rows=document.querySelectorAll('#table tbody tr');if(rows.length){const last=rows[rows.length-1];last.classList.add('total-row');last.querySelectorAll('[contenteditable]').forEach(cell=>cell.removeAttribute('contenteditable'))}renderLicenses()}else{renderLicenses()}};
 const basePage=window.page;
 window.page=function(name){if(name==='Microsoft 365'&&!validCompany(data[name]))data[name]=loadCompany();basePage(name);if(name==='Microsoft 365'){document.getElementById('ttitle').textContent='Company License Allocation';renderLicenses()}};
 const saveButton=document.querySelector('.btn.primary');if(saveButton)saveButton.addEventListener('click',()=>{if(active==='Microsoft 365'){localStorage.setItem('m365CompanyDB',JSON.stringify(data['Microsoft 365']));localStorage.setItem('m365LicensesDB',JSON.stringify(licenseRows))}});
 window.exportXlsx=function(){
  const tables=[...document.querySelectorAll(active==='Microsoft 365'?'#table table,[data-table="license-utilization"] table':'#table table')];if(!tables.length)return show('No table data to export');
  const workbook=XLSX.utils.book_new();tables.forEach((table,index)=>{const sheet=XLSX.utils.table_to_sheet(table,{raw:true});XLSX.utils.book_append_sheet(workbook,sheet,active==='Microsoft 365'?(index===0?'CompanyDB':'LicensesDB'):active.slice(0,31))});
  XLSX.writeFile(workbook,'Nature-A-Digital-Hub-'+active.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.xlsx');show((active==='Microsoft 365'?'Two tables':'Table')+' exported');
 };
 if(active==='Microsoft 365'){data['Microsoft 365']=loadCompany();render()}
})();



(function(){
 const licenseSeed=[{Licenses:'Exchange Online Archiving',Features:'Add-on','Total Licenses':2,'Active Users':1,'Available License':1},{Licenses:'Business Basic',Features:'Business','Total Licenses':215,'Active Users':210,'Available License':5},{Licenses:'Business Standard',Features:'Business','Total Licenses':115,'Active Users':110,'Available License':5},{Licenses:'E3 (No Team)',Features:'Enterprise','Total Licenses':3,'Active Users':3,'Available License':0},{Licenses:'F1',Features:'Frontline','Total Licenses':3,'Active Users':1,'Available License':2},{Licenses:'Defender for Business',Features:'Security Add-on','Total Licenses':3,'Active Users':1,'Available License':2},{Licenses:'Defender for Office (Plan 1)',Features:'Security Add-on','Total Licenses':8,'Active Users':8,'Available License':0},{Licenses:'Defender for Office (Plan 2)',Features:'Security Add-on','Total Licenses':3,'Active Users':2,'Available License':1},{Licenses:'Premium P1',Features:'Identity / Security','Total Licenses':5,'Active Users':5,'Available License':0},{Licenses:'Power BI Pro',Features:'Analytics','Total Licenses':3,'Active Users':3,'Available License':0},{Licenses:'Total',Features:'','Total Licenses':360,'Active Users':344,'Available License':16}];
 let licenses;try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))}catch(e){}if(!Array.isArray(licenses)||!licenses.length)licenses=JSON.parse(JSON.stringify(licenseSeed));
 const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const slug=value=>String(value).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 function companies(){return data['Microsoft 365']||[]}
 function recalculate(){
  const rows=companies(),normal=rows.filter(row=>row.Company!=='Total'),total=rows.find(row=>row.Company==='Total')||{Company:'Total'};if(!rows.includes(total))rows.push(total);
  const licenseNames=licenses.filter(row=>row.Licenses!=='Total').map(row=>row.Licenses);
  normal.forEach(row=>row['Total Account']=licenseNames.reduce((sum,name)=>sum+(Number(row[name])||0),0));
  total['Total Account']=normal.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0);licenseNames.forEach(name=>total[name]=normal.reduce((sum,row)=>sum+(Number(row[name])||0),0));
  licenses.filter(row=>row.Licenses!=='Total').forEach(row=>{row['Active Users']=Number(total[row.Licenses])||0;row['Total Licenses']=Number(row['Total Licenses'])||0;row['Available License']=row['Total Licenses']-row['Active Users']});
  let licenseTotal=licenses.find(row=>row.Licenses==='Total');if(!licenseTotal){licenseTotal={Licenses:'Total',Features:''};licenses.push(licenseTotal)};['Total Licenses','Active Users','Available License'].forEach(key=>licenseTotal[key]=licenses.filter(row=>row.Licenses!=='Total').reduce((sum,row)=>sum+(Number(row[key])||0),0));
  localStorage.setItem('m365CompanyDB',JSON.stringify(rows));localStorage.setItem('m365LicensesDB',JSON.stringify(licenses));localStorage.setItem('itHubData',JSON.stringify(data));
 }
 function title(icon,title,sub){return '<div class="unified-table-title"><span class="unified-table-title-icon">'+icon+'</span><div><h2>'+title+'</h2><p>'+sub+'</p></div></div>'}
 function syncM365CompanyTable(){const table=document.querySelector('.m365-company-table');if(!table)return;const currentRows=companies();table.querySelectorAll('tbody tr[data-index]').forEach(tr=>{const row=currentRows[+tr.dataset.index];if(!row)return;const keys=Object.keys(row);[...tr.cells].forEach((cell,index)=>{if(!cell.isContentEditable)cell.textContent=row[keys[index]]??''})})}
 function renderCompany(){
  const rows=companies(),normal=rows.filter(row=>row.Company!=='Total').sort((a,b)=>(Number(b['Total Account'])||0)-(Number(a['Total Account'])||0)),total=rows.find(row=>row.Company==='Total'),keys=Object.keys(rows[0]||{}),q=(document.getElementById('m365CompanySearch')?.value||'').toLowerCase(),selected=document.getElementById('m365CompanyFilter')?.value||'All';
  const shown=normal.filter(row=>(selected==='All'||row.Company===selected)&&row.Company.toLowerCase().includes(q));
  document.querySelector('#microsoft365Dashboard>.unified-table-card:not([data-table="license-utilization"]) .unified-table-head,main>.tablecard .head').innerHTML=title('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 21h18M5 21V7l7-4v18M12 10h7v11M8 9h1M8 13h1M8 17h1M15 14h1M15 18h1"/></svg>','Company License Distribution','LICENSE ALLOCATION SUMMARY')+'<div class="tools"><input id="m365CompanySearch" class="search" placeholder="Search company..." value="'+escapeHtml(q)+'"><select id="m365CompanyFilter" class="filter"><option value="All">All companies</option>'+normal.map(row=>'<option '+(row.Company===selected?'selected':'')+'>'+escapeHtml(row.Company)+'</option>').join('')+'</select></div>';
  const display=shown.concat(total?[total]:[]),companyTable=document.getElementById('table');companyTable.className='unified-table-scroll';companyTable.innerHTML='<table class="m365-company-table"><thead><tr>'+keys.map(key=>'<th>'+escapeHtml(key)+'</th>').join('')+'</tr></thead><tbody>'+display.map(row=>{const index=rows.indexOf(row),isTotal=row.Company==='Total';return '<tr data-index="'+index+'" class="'+(isTotal?'total-row':'')+'">'+keys.map(key=>{const editable=!isTotal&&key!=='Total Account';return '<td class="'+(editable?'':'derived-cell')+'" '+(editable?'contenteditable data-key="'+escapeHtml(key)+'"':'')+'>'+escapeHtml(row[key])+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>';foot.className='unified-table-footer';foot.textContent='Showing '+shown.length+' of '+normal.length+' companies';
  document.getElementById('m365CompanySearch').oninput=null;document.getElementById('m365CompanyFilter').onchange=null;document.querySelectorAll('#table td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),raw=event.target.textContent.trim(),key=event.target.dataset.key;rows[+tr.dataset.index][key]=raw!==''&&!isNaN(+raw)?+raw:raw;if(key==='Company'){localStorage.setItem('m365CompanyDB',JSON.stringify(rows));return}recalculate();syncM365CompanyTable();syncM365LicenseTable();requestAnimationFrame(()=>charts())});
 }
function syncM365LicenseTable(){const table=document.querySelector('[data-table="license-utilization"] table');if(!table)return;table.querySelectorAll('tbody tr[data-index],tfoot tr[data-index]').forEach(tr=>{const row=licenses[+tr.dataset.index];if(!row)return;const keys=Object.keys(row);[...tr.cells].forEach((cell,index)=>{if(!cell.isContentEditable&&!cell.querySelector('.feature-badge'))cell.textContent=row[keys[index]]??''})})}function renderLicenses(){
  let card=document.querySelector('[data-table="license-utilization"]');if(!card){card=document.createElement('section');card.className='card unified-table-card';card.dataset.table='license-utilization';document.querySelector('.tablecard').after(card)};
  const normal=licenses.filter(row=>row.Licenses!=='Total'),total=licenses.find(row=>row.Licenses==='Total'),keys=Object.keys(licenses[0]||{}),q=(document.getElementById('m365LicenseSearch')?.value||'').toLowerCase(),selected=document.getElementById('m365FeatureFilter')?.value||'All',features=[...new Set(normal.map(row=>row.Features))];
  const shown=normal.filter(row=>(selected==='All'||row.Features===selected)&&Object.values(row).join(' ').toLowerCase().includes(q));
  card.className='card unified-table-card';card.innerHTML='<div class="unified-table-head">'+title('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h4"/><circle cx="16" cy="16" r="3"/><path d="m14.7 16 1 1 1.8-2"/></svg>','Microsoft 365 License Utilization','LICENSE CAPACITY SUMMARY')+'<div class="tools"><input id="m365LicenseSearch" class="search" placeholder="Search licenses..." value="'+escapeHtml(q)+'"><select id="m365FeatureFilter" class="filter"><option value="All">All features</option>'+features.map(feature=>'<option '+(feature===selected?'selected':'')+'>'+escapeHtml(feature)+'</option>').join('')+'</select></div></div><div class="unified-table-scroll"><table><thead><tr>'+keys.map(key=>'<th>'+escapeHtml(key)+'</th>').join('')+'</tr></thead><tbody>'+shown.concat(total?[total]:[]).map(row=>{const index=licenses.indexOf(row),isTotal=row.Licenses==='Total';return '<tr data-index="'+index+'" class="'+(isTotal?'total-row':'')+'">'+keys.map(key=>{if(key==='Features'&&!isTotal)return '<td><span class="feature-badge feature-'+slug(row[key])+'">'+escapeHtml(row[key])+'</span></td>';const editable=!isTotal&&(key==='Licenses'||key==='Total Licenses');return '<td class="'+(editable?'':'derived-cell')+'" '+(editable?'contenteditable data-key="'+escapeHtml(key)+'"':'')+'>'+escapeHtml(row[key])+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div><div class="unified-table-footer">Showing '+shown.length+' of '+normal.length+' licenses</div>';
  document.getElementById('m365LicenseSearch').oninput=null;document.getElementById('m365FeatureFilter').onchange=null;card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),index=+tr.dataset.index,key=event.target.dataset.key,raw=event.target.textContent.trim(),previous=licenses[index][key];if(key==='Licenses'){if(!raw){event.target.textContent=previous;return}licenses[index][key]=raw;if(raw!==previous){companies().forEach(row=>{if(Object.prototype.hasOwnProperty.call(row,previous)){row[raw]=row[previous];delete row[previous]}})}}else licenses[index][key]=raw!==''&&!isNaN(+raw)?+raw:0;recalculate();key==='Licenses'?(renderCompany(),renderLicenses()):(syncM365CompanyTable(),syncM365LicenseTable());charts()});
 }
 window.renderM365Licenses=renderLicenses; const priorTable=window.table;window.table=function(){if(active!=='Microsoft 365'){const card=document.querySelector('[data-table="license-utilization"]');if(card)card.remove();return priorTable()}recalculate();renderCompany();renderLicenses()};
 const priorPage=window.page;window.page=function(name){priorPage(name);if(name==='Microsoft 365'){recalculate();renderCompany();renderLicenses()}};
 const saveButton=document.querySelector('.btn.primary');if(saveButton)saveButton.addEventListener('click',()=>{if(active==='Microsoft 365')recalculate()});
 recalculate();if(active==='Microsoft 365'){renderCompany();renderLicenses();charts()}
})();



(function(){
 const icons={company:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4v18M12 9h7v12M8 9h1M8 13h1M8 17h1M15 13h1M15 17h1"/></svg>',license:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h7"/></svg>',users:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',available:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>'};
 function renderM365Kpis(){
  const kpiSection=document.querySelector('#microsoft365Dashboard > .unified-kpi-grid')||document.getElementById('kpis');if(!kpiSection)return;
  if(active!=='Microsoft 365')return
  let companies=[];try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))||data['Microsoft 365']||[]}catch(e){companies=data['Microsoft 365']||[]}
  let licenses=[];try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))||[]}catch(e){}
  const selectedLicense=document.getElementById('m365PieFilter')?.value||'All',companyCount=companies.filter(row=>row.Company&&row.Company!=='Total').length,visibleLicenses=licenses.filter(row=>row.Licenses&&row.Licenses!=='Total'&&(selectedLicense==='All'||row.Licenses===selectedLicense)),total={'Total Licenses':visibleLicenses.reduce((sum,row)=>sum+(Number(row['Total Licenses'])||0),0),'Active Users':visibleLicenses.reduce((sum,row)=>sum+(Number(row['Active Users'])||0),0),'Available License':visibleLicenses.reduce((sum,row)=>sum+(Number(row['Available License'])||0),0)};
  const cards=[
   ['Total Companies',companyCount,'Companies in the license portfolio','tone-orange',icons.company],
   ['Total Licenses',Number(total['Total Licenses'])||0,selectedLicense==='All'?'Purchased Microsoft 365 capacity':selectedLicense,'tone-green',icons.license],
   ['Active Users',Number(total['Active Users'])||0,selectedLicense==='All'?'Licenses currently assigned':'Assigned for '+selectedLicense,'tone-yellow',icons.users],
   ['Available Licenses',Number(total['Available License'])||0,selectedLicense==='All'?'Capacity ready to assign':'Available for '+selectedLicense,'tone-blue',icons.available]
  ];
  kpiSection.className='unified-kpi-grid';
  kpiSection.innerHTML=cards.map(card=>'<article class="unified-kpi-card '+card[3]+'"><span class="unified-kpi-icon" aria-hidden="true">'+card[4]+'</span><div><b>'+card[0]+'</b><small>'+card[2]+'</small></div><strong>'+card[1].toLocaleString()+'</strong></article>').join('');
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderM365Kpis()};
 const previousPage=window.page;window.page=function(name){previousPage(name);renderM365Kpis()};

 window.renderM365Kpis=renderM365Kpis;renderM365Kpis();
})();



(function(){
 function sync(){const current=active;document.querySelectorAll('#nav button').forEach(button=>{const selected=(button.dataset.page||button.querySelector('.nav-text')?.textContent)===current;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false')})}
 window.addEventListener('pageshow',sync);window.addEventListener('popstate',sync);document.getElementById('nav').addEventListener('click',()=>queueMicrotask(sync));sync();
})();



(function(){
 const routes={'Dashboard':'#/','Manpower':'#/manpower','Budget & Expense':'#/budget-expense','Copier & Printer Usage':'#/copier-printer-usage','Service Tickets':'#/service-tickets','Fixed Assets':'#/fixed-assets','Microsoft 365':'#/microsoft-365'};
 const routePages=Object.fromEntries(Object.entries(routes).map(([page,path])=>[path.toLowerCase(),page]));const routeKey=()=>location.hash.toLowerCase()||'#/';
 const pageMeta={'Dashboard':['IT Management Overview','A complete view of your digital operations and performance.'],'Manpower':['Manpower','Digital team capacity and workload.'],'Budget & Expense':['Budget & Expense','Monitor technology budgets, spending and cost performance at a glance.'],'Copier & Printer Usage':['Copier & Printer Usage','Device activity, print volumes and operational status.'],'Service Tickets':['Service Tickets','Service demand, issue trends and team allocation insights.'],'Fixed Assets':['Fixed Assets','Technology assets, ownership and lifecycle status.'],'Microsoft 365':['Microsoft 365','Company licensing, users, and subscription capacity.']};
 function syncNavigation(name){document.querySelectorAll('#nav button').forEach(button=>{const selected=(button.dataset.page||button.querySelector('.nav-text')?.textContent)===name;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false');button.dataset.href=routes[button.dataset.page||button.querySelector('.nav-text')?.textContent]||''});document.querySelectorAll('#tabs button').forEach(button=>button.classList.toggle('active',button.textContent===name))}
 function restoreGenericTableShell(){const primary=document.querySelector('main > section.card.tablecard'),head=primary?.querySelector('.head');if(head&&!document.getElementById('search'))head.innerHTML='<h2 id="ttitle"></h2><div class="tools"><input class="search" id="search" oninput="table()" placeholder="Search records..."><select class="filter" id="filter" onchange="table()"></select></div>'}
 window.navigateHubPage=function(name,push=true){
  if(!routes[name])name='Dashboard';
  if(push&&name===active){syncNavigation(name);return}
  /* Keep menu changes inside the current document; the visible URL is synchronized
     after rendering with replaceState so navigation remains refresh-free. */
  active=name;sessionStorage.setItem('itHubActive',name);crumb.textContent=name;h1.textContent=pageMeta[name][0];sub.textContent=pageMeta[name][1];side.classList.remove('open');
  if(name==='Microsoft 365'){const genericChartTitle=document.getElementById('ctitle');if(genericChartTitle)genericChartTitle.textContent='Microsoft 365 performance';table();charts()}else{restoreGenericTableShell();const pageSearch=document.getElementById('search');if(pageSearch)pageSearch.value='';render()}
  syncNavigation(name);document.title='Nature A Digital Hub · '+name;
  if(push&&routeKey()!==routes[name].toLowerCase())history.replaceState({page:name},'',routes[name]);
 };
 document.querySelectorAll('#nav button').forEach(button=>{const name=button.dataset.page||button.querySelector('.nav-text')?.textContent;button.dataset.page=name;button.dataset.href=routes[name];button.onclick=()=>window.navigateHubPage(name,true)});
 document.querySelectorAll('#tabs button').forEach(button=>button.onclick=()=>window.navigateHubPage(button.textContent,true));
 window.addEventListener('popstate',()=>window.navigateHubPage(routePages[routeKey()]||'Dashboard',false));window.addEventListener('hashchange',()=>window.navigateHubPage(routePages[routeKey()]||'Dashboard',false));
 window.navigateHubPage(routePages[routeKey()]||active||'Dashboard',false);
})();



(function(){
 function renderCompanyRanking(){
  const chartTypeControl=document.getElementById('m365CompanyChartType')||document.getElementById('type');
  if(active!=='Microsoft 365'){if(chartTypeControl)chartTypeControl.disabled=false;chart.parentElement.style.height='250px';return}
  const rows=(data['Microsoft 365']||[]).filter(row=>row.Company&&row.Company!=='Total').sort((a,b)=>(Number(b['Total Account'])||0)-(Number(a['Total Account'])||0));
  const compactViewport=window.innerWidth<=460,phoneViewport=window.innerWidth<=700,rowHeight=compactViewport?37:(phoneViewport?39:38),minimumHeight=compactViewport?400:(phoneViewport?420:390),chartHeight=Math.max(minimumHeight,rows.length*rowHeight+74);chart.parentElement.style.setProperty('height',chartHeight+'px','important');const selectedType=chartTypeControl?.value==='line'?'line':'bar',isLine=selectedType==='line';if(chartTypeControl)chartTypeControl.disabled=false;const dark=document.body.classList.contains('dark'),text=dark?'#e8d1cc':'#806864',grid=dark?'#553137':'#eaded9',tooltipTheme={displayColors:true,backgroundColor:'rgba(12,12,14,.88)',titleColor:'#fff',bodyColor:'#fff',borderColor:'rgba(255,255,255,.16)',borderWidth:1,padding:10},ctx=chart.getContext('2d'),gradient=ctx.createLinearGradient(0,0,chart.clientWidth||700,0);
  gradient.addColorStop(0,dark?'#c94a42':'#d12a31');gradient.addColorStop(1,dark?'#ef8563':'#f38c47');
  const registered=Chart.getChart('chart');if(registered)registered.destroy();if(typeof bar!=='undefined'&&bar&&bar!==registered&&typeof bar.destroy==='function'){try{bar.destroy()}catch(e){}}if(chartTypeControl)chartTypeControl.disabled=false;
  bar=new Chart(chart,{type:selectedType,data:{labels:rows.map(row=>row.Company),datasets:[{label:'Total Accounts',data:rows.map(row=>Number(row['Total Account'])||0),backgroundColor:isLine?(dark?'rgba(255,135,85,.10)':'rgba(209,42,49,.10)'):gradient,borderColor:dark?'#ff8755':'#d12a31',borderWidth:isLine?2.5:1.5,borderRadius:isLine?0:7,barThickness:isLine?undefined:(phoneViewport?20:24),categoryPercentage:.74,barPercentage:.9,fill:isLine,tension:.34,pointRadius:isLine?4:0,pointHoverRadius:isLine?6:0,pointBackgroundColor:dark?'#ff9a70':'#c9252d'}]},options:{indexAxis:isLine?'x':'y',responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic'},plugins:{legend:{display:false},tooltip:{...tooltipTheme,callbacks:{label:context=>' '+context.raw.toLocaleString()+' Accounts',labelColor:context=>({borderColor:context.dataset.borderColor,backgroundColor:context.dataset.borderColor,borderWidth:1,borderRadius:2})}}},scales:isLine?{x:{offset:false,grid:{color:grid},ticks:{padding:8,color:text,maxRotation:0,minRotation:0,font:{family:'Poppins',size:9,weight:'500'}}},y:{beginAtZero:true,grid:{color:grid},ticks:{color:text,precision:0,font:{family:'Poppins',size:10}}}}:{y:{offset:true,grid:{display:false},ticks:{padding:9,color:text,font:{family:'Poppins',size:10,weight:'600'}}},x:{beginAtZero:true,grid:{color:grid},ticks:{color:text,font:{family:'Poppins',size:10},precision:0},title:{display:true,text:'Total '+rows.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0).toLocaleString()+' accounts',color:text,font:{family:'Poppins',size:10,weight:'600'}}}}}});
  chart.dataset.orientation='horizontal-left-to-right';chart.dataset.source='Company,Total Account';chart.dataset.excludesTotal='true';chart.dataset.order='descending';const chartTitle=document.querySelector('#microsoft365Dashboard .unified-chart-header h2')||document.getElementById('ctitle');if(chartTitle)chartTitle.textContent='Company Account Distribution';const caption=chartTitle?.parentElement.querySelector('p');if(caption)caption.textContent='Comparative account allocation by company'
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderCompanyRanking()};
 const previousNavigate=window.navigateHubPage;if(previousNavigate)window.navigateHubPage=function(name,push=true){previousNavigate(name,push);renderCompanyRanking()};
 renderCompanyRanking();
})();



(function(){
 function licenseData(){try{return JSON.parse(localStorage.getItem('m365LicensesDB'))||[]}catch(e){return[]}}
 function renderLicenseAvailabilityPie(){
  const licenseLegend=document.getElementById('microsoft365LicenseLegend')||document.getElementById('legend');
  if(active!=='Microsoft 365'||!licenseLegend)return;
  const all=licenseData(),availableRows=all.filter(row=>row.Licenses&&row.Licenses!=='Total'&&(Number(row['Available License'])||0)>0).sort((a,b)=>(Number(b['Available License'])||0)-(Number(a['Available License'])||0)),current=document.getElementById('m365PieFilter')?.value||'All',selected=availableRows.some(row=>row.Licenses===current)?current:'All',rows=selected==='All'?availableRows:availableRows.filter(row=>row.Licenses===selected),displayTotal=rows.reduce((sum,row)=>sum+(Number(row['Available License'])||0),0),dark=document.body.classList.contains('dark');
  const colors=dark?['#ff8755','#f5c66b','#d85b64','#ad7d45','#8f6dde','#4eb4cd','#e28b9b']:['#d12a31','#f06428','#d6a13b','#8d5754','#7656b5','#3194ad','#bb6676'];
  const registered=Chart.getChart('pie');if(registered)registered.destroy();if(typeof donut!=='undefined'&&donut&&donut!==registered&&typeof donut.destroy==='function'){try{donut.destroy()}catch(e){}}
  donut=new Chart(pie,{type:'doughnut',data:{labels:rows.map(row=>row.Licenses),datasets:[{label:'Available Licenses',data:rows.map(row=>Number(row['Available License'])||0),backgroundColor:rows.map((_,index)=>colors[index%colors.length]),borderColor:dark?'#32171e':'#fffaf7',borderWidth:5,cutout:'66%'}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic',animateRotate:true,animateScale:true},plugins:{legend:{display:false},brandCentre:{total:displayTotal,label:'LICENSES',dark},tooltip:{displayColors:true,backgroundColor:'rgba(12,12,14,.88)',titleColor:'#fff',bodyColor:'#fff',borderColor:'rgba(255,255,255,.16)',borderWidth:1,padding:10,callbacks:{label:context=>' '+context.raw.toLocaleString()+' Available',labelColor:context=>({backgroundColor:context.dataset.backgroundColor[context.dataIndex],borderColor:'transparent',borderWidth:0,borderRadius:2})}}}}});
  const pieCard=pie.closest('.unified-chart-card,.card'),titleWrap=pieCard.querySelector('.unified-chart-header,.title'),title=titleWrap.querySelector('h2'),caption=titleWrap.querySelector('p');title.textContent='Available Licenses';caption.removeAttribute('class');caption.textContent=selected==='All'?'Unassigned Microsoft 365 Licenses':'Availability for '+selected;
  titleWrap.querySelector('#m365PieFilter')?.remove();if(availableRows.length){const filter=document.createElement('select');filter.id='m365PieFilter';filter.className='filter unified-chart-select';filter.setAttribute('aria-label','Filter available licenses');filter.innerHTML='<option value="All">All licenses</option>'+availableRows.map(row=>'<option value="'+row.Licenses.replace(/"/g,'&quot;')+'" '+(row.Licenses===selected?'selected':'')+'>'+row.Licenses+'</option>').join('');filter.onchange=()=>{renderLicenseAvailabilityPie();window.renderM365Kpis?.()};titleWrap.append(filter)}requestAnimationFrame(()=>window.refreshUnifiedChartControls?.())
  licenseLegend.className='unified-chart-legend';licenseLegend.innerHTML=rows.length?rows.map((row,index)=>'<div><span class="m365-license-name"><i class="dot" style="background:'+colors[index%colors.length]+'"></i>'+row.Licenses+'</span><b class="m365-license-availability"><strong>'+Number(row['Available License']).toLocaleString()+'</strong><small>available</small></b></div>').join(''):'<div class="m365-no-licenses"><span>All licenses are fully assigned</span><b class="m365-license-availability"><strong>0</strong><small>available</small></b></div>';
  pie.dataset.source='Licenses,Available License';pie.dataset.zeroAvailability='omitted';pie.dataset.availableTotal=String(displayTotal);pie.dataset.sort='highest-to-lowest';pie.dataset.filter=selected;const pieLayout=pie.closest('.unified-pie-layout,.piegrid');if(pieLayout)pieLayout.className='unified-pie-layout';pie.parentElement.className='unified-pie-canvas';
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderLicenseAvailabilityPie()};
 const previousToggle=window.toggleTheme;window.toggleTheme=function(){previousToggle();renderLicenseAvailabilityPie()};const toggle=document.querySelector('.theme-toggle');if(toggle)toggle.onclick=window.toggleTheme;
 const previousNavigate=window.navigateHubPage;if(previousNavigate)window.navigateHubPage=function(name,push=true){previousNavigate(name,push);renderLicenseAvailabilityPie()};
 renderLicenseAvailabilityPie();
})();



(function(){
 const migrationKey='m365PipBusinessBasic35';
 if(localStorage.getItem(migrationKey)==='done')return;
 let companies;
 try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))}catch(e){}
 if(!Array.isArray(companies)||!companies.length)companies=(data['Microsoft 365']||[]);
 const pip=companies.find(row=>row.Company==='PIP Myanmar');
 if(pip){
  pip['Business Basic']=35;
  const totalRow=companies.find(row=>row.Company==='Total');
  const licenseKeys=Object.keys(pip).filter(key=>key!=='Company'&&key!=='Total Account');
  pip['Total Account']=licenseKeys.reduce((sum,key)=>sum+(Number(pip[key])||0),0);
  if(totalRow){
   totalRow['Total Account']=companies.filter(row=>row.Company!=='Total').reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0);
   licenseKeys.forEach(key=>totalRow[key]=companies.filter(row=>row.Company!=='Total').reduce((sum,row)=>sum+(Number(row[key])||0),0));
  }
  data['Microsoft 365']=companies;
  localStorage.setItem('m365CompanyDB',JSON.stringify(companies));
  localStorage.setItem('itHubData',JSON.stringify(data));
 }
 localStorage.setItem(migrationKey,'done');
 location.reload();
})();

/* Service Tickets analytics dashboard powered by Tickets1.xlsx */
(function(){
 const importedSource=Array.isArray(window.TICKETS_DATA)?window.TICKETS_DATA:[];
 let source=importedSource.map(row=>({...row}));
 try{const saved=JSON.parse(localStorage.getItem('serviceTicketData')||'null');if(Array.isArray(saved)&&saved.length)source=saved}catch(e){}
 if(!source.length)return;
 const clean=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const validDates=source.map(row=>new Date(row.completedAt)).filter(date=>!Number.isNaN(date.getTime()));
 const latestDate=new Date(Math.max(...validDates.map(date=>date.getTime())));
 const monthKey=date=>date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0');
 const months=[...new Set(validDates.map(monthKey))].sort().reverse();
 const years=[...new Set(validDates.map(date=>date.getFullYear()))].sort((a,b)=>b-a);
 const companies=[...new Set(source.map(row=>row.company).filter(Boolean))].sort();
 const problems=[...new Set(source.map(row=>row.problem).filter(Boolean))].sort();
 const assigneeOrder=['Soe Maung Maung','Khin Maung Thant','Khon Tay Za','Khaing Zaw Shein','Than Toe Aung','Htin Kyaw Lin','Saw Wai Htun Ko'];
 const assignees=assigneeOrder.filter(name=>source.some(row=>row.assignedTo===name));
 const assigneeLabel=name=>name==='Saw Wai Htun Ko'?'Saw Wai Tun Ko':name;
 const companyOrder=['Nature Alliance','Nature Valley','Innobuilder','Arise','PIP','Prime Asset','Great Golden Moon','MSG','Pyay'];
 let ticketBarChart,ticketPieChart;
 const state={range:'all',month:months[0]||'',year:String(years[0]||''),company:'All companies',problem:'All problems',assignee:'All assignees',companyChartType:'bar',from:'',to:'',search:''};

 function ensurePanel(){
  let panel=document.getElementById('serviceTicketsDashboard');
  if(panel)return panel;
  panel=document.createElement('section');panel.id='serviceTicketsDashboard';panel.hidden=true;
  const hero=document.querySelector('main>.hero');hero?.insertAdjacentElement('afterend',panel);
  return panel;
 }
 function setBaseVisible(visible){
  const baseKpis=document.getElementById('kpis'),baseGrid=document.querySelector('main>.grid'),baseTable=document.querySelector('main>section.card.tablecard');
  if(baseKpis)baseKpis.hidden=!visible;if(baseGrid)baseGrid.hidden=!visible;if(baseTable)baseTable.hidden=!visible;
 }
 function optionList(values,current){return values.map(value=>'<option value="'+clean(value)+'" '+(String(value)===String(current)?'selected':'')+'>'+clean(value)+'</option>').join('')}
 function monthOptionList(){return months.map(value=>{const [year,month]=value.split('-').map(Number),label=new Date(year,month-1,1).toLocaleDateString(undefined,{month:'short',year:'numeric'});return '<option value="'+value+'" '+(value===state.month?'selected':'')+'>'+clean(label)+'</option>'}).join('')}
 function renderShell(){
  const panel=ensurePanel();
  panel.innerHTML='<section class="unified-kpi-grid"><article class="unified-kpi-card tone-orange"><span class="unified-kpi-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6v3H9zM9 11h6M9 15h4"/></svg></span><div><b>Total Tickets</b><small id="ticketTotalSubtitle">Selected period</small></div><strong id="ticketTotal">0</strong></article><article class="unified-kpi-card tone-green"><span class="unified-kpi-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4v18M12 9h7v12M8 9h1M8 13h1M8 17h1M15 13h1M15 17h1"/></svg></span><div><b>Companies</b><small id="ticketCompaniesSubtitle">With ticket activity</small></div><strong id="ticketCompanies">0</strong></article><article class="unified-kpi-card tone-yellow"><span class="unified-kpi-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="m12 2.5 8 4.5v10l-8 4.5L4 17V7z"/><path d="M12 8v5M12 16h.01"/></svg></span><div><b>Error Issues</b><small id="ticketProblemsSubtitle">Distinct categories</small></div><strong id="ticketProblems">0</strong></article><article class="unified-kpi-card tone-blue"><span class="unified-kpi-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7"/><path d="M9 3h6M12 6V3M12 10v4l3 2"/></svg></span><div><b>Average Duration</b><small id="ticketDurationSubtitle">Resolution time</small></div><strong id="ticketDuration">0m</strong></article></section><section class="unified-filter-card"><div class="unified-filter-heading"><div><h2>Ticket Analytics</h2><p>Explore company demand and recurring issues over any period</p></div><button type="button" id="ticketReset" class="btn">Reset filters</button></div><div class="unified-filter-grid"><label><span>Period</span><select id="ticketRange" class="filter"><option value="all">All data</option><option value="month">Monthly</option><option value="3m">Last 3 months</option><option value="6m">Last 6 months</option><option value="year">Yearly</option><option value="custom">Custom range</option></select></label><label id="ticketMonthField"><span>Month</span><select id="ticketMonth" class="filter">'+monthOptionList()+'</select></label><label id="ticketYearField"><span>Year</span><select id="ticketYear" class="filter">'+optionList(years,state.year)+'</select></label><label id="ticketFromField"><span>From</span><input id="ticketFrom" class="filter" type="date"></label><label id="ticketToField"><span>To</span><input id="ticketTo" class="filter" type="date"></label><label><span>Company</span><select id="ticketCompany" class="filter"><option>All companies</option>'+optionList(companies,state.company)+'</select></label><label><span>Problem</span><select id="ticketProblem" class="filter"><option>All problems</option>'+optionList(problems,state.problem)+'</select></label></div></section><section class="unified-chart-grid"><article class="unified-chart-card"><div class="unified-chart-header"><div><h2>Tickets by Company</h2><p>Support demand ranked from highest to lowest</p></div><span id="ticketCompanyChartTotal">0 tickets</span></div><div class="unified-bar-canvas"><canvas id="ticketCompanyChart"></canvas></div></article><article class="unified-chart-card"><div class="unified-chart-header"><div><h2>Problems by Category</h2><p>Issue distribution for the selected period</p></div><span id="ticketProblemChartTotal">0 types</span></div><div class="unified-pie-layout"><div class="unified-pie-canvas"><canvas id="ticketProblemChart"></canvas></div><div id="ticketProblemLegend" class="unified-chart-legend"></div></div></article></section><section class="card unified-table-card"><div class="unified-table-head"><div><h2>Company Assignment Summary</h2><p>Ticket allocation across companies and team members</p></div><input id="ticketSearch" class="search" placeholder="Search companies..."></div><div class="unified-table-scroll"><table class="unified-data-table" id="ticketAssignmentTable"><thead><tr><th>Company</th><th>Total</th>'+assignees.map(name=>'<th>'+clean(name)+'</th>').join('')+'</tr></thead><tbody id="ticketTableBody"></tbody><tfoot id="ticketTableTotal"></tfoot></table></div><div class="unified-table-footer" id="ticketTableFoot"></div></section>';
  const assigneeField=document.createElement('label');assigneeField.innerHTML='<span>Assigned To</span><select id="ticketAssignee" class="filter"><option value="All assignees">All assignees</option>'+assignees.map(name=>'<option value="'+clean(name)+'">'+clean(assigneeLabel(name))+'</option>').join('')+'</select>';panel.querySelector('.unified-filter-grid').append(assigneeField);
  const tableTitle=panel.querySelector('.unified-table-head>div');if(tableTitle){tableTitle.className='unified-table-title';tableTitle.innerHTML='<span class="unified-table-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h5M8 16h4"/><circle cx="16" cy="16" r="3"/><path d="m14.7 16 1 1 1.8-2"/></svg></span><div><h2>Service Ticket Allocation</h2><p>Ticket allocation across companies and team members</p></div>'}
  const companyChartTitle=panel.querySelector('#ticketCompanyChartTotal')?.closest('.unified-chart-header');if(companyChartTitle){companyChartTitle.querySelector('h2').textContent='Service Ticket Distribution';companyChartTitle.querySelector('p').textContent='Ticket volume across supported companies';companyChartTitle.querySelector('#ticketCompanyChartTotal').outerHTML='<select id="ticketCompanyChartType" class="filter unified-chart-select" aria-label="Company chart type"><option value="bar">Bar chart</option><option value="line">Line chart</option></select>';panel.querySelector('#ticketCompanyChartType').value=state.companyChartType;panel.querySelector('#ticketCompanyChartType').addEventListener('change',event=>{state.companyChartType=event.target.value;drawCharts(filteredRows())})}
  const problemCard=panel.querySelector('.unified-pie-layout')?.closest('.unified-chart-card'),problemTitle=problemCard?.querySelector('.unified-chart-header');if(problemTitle){problemTitle.querySelector('h2').textContent='Service Error Distribution';problemTitle.querySelector('p').textContent='Recorded tickets across error issues';problemTitle.querySelector('#ticketProblemChartTotal')?.remove();problemTitle.insertAdjacentHTML('beforeend','<select id="ticketPieProblemFilter" class="filter unified-chart-select" aria-label="Filter issue distribution by problem"><option value="All problems">All problems</option>'+optionList(problems,state.problem)+'</select>');panel.querySelector('#ticketPieProblemFilter').value=state.problem;panel.querySelector('#ticketPieProblemFilter').addEventListener('change',event=>{state.problem=event.target.value;panel.querySelector('#ticketProblem').value=state.problem;applyFilters()})}
  panel.querySelectorAll('#ticketAssignmentTable thead th').forEach((heading,index)=>{if(index>=2)heading.textContent=assigneeLabel(assignees[index-2])});
  panel.querySelector('#ticketRange').value=state.range;panel.querySelector('#ticketCompany').value=state.company;panel.querySelector('#ticketProblem').value=state.problem;panel.querySelector('#ticketAssignee').value=state.assignee;panel.querySelector('#ticketFrom').value=state.from;panel.querySelector('#ticketTo').value=state.to;
  panel.querySelectorAll('#ticketFrom,#ticketTo').forEach(input=>{input.addEventListener('click',()=>{if(typeof input.showPicker==='function')try{input.showPicker()}catch(e){}})});
  panel.querySelectorAll('#ticketRange,#ticketMonth,#ticketYear,#ticketCompany,#ticketProblem,#ticketAssignee,#ticketFrom,#ticketTo').forEach(control=>control.addEventListener('change',()=>{state.range=panel.querySelector('#ticketRange').value;state.month=panel.querySelector('#ticketMonth').value;state.year=panel.querySelector('#ticketYear').value;state.company=panel.querySelector('#ticketCompany').value;state.problem=panel.querySelector('#ticketProblem').value;state.assignee=panel.querySelector('#ticketAssignee').value;state.from=panel.querySelector('#ticketFrom').value;state.to=panel.querySelector('#ticketTo').value;applyFilters()}));
  panel.querySelector('#ticketSearch').addEventListener('input',event=>{state.search=event.target.value;applyFilters()});
  panel.querySelector('#ticketReset').onclick=()=>{Object.assign(state,{range:'all',month:months[0]||'',year:String(years[0]||''),company:'All companies',problem:'All problems',assignee:'All assignees',from:'',to:'',search:''});renderShell();applyFilters()};
 }
 function rangeBounds(){
  let start=null,end=null;
  if(state.range==='month'&&state.month){const [year,month]=state.month.split('-').map(Number);start=new Date(year,month-1,1);end=new Date(year,month,1)}
  if(state.range==='3m'||state.range==='6m'){const count=state.range==='3m'?3:6;start=new Date(latestDate.getFullYear(),latestDate.getMonth()-count+1,1);end=new Date(latestDate.getFullYear(),latestDate.getMonth()+1,1)}
  if(state.range==='year'&&state.year){start=new Date(Number(state.year),0,1);end=new Date(Number(state.year)+1,0,1)}
  if(state.range==='custom'){if(state.from)start=new Date(state.from+'T00:00:00');if(state.to){end=new Date(state.to+'T00:00:00');end.setDate(end.getDate()+1)}}
  return{start,end};
 }
 function filteredRows(){
  const {start,end}=rangeBounds(),query=state.search.trim().toLowerCase();
  return source.filter(row=>{const date=new Date(row.completedAt),valid=!Number.isNaN(date.getTime());if(start&&(!valid||date<start))return false;if(end&&(!valid||date>=end))return false;if(state.company!=='All companies'&&row.company!==state.company)return false;if(state.problem!=='All problems'&&row.problem!==state.problem)return false;if(state.assignee!=='All assignees'&&row.assignedTo!==state.assignee)return false;if(query&&!String(row.company).toLowerCase().includes(query))return false;return true});
 }
 function countBy(rows,key){const counts={};rows.forEach(row=>{const value=row[key]||'Unspecified';counts[value]=(counts[value]||0)+1});return Object.entries(counts).sort((a,b)=>b[1]-a[1])}
 function formatDuration(minutes){const value=Math.round(minutes||0);if(value>=1440)return Math.floor(value/1440)+'d '+Math.round(value%1440/60)+'h';if(value>=60)return Math.floor(value/60)+'h '+value%60+'m';return value+'m'}
 function filterLabel(){
  if(state.range==='month'&&state.month){const [year,month]=state.month.split('-').map(Number);return new Date(year,month-1,1).toLocaleDateString(undefined,{month:'short',year:'numeric'})}
  if(state.range==='3m')return 'Last 3 months';if(state.range==='6m')return 'Last 6 months';if(state.range==='year')return state.year||'Selected year';if(state.range==='custom')return state.from&&state.to?'Custom date range':'Custom range';return 'All data';
 }
 function updateTicketKpiSubtitles(rows,companyCount,problemCount){
  const selected=[];if(state.company!=='All companies')selected.push(state.company);if(state.problem!=='All problems')selected.push(state.problem);if(state.assignee!=='All assignees')selected.push(assigneeLabel(state.assignee));const scope=selected.length?selected.join(' · '):filterLabel();
  const text=(id,value)=>{const node=document.getElementById(id);if(node)node.textContent=value};
  text('ticketTotalSubtitle',rows.length?scope:'No tickets');text('ticketCompaniesSubtitle',state.company==='All companies'?'All companies':state.company);text('ticketProblemsSubtitle',state.problem==='All problems'?'All error issues':state.problem);text('ticketDurationSubtitle','Across '+rows.length+' ticket'+(rows.length===1?'':'s'));
 }
 function updateControlVisibility(){const panel=ensurePanel();panel.querySelector('#ticketMonthField').hidden=state.range!=='month';panel.querySelector('#ticketYearField').hidden=state.range!=='year';panel.querySelector('#ticketFromField').hidden=state.range!=='custom';panel.querySelector('#ticketToField').hidden=state.range!=='custom'}
 function drawCharts(rows){
  const dark=document.body.classList.contains('dark'),text=dark?'#d9c4c2':'#806864',grid=dark?'#553137':'#eaded9',companyCounts=countBy(rows,'company'),problemCounts=countBy(rows,'problem'),problemColors=['#d12a31','#f06428','#d6a13b','#7656b5','#3194ad','#16866a','#b94f78','#5677b9','#9a6a3a'],tooltipTheme={displayColors:true,backgroundColor:'rgba(12,12,14,.88)',titleColor:'#fff',bodyColor:'#fff',borderColor:'rgba(255,255,255,.16)',borderWidth:1,padding:10};
  if(ticketBarChart)ticketBarChart.destroy();if(ticketPieChart)ticketPieChart.destroy();
  const isLine=state.companyChartType==='line';
  const companyCanvas=document.getElementById('ticketCompanyChart'),companyWrap=companyCanvas.parentElement,companyHeight=Math.min(window.innerWidth<=700?340:410,Math.max(window.innerWidth<=460?250:300,companyCounts.length*40+80));if(companyWrap)companyWrap.style.height=(isLine?'390':companyHeight)+'px';const companyContext=companyCanvas.getContext('2d'),companyGradient=companyContext.createLinearGradient(0,0,companyCanvas.clientWidth||700,0);companyGradient.addColorStop(0,dark?'#c94a42':'#d12a31');companyGradient.addColorStop(1,dark?'#ef8563':'#f38c47');
  ticketBarChart=new Chart(companyCanvas,{type:isLine?'line':'bar',data:{labels:companyCounts.map(item=>item[0]),datasets:[{data:companyCounts.map(item=>item[1]),backgroundColor:isLine?(dark?'rgba(255,135,85,.18)':'rgba(224,82,56,.14)'):companyGradient,borderColor:dark?'#ff8755':'#d12a31',borderWidth:isLine?2.5:1.5,borderRadius:isLine?0:7,barThickness:isLine?undefined:24,categoryPercentage:isLine?undefined:.74,barPercentage:isLine?undefined:.9,pointRadius:isLine?4:0,pointHoverRadius:isLine?6:0,pointBackgroundColor:dark?'#ff9a70':'#d12a31',fill:isLine,tension:isLine?.3:0}]},options:{indexAxis:isLine?'x':'y',responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{...tooltipTheme,callbacks:{label:context=>' '+Number(context.raw||0).toLocaleString()+' Tickets',labelColor:context=>({borderColor:context.dataset.borderColor,backgroundColor:context.dataset.borderColor,borderWidth:1,borderRadius:2})}}},scales:{x:{beginAtZero:!isLine,grid:{color:grid},ticks:{color:text,precision:isLine?undefined:0,font:{family:'Poppins',size:9},maxRotation:isLine?35:0,minRotation:0},title:{display:!isLine,text:'Total: '+rows.length.toLocaleString()+' Tickets',color:text,font:{family:'Poppins',size:10,weight:'600'}}},y:{beginAtZero:isLine,grid:{display:isLine,color:grid},ticks:{color:text,precision:isLine?0:undefined,font:{family:'Poppins',size:9}}}}}});
  if(!Chart.registry.plugins.get('ticketProblemCentre'))Chart.register({id:'ticketProblemCentre',afterDraw(instance,args,options){if(instance.canvas.id!=='ticketProblemChart'||!options)return;const area=instance.chartArea,context=instance.ctx,x=(area.left+area.right)/2,y=(area.top+area.bottom)/2;context.save();context.textAlign='center';context.fillStyle=options.dark?'#cbb9bb':'#8a7476';context.font='600 9px Poppins, Arial';context.fillText('TICKETS',x,y-5);context.fillStyle=options.dark?'#fff5ef':'#3f292d';context.font='700 23px Poppins, Arial';context.fillText(String(options.total||0),x,y+19);context.restore()}});
  ticketPieChart=new Chart(document.getElementById('ticketProblemChart'),{type:'doughnut',data:{labels:problemCounts.map(item=>item[0]),datasets:[{data:problemCounts.map(item=>item[1]),backgroundColor:problemColors,borderColor:dark?'#32171e':'#fff',borderWidth:4,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'66%',plugins:{legend:{display:false},ticketProblemCentre:{total:rows.length,dark},tooltip:{...tooltipTheme,callbacks:{title:context=>context[0]?.label||'Selected Error',label:context=>' '+Number(context.raw||0).toLocaleString()+' Tickets',labelColor:context=>({backgroundColor:context.dataset.backgroundColor[context.dataIndex],borderColor:'transparent',borderWidth:0,borderRadius:2})}}}}});
  const pieFilter=document.getElementById('ticketPieProblemFilter');if(pieFilter)pieFilter.value=state.problem;
  document.getElementById('ticketProblemLegend').innerHTML=problemCounts.map((item,index)=>'<div><span><i style="background:'+problemColors[index%problemColors.length]+'"></i>'+clean(item[0])+'</span><b><strong>'+item[1]+'</strong><small> ticket'+(item[1]===1?'':'s')+'</small></b></div>').join('');
 }
 function editDate(){if(state.range==='month'&&state.month)return state.month+'-15T12:00:00';if(state.range==='year'&&state.year)return state.year+'-07-01T12:00:00';if(state.range==='custom'&&state.from)return state.from+'T12:00:00';return latestDate.toISOString()}
 function saveTicketData(){localStorage.setItem('serviceTicketData',JSON.stringify(source))}
 function updateAssignment(company,assignee,nextValue,currentRows){const raw=String(nextValue).trim();if(raw&&!/^\d+$/.test(raw)){applyFilters();return}const current=currentRows.filter(row=>row.company===company&&row.assignedTo===assignee).length,target=Math.max(0,Math.round(Number(raw)||0)),difference=target-current;if(!difference){applyFilters();return}if(difference<0){const remove=new Set(currentRows.filter(row=>row.company===company&&row.assignedTo===assignee).slice(0,-difference));source=source.filter(row=>!remove.has(row))}else{const template=source.find(row=>row.company===company&&row.assignedTo===assignee)||source.find(row=>row.company===company)||source[0]||{};for(let index=0;index<difference;index++)source.push({...template,company,assignedTo:assignee,completedAt:editDate(),problem:state.problem==='All problems'?(template.problem||'Unspecified'):state.problem,duration:'0D-0H-0M',durationMinutes:0})}saveTicketData();applyFilters()}
 function applyFilters(){
  const panel=ensurePanel(),rows=filteredRows(),companyCount=new Set(rows.map(row=>row.company)).size,problemCount=new Set(rows.map(row=>row.problem)).size,average=rows.length?rows.reduce((sum,row)=>sum+(Number(row.durationMinutes)||0),0)/rows.length:0;
  updateControlVisibility();panel.querySelector('#ticketTotal').textContent=rows.length.toLocaleString();panel.querySelector('#ticketCompanies').textContent=companyCount;panel.querySelector('#ticketProblems').textContent=problemCount;panel.querySelector('#ticketDuration').textContent=formatDuration(average);updateTicketKpiSubtitles(rows,companyCount,problemCount);
  const grouped=new Map();rows.forEach(row=>{if(!grouped.has(row.company))grouped.set(row.company,{total:0,people:{}});const item=grouped.get(row.company);item.total++;item.people[row.assignedTo]=(item.people[row.assignedTo]||0)+1});
  const summary=[...grouped.entries()].sort((a,b)=>{const ai=companyOrder.indexOf(a[0]),bi=companyOrder.indexOf(b[0]);return(ai<0?999:ai)-(bi<0?999:bi)||a[0].localeCompare(b[0])});
  panel.querySelector('#ticketTableBody').innerHTML=summary.map(([company,item])=>'<tr><td><b>'+clean(company==='Pyay'?'PYAY':company)+'</b></td><td><strong>'+item.total+'</strong></td>'+assignees.map(name=>'<td contenteditable="true" inputmode="numeric" role="spinbutton" aria-label="'+clean(company)+' tickets assigned to '+clean(assigneeLabel(name))+'" data-company="'+clean(company)+'" data-assignee="'+clean(name)+'">'+(item.people[name]||'')+'</td>').join('')+'</tr>').join('');
  panel.querySelectorAll('#ticketTableBody td[contenteditable]').forEach(cell=>{cell.dataset.original=cell.textContent.trim()||'0';cell.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();cell.blur()}if(!/^[0-9]$/.test(event.key)&&!['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'].includes(event.key))event.preventDefault()});cell.addEventListener('blur',()=>updateAssignment(cell.dataset.company,cell.dataset.assignee,cell.textContent.trim(),rows))});
  panel.querySelector('#ticketTableTotal').innerHTML='<tr><th>Grand Total</th><th>'+rows.length+'</th>'+assignees.map(name=>'<th>'+rows.filter(row=>row.assignedTo===name).length+'</th>').join('')+'</tr>';
  panel.querySelector('#ticketTableFoot').textContent='Showing '+summary.length+' of '+summary.length+' companies · '+assignees.length+' Members & '+rows.length+' tickets';drawCharts(rows);
 }
 function showFor(name){const panel=ensurePanel(),selected=name==='Service Tickets';document.body.classList.toggle('service-tickets-page',selected);panel.hidden=!selected;if(selected){setBaseVisible(false);renderShell();applyFilters()}else if(name!=='Budget & Expense')setBaseVisible(true)}
 const navigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){const same=push&&name===active;navigate(name,push);if(!same)showFor(name)};
 const theme=window.toggleTheme;window.toggleTheme=function(){theme();if(active==='Service Tickets')applyFilters()};const themeButton=document.querySelector('.theme-toggle');if(themeButton)themeButton.onclick=window.toggleTheme;
 showFor(active);
})();

/* Digital Service Functions: accessible single-open accordion */
(function(){
 function measure(group){const list=group.querySelector(':scope>ul');if(list)group.style.setProperty('--accordion-height',(list.scrollHeight+48)+'px')}
 function rename(root){const names={'Data Center':'Data Center Management','User Support':'User Support & Services','Security':'IT Security','ELV':'Extra-Low Voltage','Projects':'IT Projects'};root.querySelectorAll('.digital-function-group h3').forEach(title=>{if(names[title.textContent.trim()])title.textContent=names[title.textContent.trim()]})}
 function initialize(root){root.querySelectorAll('.digital-functions-grid').forEach(grid=>{if(grid.dataset.accordionReady)return;grid.dataset.accordionReady='true';const groups=[...grid.querySelectorAll('.digital-function-group')],columns=[document.createElement('div'),document.createElement('div')];columns.forEach(column=>column.className='digital-function-column');groups.forEach((group,index)=>{group.style.setProperty('--function-order',index);columns[index%2].append(group);const header=group.querySelector(':scope>header');if(!header)return;header.setAttribute('role','button');header.setAttribute('tabindex','0');header.setAttribute('aria-expanded',index===0?'true':'false');group.classList.toggle('is-open',index===0)});grid.replaceChildren(...columns);requestAnimationFrame(()=>requestAnimationFrame(()=>groups.forEach(measure)))});}
 function activate(header){const group=header.closest('.digital-function-group'),grid=group?.closest('.digital-functions-grid');if(!grid)return;const closeActive=group.classList.contains('is-open');grid.querySelectorAll('.digital-function-group').forEach(measure);requestAnimationFrame(()=>grid.querySelectorAll('.digital-function-group').forEach(item=>{const open=!closeActive&&item===group;item.classList.toggle('is-open',open);item.querySelector(':scope>header')?.setAttribute('aria-expanded',open?'true':'false');if(open)requestAnimationFrame(()=>measure(item))}));}
 document.addEventListener('click',event=>{const header=event.target.closest('.digital-function-group>header');if(header)activate(header)});
 document.addEventListener('keydown',event=>{const header=event.target.closest?.('.digital-function-group>header');if(header&&(event.key==='Enter'||event.key===' ')){event.preventDefault();activate(header)}});
 initialize(document);rename(document);new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length)){initialize(document);rename(document)}}).observe(document.body,{childList:true,subtree:true});window.addEventListener('resize',()=>document.querySelectorAll('.digital-function-group').forEach(measure),{passive:true});document.fonts?.ready.then(()=>document.querySelectorAll('.digital-function-group').forEach(measure));
})();



(function(){
 const icons={
  total:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2.2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V21"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2.2a4 4 0 0 0-3-3.8M16.5 3.2a4 4 0 0 1 0 7.6"/></svg>',
  current:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11l2 2 4-5"/></svg>',
  vacant:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>',
  capacity:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 19a8 8 0 1 1 16 0"/><path d="m12 15 4-5"/><path d="M7 19h10"/></svg>'
 };
 function renderManpowerKpis(){
  const section=document.getElementById('kpis');if(!section)return;
  section.className='unified-kpi-grid';
  if(active!=='Manpower')return;
  const cards=[
   ['Current Manpower','8',icons.current,'Active team members'],
   ['Planned Headcount','12',icons.total,'Target workforce capacity'],
   ['Hiring Vacancies','4',icons.vacant,'Roles open for hiring'],
   ['Workforce Capacity','67%',icons.capacity,'Positions currently filled']
  ];
  section.className='unified-kpi-grid';
  section.innerHTML=cards.map(card=>'<article class="unified-kpi-card"><div class="kt"><span>'+card[0]+'</span><b class="unified-kpi-icon">'+card[2]+'</b></div><div class="num">'+card[1]+'</div><div class="up unified-kpi-context">'+card[3]+'</div></article>').join('');
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderManpowerKpis()};
 const previousPage=window.page;window.page=function(name){previousPage(name);renderManpowerKpis()};
 const previousNavigate=window.navigateHubPage;if(previousNavigate)window.navigateHubPage=function(name,push=true){previousNavigate(name,push);renderManpowerKpis()};
 renderManpowerKpis();
})();



document.addEventListener('beforeinput',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],[data-table="license-utilization"] tbody td:first-child[contenteditable]'))event.target.classList.add('is-editing')},true);
document.addEventListener('keydown',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],[data-table="license-utilization"] tbody td:first-child[contenteditable]')&&['Backspace','Delete'].includes(event.key))event.target.classList.add('is-editing')},true);
document.addEventListener('focusout',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],[data-table="license-utilization"] tbody td:first-child[contenteditable]'))event.target.classList.remove('is-editing')},true);



(function(){const selector='.m365-company-table tbody td:first-child[contenteditable],[data-table="license-utilization"] tbody td:first-child[contenteditable]';document.addEventListener('pointerdown',event=>{const cell=event.target.closest(selector);if(!cell)return;document.querySelectorAll(selector+'.is-click-focused').forEach(item=>item.classList.remove('is-click-focused'));cell.classList.add('is-click-focused')},true);document.addEventListener('focusout',event=>{if(event.target.matches(selector))event.target.classList.remove('is-click-focused')},true);document.addEventListener('pointerdown',event=>{if(!event.target.closest(selector))document.querySelectorAll(selector+'.is-click-focused').forEach(item=>item.classList.remove('is-click-focused'))})})();



(function(){const selector='.m365-company-table tbody td:first-child[contenteditable],[data-table="license-utilization"] tbody td:first-child[contenteditable]';function clear(cell){cell.classList.remove('is-click-focused');cell.style.removeProperty('outline');cell.style.removeProperty('outline-offset');cell.style.removeProperty('box-shadow');cell.style.removeProperty('z-index');cell.style.removeProperty('caret-color')}function activate(cell){document.querySelectorAll('.m365-company-table tbody td:first-child[contenteditable].is-click-focused,[data-table="license-utilization"] tbody td:first-child[contenteditable].is-click-focused').forEach(item=>{if(item!==cell)clear(item)});cell.classList.add('is-click-focused');cell.style.setProperty('box-shadow',document.body.classList.contains('dark')?'inset 0 0 0 2px rgba(244,160,68,.55)':'inset 0 0 0 2px rgba(209,42,49,.28)','important');cell.style.setProperty('z-index','55','important');cell.style.setProperty('caret-color',document.body.classList.contains('dark')?'#ff9a70':'#d12a31','important');cell.focus({preventScroll:true})}document.addEventListener('pointerdown',event=>{const cell=event.target.closest(selector);if(cell)activate(cell);else document.querySelectorAll('.m365-company-table tbody td:first-child[contenteditable].is-click-focused,[data-table="license-utilization"] tbody td:first-child[contenteditable].is-click-focused').forEach(clear)},true);document.addEventListener('focusout',event=>{if(!event.target.matches(selector))return;setTimeout(()=>{if(document.activeElement!==event.target)clear(event.target)},0)},true)})();



(function(){
const defaults=[
{Employee:'U Wai Toe Kyaw',Position:'Director',Division:'Director','Role Level':'D-1'},
{Employee:'U Myo Aung',Position:'IT Manager',Division:'Manager','Role Level':'P-3'},
{Employee:'U Soe Maung Maung',Position:'Senior System Administrator',Division:'Infrastructure','Role Level':'P-1'},
{Employee:'U Khin Maung Thant',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5'},
{Employee:'U Khon Tay Za',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5'},
{Employee:'U Khaing Zaw Shein',Position:'Software Engineer',Division:'Software Development','Role Level':'G-5'},
{Employee:'U Than Toe Aung',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5'},
{Employee:'U Htin Kyaw Lin',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5'},
{Employee:'U Saw Wai Htun Ko',Position:'System Administrator',Division:'Infrastructure','Role Level':'G-5'}];
let rows;try{rows=JSON.parse(localStorage.getItem('manpowerDirectoryDB'))}catch(e){}if(!Array.isArray(rows)||!rows.length)rows=defaults.map(row=>({...row}));
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderDirectory(){
 if(active!=='Manpower')return;
 document.body.classList.add('manpower-page');h1.textContent='Manpower';sub.textContent='Digital workforce capacity and team structure.';
 const card=document.querySelector('#manpowerDashboard>.unified-table-card,#manpowerDashboard>.tablecard,main>section.card.unified-table-card,main>section.card.tablecard');if(!card)return;
 const currentSearch=document.getElementById('manpowerSearch')?.value||'',currentDivision=document.getElementById('manpowerDivisionFilter')?.value||'All',divisions=[...new Set(rows.map(row=>row.Division))],shown=rows.filter(row=>(currentDivision==='All'||row.Division===currentDivision)&&Object.values(row).join(' ').toLowerCase().includes(currentSearch.toLowerCase())),keys=['Employee','Position','Division','Role Level'];
 card.className='card unified-table-card';card.innerHTML='<div class="unified-table-head"><div class="unified-table-title"><span class="unified-table-title-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><h2>Digital Workforce Directory</h2><p>People, Roles and Structure</p></div></div><div class="tools"><input id="manpowerSearch" class="search" placeholder="Search employees..." value="'+esc(currentSearch)+'"><select id="manpowerDivisionFilter" class="filter"><option value="All">All divisions</option>'+divisions.map(item=>'<option '+(item===currentDivision?'selected':'')+'>'+esc(item)+'</option>').join('')+'</select></div></div><div class="unified-table-scroll"><table class="unified-data-table"><thead><tr>'+keys.map(key=>'<th>'+esc(key)+'</th>').join('')+'</tr></thead><tbody>'+shown.map(row=>'<tr data-index="'+rows.indexOf(row)+'">'+keys.map(key=>key==='Role Level'?'<td class="role-level-cell" contenteditable data-key="Role Level"><span class="role-badge" data-level="'+esc(row[key])+'">'+esc(row[key])+'</span></td>':'<td contenteditable data-key="'+esc(key)+'">'+esc(row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="unified-table-footer">Showing '+shown.length+' of '+rows.length+' employees</div>';
 document.getElementById('manpowerSearch').oninput=renderDirectory;document.getElementById('manpowerDivisionFilter').onchange=renderDirectory;
 card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{rows[+event.target.closest('tr').dataset.index][event.target.dataset.key]=event.target.textContent.trim();localStorage.setItem('manpowerDirectoryDB',JSON.stringify(rows));renderDirectory()});
}
const previousNavigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){document.body.classList.toggle('manpower-page',name==='Manpower');previousNavigate(name,push);if(name==='Manpower')renderDirectory()};
const previousPage=window.page;window.page=function(name){document.body.classList.toggle('manpower-page',name==='Manpower');previousPage(name);if(name==='Manpower')renderDirectory()};
if(active==='Manpower')renderDirectory();
})();



(function(){function restoreSharedTable(){const cards=[...document.querySelectorAll('#manpowerDashboard>section.card,main>section.card')],card=cards.find(item=>item.querySelector('.unified-table-title h2')?.textContent.includes('Digital Workforce Directory'));if(!card)return;const hero=document.querySelector('main>.hero');if(card.parentElement?.id==='manpowerDashboard')hero?.insertAdjacentElement('afterend',card);card.className='card tablecard';card.innerHTML='<div class="head"><h2 id="ttitle">Records</h2><div class="tools"><input class="search" id="search" oninput="table()" placeholder="Search records..."><select class="filter" id="filter" onchange="table()"></select></div></div><div id="table"></div><div class="foot" id="foot"></div>'}const previousNavigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){if(name!=='Manpower')restoreSharedTable();previousNavigate(name,push)};const previousPage=window.page;window.page=function(name){if(name!=='Manpower')restoreSharedTable();previousPage(name)}})();



window.exportXlsx=function(){
 const tables=[...document.querySelectorAll('main table')].filter(table=>table.offsetParent!==null&&!table.closest('[hidden]'));
 if(!tables.length)return show('No table data to export');
 const workbook=XLSX.utils.book_new(),used=new Set();
 function sheetName(table,index){let name=table.closest('.unified-table-card')&&active==='Manpower'?'Workforce':table.classList.contains('site-assignment-matrix')?'Site Coverage':table.classList.contains('m365-company-table')?'Companies':table.closest('[data-table="license-utilization"]')?'Licenses':table.closest('.manpower-planning-card')?'Manpower Detail':active||('Table '+(index+1));name=String(name).replace(/[\\/?*:[\]]/g,' ').trim().slice(0,31)||('Table '+(index+1));let unique=name,suffix=2;while(used.has(unique))unique=(name.slice(0,27)+' '+suffix++).slice(0,31);used.add(unique);return unique}
 function tableSheet(table){const values=[...table.rows].map(row=>[...row.cells].map(cell=>{const select=cell.querySelector('select');if(select)return select.value;const people=[...cell.querySelectorAll('.assigned-team-list span')];if(people.length)return people.map(person=>person.textContent.trim()).join(', ');return cell.innerText.replace(/\s+/g,' ').trim()}));return XLSX.utils.aoa_to_sheet(values)}
 tables.forEach((table,index)=>XLSX.utils.book_append_sheet(workbook,tableSheet(table),sheetName(table,index)));
 const filePage=active.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');XLSX.writeFile(workbook,'Nature-A-Digital-Hub-'+filePage+'.xlsx');show((tables.length>1?tables.length+' tables':active+' table')+' exported');
};


(function(){
const tabs={structure:'Team Structure',onsite:'Site Coverage',future:'Workforce Plan',scope:'Service Portfolio'};
const icons={structure:'<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5v4M5 15.5v-4h14v4"/></svg>',onsite:'<svg viewBox="0 0 24 24"><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',scope:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',future:'<svg viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M7 15l4-4 3 2 5-6"/><path d="M15 7h4v4"/></svg>'};
let selected=sessionStorage.getItem('manpowerVisualTab')||'structure',charts=[];
function clearCharts(){charts.forEach(c=>{try{c.destroy()}catch(e){}});charts=[]}
function colors(){const dark=document.body.classList.contains('dark');return{dark,text:dark?'#d9c4c2':'#806864',grid:dark?'#553137':'#eaded9',red:dark?'#ff8755':'#d12a31',orange:dark?'#f5c66b':'#f06428',fill:dark?'rgba(255,135,85,.16)':'rgba(209,42,49,.10)'}}
function chart(id,type,labels,values,label){const el=document.getElementById(id);if(!el)return;const c=colors();charts.push(new Chart(el,{type,data:{labels,datasets:[{label,data:values,backgroundColor:type==='line'?c.fill:[c.red,c.orange,'#d6a13b','#7656b5','#3194ad','#16866a','#b94f78'],borderColor:type==='doughnut'?(c.dark?'#32171e':'#fff'):c.red,borderWidth:type==='doughnut'?3:2,borderRadius:type==='doughnut'?0:6,fill:type==='line',tension:.34}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:type==='doughnut'?{}:{x:{grid:{display:false},ticks:{color:c.text,font:{family:'Poppins',size:9}}},y:{beginAtZero:true,grid:{color:c.grid},ticks:{color:c.text,font:{family:'Poppins',size:9},precision:0}}}}}))}
function siteCoverageChart(){const canvas=document.getElementById('siteCoveragePie'),table=document.querySelector('.site-assignment-matrix'),select=document.getElementById('siteTeamFilter'),details=document.getElementById('siteTeamDetails');if(!canvas||!table||!select||!details)return;if(!Chart.registry.plugins.get('siteCoverageCentre'))Chart.register({id:'siteCoverageCentre',afterDraw(instance,args,options){if(instance.canvas.id!=='siteCoveragePie'||!options)return;const area=instance.chartArea,ctx=instance.ctx,x=(area.left+area.right)/2,y=(area.top+area.bottom)/2,dark=document.body.classList.contains('dark');ctx.save();ctx.textAlign='center';ctx.fillStyle=dark?'#cbb9bb':'#8a7476';ctx.font='600 10px Poppins, Arial';ctx.fillText('SITES',x,y-6);ctx.fillStyle=dark?'#fff5ef':'#3f292d';ctx.font='700 24px Poppins, Arial';ctx.fillText(String(options.total||0),x,y+20);ctx.restore()}});const headers=[...table.querySelectorAll('thead th')].slice(3).map(th=>th.textContent.trim()),rows=[...table.tBodies[0].rows],models=['Full-Time','Scheduled','Planned'],palette=['#d12a31','#f06428','#d6a13b'],c=colors(),savedTeam=sessionStorage.getItem('siteCoverageTeamFilter');if(savedTeam&&[...select.options].some(option=>option.value===savedTeam))select.value=savedTeam;let instance;function update(){const member=select.value,memberIndex=headers.indexOf(member),matched=member==='All team members'?rows:rows.filter(row=>memberIndex>=0&&row.querySelectorAll('.assignment-cell')[memberIndex]?.textContent.includes('✓')),counts=models.map(model=>matched.filter(row=>row.querySelector('.coverage-badge')?.textContent.trim()===model).length),locations=matched.map(row=>({name:row.cells[0].textContent.trim(),model:row.querySelector('.coverage-badge')?.textContent.trim()||''}));if(instance)instance.destroy();instance=new Chart(canvas,{type:'doughnut',data:{labels:models,datasets:[{data:counts,backgroundColor:palette,borderColor:c.dark?'#32171e':'#fff',borderWidth:3,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false},tooltip:{callbacks:{label:item=>' '+item.label+': '+item.raw+' site'+(item.raw===1?'':'s')}},siteCoverageCentre:{total:locations.length}}}});charts.push(instance);details.innerHTML='<div class="site-team-detail-head"><b>'+(member==='All team members'?'All Supported Locations':member)+'</b><span>'+locations.length+' site'+(locations.length===1?'':'s')+'</span></div><div class="site-team-location-list">'+locations.map(location=>'<span class="site-team-location"><b>'+location.name+'</b><em class="coverage-'+location.model.toLowerCase().replace('-','')+'">'+location.model+'</em></span>').join('')+'</div>'}select.onchange=()=>{sessionStorage.setItem('siteCoverageTeamFilter',select.value);update()};update()}
function nav(){return '<nav class="manpower-planning-tabs">'+Object.entries(tabs).map(([k,v])=>'<button class="manpower-planning-tab '+(k===selected?'active':'')+'" data-tab="'+k+'">'+icons[k]+'<span>'+v+'</span></button>').join('')+'</nav>'}
function structure(){return '<div class="planning-visual-heading"><div><h2>Team Structure &amp; Responsibility Matrix</h2><p>Reporting lines, roles and accountability</p></div></div><section class="unified-kpi-grid"><article class="summary-card tone-orange"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><b>Team Members</b><small>Digital workforce</small></div><strong>9</strong></article><article class="summary-card tone-green"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 21v-2a6 6 0 0 1 12 0v2M4 13h3M17 13h3M12 2v2"/></svg></span><div><b>Leadership</b><small>Governance roles</small></div><strong>2</strong></article><article class="summary-card tone-yellow"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg></span><div><b>Infrastructure</b><small>Operations team</small></div><strong>6</strong></article><article class="summary-card tone-blue"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg></span><div><b>Engineering</b><small>Software delivery</small></div><strong>1</strong></article></section><section class="visual-panel structure-org-panel"><div class="responsibility-org"><div class="org-leadership"><article class="org-role org-role-director"><span class="org-role-icon">◆</span><div><b>Director</b><small>Digital Strategy &amp; Governance</small></div></article><i class="org-link"></i><article class="org-role org-role-manager"><span class="org-role-icon">●</span><div><b>IT Manager</b><small>Operations &amp; Service Delivery</small></div></article><i class="org-link"></i><article class="org-profile org-profile-lead"><header><div><b>U Soe Maung Maung</b><small>Senior System Administrator</small></div><em>Lead</em></header><ul><li>Infrastructure operational lead</li><li>File sharing &amp; backup</li><li>Analysis PR/MR finalized</li><li class="org-highlight service"><strong>Group-wide in-house services</strong></li></ul></article></div><div class="org-team-tier"><div class="org-peer-grid"><article class="org-profile org-peer-card"><header><div><b>U Khin Maung Thant</b><small>System Administrator</small></div></header><ul><li class="org-highlight site"><strong>Arise Yetakon / GGM</strong></li><li>Microsoft Control</li><li>Ground Purchase / Report</li><li>ISO &amp; Audit</li><li>Monthly Report</li><li class="org-highlight service"><strong>Group-wide in-house services</strong></li></ul></article><article class="org-profile org-peer-card"><header><div><b>U Khaing Zaw Shein</b><small>Software Engineer</small></div></header><ul><li class="org-highlight site"><strong>Nature Alliance (HO)</strong></li><li>PR/MR Checkup</li><li>All SharePoint Support</li><li>Microsoft Control</li><li>Ground Purchase</li><li>Service Report</li><li class="org-highlight service"><strong>Group-wide in-house services</strong></li></ul></article><article class="org-profile org-peer-card"><header><div><b>U Khon Tay Za</b><small>System Administrator</small></div></header><ul><li><strong>Nature Alliance / Nature Valley</strong></li><li>Trend Micro</li><li>Petty cash support</li></ul></article><article class="org-profile org-peer-card"><header><div><b>U Htin Kyaw Lin</b><small>System Administrator</small></div></header><ul><li><strong>7 Aluminium Factory</strong></li><li>On-site systems support</li></ul></article><article class="org-profile org-peer-card"><header><div><b>U Than Toe Aung</b><small>System Administrator</small></div></header><ul><li><strong>Arise / GGM</strong></li><li>On-site systems support</li></ul></article><article class="org-profile org-peer-card"><header><div><b>U Saw Wai Htun Ko</b><small>System Administrator</small></div></header><ul><li><strong>Innobuilder</strong></li><li>CCTV monitoring support</li></ul></article></div></div><div class="shared-services"><div class="shared-services-title"><b>Shared Core Services</b><small>Assigned to U Khon Tay Za, U Htin Kyaw Lin, U Than Toe Aung and U Saw Wai Htun Ko</small></div><div class="shared-service-list"><span>Governance</span><span>ISO &amp; Audit</span><span>Fixed Asset Control</span><span>Budget &amp; Expenses</span><span>Procurement</span><span>Management Reporting</span></div></div></div></section>'}
function onsite(){const people=['Soe Maung Maung','Khin Maung Thant','Khon Tay Za','Khaing Zaw Shein','Than Toe Aung','Htin Kyaw Lin','Saw Wai Htun Ko'],rows=[['Nature Alliance','Full-Time',4,[0,2,3,5]],['Nature Valley','Full-Time',4,[0,2,3,5]],['Innobuilder','Full-Time',3,[0,3,6]],['Prime Asset','Full-Time',4,[0,2,3,5]],['Arise','Full-Time',5,[0,1,3,4,6]],['Seven Aluminium','Scheduled',3,[0,2,5]],['Myanmar Safety Glass','Scheduled',3,[0,2,5]],['Pyay Khityar','Scheduled',3,[0,1,4]],['Shwe Nay Chi','Scheduled',2,[0,2]],['Posco','Scheduled',3,[0,1,6]],['Radiant Rays','Scheduled',1,[0]],['Ayeyar Yoma','Planned',3,[0,3,4]]];const filterPeople=people.slice(1);return '<section class="site-team-coverage-card"><div class="site-coverage-chart-grid site-coverage-pie-only"><article class="site-chart-card"><div class="site-chart-title"><div><h3>Team Site Coverage</h3><p>Assigned locations by coverage model</p></div><select id="siteTeamFilter" class="filter site-team-filter"><option>All team members</option>'+filterPeople.map(person=>'<option>'+person+'</option>').join('')+'</select></div><div class="site-chart-pie-layout"><div class="site-chart-canvas site-chart-pie"><canvas id="siteCoveragePie"></canvas></div><div id="siteTeamDetails" class="site-team-details"></div></div><div class="site-coverage-model-legend"><span><i class="model-full"></i>Full-Time</span><span><i class="model-scheduled"></i>Scheduled</span><span><i class="model-planned"></i>Planned</span></div></article></div></section><section class="card unified-table-card"><div class="unified-table-head"><div class="unified-table-title"><span class="unified-table-title-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/><path d="M8 21h8"/></svg></span><div><h2>Site Support Coverage</h2><p>Team assignments across supported locations</p></div></div><div class="tools"><input id="siteCoverageSearch" class="search" placeholder="Search locations or team..."><select id="siteCoverageFilter" class="filter"><option>All coverage</option><option>Full-Time</option><option>Scheduled</option><option>Planned</option></select></div></div><div class="unified-table-scroll"><table class="unified-data-table site-assignment-matrix" data-readonly="true"><thead><tr><th>Supported Location</th><th>Coverage Model</th><th>Assigned</th>'+people.map(person=>'<th>'+person+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr data-team="'+row[3].map(index=>people[index]).join(' ')+'"><td>'+row[0]+'</td><td><span class="coverage-badge '+row[1].toLowerCase().replace('-','')+'">'+row[1]+'</span></td><td class="assigned-total">'+row[2]+'</td>'+people.map((person,index)=>'<td class="assignment-cell">'+(row[3].includes(index)?'✓':'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><footer class="unified-table-footer"><span id="siteCoverageCount">Showing 12 of 12 locations</span></footer></section>'}
function digitalFunctions(){const groups=[['Data Center',['Private Cloud Operation','Remote Access Management','Network Distribution Management','End-user Support','Call System','Data Center Hosting']],['IT Management',['Procurement','Vendor Management','Budgeting & Financial Control','Fixed Asset Management','Document Control','Online Meeting Facilitation','Electronic Document Management System']],['User Support',['Technical Support','Helpdesk','Ticketing System','Email & Data Drive','File Sharing','User Assets','User Training']],['System Management',['Server Administration','Network Management','Copier & Printer Network Management','Wireless Access Point','Physical & Virtual Server','Storage Management','Email System Administration','Backup']],['Security',['Cyber Security','Information Security','Port Security','Monitoring','Firewall']],['ELV',['CCTV','Door Access System','Meeting Room Conferencing']],['Branch Office',['Report','Technical Support','Central Management','Data Control']],['Projects',['Construction Site Lead','Analyst Device','Outsourcing Service','Office Renovation']],['Software',['Mobile App Development','Web Development','Software Design Architecture','Program Support','User Training Support','Technical Data Support','Customer Relation Management','Enterprise Resource Planning (ERP)','Database Management','Deployment User','Coordinator User & Vendor']],['Data Science',['Big Data Processing','Data Cleaning','Data Pipeline Building','Research & Development']]];return '<section class="digital-functions"><div class="digital-functions-heading"><h2>Digital Service Functions</h2><p>Operational capabilities delivered across infrastructure, support, engineering and data services</p></div><div class="digital-functions-grid">'+groups.map((group,index)=>'<article class="digital-function-group tone-'+((index%4)+1)+'"><header><span>'+String(index+1).padStart(2,'0')+'</span><h3>'+group[0]+'</h3></header><ul>'+group[1].map((item,itemIndex)=>'<li class="'+(itemIndex%2?'function-emphasis':'')+'">'+item+'</li>').join('')+'</ul></article>').join('')+'</div></section>'}
function scope(){return '<div class="planning-visual-heading digital-services-heading"><div><h2>Core Services</h2><p>Secure, reliable digital services for business operations</p></div></div><section class="digital-service-grid service-portfolio-grid"><article class="digital-service-item tone-red"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg></span><div><b>IT Governance</b><small>Strategy, policy, risk and investment oversight</small><i>Governance</i></div></article><article class="digital-service-item tone-amber"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg></span><div><b>Infrastructure</b><small>Networks, servers, cloud platforms and availability</small><i>Operations</i></div></article><article class="digital-service-item tone-purple"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg></span><div><b>Software Engineering</b><small>Applications, integrations and process automation</small><i>Engineering</i></div></article><article class="digital-service-item tone-blue"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18a4 4 0 1 1 .8-7.9A5.5 5.5 0 0 1 18.5 12 3 3 0 0 1 18 18Z"/></svg></span><div><b>Microsoft 365</b><small>Identity, licensing, productivity and collaboration</small><i>Cloud</i></div></article><article class="digital-service-item tone-green"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z"/><path d="M9 12h6M12 9v6"/></svg></span><div><b>Cybersecurity</b><small>Protection, monitoring, compliance and response</small><i>Security</i></div></article><article class="digital-service-item tone-orange"><span class="digital-service-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0v5a3 3 0 0 1-3 3h-2v-7h5M4 13h5v7H7a3 3 0 0 1-3-3Z"/></svg></span><div><b>Service Support</b><small>User support, devices, requests and asset services</small><i>Service desk</i></div></article></section>'+digitalFunctions()}
function future(){return `<div class="planning-visual-heading"><div><h2>Workforce Plan</h2><p>Planned capacity and priority recruitment needs</p></div></div><section class="unified-kpi-grid"><article class="summary-card tone-orange"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="M16 21v-2.2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V21"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg></span><div><b>Planned Workforce</b><small>Target capacity</small></div><strong>12</strong></article><article class="summary-card tone-green"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg></span><div><b>Vacant Positions</b><small>Priority hiring</small></div><strong>4</strong></article><article class="summary-card tone-yellow"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg></span><div><b>Infrastructure</b><small>Operations roles</small></div><strong>2</strong></article><article class="summary-card tone-blue"><span class="summary-card-icon"><svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></svg></span><div><b>Software</b><small>Engineering roles</small></div><strong>2</strong></article></section><section class="visual-panel workforce-org"><div class="workforce-org-head"><div><h3>Proposed Digital Organization</h3><p>Future reporting structure, service ownership and recruitment priorities</p></div><span>Target Operating Model</span></div><div class="workforce-leaders"><article><b>U Wai Toe Kyaw</b><small>IT Director</small></article><i></i><article><b>U Myo Aung</b><small>IT Manager</small></article></div><div class="workforce-branches"><section class="workforce-branch infrastructure"><header><b>Infrastructure</b><small>Platforms, operations and enterprise support</small></header><div class="workforce-lead-role"><b>U Soe Maung Maung</b><small>Senior System Administrator</small></div><div class="workforce-functions"><article><b>Data Center</b><span>Cloud operations · Remote access · Hosting</span></article><article><b>IT Management</b><span>Procurement · Vendors · Assets · Reporting</span></article><article><b>User Support</b><span>Helpdesk · Ticketing · Training · Devices</span></article><article><b>Systems</b><span>Servers · Networks · Storage · Backup</span></article><article><b>Security</b><span>Cybersecurity · Monitoring · Firewall</span></article><article><b>ELV Systems</b><span>CCTV · Access control · Meeting rooms</span></article><article><b>Branch Support</b><span>Site services · Reporting · Data control</span></article><article><b>IT Projects</b><span>Delivery · Analysis · Outsourcing</span></article></div><div class="workforce-people"><article class="vacant"><b>Cloud Engineer</b><small>Vacant · 1</small></article><article><b>System Administrators</b><small>Htin Kyaw Lin · Than Toe Aung</small></article><article><b>System Administrators</b><small>Khon Tay Za · Khin Maung Thant</small></article><article><b>System Administrator</b><small>Saw Wai Htun Ko</small></article><article class="vacant"><b>System Administrator</b><small>Vacant · 1</small></article></div></section><section class="workforce-branch software"><header><b>Software Development</b><small>Applications, automation and data services</small></header><div class="workforce-lead-role vacant"><b>Senior Software Engineer</b><small>Vacant · 1</small></div><div class="workforce-functions"><article><b>Software</b><span>Web · Mobile · SharePoint · Integration</span></article><article><b>Data Science</b><span>Processing · Cleaning · Pipelines · Research</span></article></div><div class="workforce-people"><article><b>Software Engineer</b><small>U Khaing Zaw Shein</small></article><article class="vacant"><b>Software Engineer</b><small>Vacant · 1</small></article></div></section></div></section>`}
const metricMeta={
'Team Members':['people','+3 planned'],'Leadership':['leadership','Governance'],'Infrastructure':['server','Core team'],'Engineering':['code','Development'],'Planned Workforce':['people','Target capacity'],'Vacant Positions':['briefcase','Priority hiring'],'Software':['code','Senior SE + SE'],
'Covered Sites':['location','5 locations'],'Active Assignments':['active','Active'],'Planned Coverage':['calendar','Planned'],'Full-Time Coverage':['clock','Dedicated'],
'Proposed Roles':['briefcase','Proposal'],'Priority Roles':['flag','Priority'],'New Capabilities':['spark','Growth'],'Proposed Functions':['grid','Functions']};
const metricSvg={people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',leadership:'<path d="m12 3 7 4v5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V7l7-4Z"/><path d="m9 12 2 2 4-4"/>',server:'<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',code:'<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',location:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',active:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 12-4.9M16 19l2 2 4-5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',flag:'<path d="M4 20V6a2 2 0 0 1 2-2h9l5 5v11H4Z"/><path d="M15 4v5h5M8 14h8M8 17h5"/>',spark:'<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
function enhanceMetrics(card){card.querySelectorAll('.visual-kpi').forEach((item,index)=>{const label=item.querySelector('span')?.textContent.trim(),meta=metricMeta[label]||['grid','Overview'];item.classList.add('metric-tone-'+((index%4)+1));item.insertAdjacentHTML('afterbegin','<i class="visual-kpi-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+metricSvg[meta[0]]+'</svg></i>');item.insertAdjacentHTML('beforeend','<em class="visual-kpi-badge">'+meta[1]+'</em>')});const shared=card.querySelector('.shared-services');if(shared){const assigned=new Set(['U Khon Tay Za','U Htin Kyaw Lin','U Than Toe Aung','U Saw Wai Htun Ko']),services=['ISO & Audit','Fixed Asset','PR/MR Prepare','Budget & Expenses','Stock Control','Routing Maintenance','Purchase Report','Printing Report'];card.querySelectorAll('.org-peer-card').forEach(profile=>{const name=profile.querySelector('header b')?.textContent.trim();if(name==='U Khon Tay Za'){const assignment=profile.querySelector('ul li strong');if(assignment)assignment.textContent='Nature Alliance (HO)'}if(!assigned.has(name))return;const list=profile.querySelector('ul');if(list)list.insertAdjacentHTML('beforeend','<li class="core-service-heading">Core Services</li>'+services.map(service=>'<li class="core-service-item">'+service+'</li>').join(''))});shared.remove()}const directorIcon=card.querySelector('.org-role-director .org-role-icon'),managerIcon=card.querySelector('.org-role-manager .org-role-icon'),leadHeader=card.querySelector('.org-profile-lead header');if(directorIcon)directorIcon.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 4.8 3.2 7.7 8 9 4.8-1.3 8-4.2 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>';if(managerIcon)managerIcon.innerHTML='<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 8h5M18.5 5.5v5"/></svg>';if(leadHeader)leadHeader.insertAdjacentHTML('afterbegin','<span class="lead-role-icon"><svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></svg></span>')}
function render(){let card=document.getElementById('manpowerPlanningCard');if(!card){card=document.createElement('section');card.id='manpowerPlanningCard';card.className='card manpower-planning-card';const directory=document.querySelector('#manpowerDashboard>.unified-table-card,#manpowerDashboard>.tablecard,main>section.card.unified-table-card,main>section.card.tablecard');if(directory)directory.insertAdjacentElement('afterend',card);else document.querySelector('main>.hero')?.insertAdjacentElement('afterend',card)}if(!card)return;card.hidden=active!=='Manpower';if(active!=='Manpower')return;clearCharts();card.className='card unified-table-card';card.innerHTML=nav()+'<div class="planning-visual-body">'+({structure:structure,onsite:onsite,scope:scope,future:future}[selected])()+'</div>';enhanceMetrics(card);card.querySelectorAll('.org-highlight.service').forEach(item=>{item.className='';item.textContent=item.textContent.trim()});card.querySelectorAll('.org-highlight.site').forEach(item=>item.classList.remove('org-highlight','site'));card.querySelectorAll('.manpower-planning-tab').forEach(b=>b.onclick=()=>{if(b.dataset.tab===selected)return;selected=b.dataset.tab;sessionStorage.setItem('manpowerVisualTab',selected);render()});if(selected==='structure')chart('structureChart','doughnut',['Leadership','Infrastructure','Engineering'],[2,6,1],'Team Members');if(selected==='onsite'){siteCoverageChart();const footer=document.getElementById('siteCoverageCount');if(footer)footer.textContent='Showing 12 of 12 locations - 7 Members'}if(selected==='scope')chart('scopeChart','line',['Governance','Infrastructure','M365','Software','Security','Support'],[70,95,88,65,78,92],'Coverage');if(selected==='future')chart('futureChart','bar',['Leadership','Infrastructure','Security','Cloud','Engineering','Support'],[1,1,1,1,2,2],'Headcount')}
function init(){const nav=window.navigateHubPage;window.navigateHubPage=function(n,p=true){if(p&&n===active){document.querySelectorAll('#nav button').forEach(button=>{const name=button.dataset.page||button.querySelector('.nav-text')?.textContent;const current=name===active;button.classList.toggle('active',current);button.setAttribute('aria-current',current?'page':'false')});document.querySelectorAll('#tabs button').forEach(button=>button.classList.toggle('active',button.textContent===active));return}nav(n,p);render()};const pg=window.page;window.page=function(n){pg(n);render()};const toggle=window.toggleTheme;window.toggleTheme=function(){toggle();render()};const t=document.querySelector('.theme-toggle');if(t)t.onclick=window.toggleTheme;render()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


(function(){
function init(){
 const header=document.querySelector('header.top');if(!header)return;
 let button=document.getElementById('backToTop');
 if(!button){button=document.createElement('button');button.id='backToTop';button.className='back-to-top';button.type='button';button.setAttribute('aria-label','Back to top');button.setAttribute('title','Back to top');button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>';document.body.appendChild(button)}
 function sync(){const y=window.scrollY||document.documentElement.scrollTop;header.classList.toggle('is-stuck',y>8);button.classList.toggle('show',y>280)}
 button.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));window.addEventListener('scroll',sync,{passive:true});window.addEventListener('pageshow',sync);sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


(function(){
function init(){
 const side=document.getElementById('side'),toggle=document.querySelector('.hamb');if(!side||!toggle)return;
 let backdrop=document.querySelector('.side-backdrop');if(!backdrop){backdrop=document.createElement('div');backdrop.className='side-backdrop';backdrop.setAttribute('aria-hidden','true');document.body.appendChild(backdrop)}
 const mobile=()=>window.matchMedia('(max-width:700px)').matches;
 function sync(){const open=mobile()&&side.classList.contains('open');backdrop.classList.toggle('show',open);document.body.classList.toggle('mobile-side-open',open);toggle.setAttribute('aria-expanded',String(open));backdrop.setAttribute('aria-hidden',String(!open))}
 function close(){side.classList.remove('open');sync()}
 backdrop.addEventListener('click',close);
 document.addEventListener('pointerdown',event=>{if(mobile()&&side.classList.contains('open')&&!side.contains(event.target)&&!toggle.contains(event.target))close()});
 side.addEventListener('click',event=>{if(mobile()&&event.target.closest('.nav button'))close()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&side.classList.contains('open')){close();toggle.focus()}});
 toggle.addEventListener('click',()=>queueMicrotask(sync));window.addEventListener('resize',sync);new MutationObserver(sync).observe(side,{attributes:true,attributeFilter:['class']});sync();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* Workforce Plan reference data. Kept separate so the graph layout remains unchanged. */
(function(){
const workforceFunctions={
'Data Center':['Private Cloud Operation','Remote Access Management','Network Distribution Management','End-user Support','Call System','Data Center Hosting'],
'IT Management':['Procurement','Vendor Management','Budgeting & Financial Control','Fixed Asset Management','Document Control','Online Meeting Facilitation','Electronic Document Management System'],
'User Support':['Technical Support','Helpdesk','Ticketing System','Email & Data Drive','File Sharing','User Assets','User Training'],
'Systems':['Server Administration','Network Management','Copier & Printer Network Management','Wireless Access Point','Physical & Virtual Server','Storage Management','Email System Administration','Backup'],
'Security':['Cyber Security','Information Security','Port Security','Monitoring','Firewall'],
'ELV Systems':['CCTV','Door Access System','Meeting Room Conferencing'],
'Branch Support':['Report','Technical Support','Central Management','Data Control'],
'IT Projects':['Construction Site Lead','Analyst Device','Outsourcing Service','Office Renovation'],
'Software':['Mobile App Development','Web Development','Software Design Architecture','Program Support','User Training Support','Technical Data Support','Customer Relation Management','Enterprise Resource Planning (ERP)','Database Management','Deployment User','Coordinator User & Vendor'],
'Data Science':['Big Data Processing','Data Cleaning','Data Pipeline Building','Research & Development']
};
function applyWorkforceReferenceData(){
 const graph=document.querySelector('.workforce-org');if(!graph)return;
 const planKpis=graph.parentElement?.querySelector('.visual-kpis');
 if(planKpis){
  let cards=[...planKpis.querySelectorAll('.visual-kpi')];
  if(cards[2]?.querySelector('span')?.textContent.trim()==='Software')planKpis.append(cards[2]);
  cards=[...planKpis.querySelectorAll('.visual-kpi')];
  if(cards[2]){cards[2].classList.remove('metric-tone-4');cards[2].classList.add('metric-tone-3');const value=cards[2].querySelector('strong');if(value&&value.textContent!=='7')value.textContent='7'}
  if(cards[3]){cards[3].classList.remove('metric-tone-3');cards[3].classList.add('metric-tone-4');const value=cards[3].querySelector('strong');if(value&&value.textContent!=='3')value.textContent='3'}
 }
 const graphHeader=graph.querySelector('.workforce-org-head');if(graphHeader)graphHeader.remove();
 const leaders=graph.querySelectorAll('.workforce-leaders article');
 if(leaders[0]){const b=leaders[0].querySelector('b'),s=leaders[0].querySelector('small');if(b.textContent!=='Director')b.textContent='Director';if(s.textContent!=='Digital Strategy & Governance')s.textContent='Digital Strategy & Governance'}
 if(leaders[1]){const b=leaders[1].querySelector('b'),s=leaders[1].querySelector('small');if(b.textContent!=='IT Manager')b.textContent='IT Manager';if(s.textContent!=='Operations & Service Delivery')s.textContent='Operations & Service Delivery'}
 const softwareEngineer=graph.querySelector('.workforce-branch.software .workforce-people article:first-child small');if(softwareEngineer&&softwareEngineer.textContent!=='Khaing Zaw Shein')softwareEngineer.textContent='Khaing Zaw Shein';
 const infrastructureRoles=graph.querySelectorAll('.workforce-branch.infrastructure .workforce-people article small');
 const administratorNames='Khin Maung Thant · Khon Tay Za · Than Toe Aung · Htin Kyaw Lin';
 if(infrastructureRoles.length>=5){
  if(infrastructureRoles[1].textContent!==administratorNames)infrastructureRoles[1].textContent=administratorNames;
  infrastructureRoles[2].closest('article')?.remove();
 }else if(infrastructureRoles[1]&&infrastructureRoles[1].textContent!==administratorNames){
  infrastructureRoles[1].textContent=administratorNames;
 }
 const displayNames={'Systems':'System Management','ELV Systems':'ELV','Branch Support':'Branch Office','IT Projects':'Projects'};
 graph.querySelectorAll('.workforce-functions article').forEach(card=>{const heading=card.querySelector('b'),title=heading?.textContent.trim(),items=workforceFunctions[title];if(!items)return;const content=card.querySelector('span');if(content&&!content.querySelector('ul'))content.innerHTML='<ul>'+items.map(item=>'<li>'+item+'</li>').join('')+'</ul>';if(displayNames[title])heading.textContent=displayNames[title]});
}
function initWorkforceReference(){new MutationObserver(applyWorkforceReferenceData).observe(document.body,{childList:true,subtree:true});applyWorkforceReferenceData()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initWorkforceReference);else initWorkforceReference();
})();

/* One-time Microsoft 365 data migration: Nature Valley Business Basic 18 -> 19. */
(function(){
 const migrationKey='m365NatureValleyBusinessBasic19';
 if(localStorage.getItem(migrationKey)==='done')return;
 let companies,licenses;
 try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))}catch(e){}
 try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))}catch(e){}
 if(!Array.isArray(companies)||!companies.length)companies=data['Microsoft 365']||[];
 if(!Array.isArray(licenses)||!licenses.length)licenses=[];
 const valley=companies.find(row=>String(row.Company).replace(/\s+/g,' ').trim().toLowerCase()==='nature valley');
 if(valley){
  valley['Business Basic']=19;
  const normal=companies.filter(row=>row.Company!=='Total'),total=companies.find(row=>row.Company==='Total')||{Company:'Total'};
  if(!companies.includes(total))companies.push(total);
  const licenseKeys=Object.keys(valley).filter(key=>key!=='Company'&&key!=='Total Account');
  normal.forEach(row=>row['Total Account']=licenseKeys.reduce((sum,key)=>sum+(Number(row[key])||0),0));
  total['Total Account']=normal.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0);
  licenseKeys.forEach(key=>total[key]=normal.reduce((sum,row)=>sum+(Number(row[key])||0),0));
  licenses.filter(row=>row.Licenses!=='Total').forEach(row=>{row['Active Users']=Number(total[row.Licenses])||0;row['Available License']=(Number(row['Total Licenses'])||0)-row['Active Users']});
  const licenseTotal=licenses.find(row=>row.Licenses==='Total');
  if(licenseTotal)['Total Licenses','Active Users','Available License'].forEach(key=>licenseTotal[key]=licenses.filter(row=>row.Licenses!=='Total').reduce((sum,row)=>sum+(Number(row[key])||0),0));
  data['Microsoft 365']=companies;
  localStorage.setItem('m365CompanyDB',JSON.stringify(companies));
  localStorage.setItem('m365LicensesDB',JSON.stringify(licenses));
  localStorage.setItem('itHubData',JSON.stringify(data));
 }
 localStorage.setItem(migrationKey,'done');
 location.reload();
})();

/* One-time Microsoft 365 update: Nature Alliance Business Basic 95 and Business Standard 44. */
(function(){
 const migrationKey='m365NatureAllianceBusinessBasic95Standard44';
 if(localStorage.getItem(migrationKey)==='done')return;
 let companies,licenses;
 try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))}catch(e){}
 try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))}catch(e){}
 if(!Array.isArray(companies)||!companies.length)companies=data['Microsoft 365']||[];
 if(!Array.isArray(licenses)||!licenses.length)licenses=[];
 const nature=companies.find(row=>String(row.Company).replace(/\s+/g,' ').trim().toLowerCase().replace('allliance','alliance')==='nature alliance');
 if(nature){
  nature['Business Basic']=95;
  nature['Business Standard']=44;
  const normal=companies.filter(row=>row.Company!=='Total'),total=companies.find(row=>row.Company==='Total')||{Company:'Total'};
  if(!companies.includes(total))companies.push(total);
  const licenseKeys=Object.keys(nature).filter(key=>key!=='Company'&&key!=='Total Account');
  normal.forEach(row=>row['Total Account']=licenseKeys.reduce((sum,key)=>sum+(Number(row[key])||0),0));
  total['Total Account']=normal.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0);
  licenseKeys.forEach(key=>total[key]=normal.reduce((sum,row)=>sum+(Number(row[key])||0),0));
  licenses.filter(row=>row.Licenses!=='Total').forEach(row=>{row['Active Users']=Number(total[row.Licenses])||0;row['Available License']=(Number(row['Total Licenses'])||0)-row['Active Users']});
  const licenseTotal=licenses.find(row=>row.Licenses==='Total');
  if(licenseTotal)['Total Licenses','Active Users','Available License'].forEach(key=>licenseTotal[key]=licenses.filter(row=>row.Licenses!=='Total').reduce((sum,row)=>sum+(Number(row[key])||0),0));
  data['Microsoft 365']=companies;
  localStorage.setItem('m365CompanyDB',JSON.stringify(companies));
  localStorage.setItem('m365LicensesDB',JSON.stringify(licenses));
  localStorage.setItem('itHubData',JSON.stringify(data));
 }
 localStorage.setItem(migrationKey,'done');
 location.reload();
})();

/* Legacy migration retained for older saved data. */
(function(){
 if(localStorage.getItem('m365NatureAllianceBusinessBasic95Standard44')==='done')return;
 const migrationKey='m365NatureAllianceBusinessBasic94';
 if(localStorage.getItem(migrationKey)==='done')return;
 let companies,licenses;
 try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))}catch(e){}
 try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))}catch(e){}
 if(!Array.isArray(companies)||!companies.length)companies=data['Microsoft 365']||[];
 if(!Array.isArray(licenses)||!licenses.length)licenses=[];
 const nature=companies.find(row=>String(row.Company).replace(/\s+/g,' ').trim().toLowerCase().replace('allliance','alliance')==='nature alliance');
 if(nature){
  nature['Business Basic']=94;
  const normal=companies.filter(row=>row.Company!=='Total'),total=companies.find(row=>row.Company==='Total')||{Company:'Total'};
  if(!companies.includes(total))companies.push(total);
  const licenseKeys=Object.keys(nature).filter(key=>key!=='Company'&&key!=='Total Account');
  normal.forEach(row=>row['Total Account']=licenseKeys.reduce((sum,key)=>sum+(Number(row[key])||0),0));
  total['Total Account']=normal.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0);
  licenseKeys.forEach(key=>total[key]=normal.reduce((sum,row)=>sum+(Number(row[key])||0),0));
  licenses.filter(row=>row.Licenses!=='Total').forEach(row=>{row['Active Users']=Number(total[row.Licenses])||0;row['Available License']=(Number(row['Total Licenses'])||0)-row['Active Users']});
  const licenseTotal=licenses.find(row=>row.Licenses==='Total');
  if(licenseTotal)['Total Licenses','Active Users','Available License'].forEach(key=>licenseTotal[key]=licenses.filter(row=>row.Licenses!=='Total').reduce((sum,row)=>sum+(Number(row[key])||0),0));
  data['Microsoft 365']=companies;
  localStorage.setItem('m365CompanyDB',JSON.stringify(companies));
  localStorage.setItem('m365LicensesDB',JSON.stringify(licenses));
  localStorage.setItem('itHubData',JSON.stringify(data));
 }
 localStorage.setItem(migrationKey,'done');
 location.reload();
})();

/* Keep shared chart controls beside their title only while both fit in the card. */
(()=>{
 let frame;
 const update=()=>{
 document.querySelectorAll('.unified-chart-card .unified-chart-header').forEach(header=>{
   const title=header.querySelector(':scope > div');
   const control=header.querySelector(':scope > .unified-chart-select');
   if(!title||!control)return;
   header.classList.add('chart-control-ready');
   header.classList.remove('chart-control-stacked');
   const gap=parseFloat(getComputedStyle(header).gap)||0;
   const required=Math.ceil(title.scrollWidth+control.getBoundingClientRect().width+gap);
   header.classList.toggle('chart-control-stacked',header.clientWidth<required);
  });
  document.querySelectorAll('table').forEach(table=>{
   table.classList.add('unified-data-table');
   table.parentElement?.classList.add('unified-table-scroll');
   table.closest('.card')?.classList.add('unified-table-card');
   table.querySelectorAll('tbody td,tfoot td,tfoot th').forEach(cell=>{
    const value=cell.textContent.trim().replace(/(?:MMK|\$|,|%|\s)/gi,'');
    cell.classList.toggle('is-numeric',/^[+-]?\d+(?:\.\d+)?$/.test(value));
   });
  });
 };
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};window.refreshUnifiedChartControls=schedule;
 new ResizeObserver(schedule).observe(document.documentElement);

 window.addEventListener('load',schedule);
 schedule();
})();

/* Keep all Microsoft 365 content in one page wrapper, like Service Tickets. */
(function(){
 const wrapper=document.getElementById('microsoft365Dashboard');
 const hero=document.querySelector('main>.hero');
 if(!wrapper||!hero)return;
 const nodes=()=>[
  wrapper.querySelector(':scope>.unified-kpi-grid')||document.getElementById('kpis'),
  wrapper.querySelector(':scope>.unified-chart-grid')||document.querySelector('main>.grid'),
  wrapper.querySelector(':scope>section.card.tablecard')||wrapper.querySelector(':scope>.unified-table-card:not([data-table="license-utilization"])')||document.querySelector('main>section.card.tablecard'),
  document.querySelector('[data-table="license-utilization"]')
 ].filter(Boolean);
 const currentPage=()=>document.getElementById('crumb')?.textContent.trim();
 const restore=()=>nodes().forEach(node=>{if(node.matches('[data-table="license-utilization"]')){node.remove();return}if(node.parentElement!==hero.parentElement)hero.insertAdjacentElement('afterend',node);if(node.classList.contains('unified-kpi-grid'))node.id='kpis';if(node.classList.contains('unified-table-card')){node.className='card tablecard';const head=node.querySelector('.unified-table-head');if(head)head.className='head';const scroll=node.querySelector('.unified-table-scroll');if(scroll)scroll.className='';const footer=node.querySelector('.unified-table-footer');if(footer)footer.className='foot'}if(node.classList.contains('unified-chart-grid')){node.className='grid';const header=node.querySelector('.unified-chart-header');if(header){header.className='title';header.querySelector('h2')?.setAttribute('id','ctitle');const control=header.querySelector('#m365CompanyChartType');if(control){control.id='type';control.className='select'}}const canvasWrap=node.querySelector('.unified-bar-canvas');if(canvasWrap)canvasWrap.className='chart unified-bar-canvas';const pieLayout=node.querySelector('.unified-pie-layout');if(pieLayout)pieLayout.className='piegrid';const pieCanvas=node.querySelector('#pie')?.parentElement;if(pieCanvas)pieCanvas.className='pie';const licenseLegend=node.querySelector('#microsoft365LicenseLegend');if(licenseLegend){licenseLegend.id='legend';licenseLegend.className='legend'}}});
 const sync=()=>{
 const selected=currentPage()==='Microsoft 365';
  document.body.classList.toggle('microsoft365-page',selected);
  if(selected){
   nodes().forEach(node=>{node.hidden=false;node.style.display='';if(node.parentElement!==wrapper)wrapper.append(node)});
   const kpiSection=wrapper.querySelector(':scope>.unified-kpi-grid');if(kpiSection)kpiSection.removeAttribute('id');
   const chartGrid=wrapper.querySelector(':scope>.grid')||wrapper.querySelector(':scope>.unified-chart-grid');
   if(chartGrid)chartGrid.className='unified-chart-grid';
   chartGrid?.querySelectorAll(':scope>article').forEach((card,index)=>{card.className='unified-chart-card';const header=card.querySelector('.title,.unified-chart-header');if(header){header.className='unified-chart-header chart-control-ready';header.querySelector('h2')?.removeAttribute('id');const control=header.querySelector('#type');if(control){control.id='m365CompanyChartType';control.className='filter unified-chart-select';control.setAttribute('aria-label','Company chart type')}}const canvasWrap=card.querySelector('.chart,.unified-bar-canvas');if(canvasWrap)canvasWrap.className='unified-bar-canvas';if(index===1){const pieLayout=card.querySelector('.piegrid,.unified-pie-layout');if(pieLayout)pieLayout.className='unified-pie-layout';const pieCanvas=card.querySelector('#pie')?.parentElement;if(pieCanvas)pieCanvas.className='unified-pie-canvas';const legend=card.querySelector('#legend');if(legend){legend.id='microsoft365LicenseLegend';legend.className='unified-chart-legend'}}});
   wrapper.querySelectorAll(':scope>.tablecard,:scope>.unified-table-card').forEach(tableCard=>{tableCard.className='card unified-table-card';const head=tableCard.querySelector('.head,.unified-table-head');if(head)head.className='unified-table-head';const title=head?.querySelector('.unified-table-title,.unified-table-title');if(title)title.className='unified-table-title';const icon=head?.querySelector('.unified-table-title-icon,.unified-table-title-icon');if(icon)icon.className='unified-table-title-icon';const scroll=tableCard.querySelector('.table-scroll,.unified-table-scroll');if(scroll)scroll.className='unified-table-scroll';const footer=tableCard.querySelector('.foot,.unified-table-footer');if(footer)footer.className='unified-table-footer'});
   wrapper.querySelector('#m365PieFilter')?.classList.add('unified-chart-select');
   wrapper.hidden=false;
  }else{wrapper.hidden=true;restore()}
 };
 const wrapCall=(fn)=>function(name,...args){if(name!=='Microsoft 365'){wrapper.hidden=true;restore()}const result=fn.call(this,name,...args);requestAnimationFrame(sync);return result};
 if(typeof window.navigateHubPage==='function')window.navigateHubPage=wrapCall(window.navigateHubPage);
 if(typeof window.page==='function')window.page=wrapCall(window.page);
 const observer=new MutationObserver(()=>requestAnimationFrame(sync));
 observer.observe(document.querySelector('main'),{childList:true,subtree:true});
 requestAnimationFrame(sync);
})();

/* Run one final, frame-synchronised render after menu navigation.  Several
   dashboard modules share the same base elements, so this prevents a later
   module from leaving the newly selected page showing generic fallback data. */
(function(){
 const navigate=window.navigateHubPage;
 if(typeof navigate!=='function')return;
 let refreshFrame=0;
 window.navigateHubPage=function(name,push=true){
  const result=navigate(name,push);
  cancelAnimationFrame(refreshFrame);
  refreshFrame=requestAnimationFrame(()=>{
   if(active===name)navigate(name,false);
  });
  return result;
 };
})();

/* These menu pages intentionally contain only their shared hero section. */
(function(){
 const emptyPages=new Set(['Dashboard','Budget & Expense','Copier & Printer Usage','Fixed Assets']);
 const baseSections=()=>[...document.querySelectorAll('main > .unified-kpi-grid,main > .grid,main > .tablecard')];
 const update=name=>{
  const isEmpty=emptyPages.has(name);
  baseSections().forEach(section=>{
   section.hidden=isEmpty;
   if(isEmpty)section.style.setProperty('display','none','important');
   else section.style.removeProperty('display');
  });
 };
 const navigate=window.navigateHubPage;
 if(typeof navigate!=='function')return;
 window.navigateHubPage=function(name,push=true){
  const result=navigate(name,push);
  requestAnimationFrame(()=>requestAnimationFrame(()=>update(name)));
  return result;
 };
 requestAnimationFrame(()=>requestAnimationFrame(()=>update(active)));
})();


/* Use semantic table footers for Microsoft 365 calculated totals. */
(function(){const moveTotals=()=>document.querySelectorAll('.m365-company-table,[data-table="license-utilization"] table').forEach(table=>{const totals=[...table.querySelectorAll('tbody tr.total-row')];if(!totals.length)return;const footer=table.tFoot||table.createTFoot();totals.forEach(row=>{row.classList.remove('total-row');footer.append(row)})});new MutationObserver(moveTotals).observe(document.body,{childList:true,subtree:true});moveTotals()})();
/* One-time Microsoft 365 update: Innobuilder and Business Basic allocations. */
(function(){const key='m365Innobuilder75BusinessBasic210';if(localStorage.getItem(key))return;try{const companies=JSON.parse(localStorage.getItem('m365CompanyDB'))||[],licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))||[],innobuilder=companies.find(row=>row.Company==='Innobuilder'),basic=licenses.find(row=>row.Licenses==='Business Basic');if(innobuilder){innobuilder['Total Account']=75;innobuilder['Business Basic']=52;const total=companies.find(row=>row.Company==='Total');if(total){Object.keys(total).filter(name=>name!=='Company').forEach(name=>total[name]=companies.filter(row=>row.Company!=='Total').reduce((sum,row)=>sum+(Number(row[name])||0),0))}}if(basic){basic['Active Users']=210;basic['Available License']=5;const total=licenses.find(row=>row.Licenses==='Total');if(total){['Total Licenses','Active Users','Available License'].forEach(name=>total[name]=licenses.filter(row=>row.Licenses!=='Total').reduce((sum,row)=>sum+(Number(row[name])||0),0))}}localStorage.setItem('m365CompanyDB',JSON.stringify(companies));localStorage.setItem('m365LicensesDB',JSON.stringify(licenses));localStorage.setItem(key,'done')}catch(e){}})();
/* Keep only Manpower-specific content inside its own dashboard wrapper. */
(function(){const wrapper=document.getElementById('manpowerDashboard'),hero=document.querySelector('main>.hero');if(!wrapper||!hero)return;const nodes=()=>[wrapper.querySelector(':scope>.unified-table-card')||wrapper.querySelector(':scope>.tablecard')||document.querySelector('main>section.card.unified-table-card')||document.querySelector('main>section.card.tablecard'),document.getElementById('manpowerPlanningCard')].filter(Boolean);const genericContent=()=>[document.querySelector('main>#kpis'),wrapper.querySelector(':scope>.grid')||document.querySelector('main>.grid')].filter(Boolean);const restore=()=>nodes().slice().reverse().forEach(node=>{if(node.parentElement===wrapper)hero.insertAdjacentElement('afterend',node)});const restoreGeneric=()=>genericContent().forEach(node=>{if(node.parentElement===wrapper)hero.insertAdjacentElement('afterend',node);node.hidden=false;node.style.display=''});const sync=()=>{const selected=active==='Manpower';if(!selected){wrapper.hidden=true;restore();restoreGeneric();return}genericContent().forEach(node=>{if(node.parentElement===wrapper)hero.insertAdjacentElement('afterend',node);node.hidden=true;node.style.display='none'});nodes().forEach(node=>{node.hidden=false;node.style.display='';if(node.parentElement!==wrapper)wrapper.append(node)});wrapper.hidden=false};const wrap=fn=>function(name,...args){if(name!=='Manpower'){restore();restoreGeneric()}const result=fn.call(this,name,...args);requestAnimationFrame(sync);return result};window.navigateHubPage=wrap(window.navigateHubPage);window.page=wrap(window.page);requestAnimationFrame(sync)})();
/* Filter the Workforce Directory rows in place so typing never rebuilds the card. */
(function(){let query='',division='All';const apply=()=>{const table=document.querySelector('#manpowerDashboard .unified-data-table,main>.unified-table-card .unified-data-table');if(!table||!table.closest('.unified-table-card')?.querySelector('.unified-table-title h2')?.textContent.includes('Digital Workforce Directory'))return;const rows=[...table.tBodies[0]?.rows||[]],shown=rows.filter(row=>{const matchesQuery=!query||row.textContent.toLowerCase().includes(query);const matchesDivision=division==='All'||row.cells[2]?.textContent.trim()===division;row.hidden=!(matchesQuery&&matchesDivision);return !row.hidden});const footer=table.closest('.unified-table-card')?.querySelector('.unified-table-footer');if(footer)footer.textContent='Showing '+shown.length+' of '+rows.length+' employees'};document.addEventListener('input',event=>{if(event.target.id!=='manpowerSearch')return;event.stopImmediatePropagation();query=event.target.value.trim().toLowerCase();apply()},true);document.addEventListener('change',event=>{if(event.target.id!=='manpowerDivisionFilter')return;event.stopImmediatePropagation();division=event.target.value;apply()},true)})();
/* Keep Microsoft 365 table search and filters responsive without rebuilding table controls. */
(function(){let companyQuery='',companyFilter='All',licenseQuery='',licenseFilter='All';const footer=(table,text)=>{const node=table.closest('.unified-table-card')?.querySelector('.unified-table-footer');if(node)node.textContent=text};const filterCompany=()=>{const table=document.querySelector('.m365-company-table');if(!table)return;const rows=[...table.tBodies[0]?.rows||[]],regular=rows.filter(row=>!row.classList.contains('total-row')),shown=regular.filter(row=>{const name=row.cells[0]?.textContent.trim().toLowerCase()||'',visible=(companyFilter==='All'||name===companyFilter.toLowerCase())&&(!companyQuery||name.includes(companyQuery));row.hidden=!visible;return visible});rows.filter(row=>row.classList.contains('total-row')).forEach(row=>row.hidden=false);footer(table,'Showing '+shown.length+' of '+regular.length+' companies')};const filterLicenses=()=>{const table=document.querySelector('[data-table="license-utilization"] table');if(!table)return;const rows=[...table.querySelectorAll('tbody tr')],regular=rows.filter(row=>!row.classList.contains('total-row')),shown=regular.filter(row=>{const feature=row.cells[1]?.textContent.trim()||'',text=row.textContent.toLowerCase(),visible=(licenseFilter==='All'||feature===licenseFilter)&&(!licenseQuery||text.includes(licenseQuery));row.hidden=!visible;return visible});table.querySelectorAll('.total-row').forEach(row=>row.hidden=false);footer(table,'Showing '+shown.length+' of '+regular.length+' licenses')};document.addEventListener('input',event=>{if(event.target.id==='m365CompanySearch'){event.stopImmediatePropagation();companyQuery=event.target.value.trim().toLowerCase();filterCompany()}if(event.target.id==='m365LicenseSearch'){event.stopImmediatePropagation();licenseQuery=event.target.value.trim().toLowerCase();filterLicenses()}},true);document.addEventListener('change',event=>{if(event.target.id==='m365CompanyFilter'){event.stopImmediatePropagation();companyFilter=event.target.value;filterCompany()}if(event.target.id==='m365FeatureFilter'){event.stopImmediatePropagation();licenseFilter=event.target.value;filterLicenses()}},true)})();
/* Remove legacy redraw handlers from Microsoft 365 controls before the user interacts. */
(function(){const isM365Control=node=>['m365CompanySearch','m365LicenseSearch','m365CompanyFilter','m365FeatureFilter'].includes(node?.id);const detach=node=>{if(!isM365Control(node))return;node.oninput=null;node.onchange=null};document.addEventListener('focusin',event=>detach(event.target),true);document.addEventListener('pointerdown',event=>detach(event.target),true);document.addEventListener('keydown',event=>detach(event.target),true)})();
/* Keep the theme control visible and accurately announced after every chart/theme update. */
(function(){const toggle=document.querySelector('.theme-toggle');if(!toggle)return;const sync=()=>{const dark=document.body.classList.contains('dark');toggle.setAttribute('aria-pressed',String(dark));toggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');toggle.title=dark?'Switch to light theme':'Switch to dark theme'};toggle.addEventListener('click',()=>requestAnimationFrame(sync));sync()})();

/* Recalculate Company Account Distribution spacing when the responsive layout changes. */
(function(){let timer;window.addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{if(typeof active!=='undefined'&&active==='Microsoft 365'&&typeof window.charts==='function')window.charts()},160)})})();

/* Budget & Expense content is isolated in its own page wrapper. */
(function(){const panel=document.getElementById('budgetExpenseDashboard');if(!panel)return;const navigate=window.navigateHubPage;if(typeof navigate!=='function')return;window.navigateHubPage=function(name,push=true){navigate(name,push);panel.hidden=name!=='Budget & Expense'};panel.hidden=typeof active==='undefined'||active!=='Budget & Expense'})();

/* Budget & Expense dashboard sourced from Budget & Expense.xlsx. */
(function(){
  const panel=document.getElementById('budgetExpenseDashboard');
  const source=window.budgetExpenseData;
  if(!panel||!source)return;
  const fmt=value=>{const number=Number(value)||0,absolute=Math.abs(number),compact=(divisor,suffix)=>{const digits=absolute/divisor>=100?0:(absolute/divisor>=10?1:2);return (number/divisor).toFixed(digits).replace(/\\.?0+$/,'')+suffix};if(absolute>=1000000000)return compact(1000000000,'B');if(absolute>=1000000)return compact(1000000,'M');if(absolute>=1000)return compact(1000,'K');return new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.round(number))};
  const full=value=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.round(Number(value)||0));
  const clean=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const icon={budget:'<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-5 7 5v13M3 10h18M9 21v-5h6v5M8 12h1M15 12h1"/></svg>',expense:'<svg viewBox="0 0 24 24"><path d="M3 7h18v11H3z"/><path d="M3 10h18M7 15h4M7 7V5h10v2"/><circle cx="17" cy="15" r="1"/></svg>',variance:'<svg viewBox="0 0 24 24"><path d="M5 18V6M5 18h14"/><path d="m8 14 3-3 3 2 4-5"/><path d="M15 8h3v3"/><path d="M8 6h3"/></svg>',utilization:'<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-8-8v8z"/><path d="M14 4a7 7 0 0 1 6 6h-6z"/><path d="M12 8v4l3 2"/></svg>',table:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></svg>'};
  panel.innerHTML=`<section class="unified-kpi-grid"><article class="unified-kpi-card tone-orange"><span class="unified-kpi-icon" aria-hidden="true">${icon.budget}</span><div><b>Total Budget</b><small id="budgetTotalSubtitle">All data</small></div><strong id="budgetTotal">0</strong></article><article class="unified-kpi-card tone-green"><span class="unified-kpi-icon" aria-hidden="true">${icon.expense}</span><div><b>Actual Expense</b><small id="budgetActualSubtitle">All data</small></div><strong id="budgetActual">0</strong></article><article id="budgetVarianceCard" class="unified-kpi-card tone-yellow"><span class="unified-kpi-icon" aria-hidden="true">${icon.variance}</span><div><b>Variance</b><small id="budgetVarianceSubtitle">Budget remaining</small></div><strong id="budgetVariance">0</strong></article><article id="budgetUtilizationCard" class="unified-kpi-card tone-blue"><span class="unified-kpi-icon" aria-hidden="true">${icon.utilization}</span><div><b>Budget Utilization</b><small id="budgetUtilizationSubtitle">Expense against budget</small></div><strong id="budgetUtilization">0%</strong></article></section><section class="unified-filter-card"><div class="unified-filter-heading"><div><h2>Budget &amp; Expense Analytics</h2><p>Monitor approved budgets, actual spending, and variance by reporting period.</p></div><button id="budgetResetFilters" class="btn" type="button">Reset filters</button></div><div class="unified-filter-grid"><label><span>Period</span><select id="budgetPeriodFilter" class="filter" aria-label="Budget reporting period"><option value="all">All data</option><option value="monthly">Monthly</option><option value="last3">Last 3 months</option><option value="last6">Last 6 months</option><option value="yearly">Yearly</option><option value="custom">Custom range</option></select></label><label class="budget-period-value" hidden><span id="budgetPeriodValueLabel">Period detail</span><select id="budgetPeriodValue" class="filter" aria-label="Selected month or year"></select></label><label class="budget-custom-range" hidden><span>From month</span><select id="budgetRangeStart" class="filter" aria-label="Start month"></select></label><label class="budget-custom-range" hidden><span>To month</span><select id="budgetRangeEnd" class="filter" aria-label="End month"></select></label><label><span>Company</span><select id="budgetCompanyFilter" class="filter" aria-label="Filter by company"></select></label><label><span>Category</span><select id="budgetCategoryFilter" class="filter" aria-label="Filter by category"></select></label></div></section><article class="unified-chart-card"><div class="unified-chart-header"><div><h2>Budget vs Expense Summary</h2><p>Monthly budget and actual expense comparison</p></div></div><div class="unified-line-canvas"><canvas id="budgetSummaryChart" aria-label="Budget versus expense line chart"></canvas></div><p class="unified-chart-footer budget-summary-key" aria-label="Chart series"><span><i class="budget-summary-budget" aria-hidden="true"></i>Budget</span><span><i class="budget-summary-actual" aria-hidden="true"></i>Actual expense</span></p></article><section class="unified-chart-grid"><article class="unified-chart-card"><div class="unified-chart-header chart-control-ready"><div><h2>Company Expense Analysis</h2><p>Actual spending distribution across companies</p></div><select id="budgetCompanyChartType" class="filter unified-chart-select" aria-label="Expense by company chart type"><option value="bar">Bar chart</option><option value="line">Line chart</option></select></div><div class="unified-bar-canvas"><canvas id="budgetCompanyChart" aria-label="Expense by company chart"></canvas></div><p id="budgetCompanyChartFooter" class="unified-chart-footer"></p></article><article class="unified-chart-card"><div class="unified-chart-header chart-control-ready"><div><h2>Expense by Category</h2><p>Actual expense allocation by category</p></div><select id="budgetPieCategoryFilter" class="filter unified-chart-select" aria-label="Filter expense by category"><option value="all">All categories</option></select></div><div class="unified-pie-layout"><div class="unified-pie-canvas"><canvas id="budgetCategoryChart" aria-label="Expense by category pie chart"></canvas></div><div id="budgetCategoryLegend" class="unified-chart-legend"></div></div></article></section><section class="card unified-table-card"><div class="unified-table-head"><div class="unified-table-title"><span class="unified-table-title-icon" aria-hidden="true">${icon.table}</span><div><h2>Budget &amp; Expense Detail</h2><p>Company and category performance</p></div></div></div><div class="unified-table-scroll"><table class="unified-data-table"><thead><tr><th>Company</th><th>Category</th><th>Budget</th><th>Actual expense</th><th>Variance</th><th>Utilization</th></tr></thead><tbody id="budgetDetailBody"></tbody></table></div><footer class="unified-table-footer"><span id="budgetTableNote">0 records</span></footer></section>`;
  const start=document.getElementById('budgetRangeStart'),end=document.getElementById('budgetRangeEnd'),period=document.getElementById('budgetPeriodFilter'),companyFilter=document.getElementById('budgetCompanyFilter'),categoryFilter=document.getElementById('budgetCategoryFilter'),pieCategoryFilter=document.getElementById('budgetPieCategoryFilter'),periodValue=document.getElementById('budgetPeriodValue'),periodValueLabel=document.getElementById('budgetPeriodValueLabel'),companyChartType=document.getElementById('budgetCompanyChartType');
  source.months.forEach(month=>{start.add(new Option(month,month));end.add(new Option(month,month))});companyFilter.add(new Option('All companies','all'));[...new Set([...source.budgets,...source.expenses].map(row=>row.company))].filter(Boolean).sort().forEach(company=>companyFilter.add(new Option(company,company)));categoryFilter.add(new Option('All categories','all'));pieCategoryFilter.innerHTML='';pieCategoryFilter.add(new Option('All categories','all'));[...new Set([...source.budgets,...source.expenses].map(row=>row.category))].filter(Boolean).sort().forEach(category=>{categoryFilter.add(new Option(category,category));pieCategoryFilter.add(new Option(category,category))});
  start.value=source.months[0];end.value=source.months[source.months.length-1];
  const sumBy=(records,key,value='amount')=>records.reduce((map,row)=>{const label=row[key]||'Uncategorized';map.set(label,(map.get(label)||0)+(Number(row[value])||0));return map},new Map());
  const activeMonths=()=>{const latest=Math.max(0,source.months.reduce((latest,month,index)=>source.expenses.some(row=>row.month===month&&row.amount>0)?index:latest,-1));if(period.value==='monthly')return source.months.includes(periodValue.value)?[periodValue.value]:[];if(period.value==='yearly')return source.months.filter(month=>month.endsWith('-'+periodValue.value.slice(-2)));if(period.value==='last3')return source.months.slice(Math.max(0,latest-2),latest+1);if(period.value==='last6')return source.months.slice(Math.max(0,latest-5),latest+1);if(period.value==='custom'){const a=source.months.indexOf(start.value),b=source.months.indexOf(end.value);return source.months.slice(Math.min(a,b),Math.max(a,b)+1)}return source.months.slice()};
  const chartInstances={};
  function makeChart(name,canvas,config){if(chartInstances[name])chartInstances[name].destroy();chartInstances[name]=new Chart(canvas,config)}if(!Chart.registry.plugins.get('budgetCategoryCentre'))Chart.register({id:'budgetCategoryCentre',afterDraw(instance,args,options){if(instance.canvas.id!=='budgetCategoryChart'||!options)return;const area=instance.chartArea,ctx=instance.ctx,x=(area.left+area.right)/2,y=(area.top+area.bottom)/2;ctx.save();ctx.textAlign='center';ctx.fillStyle=options.dark?'#ae9698':'#998689';ctx.font='600 9px Poppins, Arial';ctx.fillText('MMK',x,y-6);ctx.fillStyle=options.dark?'#fff1ec':'#3f292d';ctx.font='700 22px Poppins, Arial';ctx.fillText(options.total||'0',x,y+18);ctx.restore()}});
  function render(){
    pieCategoryFilter.value=categoryFilter.value;const months=activeMonths(),monthSet=new Set(months),company=companyFilter.value,category=categoryFilter.value,matches=row=>(company==='all'||row.company===company)&&(category==='all'||row.category===category),budget=source.budgets.filter(row=>monthSet.has(row.month)&&matches(row)),actual=source.expenses.filter(row=>monthSet.has(row.month)&&matches(row)),purchases=source.purchases.filter(row=>(!row.month||monthSet.has(row.month))&&(company==='all'||row.company===company));
    const totalBudget=budget.reduce((sum,row)=>sum+row.amount,0),totalActual=actual.reduce((sum,row)=>sum+row.amount,0),variance=totalBudget-totalActual,utilization=totalBudget?totalActual/totalBudget*100:0;
    const label=period.value==='all'?'All data':months.join(' – ');
    [['budgetTotal',totalBudget],['budgetActual',totalActual],['budgetVariance',variance]].forEach(([id,value])=>{const metric=document.getElementById(id);metric.textContent=fmt(value);metric.title=full(value)+' MMK';metric.setAttribute('aria-label',full(value)+' MMK')});document.getElementById('budgetUtilization').textContent=utilization.toFixed(1)+'%';
    const selectedRecords=budget.length,remaining=Math.max(0,100-utilization),actualCompanies=new Set(actual.filter(row=>row.amount>0).map(row=>row.company)).size,status=utilization<=80?'On Budget':(utilization<=100?'Review Budget':'Over Budget'),overBudget=variance<0||utilization>100,varianceCard=document.getElementById('budgetVarianceCard'),utilizationCard=document.getElementById('budgetUtilizationCard');varianceCard.classList.toggle('tone-red',overBudget);varianceCard.classList.toggle('tone-yellow',!overBudget);utilizationCard.classList.toggle('tone-red',utilization>100);utilizationCard.classList.toggle('tone-blue',utilization<=100);document.getElementById('budgetTotalSubtitle').textContent=selectedRecords+' records selected';document.getElementById('budgetActualSubtitle').textContent=utilization<=100?remaining.toFixed(1)+'% left of approved budget':(utilization-100).toFixed(1)+'% above approved budget';document.getElementById('budgetVarianceSubtitle').textContent=status;document.getElementById('budgetUtilizationSubtitle').textContent='Across '+actualCompanies+' '+(actualCompanies===1?'Company':'Companies');
    const dark=document.body.classList.contains('dark'),text=dark?'#ead4cf':'#806864',grid=dark?'rgba(255,221,208,.17)':'rgba(125,92,87,.18)',card=dark?'#32171e':'#fffaf7',tooltip={displayColors:true,backgroundColor:dark?'rgba(18,14,18,.97)':'rgba(42,29,33,.96)',titleColor:'#fffaf7',bodyColor:'#fffaf7',borderColor:dark?'rgba(255,200,150,.35)':'rgba(255,255,255,.25)',borderWidth:1,padding:{x:11,y:9},cornerRadius:8,caretPadding:7,boxPadding:5,titleFont:{family:'Poppins',size:11,weight:'700'},bodyFont:{family:'Poppins',size:11,weight:'600'}},moneyTooltip={...tooltip,callbacks:{title:context=>context[0]?.dataset?.label||context[0]?.label||'Amount',label:context=>fmt(context.raw)+' MMK',labelColor:context=>{const color=Array.isArray(context.dataset.backgroundColor)?context.dataset.backgroundColor[context.dataIndex]:context.dataset.borderColor;return{backgroundColor:color,borderColor:color,borderWidth:1,borderRadius:2}}}};
    const monthlyBudget=source.months.map(month=>budget.filter(row=>row.month===month).reduce((sum,row)=>sum+row.amount,0)),monthlyActual=source.months.map(month=>actual.filter(row=>row.month===month).reduce((sum,row)=>sum+row.amount,0));
    makeChart('summary',document.getElementById('budgetSummaryChart'),{type:'line',data:{labels:months,datasets:[{label:'Budget',data:months.map(month=>monthlyBudget[source.months.indexOf(month)]),borderColor:dark?'#82d5bb':'#1d987b',backgroundColor:'transparent',fill:false,tension:.34,pointRadius:3,pointHoverRadius:5,borderWidth:2.5},{label:'Actual expense',data:months.map(month=>monthlyActual[source.months.indexOf(month)]),borderColor:dark?'#ff9569':'#d12a31',backgroundColor:'transparent',fill:false,tension:.34,pointRadius:3,pointHoverRadius:5,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic'},plugins:{legend:{display:false},tooltip:moneyTooltip},scales:{x:{grid:{color:grid},ticks:{color:text,font:{family:'Poppins',size:9}}},y:{beginAtZero:true,grid:{color:grid},ticks:{color:text,callback:value=>fmt(value),font:{family:'Poppins',size:9}}}}}});
    const companies=sumBy(actual,'company'),companyItems=[...companies.entries()].filter(([,value])=>value>0).sort((a,b)=>b[1]-a[1]);
    const companyLine=companyChartType.value==='line',companyCanvas=document.getElementById('budgetCompanyChart'),companyWrap=companyCanvas.parentElement,companyHeight=Math.max(280,companyItems.length*34+70),companyContext=companyCanvas.getContext('2d'),companyGradient=companyContext.createLinearGradient(0,0,companyCanvas.clientWidth||700,0);if(companyWrap)companyWrap.style.height=(companyLine?330:companyHeight)+'px';companyGradient.addColorStop(0,dark?'#c94a42':'#d12a31');companyGradient.addColorStop(1,dark?'#ef8563':'#f38c47');const companyScales=companyLine?{x:{grid:{color:grid},ticks:{color:text,font:{family:'Poppins',size:9}}},y:{beginAtZero:true,grid:{color:grid},ticks:{color:text,callback:value=>fmt(value),font:{family:'Poppins',size:9}}}}:{y:{grid:{display:false},ticks:{padding:9,color:text,font:{family:'Poppins',size:10,weight:'600'}}},x:{beginAtZero:true,grid:{color:grid},ticks:{color:text,callback:value=>fmt(value),font:{family:'Poppins',size:9}}}};makeChart('company',companyCanvas,{type:companyLine?'line':'bar',data:{labels:companyItems.map(row=>row[0]),datasets:[{label:'Actual expense',data:companyItems.map(row=>row[1]),backgroundColor:companyLine?(dark?'rgba(255,135,85,.14)':'rgba(209,42,49,.11)'):companyGradient,borderColor:dark?'#ff9569':'#d12a31',borderWidth:companyLine?2.5:1.5,borderRadius:companyLine?0:7,barThickness:companyLine?undefined:24,categoryPercentage:.74,barPercentage:.9,fill:companyLine,tension:.34,pointRadius:companyLine?4:0,pointHoverRadius:companyLine?6:0,pointBackgroundColor:dark?'#ff9a70':'#c9252d'}]},options:{indexAxis:companyLine?'x':'y',responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic'},plugins:{legend:{display:false},tooltip:moneyTooltip},scales:companyScales}});document.getElementById('budgetCompanyChartFooter').textContent='Total: '+fmt(totalActual)+' MMK';const categories=sumBy(actual,'category'),categoryItems=[...categories.entries()].filter(([,value])=>value>0).sort((a,b)=>b[1]-a[1]),colors=dark?['#ff8755','#f5c66b','#7056d8','#4eb4cd','#d85b64','#82d5bb']:['#d12a31','#f06428','#7056d8','#3194ad','#b94f78','#16866a'];
    makeChart('category',document.getElementById('budgetCategoryChart'),{type:'doughnut',data:{labels:categoryItems.map(row=>row[0]),datasets:[{data:categoryItems.map(row=>row[1]),backgroundColor:categoryItems.map((_,index)=>colors[index%colors.length]),borderColor:card,borderWidth:4,hoverOffset:4}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutCubic'},cutout:'64%',plugins:{legend:{display:false},budgetCategoryCentre:{total:fmt(totalActual),dark},tooltip:moneyTooltip}}});
    document.getElementById('budgetCategoryLegend').innerHTML=categoryItems.map((row,index)=>`<div><span><i class="dot" style="background:${colors[index%colors.length]}"></i>${clean(row[0])}</span><b><strong>${fmt(row[1])}</strong><small>MMK</small></b></div>`).join('');
    const keys=new Set([...budget.map(row=>row.company+'|'+row.category),...actual.map(row=>row.company+'|'+row.category)]),details=[...keys].map(key=>{const [company,category]=key.split('|'),planned=budget.filter(row=>row.company===company&&row.category===category).reduce((sum,row)=>sum+row.amount,0),spent=actual.filter(row=>row.company===company&&row.category===category).reduce((sum,row)=>sum+row.amount,0);return{company,category,planned,spent,variance:planned-spent}}).sort((a,b)=>b.spent-a.spent||a.company.localeCompare(b.company));
    document.getElementById('budgetDetailBody').innerHTML=details.map(row=>`<tr><td>${clean(row.company)}</td><td>${clean(row.category)}</td><td>${full(row.planned)}</td><td>${full(row.spent)}</td><td class="${row.variance<0?'budget-overrun':''}">${full(row.variance)}</td><td>${row.planned?(row.spent/row.planned*100).toFixed(1):'0.0'}%</td></tr>`).join('');
    document.getElementById('budgetTableNote').textContent=details.length+' category records · '+label;
  }
  function updateRangeVisibility(){const custom=period.value==='custom',monthly=period.value==='monthly',yearly=period.value==='yearly',periodSpecific=monthly||yearly;panel.querySelectorAll('.budget-period-value').forEach(control=>control.hidden=!periodSpecific);panel.querySelectorAll('.budget-custom-range').forEach(control=>control.hidden=!custom);periodValue.innerHTML='';periodValue.disabled=!periodSpecific;if(monthly){periodValueLabel.textContent='Month';['Apr-26','May-26','Jun-26','Jul-26','Aug-26','Sep-26','Oct-26','Nov-26','Dec-26','Jan-27','Feb-27','Mar-27'].forEach(month=>periodValue.add(new Option(month,month)));periodValue.value=source.months.includes('Aug-26')?'Aug-26':source.months[0]}else if(yearly){periodValueLabel.textContent='Year';['2025','2026','2027'].forEach(year=>periodValue.add(new Option(year,year)));periodValue.value='2026'}else{periodValueLabel.textContent='Period detail';periodValue.add(new Option('All periods','all'))}render()}
  period.addEventListener('change',updateRangeVisibility);periodValue.addEventListener('change',render);start.addEventListener('change',render);end.addEventListener('change',render);companyFilter.addEventListener('change',render);categoryFilter.addEventListener('change',render);pieCategoryFilter.addEventListener('change',()=>{categoryFilter.value=pieCategoryFilter.value;render()});companyChartType.addEventListener('change',render);document.getElementById('budgetResetFilters').addEventListener('click',()=>{period.value='all';companyFilter.value='all';categoryFilter.value='all';start.value=source.months[0];end.value=source.months[source.months.length-1];updateRangeVisibility()});
  function syncCompanyChartHeader(){const header=panel.querySelector('.unified-chart-header.chart-control-ready');if(!header)return;header.classList.remove('chart-control-stacked');const text=header.firstElementChild,control=header.querySelector('.unified-chart-select');header.classList.toggle('chart-control-stacked',!!text&&!!control&&text.scrollWidth+control.offsetWidth+12>header.clientWidth)}
  window.addEventListener('resize',()=>requestAnimationFrame(syncCompanyChartHeader));
  requestAnimationFrame(syncCompanyChartHeader);
  let themeRefreshQueued=false,themeRefreshTimer=0;
  function refreshBudgetCharts(){
    if(typeof active==='undefined'||active!=='Budget & Expense'||panel.hidden)return;
    render();
    syncCompanyChartHeader();
  }
  function queueThemeChartRefresh(){
    if(typeof active==='undefined'||active!=='Budget & Expense'||panel.hidden)return;
    panel.classList.add('budget-theme-transition');
    if(themeRefreshQueued)return;
    themeRefreshQueued=true;
    const complete=()=>{
      if(!themeRefreshQueued)return;
      themeRefreshQueued=false;
      clearTimeout(themeRefreshTimer);
      refreshBudgetCharts();
      requestAnimationFrame(()=>panel.classList.remove('budget-theme-transition'));
    };
    requestAnimationFrame(()=>requestAnimationFrame(complete));
    themeRefreshTimer=setTimeout(complete,140);
  }
  const navigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){navigate(name,push);if(name==='Budget & Expense')requestAnimationFrame(refreshBudgetCharts)};
  const theme=window.toggleTheme;window.toggleTheme=function(){
    if(typeof active!=='undefined'&&active==='Budget & Expense'&&!panel.hidden)panel.classList.add('budget-theme-transition');
    theme();
    queueThemeChartRefresh();
  };
  const themeButton=document.querySelector('.theme-toggle');
  if(themeButton){
    themeButton.onclick=window.toggleTheme;
    themeButton.addEventListener('click',queueThemeChartRefresh);
  }
  updateRangeVisibility();
})();