// Login script
const msg = document.getElementById("msg");

// Obtener el cliente de Supabase
const sb = window.supabaseClient;

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
}

// Verificar que Supabase está disponible
if (!sb) {
  console.error("Supabase client not initialized!");
  setMsg("Error: No se pudo conectar con el servidor", true);
}

// Verificar si ya hay sesión activa
async function checkSession() {
  try {
    const { data: { user }, error } = await sb.auth.getUser();
    if (error) {
      console.log("No active session");
      return;
    }
    
    if (user) {
      // Si ya está logueado, verificar si tiene mascota
      const { data: avatar } = await sb
        .from("avatars")
        .select("pet_name")
        .eq("user_id", user.id)
        .single();

      if (avatar && avatar.pet_name) {
        window.location.href = "./app.html";
      } else {
        window.location.href = "./pet-selection.html";
      }
    }
  } catch (err) {
    console.log("Session check error:", err);
  }
}

// LOGIN
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("logEmail").value.trim();
  const password = document.getElementById("logPassword").value;

  try {
    setMsg("Iniciando sesión...");

    const { data, error } = await sb.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;

    console.log("Login successful:", data.user.email);

    // Verificar si el usuario ya tiene avatar con nombre
    const { data: avatar } = await sb
      .from("avatars")
      .select("pet_name")
      .eq("user_id", data.user.id)
      .single();

    setMsg("Login exitoso. Entrando...", false);

    // Redirigir según si tiene mascota o no
    if (avatar && avatar.pet_name) {
      window.location.href = "./app.html";
    } else {
      window.location.href = "./pet-selection.html";
    }
  } catch (err) {
    console.error("Login error:", err);
    
    // Mensajes de error más amigables
    let errorMsg = err.message || "Error al iniciar sesión";
    if (errorMsg.includes("Email not confirmed")) {
      errorMsg = "Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.";
    } else if (errorMsg.includes("Invalid login credentials")) {
      errorMsg = "Correo o contraseña incorrectos.";
    }
    
    setMsg("❌ " + errorMsg, true);
  }
});

// Verificar sesión al cargar
checkSession();
