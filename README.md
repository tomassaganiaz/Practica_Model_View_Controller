# Biblioteca Backend MVC - Microservicios

Proyecto de backend para una biblioteca implementado como **microservicios independientes** con Node.js, Express y PostgreSQL.
Cada microservicio tiene su propia base de datos, se ejecuta en Docker y se comunica con otros servicios mediante HTTP.

---

## 🚀 Propósito

Este repositorio contiene **cuatro servicios independientes** que se comunican entre sí mediante APIs HTTP:

- **`auth`** (Puerto 3004): Autenticación y generación de tokens JWT.
- **`users`** (Puerto 3001): Administración de socios/usuarios.
- **`books`** (Puerto 3002): Gestión de libros y stock.
- **`loans`** (Puerto 3003): Gestión de préstamos y validaciones cruzadas.

### Características de la Arquitectura:
✅ **Microservicios desacoplados** - Cada servicio tiene su propia BD
✅ **Comunicación HTTP** - Uso de clientes HTTP (axios) para inter-servicio
✅ **Sin acceso directo a BD externas** - Solo comunicación mediante APIs REST
✅ **Middleware de autenticación** - Validación de tokens JWT entre servicios
✅ **Manejo centralizado de errores** - Middleware para capturar errores de servicios remotos

---

## 📦 Requisitos

- Docker
- Docker Compose
- Node.js 14+ (opcional, si se ejecuta localmente)

---

## ▶️ Ejecutar con Docker

Desde la raíz del proyecto:

```bash
docker-compose up --build
```

### Puertos Expuestos:

**Bases de Datos:**
- `db_auth` → Puerto 5433
- `db_usuarios` → Puerto 5434
- `db_libros` → Puerto 5435
- `db_loans` → Puerto 5436

**Microservicios:**
- `auth` → Puerto 3004
- `users` → Puerto 3001
- `books` → Puerto 3002
- `loans` → Puerto 3003

---

## 🧩 Arquitectura de Servicios

### `auth` (Autenticación)
- **Puerto**: 3004
- **Base de Datos**: `auth`
- **Endpoints**:
  - `POST /api/auth/register` - Registrar nuevo usuario
  - `POST /api/auth/login` - Iniciar sesión y obtener token JWT
  - `POST /api/verify` - Validar token (usado por otros servicios)
- **Responsabilidades**:
  - Generar y validar tokens JWT
  - Gestionar credenciales de usuarios
  - Proporcionar métodos de validación para otros servicios

---

### `users` (Administración de Usuarios)
- **Puerto**: 3001
- **Base de Datos**: `usuarios`
- **Clientes HTTP**:
  - `authClient.js` - Validación de tokens con auth
  - `booksClient.js` - Consultar información de libros
  - `loansClient.js` - Obtener préstamos de un usuario

- **Endpoints**:
  - `GET /api/usuarios` - Listar todos los usuarios
  - `GET /api/usuarios/:id` - Obtener usuario por ID
  - `POST /api/usuarios` - Crear nuevo usuario

- **Responsabilidades**:
  - Gestionar información de socios
  - Validar estado de bloqueo de usuarios
  - Responder consultas de otros servicios

---

### `books` (Gestión de Libros)
- **Puerto**: 3002
- **Base de Datos**: `libros`
- **Clientes HTTP**:
  - `authClient.js` - Validación de tokens
  - `usersClient.js` - Información de usuarios
  - `loansClient.js` - Consultar préstamos de libros

- **Endpoints**:
  - `GET /api/libros` - Listar todos los libros
  - `GET /api/libros/:id` - Obtener libro por ID
  - `POST /api/libros` - Crear nuevo libro
  - `PUT /api/libros/:id` - Actualizar libro (stock, etc.)
  - `DELETE /api/libros/:id` - Eliminar libro

- **Responsabilidades**:
  - Administrar catálogo de libros
  - Controlar stock de ejemplares
  - Actualizar stock cuando hay préstamos/devoluciones

---

### `loans` (Gestión de Préstamos)
- **Puerto**: 3003
- **Base de Datos**: `loans`
- **Clientes HTTP**:
  - `authClient.js` - Validación de tokens
  - `usersClient.js` - Validar estado del usuario
  - `booksClient.js` - Verificar stock y actualizar

- **Endpoints**:
  - `GET /api/loans` - Obtener todos los préstamos
  - `POST /api/loans` - Crear nuevo préstamo
    - Valida: usuario existe y no está bloqueado
    - Valida: libro existe y tiene stock
    - Valida: usuario no tiene más de 3 préstamos activos
    - Actualiza stock del libro automáticamente
  - `PUT /api/loans/:id/return` - Devolver un préstamo
    - Marca préstamo como devuelto
    - Restaura stock del libro

- **Responsabilidades**:
  - Orquestar lógica de préstamos
  - Validar reglas de negocio consultando otros servicios
  - Coordinar cambios de stock entre servicios

---

## 🔄 Comunicación entre Microservicios

### Arquitectura de Clientes HTTP

Cada servicio contiene clientes HTTP en la carpeta `clients/` para comunicarse con otros:

```
service/
├── auth/
│   └── (Sin clientes, es el servicio central)
├── books/
│   └── clients/
│       ├── authClient.js ──────→ Valida tokens
│       ├── usersClient.js ─────→ Consulta usuarios
│       └── loansClient.js ─────→ Consulta préstamos
├── users/
│   └── clients/
│       ├── authClient.js ──────→ Valida tokens
│       ├── booksClient.js ─────→ Consulta libros
│       └── loansClient.js ─────→ Consulta préstamos del usuario
└── loans/
    └── clients/
        ├── authClient.js ──────→ Valida tokens
        ├── usersClient.js ─────→ Valida usuario
        └── booksClient.js ─────→ Valida stock y actualiza
```

### Flujo de Comunicación Ejemplo: Crear un Préstamo

```
Cliente REST (HTTP POST /api/loans)
            ↓
    [loans/controller]
            ↓
    [loans/service] 
            ├─→ usersClient.getUserById(memberId)
            │   └─→ [HTTP GET http://users:3001/api/usuarios/:id]
            │
            ├─→ booksClient.getBookById(bookId)
            │   └─→ [HTTP GET http://books:3002/api/libros/:id]
            │
            ├─→ booksClient.updateBookStock(bookId, stock)
            │   └─→ [HTTP PUT http://books:3002/api/libros/:id]
            │
            └─→ [loans/dao] → PostgreSQL (loans DB)
                    ↓
                  Respuesta JSON
```

### Variables de Entorno (docker-compose.yml)

Cada servicio tiene configuradas las URLs de los otros servicios:

```yaml
loans:
  environment:
    AUTH_SERVICE_URL: http://auth:3004
    BOOKS_SERVICE_URL: http://books:3002
    USERS_SERVICE_URL: http://users:3001
```

---

## 🔐 Middleware de Autenticación

### `middleware/authMiddleware.js`

Cada servicio incluye middleware para validar tokens JWT:

```javascript
// Uso en rutas protegidas
router.get('/loans/user/:memberId', 
  authMiddleware.authenticateToken, 
  loanController.getLoansByMember
);
```

**Flujo de validación:**
1. Cliente envía request con header: `Authorization: Bearer TOKEN`
2. Middleware extrae y valida el token
3. Si es válido, continúa; si no, retorna 403

---

## ⚠️ Middleware de Manejo de Errores

### `middleware/errorHandler.js`

Captura y maneja errores de forma centralizada:

```javascript
// Errores de servicios remotos → 503 Service Unavailable
// Recursos no encontrados → 404 Not Found
// Errores genéricos → 500 Internal Server Error
```

---

## 📂 Estructura del Proyecto

```
Biblioteca_Backend/
├── docker-compose.yml           # Orquestación de servicios
├── package.json                 # Dependencias compartidas
├── README.md                    # Este archivo
├── docker/
│   ├── Dockerfile.auth
│   ├── Dockerfile.books
│   ├── Dockerfile.loans
│   ├── Dockerfile.user
│   └── init/                    # Scripts de inicialización BD
│       ├── db_auth/init.sql
│       ├── db_libros/init.sql
│       ├── db_loans/init.sql
│       └── db_usuarios/init.sql
└── service/
    ├── auth/
    │   ├── app.js
    │   ├── index.js
    │   ├── config/db.js
    │   ├── controllers/authController.js
    │   ├── dao/authDao.js
    │   ├── domain/authDomain.js
    │   ├── routes/authRoutes.js
    │   └── services/authService.js
    ├── books/
    │   ├── app.js
    │   ├── index.js
    │   ├── clients/              ← HTTP clients para otros servicios
    │   ├── config/db.js
    │   ├── controllers/
    │   ├── dao/
    │   ├── middleware/           ← Auth y Error handling
    │   ├── routes/
    │   ├── services/
    │   └── __tests__/
    ├── loans/
    │   ├── app.js
    │   ├── index.js
    │   ├── clients/              ← HTTP clients
    │   ├── config/db.js
    │   ├── controllers/
    │   ├── dao/
    │   ├── middleware/           ← Middlewares
    │   ├── routes/
    │   ├── services/
    │   └── __tests__/
    └── user/
        ├── app.js
        ├── index.js
        ├── clients/              ← HTTP clients
        ├── config/db.js
        ├── controllers/
        ├── dao/
        ├── middleware/           ← Middlewares
        ├── routes/
        ├── services/
        └── __tests__/
```

---

## 🧪 Testing

Ejecutar tests de todos los servicios:

```bash
npm test
```

Tests incluidos:
- `service/books/__tests__/bookRoutes.test.js`
- `service/user/__tests__/userRoutes.test.js`

---

## 🔧 Ejecutar Servicios Localmente (sin Docker)

```bash
# En terminales separadas
npm run start:auth
npm run start:users
npm run start:books
npm run start:loans
```

**Nota:** Requiere PostgreSQL instalado localmente con bases de datos creadas.

---

## 📌 Mejoras Sugeridas para Futuro

### ⭐ Implementación Actual
✅ Comunicación HTTP entre microservicios
✅ Clientes HTTP reutilizables
✅ Middleware de autenticación JWT
✅ Manejo centralizado de errores
✅ Docker Compose para orquestación

### 🚀 Mejoras Recomendadas

#### ⚠️ PRIORIDAD ALTA - Implementar ANTES de producción

1. **Validación Robusta de Entrada (Joi o Yup)**
   - **Por qué:** Actualmente sin validación de datos en los controllers
   - **Problema:** `POST /api/loans` acepta `{bookId: "texto"}` sin validar tipos
   - **Impacto:** Errores impredecibles en BD, seguridad débil
   - **Ejemplo:**
   ```javascript
   // ❌ ACTUAL - Sin validación
   const { memberId, bookId } = req.body;
   
   // ✅ CON JOI
   const schema = Joi.object({
     memberId: Joi.number().integer().required(),
     bookId: Joi.number().integer().required()
   });
   const { error, value } = schema.validate(req.body);
   ```
   - **Librería:** `npm install joi`

2. **Timeout en Llamadas HTTP (Axios timeout)**
   - **Por qué:** Las llamadas entre servicios pueden colgar indefinidamente
   - **Problema:** Si `books` service responde lentamente, `loans` espera para siempre
   - **Impacto:** Clientes colgados, recursos agotados, mala experiencia
   - **Ejemplo:**
   ```javascript
   // ❌ ACTUAL - Sin timeout
   const book = await axios.get(`${BOOKS_SERVICE_URL}/api/libros/${bookId}`);
   
   // ✅ CON TIMEOUT
   const book = await axios.get(
     `${BOOKS_SERVICE_URL}/api/libros/${bookId}`,
     { timeout: 5000 }  // Máximo 5 segundos
   );
   ```

3. **Retry Logic en Servicios Remotos**
   - **Por qué:** La red es frágil, fallos temporales ocurren constantemente
   - **Problema:** Un pico de latencia temporal causa error total del préstamo
   - **Impacto:** Mejor resiliencia, menor tasa de fallos por red
   - **Ejemplo:**
   ```javascript
   // ❌ ACTUAL - Falla a la primera vez
   const member = await usersClient.getUserById(memberId);
   
   // ✅ CON REINTENTOS (exponential backoff)
   const member = await retryWithBackoff(
     () => usersClient.getUserById(memberId),
     { attempts: 3, delay: 1000, backoff: 2 }
   );
   // Reintenta: ahora, 1s, 2s, 4s
   ```

4. **Seguridad: Credenciales en Variables de Entorno**
   - **Por qué:** Credenciales están hardcodeadas en `docker-compose.yml`
   - **Problema:** Si el repo se expone públicamente, **todos los datos están comprometidos**
   - **Impacto:** CRÍTICO de seguridad, violación GDPR, hackeo de datos
   - **Ejemplo:**
   ```yaml
   # ❌ ACTUAL - EN CÓDIGO
   environment:
     DB_PASSWORD: admin
   
   # ✅ CORRECTO - EN .ENV (no versionado)
   environment:
     DB_PASSWORD: ${DB_PASSWORD}
   # Luego en .env local: DB_PASSWORD=contraseña_real_super_segura
   ```
   - **Crear:** `.env` file en raíz (agregar a `.gitignore`)

5. **Logging Centralizado (Winston)**
   - **Por qué:** Sin logs, imposible debuggear en producción
   - **Problema:** ¿Qué pasó con el préstamo que falló a las 3 AM? No hay forma de saberlo
   - **Impacto:** Diagnóstico de bugs en 5 minutos vs 5 horas, auditoría de accesos
   - **Ejemplo:**
   ```javascript
   // ❌ ACTUAL - Sin logs
   const loan = await loanService.createLoan(memberId, bookId);
   
   // ✅ CON WINSTON
   logger.info(`Creating loan for member ${memberId}`, { bookId });
   try {
     const loan = await loanService.createLoan(memberId, bookId);
     logger.info(`Loan created successfully`, { loanId: loan.id });
   } catch (error) {
     logger.error(`Failed to create loan`, { error: error.message });
   }
   ```
   - **Librería:** `npm install winston`

6. **Transacciones Distribuidas (Patrón Saga)**
   - **Por qué:** Operaciones multi-servicio sin garantía de atomicidad
   - **Problema Crítico:**
     ```
     1. Valida libro        → OK
     2. Actualiza stock     → OK  (↓ 5 → 4)
     3. Crea préstamo       → FALLA (BD caída)
     
     RESULTADO: Stock está 4 pero no hay préstamo! 💥
     ```
   - **Impacto:** Inconsistencia de datos, auditoría fallida
   - **Solución:** Compensating transactions (revert automático)
   ```javascript
   // Pseudo-código Saga
   try {
     await booksClient.updateBookStock(bookId, stock - 1);  // Paso 1
     await loanDao.create(loan);                             // Paso 2 - FALLA
   } catch {
     // COMPENSACIÓN: Revert paso 1
     await booksClient.updateBookStock(bookId, stock);      // Restaurar
   }
   ```

7. **Tests de Integración Reales**
   - **Por qué:** Los archivos de test existen pero están vacíos
   - **Problema:** Cambios rompen código sin noticia, bugs en producción
   - **Impacto:** Confianza en cambios, detección temprana de bugs
   - **Ejemplo:**
   ```javascript
   // ✅ TEST QUE FALTA IMPLEMENTAR
   describe('Crear préstamo', () => {
     it('debe rechazar si usuario está bloqueado', async () => {
       const res = await request(app)
         .post('/api/loans')
         .send({ memberId: 999, bookId: 1 });
       expect(res.status).toBe(400);
       expect(res.body.message).toBe('Blocked member cannot request loans');
     });
     
     it('debe rechazar si stock = 0', async () => {
       // Similar pero validando stock
     });
   });
   ```

---

#### 🔶 PRIORIDAD MEDIA - Implementar para mejor arquitectura

8. **Manejo de Errores Estructurado**
   - **Por qué:** Todos los errores se tratan igual, sin diferenciación
   - **Problema:** Cliente no sabe si fue 400 (su culpa), 500 (bug nuestro) o 503 (servicio caído)
   - **Solución:**
   ```javascript
   class AppError extends Error {
     constructor(message, statusCode) {
       super(message);
       this.statusCode = statusCode;
     }
   }
   
   throw new AppError('Member not found', 404);
   throw new AppError('Books service unavailable', 503);
   ```

9. **Circuit Breaker Pattern**
   - **Por qué:** Si `books` service cae, `loans` lo sigue intentando infinitamente
   - **Problema:** Cascada de fallos, todos los préstamos fallan
   - **Solución:** Detectar fallo, dejar de intentar después de N fallos, retornar error rápido
   - **Librería:** `npm install opossum`
   - **Beneficio:** Degradación elegante vs cascada de fallos

10. **Versionado de API**
    - **Por qué:** Para evolucionar sin romper clientes existentes
    - **Ejemplo:**
    ```javascript
    // Versión 1
    router.get('/v1/libros', ...);
    
    // Versión 2 (cambio incompatible)
    router.get('/v2/libros', ...);
    // v1 sigue funcionando para clientes antiguos
    ```

11. **API Gateway Centralizado**
    - Punto único de entrada para todos los servicios
    - Rate limiting centralizado, CORS configurado
    - Opciones: Kong, AWS API Gateway, Express Gateway

12. **Service Discovery**
    - URLs hardcodeadas en docker-compose → Registro dinámico
    - Servicios se descubren automáticamente
    - Opciones: Consul, Eureka, Docker DNS

---

#### 💡 PRIORIDAD BAJA - Optimizaciones opcionales

13. **Caching Distribuido (Redis)**
    - Cachear datos que no cambian frecuentemente
    - Reduce latencia entre servicios

14. **Monitoring y Alertas (Prometheus + Grafana)**
    - Métricas en tiempo real
    - Alertas automáticas cuando algo falla

15. **Event-Driven Architecture (RabbitMQ/Kafka)**
    - Desacoplar aún más los servicios
    - `loans` emite evento "préstamo creado"

16. **Swagger/OpenAPI**
    - Documentación automática
    - UI interactivo para probar endpoints

17. **Database Migrations (Flyway/Liquibase)**
    - Versionado de cambios en BD
    - Rollbacks automáticos

---

## 📊 Plan de Implementación Recomendado

### **Semana 1: Crítico (Hacer ANTES de producción)**
```
- [ ] Validación de entrada (Joi)
- [ ] Timeouts en axios
- [ ] Mover credenciales a .env
- [ ] Tests básicos
Tiempo estimado: 8-16 horas
```

### **Semana 2: Importante (Hacer ASAP)**
```
- [ ] Logging con Winston
- [ ] Retry logic con exponential backoff
- [ ] Manejo estructurado de errores
- [ ] Transacciones distribuidas (Saga pattern)
Tiempo estimado: 16-24 horas
```

### **Semana 3+: Opcional (Escala según necesidad)**
```
- [ ] Circuit breaker (Opossum)
- [ ] API Gateway
- [ ] Redis caching
- [ ] Prometheus monitoring
```

---

## ⚠️ Consideraciones Importantes

- **En Producción:** Los cambios de Prioridad Alta son **OBLIGATORIOS**
- **Sin Logging:** Imposible debuggear problemas en producción
- **Sin Retry Logic:** Cualquier lag de red causa error
- **Transacciones Distribuidas:** Evita inconsistencia de datos
- **Credenciales Expostas:** Violación de seguridad y GDPR

---

## 🤝 Contribución

Para agregar cambios:

1. Crear rama: `git checkout -b feature/nombre-feature`
2. Hacer cambios
3. Usar los middlewares existentes
4. Agregar tests si es necesario
5. Hacer commit: `git commit -m "Descripción del cambio"`
6. Push: `git push origin feature/nombre-feature`

---

## 📄 Licencia

Este proyecto es de uso educativo.

## 🔧 Estructura del proyecto

```text
Biblioteca_Backend/
├── docker-compose.yml
├── .dockerignore
├── package.json
├── README.md
├── docs/
├── docker/
│   ├── Dockerfile.auth
│   ├── Dockerfile.user
│   ├── Dockerfile.books
│   ├── Dockerfile.loans
│   └── init/
│       ├── db_auth/init.sql
│       ├── db_usuarios/init.sql
│       ├── db_libros/init.sql
│       └── db_loans/init.sql
└── service/
    ├── auth/
    ├── user/
    ├── books/
    └── loans/
```

---

## 🧪 Cómo probar cada servicio

### Auth

Registrar usuario:

```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"1234"}'
```

Login:

```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"1234"}'
```

### Users

Listar socios:

```bash
curl http://localhost:3001/api/usuarios
```

Crear socio:

```bash
curl -X POST http://localhost:3001/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","bloqueado":false}'
```

### Books

Listar libros:

```bash
curl http://localhost:3002/api/libros
```

Crear libro:

```bash
curl -X POST http://localhost:3002/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nuevo Libro","stock":5}'
```

Actualizar libro:

```bash
curl -X PUT http://localhost:3002/api/libros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nuevo Libro Editado","stock":4}'
```

Eliminar libro:

```bash
curl -X DELETE http://localhost:3002/api/libros/1
```

### Loans

Listar préstamos:

```bash
curl http://localhost:3003/api/loans
```

Crear préstamo:

```bash
curl -X POST http://localhost:3003/api/loans \
  -H "Content-Type: application/json" \
  -d '{"memberId":1,"bookId":1}'
```

Devolver préstamo:

```bash
curl -X PUT http://localhost:3003/api/loans/1/return
```

---

## ⚠️ Consideraciones importantes

- Las credenciales por defecto de PostgreSQL son `admin` / `admin`.
- El servicio `loans` accede directamente a las bases de datos de `books` y `users` para validar stock y estado del socio.
- En producción sería ideal mover la lógica de contraseñas a `bcrypt` y usar `JWT_SECRET` en variables de entorno.

---

## 🧾 Variables de configuración

Cada servicio usa variables de entorno para su conexión a la base de datos, por ejemplo:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `PORT`

El servicio `loans` también usa:

- `BOOKS_DB_HOST`
- `BOOKS_DB_NAME`
- `BOOKS_DB_USER`
- `BOOKS_DB_PASSWORD`
- `MEMBERS_DB_HOST`
- `MEMBERS_DB_NAME`
- `MEMBERS_DB_USER`
- `MEMBERS_DB_PASSWORD`

---

## 📌 Siguientes mejoras sugeridas (mejoras ya agregadas)

1. Usar `bcrypt` para las contraseñas.
2. Guardar el secreto JWT en `process.env.JWT_SECRET`.
3. Agregar validación de esquema con `express-validator` o `Joi`.
4. Añadir pruebas automatizadas.
