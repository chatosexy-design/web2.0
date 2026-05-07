- BUG Crítico: Login con Google entra en ciclo, no hidrata perfil y no muestra código parental
Tipo

- Bug
Prioridad

- P1 - Alta
Estado sugerido

- Open
Resumen

- Al iniciar sesión con Google, el usuario entra en un ciclo entre pantallas de autenticación/registro y no queda estable en Dashboard .
- En varios casos el perfil no se hidrata correctamente (rol/ studentId ) y el código parental no aparece en la vista de alumno.
- El impacto bloquea flujo principal: autenticación + uso de dashboard + trazabilidad parental.
Entorno

- Frontend: React + Vite
- Backend: Node/Express
- Auth/DB: Supabase
- Navegador: Chrome/Edge (Windows)
- Rutas afectadas: /login , /register , /dashboard , /cafeteria
Pasos para reproducir

1. Abrir app en localhost .
2. Ir a Iniciar sesión .
3. Elegir Continuar con Google .
4. Seleccionar cuenta Google.
5. Regresar a la app.
Resultado actual

- Queda en ciclo login/registro o no aterriza consistentemente en dashboard.
- En algunos casos no se sincroniza bien el perfil de estudiante.
- No aparece parent_access_code en la experiencia esperada del usuario.
Resultado esperado

- Si el usuario ya tiene perfil: redirigir directo a Dashboard .
- Si no tiene perfil: redirigir a Register una sola vez para completar datos.
- Al completar login/perfil:
  - sesión válida y estable,
  - studentId presente,
  - parent_access_code generado y visible.
Impacto

- Bloqueo de onboarding.
- Imposible usar correctamente dashboard/consumo.
- Portal de padres no utilizable por ausencia de código.
Evidencia técnica / áreas afectadas

- Flujo OAuth y redirecciones: App.tsx
- Login Google: Login.tsx
- Registro y emisión de token: auth.ts
- Middleware de autorización y compatibilidad de token: auth.ts
- Obtención de perfil/código parental: students.ts
Hipótesis raíz (para investigación)

- Inconsistencia de roles ( student vs STUDENT ) en comparación de autorizaciones.
- Mezcla de tipos de token (JWT interno vs access token Supabase OAuth) en rutas protegidas.
- Hidratación parcial de studentId y perfil en eventos onAuthStateChange .
- Posible dependencia de sesión anterior en localStorage que rompe flujo nuevo.