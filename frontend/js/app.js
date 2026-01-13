const supabase = window.supabaseClient;

const welcome = document.getElementById("welcome");
const logoutBtn = document.getElementById("logoutBtn");

async function loadUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  if (!user) {
    // Si no hay sesión, vuelve al login
    window.location.href = "./index.html";
    return;
  }

  // Traer perfil
  const { data: profile, error: e2 } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (e2) {
    console.error(e2);
    welcome.textContent = `Hola 👋`;
    return;
  }

  welcome.textContent = `Hola, ${profile.name} (${profile.email}) 👋`;
}

logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "./index.html";
});

loadUser();
