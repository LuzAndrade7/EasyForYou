// Register script
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

// REGISTRO
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    setMsg("Creando cuenta...");

    // 1) Crear usuario en Auth
    const { data, error } = await sb.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      // Manejar rate limit
      if (error.message.includes("security purposes")) {
        setMsg("Por seguridad, espera unos segundos e intenta de nuevo.", true);
        return;
      }
      throw error;
    }

    console.log("SignUp response:", data);

    const userId = data.user?.id;
    
    // Verificar si el email necesita confirmación
    if (data.user && !data.session) {
      setMsg("Cuenta creada. Revisa tu correo para confirmar tu email.", false);
      return;
    }
    
    if (!userId) {
      setMsg("Error al crear cuenta. Intenta de nuevo.", true);
      return;
    }

    // 2) Guardar perfil (tabla profiles)
    const { error: e2 } = await sb.from("profiles").insert({
      id: userId,
      name,
      email
    });
    
    if (e2) {
      console.error("Profile insert error:", e2);
      // Continuar aunque falle el perfil
    } else {
      console.log("Profile created successfully");
    }

    setMsg("Cuenta creada exitosamente. Redirigiendo al login...", false);
    
    // Redirigir al login después de 2 segundos (index en la raíz)
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);

  } catch (err) {
    console.error("Registration error:", err);
    
    // Mensajes de error más amigables
    let errorMsg = err.message || "Error al registrarse";
    if (errorMsg.includes("already registered") || errorMsg.includes("User already registered")) {
      errorMsg = "Este correo ya está registrado. Intenta iniciar sesión.";
    } else if (errorMsg.includes("duplicate key") || errorMsg.includes("unique constraint")) {
      errorMsg = "Este correo ya está en uso. Intenta con otro.";
    }
    
    setMsg(errorMsg, true);
  }
});
