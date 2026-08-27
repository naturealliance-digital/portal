const menu=[['🏠','Dashboard','Overall IT management view'],['👥','Manpower','Digital team & workload'],['💰','Expenses','Budget & IT spending'],['🎫','Service Tickets','IT support & SLA'],['💻','Fixed Assets','Computers & IT equipment'],['☁️','Microsoft 365','Users & licenses'],['🔐','IT Security','Cybersecurity'],['🌐','Infrastructure','Network, servers & systems'],['📊','Reports','Monthly/quarterly reports'],['📁','Documents','IT policies, procedures & forms']];const sample={Dashboard:[{Metric:'System Availability',Value:99.8,Status:'Healthy'},{Metric:'Open Tickets',Value:24,Status:'Attention'},{Metric:'IT Budget Used',Value:68,Status:'On Track'},{Metric:'Security Score',Value:92,Status:'Healthy'}],Manpower:[{Employee:'Aung Min',Role:'IT Manager',Workload:78,Status:'On Track'},{Employee:'Su Su Win',Role:'Systems Engineer',Workload:92,Status:'High'},{Employee:'Ko Ko',Role:'IT Support',Workload:65,Status:'On Track'}],Expenses:[{Category:'Cloud Services',Budget:12500,Actual:9780,Status:'On Track'},{Category:'Software Licenses',Budget:8600,Actual:7420,Status:'On Track'},{Category:'Hardware',Budget:15000,Actual:16450,Status:'Over Budget'}],'Service Tickets':[{Ticket:'#INC-1842',Subject:'VPN access issue',Priority:'High',Status:'Open',SLA:'1h 24m'},{Ticket:'#INC-1841',Subject:'Laptop provisioning',Priority:'Medium',Status:'In Progress',SLA:'5h 10m'},{Ticket:'#INC-1839',Subject:'Email delivery delay',Priority:'High',Status:'Resolved',SLA:'Met'}],'Fixed Assets':[{Asset:'Dell Latitude 5440',Owner:'Aung Min',Location:'Head Office',Status:'In Use'},{Asset:'MacBook Pro M3',Owner:'May Thazin',Location:'Head Office',Status:'In Use'},{Asset:'HP LaserJet Pro',Owner:'Shared',Location:'Branch 04',Status:'Maintenance'}],'Microsoft 365':[{License:'Microsoft 365 Business Premium',Assigned:124,Available:26,Status:'Healthy'},{License:'Power BI Pro',Assigned:42,Available:8,Status:'Healthy'},{License:'Teams Phone Standard',Assigned:58,Available:2,Status:'Low Stock'}],'IT Security':[{Control:'Endpoint Protection',Coverage:98,Status:'Healthy'},{Control:'MFA Enrollment',Coverage:94,Status:'Healthy'},{Control:'Security Awareness',Coverage:76,Status:'Attention'}],Infrastructure:[{Service:'Core Network',Availability:99.98,Status:'Healthy'},{Service:'ERP Server',Availability:99.82,Status:'Healthy'},{Service:'Internet Link',Availability:98.91,Status:'Attention'}],Reports:[{Report:'Monthly IT Operations',Period:'July 2026',Owner:'IT Manager',Status:'Ready'},{Report:'Security Posture Review',Period:'Q2 2026',Owner:'Security Team',Status:'Ready'},{Report:'Asset Lifecycle',Period:'July 2026',Owner:'Infrastructure',Status:'Draft'}],Documents:[{Document:'IT Security Policy',Category:'Policy',Owner:'IT Security',Status:'Approved'},{Document:'New Joiner IT Checklist',Category:'Procedure',Owner:'IT Operations',Status:'Approved'},{Document:'Asset Handover Form',Category:'Form',Owner:'Infrastructure',Status:'Review'}]};let data=JSON.parse(JSON.stringify(sample)),active='Dashboard',bar,donut;function numeric(r){return Object.keys(r[0]||{}).filter(k=>r.some(x=>typeof x[k]==='number'))}function state(s){s=(s||'').toLowerCase();return /healthy|track|resolved|approved|ready|use/.test(s)?'good':/high|over|attention|maintenance|low|open|review/.test(s)?'warn':'bad'}function show(x){toast.textContent=x;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200)}function buildNav(){nav.innerHTML=tabs.innerHTML='';Object.keys(data).forEach(n=>{let m=menu.find(x=>x[1]===n),a=document.createElement('button'),b=document.createElement('button');a.innerHTML=(m?m[0]:'▦')+' '+n;a.onclick=()=>page(n);b.textContent=n;b.onclick=()=>page(n);nav.append(a);tabs.append(b)})}function page(n){active=n;h1.textContent=n==='Dashboard'?'IT Management Overview':n;crumb.textContent=n;sub.textContent=(menu.find(x=>x[1]===n)||[])[2]||'Imported worksheet dashboard';search.value='';side.classList.remove('open');[...nav.children].forEach(x=>x.classList.toggle('active',x.textContent.trim().endsWith(n)));[...tabs.children].forEach(x=>x.classList.toggle('active',x.textContent===n));render()}function render(){let r=data[active]||[],ns=numeric(r),cards=ns.slice(0,4).map((n,i)=>{let a=r.reduce((s,x)=>s+(+x[n]||0),0)/r.length;return[n,a,['◈','◌','◒','✦'][i]]});if(!cards.length)cards=Object.keys(r[0]||{}).slice(0,4).map((n,i)=>[n,r.length,['◈','◌','◒','✦'][i]]);kpis.innerHTML=cards.map((x,i)=>'<article class="kpi"><div class="kt"><span>'+x[0]+'</span><b class="ico">'+x[2]+'</b></div><div class="num">'+x[1].toLocaleString(undefined,{maximumFractionDigits:2})+'</div><div class="up '+(i==1?'down':'')+'">'+(i==1?'↓ 4.2%':'↑ 8.4%')+' from last month</div></article>').join('');ctitle.textContent=active+' performance';ttitle.textContent=active+' records';let ss=[...new Set(r.map(x=>x.Status).filter(Boolean))];filter.innerHTML='<option>All</option>'+ss.map(x=>'<option>'+x+'</option>').join('');charts();table()}function charts(){let r=data[active]||[],n=numeric(r)[0],labs=r.map((x,i)=>x[Object.keys(x)[0]]||'Record '+(i+1));if(bar)bar.destroy();bar=new Chart(chart,{type:type.value,data:{labels:labs,datasets:[{data:n?r.map(x=>x[n]):r.map((_,i)=>i+1),backgroundColor:type.value==='bar'?'#d12a31':'#d12a3122',borderColor:'#d12a31',borderWidth:2,borderRadius:6,fill:type.value==='line',tension:.35}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:10}}},y:{grid:{color:'#eef2f7'},ticks:{font:{size:10}}}}}});let c={};r.forEach(x=>{let s=x.Status||'Active';c[s]=(c[s]||0)+1});let colors=['#d12a31','#f06428','#d6a13b','#8d5754'];if(donut)donut.destroy();donut=new Chart(pie,{type:'doughnut',data:{labels:Object.keys(c),datasets:[{data:Object.values(c),backgroundColor:colors,borderColor:'#fff',borderWidth:3,cutout:'66%'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}}});legend.innerHTML=Object.entries(c).map(([x,y],i)=>'<div><span><i class="dot" style="background:'+colors[i]+'"></i>'+x+'</span><b>'+y+' records</b></div>').join('')}function table(){let r=data[active].filter(x=>(filter.value==='All'||x.Status===filter.value)&&Object.values(x).join(' ').toLowerCase().includes(search.value.toLowerCase())),ks=Object.keys(data[active][0]||{});document.getElementById('table').innerHTML='<table><thead><tr>'+ks.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+r.map(x=>'<tr data-id="'+data[active].indexOf(x)+'">'+ks.map(k=>k==='Status'?'<td><b class="status '+state(x[k])+'">'+x[k]+'</b></td>':'<td contenteditable data-k="'+k+'">'+x[k]+'</td>').join('')+'</tr>').join('')+'</tbody></table>';document.querySelectorAll('td[contenteditable]').forEach(x=>x.onblur=e=>{let v=e.target.textContent;data[active][e.target.parentElement.dataset.id][e.target.dataset.k]=isNaN(+v)||!v.trim()?v:+v;charts()});foot.textContent='Showing '+r.length+' of '+data[active].length+' records · Click any value to edit'}file.onchange=e=>{let rd=new FileReader();rd.onload=z=>{let wb=XLSX.read(z.target.result,{type:'array'}),o={};wb.SheetNames.forEach(s=>{let r=XLSX.utils.sheet_to_json(wb.Sheets[s],{defval:''});if(r.length)o[s]=r});if(!Object.keys(o).length)return show('No data rows found');data=o;buildNav();page(Object.keys(o)[0]);show(Object.keys(o).length+' worksheet(s) imported')};rd.readAsArrayBuffer(e.target.files[0])};function exportXlsx(){let w=XLSX.utils.book_new();Object.entries(data).forEach(([n,r])=>XLSX.utils.book_append_sheet(w,XLSX.utils.json_to_sheet(r),n.slice(0,31)));XLSX.writeFile(w,'Digital-IT-Hub.xlsx');show('Excel workbook exported')}function exportPpt(){let p=new PptxGenJS(),s=p.addSlide(),r=data[active],ks=Object.keys(r[0]||{});s.background={color:'F4F7FB'};s.addText('Digital IT Hub – '+active,{x:.5,y:.4,w:9,h:.4,fontSize:22,bold:true,color:'101A35'});s.addTable([ks,...r.slice(0,8).map(x=>ks.map(k=>String(x[k])))],{x:.5,y:1.2,w:9,h:4.5,fontSize:10});p.writeFile({fileName:'Digital-IT-Hub-'+active+'.pptx'});show('PowerPoint export started')}function save(){localStorage.setItem('itHubData',JSON.stringify(data));show('Changes saved in this browser')}try{data=JSON.parse(localStorage.getItem('itHubData'))||data}catch(e){}buildNav();active=Object.keys(data)[0];


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


(function(){
 const brand=document.querySelector('.brand'); if(brand) brand.innerHTML='<i><img src="logo.png" alt="Digital IT Hub logo"></i><span><strong>Nature A</strong><small>Digital Hub</small></span>';
 const ppt=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('PowerPoint')); if(ppt)ppt.remove();
 const actions=document.querySelector('.actions'); if(actions){const toggle=document.createElement('button');toggle.className='btn theme-toggle';toggle.innerHTML='<b id="themeText">Light</b><span class="switch"><i></i></span>';toggle.onclick=window.toggleTheme;actions.prepend(toggle)}
 function palette(){const dark=document.body.classList.contains('dark');if(window.bar){bar.data.datasets[0].backgroundColor=bar.config.type==='line'?(dark?'#ff8d5b33':'#d12a3122'):(dark?'#f56f3d':'#d12a31');bar.data.datasets[0].borderColor=dark?'#ff9365':'#d12a31';bar.update()}if(window.donut){donut.data.datasets[0].backgroundColor=dark?['#ff8b57','#f2c266','#dc5b63','#9f6f39']:['#d12a31','#f06428','#d6a13b','#8b555b'];donut.data.datasets[0].borderColor=dark?'#32171e':'#fff';donut.update()}}
 window.toggleTheme=function(){document.body.classList.toggle('dark');localStorage.setItem('itHubTheme',document.body.classList.contains('dark')?'dark':'light');document.getElementById('themeText').textContent=document.body.classList.contains('dark')?'Dark':'Light';palette()};
 if(localStorage.getItem('itHubTheme')==='dark') document.body.classList.add('dark'); document.getElementById('themeText').textContent=document.body.classList.contains('dark')?'Dark':'Light';palette();
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
 /* Documents is intentionally never shown as a dashboard section. */
 delete data.Documents;
 try { const saved=JSON.parse(localStorage.getItem('itHubData')||'{}'); if(saved.Documents){delete saved.Documents;localStorage.setItem('itHubData',JSON.stringify(saved))} } catch(e) {}
 buildNav(); if(active==='Documents') page('Dashboard'); else page(active);
 function applyProfessionalCharts(){
   const dark=document.body.classList.contains('dark');
   const colors=dark?['#ff8452','#f7c66a','#d85962','#a57943','#d98957','#c75b71','#e2af4d']:['#d12a31','#f06428','#d6a13b','#8d5754','#e48654','#b94958','#c89435'];
   if(window.bar){const set=bar.data.datasets[0],ctx=bar.ctx,g=ctx.createLinearGradient(0,0,0,bar.height);g.addColorStop(0,dark?'#ff9569':'#d12a31');g.addColorStop(1,dark?'#cc4e40':'#f4a044');set.backgroundColor=bar.config.type==='line'?(dark?'rgba(255,132,82,.16)':'rgba(209,42,49,.12)'):g;set.borderColor=dark?'#ff9569':'#d12a31';set.pointBackgroundColor='#f3ad4a';set.pointBorderColor=dark?'#32171e':'#fffaf7';set.pointRadius=4;set.pointHoverRadius=7;set.borderWidth=3;bar.update()}
   if(window.donut){donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>colors[i%colors.length]);donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf7';donut.data.datasets[0].borderWidth=5;donut.options.plugins.brandCentre={label:'STATUS',value:donut.data.datasets[0].data.reduce((a,b)=>a+b,0),dark};donut.update();legend.innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+colors[i%colors.length]+'"></i>'+label+'</span><b>'+donut.data.datasets[0].data[i]+' records</b></div>').join('')}
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
   if(typeof donut!=='undefined'&&donut){const values=donut.data.datasets[0].data;donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>palette[i%palette.length]);donut.data.datasets[0].borderColor=dark?'#32171e':'#fffaf7';donut.data.datasets[0].borderWidth=5;donut.options.plugins.brandCentre={total:values.reduce((a,b)=>a+b,0),dark};donut.update();legend.innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+palette[i%palette.length]+'"></i>'+label+'</span><b>'+values[i]+' records</b></div>').join('')}
 }
 /* Any edit to the table now refreshes KPI cards, the line/bar chart, and the pie chart. */
 document.addEventListener('focusout',event=>{if(event.target.matches('td[contenteditable]'))setTimeout(()=>{render();syncDashboardVisuals()},0)});
 const chartFunction=window.charts;window.charts=function(){chartFunction();syncDashboardVisuals()};
 const themeFunction=window.toggleTheme;window.toggleTheme=function(){themeFunction();syncDashboardVisuals()};
 syncDashboardVisuals();
})();



(function(){
 const allowed=['Dashboard','Manpower','Expenses','Microsoft 365'];
 const pagesBase=location.hostname.endsWith('.github.io')?'/NatureA-DigitalHub':''; const routes=pagesBase?{'Dashboard':'#/','Manpower':'#/manpower','Expenses':'#/expenses','Microsoft 365':'#/microsoft-365'}:{'Dashboard':'/dashboard','Manpower':'/manpower','Expenses':'/expenses','Microsoft 365':'/microsoft-365'};
 const routePages=Object.fromEntries(Object.entries(routes).map(([page,path])=>[path.toLowerCase(),page]));const routeKey=()=>pagesBase?(location.hash.toLowerCase()||'#/'):location.pathname.toLowerCase();
 const icons={'Dashboard':'🏠','Manpower':'👥','Expenses':'💰','Microsoft 365':'<img src="microsoft-365.png?v=4" alt="" width="21" height="21">'};
 function limitPages(){
   const clean={};allowed.forEach(name=>{clean[name]=Array.isArray(data[name])?data[name]:(Array.isArray(sample[name])?JSON.parse(JSON.stringify(sample[name])):[])});data=clean;
   try{const saved=JSON.parse(localStorage.getItem('itHubData')||'{}'),savedClean={};allowed.forEach(name=>{savedClean[name]=Array.isArray(saved[name])?saved[name]:clean[name]});localStorage.setItem('itHubData',JSON.stringify(savedClean))}catch(e){}
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
     bar.options.plugins.tooltip={backgroundColor:dark?'#fff4ed':'#3b2024',titleColor:dark?'#32171e':'#fff',bodyColor:dark?'#32171e':'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1};
     bar.update('none');
   }
   if(window.donut){
     const values=donut.data.datasets[0].data;
     donut.data.datasets[0].backgroundColor=donut.data.labels.map((_,i)=>status[i%status.length]);donut.data.datasets[0].borderColor=card;donut.data.datasets[0].borderWidth=5;
     donut.options.plugins.brandCentre={total:values.reduce((a,b)=>a+b,0),dark};
     donut.options.plugins.tooltip={backgroundColor:dark?'#fff4ed':'#3b2024',titleColor:dark?'#32171e':'#fff',bodyColor:dark?'#32171e':'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1};
     donut.update('none');legend.innerHTML=donut.data.labels.map((label,i)=>'<div><span><i class="dot" style="background:'+status[i%status.length]+'"></i>'+label+'</span><b>'+values[i]+' records</b></div>').join('');
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
  {Company:'Nature Allliance','Total Account':151,'Business Basic':95,'Business Standard':43,'Premium P1':4,'E3 (No Team)':0,F1:1,'Defender for Business':1,'Defender for Office (Plan 1)':4,'Defender for Office (Plan 2)':1,'Power BI Pro':1,'Exchange Online Archiving':1},
  {Company:'Innobuilder','Total Account':73,'Business Basic':50,'Business Standard':23,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Nature Valley','Total Account':32,'Business Basic':18,'Business Standard':14,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'PIP Myanmar','Total Account':48,'Business Basic':35,'Business Standard':13,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Prime Asset','Total Account':4,'Business Basic':1,'Business Standard':3,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Kuthen Estate','Total Account':5,'Business Basic':3,'Business Standard':2,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Solid Alliance','Total Account':1,'Business Basic':0,'Business Standard':1,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Nature Build','Total Account':1,'Business Basic':0,'Business Standard':1,'Premium P1':0,'E3 (No Team)':0,F1:0,'Defender for Business':0,'Defender for Office (Plan 1)':0,'Defender for Office (Plan 2)':0,'Power BI Pro':0,'Exchange Online Archiving':0},
  {Company:'Total','Total Account':342,'Business Basic':209,'Business Standard':109,'Premium P1':5,'E3 (No Team)':3,F1:1,'Defender for Business':1,'Defender for Office (Plan 1)':8,'Defender for Office (Plan 2)':2,'Power BI Pro':3,'Exchange Online Archiving':1}
 ];
 const licenseDefaults=[
  {Licenses:'Exchange Online Archiving',Features:'Add-on','Total Licenses':2,'Active Users':1,'Available License':1},
  {Licenses:'Business Basic',Features:'Business','Total Licenses':215,'Active Users':209,'Available License':6},
  {Licenses:'Business Standard',Features:'Business','Total Licenses':115,'Active Users':109,'Available License':6},
  {Licenses:'E3 (No Team)',Features:'Enterprise','Total Licenses':3,'Active Users':3,'Available License':0},
  {Licenses:'F1',Features:'Frontline','Total Licenses':3,'Active Users':1,'Available License':2},
  {Licenses:'Defender for Business',Features:'Security Add-on','Total Licenses':3,'Active Users':1,'Available License':2},
  {Licenses:'Defender for Office (Plan 1)',Features:'Security Add-on','Total Licenses':8,'Active Users':8,'Available License':0},
  {Licenses:'Defender for Office (Plan 2)',Features:'Security Add-on','Total Licenses':3,'Active Users':2,'Available License':1},
  {Licenses:'Premium P1',Features:'Identity / Security','Total Licenses':5,'Active Users':5,'Available License':0},
  {Licenses:'Power BI Pro',Features:'Analytics','Total Licenses':3,'Active Users':3,'Available License':0},
  {Licenses:'Total',Features:'','Total Licenses':360,'Active Users':342,'Available License':18}
 ];
 const clone=x=>JSON.parse(JSON.stringify(x));
 function validCompany(rows){return Array.isArray(rows)&&rows.length&&Object.prototype.hasOwnProperty.call(rows[0],'Company')}
 function loadCompany(){try{const saved=JSON.parse(localStorage.getItem('m365CompanyDB'));if(validCompany(saved))return saved}catch(e){}return clone(companyDefaults)}
 function loadLicenses(){try{const saved=JSON.parse(localStorage.getItem('m365LicensesDB'));if(Array.isArray(saved)&&saved.length&&saved[0].Licenses)return saved}catch(e){}return clone(licenseDefaults)}
 let licenseRows=loadLicenses();
 data['Microsoft 365']=loadCompany();
 function escCell(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
 function renderLicenses(){
  let card=document.getElementById('m365LicenseCard');
  if(active!=='Microsoft 365'){if(card)card.remove();return}
  if(!card){card=document.createElement('section');card.id='m365LicenseCard';card.className='card tablecard';document.querySelector('.tablecard').after(card)}
  const keys=Object.keys(licenseRows[0]||{});
  card.innerHTML='<div class="head"><div><h2>License Summary</h2><div class="table-note">LicensesDB · '+(licenseRows.length-1)+' license types</div></div></div><div class="table-scroll"><table><thead><tr>'+keys.map(k=>'<th>'+escCell(k)+'</th>').join('')+'</tr></thead><tbody>'+licenseRows.map((row,index)=>'<tr data-index="'+index+'" class="'+(row.Licenses==='Total'?'total-row':'')+'">'+keys.map(k=>'<td '+(row.Licenses==='Total'?'':'contenteditable data-key="'+escCell(k)+'"')+'>'+escCell(row[k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="foot">Showing '+(licenseRows.length-1)+' license records plus totals · Click a value to edit</div>';
  card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),raw=event.target.textContent.trim();licenseRows[+tr.dataset.index][event.target.dataset.key]=raw!==''&&!isNaN(+raw)?+raw:raw;localStorage.setItem('m365LicensesDB',JSON.stringify(licenseRows));charts()});
 }
 const baseTable=window.table;
 window.table=function(){baseTable();if(active==='Microsoft 365'){ttitle.textContent='Company License Allocation';const rows=document.querySelectorAll('#table tbody tr');if(rows.length){const last=rows[rows.length-1];last.classList.add('total-row');last.querySelectorAll('[contenteditable]').forEach(cell=>cell.removeAttribute('contenteditable'))}renderLicenses()}else{renderLicenses()}};
 const basePage=window.page;
 window.page=function(name){if(name==='Microsoft 365'&&!validCompany(data[name]))data[name]=loadCompany();basePage(name);if(name==='Microsoft 365'){ttitle.textContent='Company License Allocation';renderLicenses()}};
 const saveButton=document.querySelector('.btn.primary');if(saveButton)saveButton.addEventListener('click',()=>{if(active==='Microsoft 365'){localStorage.setItem('m365CompanyDB',JSON.stringify(data['Microsoft 365']));localStorage.setItem('m365LicensesDB',JSON.stringify(licenseRows))}});
 window.exportXlsx=function(){
  const tables=[...document.querySelectorAll(active==='Microsoft 365'?'#table table,#m365LicenseCard table':'#table table')];if(!tables.length)return show('No table data to export');
  const workbook=XLSX.utils.book_new();tables.forEach((table,index)=>{const sheet=XLSX.utils.table_to_sheet(table,{raw:true});XLSX.utils.book_append_sheet(workbook,sheet,active==='Microsoft 365'?(index===0?'CompanyDB':'LicensesDB'):active.slice(0,31))});
  XLSX.writeFile(workbook,'Nature-A-Digital-Hub-'+active.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'.xlsx');show((active==='Microsoft 365'?'Two tables':'Table')+' exported');
 };
 if(active==='Microsoft 365'){data['Microsoft 365']=loadCompany();render()}
})();



(function(){
 const licenseSeed=[{Licenses:'Exchange Online Archiving',Features:'Add-on','Total Licenses':2,'Active Users':1,'Available License':1},{Licenses:'Business Basic',Features:'Business','Total Licenses':215,'Active Users':209,'Available License':6},{Licenses:'Business Standard',Features:'Business','Total Licenses':115,'Active Users':109,'Available License':6},{Licenses:'E3 (No Team)',Features:'Enterprise','Total Licenses':3,'Active Users':3,'Available License':0},{Licenses:'F1',Features:'Frontline','Total Licenses':3,'Active Users':1,'Available License':2},{Licenses:'Defender for Business',Features:'Security Add-on','Total Licenses':3,'Active Users':1,'Available License':2},{Licenses:'Defender for Office (Plan 1)',Features:'Security Add-on','Total Licenses':8,'Active Users':8,'Available License':0},{Licenses:'Defender for Office (Plan 2)',Features:'Security Add-on','Total Licenses':3,'Active Users':2,'Available License':1},{Licenses:'Premium P1',Features:'Identity / Security','Total Licenses':5,'Active Users':5,'Available License':0},{Licenses:'Power BI Pro',Features:'Analytics','Total Licenses':3,'Active Users':3,'Available License':0},{Licenses:'Total',Features:'','Total Licenses':360,'Active Users':342,'Available License':18}];
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
 function title(icon,title,sub){return '<div class="m365-table-title"><span class="m365-title-icon">'+icon+'</span><div><h2>'+title+'</h2><p>'+sub+'</p></div></div>'}
 function renderCompany(){
  const rows=companies(),normal=rows.filter(row=>row.Company!=='Total').sort((a,b)=>(Number(b['Total Account'])||0)-(Number(a['Total Account'])||0)),total=rows.find(row=>row.Company==='Total'),keys=Object.keys(rows[0]||{}),q=(document.getElementById('m365CompanySearch')?.value||'').toLowerCase(),selected=document.getElementById('m365CompanyFilter')?.value||'All';
  const shown=normal.filter(row=>(selected==='All'||row.Company===selected)&&row.Company.toLowerCase().includes(q));
  document.querySelector('.tablecard .head').innerHTML=title('▦','Company License Distribution','LICENSE ALLOCATION SUMMARY')+'<div class="tools"><input id="m365CompanySearch" class="search m365-search" placeholder="Search company..." value="'+escapeHtml(q)+'"><select id="m365CompanyFilter" class="filter m365-filter"><option value="All">All companies</option>'+normal.map(row=>'<option '+(row.Company===selected?'selected':'')+'>'+escapeHtml(row.Company)+'</option>').join('')+'</select></div>';
  const display=shown.concat(total?[total]:[]);document.getElementById('table').innerHTML='<table class="m365-company-table"><thead><tr>'+keys.map(key=>'<th>'+escapeHtml(key)+'</th>').join('')+'</tr></thead><tbody>'+display.map(row=>{const index=rows.indexOf(row),isTotal=row.Company==='Total';return '<tr data-index="'+index+'" class="'+(isTotal?'total-row':'')+'">'+keys.map(key=>{const editable=!isTotal&&key!=='Total Account';return '<td class="'+(editable?'':'derived-cell')+'" '+(editable?'contenteditable data-key="'+escapeHtml(key)+'"':'')+'>'+escapeHtml(row[key])+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table>';foot.textContent='Showing '+shown.length+' of '+normal.length+' companies';
  document.getElementById('m365CompanySearch').oninput=renderCompany;document.getElementById('m365CompanyFilter').onchange=renderCompany;document.querySelectorAll('#table td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),raw=event.target.textContent.trim();rows[+tr.dataset.index][event.target.dataset.key]=raw!==''&&!isNaN(+raw)?+raw:raw;recalculate();renderCompany();renderLicenses();charts()});
 }
 function renderLicenses(){
  let card=document.getElementById('m365LicenseCard');if(!card){card=document.createElement('section');card.id='m365LicenseCard';card.className='card tablecard';document.querySelector('.tablecard').after(card)};
  const normal=licenses.filter(row=>row.Licenses!=='Total'),total=licenses.find(row=>row.Licenses==='Total'),keys=Object.keys(licenses[0]||{}),q=(document.getElementById('m365LicenseSearch')?.value||'').toLowerCase(),selected=document.getElementById('m365FeatureFilter')?.value||'All',features=[...new Set(normal.map(row=>row.Features))];
  const shown=normal.filter(row=>(selected==='All'||row.Features===selected)&&Object.values(row).join(' ').toLowerCase().includes(q));
  card.innerHTML='<div class="head">'+title('◫','Microsoft 365 License Utilization','LICENSE CAPACITY SUMMARY')+'<div class="tools"><input id="m365LicenseSearch" class="search m365-search" placeholder="Search licenses..." value="'+escapeHtml(q)+'"><select id="m365FeatureFilter" class="filter m365-filter"><option value="All">All features</option>'+features.map(feature=>'<option '+(feature===selected?'selected':'')+'>'+escapeHtml(feature)+'</option>').join('')+'</select></div></div><div class="table-scroll"><table><thead><tr>'+keys.map(key=>'<th>'+escapeHtml(key)+'</th>').join('')+'</tr></thead><tbody>'+shown.concat(total?[total]:[]).map(row=>{const index=licenses.indexOf(row),isTotal=row.Licenses==='Total';return '<tr data-index="'+index+'" class="'+(isTotal?'total-row':'')+'">'+keys.map(key=>{if(key==='Features'&&!isTotal)return '<td><span class="feature-badge feature-'+slug(row[key])+'">'+escapeHtml(row[key])+'</span></td>';const editable=!isTotal&&(key==='Licenses'||key==='Total Licenses');return '<td class="'+(editable?'':'derived-cell')+'" '+(editable?'contenteditable data-key="'+escapeHtml(key)+'"':'')+'>'+escapeHtml(row[key])+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div><div class="foot">Showing '+shown.length+' of '+normal.length+' licenses</div>';
  document.getElementById('m365LicenseSearch').oninput=renderLicenses;document.getElementById('m365FeatureFilter').onchange=renderLicenses;card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{const tr=event.target.closest('tr'),index=+tr.dataset.index,key=event.target.dataset.key,raw=event.target.textContent.trim(),previous=licenses[index][key];if(key==='Licenses'){if(!raw){event.target.textContent=previous;return}licenses[index][key]=raw;if(raw!==previous){companies().forEach(row=>{if(Object.prototype.hasOwnProperty.call(row,previous)){row[raw]=row[previous];delete row[previous]}})}}else licenses[index][key]=raw!==''&&!isNaN(+raw)?+raw:0;recalculate();renderCompany();renderLicenses();charts()});
 }
 const priorTable=window.table;window.table=function(){if(active!=='Microsoft 365'){const card=document.getElementById('m365LicenseCard');if(card)card.remove();return priorTable()}recalculate();renderCompany();renderLicenses()};
 const priorPage=window.page;window.page=function(name){priorPage(name);if(name==='Microsoft 365'){recalculate();renderCompany();renderLicenses()}};
 const saveButton=document.querySelector('.btn.primary');if(saveButton)saveButton.addEventListener('click',()=>{if(active==='Microsoft 365')recalculate()});
 recalculate();if(active==='Microsoft 365'){renderCompany();renderLicenses();charts()}
})();



(function(){
 const icons={company:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M3 21h18M5 21V7l7-4v18M12 9h7v12M8 9h1M8 13h1M8 17h1M15 13h1M15 17h1"/></svg>',license:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h7"/></svg>',users:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',available:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg>'};
 function renderM365Kpis(){
  const kpiSection=document.querySelector('section.kpis');if(!kpiSection)return;kpiSection.id='kpis';
  if(active!=='Microsoft 365'){kpiSection.classList.remove('m365-kpis');return}
  let companies=[];try{companies=JSON.parse(localStorage.getItem('m365CompanyDB'))||data['Microsoft 365']||[]}catch(e){companies=data['Microsoft 365']||[]}
  let licenses=[];try{licenses=JSON.parse(localStorage.getItem('m365LicensesDB'))||[]}catch(e){}
  const companyCount=companies.filter(row=>row.Company&&row.Company!=='Total').length,total=licenses.find(row=>row.Licenses==='Total')||{};
  const cards=[['Total Companies',companyCount,icons.company,'Companies in the license portfolio'],['Total Licenses',Number(total['Total Licenses'])||0,icons.license,'Purchased Microsoft 365 capacity'],['Active Users',Number(total['Active Users'])||0,icons.users,'Licenses currently assigned'],['Available Licenses',Number(total['Available License'])||0,icons.available,'Capacity ready to assign']];
  kpiSection.classList.add('m365-kpis');kpiSection.innerHTML=cards.map(card=>'<article class="kpi"><div class="kt"><span>'+card[0]+'</span><b class="kpi-icon">'+card[2]+'</b></div><div class="num">'+card[1].toLocaleString()+'</div><div class="up kpi-context">'+card[3]+'</div></article>').join('');
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderM365Kpis()};
 const previousPage=window.page;window.page=function(name){previousPage(name);renderM365Kpis()};
 renderM365Kpis();
})();



(function(){
 function sync(){const pagesBase=location.hostname.endsWith('.github.io')?'/NatureA-DigitalHub':'',path=pagesBase?(location.hash.toLowerCase().slice(1)||'/'):location.pathname.toLowerCase(),names={'/':'Dashboard','/dashbaord':'Dashboard','/dashboard':'Dashboard','/manpower':'Manpower','/expenes':'Expenses','/expenses':'Expenses','/microsoft-365':'Microsoft 365'},current=names[path]||active;document.querySelectorAll('#nav button').forEach(button=>{const selected=(button.dataset.page||button.querySelector('.nav-text')?.textContent)===current;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false')})}
 window.addEventListener('pageshow',sync);window.addEventListener('popstate',sync);document.getElementById('nav').addEventListener('click',()=>queueMicrotask(sync));sync();
})();



(function(){
 const pagesBase=location.hostname.endsWith('.github.io')?'/NatureA-DigitalHub':''; const routes=pagesBase?{'Dashboard':'#/','Manpower':'#/manpower','Expenses':'#/expenses','Microsoft 365':'#/microsoft-365'}:{'Dashboard':'/dashboard','Manpower':'/manpower','Expenses':'/expenses','Microsoft 365':'/microsoft-365'};
 const routePages=Object.fromEntries(Object.entries(routes).map(([page,path])=>[path.toLowerCase(),page]));const routeKey=()=>pagesBase?(location.hash.toLowerCase()||'#/'):location.pathname.toLowerCase();
 const pageMeta={'Dashboard':['IT Management Overview','A complete view of your digital operations and performance.'],'Manpower':['Manpower','Digital team capacity and workload.'],'Expenses':['Expenses','Budget and IT spending overview.'],'Microsoft 365':['Microsoft 365','Company licensing, users, and subscription capacity.']};
 function syncNavigation(name){document.querySelectorAll('#nav button').forEach(button=>{const selected=(button.dataset.page||button.querySelector('.nav-text')?.textContent)===name;button.classList.toggle('active',selected);button.setAttribute('aria-current',selected?'page':'false');button.dataset.href=routes[button.dataset.page||button.querySelector('.nav-text')?.textContent]||''});document.querySelectorAll('#tabs button').forEach(button=>button.classList.toggle('active',button.textContent===name))}
 function restoreGenericTableShell(){const primary=document.querySelector('main > section.card.tablecard'),head=primary?.querySelector('.head');if(head&&!document.getElementById('search'))head.innerHTML='<h2 id="ttitle"></h2><div class="tools"><input class="search" id="search" oninput="table()" placeholder="Search records..."><select class="filter" id="filter" onchange="table()"></select></div>'}
 window.navigateHubPage=function(name,push=true){
  if(!routes[name])name='Dashboard';if(push&&routeKey()!==routes[name].toLowerCase())history.pushState({page:name},'',routes[name]);
  active=name;sessionStorage.setItem('itHubActive',name);crumb.textContent=name;h1.textContent=pageMeta[name][0];sub.textContent=pageMeta[name][1];side.classList.remove('open');
  if(name==='Microsoft 365'){ctitle.textContent='Microsoft 365 performance';table();charts()}else{restoreGenericTableShell();const pageSearch=document.getElementById('search');if(pageSearch)pageSearch.value='';render()}
  syncNavigation(name);document.title='Nature A Digital Hub · '+name;
 };
 document.querySelectorAll('#nav button').forEach(button=>{const name=button.dataset.page||button.querySelector('.nav-text')?.textContent;button.dataset.page=name;button.dataset.href=routes[name];button.onclick=()=>window.navigateHubPage(name,true)});
 document.querySelectorAll('#tabs button').forEach(button=>button.onclick=()=>window.navigateHubPage(button.textContent,true));
 window.addEventListener('popstate',()=>window.navigateHubPage(routePages[routeKey()]||'Dashboard',false));window.addEventListener('hashchange',()=>window.navigateHubPage(routePages[routeKey()]||'Dashboard',false));
 window.navigateHubPage(routePages[routeKey()]||active||'Dashboard',false);
})();



(function(){
 function renderCompanyRanking(){
  if(active!=='Microsoft 365'){type.disabled=false;chart.parentElement.style.height='250px';return}
  const rows=(data['Microsoft 365']||[]).filter(row=>row.Company&&row.Company!=='Total').sort((a,b)=>(Number(b['Total Account'])||0)-(Number(a['Total Account'])||0));
  chart.parentElement.style.height='350px';const selectedType=type.value==='line'?'line':'bar';type.disabled=false;const dark=document.body.classList.contains('dark'),text=dark?'#e8d1cc':'#806864',grid=dark?'#553137':'#eaded9',card=dark?'#32171e':'#fffaf7',ctx=chart.getContext('2d'),gradient=ctx.createLinearGradient(0,0,chart.clientWidth||700,0);
  gradient.addColorStop(0,dark?'#bf413d':'#c9252d');gradient.addColorStop(1,dark?'#ff986d':'#f4a044');
  const registered=Chart.getChart('chart');if(registered)registered.destroy();if(typeof bar!=='undefined'&&bar&&bar!==registered&&typeof bar.destroy==='function'){try{bar.destroy()}catch(e){}}type.disabled=false;
  bar=new Chart(chart,{type:selectedType,data:{labels:rows.map(row=>row.Company),datasets:[{label:'Total Accounts',data:rows.map(row=>Number(row['Total Account'])||0),backgroundColor:selectedType==='line'?(dark?'rgba(255,135,85,.10)':'rgba(209,42,49,.10)'):gradient,borderColor:dark?'#ff9a70':'#c9252d',borderWidth:1,borderRadius:7,barThickness:20,categoryPercentage:.72,barPercentage:.72,fill:selectedType==='line',tension:.34,pointRadius:selectedType==='line'?4:0,pointHoverRadius:selectedType==='line'?6:0}]},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutQuart'},plugins:{legend:{display:false},tooltip:{backgroundColor:dark?'#fff4ed':'#3b2024',titleColor:dark?'#32171e':'#fff',bodyColor:dark?'#32171e':'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1,callbacks:{label:context=>' '+context.raw.toLocaleString()+' accounts'}}},scales:{y:{offset:true,grid:{display:false},ticks:{padding:9,color:text,font:{family:'Poppins',size:10,weight:'600'}}},x:{beginAtZero:true,grid:{color:grid},ticks:{color:text,font:{family:'Poppins',size:10},precision:0},title:{display:true,text:'Total '+rows.reduce((sum,row)=>sum+(Number(row['Total Account'])||0),0).toLocaleString()+' accounts',color:text,font:{family:'Poppins',size:10,weight:'600'}}}}}});
  chart.dataset.orientation='horizontal-left-to-right';chart.dataset.source='Company,Total Account';chart.dataset.excludesTotal='true';chart.dataset.order='descending';ctitle.textContent='Company Account Distribution';const caption=ctitle.parentElement.querySelector('p');if(caption){caption.className='m365-chart-caption';caption.textContent='Comparative account allocation by company · Ranked highest to lowest'}
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderCompanyRanking()};
 const previousNavigate=window.navigateHubPage;if(previousNavigate)window.navigateHubPage=function(name,push=true){previousNavigate(name,push);renderCompanyRanking()};
 renderCompanyRanking();
})();



(function(){
 function licenseData(){try{return JSON.parse(localStorage.getItem('m365LicensesDB'))||[]}catch(e){return[]}}
 function renderLicenseAvailabilityPie(){
  if(active!=='Microsoft 365'){legend.classList.remove('m365-license-legend');pie.closest('.piegrid')?.classList.remove('m365-pie-layout');pie.closest('.card')?.classList.remove('m365-pie-card');return}
  const all=licenseData(),availableRows=all.filter(row=>row.Licenses&&row.Licenses!=='Total'&&(Number(row['Available License'])||0)>0).sort((a,b)=>(Number(b['Available License'])||0)-(Number(a['Available License'])||0)),current=document.getElementById('m365PieFilter')?.value||'All',selected=availableRows.some(row=>row.Licenses===current)?current:'All',rows=selected==='All'?availableRows:availableRows.filter(row=>row.Licenses===selected),displayTotal=rows.reduce((sum,row)=>sum+(Number(row['Available License'])||0),0),dark=document.body.classList.contains('dark');
  const colors=dark?['#ff8755','#f5c66b','#d85b64','#ad7d45','#8f6dde','#4eb4cd','#e28b9b']:['#d12a31','#f06428','#d6a13b','#8d5754','#7656b5','#3194ad','#bb6676'];
  const registered=Chart.getChart('pie');if(registered)registered.destroy();if(typeof donut!=='undefined'&&donut&&donut!==registered&&typeof donut.destroy==='function'){try{donut.destroy()}catch(e){}}
  donut=new Chart(pie,{type:'doughnut',data:{labels:rows.map(row=>row.Licenses),datasets:[{label:'Available Licenses',data:rows.map(row=>Number(row['Available License'])||0),backgroundColor:rows.map((_,index)=>colors[index%colors.length]),borderColor:dark?'#32171e':'#fffaf7',borderWidth:5,cutout:'66%'}]},options:{responsive:true,maintainAspectRatio:false,animation:{duration:900,easing:'easeOutQuart',animateRotate:true,animateScale:true},plugins:{legend:{display:false},brandCentre:{total:displayTotal,label:'LICENSES',dark},tooltip:{backgroundColor:dark?'#fff4ed':'#3b2024',titleColor:dark?'#32171e':'#fff',bodyColor:dark?'#32171e':'#fff',borderColor:dark?'#f5c66b':'#d12a31',borderWidth:1,callbacks:{label:context=>' '+context.raw.toLocaleString()+' available'}}}}});
  const pieCard=pie.closest('.card'),titleWrap=pieCard.querySelector('.title'),title=titleWrap.querySelector('h2'),caption=titleWrap.querySelector('p');title.textContent='Available Licenses';caption.className='m365-pie-caption';caption.textContent=selected==='All'?'Unassigned Microsoft 365 Licenses':'Availability for '+selected;
  titleWrap.querySelector('#m365PieFilter')?.remove();if(availableRows.length){const filter=document.createElement('select');filter.id='m365PieFilter';filter.className='select m365-pie-filter';filter.innerHTML='<option value="All">All licenses</option>'+availableRows.map(row=>'<option value="'+row.Licenses.replace(/"/g,'&quot;')+'" '+(row.Licenses===selected?'selected':'')+'>'+row.Licenses+'</option>').join('');filter.onchange=renderLicenseAvailabilityPie;titleWrap.append(filter)}
  legend.classList.add('m365-license-legend');legend.innerHTML=rows.length?rows.map((row,index)=>'<div><span class="m365-license-name"><i class="dot" style="background:'+colors[index%colors.length]+'"></i>'+row.Licenses+'</span><b class="m365-license-availability"><strong>'+Number(row['Available License']).toLocaleString()+'</strong><small>available</small></b></div>').join(''):'<div class="m365-no-licenses"><span>All licenses are fully assigned</span><b class="m365-license-availability"><strong>0</strong><small>available</small></b></div>';
  pie.dataset.source='Licenses,Available License';pie.dataset.zeroAvailability='omitted';pie.dataset.availableTotal=String(displayTotal);pie.dataset.sort='highest-to-lowest';pie.dataset.filter=selected;pie.closest('.piegrid').classList.add('m365-pie-layout');pieCard.classList.add('m365-pie-card');
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



(function(){
 const icons={
  total:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2.2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V21"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2.2a4 4 0 0 0-3-3.8M16.5 3.2a4 4 0 0 1 0 7.6"/></svg>',
  current:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 11l2 2 4-5"/></svg>',
  vacant:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>',
  capacity:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 19a8 8 0 1 1 16 0"/><path d="m12 15 4-5"/><path d="M7 19h10"/></svg>'
 };
 function renderManpowerKpis(){
  const section=document.querySelector('section.kpis');if(!section)return;
  section.classList.remove('manpower-kpis');
  if(active!=='Manpower')return;
  const cards=[
   ['Current Manpower','8',icons.current,'Active team members'],
   ['Planned Headcount','12',icons.total,'Target workforce capacity'],
   ['Hiring Vacancies','4',icons.vacant,'Roles open for hiring'],
   ['Workforce Capacity','67%',icons.capacity,'Positions currently filled']
  ];
  section.classList.remove('m365-kpis');section.classList.add('manpower-kpis');
  section.innerHTML=cards.map(card=>'<article class="kpi"><div class="kt"><span>'+card[0]+'</span><b class="kpi-icon">'+card[2]+'</b></div><div class="num">'+card[1]+'</div><div class="up kpi-context">'+card[3]+'</div></article>').join('');
 }
 const previousCharts=window.charts;window.charts=function(){previousCharts();renderManpowerKpis()};
 const previousPage=window.page;window.page=function(name){previousPage(name);renderManpowerKpis()};
 const previousNavigate=window.navigateHubPage;if(previousNavigate)window.navigateHubPage=function(name,push=true){previousNavigate(name,push);renderManpowerKpis()};
 renderManpowerKpis();
})();



document.addEventListener('beforeinput',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],#m365LicenseCard tbody td:first-child[contenteditable]'))event.target.classList.add('is-editing')},true);
document.addEventListener('keydown',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],#m365LicenseCard tbody td:first-child[contenteditable]')&&['Backspace','Delete'].includes(event.key))event.target.classList.add('is-editing')},true);
document.addEventListener('focusout',event=>{if(event.target.matches('.m365-company-table tbody td:first-child[contenteditable],#m365LicenseCard tbody td:first-child[contenteditable]'))event.target.classList.remove('is-editing')},true);



(function(){const selector='.m365-company-table tbody td:first-child[contenteditable],#m365LicenseCard tbody td:first-child[contenteditable]';document.addEventListener('pointerdown',event=>{const cell=event.target.closest(selector);if(!cell)return;document.querySelectorAll(selector+'.is-click-focused').forEach(item=>item.classList.remove('is-click-focused'));cell.classList.add('is-click-focused')},true);document.addEventListener('focusout',event=>{if(event.target.matches(selector))event.target.classList.remove('is-click-focused')},true);document.addEventListener('pointerdown',event=>{if(!event.target.closest(selector))document.querySelectorAll(selector+'.is-click-focused').forEach(item=>item.classList.remove('is-click-focused'))})})();



(function(){const selector='.m365-company-table tbody td:first-child[contenteditable],#m365LicenseCard tbody td:first-child[contenteditable]';function clear(cell){cell.classList.remove('is-click-focused');cell.style.removeProperty('outline');cell.style.removeProperty('outline-offset');cell.style.removeProperty('box-shadow');cell.style.removeProperty('z-index');cell.style.removeProperty('caret-color')}function activate(cell){document.querySelectorAll('.m365-company-table tbody td:first-child[contenteditable].is-click-focused,#m365LicenseCard tbody td:first-child[contenteditable].is-click-focused').forEach(item=>{if(item!==cell)clear(item)});cell.classList.add('is-click-focused');cell.style.setProperty('box-shadow',document.body.classList.contains('dark')?'inset 0 0 0 2px rgba(244,160,68,.55)':'inset 0 0 0 2px rgba(209,42,49,.28)','important');cell.style.setProperty('z-index','55','important');cell.style.setProperty('caret-color',document.body.classList.contains('dark')?'#ff9a70':'#d12a31','important');cell.focus({preventScroll:true})}document.addEventListener('pointerdown',event=>{const cell=event.target.closest(selector);if(cell)activate(cell);else document.querySelectorAll('.m365-company-table tbody td:first-child[contenteditable].is-click-focused,#m365LicenseCard tbody td:first-child[contenteditable].is-click-focused').forEach(clear)},true);document.addEventListener('focusout',event=>{if(!event.target.matches(selector))return;setTimeout(()=>{if(document.activeElement!==event.target)clear(event.target)},0)},true)})();



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
 const card=document.querySelector('main>section.card.tablecard');if(!card)return;
 const currentSearch=document.getElementById('manpowerSearch')?.value||'',currentDivision=document.getElementById('manpowerDivisionFilter')?.value||'All',divisions=[...new Set(rows.map(row=>row.Division))],shown=rows.filter(row=>(currentDivision==='All'||row.Division===currentDivision)&&Object.values(row).join(' ').toLowerCase().includes(currentSearch.toLowerCase())),keys=['Employee','Position','Division','Role Level'];
 card.innerHTML='<div class="manpower-table-head"><div class="manpower-table-title"><span class="manpower-table-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg></span><div><h2>Digital Workforce Directory</h2><p>People, Roles and Structure</p></div></div><div class="manpower-table-tools"><input id="manpowerSearch" class="search" placeholder="Search employees..." value="'+esc(currentSearch)+'"><select id="manpowerDivisionFilter" class="filter"><option value="All">All divisions</option>'+divisions.map(item=>'<option '+(item===currentDivision?'selected':'')+'>'+esc(item)+'</option>').join('')+'</select></div></div><div class="manpower-table-wrap"><table class="manpower-directory-table"><thead><tr>'+keys.map(key=>'<th>'+esc(key)+'</th>').join('')+'</tr></thead><tbody>'+shown.map(row=>'<tr data-index="'+rows.indexOf(row)+'">'+keys.map(key=>key==='Role Level'?'<td class="role-level-cell" contenteditable data-key="Role Level"><span class="role-badge" data-level="'+esc(row[key])+'">'+esc(row[key])+'</span></td>':'<td contenteditable data-key="'+esc(key)+'">'+esc(row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="manpower-directory-foot">Showing '+shown.length+' of '+rows.length+' employees</div>';
 document.getElementById('manpowerSearch').oninput=renderDirectory;document.getElementById('manpowerDivisionFilter').onchange=renderDirectory;
 card.querySelectorAll('td[contenteditable]').forEach(cell=>cell.onblur=event=>{rows[+event.target.closest('tr').dataset.index][event.target.dataset.key]=event.target.textContent.trim();localStorage.setItem('manpowerDirectoryDB',JSON.stringify(rows));renderDirectory()});
}
const previousNavigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){document.body.classList.toggle('manpower-page',name==='Manpower');previousNavigate(name,push);if(name==='Manpower')renderDirectory()};
const previousPage=window.page;window.page=function(name){document.body.classList.toggle('manpower-page',name==='Manpower');previousPage(name);if(name==='Manpower')renderDirectory()};
if(active==='Manpower')renderDirectory();
})();



(function(){function restoreSharedTable(){const card=document.querySelector('main>section.card.tablecard');if(!card)return;card.innerHTML='<div class="head"><h2 id="ttitle">Records</h2><div class="tools"><input class="search" id="search" oninput="table()" placeholder="Search records..."><select class="filter" id="filter" onchange="table()"></select></div></div><div id="table"></div><div class="foot" id="foot"></div>'}const previousNavigate=window.navigateHubPage;window.navigateHubPage=function(name,push=true){if(name!=='Manpower'&&document.body.classList.contains('manpower-page'))restoreSharedTable();previousNavigate(name,push)};const previousPage=window.page;window.page=function(name){if(name!=='Manpower'&&document.body.classList.contains('manpower-page'))restoreSharedTable();previousPage(name)}})();



window.exportXlsx=function(){
 let tables=[],names=[];
 if(active==='Manpower'){const table=document.querySelector('.manpower-directory-table');if(table){tables=[table];names=['Workforce']}}
 else if(active==='Microsoft 365'){tables=[...document.querySelectorAll('#table table,#m365LicenseCard table')];names=['CompanyDB','LicensesDB']}
 else{const table=document.querySelector('#table table');if(table){tables=[table];names=[active.slice(0,31)]}}
 if(!tables.length)return show('No table data to export');
 const workbook=XLSX.utils.book_new();tables.forEach((table,index)=>XLSX.utils.book_append_sheet(workbook,XLSX.utils.table_to_sheet(table,{raw:true}),names[index]||('Table '+(index+1))));
 const filePage=active.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');XLSX.writeFile(workbook,'Nature-A-Digital-Hub-'+filePage+'.xlsx');show((tables.length>1?tables.length+' tables':active+' table')+' exported');
};


(function(){
const tabs={structure:'Team Structure',onsite:'Site Coverage',scope:'Service Portfolio',future:'Workforce Proposal'};
const icons={structure:'<svg viewBox="0 0 24 24"><path d="M4 21V9l8-5 8 5v12M9 21v-6h6v6"/></svg>',onsite:'<svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>',scope:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',future:'<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6"/></svg>'};
let selected=sessionStorage.getItem('manpowerVisualTab')||'structure',charts=[];
function clearCharts(){charts.forEach(c=>{try{c.destroy()}catch(e){}});charts=[]}
function colors(){const dark=document.body.classList.contains('dark');return{dark,text:dark?'#d9c4c2':'#806864',grid:dark?'#553137':'#eaded9',red:dark?'#ff8755':'#d12a31',orange:dark?'#f5c66b':'#f06428',fill:dark?'rgba(255,135,85,.16)':'rgba(209,42,49,.10)'}}
function chart(id,type,labels,values,label){const el=document.getElementById(id);if(!el)return;const c=colors();charts.push(new Chart(el,{type,data:{labels,datasets:[{label,data:values,backgroundColor:type==='line'?c.fill:[c.red,c.orange,'#d6a13b','#7656b5','#3194ad','#16866a'],borderColor:c.red,borderWidth:2,borderRadius:6,fill:type==='line',tension:.34}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:type==='doughnut'?{}:{x:{grid:{display:false},ticks:{color:c.text,font:{family:'Poppins',size:9}}},y:{beginAtZero:true,grid:{color:c.grid},ticks:{color:c.text,font:{family:'Poppins',size:9},precision:0}}}}}))}
function nav(){return '<nav class="manpower-planning-tabs">'+Object.entries(tabs).map(([k,v])=>'<button class="manpower-planning-tab '+(k===selected?'active':'')+'" data-tab="'+k+'">'+icons[k]+'<span>'+v+'</span></button>').join('')+'</nav>'}
function structure(){return '<div class="planning-visual-heading"><div><h2>Digital Department Structure &amp; Responsibility Matrix</h2><p>Reporting framework, functional ownership and accountability</p></div><span class="sample-chip">Sample Data</span></div><div class="visual-kpis"><div class="visual-kpi"><span>Team Members</span><strong>9</strong></div><div class="visual-kpi"><span>Leadership</span><strong>2</strong></div><div class="visual-kpi"><span>Infrastructure</span><strong>6</strong></div><div class="visual-kpi"><span>Engineering</span><strong>1</strong></div></div><div class="visual-grid"><section class="visual-panel"><h3>Reporting Structure</h3><p>Current department hierarchy</p><div class="org-chart"><div class="org-level"><div class="org-node primary"><b>Director</b><small>Digital Strategy & Governance</small></div></div><div class="org-level"><div class="org-node"><b>IT Manager</b><small>Operations & Delivery</small></div></div><div class="org-level team"><div class="org-node"><b>Infrastructure</b><small>6 team members</small></div><div class="org-node"><b>Software Development</b><small>1 engineer</small></div><div class="org-node"><b>Service Support</b><small>Shared responsibility</small></div></div></div></section><section class="visual-panel"><h3>Workforce Distribution</h3><p>Team composition by function</p><div class="visual-chart"><canvas id="structureChart"></canvas></div></section></div>'}
function onsite(){return '<div class="planning-visual-heading"><div><h2>On-Site Support Coverage</h2><p>Resource presence across supported locations</p></div><span class="sample-chip">Sample Data</span></div><div class="visual-kpis"><div class="visual-kpi"><span>Covered Sites</span><strong>5</strong></div><div class="visual-kpi"><span>Active Assignments</span><strong>4</strong></div><div class="visual-kpi"><span>Planned Coverage</span><strong>1</strong></div><div class="visual-kpi"><span>Full-Time Coverage</span><strong>2</strong></div></div><div class="visual-grid"><section class="visual-panel"><h3>Coverage Model</h3><p>Assignments by coverage type</p><div class="visual-chart"><canvas id="onsiteChart"></canvas></div></section><section class="visual-panel"><h3>Supported Locations</h3><p>Current service presence</p><div class="site-cards"><div class="site-card"><div><b>Head Office</b><span>Core infrastructure & applications</span></div><em class="visual-pill">Full-time</em></div><div class="site-card"><div><b>AIP Office</b><span>Network & endpoint support</span></div><em class="visual-pill orange">Scheduled</em></div><div class="site-card"><div><b>PIP Myanmar</b><span>Microsoft 365 & user support</span></div><em class="visual-pill orange">Scheduled</em></div><div class="site-card"><div><b>Nature Valley</b><span>Identity & device services</span></div><em class="visual-pill red">Planned</em></div></div></section></div>'}
function scope(){return '<div class="planning-visual-heading"><div><h2>Digital Service Portfolio</h2><p>Operational ownership and service coverage</p></div><span class="sample-chip">Sample Data</span></div><div class="visual-grid"><section class="visual-panel"><h3>Service Coverage Trend</h3><p>Relative capability maturity</p><div class="visual-chart"><canvas id="scopeChart"></canvas></div></section><section class="visual-panel"><h3>Core Services</h3><p>Current digital service portfolio</p><div class="scope-cards"><div class="scope-card"><b>IT Governance</b><span>Strategy, policy, risk and investment</span></div><div class="scope-card"><b>Infrastructure</b><span>Network, servers, cloud and availability</span></div><div class="scope-card"><b>Microsoft 365</b><span>Identity, licensing and collaboration</span></div><div class="scope-card"><b>Software Engineering</b><span>Applications, integration and automation</span></div><div class="scope-card"><b>Cybersecurity</b><span>Protection, monitoring and response</span></div><div class="scope-card"><b>Service Support</b><span>Users, devices, requests and assets</span></div></div></section></div>'}
function future(){return '<div class="planning-visual-heading"><div><h2>Proposed Digital Workforce Model</h2><p>Recommended capabilities and phased team growth</p></div><span class="sample-chip">Proposal Data</span></div><div class="visual-kpis"><div class="visual-kpi"><span>Proposed Roles</span><strong>8</strong></div><div class="visual-kpi"><span>Priority Roles</span><strong>3</strong></div><div class="visual-kpi"><span>New Capabilities</span><strong>4</strong></div><div class="visual-kpi"><span>Proposed Functions</span><strong>6</strong></div></div><div class="visual-grid"><section class="visual-panel"><h3>Proposed Workforce Mix</h3><p>Recommended headcount by function</p><div class="visual-chart"><canvas id="futureChart"></canvas></div></section><section class="visual-panel"><h3>Capability Investment Roadmap</h3><p>Recommended roles for future growth</p><div class="future-cards"><div class="future-card"><div><b>Infrastructure Lead</b><span>Architecture & resilience</span></div><em class="visual-pill red">High</em></div><div class="future-card"><div><b>Cybersecurity Specialist</b><span>Risk & compliance</span></div><em class="visual-pill red">High</em></div><div class="future-card"><div><b>Cloud & M365 Administrator</b><span>Cloud & identity</span></div><em class="visual-pill orange">Medium</em></div><div class="future-card"><div><b>Service Desk Analysts</b><span>Support & knowledge</span></div><em class="visual-pill">Proposed</em></div></div></section></div>'}
const metricMeta={
'Team Members':['people','+3 planned'],'Leadership':['leadership','Governance'],'Infrastructure':['server','Core team'],'Engineering':['code','Development'],
'Covered Sites':['location','5 locations'],'Active Assignments':['active','Active'],'Planned Coverage':['calendar','Planned'],'Full-Time Coverage':['clock','Dedicated'],
'Proposed Roles':['briefcase','Proposal'],'Priority Roles':['flag','Priority'],'New Capabilities':['spark','Growth'],'Proposed Functions':['grid','Functions']};
const metricSvg={people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',leadership:'<path d="m12 3 7 4v5c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V7l7-4Z"/><path d="m9 12 2 2 4-4"/>',server:'<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',code:'<path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/>',location:'<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',active:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 12-4.9M16 19l2 2 4-5"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',flag:'<path d="M5 21V4M5 5h11l-2 4 2 4H5"/>',spark:'<path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'};
function enhanceMetrics(card){card.querySelectorAll('.visual-kpi').forEach((item,index)=>{const label=item.querySelector('span')?.textContent.trim(),meta=metricMeta[label]||['grid','Overview'];item.classList.add('metric-tone-'+((index%4)+1));item.insertAdjacentHTML('afterbegin','<i class="visual-kpi-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+metricSvg[meta[0]]+'</svg></i>');item.insertAdjacentHTML('beforeend','<em class="visual-kpi-badge">'+meta[1]+'</em>')})}
function render(){let card=document.getElementById('manpowerPlanningCard');if(!card){card=document.createElement('section');card.id='manpowerPlanningCard';card.className='card manpower-planning-card';const directory=document.querySelector('main>section.card.tablecard');if(directory)directory.after(card)}if(!card)return;card.hidden=active!=='Manpower';if(active!=='Manpower')return;clearCharts();card.innerHTML=nav()+'<div class="planning-visual-body">'+({structure:structure,onsite:onsite,scope:scope,future:future}[selected])()+'</div>';enhanceMetrics(card);card.querySelectorAll('.manpower-planning-tab').forEach(b=>b.onclick=()=>{selected=b.dataset.tab;sessionStorage.setItem('manpowerVisualTab',selected);render()});if(selected==='structure')chart('structureChart','doughnut',['Leadership','Infrastructure','Engineering'],[2,6,1],'Team Members');if(selected==='onsite')chart('onsiteChart','bar',['Full-time','Scheduled','On demand','Planned'],[2,2,1,1],'Assignments');if(selected==='scope')chart('scopeChart','line',['Governance','Infrastructure','M365','Software','Security','Support'],[70,95,88,65,78,92],'Coverage');if(selected==='future')chart('futureChart','bar',['Leadership','Infrastructure','Security','Cloud','Engineering','Support'],[1,1,1,1,2,2],'Headcount')}
function init(){const nav=window.navigateHubPage;window.navigateHubPage=function(n,p=true){nav(n,p);render()};const pg=window.page;window.page=function(n){pg(n);render()};const toggle=window.toggleTheme;window.toggleTheme=function(){toggle();render()};const t=document.querySelector('.theme-toggle');if(t)t.onclick=window.toggleTheme;render()}
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
