// Register script - Firebase version
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

// REGISTRO
const registerForm = document.getElementById("registerForm");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;

  try {
    setMsg("Creando cuenta...");

    // 1) Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("SignUp response:", user);

    // 2) Actualizar el nombre del usuario en Auth
    await user.updateProfile({
      displayName: name
    });

    // 3) Guardar perfil en Firestore (colección profiles)
    await db.collection("profiles").doc(user.uid).set({
      name: name,
      email: email,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log("Profile created successfully");

    setMsg("Cuenta creada exitosamente. Redirigiendo al login...", false);
    
    // Cerrar sesión para que el usuario inicie sesión manualmente
    await auth.signOut();
    
    // Redirigir al login después de 2 segundos (index en la raíz)
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 2000);

  } catch (err) {
    console.error("Registration error:", err);
    
    // Mensajes de error más amigables
    let errorMsg = err.message || "Error al registrarse";
    if (err.code === "auth/email-already-in-use") {
      errorMsg = "Este correo ya está registrado. Intenta iniciar sesión.";
    } else if (err.code === "auth/weak-password") {
      errorMsg = "La contraseña debe tener al menos 6 caracteres.";
    } else if (err.code === "auth/invalid-email") {
      errorMsg = "El formato del correo no es válido.";
    }
    
    setMsg(errorMsg, true);
  }
});
