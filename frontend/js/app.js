// Dashboard App script
const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

// Obtener el cliente de Supabase
const sb = window.supabaseClient;

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
  const { data: { user }, error } = await sb.auth.getUser();
  if (error) console.error(error);

  if (!user) {
    window.location.href = "./index.html";
    return;
  }

  // Verificar si tiene mascota
  const { data: avatar } = await sb
    .from("avatars")
    .select("animal_type, pet_name, level, xp")
    .eq("user_id", user.id)
    .single();

  if (!avatar || !avatar.pet_name) {
    // No tiene mascota, ir a selección
    window.location.href = "./pet-selection.html";
    return;
  }

  // Traer perfil
  const { data: profile, error: e2 } = await sb
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (e2) {
    console.error(e2);
    welcome.textContent = `Hola 👋`;
  } else {
    welcome.textContent = `Hola, ${profile.name} 👋`;
  }

  // Cargar información del usuario
  const userInfo = document.getElementById("userInfo");
  userInfo.innerHTML = `
    <p><strong>Nombre:</strong> ${profile?.name || "N/A"}</p>
    <p><strong>Correo:</strong> ${profile?.email || user.email}</p>
  `;

  // Cargar información de la mascota
  const petInfo = document.getElementById("petInfo");
  petInfo.innerHTML = `
    <div class="pet-display">
      <img src="${animalImages[avatar.animal_type]}" alt="${animalNames[avatar.animal_type]}" class="pet-avatar" />
      <div class="pet-details">
        <h3>${avatar.pet_name}</h3>
        <p><strong>Tipo:</strong> ${animalNames[avatar.animal_type]}</p>
        <p><strong>Nivel:</strong> ${avatar.level}</p>
        <p><strong>Experiencia:</strong> ${avatar.xp} XP</p>
      </div>
    </div>
  `;
}

// Manejar pestañas
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
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
  await sb.auth.signOut();
  window.location.href = "./index.html";
});

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
    resultadoDiv.innerHTML = `<div class="resultado-valor" style="font-size: 16px; color: #ffcccc;">⚠️ Por favor ingresa valores válidos</div>`;
    resultadoDiv.classList.add("show");
    return;
  }

  if (costo >= precioVenta) {
    resultadoDiv.innerHTML = `
      <div class="resultado-label">⚠️ Atención</div>
      <div class="resultado-valor" style="font-size: 18px;">El costo es mayor o igual al precio de venta</div>
      <div class="resultado-info">No hay margen de ganancia positivo</div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const margen = ((precioVenta - costo) / precioVenta) * 100;
  const gananciaUnidad = precioVenta - costo;

  resultadoDiv.innerHTML = `
    <div class="resultado-label">Tu margen de ganancia es:</div>
    <div class="resultado-valor">${margen.toFixed(2)}%</div>
    <div class="resultado-info">Ganas $${gananciaUnidad.toFixed(2)} por cada venta</div>
  `;
  resultadoDiv.classList.add("show");
}

// Calculadora: Precio de Venta Unitario
// Fórmula: (Costo Total / Unidades) × (1 + Margen/100)
function calcularPrecioVenta() {
  const costoTotal = parseFloat(document.getElementById("pv-costoTotal").value);
  const unidades = parseFloat(document.getElementById("pv-unidades").value);
  const margen = parseFloat(document.getElementById("pv-margen").value);
  const resultadoDiv = document.getElementById("resultado-precioVenta");

  if (isNaN(costoTotal) || isNaN(unidades) || isNaN(margen) || unidades <= 0) {
    resultadoDiv.innerHTML = `<div class="resultado-valor" style="font-size: 16px; color: #ffcccc;">⚠️ Por favor ingresa valores válidos</div>`;
    resultadoDiv.classList.add("show");
    return;
  }

  const costoUnitario = costoTotal / unidades;
  const precioVenta = costoUnitario * (1 + margen / 100);
  const gananciaUnitaria = precioVenta - costoUnitario;

  resultadoDiv.innerHTML = `
    <div class="resultado-label">Precio de venta sugerido:</div>
    <div class="resultado-valor">$${precioVenta.toFixed(2)}</div>
    <div class="resultado-info">
      Costo unitario: $${costoUnitario.toFixed(2)}<br>
      Ganancia por unidad: $${gananciaUnitaria.toFixed(2)}
    </div>
  `;
  resultadoDiv.classList.add("show");
}

// Calculadora: Punto de Equilibrio
// Fórmula: Costos Fijos / (Precio de Venta - Costo Variable Unitario)
function calcularPuntoEquilibrio() {
  const costosFijos = parseFloat(document.getElementById("pe-costosFijos").value);
  const precioVenta = parseFloat(document.getElementById("pe-precioVenta").value);
  const costoVariable = parseFloat(document.getElementById("pe-costoVariable").value);
  const resultadoDiv = document.getElementById("resultado-puntoEquilibrio");

  if (isNaN(costosFijos) || isNaN(precioVenta) || isNaN(costoVariable)) {
    resultadoDiv.innerHTML = `<div class="resultado-valor" style="font-size: 16px; color: #ffcccc;">⚠️ Por favor ingresa valores válidos</div>`;
    resultadoDiv.classList.add("show");
    return;
  }

  const margenContribucion = precioVenta - costoVariable;

  if (margenContribucion <= 0) {
    resultadoDiv.innerHTML = `
      <div class="resultado-label">⚠️ Error</div>
      <div class="resultado-valor" style="font-size: 16px;">El precio de venta debe ser mayor al costo variable</div>
    `;
    resultadoDiv.classList.add("show");
    return;
  }

  const puntoEquilibrio = costosFijos / margenContribucion;
  const ventasEquilibrio = puntoEquilibrio * precioVenta;

  resultadoDiv.innerHTML = `
    <div class="resultado-label">Punto de equilibrio:</div>
    <div class="resultado-valor">${Math.ceil(puntoEquilibrio)} unidades</div>
    <div class="resultado-info">
      Debes vender al menos ${Math.ceil(puntoEquilibrio)} unidades<br>
      para cubrir tus costos (= $${ventasEquilibrio.toFixed(2)} en ventas)
    </div>
  `;
  resultadoDiv.classList.add("show");
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
let activeTooltip = null;
let tooltipTimeout = null;

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
// Cargar al iniciar
loadUser();
