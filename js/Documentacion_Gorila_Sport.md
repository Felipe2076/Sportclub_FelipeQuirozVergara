# 🦍 DOCUMENTACIÓN COMPLETA: SISTEMA GORILA SPORT

Este documento detalla exhaustivamente la arquitectura, flujos de trabajo y tecnologías implementadas en el proyecto "Gorila Sport". Está diseñado para servir como contexto completo para cualquier desarrollador o agente de Inteligencia Artificial que busque replicar, escalar o modificar la aplicación aplicando nuevos estilos visuales.

---

## 1. RESUMEN DEL PROYECTO
**Gorila Sport** es una aplicación web (simulando una Single Page Application) para la gestión integral de un club deportivo. Permite el registro y autenticación de usuarios, gestión de perfiles mediante tres roles distintos (Atleta, Entrenador y Administrador), y visualización de métricas dinámicas (dashboards).

La arquitectura es completamente desacoplada: el Frontend (HTML, CSS y JS puro) se comunica con el Backend (Node.js/Express) exclusivamente a través de una API REST consumiendo e intercambiando datos en formato JSON.

---

## 2. ARQUITECTURA DEL FRONTEND (Cliente)
El frontend ha sido construido sin frameworks pesados (Vanilla JavaScript) para maximizar el rendimiento y entendimiento del DOM. Se divide en módulos lógicos:

### A. Capa de Red e Intercepción (`js/api.js`)
Es el núcleo de comunicación. Contiene la función `apiRequest()` que estandariza todas las llamadas al backend. 
**Características estrella:**
- **Inyección de Headers:** Automáticamente añade `Content-Type`, la `X-API-Key` y el token `Authorization: Bearer <token>` si la petición lo requiere.
- **Simulador Estático (Mocking):** Cuenta con la función `isStaticHost()`. Si detecta que la app se está ejecutando desde *GitHub Pages* o desde el sistema de archivos local (`file:`), intercepta la llamada y ejecuta `handleStaticSimulation()`. Esto devuelve Promesas simuladas con datos falsos (mocks), permitiendo probar la interfaz gráfica y los dashboards sin necesidad de tener el backend de Node.js encendido.

### B. Capa de Autenticación (`js/auth.js`)
- Captura los eventos `submit` de los formularios de registro (`register.html`) y login (`login.html`).
- Utiliza `FormData` para extraer los valores de forma limpia.
- Realiza validaciones básicas en el cliente (ej. longitud de contraseña).
- Tras una respuesta exitosa de la API, guarda el `token` JWT y los datos del usuario (`gorilaUser`) en el `localStorage` del navegador.
- Redirige dinámicamente según el rol a `dashboard_admin.html`, `dashboard_coach.html` o `dashboard_usuario.html`.

### C. Capa de Interfaz y Dashboards (`js/dashboard.js`)
- **Protección de rutas (`requireAuth`):** Al cargar la página, verifica si existe un token en el `localStorage`. Si no existe, expulsa al usuario a `login.html`.
- **Renderizado Dinámico:** Solicita los datos al endpoint `/api/dashboard` y, dependiendo del rol, inyecta fragmentos de HTML directamente en el DOM (`cardsContainer.innerHTML` y `extraContainer.innerHTML`).
- **Gestor CRUD en el Cliente:** Contiene las funciones globales (`window.showAddUserForm`, `window.saveUser`, `window.deleteUser`) que construyen y manejan el formulario para que el Administrador pueda crear, editar y eliminar usuarios interactuando directamente con el DOM y la API, refrescando la vista sin recargar la página.

---

## 3. ARQUITECTURA DEL BACKEND (Servidor)
El backend está construido con **Node.js** y **Express**. Es una API RESTful stateless (sin estado).

### A. Persistencia de Datos (Base de Datos)
En lugar de usar un motor de BD complejo como PostgreSQL o MongoDB, el sistema utiliza un archivo JSON estático ubicado en `backend/db/users.json`. El servidor lee y escribe asíncronamente en este archivo para registrar, actualizar o eliminar usuarios, asegurando persistencia real.

### B. Seguridad y Autenticación
- **Encriptación:** Las contraseñas NUNCA se guardan en texto plano. Se utiliza la librería `bcrypt` (con 10 salt rounds) para hashearlas antes de guardarlas en `users.json`.
- **Tokens JWT:** Al iniciar sesión o registrarse exitosamente, el servidor genera un Token y lo envía al frontend. Este token debe enviarse en todas las peticiones protegidas.
- **Middlewares:**
  - `authMiddleware`: Verifica que el token enviado en la cabecera sea válido y no haya expirado.
  - `adminMiddleware`: Bloquea ciertas rutas (como borrar un usuario) si el rol del solicitante no es "Admin".

### C. Principales Endpoints de la API
1. `POST /api/register`: Recibe datos de un nuevo usuario, verifica que el email no exista, encripta la contraseña, guarda en JSON y devuelve un token.
2. `POST /api/login`: Comprueba las credenciales contra la base de datos, compara los hashes de las contraseñas y devuelve un token.
3. `GET /api/dashboard`: Un endpoint inteligente que, basado en el rol de quien lo solicita, devuelve un JSON distinto (estadísticas para atletas, métricas grupales para coaches, paneles de control para administradores).
4. `POST / PUT / DELETE /api/users`: Endpoints exclusivos para administradores para gestionar la base de datos de usuarios (CRUD).

---

## 4. SISTEMA DE ROLES (RBAC)
El sistema maneja las interfaces basándose en 3 perfiles distintos:

1. **Atleta (`User`):**
   - Dashboard enfocado en estadísticas individuales (sesiones esta semana, calorías, récords).
   - Ve su cumplimiento de objetivos y próximos entrenamientos.

2. **Entrenador (`Coach`):**
   - Panel de control de equipo.
   - Ve listas de atletas activos, progreso individual (porcentajes) y estados de advertencia (ej: "Requiere revisión" o "Excelente").
   - Métricas grupales (Rendimiento promedio, entrenamientos planificados).

3. **Administrador (`Admin`):**
   - Control total de la plataforma.
   - Monitoreo del estado del servidor.
   - Interfaz embebida para listar todos los usuarios en formato tabla, añadir nuevas cuentas (asignando roles) y dar de baja (eliminar) perfiles de forma definitiva.

---

## 5. RECOMENDACIONES PARA EL RE-DISEÑO (Para tu Compañera)
Si deseas implementar este mismo sistema pero con tu propio estilo visual, sigue estos pasos:

1. **Mantén los IDs de HTML:** El frontend (`auth.js` y `dashboard.js`) interactúa fuertemente con identificadores específicos (ej: `login-form`, `email`, `password`, `dashboard-title`, `dashboard-cards`, `extra-container`). Si creas tus propios HTML, asegúrate de conservar esos `id` o actualizarlos en el JavaScript.
2. **Cambia el CSS libremente:** Puedes eliminar por completo `styles.css` y crear el tuyo propio (por ejemplo, con TailwindCSS, Bootstrap o tu CSS personalizado). La lógica de JavaScript seguirá funcionando siempre que los formularios existan.
3. **Edita el Renderizado HTML en JS:** En el archivo `dashboard.js`, la lógica inyecta HTML (etiquetas `<article>`, `<table>`, etc.) usando _Template Literals_ (comillas invertidas). Puedes modificar esas líneas de HTML para que coincidan con los nombres de clases (classnames) de tu nuevo diseño.
4. **Prueba rápida:** Sube el proyecto a GitHub Pages. Gracias a la función `handleStaticSimulation()` en `api.js`, podrás ver cómo tu diseño se adapta dinámicamente a los 3 roles sin necesidad de configurar ni encender el backend de Node.js.

---
*Documento generado a partir del repositorio de Gorila Sport.*