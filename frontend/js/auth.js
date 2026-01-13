const supabase = window.supabaseClient;

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const msg = document.getElementById("msg");

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
}

// REGISTRO
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    setMsg("Creando cuenta...");

    // 1) Crear usuario en Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    // OJO: si tu Supabase pide confirmar email, data.user existe,
    // pero la sesión puede venir null. Igual guardamos perfil.
    const userId = data.user?.id;
    if (!userId) {
      setMsg("Cuenta creada. Revisa tu correo para confirmar.", false);
      return;
    }

    // 2) Guardar perfil (tabla profiles)
    const { error: e2 } = await supabase.from("profiles").insert({
      id: userId,
      name,
      email
    });
    if (e2) throw e2;

    // 3) Crear avatar por defecto (animal 1)
    const { error: e3 } = await supabase.from("avatars").insert({
      user_id: userId,
      animal_type: 1,
      level: 1,
      xp: 0
    });
    if (e3) throw e3;

    setMsg("✅ Cuenta creada. Ahora inicia sesión.", false);
    registerForm.reset();
  } catch (err) {
    console.error(err);
    setMsg("❌ " + (err.message || "Error al registrarse"), true);
  }
});

// LOGIN
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("logEmail").value.trim();
  const password = document.getElementById("logPassword").value;

  try {
    setMsg("Iniciando sesión...");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    setMsg("✅ Login exitoso. Entrando...", false);

    // Redirigir al dashboard
    window.location.href = "./app.html";
  } catch (err) {
    console.error(err);
    setMsg("❌ " + (err.message || "Error al iniciar sesión"), true);
  }
});
