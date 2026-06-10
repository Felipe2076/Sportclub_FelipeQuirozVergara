# 🦍 Gorila Sport - Guía de Inicio Rápido

## Resumen del Proyecto

**Gorila Sport** es una plataforma web completa para gestión de actividades deportivas con:
- ✅ Autenticación segura con bcrypt
- ✅ Tres roles de usuario (Admin, Coach, Usuario)
- ✅ Persistencia de datos en JSON
- ✅ Diseño moderno con colores vibrantes (naranja #ff6b35 y azul #004e89)
- ✅ Dashboards personalizados por rol

---

## Requisitos

- **Node.js** 14+ instalado en tu máquina
- **npm** (incluido con Node.js)
- Un navegador web moderno

---

## Instalación Rápida

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

Esto instalará:
- `express` - Framework web
- `bcrypt` - Encriptación de contraseñas
- `cors` - Soporte para peticiones cross-origin

### 2. Iniciar el servidor

```bash
npm start
```

Verás en la consola:
```
Gorila Sport backend API running on http://localhost:4000
```

---

## Uso de la Aplicación

### Desde el navegador:

1. **Abre `Index.html`** en tu navegador
   - Si usas VS Code: Click derecho → Open with Live Server
   - O ve a `http://localhost:5500` (si usas Live Server)

### Flujo de Uso:

#### Opción 1: Registro
1. Click en "Registrarse" en la portada
2. Completa: Nombre, Rol (Atleta/Coach/Admin), Email, Contraseña
3. El sistema te redirige automáticamente a tu dashboard

#### Opción 2: Login
1. Click en "Acceder" 
2. Ingresa email y contraseña
3. Se te mostrará el dashboard según tu rol

---

## Funcionalidades por Rol

### 👤 Atleta (Usuario)
- Ver tu perfil personal
- Seguimiento de progreso y estadísticas
- Ver entrenamientos próximos
- Dashboard con métricas personales

### 🏋️ Coach
- Gestionar atletas asignados
- Ver progreso de cada atleta
- Crear nuevos entrenamientos
- Dashboard con equipo y métricas colectivas

### 🔐 Administrador
- Gestionar todos los usuarios
- Ver estadísticas del sistema
- Crear nuevos coaches y atletas
- Dashboard con control total

---

## Archivos Clave

```
Gorila Sport/
├── Index.html              # Portada principal
├── register.html           # Página de registro
├── login.html              # Página de login
├── dashboard_admin.html    # Dashboard para Admins
├── dashboard_coach.html    # Dashboard para Coaches
├── dashboard_usuario.html  # Dashboard para Atletas
├── css/
│   └── styles.css          # Estilos con colores vibrantes
├── js/
│   ├── auth.js             # Lógica de autenticación
│   └── dashboard.js        # Carga de dashboards
├── backend/
│   ├── server.js           # API Express
│   ├── package.json        # Dependencias
│   └── db/
│       └── users.json      # Base de datos de usuarios
└── assets/
    └── logo-gorila.svg     # Logo del gorila
```

---

## Datos de Prueba

Cuando inicias el sistema, puedes crear usuarios con estos datos:

**Admin:**
- Email: admin@gorilasport.com
- Contraseña: Admin123!

**Coach:**
- Email: coach@gorilasport.com
- Contraseña: Coach123!

**Atleta:**
- Email: atleta@gorilasport.com
- Contraseña: Atleta123!

> Nota: Crea los usuarios desde la interfaz. El sistema los guardará automáticamente.

---

## Estructura de Datos

Los usuarios se guardan en `backend/db/users.json` con este formato:

```json
{
  "id": "user-1234567890",
  "name": "Juan Pérez",
  "email": "juan@gorilasport.com",
  "passwordHash": "bcrypt_hash_aqui",
  "role": "Coach",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## Seguridad

✅ **Contraseñas encriptadas** con bcrypt (10 salt rounds)
✅ **Tokens Bearer** para autenticación sin estado
✅ **Validación** en servidor de todos los campos
✅ **CORS habilitado** para desarrollo local

---

## Solución de Problemas

### El backend no inicia
- Verifica que Node.js está instalado: `node --version`
- Verifica que npm install completó: `ls backend/node_modules`
- Intenta el puerto 4000 no está en uso

### Errores de CORS
- Asegúrate de que el backend está ejecutándose en `http://localhost:4000`
- La URL en `js/auth.js` y `js/dashboard.js` debe coincidir

### Los usuarios no se guardan
- Verifica que `backend/db/` existe y tiene permisos de escritura
- Abre el archivo `backend/db/users.json` para ver los registros

---

## Próximos Pasos

Para mejorar la aplicación:
1. Agregar más campos a los atletas (peso, altura, especialidad)
2. Crear vista de entrenamientos con cronograma
3. Agregar gráficos de progreso
4. Implementar sistema de notificaciones
5. Agregar carga de fotos de perfil

---

## Contacto & Soporte

Cualquier pregunta, consulta al análisis de ingeniería en:
`MANUAL_DE_INGENIERIA_GORILA_SPORT.md`

---

**¡Bienvenido a Gorila Sport! 🦍⚽🏋️**
