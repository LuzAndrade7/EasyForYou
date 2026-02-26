// Login script - Firebase version
const msg = document.getElementById("msg");

// Obtener los clientes de Firebase
const auth = window.firebaseAuth;
const db = window.firebaseDb;

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
}

// Verificar que Firebase está disponible
if (!auth || !db) {
  console.error("Firebase not initialized!");
  setMsg("Error: No se pudo conectar con el servidor", true);
}

// Verificar si ya hay sesión activa
async function checkSession() {
  try {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Si ya está logueado, verificar si tiene mascota
        const avatarDoc = await db.collection("avatars").doc(user.uid).get();
        const avatar = avatarDoc.data();

        if (avatar && avatar.pet_name) {
          window.location.href = "./app.html";
        } else {
          window.location.href = "./pet-selection.html";
        }
      }
    });
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

    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Login successful:", user.email);

    // Verificar si el usuario ya tiene avatar con nombre
    const avatarDoc = await db.collection("avatars").doc(user.uid).get();
    const avatar = avatarDoc.data();

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
    if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
      errorMsg = "Correo o contraseña incorrectos.";
    } else if (err.code === "auth/invalid-email") {
      errorMsg = "El formato del correo no es válido.";
    } else if (err.code === "auth/too-many-requests") {
      errorMsg = "Demasiados intentos fallidos. Intenta más tarde.";
    }
    
    setMsg(errorMsg, true);
  }
});

// Verificar sesión al cargar
checkSession();
