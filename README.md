# MiniBlog API

REST API desarrollada con Node.js, Express y PostgreSQL para la gestión de autores y publicaciones.

El proyecto permite realizar operaciones CRUD sobre autores y posts, manteniendo una relación entre ambas entidades mediante una clave foránea.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- dotenv
- Jest
- Supertest
- Swagger UI
- OpenAPI

## Estructura del proyecto

mini-blog-api/
├── docs/
│   └── openapi.yaml
├── sql/
│   ├── seed.sql
│   └── setup.sql
├── src/
│   ├── db/
│   │   └── index.js
│   ├── middlewares/
│   │   └── validateId.js
│   ├── routes/
│   │   ├── authors.routes.js
│   │   └── posts.routes.js
│   ├── app.js
│   └── server.js
├── tests/
│   ├── authors.test.js
│   └── posts.test.js
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

## Entidades

### Authors

Los autores contienen los siguientes campos:

- `id`
- `name`
- `email`
- `bio`
- `created_at`

El email de cada autor debe ser único.

### Posts

Los posts contienen:

- `id`
- `title`
- `content`
- `author_id`
- `published`
- `created_at`

Cada post pertenece a un autor mediante `author_id`.

## Endpoints

### Authors

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/authors` | Obtener todos los autores |
| GET | `/authors/:id` | Obtener un autor por ID |
| POST | `/authors` | Crear un autor |
| PUT | `/authors/:id` | Actualizar un autor |
| DELETE | `/authors/:id` | Eliminar un autor |

### Posts

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/posts` | Obtener todos los posts |
| GET | `/posts/:id` | Obtener un post por ID |
| GET | `/posts/author/:authorId` | Obtener posts por autor |
| POST | `/posts` | Crear un post |
| PUT | `/posts/:id` | Actualizar un post |
| DELETE | `/posts/:id` | Eliminar un post |

## Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al proyecto:

```bash
cd mini-blog-api
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_blog
DB_USER=postgres
DB_PASSWORD=tu_password
```

El archivo `.env` no debe subirse al repositorio.

## Base de datos

Crear una base de datos PostgreSQL llamada:

```text
mini_blog
```

Luego ejecutar el script:

```text
sql/setup.sql
```

para crear las tablas.

Opcionalmente se pueden cargar los datos iniciales ejecutando:

```text
sql/seed.sql
```

## Ejecutar la aplicación

Modo desarrollo:

```bash
npm run dev
```

La API estará disponible por defecto en:

```text
http://localhost:3000
```

## Documentación Swagger

Con el servidor ejecutándose, la documentación interactiva puede consultarse en:

```text
http://localhost:3000/api-docs
```

La especificación OpenAPI se encuentra en:

```text
docs/openapi.yaml
```

## Tests

Ejecutar los tests automatizados con:

```bash
npm test
```

Los tests utilizan Jest y Supertest.

La conexión a PostgreSQL es mockeada durante los tests para evitar modificar los datos de la base de datos real.

## Códigos HTTP utilizados

La API utiliza principalmente:

- `200 OK` — operación realizada correctamente.
- `201 Created` — recurso creado correctamente.
- `204 No Content` — recurso eliminado correctamente.
- `400 Bad Request` — datos o parámetros inválidos.
- `404 Not Found` — recurso inexistente.
- `500 Internal Server Error` — error interno del servidor.

## Autor

Santiago Sánchez