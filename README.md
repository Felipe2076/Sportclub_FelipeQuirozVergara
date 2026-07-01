# SportClub - Gorila SportClub

**Integrante:** Felipe Quiroz Vergara

Aplicación web SPA para la gestión de un gimnasio/centro deportivo, desarrollada con React + Vite y Node.js/Express.

---

## 🚀 Cómo ejecutar el proyecto (para el profesor)

### 1. Requisitos previos
- Node.js 18 o superior
- **npm** (viene con Node.js) o **pnpm**

### 2. Abrir una terminal en la carpeta del proyecto

```bash
cd Sportclub_FelipeQuirozVergara
```

### 3. Instalar dependencias

```bash
# Con pnpm (recomendado):
pnpm install

# Con npm:
npm install
```

### 4. Iniciar el servidor

```bash
# Opción 1: Backend + Frontend automáticamente (recomendado)
npm run dev:all
```

Esto inicia:
- **Backend** → `http://localhost:4000`
- **Frontend** → `http://localhost:5173`

> Abrir `http://localhost:5173` en el navegador. Todo funciona desde ahí.

### 5. Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| 👑 Admin | admin1@demo.cl | 12345678 |
| 🏋️ Coach | coach1@demo.cl | 12345678 |
| 👤 Usuario | user1@demo.cl | 12345678 |

---

## 🔧 Solo backend (si no quieres el frontend)

```bash
node backend/src/server.js
# Servidor en http://localhost:4000
```

Probar con curl o Postman:
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@demo.cl","password":"12345678"}'
```

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** React 19, Vite, React-Bootstrap, SweetAlert2, Axios, React Router
- **Backend:** Node.js, Express, JWT, bcryptjs, Sequelize, SQLite
- **Estilos:** CSS personalizado con glassmorphism, paleta morado/dorado
