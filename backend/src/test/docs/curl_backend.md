# Prueba del backend con CURL

Esta prueba verifica que el backend desplegado en Render responde correctamente y persiste las vacantes en PostgreSQL de Supabase.

## 1. Verificar el estado del servicio

```bash
curl --fail --silent --show-error \
  https://control-vacantes.onrender.com/healthz
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

## 2. Crear una vacante
Como parametro en formato JSON :

```bash
curl --fail --silent --show-error \
  --request POST \
  https://control-vacantes.onrender.com/api/v1/vacantes \
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

## 3. Consultar las vacantes

```bash
curl --fail --silent --show-error \
  https://control-vacantes.onrender.com/api/v1/vacantes
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

## 4. Verificar la persistencia

1. Reiniciar o redesplegar el servicio en Render.
2. Esperar hasta que `/healthz` vuelva a responder con `{"status":"ok"}`.
3. Repetir la consulta `GET /api/v1/vacantes`.
4. Confirmar que la vacante creada continúa en la respuesta.

Si el registro sigue presente después del reinicio, la persistencia en Supabase funciona correctamente.