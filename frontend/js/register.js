// Register script - Firebase version
const msg = document.getElementById("msg");

// Obtener los clientes de Firebase
const auth = window.firebaseAuth;
const db = window.firebaseDb;

function setMsg(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "crimson" : "green";
  console.log(isError ? "ERROR:" : "INFO:", text);
}

// Verificar que Firebase está disponible
if (!auth || !db) {
  console.error("Firebase not initialized! auth:", auth, "db:", db);
  setMsg("Error: No se pudo conectar con el servidor. Recarga la página.", true);
} else {
  console.log("Firebase ready for registration");
}

// REGISTRO
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  console.log("Attempting registration for:", email);

  // Validaciones básicas
  if (!name || !email || !password) {
    setMsg("Por favor completa todos los campos", true);
    return;
  }

  if (password.length < 6) {
    setMsg("La contraseña debe tener al menos 6 caracteres", true);
    return;
  }

  try {
    setMsg("Creando cuenta...");

    // 1) Crear usuario en Firebase Auth
    console.log("Step 1: Creating auth user...");
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Auth user created:", user.uid);

    // 2) Actualizar el nombre del usuario en Auth
    console.log("Step 2: Updating profile...");
    await user.updateProfile({
      displayName: name
    });

    console.log("Profile updated");

    // 3) Guardar perfil en Firestore (colección profiles)
    console.log("Step 3: Creating Firestore profile...");
    await db.collection("profiles").doc(user.uid).set({
      name: name,
      email: email,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Firestore profile created successfully");

    setMsg("✅ Cuenta creada exitosamente. Redirigiendo al login...", false);
    
    // Cerrar sesión para que el usuario inicie sesión manualmente
    await auth.signOut();
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);

  } catch (err) {
    console.error("Registration error:", err.code, err.message);
    
    // Mensajes de error más amigables
    let errorMsg = "Error al registrarse: " + err.message;
    
    switch(err.code) {
      case "auth/email-already-in-use":
        errorMsg = "Este correo ya está registrado. Intenta iniciar sesión.";
        break;
      case "auth/weak-password":
        errorMsg = "La contraseña debe tener al menos 6 caracteres.";
        break;
      case "auth/invalid-email":
        errorMsg = "El formato del correo no es válido.";
        break;
      case "auth/network-request-failed":
        errorMsg = "Error de red. Verifica tu conexión a internet.";
        break;
      case "auth/operation-not-allowed":
        errorMsg = "El registro con email/password no está habilitado en Firebase.";
        break;
    }
    
    setMsg(errorMsg, true);
  }
});
