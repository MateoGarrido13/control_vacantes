# Pruebas del backend

Hay dos entornos. No mezclarlos: el 42P01 de `supabase_migrations.schema_migrations` lo genera el dashboard de Supabase, no este backend.

## A. Implementación (Postgres local, sin Supabase)

Prueba el código contra PostgreSQL vanilla. No usa Render ni `SUPABASE_DB_URL`.

### A1. Test automatizado (Testcontainers)

Desde `backend/`:

```bash
./mvnw test -Dtest=VacantePostgresIsolationTest
```

Levanta Postgres 16 en Docker, crea/lista una vacante y verifica que Hibernate solo toca la tabla `vacantes`.

### A2. API manual

```bash
docker compose --profile local-db up -d postgres
```

En otra terminal:

```bash
cd backend
env SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

```bash
curl --fail --silent --show-error http://localhost:8080/healthz

curl --fail --silent --show-error \
  --request POST \
  http://localhost:8080/api/v1/vacantes \
  --header 'Content-Type: application/json' \
  --data '{
    "puesto": "Prueba local",
    "requisitos": "Postgres local",
    "empresa": "Control Vacantes",
    "modalidad": "Remoto",
    "fecha_vto": null,
    "estado": "PENDIENTE",
    "prioridad": "MEDIA"
  }'

curl --fail --silent --show-error http://localhost:8080/api/v1/vacantes
```

En este Postgres no existe el schema `supabase_migrations`. Si la API funciona, el 42P01 del dashboard no viene de estas consultas.

## B. Deploy (Render + Supabase)

Esta prueba verifica que el backend desplegado en Render responde y persiste en PostgreSQL de Supabase.

Definí la URL del servicio (fish):

```fish
set -x RENDER_API_URL https://control-vacantes-1.onrender.com
```

En bash/zsh: `export RENDER_API_URL=https://control-vacantes-1.onrender.com`

Si recreaste Render con otro nombre, cambiá esa URL. Ver `docs/deploy-render.md`.

### 1. Verificar el estado del servicio

```bash
curl --fail --silent --show-error \
  "$RENDER_API_URL/healthz"
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

### 2. Crear una vacante
Como parametro en formato JSON :

```bash
curl --fail --silent --show-error \
  --request POST \
  "$RENDER_API_URL/api/v1/vacantes" \
  --header 'Content-Type: application/json' \
  --data '{
    "puesto": "Prueba de persistencia",
    "requisitos": "Registro de verificación Supabase",
    "empresa": "Control Vacantes",
    "modalidad": "Remoto",
    "fecha_vto": null,
    "estado": "PENDIENTE",
    "prioridad": "MEDIA"
  }'
```

Respuesta esperada (`id` será diferente en cada ejecución):

```json
{
  "id": "093053d7-b92f-457f-b835-9bcf7ccf749e",
  "puesto": "Prueba de persistencia",
  "requisitos": "Registro de verificación Supabase",
  "empresa": "Control Vacantes",
  "modalidad": "Remoto",
  "fecha_vto": null,
  "estado": "PENDIENTE",
  "prioridad": "MEDIA"
}
```

El servidor debe responder con el estado HTTP `201 Created`.

### 3. Consultar las vacantes

```bash
curl --fail --silent --show-error \
  "$RENDER_API_URL/api/v1/vacantes"
```

Respuesta esperada:

```json
[
  {
    "id": "093053d7-b92f-457f-b835-9bcf7ccf749e",
    "puesto": "Prueba de persistencia",
    "requisitos": "Registro de verificación Supabase",
    "empresa": "Control Vacantes",
    "modalidad": "Remoto",
    "fecha_vto": null,
    "estado": "PENDIENTE",
    "prioridad": "MEDIA"
  }
]
```

La lista también puede contener otras vacantes existentes.

### 4. Verificar la persistencia

1. Reiniciar o redesplegar el servicio en Render.
2. Esperar hasta que `/healthz` vuelva a responder con `{"status":"ok"}`.
3. Repetir la consulta `GET /api/v1/vacantes`.
4. Confirmar que la vacante creada continúa en la respuesta.

Si el registro sigue presente después del reinicio, la persistencia en Supabase funciona correctamente.
