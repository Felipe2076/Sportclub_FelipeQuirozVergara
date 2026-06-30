# SportClub - Gorila SportClub

**Integrante:** Felipe Quiroz Vergara

Aplicación web SPA para la gestión de un gimnasio/centro deportivo, desarrollada con React + Vite y Node.js/Express.

## Tecnologías utilizadas

- **Frontend:** React 19, Vite, React-Bootstrap, SweetAlert2, Axios, React Router
- **Backend:** Node.js, Express, JWT, bcryptjs
- **Estilos:** CSS personalizado con glassmorphism, Bootstrap 5

## Requisitos previos

- Node.js 18+
- npm o pnpm

## Instalación de dependencias

```bash
# Con npm (raíz del proyecto)
npm install
cd backend && npm install

# Con pnpm (raíz del proyecto, instala backend automáticamente)
pnpm install
```

## Cómo ejecutar

```bash
# Frontend + backend simultáneamente (puerto 5173 + 4000)
npm run dev:all

# O por separado:
npm run dev          # Frontend en http://localhost:5173
npm run dev:backend  # Backend en http://localhost:4000
```

El backend corre en `http://localhost:4000`.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin1@demo.cl | 12345678 |
| Coach | coach1@demo.cl | 12345678 |
| Usuario | user1@demo.cl | 12345678 |
