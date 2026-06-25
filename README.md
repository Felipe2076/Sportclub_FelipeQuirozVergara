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
# Instalar dependencias del frontend (raíz del proyecto)
npm install

# Instalar dependencias del backend
cd backend
npm install
```

## Cómo ejecutar el frontend

```bash
# Desde la raíz del proyecto - solo frontend (puerto 5173)
npm run dev

# Frontend + backend simultáneamente
npm run dev:all
```

## Cómo ejecutar el backend

```bash
cd backend
npm start
```

El backend corre en `http://localhost:4000`.

## Usuarios de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Admin | admin@gorilasport.com | Pass123! |
| Coach | coach@gorilasport.com | Pass123! |
| Usuario | atleta@gorilasport.com | Pass123! |
