document.addEventListener('DOMContentLoaded', () => {
  const dictionaryData = {
    'abal': 'Ciruela, ciruelo',
    'abalkan': 'Acedera',
    'aban': 'Matorral',
    'ajal': 'Despertar',
    'ajoskan': 'Planta orquidácea',
    'akam': 'Planta parásita',
    'akkúun': 'Asentar, cimentar',
    'aklax': 'Enano',
    'aktáan': 'Ante, delante, enfrente',
    'alab óol': 'Confianza; confiar',
    'bakche’': 'Instrumento para mazorca',
    'baknej': 'Insecto en el maíz tierno',
    'bak’': 'Carne',
    'bak’el iit': 'Nalga',
    'balak': 'Rodar'
  };

  const normalize = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const normalizedIndex = new Map();
  Object.keys(dictionaryData).forEach((k) => normalizedIndex.set(normalize(k), k));

  const pages = document.querySelectorAll('.page');
  const showPage = (id) => {
    pages.forEach((p) => p.classList.add('hidden'));
    const page = document.getElementById(id);
    if (page) page.classList.remove('hidden');
  };

  // Persistencia básica de perfil 
  function saveProfile(profile) {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }
  function getProfile() {
    return JSON.parse(localStorage.getItem('userProfile') || '{}');
  }

  // Actualiza “Bienvenido, …” y el nombre del perfil
  function updateWelcomeAndProfileName() {
    const p = getProfile();
    const name = (p.nombres ? `${p.nombres} ${p.apellidos || ''}` : 'Invitado').trim();
    // Títulos de bienvenida en ambas lecciones
    document.querySelectorAll('.hero-title').forEach(el => {
      el.textContent = `¡Bienvenido, ${name}!`;
    });
    // Encabezado de la pantalla de perfil
    const profileTitle = document.getElementById('profile-user-name');
    if (profileTitle) profileTitle.textContent = name;
    // Avatares si hay foto
    if (p.foto) {
      document.querySelectorAll('.profile-avatar, .profile-avatar-lg').forEach(el => {
        el.style.backgroundImage = `url('${p.foto}')`;
      });
    }
  }

  // Splash: si ya hay perfil con nombre, manda a home; si no, al login
  showPage('splash-screen');
  setTimeout(() => {
    const p = getProfile();
    showPage(p.nombres ? 'home-screen' : 'login-screen');
    updateWelcomeAndProfileName();
  }, 3000);

  document.getElementById('main-login-btn')
    ?.addEventListener('click', () => {
      const p = getProfile();
      showPage(p.nombres ? 'home-screen' : 'complete-profile-screen');
      updateWelcomeAndProfileName();
    });

  document.getElementById('go-to-signup-link')
    ?.addEventListener('click', () => showPage('signup-screen'));

  document.getElementById('go-to-login-link')
    ?.addEventListener('click', () => showPage('login-screen'));

  document.getElementById('main-signup-btn')
    ?.addEventListener('click', () => showPage('complete-profile-screen'));


  document.getElementById('complete-profile-btn')
    ?.addEventListener('click', () => {
      const nombres   = document.getElementById('complete-nombres').value.trim();
      const apellidos = document.getElementById('complete-apellidos').value.trim();
      const fecha     = document.getElementById('complete-dob').value;
      const genero    = document.getElementById('complete-gender').value;
      if (!nombres || !apellidos) {
        alert('Por favor completa tu nombre y apellidos.');
        return;
      }
      const profile = { ...getProfile(), nombres, apellidos, fecha, genero };
      saveProfile(profile);
      updateWelcomeAndProfileName();
      alert('¡Perfil completado! Bienvenido/a.');
      showPage('home-screen');
    });

 
  document.getElementById('save-profile-btn')
    ?.addEventListener('click', () => {
      const nombres = document.querySelector('#edit-profile-screen input[placeholder="Nombres"]')?.value.trim() || '';
      const apellidos = document.querySelector('#edit-profile-screen input[placeholder="Apellidos"]')?.value.trim() || '';
      const genero = document.getElementById('edit-gender')?.value || '';
      const fecha  = document.getElementById('complete-dob')?.value || '';
      const profile = { ...getProfile(), nombres, apellidos, genero, fecha };
      saveProfile(profile);
      updateWelcomeAndProfileName();
      alert('Cambios guardados ');
      showPage('profile-menu-screen');
    });


  function handlePhotoUpload(inputId) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput) return;
    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const profile = { ...getProfile(), foto: e.target.result };
          saveProfile(profile);
          updateWelcomeAndProfileName();
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  handlePhotoUpload('upload-photo-complete');
  handlePhotoUpload('upload-photo-edit');

  // Navegación a/desde pantallas de perfil
  document.getElementById('profile-btn')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));
  document.getElementById('back-to-home-from-profile')
    ?.addEventListener('click', () => showPage('home-screen'));
  document.getElementById('back-to-profile-from-edit')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));
  document.getElementById('back-to-profile-from-notifications')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));


  const sideMenu  = document.getElementById('side-menu');
  const backdrop  = document.getElementById('backdrop');
  const menuBtn   = document.getElementById('menu-btn');

  const openMenu  = () => { sideMenu?.classList.add('open'); backdrop?.classList.add('show'); };
  const closeMenu = () => { sideMenu?.classList.remove('open'); backdrop?.classList.remove('show'); };

  menuBtn?.addEventListener('click', openMenu);
  backdrop?.addEventListener('click', closeMenu);

  sideMenu?.addEventListener('click', (e) => {
    const btn = e.target.closest('.side-link');
    if (!btn) return;
    const targetPage = btn.getAttribute('data-page');
    if (targetPage) showPage(targetPage);
    closeMenu();
  });


  document.querySelectorAll('.verify-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextId = btn.dataset.next;
      if (nextId) showPage(nextId);
    });
  });

  // Mapa actual (el tuyo) para abrir algunas actividades
  const lecciones = {
    'leccion-1': { startPage: 'l1-clave-1', continueBtn: 'l1-continue-btn', unlock: 'leccion-2' },
    'leccion-2': { startPage: 'l2-step-1',  continueBtn: 'l2-continue-btn', unlock: 'leccion-3' },
    'leccion-3': { startPage: 'l3-step-1',  continueBtn: 'l3-continue-btn', unlock: 'leccion-4' }
  };

  for (const id in lecciones) {
    const node = document.getElementById(id);
    if (!node) continue;
    const data = lecciones[id];

    node.addEventListener('click', () => {
      if (node.classList.contains('unlocked') && !node.classList.contains('completed')) {
        showPage(data.startPage);
      }
    });

    const cont = document.getElementById(data.continueBtn);
    if (cont) {
      cont.addEventListener('click', () => {
        node.classList.add('completed');
        const unlockNode = document.getElementById(data.unlock);
        if (unlockNode) unlockNode.classList.add('unlocked');
        alert('🎉 ¡Lección completada!');
        // Regresa a la lección 1 por defecto (donde están esas actividades)
        showPage('home-screen');
      });
    }
  }

  // Actividades que aún no están mapeadas (lección 1)
  for (let i = 4; i <= 10; i++) {
    const lesson = document.getElementById(`leccion-${i}`);
    if (lesson) {
      lesson.addEventListener('click', () =>
        alert('¡Estamos preparando nuevo contenido para ti!'));
    }
  }
  // Actividades que aún no están mapeadas (lección 2)
  for (let i = 1; i <= 10; i++) {
    const lesson = document.getElementById(`leccion2-${i}`);
    if (lesson && !lesson.hasListenerAttached) {
      lesson.addEventListener('click', () =>
        alert('¡Estamos preparando nuevo contenido para ti!'));
      lesson.hasListenerAttached = true;
    }
  }


  document.getElementById('prev-lesson')
    ?.addEventListener('click', () => {

    });
  document.getElementById('next-lesson')
    ?.addEventListener('click', () => showPage('home-screen-2'));

  document.getElementById('prev-lesson-2')
    ?.addEventListener('click', () => showPage('home-screen'));
  document.getElementById('next-lesson-2')
    ?.addEventListener('click', () => alert('¡Más lecciones próximamente!'));

 
  const cloudSearchBtn  = document.getElementById('cloud-search');
  const dictModal       = document.getElementById('dict-modal');
  const dictClose       = document.getElementById('dict-close');
  const dictInput       = document.getElementById('dictionary-input');
  const dictResult      = document.getElementById('dictionary-result');

  function openDict() {
    dictModal.classList.remove('hidden');
    dictInput.value = '';
    dictResult.textContent = 'Escribe una palabra maya para buscar su significado.';
    setTimeout(() => dictInput.focus(), 50);
  }
  function closeDict() { dictModal.classList.add('hidden'); }

  cloudSearchBtn?.addEventListener('click', openDict);
  document.getElementById('cloud-search-2')?.addEventListener('click', openDict);
  dictClose?.addEventListener('click',  closeDict);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !dictModal.classList.contains('hidden')) closeDict();
  });

  dictInput?.addEventListener('keyup', (e) => {
    if (e.key !== 'Enter') return;
    const raw  = dictInput.value.trim();
    if (!raw) return;
    const norm = normalize(raw);
    const exactKey = normalizedIndex.get(norm);
    if (exactKey) {
      dictResult.innerHTML = `<strong>${exactKey}</strong>: ${dictionaryData[exactKey]}`;
    } else {
      const partial = [...normalizedIndex.entries()].find(([nk]) => nk.includes(norm));
      if (partial) {
        const k = partial[1];
        dictResult.innerHTML = `<strong>${k}</strong>: ${dictionaryData[k]}`;
      } else {
        dictResult.textContent = `La palabra '${raw}' no se encontró en el diccionario.`;
      }
    }
    dictInput.select();
  });

  // Refresca nombres si ya existía perfil
  updateWelcomeAndProfileName();
});
document.addEventListener('DOMContentLoaded', () => {
  const pages = document.querySelectorAll('.page');
  const showPage = (id) => {
    pages.forEach((p) => p.classList.add('hidden'));
    const page = document.getElementById(id);
    if (page) page.classList.remove('hidden');
  };

  const saveProfile = (profile) => localStorage.setItem('userProfile', JSON.stringify(profile));
  const getProfile = () => JSON.parse(localStorage.getItem('userProfile') || '{}');

  function updateUIFromProfile() {
    const p = getProfile();
    const name = (p.nombres ? `${p.nombres} ${p.apellidos || ''}` : 'Invitado').trim();

    document.querySelectorAll('.hero-title').forEach(el => el.textContent = `¡Bienvenido, ${name}!`);

    const profileName = document.getElementById('profile-user-name');
    if (profileName) profileName.textContent = name;
    // Foto de perfil
    if (p.foto) {
      document.querySelectorAll('.profile-avatar, .profile-avatar-lg').forEach(el => {
        el.style.backgroundImage = `url('${p.foto}')`;
      });
    }
  }

  function fillEditProfile() {
    const p = getProfile();
    document.querySelector('#edit-profile-screen input[placeholder="Nombres"]').value = p.nombres || '';
    document.querySelector('#edit-profile-screen input[placeholder="Apellidos"]').value = p.apellidos || '';
    document.getElementById('edit-gender').value = p.genero || '';
    document.getElementById('edit-dob').value = p.fecha || '';
  }

  // Splash inicial
  showPage('splash-screen');
  setTimeout(() => {
    const p = getProfile();
    showPage(p.nombres ? 'home-screen' : 'login-screen');
    updateUIFromProfile();
  }, 2500);

  document.getElementById('main-login-btn')
    ?.addEventListener('click', () => {
      const p = getProfile();
      showPage(p.nombres ? 'home-screen' : 'complete-profile-screen');
      updateUIFromProfile();
    });

  document.getElementById('main-signup-btn')
    ?.addEventListener('click', () => showPage('complete-profile-screen'));

  document.getElementById('complete-profile-btn')
    ?.addEventListener('click', () => {
      const nombres = document.getElementById('complete-nombres').value.trim();
      const apellidos = document.getElementById('complete-apellidos').value.trim();
      const fecha = document.getElementById('complete-dob').value;
      const genero = document.getElementById('complete-gender').value;
      if (!nombres || !apellidos) return alert('Completa nombre y apellidos');

      saveProfile({ nombres, apellidos, fecha, genero });
      updateUIFromProfile();
      alert('Perfil guardado ');
      showPage('home-screen');
    });

  document.getElementById('profile-btn')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));

  document.getElementById('back-to-home-from-profile')
    ?.addEventListener('click', () => showPage('home-screen'));

  document.getElementById('back-to-profile-from-edit')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));

  document.getElementById('back-to-profile-from-notifications')
    ?.addEventListener('click', () => showPage('profile-menu-screen'));

  document.querySelector('[data-page="edit-profile-screen"]')
    ?.addEventListener('click', () => {
      fillEditProfile();
      showPage('edit-profile-screen');
    });

  // Guardar cambios desde pantalla de edición
  document.getElementById('save-profile-btn')
    ?.addEventListener('click', () => {
      const nombres = document.querySelector('#edit-profile-screen input[placeholder="Nombres"]').value.trim();
      const apellidos = document.querySelector('#edit-profile-screen input[placeholder="Apellidos"]').value.trim();
      const genero = document.getElementById('edit-gender').value;
      const fecha = document.getElementById('edit-dob').value;
      const profile = { ...getProfile(), nombres, apellidos, genero, fecha };
      saveProfile(profile);
      updateUIFromProfile();
      alert('Cambios guardados ');
      showPage('profile-menu-screen');
    });

  // Subida de foto
  function handlePhotoUpload(inputId) {
    const fileInput = document.getElementById(inputId);
    if (!fileInput) return;
    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const profile = { ...getProfile(), foto: e.target.result };
          saveProfile(profile);
          updateUIFromProfile();
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }
  handlePhotoUpload('upload-photo-complete');
  handlePhotoUpload('upload-photo-edit');


  document.getElementById('next-lesson')?.addEventListener('click', () => showPage('home-screen-2'));
  document.getElementById('prev-lesson')?.addEventListener('click', () => {});
  document.getElementById('prev-lesson-2')?.addEventListener('click', () => showPage('home-screen'));
  document.getElementById('next-lesson-2')?.addEventListener('click', () => alert('¡Más lecciones próximamente!'));

  
  const normalize = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const normalizedIndex = new Map(Object.keys({
    'abal': 'Ciruela, ciruelo',
    'balak': 'Rodar'
  }).map(k => [normalize(k), k]));

  const dictModal = document.getElementById('dict-modal');
  const dictInput = document.getElementById('dictionary-input');
  const dictResult = document.getElementById('dictionary-result');
  const openDict = () => { dictModal.classList.remove('hidden'); setTimeout(() => dictInput.focus(), 50); };
  const closeDict = () => dictModal.classList.add('hidden');

  document.getElementById('cloud-search')?.addEventListener('click', openDict);
  document.getElementById('cloud-search-2')?.addEventListener('click', openDict);
  document.getElementById('dict-close')?.addEventListener('click', closeDict);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDict(); });

  dictInput?.addEventListener('keyup', (e) => {
    if (e.key !== 'Enter') return;
    const word = dictInput.value.trim();
    if (!word) return;
    dictResult.textContent = `Buscando "${word}"...`;
    setTimeout(() => {
      dictResult.textContent = `(${word}) – Ejemplo temporal de resultado.`;
    }, 400);
  });

  //Cerrar sesion

  document.getElementById('logout-btn')?.addEventListener('click', () => {
  const confirmLogout = confirm('¿Seguro que deseas cerrar sesión?');
  if (!confirmLogout) return;

  localStorage.removeItem('userProfile');
  localStorage.removeItem('lessonProgress');

  document.querySelectorAll('.profile-avatar, .profile-avatar-lg').forEach(el => {
    el.style.backgroundImage = '';
  });
  document.querySelectorAll('.hero-title').forEach(el => {
    el.textContent = '¡Bienvenido!';
  });
  const nameEl = document.getElementById('profile-user-name');
  if (nameEl) nameEl.textContent = 'Invitado';
  showPage('login-screen');
  alert('Sesión cerrada correctamente.');
});

//puntos

if (!localStorage.getItem('userPoints')) {
  localStorage.setItem('userPoints', JSON.stringify({ total: 0, history: [] }));
}

function addPoints(amount, reason) {
  const points = JSON.parse(localStorage.getItem('userPoints') || '{"total":0,"history":[]}');
  points.total += amount;
  const date = new Date().toLocaleString();
  points.history.unshift({ reason, amount, date });
  localStorage.setItem('userPoints', JSON.stringify(points));
}

function getPoints() {
  return JSON.parse(localStorage.getItem('userPoints') || '{"total":0,"history":[]}');
}

function updatePointsUI() {
  const { total, history } = getPoints();
  const totalEl = document.getElementById('points-total');
  const historyEl = document.getElementById('points-history');
  if (totalEl) totalEl.textContent = total;

  if (historyEl) {
    if (history.length === 0) {
      historyEl.innerHTML = '<p>No hay actividades registradas todavía.</p>';
    } else {
      historyEl.innerHTML = history
        .map(h => `<p>+${h.amount} pts – ${h.reason} <br><small>${h.date}</small></p>`)
        .join('<hr>'); 
    }
  }
}

document.querySelectorAll('.verify-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const nextId = btn.dataset.next;
    if (nextId && nextId.includes('complete-screen')) {
      addPoints(10, `Actividad completada (${nextId})`);
    }
  });
});

document.querySelector('.side-link i.fa-star')
  ?.closest('.side-link')
  ?.addEventListener('click', () => {
    updatePointsUI();
    showPage('points-screen');
  });
// tarjeta de ussuario
/* ==========================
   TARJETA DE PERFIL ACTUALIZADA
========================== */
function updateProfileCard() {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  const points = JSON.parse(localStorage.getItem('userPoints') || '{"total":0}');
  const progress = JSON.parse(localStorage.getItem('lessonProgress') || '{"completed":[],"unlocked":[]}');

  // Nombre abreviado (primer nombre + primer apellido)
  const firstName = (profile.nombres || '').split(' ')[0] || 'Usuario';
  const firstLast = (profile.apellidos || '').split(' ')[0] || '';
  const nameDisplay = `${firstName} ${firstLast}`.trim();

  // Foto de perfil (si hay)
  const photoCard = document.getElementById('profile-photo-card');
  if (photoCard) {
    if (profile.foto) {
      photoCard.style.backgroundImage = `url('${profile.foto}')`;
    } else {
      photoCard.style.backgroundImage = "url('https://via.placeholder.com/150/007AB8/FFFFFF?text=U')";
    }
  }

  // Actualiza el nombre
  const nameEl = document.getElementById('player-name');
  if (nameEl) nameEl.textContent = nameDisplay;

  // Puntos totales
  const pointsEl = document.getElementById('player-points');
  if (pointsEl) pointsEl.textContent = points.total || 0;

  // Lección actual (la última completada o desbloqueada)
  const currentLesson = progress.completed?.length
    ? progress.completed.length
    : progress.unlocked?.length
      ? progress.unlocked.length
      : 1;
  const lessonEl = document.getElementById('current-lesson');
  if (lessonEl) lessonEl.textContent = currentLesson;

  // Actividad actual (simulada)
  const currentActivity = Math.min((points.total / 10) % 10 || 1, 10);
  const activityEl = document.getElementById('current-activity');
  if (activityEl) activityEl.textContent = `${Math.floor(currentActivity)} / 10`;
}

// Ejecutar al cargar la página
updateProfileCard();

// Actualizar también cada vez que se guarde el perfil o se ganen puntos
document.addEventListener('pointsUpdated', updateProfileCard);
document.addEventListener('lessonUpdated', updateProfileCard);

document.getElementById('back-to-profile-from-points')
  ?.addEventListener('click', () => showPage('profile-menu-screen'));


  updateUIFromProfile();
});

