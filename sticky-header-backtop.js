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
