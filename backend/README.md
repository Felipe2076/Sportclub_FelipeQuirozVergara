# Gorila Sport Backend

## Instalación

1. Abre el terminal en `c:\Users\aixav\Sportclub_Felipe\backend`.
2. Ejecuta `npm install`.
3. Ejecuta `npm start`.

## Endpoints disponibles

- `POST /api/register` — registra un nuevo usuario.
- `POST /api/login` — inicia sesión con email y contraseña.
- `GET /api/dashboard` — obtiene datos del dashboard según el rol.
- `GET /api/profile` — obtiene datos del perfil autenticado.

## Uso

- El frontend llama a `http://localhost:4000/api`.
- Guarda el token en `localStorage` y usa headers `Authorization: Bearer <token>`.
- El backend almacena usuarios en `backend/db/users.json`.
