// Auth script - Firebase version (legacy file, use login.js and register.js instead)
const auth = window.firebaseAuth;
const db = window.firebaseDb;

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

    // 1) Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2) Guardar perfil en Firestore
    await db.collection("profiles").doc(user.uid).set({
      name: name,
      email: email,
      created_at: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 3) Crear avatar por defecto (animal 1)
    await db.collection("avatars").doc(user.uid).set({
      user_id: user.uid,
      animal_type: 1,
      level: 1,
      xp: 0
    });

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

    await auth.signInWithEmailAndPassword(email, password);

    setMsg("✅ Login exitoso. Entrando...", false);

    // Redirigir al dashboard
    window.location.href = "./app.html";
  } catch (err) {
    console.error(err);
    setMsg("❌ " + (err.message || "Error al iniciar sesión"), true);
  }
});
