// Pet Selection script - Firebase version
const msg = document.getElementById("msg");
const petGrid = document.getElementById("petGrid");
const petNameSection = document.getElementById("petNameSection");
const petNameInput = document.getElementById("petName");
const confirmPetBtn = document.getElementById("confirmPetBtn");

// Obtener los clientes de Firebase
const auth = window.firebaseAuth;
const db = window.firebaseDb;

let selectedAnimal = null;

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
}

// Verificar que Firebase está disponible
if (!auth || !db) {
  console.error("Firebase not initialized!");
  setMsg("Error: No se pudo conectar con el servidor", true);
}

// Verificar sesión y si ya tiene mascota
async function checkUserAndPet() {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // No hay sesión, ir al login (index en la raíz)
      window.location.href = "../index.html";
      return;
    }

    // Verificar si ya tiene mascota con nombre
    const avatarDoc = await db.collection("avatars").doc(user.uid).get();
    const avatar = avatarDoc.data();

    if (avatar && avatar.pet_name) {
      // Ya tiene mascota, ir al dashboard
      window.location.href = "./app.html";
      return;
    }
  });
}

// Bloquear mascotas que no son gato (solo gato disponible en demo)
function initPetOptions() {
  const options = document.querySelectorAll('.pet-option');
  console.log('Inicializando opciones de mascota, encontradas:', options.length);
  
  options.forEach(opt => {
    const animalType = parseInt(opt.dataset.animal);
    // Solo el gato (animal_type = 2) está disponible
    if (animalType !== 2) {
      opt.classList.add('locked');
      opt.style.opacity = '0.5';
      opt.style.cursor = 'not-allowed';
      opt.style.position = 'relative';
      // Agregar badge de "Próximamente"
      if (!opt.querySelector('.demo-badge')) {
        const badge = document.createElement('span');
        badge.className = 'demo-badge';
        badge.textContent = '🔒 Próximamente';
        badge.style.cssText = 'position:absolute;top:5px;right:5px;background:#666;color:white;padding:3px 8px;border-radius:10px;font-size:9px;z-index:10;';
        opt.appendChild(badge);
      }
    }
  });
}

// Inicializar opciones bloqueadas cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPetOptions);
} else {
  initPetOptions();
}

// Manejar selección de mascota
petGrid.addEventListener("click", (e) => {
  const petOption = e.target.closest(".pet-option");
  if (!petOption) return;

  // Verificar si está bloqueado (no es gato)
  const animalType = parseInt(petOption.dataset.animal);
  if (animalType !== 2) {
    setMsg("⚠️ Esta mascota estará disponible próximamente. Por ahora solo puedes elegir el Gato.", true);
    return;
  }

  // Quitar selección anterior
  document.querySelectorAll(".pet-option").forEach(opt => {
    opt.classList.remove("selected");
  });

  // Seleccionar nueva
  petOption.classList.add("selected");
  selectedAnimal = parseInt(petOption.dataset.animal);

  // Mostrar sección de nombre
  petNameSection.style.display = "block";
  petNameInput.focus();
});

// Habilitar botón cuando hay nombre
petNameInput.addEventListener("input", () => {
  confirmPetBtn.disabled = petNameInput.value.trim().length === 0;
});

// Confirmar mascota
confirmPetBtn.addEventListener("click", async () => {
  if (!selectedAnimal || !petNameInput.value.trim()) {
    setMsg("Por favor selecciona una mascota y dale un nombre", true);
    return;
  }

  try {
    setMsg("Guardando tu mascota...");
    confirmPetBtn.disabled = true;

    const user = auth.currentUser;
    if (!user) throw new Error("No hay sesión activa");

    // Primero asegurar que existe el perfil
    const profileDoc = await db.collection("profiles").doc(user.uid).get();

    if (!profileDoc.exists) {
      // Crear perfil si no existe
      await db.collection("profiles").doc(user.uid).set({
        name: user.displayName || user.email?.split('@')[0] || "Usuario",
        email: user.email,
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    // Verificar si ya existe un avatar para este usuario
    const avatarDoc = await db.collection("avatars").doc(user.uid).get();

    if (avatarDoc.exists) {
      // Actualizar avatar existente
      await db.collection("avatars").doc(user.uid).update({
        animal_type: selectedAnimal,
        pet_name: petNameInput.value.trim()
      });
    } else {
      // Crear nuevo avatar (con arrays vacíos para quizzes y cálculos)
      await db.collection("avatars").doc(user.uid).set({
        user_id: user.uid,
        animal_type: selectedAnimal,
        pet_name: petNameInput.value.trim(),
        level: 0,
        xp: 0,
        completedQuizzes: [],
        calculosHistorial: []
      });
      
      // Guardar ID del usuario (la limpieza se hace en app.js)
      localStorage.setItem('lastUserId', user.uid);
    }

    setMsg("¡Mascota guardada! Entrando al dashboard...", false);

    // Ir al dashboard
    setTimeout(() => {
      window.location.href = "./app.html";
    }, 1500);

  } catch (err) {
    console.error(err);
    setMsg("❌ " + (err.message || "Error al guardar mascota"), true);
    confirmPetBtn.disabled = false;
  }
});

// Verificar al cargar
checkUserAndPet();
