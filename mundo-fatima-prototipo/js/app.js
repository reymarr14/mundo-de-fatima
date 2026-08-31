let game = null;
const missions=[['🧸','Guardar los juguetes',10,5],['👟','Guardar los zapatos',5,3],['🎒','Preparar la mochila',10,5],['🪥','Cepillarse los dientes',5,3]].map((m,i)=>({id:i,...{icon:m[0],title:m[1],points:m[2],stars:m[3],done:false}}));
const rewards=[['🍦','Elegir el postre',30],['🎬','Elegir la película familiar',50],['🛝','Elegir un paseo',75],['🍕','Elegir la cena',100]];
const achievements=[['🌟','Primera misión','0 / 1',false],['🔥','Racha de 3','7 / 3',true],['🔥','Racha de 7','7 / 7',true],['🧹','Súper ayudante','0 / 25',false],['🌈','Semana perfecta','En progreso',false],['👑','Nivel 10','Nivel 4',false],['💯','100 misiones','0 / 100',false]];
function levelFromPoints(points){ return Math.floor(points/100)+1; }
const view=document.querySelector('#view');
function stats(){stars.textContent=game.stars;points.textContent=game.points;streak.textContent=game.streak}
function render(route='world'){view.innerHTML=route==='world'?world():route==='missions'?missionsView():route==='rewards'?rewardsView():route==='achievements'?achievementsView():character();document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.route===route));stats()}
function world(){let p=game.points%100;return `<section class="hero"><div class="sun"></div><div class="cloud c1">☁️</div><div class="cloud c2">☁️</div><div class="house">🏠</div><div class="fatima">👧</div><div class="garden">🌷 🌸 🦋 🌼</div></section><h1 class="title">🌈 El Mundo de Fátima</h1><p class="muted">¡Tu pequeño mundo está creciendo!</p><div class="card"><div style="display:flex;justify-content:space-between"><b>✨ Nivel ${levelFromPoints(game.points)}</b><b>${p} / 100 puntos</b></div><div class="progress"><div class="fill" style="width:${p}%"></div></div></div><h2 class="title">🎯 Misiones de hoy</h2>${missions.filter(m=>!m.done).slice(0,2).map(m=>`<article class="card mission"><div class="icon">${m.icon}</div><div><div class="name">${m.title}</div><div class="meta">✨ +${m.points} · ⭐ +${m.stars}</div></div><button class="action" onclick="render('missions')">VER</button></article>`).join('')||'<div class="card">🌟 ¡Todas las misiones están listas!</div>'}`}
function missionsView(){return `<h1 class="title">🎯 Misiones de hoy</h1><p class="muted">${missions.filter(m=>m.done).length} de ${missions.length} completadas</p><div class="list">${missions.map(m=>`<article class="card mission"><div class="icon">${m.icon}</div><div><div class="name">${m.title}</div><div class="meta">✨ +${m.points} puntos · ⭐ +${m.stars}</div></div><button class="action" ${m.done?'disabled':''} onclick="completeMission(${m.id})">${m.done?'✓ LISTA':'¡LA COMPLETÉ!'}</button></article>`).join('')}</div>`}
function completeMission(id){const m=missions[id];if(m.done)return;if(!confirm('¿Misión completada?'))return;m.done=true;game.points+=m.points;game.stars+=m.stars;game.missions_completed++;stats();celebrate('🎉','¡Misión completada!',`✨ +${m.points} puntos · ⭐ +${m.stars}`);render('missions')}
function rewardsView(){return `<h1 class="title">🎁 Premios</h1><div class="card"><b>⭐ Mis estrellas: ${game.stars}</b></div><div class="list">${rewards.map((r,i)=>`<article class="card reward"><div class="icon">${r[0]}</div><div><div class="name">${r[1]}</div><div class="meta">⭐ ${r[2]} estrellas</div></div><button class="action" ${game.stars<r[2]?'disabled':''} onclick="redeem(${i})">${game.stars>=r[2]?'¡LO QUIERO!':'Faltan ⭐'}</button></article>`).join('')}</div>`}
function redeem(i){const r=rewards[i];if(game.stars<r[2])return;if(!confirm('¿Canjear este premio?'))return;game.stars-=r[2];stats();celebrate('🎁','¡Premio conseguido!',`⭐ Usaste ${r[2]} estrellas`);render('rewards')}
function achievementsView(){return `<h1 class="title">🏆 Mis logros</h1><p class="muted">${achievements.filter(a=>a[3]).length} de ${achievements.length} conseguidos</p><div class="list">${achievements.map(a=>`<article class="card achievement"><div class="icon">${a[3]?a[0]:'🔒'}</div><div><div class="name">${a[1]}</div><div class="meta">${a[2]}</div></div><div>${a[3]?'✅':'🔒'}</div></article>`).join('')}</div>`}
function character(){return `<h1 class="title">👧 Mi personaje</h1><div class="card profile"><div class="avatar">👧</div><h2>✨ Nivel ${levelFromPoints(game.points)}</h2><p class="muted">¡Fátima sigue haciendo crecer su mundo!</p><div class="grid"><div class="quick">⭐<br><b>${game.stars}</b><br>Estrellas</div><div class="quick">✨<br><b>${game.points}</b><br>Puntos</div><div class="quick">🔥<br><b>${game.streak}</b><br>Días</div><div class="quick">🎯<br><b>${game.missions_completed}</b><br>Misiones</div></div></div>`}
function celebrate(icon,title,text){const c=document.querySelector('#celebration');c.innerHTML=`<div class="celebrate"><div class="big">${icon}</div><h2>${title}</h2><p>${text}</p><button class="action" onclick="this.closest('#celebration').classList.add('hidden')">¡GENIAL!</button></div>`;c.classList.remove('hidden')}
document.querySelectorAll('.bottom-nav button').forEach(b=>b.onclick=()=>render(b.dataset.route));
loadProfile();

// ---------- Perfil real de Fátima (tabla profiles) ----------
async function loadProfile(){
  view.innerHTML = `<div class="card">🌱 Cargando el mundo de Fátima...</div>`;
  const { data, error } = await supabaseClient.from('profiles').select('*').single();
  if(error || !data){
    view.innerHTML = `<div class="card">😕 No se pudo cargar el perfil.<br><small>${error?.message||''}</small></div>`;
    return;
  }
  game = data;
  render();
}

// ---------- Acceso de padres (Supabase Auth) ----------
let parentSession = null;
const parentBtn = document.querySelector('#parentBtn');
const parentModal = document.querySelector('#parentModal');

function closeParentModal(){ parentModal.classList.add('hidden'); parentModal.innerHTML=''; }

function loginForm(errorMsg){
  return `<div class="parent-panel">
    <h2>👨‍👩‍👧 Acceso de padres</h2>
    <p class="muted">Inicia sesión para administrar misiones, premios y logros.</p>
    ${errorMsg ? `<p class="error">${errorMsg}</p>` : ''}
    <input id="parentEmail" type="email" placeholder="Correo" autocomplete="username">
    <input id="parentPass" type="password" placeholder="Contraseña" autocomplete="current-password">
    <button class="action" id="parentLoginBtn">Ingresar</button>
    <button class="link" id="parentCancelBtn">Volver al Mundo de Fátima</button>
  </div>`;
}

function parentPanelPlaceholder(){
  return `<div class="parent-panel">
    <h2>👨‍👩‍👧 Panel de padres</h2>
    <p class="muted">Sesión iniciada. Aquí irán las herramientas para administrar misiones, premios y logros (próximo paso).</p>
    <button class="action" id="parentLogoutBtn">Cerrar sesión</button>
    <button class="link" id="parentCancelBtn">Volver al Mundo de Fátima</button>
  </div>`;
}

function attachLoginHandler(){
  parentModal.querySelector('#parentLoginBtn').onclick = async () => {
    const email = parentModal.querySelector('#parentEmail').value.trim();
    const password = parentModal.querySelector('#parentPass').value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if(error){
      parentModal.innerHTML = loginForm('Correo o contraseña incorrectos.');
      parentModal.querySelector('#parentCancelBtn').onclick = closeParentModal;
      attachLoginHandler();
      return;
    }
    parentSession = data.session;
    updateParentIcon();
    closeParentModal();
  };
}

function openParentModal(){
  parentModal.innerHTML = parentSession ? parentPanelPlaceholder() : loginForm();
  parentModal.classList.remove('hidden');
  parentModal.querySelector('#parentCancelBtn').onclick = closeParentModal;

  if(!parentSession){
    attachLoginHandler();
  } else {
    parentModal.querySelector('#parentLogoutBtn').onclick = async () => {
      await supabaseClient.auth.signOut();
      parentSession = null;
      updateParentIcon();
      closeParentModal();
    };
  }
}

function updateParentIcon(){ parentBtn.classList.toggle('logged', !!parentSession); }

parentBtn.onclick = openParentModal;

// Restaurar sesión si ya existía (persistSession) y escuchar cambios
supabaseClient.auth.getSession().then(({ data }) => { parentSession = data.session; updateParentIcon(); });
supabaseClient.auth.onAuthStateChange((_event, session) => { parentSession = session; updateParentIcon(); });
