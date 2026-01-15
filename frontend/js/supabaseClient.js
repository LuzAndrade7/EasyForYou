const SUPABASE_URL = "https://fvmejltzjuqjmkuhtdvw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2bWVqbHR6anVxam1rdWh0ZHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyODAwNTYsImV4cCI6MjA4Mzg1NjA1Nn0.KHajKfOrNAcvRjuvi79OAkPPEYlCh5FhjUH_J5fJdeY";

// Inicializar cliente de Supabase y hacerlo global
// El CDN de Supabase v2 expone: window.supabase.createClient
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase client initialized:", window.supabaseClient ? "OK" : "FAILED");
