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
  1: "../images/CONEJO MUESTRA .jpeg",
  2: "../images/GATO MUESTRA.jpeg",
  3: "../images/PERRO MUESTRA .jpeg",
  4: "../images/CERDITO MUESTRA.jpeg",
  5: "../images/GALLO MUESTRA.jpeg"
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

// Cargar al iniciar
loadUser();
