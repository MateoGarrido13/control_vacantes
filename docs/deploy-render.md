# Deploy: Render + Supabase

Backend en **Render** (Docker), base de datos en **Supabase**. El frontend en producción suele ir en **Netlify** y proxea `/api` hacia Render.

## 1. Supabase (base de datos)

1. Entrá a [Supabase Dashboard](https://supabase.com/dashboard) y abrí el proyecto (región `sa-east-1` si ya lo tenés ahí).
2. **Project Settings → Database** (o botón **Connect**).
3. Elegí **Connection string → URI → Session pooler** (host `*.pooler.supabase.com`, puerto `5432`).
4. Copiá la URI y reemplazá `[YOUR-PASSWORD]` por la contraseña de la base (`Database password`; si no la tenés, **Reset database password**).
5. El usuario tiene la forma `postgres.<project_ref>` — el `project_ref` está en **Settings → General → Reference ID**.

Ejemplo (placeholders):

```text
postgresql://postgres.abcdefgh:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

Guardá esa URI; la vas a pegar en Render como `SUPABASE_DB_URL`. Ver también `.env.example` en la raíz del repo.

## 2. Render (backend API)

### Opción A — Blueprint (recomendada)

1. Subí este repositorio a GitHub (`main` actualizado con `render.yaml`).
2. [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Conectá el repo `MateoGarrido13/control_vacantes`.
4. Render detecta `render.yaml` y crea el servicio `control-vacantes`.
5. Cuando pida variables, definí **`SUPABASE_DB_URL`** con la URI completa (marcala como **Secret**).
6. Esperá el deploy. La URL pública será algo como:

   `https://control-vacantes.onrender.com`

   (Si el nombre `control-vacantes` ya está tomado en tu cuenta, cambiá `name` en `render.yaml` y actualizá Netlify / `RENDER_API_URL`.)

### Opción B — Manual

1. **New → Web Service** → mismo repo, rama `main`.
2. **Runtime: Docker**, Dockerfile en la raíz (`./Dockerfile`).
3. **Region:** São Paulo (`saoPaulo`), plan Free si alcanza.
4. **Health Check Path:** `/healthz`
5. Variable de entorno:
   - `SUPABASE_DB_URL` = URI de Supabase (secreto)
6. Deploy.

### Comportamiento en plan Free

- El servicio **se duerme** tras inactividad; la primera petición puede tardar ~30–60 s.
- Memoria limitada: el blueprint ya setea `JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75.0`.

### Verificación

Desde cualquier terminal (fish):

```fish
set -x RENDER_API_URL https://control-vacantes.onrender.com
curl --fail --silent --show-error $RENDER_API_URL/healthz
```

Respuesta esperada: `{"status":"ok"}`.

Pruebas completas de API: `backend/src/test/docs/curl_backend.md` (sección B).

## 3. Netlify (frontend)

El archivo `frontend/netlify.toml` reenvía `/api/*` al backend en Render. Si tu URL de Render **no** es `https://control-vacantes.onrender.com`, editá la línea `to = "https://..."` con la URL real y volvé a desplegar el frontend.

Build en Netlify (típico):

| Campo | Valor |
| --- | --- |
| Base directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Publish directory | `frontend/dist` |

## 4. Checklist rápido

- [ ] `SUPABASE_DB_URL` configurada en Render (sin comillas extra; password URL-encoded si tiene caracteres especiales).
- [ ] `/healthz` responde 200.
- [ ] `POST /api/v1/vacantes` crea registro y `GET` lo lista después de redeploy (persistencia Supabase).
- [ ] `frontend/netlify.toml` apunta a la URL correcta de Render.

## 5. Desarrollo local (sin Render)

Postgres en Docker + perfil `local`: ver `README.md`. No uses `SUPABASE_DB_URL` en local si querés aislar del deploy.
