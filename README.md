# Biblioteca Backend MVC

Proyecto de backend para una biblioteca implementado como microservicios con Node.js, Express y PostgreSQL.
Cada microservicio tiene su propia base de datos y se ejecuta en Docker.

---

## 🚀 Propósito

Este repositorio contiene cuatro servicios independientes:

- `auth`: autenticación y gestión de usuarios.
- `users`: administración de socios.
- `books`: gestión de libros.
- `loans`: gestión de préstamos y stock de libros.

Cada servicio expone una API REST y se conecta a su propia base de datos PostgreSQL.

---

## 📦 Requisitos

- Docker
- Docker Compose
- Node.js (para correr localmente si no se usa Docker)

---

## ▶️ Ejecutar con Docker

Desde la raíz del proyecto (`Biblioteca_Backend`):

```bash
docker-compose up --build
```

Esto levanta:

- `db_auth` en `5433`
- `db_usuarios` en `5434`
- `db_libros` en `5435`
- `db_loans` en `5436`
- `auth` en `3004`
- `users` en `3001`
- `books` en `3002`
- `loans` en `3003`

---

## 🧩 Arquitectura de servicios

### `auth`
- Puerto: `3004`
- Base: `auth`
- Endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Funciones:
  - registra usuarios.
  - genera token JWT para acceso.

### `users`
- Puerto: `3001`
- Base: `usuarios`
- Endpoints:
  - `GET /api/usuarios`
  - `GET /api/usuarios/:id`
  - `POST /api/usuarios`
- Funciones:
  - crea socios.
  - lista socios.
  - consulta socios por ID.

### `books`
- Puerto: `3002`
- Base: `libros`
- Endpoints:
  - `GET /api/libros`
  - `GET /api/libros/:id`
  - `POST /api/libros`
  - `PUT /api/libros/:id`
  - `DELETE /api/libros/:id`
- Funciones:
  - administra libros.
  - controla stock de ejemplares.

### `loans`
- Puerto: `3003`
- Base: `loans`
- Endpoints:
  - `GET /api/loans`
  - `POST /api/loans`
  - `PUT /api/loans/:id/return`
- Funciones:
  - crea préstamos.
  - controla stock de libros al prestar y devolver.
  - valida que un socio no tenga más de 3 préstamos activos.

---

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

## 📌 Siguientes mejoras sugeridas

1. Usar `bcrypt` para las contraseñas.
2. Guardar el secreto JWT en `process.env.JWT_SECRET`.
3. Agregar validación de esquema con `express-validator` o `Joi`.
4. Añadir pruebas automatizadas.
