# control_vacantes

Aplicación para gestionar vacantes: backend Spring Boot y frontend React.

## Puertos

| Servicio | URL |
| --- | --- |
| Backend (API) | http://localhost:8080 |
| Frontend | http://localhost:3000 |

El frontend reenvía las llamadas a `/api` hacia el backend en el puerto **8080**.

## Arranque rápido

Desde la raíz del repositorio:

```bash
./run vacantes
```

Levanta backend y frontend (si no estaban corriendo) y abre http://localhost:3000. `Ctrl+C` detiene los servidores que arrancó ese comando.

Para poder escribir `run vacantes` desde cualquier directorio, agregá esto a `~/.zshrc`:

```bash
export PATH="$HOME/Descargas/Personal_Proyects/control_vacantes:$PATH"
```

Después recargá el shell con `source ~/.zshrc`.

## Backend

Requiere Java 21.

Contra **Postgres local** (sin Supabase; aísla la implementación del deploy):

```bash
docker compose --profile local-db up -d postgres
cd backend
env SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

`env` hace falta en fish (`VAR=valor cmd` no existe ahí). No hay un `mvn` global: usá `./mvnw` desde `backend/`.

El test `VacantePostgresIsolationTest` hace lo mismo en Docker via Testcontainers. Las pruebas de Render/Supabase están en `backend/src/test/docs/curl_backend.md`.

Contra la URI de Supabase (`SUPABASE_DB_URL` en el entorno):

```bash
cd backend
./mvnw spring-boot:run
```

## Deploy (Render + Supabase)

Guía paso a paso: [docs/deploy-render.md](docs/deploy-render.md).

Resumen: conectá el repo en Render con el blueprint `render.yaml`, definí la variable secreta `SUPABASE_DB_URL` (URI del pooler de Supabase) y verificá `/healthz`. El frontend en Netlify debe apuntar a la misma URL pública del backend (`frontend/netlify.toml`).

Plantilla de variables: `.env.example` (no commitear secretos).

## Frontend (desarrollo)

```bash
cd frontend
npm install
npm run dev
```

## Frontend (Docker)

Desde la raíz del repositorio, `docker compose up` levanta la UI en el puerto 3000 y la conecta al backend del host en el puerto 8080 (`BACKEND_PORT=8080`). El backend hay que ejecutarlo aparte.
