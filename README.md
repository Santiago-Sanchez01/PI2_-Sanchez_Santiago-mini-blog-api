# MiniBlog API

API REST desarrollada con **Node.js, Express y PostgreSQL** para la gestión de autores y publicaciones.

El proyecto fue realizado como parte del **Proyecto Integrador 2** y permite realizar operaciones CRUD sobre las entidades `authors` y `posts`.

Cada publicación pertenece a un autor mediante una relación de clave foránea.

---

## 1. Descripción del proyecto

MiniBlog API permite administrar autores y publicaciones mediante endpoints REST.

Las principales funcionalidades implementadas son:

### Authors

- Obtener todos los autores.
- Obtener un autor por ID.
- Crear un autor.
- Actualizar un autor.
- Eliminar un autor.

### Posts

- Obtener todos los posts.
- Obtener un post por ID.
- Obtener posts por autor.
- Crear un post.
- Actualizar un post.
- Eliminar un post.

La aplicación utiliza **PostgreSQL** para la persistencia de datos y consultas SQL parametrizadas para interactuar con la base de datos.

La estructura principal del backend separa las responsabilidades en:

```text
HTTP Request
     │
     ▼
   Routes
     │
     ▼
  Services
     │
     ▼
 Database
     │
     ▼
 PostgreSQL
```

---

## 2. Requisitos para ejecutar el proyecto localmente

Para ejecutar el proyecto se necesita tener instalado:

- Node.js
- npm
- PostgreSQL
- Git

### Clonar el repositorio

```bash
git clone https://github.com/Santiago-Sanchez01/PI2_-Sanchez_Santiago-mini-blog-api.git
cd mini-blog-api
```

### Instalar las dependencias

```bash
npm install
```

---

## 3. Configuración de la base de datos

Crear una base de datos PostgreSQL llamada:

```text
mini_blog
```

Luego ejecutar el archivo:

```text
sql/setup.sql
```

Este script crea las tablas necesarias:

```text
authors
posts
```

La tabla `posts` se relaciona con `authors` mediante la columna `author_id`.

Opcionalmente se pueden cargar datos iniciales ejecutando:

```text
sql/seed.sql
```

---

## 4. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

Se puede utilizar `.env.example` como referencia.

Ejemplo para desarrollo local:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_blog
DB_USER=postgres
DB_PASSWORD=tu_password

DATABASE_URL=
```

`DB_PASSWORD` debe reemplazarse por la contraseña correspondiente a la instalación local de PostgreSQL.

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

---

## 5. Ejecutar la aplicación

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

Por defecto, el servidor estará disponible en:

```text
http://localhost:3000
```

Para comprobar que la API se encuentra funcionando:

```text
http://localhost:3000/authors
```

```text
http://localhost:3000/posts
```

---

## 6. Ejecutar los tests

El proyecto utiliza **Jest** y **Supertest** para realizar pruebas automatizadas sobre los endpoints.

Para ejecutar los tests:

```bash
npm test
```

La conexión con PostgreSQL se encuentra mockeada durante los tests para evitar modificar la información almacenada en la base de datos real.

Los tests comprueban operaciones de Authors y Posts, incluyendo respuestas exitosas, validaciones y recursos inexistentes.

---

## 7. Documentación OpenAPI / Swagger

La especificación OpenAPI del proyecto se encuentra en:

```text
docs/openapi.yaml
```

La documentación interactiva utiliza **Swagger UI**.

### Desarrollo local

Con el servidor ejecutándose:

```text
http://localhost:3000/api-docs
```

### Producción

La documentación Swagger desplegada en Railway está disponible en:

```text
https://pi2-sanchezsantiago-mini-blog-api-production.up.railway.app/api-docs/
```

Swagger permite consultar los endpoints disponibles, parámetros, request bodies, respuestas y códigos HTTP de la API.

---

## 8. Deployment en Railway

La aplicación se encuentra desplegada utilizando **Railway**.

El proyecto utiliza dos servicios principales:

```text
Railway Project
│
├── MiniBlog API
│   └── Node.js + Express
│
└── PostgreSQL
    └── Base de datos de producción
```

### Variables de entorno

El servicio de la API utiliza las variables de entorno proporcionadas por Railway para conectarse con PostgreSQL.

La principal variable utilizada en producción es:

```text
DATABASE_URL
```

Esta variable contiene la información necesaria para establecer la conexión con PostgreSQL.

El servidor también utiliza:

```text
PORT=8080
```

Las credenciales y contraseñas se administran mediante las variables de entorno de Railway y no se almacenan en el repositorio.

### Internal URL

Railway proporciona comunicación privada entre los servicios pertenecientes al mismo proyecto.

La conexión entre la API y PostgreSQL se realiza internamente mediante las variables proporcionadas por Railway, evitando almacenar credenciales directamente en el código.

### Public URL

La API está disponible públicamente en:

```text
https://pi2-sanchezsantiago-mini-blog-api-production.up.railway.app
```

Endpoints de ejemplo:

```text
https://pi2-sanchezsantiago-mini-blog-api-production.up.railway.app/authors
```

```text
https://pi2-sanchezsantiago-mini-blog-api-production.up.railway.app/posts
```

Documentación:

```text
https://pi2-sanchezsantiago-mini-blog-api-production.up.railway.app/api-docs/
```

### Resumen del proceso de deployment

1. Crear un proyecto en Railway.
2. Importar el repositorio desde GitHub.
3. Crear un servicio PostgreSQL.
4. Configurar `DATABASE_URL` en el servicio de la API utilizando las variables de Railway.
5. Configurar `PORT=8080`.
6. Ejecutar `sql/setup.sql` sobre la base PostgreSQL de producción.
7. Ejecutar `sql/seed.sql` para cargar los datos iniciales.
8. Generar un dominio público para el servicio de la API.
9. Verificar los endpoints y la documentación Swagger desde la URL pública.

---

## 9. Registro del uso de Inteligencia Artificial

Durante el desarrollo del proyecto se utilizó **ChatGPT como herramienta de asistencia**.

La inteligencia artificial fue utilizada principalmente para:

- Analizar y comprender los requisitos del proyecto.
- Resolver dudas sobre Node.js, Express y PostgreSQL.
- Revisar la organización y estructura del backend.
- Asistir en la implementación y refactorización de rutas y servicios.
- Revisar consultas SQL y manejo de errores.
- Asistir en la creación y revisión de tests con Jest y Supertest.
- Apoyar la elaboración de la especificación OpenAPI y Swagger.
- Resolver errores encontrados durante el desarrollo.
- Guiar la configuración del deployment en Railway.
- Revisar y mejorar la documentación del proyecto.

El código generado o sugerido mediante inteligencia artificial fue revisado, probado y adaptado durante el desarrollo.

Las decisiones finales sobre la implementación, configuración y estructura del proyecto fueron verificadas mediante pruebas locales, tests automatizados y pruebas sobre el entorno desplegado.

---

## Autor

**Santiago Sánchez**

Proyecto Integrador 2
