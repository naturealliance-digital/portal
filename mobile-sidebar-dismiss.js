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
