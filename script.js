const toast=document.getElementById('toast');let timer;
function notify(message='Esta función estará disponible próximamente.'){toast.textContent=message;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),2300)}
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');notify('Sección visual: '+b.textContent)}));
document.querySelectorAll('.tile').forEach(t=>t.addEventListener('click',()=>notify('Vista previa de '+t.querySelector('h3').textContent)));
document.querySelectorAll('.quick-grid button').forEach(b=>b.addEventListener('click',()=>notify('Acceso: '+b.querySelector('span').textContent)));
document.getElementById('explore').addEventListener('click',()=>document.getElementById('tiles').scrollIntoView({behavior:'smooth'}));
document.getElementById('details').addEventListener('click',()=>notify('ÖG PLAY · Prototipo conceptual'));
