# Frontend — Control de Vacantes

Interfaz React (Vite + TypeScript) para gestionar vacantes.

## Desarrollo local

Hace falta Node 20 o posterior. El backend tiene que estar corriendo en el puerto 8080.

```bash
npm install
npm run dev
```

La UI queda en http://localhost:3000 y reenvía `/api` al backend.

Desde la raíz del repositorio también se puede usar `./run vacantes`.

## Docker

En la imagen, nginx sirve el build y proxea `/api/` al backend. El host y el puerto salen de `BACKEND_HOST` y `BACKEND_PORT`. El `docker-compose.yml` de la raíz usa `BACKEND_PORT=8080`.
