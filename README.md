# EasyForYou 🐾📚

EasyForYou es una aplicación web educativa dirigida a estudiantes de colegio, cuyo objetivo es apoyar el aprendizaje mediante contenidos interactivos y un sistema de progreso visual basado en un animalito virtual.

Cada estudiante puede registrarse, elegir un animal, avanzar por los contenidos de la asignatura y ver cómo su animal sube de nivel conforme completa los temas. Además, la aplicación incluye una calculadora académica y un historial donde se guardan los resultados (Arch).

---

## 🎯 Objetivo del proyecto

Desarrollar una plataforma web sencilla y amigable que:

- Permita la gestión de usuarios (registro e inicio de sesión).
- Fomente la motivación del estudiante mediante progreso visual (gamificación).
- Centralice contenidos académicos.
- Incluya herramientas de apoyo como una calculadora y registro de resultados.

---

## 🧩 Funcionalidades principales

- Registro e inicio de sesión (Email + contraseña).
- Selección de un animal virtual (5 tipos disponibles).
- Sistema de niveles (hasta 5 niveles por animal).
- Visualización del progreso del estudiante.
- Acceso a contenidos de la asignatura y marcado de temas completados.
- Calculadora con fórmulas académicas.
- Historial de cálculos guardados (Arch).

---

## 🛠️ Tecnologías utilizadas (stack final)

### Frontend

- HTML
- CSS
- JavaScript (Vanilla)

### Backend/DB como servicio

- **Supabase** (Auth + PostgreSQL + API)

### Publicación

- **GitHub Pages** (sitio web)

---

## ▶️ Cómo ejecutar el proyecto (local)

### Opción A: abrir el archivo directamente

1. Entra a la carpeta `frontend/`
2. Abre `index.html` con doble clic

> Nota: si el navegador bloquea algunas funciones, usa la opción B.

### Opción B (recomendada): servidor local simple

Desde la carpeta `frontend/`:

```bash
python -m http.server 5500


```

Luego abre:

http://localhost:5500

---

## Estructura del proyecto

EasyForYou/
│
├── frontend/ # Sitio web (HTML, CSS, JS)
├── backend/ # (No usado en la versión final) Experimentos con Node/Express
└── README.md

---

## 🔐 Configuración de Supabase

En frontend/js/supabaseClient.js se configuran:

SUPABASE_URL

SUPABASE_ANON_KEY

Estas credenciales se obtienen en Supabase:
Project Settings → API.
