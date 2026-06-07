# MANUAL DE INGENIERÍA: SISTEMA "GORILA SPORT"

## CAPÍTULO 1: Fundamentos y Ecosistema Tecnológico

La visión de *Gorila Sport* es crear una plataforma deportiva de alto rendimiento. El stack elegido (React + Node.js) permite una arquitectura SPA (Single Page Application) donde el usuario experimenta una navegación fluida sin recargas de página. La base de esta ingeniería es el desacoplamiento: el cliente y el servidor son entes independientes que se comunican exclusivamente a través de JSON.

## CAPÍTULO 2: Arquitectura y Estructura del Proyecto

Un proyecto escalable comienza con un árbol de archivos limpio. Todo el código sigue la convención en inglés.

- `src/services/`: Capa exclusiva de comunicación (OutService).
- `src/components/`: Componentes modulares y reutilizables.
- `src/pages/`: Páginas de alto nivel que integran componentes y servicios.
- `src/assets/`: Recursos gráficos y multimedia.
- `src/layouts/`: Estructuras visuales (templates) por rol.

## CAPÍTULO 3: Metodología de Trabajo y Git

El flujo de trabajo es el estándar de la industria:

1. **Branching:** Rama `main` para código estable; `feature/nombre-funcionalidad` para desarrollo.
2. **Commit:** Mensajes semánticos (ej: `feat: add login functionality`).
3. **Pull Request:** Proceso de revisión obligatoria para verificar código, lógica y ausencia de `console.log` innecesarios.

## CAPÍTULO 4: El "OutService" (Lógica de API)

La lógica de red es el corazón del sistema. Implementamos funciones asíncronas con `async/await` para gestionar peticiones HTTP.

- **Manejo de Errores:** Uso obligatorio de `try/catch`. Si el servidor devuelve un `4xx` o `5xx`, el `authService` debe lanzar una excepción que el componente de UI pueda capturar para mostrar un aviso al usuario.
- **Consistencia:** Toda petición debe incluir el header `Content-Type: application/json`.

## CAPÍTULO 5: Frontend - Lógica de UI (React)

Los componentes utilizan Hooks:

- **`useState`**: Para gestionar estados internos (inputs, loading, errores).
- **`useEffect`**: Para efectos secundarios (ej: verificar autenticación al cargar la página).
- **Control de Formularios:** Los inputs no tienen el valor directo en el DOM; se controlan a través de una variable de estado que se actualiza en cada pulsación de tecla (`onChange`).

## CAPÍTULO 6: Navegación y Roles

El sistema detecta roles (Admin, Coach, User) desde la respuesta del servidor.

- **Rutas Protegidas:** Implementación de lógica que impide el acceso a Dashboards si no se posee un token o rol válido.
- **Navegación:** `useNavigate` de `react-router-dom` para redirecciones dinámicas tras un login exitoso.

## CAPÍTULO 7: Backend y Persistencia

El backend gestiona la base de datos (JSON) con validaciones estrictas:

- **Validación:** Comprobación de unicidad de emails antes de insertar.
- **Seguridad:** Uso de librerías como `bcrypt` para no guardar contraseñas en texto plano (fundamental para la integridad de datos).
- **Persistencia Atómica:** Leer archivo -> Parsear JSON -> Modificar array -> Escribir archivo.

## CAPÍTULO 8: Plan de Despliegue (Deployment)

El despliegue es el paso final a producción:

1. **Build:** Ejecutar `npm run build` para optimizar el frontend.
2. **Servidor:** Instalar PM2 para que el backend nunca se detenga.
3. **Variables:** Configurar `.env` para proteger datos sensibles (claves de API, puertos).
4. **Logs:** Monitoreo constante vía `pm2 logs` para detectar errores de usuarios en tiempo real.

## ANEXOS

### Anexo A: Glosario Técnico

- **CORS:** Mecanismo de seguridad que permite (o bloquea) peticiones entre dominios.
- **Promise:** Objeto que representa la terminación (o fracaso) de una operación asíncrona.
- **Hook:** Función de React que permite usar funcionalidades de estado.

### Anexo B: Resolución de Problemas (Troubleshooting)

1. **Error 401:** Credenciales erróneas.
2. **Error 500:** Problema de sintaxis en el backend o fallo al escribir el archivo JSON.
3. **Error "Failed to fetch":** Servidor backend offline o dirección URL incorrecta en el `authService`.

### Anexo C: Checklist de Calidad

- [ ] Variables y funciones en inglés.
- [ ] Bloques `try/catch` implementados.
- [ ] Botones con estado `disabled` durante el `fetch`.
- [ ] Diseño responsivo verificado.
