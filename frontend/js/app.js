// Dashboard App script
const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Obtener los clientes de Firebase
const auth = window.firebaseAuth;
const db = window.firebaseDb;

// Mapeo de animales
const animalNames = {
  1: "Conejo",
  2: "Gato",
  3: "Perro",
  4: "Cerdito",
  5: "Gallo"
};

const animalImages = {
  1: "./images/CONEJO MUESTRA .jpeg",
  2: "./images/GATO MUESTRA.jpeg",
  3: "./images/PERRO MUESTRA .jpeg",
  4: "./images/CERDITO MUESTRA.jpeg",
  5: "./images/GALLO MUESTRA.jpeg"
};

async function loadUser() {
  const user = auth.currentUser;
  
  if (!user) {
    window.location.href = "../index.html";
    return;
  }

  // Cargar avatar y perfil en PARALELO para mayor velocidad
  const [avatarDoc, profileDoc] = await Promise.all([
    db.collection("avatars").doc(user.uid).get(),
    db.collection("profiles").doc(user.uid).get()
  ]);

  const avatar = avatarDoc.data();
  const profile = profileDoc.data();

  if (!avatar || !avatar.pet_name) {
    // No tiene mascota, ir a selección
    window.location.href = "./pet-selection.html";
    return;
  }

  if (!profile) {
    console.error("Profile not found");
    welcome.textContent = `Hola`;
  } else {
    welcome.textContent = `Hola, ${profile.name} `;
  }

  // Guardar datos globalmente para edición
  window.currentUserData = {
    userId: user.uid,
    profile: profile,
    avatar: avatar
  };

  // Cargar perfil mejorado
  loadUserProfile(profile, avatar, user);
  
  // Cargar pestaña de mascota
  loadMascotaTab(avatar);
  
  // Cargar historial de cálculos
  loadArchivoHistorial();
}

// ========================================
// FUNCIONES PARA PERFIL DE USUARIO
// ========================================

function loadUserProfile(profile, avatar, user) {
  const name = profile?.name || 'Usuario';
  
  // Imagen del animal como avatar
  const animalImg = document.getElementById('profileAnimalImg');
  if (animalImg && avatar) {
    animalImg.src = animalImages[avatar.animal_type];
    animalImg.alt = animalNames[avatar.animal_type];
  }
  
  // Actualizar header del perfil
  const displayName = document.getElementById('profileDisplayName');
  const emailEl = document.getElementById('profileEmail');
  const levelBadge = document.getElementById('profileLevelBadge');
  const pointsEl = document.getElementById('profilePoints');
  
  if (displayName) displayName.textContent = name;
  if (emailEl) emailEl.textContent = profile?.email || user.email;
  if (levelBadge) levelBadge.textContent = `Nivel ${avatar?.level || 1}`;
  if (pointsEl) pointsEl.textContent = avatar?.xp || 0;
  
  // Cargar estadísticas desde localStorage
  const calcsCount = JSON.parse(localStorage.getItem('calculosHistorial') || '[]').length;
  const profileCalcs = document.getElementById('profileCalcs');
  const profileQuizzes = document.getElementById('profileQuizzes');
  if (profileCalcs) profileCalcs.textContent = calcsCount;
  if (profileQuizzes) profileQuizzes.textContent = localStorage.getItem('quizzesCompleted') || 0;
  
  // Info display - con verificaciones de null
  const infoName = document.getElementById('infoName');
  const infoEmail = document.getElementById('infoEmail');
  const infoJoinDate = document.getElementById('infoJoinDate');
  
  if (infoName) infoName.textContent = name;
  if (infoEmail) infoEmail.textContent = profile?.email || user.email;
  
  // Fecha de registro
  if (infoJoinDate) {
    const joinDate = profile?.created_at ? new Date(profile.created_at) : new Date();
    infoJoinDate.textContent = joinDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Campos editables - con verificaciones
  const editName = document.getElementById('editName');
  const editEmail = document.getElementById('editEmail');
  if (editName) editName.value = name;
  if (editEmail) editEmail.value = profile?.email || user.email;
  
  // Progreso de quizzes
  updateQuizProgressBar();
}

function updateQuizProgressBar() {
  const quizzesCompleted = parseInt(localStorage.getItem('quizzesCompleted') || '0');
  const maxQuizzes = 6; // 6 temas
  const percentage = Math.min((quizzesCompleted / maxQuizzes) * 100, 100);
  
  const progressBar = document.getElementById('quizzesProgressBar');
  const progressText = document.getElementById('quizzesProgressText');
  
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
  if (progressText) {
    progressText.textContent = `${quizzesCompleted}/${maxQuizzes} completados`;
  }
}

// ========================================
// FUNCIONES PARA PESTAÑA MASCOTA
// ========================================

function loadMascotaTab(avatar) {
  if (!avatar) return;
  
  // Header de mascota
  const mascotaAvatar = document.getElementById('mascotaAvatarImg');
  if (mascotaAvatar) {
    mascotaAvatar.src = animalImages[avatar.animal_type];
    mascotaAvatar.alt = animalNames[avatar.animal_type];
  }
  
  const mascotaName = document.getElementById('mascotaName');
  const mascotaType = document.getElementById('mascotaType');
  const mascotaLevel = document.getElementById('mascotaLevel');
  
  if (mascotaName) mascotaName.textContent = avatar.pet_name || 'Mi Mascota';
  if (mascotaType) mascotaType.textContent = animalNames[avatar.animal_type];
  if (mascotaLevel) mascotaLevel.textContent = avatar.level;
  
  // Barra de XP - con verificaciones
  const xpNeeded = avatar.level * 30;
  const xpProgress = (avatar.xp / xpNeeded) * 100;
  const mascotaXpBar = document.getElementById('mascotaXpBar');
  const mascotaXpText = document.getElementById('mascotaXpText');
  if (mascotaXpBar) mascotaXpBar.style.width = `${Math.min(xpProgress, 100)}%`;
  if (mascotaXpText) mascotaXpText.textContent = `${avatar.xp}/${xpNeeded} XP`;
  
  // Campo de edición de nombre
  const mascotaEditName = document.getElementById('mascotaEditName');
  if (mascotaEditName) mascotaEditName.value = avatar.pet_name || '';
  
  // Actualizar tarjetas de nivel
  updateLevelCards(avatar.level);
  
  // Configurar videos de reacciones
  setupReactionVideos();
}

function updateLevelCards(currentLevel) {
  const levelRequirements = [0, 30, 60, 90, 120]; // XP necesarios para cada nivel
  
  for (let level = 1; level <= 5; level++) {
    const card = document.getElementById(`levelCard${level}`);
    if (!card) continue;
    
    // Limpiar clases previas
    card.classList.remove('unlocked', 'current', 'locked');
    
    // Configurar overlay y botón
    const overlay = card.querySelector('.locked-overlay');
    const playBtn = card.querySelector('.play-video-btn');
    const statusEl = card.querySelector('.level-status');
    
    if (level < currentLevel) {
      // Nivel completado
      card.classList.add('unlocked');
      if (overlay) overlay.style.display = 'none';
      if (playBtn) playBtn.style.display = 'flex';
      if (statusEl) statusEl.textContent = '✅ Desbloqueado';
    } else if (level === currentLevel) {
      // Nivel actual
      card.classList.add('current');
      if (overlay) overlay.style.display = 'none';
      if (playBtn) playBtn.style.display = 'flex';
      if (statusEl) statusEl.textContent = '⭐ Nivel Actual';
    } else {
      // Nivel bloqueado
      card.classList.add('locked');
      if (overlay) overlay.style.display = 'flex';
      if (playBtn) playBtn.style.display = 'none';
      if (statusEl) statusEl.textContent = `🔒 ${levelRequirements[level - 1]} pts para desbloquear`;
    }
  }
}

function playLevelVideo(level) {
  const currentLevel = window.currentUserData?.avatar?.level || 1;
  
  if (level > currentLevel) {
    showToast('🔒 Necesitas alcanzar este nivel primero');
    return;
  }
  
  const video = document.getElementById(`levelVideo${level}`);
  const card = document.getElementById(`levelCard${level}`);
  const playBtn = card?.querySelector('.play-video-btn');
  if (!video) return;
  
  // Pausar otros videos y resetear sus botones
  for (let i = 1; i <= 5; i++) {
    if (i !== level) {
      const otherVideo = document.getElementById(`levelVideo${i}`);
      const otherCard = document.getElementById(`levelCard${i}`);
      const otherBtn = otherCard?.querySelector('.play-video-btn');
      if (otherVideo) {
        otherVideo.pause();
        otherVideo.currentTime = 0;
      }
      if (otherBtn) {
        otherBtn.textContent = 'Reproducir';
        otherBtn.classList.remove('playing');
      }
    }
  }
  
  // Pausar videos de reacciones
  const happyVideo = document.getElementById('happyVideo');
  const sadVideo = document.getElementById('sadVideo');
  if (happyVideo) {
    happyVideo.pause();
    happyVideo.currentTime = 0;
  }
  if (sadVideo) {
    sadVideo.pause();
    sadVideo.currentTime = 0;
  }
  // Resetear botones de reacciones
  document.querySelectorAll('.play-reaction-btn').forEach(btn => {
    btn.classList.remove('playing');
    btn.textContent = btn.textContent.includes('Feliz') ? '▶️ Feliz' : '▶️ Triste';
  });
  
  // Reproducir o pausar
  if (video.paused) {
    video.play();
    if (playBtn) {
      playBtn.textContent = '⏸️ Pausar';
      playBtn.classList.add('playing');
    }
  } else {
    video.pause();
    if (playBtn) {
      playBtn.textContent = '▶️ Reproducir';
      playBtn.classList.remove('playing');
    }
  }
}

function setupReactionVideos() {
  // Los botones de reacción ya están configurados en el HTML
}

function playReactionVideo(type) {
  const happyVideo = document.getElementById('happyVideo');
  const sadVideo = document.getElementById('sadVideo');
  
  // Pausar videos de niveles y resetear sus botones
  for (let i = 1; i <= 5; i++) {
    const levelVideo = document.getElementById(`levelVideo${i}`);
    const levelCard = document.getElementById(`levelCard${i}`);
    const levelBtn = levelCard?.querySelector('.play-video-btn');
    if (levelVideo) {
      levelVideo.pause();
      levelVideo.currentTime = 0;
    }
    if (levelBtn) {
      levelBtn.textContent = '▶️ Reproducir';
      levelBtn.classList.remove('playing');
    }
  }
  
  const happyBtn = document.querySelector('.reaction-card:first-child .play-reaction-btn');
  const sadBtn = document.querySelector('.reaction-card:last-child .play-reaction-btn');
  
  if (type === 'happy') {
    if (sadVideo) {
      sadVideo.pause();
      sadVideo.currentTime = 0;
    }
    if (sadBtn) {
      sadBtn.classList.remove('playing');
      sadBtn.textContent = '▶️ Triste';
    }
    
    if (happyVideo) {
      if (happyVideo.paused) {
        happyVideo.play();
        if (happyBtn) {
          happyBtn.classList.add('playing');
          happyBtn.textContent = '⏸️ Feliz';
        }
      } else {
        happyVideo.pause();
        if (happyBtn) {
          happyBtn.classList.remove('playing');
          happyBtn.textContent = '▶️ Feliz';
        }
      }
    }
  } else if (type === 'sad') {
    if (happyVideo) {
      happyVideo.pause();
      happyVideo.currentTime = 0;
    }
    if (happyBtn) {
      happyBtn.classList.remove('playing');
      happyBtn.textContent = '▶️ Feliz';
    }
    
    if (sadVideo) {
      if (sadVideo.paused) {
        sadVideo.play();
        if (sadBtn) {
          sadBtn.classList.add('playing');
          sadBtn.textContent = '⏸️ Triste';
        }
      } else {
        sadVideo.pause();
        if (sadBtn) {
          sadBtn.classList.remove('playing');
          sadBtn.textContent = '▶️ Triste';
        }
      }
    }
  }
}

// Toggle para habilitar edición del nombre de mascota
function toggleEditMascotaName() {
  const input = document.getElementById('mascotaEditName');
  const editBtn = document.getElementById('btnEditMascotaName');
  const saveBtn = document.getElementById('btnSaveMascotaName');
  
  // Habilitar input
  input.disabled = false;
  input.focus();
  
  // Cambiar botones
  editBtn.style.display = 'none';
  saveBtn.style.display = 'inline-flex';
  
  // Sonido de click
  playUISound('click');
}

async function saveMascotaName() {
  const input = document.getElementById('mascotaEditName');
  const newName = input.value.trim();
  
  if (!newName) {
    showToast('❌ El nombre no puede estar vacío');
    playUISound('error');
    return;
  }
  
  const data = window.currentUserData;
  
  try {
    const { error } = await sb
      .from('avatars')
      .update({ pet_name: newName })
      .eq('user_id', data.userId);
    
    if (error) throw error;
    
    // Actualizar datos locales
    data.avatar.pet_name = newName;
    
    // Actualizar UI
    document.getElementById('mascotaName').textContent = newName;
    
    // Deshabilitar input y cambiar botones
    input.disabled = true;
    document.getElementById('btnEditMascotaName').style.display = 'inline-flex';
    document.getElementById('btnSaveMascotaName').style.display = 'none';
    
    showToast('✅ Nombre de mascota actualizado');
    playUISound('success');
    
  } catch (error) {
    console.error('Error guardando nombre:', error);
    showToast('❌ Error al guardar el nombre');
    playUISound('error');
  }
}

// Sistema de sonidos UI
function playUISound(type) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
      case 'click':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.05);
        break;
      case 'success':
        oscillator.frequency.value = 523.25; // C5
        gainNode.gain.value = 0.15;
        oscillator.start();
        setTimeout(() => oscillator.frequency.value = 659.25, 100); // E5
        setTimeout(() => oscillator.frequency.value = 783.99, 200); // G5
        oscillator.stop(audioContext.currentTime + 0.3);
        break;
      case 'error':
        oscillator.frequency.value = 200;
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;
      case 'tab':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.08;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.03);
        break;
    }
  } catch (e) {
    // Silenciar errores de audio
  }
}

function toggleEditProfile() {
  const displayDiv = document.getElementById('profileInfoDisplay');
  const editDiv = document.getElementById('profileInfoEdit');
  const editBtn = document.getElementById('editProfileBtn');
  
  if (editDiv.style.display === 'none') {
    displayDiv.style.display = 'none';
    editDiv.style.display = 'block';
    editBtn.textContent = '❌ Cancelar';
    editBtn.classList.add('editing');
  } else {
    displayDiv.style.display = 'block';
    editDiv.style.display = 'none';
    editBtn.textContent = '✏️ Editar';
    editBtn.classList.remove('editing');
  }
}

function cancelEditProfile() {
  toggleEditProfile();
  // Restaurar valores originales
  const data = window.currentUserData;
  document.getElementById('editName').value = data.profile?.name || '';
}

async function saveProfile() {
  const newName = document.getElementById('editName').value.trim();
  
  if (!newName) {
    alert('El nombre no puede estar vacío');
    return;
  }
  
  const data = window.currentUserData;
  
  try {
    // Actualizar nombre en profiles
    const { error: profileError } = await sb
      .from('profiles')
      .update({ name: newName })
      .eq('id', data.userId);
    
    if (profileError) throw profileError;
    
    // Actualizar datos locales
    data.profile.name = newName;
    
    // Recargar UI
    loadUserProfile(data.profile, data.avatar, { email: data.profile.email });
    document.getElementById('welcome').textContent = `Hola, ${newName} `;
    
    // Cerrar edición
    toggleEditProfile();
    
    // Mensaje de éxito
    showToast('✅ Perfil actualizado correctamente');
    
  } catch (error) {
    console.error('Error guardando perfil:', error);
    alert('Error al guardar los cambios. Intenta de nuevo.');
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 15px 30px;
    border-radius: 10px;
    z-index: 100000;
    animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ========================================
// FUNCIONES PARA ARCHIVO/HISTORIAL
// ========================================

function getCalculosHistorial() {
  return JSON.parse(localStorage.getItem('calculosHistorial') || '[]');
}

function saveCalculo(tipo, inputs, resultado) {
  const historial = getCalculosHistorial();
  const nuevoCalculo = {
    id: Date.now(),
    tipo: tipo,
    fecha: new Date().toISOString(),
    inputs: inputs,
    resultado: resultado
  };
  historial.unshift(nuevoCalculo); // Agregar al inicio
  localStorage.setItem('calculosHistorial', JSON.stringify(historial));
  
  // Actualizar contador en perfil
  const calcsCount = historial.length;
  const profileCalcs = document.getElementById('profileCalcs');
  if (profileCalcs) profileCalcs.textContent = calcsCount;
  
  // Recargar lista si está visible
  loadArchivoHistorial();
}

function loadArchivoHistorial() {
  const historial = getCalculosHistorial();
  const container = document.getElementById('archivoList');
  
  if (!container) return;
  
  if (historial.length === 0) {
    container.innerHTML = `
      <div class="archivo-empty">
        <span class="empty-icon">📋</span>
        <p>No tienes cálculos guardados aún</p>
        <small>Cuando uses las calculadoras, tus resultados aparecerán aquí</small>
      </div>
    `;
    return;
  }
  
  const tipoNombres = {
    margenGanancia: 'Margen de Ganancia',
    precioVenta: 'Precio de Venta Unitario',
    puntoEquilibrio: 'Punto de Equilibrio',
    masivo: 'Cálculo Masivo'
  };
  
  let html = '';
  historial.forEach(calc => {
    const fecha = new Date(calc.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    html += `
      <div class="archivo-item" data-id="${calc.id}" data-tipo="${calc.tipo}">
        <div class="archivo-item-info">
          <div class="archivo-item-header">
            <span class="archivo-tipo-badge ${calc.tipo}">${tipoNombres[calc.tipo] || calc.tipo}</span>
            <span class="archivo-fecha">📅 ${fechaFormateada}</span>
          </div>
          <div class="archivo-item-result">
            ${formatResultadoArchivo(calc)}
          </div>
        </div>
        <div class="archivo-item-actions">
          <button class="btn-archivo-action pdf" onclick="exportarCalculoPDF(${calc.id})">📄 PDF</button>
          <button class="btn-archivo-action delete" onclick="eliminarCalculo(${calc.id})">🗑️</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

function formatResultadoArchivo(calc) {
  switch(calc.tipo) {
    case 'margenGanancia':
      return `
        <strong>Margen:</strong> ${calc.resultado.margen}% | 
        <strong>Ganancia:</strong> $${calc.resultado.ganancia} | 
        Precio: $${calc.inputs.precioVenta}, Costo: $${calc.inputs.costo}
      `;
    case 'precioVenta':
      return `
        <strong>Precio de Venta:</strong> $${calc.resultado.precioVenta} | 
        <strong>Ganancia/U:</strong> $${calc.resultado.gananciaUnitaria} | 
        Costo Total: $${calc.inputs.costoTotal}, Unidades: ${calc.inputs.unidades}
      `;
    case 'puntoEquilibrio':
      return `
        <strong>Punto de Equilibrio:</strong> ${calc.resultado.unidades} unidades | 
        <strong>Ventas necesarias:</strong> $${calc.resultado.ventasEquilibrio}
      `;
    case 'masivo':
      return `
        <strong>Productos calculados:</strong> ${calc.resultado.totalProductos} | 
        <strong>Ganancia estimada:</strong> $${calc.resultado.gananciaTotal}
      `;
    default:
      return JSON.stringify(calc.resultado);
  }
}

function filterArchivo() {
  const tipoFilter = document.getElementById('archivoFilter').value;
  const dateFilter = document.getElementById('archivoDateFilter').value;
  const items = document.querySelectorAll('.archivo-item');
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  items.forEach(item => {
    let showTipo = tipoFilter === 'all' || item.dataset.tipo === tipoFilter;
    let showDate = true;
    
    if (dateFilter !== 'all') {
      const historial = getCalculosHistorial();
      const calc = historial.find(c => c.id == item.dataset.id);
      if (calc) {
        const calcDate = new Date(calc.fecha);
        switch(dateFilter) {
          case 'today':
            showDate = calcDate >= today;
            break;
          case 'week':
            showDate = calcDate >= weekAgo;
            break;
          case 'month':
            showDate = calcDate >= monthAgo;
            break;
        }
      }
    }
    
    item.style.display = (showTipo && showDate) ? 'flex' : 'none';
  });
}

function eliminarCalculo(id) {
  if (!confirm('¿Estás seguro de eliminar este cálculo?')) return;
  
  let historial = getCalculosHistorial();
  historial = historial.filter(c => c.id !== id);
  localStorage.setItem('calculosHistorial', JSON.stringify(historial));
  loadArchivoHistorial();
  showToast('🗑️ Cálculo eliminado');
}

function limpiarHistorial() {
  if (!confirm('¿Estás seguro de eliminar TODO el historial? Esta acción no se puede deshacer.')) return;
  
  localStorage.setItem('calculosHistorial', '[]');
  loadArchivoHistorial();
  showToast('🗑️ Historial limpiado');
}

// ========================================
// EXPORTAR A PDF
// ========================================

function exportarCalculoPDF(id) {
  const historial = getCalculosHistorial();
  const calc = historial.find(c => c.id === id);
  if (!calc) return;
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  const tipoNombres = {
    margenGanancia: 'Margen de Ganancia',
    precioVenta: 'Precio de Venta Unitario',
    puntoEquilibrio: 'Punto de Equilibrio',
    masivo: 'Cálculo Masivo'
  };
  
  // Encabezado
  doc.setFillColor(8, 40, 219);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('EAS for you', 20, 25);
  
  doc.setFontSize(12);
  doc.text('Reporte de Cálculo Financiero', 120, 25);
  
  // Info del documento
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  const fecha = new Date(calc.fecha).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  doc.text(`Fecha: ${fecha}`, 20, 55);
  doc.text(`Usuario: ${window.currentUserData?.profile?.name || 'Usuario'}`, 20, 62);
  
  // Título del cálculo
  doc.setFontSize(16);
  doc.setTextColor(8, 40, 219);
  doc.text(tipoNombres[calc.tipo] || calc.tipo, 20, 80);
  
  // Línea separadora
  doc.setDrawColor(8, 40, 219);
  doc.line(20, 85, 190, 85);
  
  // Contenido según tipo
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  let y = 100;
  
  switch(calc.tipo) {
    case 'margenGanancia':
      doc.text('DATOS INGRESADOS:', 20, y);
      y += 10;
      doc.text(`• Precio de Venta: $${calc.inputs.precioVenta}`, 25, y);
      y += 7;
      doc.text(`• Costo: $${calc.inputs.costo}`, 25, y);
      y += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(8, 40, 219);
      doc.text('RESULTADOS:', 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(`Margen de Ganancia: ${calc.resultado.margen}%`, 25, y);
      y += 8;
      doc.text(`Ganancia por Unidad: $${calc.resultado.ganancia}`, 25, y);
      break;
      
    case 'precioVenta':
      doc.text('DATOS INGRESADOS:', 20, y);
      y += 10;
      doc.text(`• Costo Total de Producción: $${calc.inputs.costoTotal}`, 25, y);
      y += 7;
      doc.text(`• Unidades Producidas: ${calc.inputs.unidades}`, 25, y);
      y += 7;
      doc.text(`• Margen de Ganancia Deseado: ${calc.inputs.margen}%`, 25, y);
      y += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(8, 40, 219);
      doc.text('RESULTADOS:', 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(`Costo Unitario: $${calc.resultado.costoUnitario}`, 25, y);
      y += 8;
      doc.text(`Precio de Venta Sugerido: $${calc.resultado.precioVenta}`, 25, y);
      y += 8;
      doc.text(`Ganancia por Unidad: $${calc.resultado.gananciaUnitaria}`, 25, y);
      break;
      
    case 'puntoEquilibrio':
      doc.text('DATOS INGRESADOS:', 20, y);
      y += 10;
      doc.text(`• Costos Fijos: $${calc.inputs.costosFijos}`, 25, y);
      y += 7;
      doc.text(`• Precio de Venta Unitario: $${calc.inputs.precioVenta}`, 25, y);
      y += 7;
      doc.text(`• Costo Variable Unitario: $${calc.inputs.costoVariable}`, 25, y);
      y += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(8, 40, 219);
      doc.text('RESULTADOS:', 20, y);
      y += 10;
      doc.setFontSize(14);
      doc.text(`Punto de Equilibrio: ${calc.resultado.unidades} unidades`, 25, y);
      y += 8;
      doc.text(`Ventas Necesarias: $${calc.resultado.ventasEquilibrio}`, 25, y);
      y += 8;
      doc.text(`Margen de Contribución: $${calc.resultado.margenContribucion}`, 25, y);
      break;
      
    case 'masivo':
      doc.text('RESUMEN DEL CÁLCULO MASIVO:', 20, y);
      y += 10;
      doc.text(`• Total de Productos: ${calc.resultado.totalProductos}`, 25, y);
      y += 7;
      doc.text(`• Total de Unidades: ${calc.resultado.totalUnidades}`, 25, y);
      y += 7;
      doc.text(`• Inversión Total: $${calc.resultado.inversionTotal}`, 25, y);
      y += 7;
      doc.text(`• Ganancia Estimada Total: $${calc.resultado.gananciaTotal}`, 25, y);
      
      // Tabla de productos si existe
      if (calc.resultado.productos && calc.resultado.productos.length > 0) {
        y += 15;
        doc.autoTable({
          startY: y,
          head: [['N°', 'Producto', 'Costo U.', 'Precio Venta', 'Ganancia/U']],
          body: calc.resultado.productos.slice(0, 20).map(p => [
            p.numero,
            p.producto.substring(0, 20),
            `$${p.costoUnitario.toFixed(2)}`,
            `$${p.precioVenta.toFixed(2)}`,
            `$${p.gananciaUnitaria.toFixed(2)}`
          ]),
          theme: 'grid',
          headStyles: { fillColor: [8, 40, 219] }
        });
      }
      break;
  }
  
  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado por EAS for you - Herramienta de Educación Financiera', 105, 280, { align: 'center' });
  
  // Descargar
  const nombreArchivo = `EASforYou_${tipoNombres[calc.tipo].replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
  doc.save(nombreArchivo);
  
  showToast('📄 PDF descargado');
}

function exportarTodoPDF() {
  const historial = getCalculosHistorial();
  if (historial.length === 0) {
    alert('No hay cálculos para exportar');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Encabezado
  doc.setFillColor(8, 40, 219);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('EAS for you', 20, 25);
  
  doc.setFontSize(12);
  doc.text('Historial Completo de Cálculos', 120, 25);
  
  // Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Usuario: ${window.currentUserData?.profile?.name || 'Usuario'}`, 20, 55);
  doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-ES')}`, 20, 62);
  doc.text(`Total de cálculos: ${historial.length}`, 20, 69);
  
  // Tabla resumen
  const tipoNombres = {
    margenGanancia: 'Margen de Ganancia',
    precioVenta: 'Precio de Venta',
    puntoEquilibrio: 'Punto de Equilibrio',
    masivo: 'Cálculo Masivo'
  };
  
  const tableData = historial.map(calc => {
    const fecha = new Date(calc.fecha).toLocaleDateString('es-ES');
    let resultado = '';
    
    switch(calc.tipo) {
      case 'margenGanancia':
        resultado = `Margen: ${calc.resultado.margen}%`;
        break;
      case 'precioVenta':
        resultado = `Precio: $${calc.resultado.precioVenta}`;
        break;
      case 'puntoEquilibrio':
        resultado = `${calc.resultado.unidades} unidades`;
        break;
      case 'masivo':
        resultado = `${calc.resultado.totalProductos} productos`;
        break;
    }
    
    return [fecha, tipoNombres[calc.tipo], resultado];
  });
  
  doc.autoTable({
    startY: 80,
    head: [['Fecha', 'Tipo de Cálculo', 'Resultado Principal']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [8, 40, 219] }
  });
  
  // Pie de página
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Generado por EAS for you - Herramienta de Educación Financiera', 105, 280, { align: 'center' });
  
  doc.save(`EASforYou_Historial_${new Date().toISOString().slice(0,10)}.pdf`);
  showToast('📄 Historial exportado a PDF');
}

// Manejar pestañas
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Sonido de tab
    playUISound('tab');
    
    // Quitar active de todos
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    // Activar el seleccionado
    btn.classList.add("active");
    const tabId = `tab-${btn.dataset.tab}`;
    document.getElementById(tabId).classList.add("active");
  });
});

// Logout
logoutBtn.addEventListener("click", async () => {
  playUISound('click');
  await auth.signOut();
  window.location.href = "../index.html";
});



// Cambiar a pestaña contenidos (para usar desde los topics) - versión duplicada eliminada, usar la de abajo
window.switchToContenidosTab = function() {
  // Quitar active de todos
  tabBtns.forEach(b => b.classList.remove("active"));
  tabContents.forEach(c => c.classList.remove("active"));

  // Activar contenidos
  const contenidosBtn = document.querySelector('.tab-btn[data-tab="contenidos"]');
  const contenidosTab = document.getElementById('tab-contenidos');
  
  if (contenidosBtn) contenidosBtn.classList.add("active");
  if (contenidosTab) contenidosTab.classList.add("active");
  
  // Cerrar modal si está abierto
  closeTopicModal();
};

// ========================================
// CALCULADORAS
// ========================================

// Abrir modal de calculadora
function openCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

// Cerrar modal de calculadora
function closeCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    // Limpiar resultado
    const resultado = document.getElementById(`resultado-${tipo}`);
    if (resultado) {
      resultado.classList.remove("show");
      resultado.innerHTML = "";
    }
  }
}

// Cerrar modal al hacer clic fuera
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("calc-modal")) {
    const tipo = e.target.id.replace("calcModal-", "");
    closeCalcModal(tipo);
  }
});

// Cerrar modal con Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".calc-modal.active").forEach(modal => {
      const tipo = modal.id.replace("calcModal-", "");
      closeCalcModal(tipo);
    });
  }
});

// Calculadora: Margen de Ganancia
// Fórmula: ((Precio de Venta - Costo) / Precio de Venta) × 100
function calcularMargenGanancia() {
  const precioVenta = parseFloat(document.getElementById("mg-precioVenta").value);
  const costo = parseFloat(document.getElementById("mg-costo").value);
  const resultadoDiv = document.getElementById("resultado-margenGanancia");

  if (isNaN(precioVenta) || isNaN(costo) || precioVenta <= 0) {
    resultadoDiv.innerHTML = `
      <div class="resultado-error">
        <div class="error-text">Por favor ingresa valores válidos</div>
      </div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  if (costo >= precioVenta) {
    resultadoDiv.innerHTML = `
      <div class="resultado-error">
        <div class="error-text">El costo es mayor o igual al precio de venta. No hay margen de ganancia positivo.</div>
      </div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const margen = ((precioVenta - costo) / precioVenta) * 100;
  const gananciaUnidad = precioVenta - costo;

  resultadoDiv.innerHTML = `
    <div class="resultado-box">
      <div class="resultado-label">Tu margen de ganancia es:</div>
      <div class="resultado-valor">${margen.toFixed(2)}%</div>
      <div class="resultado-info">Ganas $${gananciaUnidad.toFixed(2)} por cada venta</div>
    </div>
  `;
  resultadoDiv.classList.add("show");
  
  // Guardar en historial
  saveCalculo('margenGanancia', 
    { precioVenta: precioVenta.toFixed(2), costo: costo.toFixed(2) },
    { margen: margen.toFixed(2), ganancia: gananciaUnidad.toFixed(2) }
  );
}

// Calculadora: Precio de Venta Unitario
// Fórmula: (Costo Total de Producción / Unidades Producidas) + Margen de Ganancia
function calcularPrecioVenta() {
  const costoTotal = parseFloat(document.getElementById("pv-costoTotal").value);
  const unidades = parseFloat(document.getElementById("pv-unidades").value);
  const margen = parseFloat(document.getElementById("pv-margen").value);
  const resultadoDiv = document.getElementById("resultado-precioVenta");

  if (isNaN(costoTotal) || isNaN(unidades) || isNaN(margen) || unidades <= 0) {
    resultadoDiv.innerHTML = `
      <div class="resultado-error">
        <div class="error-text">Por favor ingresa valores válidos</div>
      </div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const costoUnitario = costoTotal / unidades;
  const precioVenta = costoUnitario + margen;
  const gananciaUnitaria = margen;

  resultadoDiv.innerHTML = `
    <div class="resultado-box">
      <div class="resultado-label">Precio de venta sugerido:</div>
      <div class="resultado-valor">$${precioVenta.toFixed(2)}</div>
      <div class="resultado-info">
        Costo unitario: $${costoUnitario.toFixed(2)}<br>
        Ganancia por unidad: $${gananciaUnitaria.toFixed(2)}
      </div>
    </div>
  `;
  resultadoDiv.classList.add("show");
  
  // Guardar en historial
  saveCalculo('precioVenta',
    { costoTotal: costoTotal.toFixed(2), unidades: unidades, margen: margen },
    { costoUnitario: costoUnitario.toFixed(2), precioVenta: precioVenta.toFixed(2), gananciaUnitaria: gananciaUnitaria.toFixed(2) }
  );
}

// ========================================
// CARGA MASIVA - PRECIO DE VENTA UNITARIO
// ========================================

// Cambiar entre tabs
function switchPVTab(tab) {
  // Remover clase active de todos los tabs y contenidos
  document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.calc-tab-content').forEach(c => c.classList.remove('active'));
  
  // Activar el tab seleccionado
  if (tab === 'individual') {
    document.querySelector('.calc-tab:first-child').classList.add('active');
    document.getElementById('pv-tab-individual').classList.add('active');
  } else {
    document.querySelector('.calc-tab:last-child').classList.add('active');
    document.getElementById('pv-tab-masivo').classList.add('active');
  }
}

// Procesar archivo Excel
function procesarArchivoExcel(input) {
  const file = input.files[0];
  const statusDiv = document.getElementById('pv-file-status');
  const resultadosDiv = document.getElementById('pv-resultados-masivos');
  
  if (!file) return;
  
  // Validar extensión
  const extension = file.name.split('.').pop().toLowerCase();
  if (!['xlsx', 'xls'].includes(extension)) {
    statusDiv.className = 'file-status error';
    statusDiv.textContent = '❌ Por favor sube un archivo Excel (.xlsx o .xls)';
    return;
  }
  
  statusDiv.className = 'file-status loading';
  statusDiv.textContent = '⏳ Procesando archivo...';
  
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Leer primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Validar que tenga datos
      if (jsonData.length < 2) {
        statusDiv.className = 'file-status error';
        statusDiv.textContent = '❌ El archivo está vacío o no tiene datos';
        return;
      }
      
      // Procesar datos (empezar desde fila 2, índice 1)
      const productos = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];
        
        // Columnas según plantilla:
        // A (0): N° | B (1): Producto | E (4): Costo Total | H (7): Unidades | K (10): Margen
        const numero = row[0];
        const producto = row[1];
        const costoTotal = parseFloat(row[4]) || 0;
        const unidades = parseFloat(row[7]) || 0;
        const margen = parseFloat(row[10]) || 0;
        
        // Solo agregar si tiene datos válidos
        if (producto && costoTotal > 0 && unidades > 0) {
          const costoUnitario = costoTotal / unidades;
          const precioVenta = costoUnitario * (1 + margen / 100);
          const gananciaUnitaria = precioVenta - costoUnitario;
          
          productos.push({
            numero: numero || i,
            producto,
            costoTotal,
            unidades,
            margen,
            costoUnitario,
            precioVenta,
            gananciaUnitaria
          });
        }
      }
      
      if (productos.length === 0) {
        statusDiv.className = 'file-status error';
        statusDiv.textContent = '❌ No se encontraron productos válidos. Verifica que las columnas estén correctas.';
        return;
      }
      
      statusDiv.className = 'file-status success';
      statusDiv.textContent = `✅ Se procesaron ${productos.length} productos exitosamente`;
      
      // Mostrar resultados
      mostrarResultadosMasivos(productos, resultadosDiv);
      
      // Guardar en historial
      const totalCostos = productos.reduce((sum, p) => sum + p.costoTotal, 0);
      const totalUnidades = productos.reduce((sum, p) => sum + p.unidades, 0);
      const totalGanancia = productos.reduce((sum, p) => sum + (p.gananciaUnitaria * p.unidades), 0);
      
      saveCalculo('masivo',
        { archivo: file.name },
        { 
          totalProductos: productos.length, 
          totalUnidades: totalUnidades,
          inversionTotal: totalCostos.toFixed(2),
          gananciaTotal: totalGanancia.toFixed(2),
          productos: productos
        }
      );
      
    } catch (error) {
      console.error('Error procesando Excel:', error);
      statusDiv.className = 'file-status error';
      statusDiv.textContent = '❌ Error al procesar el archivo. Verifica que sea un archivo Excel válido.';
    }
  };
  
  reader.onerror = function() {
    statusDiv.className = 'file-status error';
    statusDiv.textContent = '❌ Error al leer el archivo';
  };
  
  reader.readAsArrayBuffer(file);
}

// Mostrar resultados en tabla
function mostrarResultadosMasivos(productos, container) {
  // Calcular totales
  const totalProductos = productos.length;
  const totalCostos = productos.reduce((sum, p) => sum + p.costoTotal, 0);
  const totalUnidades = productos.reduce((sum, p) => sum + p.unidades, 0);
  const promedioMargen = productos.reduce((sum, p) => sum + p.margen, 0) / totalProductos;
  const totalGananciaEstimada = productos.reduce((sum, p) => sum + (p.gananciaUnitaria * p.unidades), 0);
  
  let html = `
    <h3>📊 Resultados del Cálculo Masivo</h3>
    <div class="tabla-masiva-container">
      <table class="tabla-masiva">
        <thead>
          <tr>
            <th class="num-col">N°</th>
            <th>Producto</th>
            <th>Costo Total</th>
            <th>Unidades</th>
            <th>Costo Unit.</th>
            <th>Margen %</th>
            <th class="precio-col">Precio Venta</th>
            <th class="ganancia-col">Ganancia/U</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  productos.forEach(p => {
    html += `
      <tr>
        <td class="num-col">${p.numero}</td>
        <td>${p.producto}</td>
        <td>$${p.costoTotal.toFixed(2)}</td>
        <td>${p.unidades}</td>
        <td>$${p.costoUnitario.toFixed(2)}</td>
        <td>${p.margen}%</td>
        <td class="precio-col">$${p.precioVenta.toFixed(2)}</td>
        <td class="ganancia-col">$${p.gananciaUnitaria.toFixed(2)}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
    
    <div class="resumen-masivo">
      <div class="resumen-item">
        <div class="label">Total Productos</div>
        <div class="value">${totalProductos}</div>
      </div>
      <div class="resumen-item">
        <div class="label">Total Unidades</div>
        <div class="value">${totalUnidades}</div>
      </div>
      <div class="resumen-item">
        <div class="label">Inversión Total</div>
        <div class="value">$${totalCostos.toFixed(2)}</div>
      </div>
      <div class="resumen-item">
        <div class="label">Ganancia Estimada</div>
        <div class="value">$${totalGananciaEstimada.toFixed(2)}</div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// Calculadora: Punto de Equilibrio
// Fórmula: Costos Fijos / (Precio de Venta - Costo Variable Unitario)
function calcularPuntoEquilibrio() {
  const costosFijos = parseFloat(document.getElementById("pe-costosFijos").value);
  const precioVenta = parseFloat(document.getElementById("pe-precioVenta").value);
  const costoVariable = parseFloat(document.getElementById("pe-costoVariable").value);
  const resultadoDiv = document.getElementById("resultado-puntoEquilibrio");

  if (isNaN(costosFijos) || isNaN(precioVenta) || isNaN(costoVariable)) {
    resultadoDiv.innerHTML = `
      <div class="resultado-error">
        <div class="error-text">Por favor ingresa valores válidos</div>
      </div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const margenContribucion = precioVenta - costoVariable;

  if (margenContribucion <= 0) {
    resultadoDiv.innerHTML = `
      <div class="resultado-error">
        <div class="error-text">El precio de venta debe ser mayor al costo variable</div>
      </div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const puntoEquilibrio = costosFijos / margenContribucion;
  const ventasEquilibrio = puntoEquilibrio * precioVenta;

  resultadoDiv.innerHTML = `
    <div class="resultado-box">
      <div class="resultado-label">Punto de equilibrio:</div>
      <div class="resultado-valor">${Math.ceil(puntoEquilibrio)} unidades</div>
      <div class="resultado-info">
        Debes vender al menos ${Math.ceil(puntoEquilibrio)} unidades<br>
        para cubrir tus costos (= $${ventasEquilibrio.toFixed(2)} en ventas)
      </div>
    </div>
  `;
  resultadoDiv.classList.add("show");
  
  // Guardar en historial
  saveCalculo('puntoEquilibrio',
    { costosFijos: costosFijos.toFixed(2), precioVenta: precioVenta.toFixed(2), costoVariable: costoVariable.toFixed(2) },
    { unidades: Math.ceil(puntoEquilibrio), ventasEquilibrio: ventasEquilibrio.toFixed(2), margenContribucion: margenContribucion.toFixed(2) }
  );
}
// ========================================
// MEJORAS ADICIONALES PARA LAS CALCULADORAS
// ========================================

// Auto-enfocar el primer input al abrir modal
function openCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // Auto-enfocar el primer input
    setTimeout(() => {
      const firstInput = modal.querySelector('input[type="number"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
}

// Limpiar inputs al cerrar modal
function closeCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    
    // Limpiar resultado
    const resultado = document.getElementById(`resultado-${tipo}`);
    if (resultado) {
      resultado.classList.remove("show");
      resultado.innerHTML = "";
    }
    
    // Limpiar inputs (opcional, puedes quitarlo si no quieres que se borren)
    const inputs = modal.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
      input.value = '';
    });
  }
}

// Permitir calcular con Enter en cualquier input
document.addEventListener('DOMContentLoaded', function() {
  // Agregar event listeners para Enter en todos los inputs
  document.querySelectorAll('.calc-modal input[type="number"]').forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Encontrar el botón de calcular correspondiente
        const modal = this.closest('.calc-modal');
        const tipo = modal.id.replace('calcModal-', '');
        
        switch(tipo) {
          case 'margenGanancia':
            calcularMargenGanancia();
            break;
          case 'precioVenta':
            calcularPrecioVenta();
            break;
          case 'puntoEquilibrio':
            calcularPuntoEquilibrio();
            break;
        }
      }
    });
  });
});

// ========================================
// FUNCIONES PARA LOS BOTONES DE INFORMACIÓN
// ========================================

// Variable para controlar el tooltip activo
//let activeTooltip = null;
//let tooltipTimeout = null;

// Mostrar/ocultar información al hacer clic
function showInfo(button, tooltipId) {
  const tooltip = document.getElementById(tooltipId);
  
  // Si hay un tooltip activo, lo cerramos
  if (activeTooltip && activeTooltip !== tooltip) {
    activeTooltip.classList.remove('show');
  }
  
  // Si el tooltip ya está visible, lo ocultamos
  if (tooltip.classList.contains('show')) {
    tooltip.classList.remove('show');
    activeTooltip = null;
    
    // Limpiar timeout si existe
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  } else {
    // Mostrar el tooltip
    tooltip.classList.add('show');
    activeTooltip = tooltip;
    
    // Ocultar automáticamente después de 5 segundos
    tooltipTimeout = setTimeout(() => {
      if (tooltip.classList.contains('show')) {
        tooltip.classList.remove('show');
        activeTooltip = null;
        tooltipTimeout = null;
      }
    }, 5000);
  }
}

// Cerrar tooltips al hacer clic fuera
document.addEventListener('click', function(e) {
  // Si el clic no es en un botón de info ni en un tooltip
  if (!e.target.closest('.info-btn') && !e.target.closest('.info-tooltip')) {
    // Cerrar todos los tooltips
    document.querySelectorAll('.info-tooltip.show').forEach(tooltip => {
      tooltip.classList.remove('show');
    });
    activeTooltip = null;
    
    // Limpiar timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }
});

// Cerrar tooltips con Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.info-tooltip.show').forEach(tooltip => {
      tooltip.classList.remove('show');
    });
    activeTooltip = null;
    
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }
});

// ========================================
// MEJORAS PARA EL SCROLL EN MODALES
// ========================================

// Abrir modal con mejor manejo de scroll
function openCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // Resetear scroll del modal al top
    const modalContent = modal.querySelector('.calc-modal-content');
    if (modalContent) {
      modalContent.scrollTop = 0;
    }
    
    // Auto-enfocar el primer input
    setTimeout(() => {
      const firstInput = modal.querySelector('input[type="number"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }
}

// Cerrar modal
function closeCalcModal(tipo) {
  const modal = document.getElementById(`calcModal-${tipo}`);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    
    // Limpiar resultado
    const resultado = document.getElementById(`resultado-${tipo}`);
    if (resultado) {
      resultado.classList.remove("show");
      resultado.innerHTML = "";
    }
    
    // Cerrar tooltips activos
    if (activeTooltip) {
      activeTooltip.classList.remove('show');
      activeTooltip = null;
    }
    
    // Limpiar timeout de tooltip
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
  }
}

// ========================================
// EVENT LISTENER PARA ENTER EN INPUTS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Agregar event listeners para Enter en todos los inputs
  document.querySelectorAll('.calc-modal input[type="number"]').forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        // Encontrar el botón de calcular correspondiente
        const modal = this.closest('.calc-modal');
        const tipo = modal.id.replace('calcModal-', '');
        
        switch(tipo) {
          case 'margenGanancia':
            calcularMargenGanancia();
            break;
          case 'precioVenta':
            calcularPrecioVenta();
            break;
          case 'puntoEquilibrio':
            calcularPuntoEquilibrio();
            break;
        }
      }
    });
  });
});

// Mostrar indicador de carga
function showLoading() {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '0.5';
  }
  welcome.textContent = 'Cargando...';
}

// Ocultar indicador de carga
function hideLoading() {
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '1';
  }
}

// Cargar al iniciar - usando Firebase onAuthStateChanged
showLoading();
auth.onAuthStateChanged((user) => {
  if (user) {
    loadUser().then(() => {
      hideLoading();
    }).catch(err => {
      console.error('Error cargando usuario:', err);
      hideLoading();
      welcome.textContent = 'Error al cargar';
    });
  } else {
    // No hay usuario autenticado, redirigir al login
    window.location.href = "../index.html";
  }
});

// ========================================
// FUNCIONES PARA LOS TOPICS (CONTENIDOS)
// ========================================

// Abrir topic en modal
function openTopicModal(topicUrl) {
  const modal = document.createElement('div');
  modal.className = 'topic-modal';
  modal.innerHTML = `
    <div class="topic-modal-content">
      <button class="topic-modal-close" onclick="closeTopicModal()">&times;</button>
      <iframe src="${topicUrl}" class="topic-iframe"></iframe>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Listener para cerrar con ESC
  document.addEventListener('keydown', handleTopicEscapeKey);
}

// Manejador de tecla ESC para topic modal
function handleTopicEscapeKey(e) {
  if (e.key === 'Escape') {
    closeTopicModal();
  }
}

// Cerrar modal de topic
function closeTopicModal() {
  const modal = document.querySelector('.topic-modal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = 'auto';
    // Remover el listener de ESC
    document.removeEventListener('keydown', handleTopicEscapeKey);
  }
}

// Cambiar a pestaña contenidos (para usar desde los topics)
window.switchToContenidosTab = function() {
  tabBtns.forEach(b => b.classList.remove("active"));
  tabContents.forEach(c => c.classList.remove("active"));

  const contenidosBtn = document.querySelector('.tab-btn[data-tab="contenidos"]');
  const contenidosTab = document.getElementById('tab-contenidos');
  
  if (contenidosBtn) contenidosBtn.classList.add("active");
  if (contenidosTab) contenidosTab.classList.add("active");
  
  closeTopicModal();
};

// ========================================
// FUNCIONES PARA LAS CALCULADORAS (EJERCICIOS)
// ========================================

// Variables para manejar tooltips
let activeTooltip = null;
let tooltipTimeout = null;

// Mostrar tooltip de información
function showInfo(button, tooltipId) {
  const tooltip = document.getElementById(tooltipId);
  
  // Si hay otro tooltip activo, cerrarlo
  if (activeTooltip && activeTooltip !== tooltip) {
    activeTooltip.classList.remove('show');
    clearTimeout(tooltipTimeout);
  }
  
  // Toggle del tooltip actual
  if (tooltip.classList.contains('show')) {
    tooltip.classList.remove('show');
    activeTooltip = null;
    clearTimeout(tooltipTimeout);
  } else {
    tooltip.classList.add('show');
    activeTooltip = tooltip;
    
    // Auto-cerrar después de 5 segundos
    tooltipTimeout = setTimeout(() => {
      tooltip.classList.remove('show');
      activeTooltip = null;
    }, 5000);
  }
}

// Cerrar tooltips al hacer clic fuera o presionar Escape
document.addEventListener('click', function(e) {
  if (activeTooltip && !e.target.classList.contains('info-btn') && !e.target.closest('.info-tooltip')) {
    activeTooltip.classList.remove('show');
    activeTooltip = null;
    clearTimeout(tooltipTimeout);
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && activeTooltip) {
    activeTooltip.classList.remove('show');
    activeTooltip = null;
    clearTimeout(tooltipTimeout);
  }
});

// Abrir modal de calculadora
function openCalcModal(calcType) {
  const modal = document.getElementById(`calcModal-${calcType}`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

// Cerrar modal de calculadora
function closeCalcModal(calcType) {
  const modal = document.getElementById(`calcModal-${calcType}`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Cerrar tooltip activo si hay
    if (activeTooltip) {
      activeTooltip.classList.remove('show');
      activeTooltip = null;
      clearTimeout(tooltipTimeout);
    }
  }
}
