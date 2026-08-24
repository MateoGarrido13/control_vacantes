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

```bash
cd backend/vacante
./mvnw spring-boot:run
```

## Frontend (desarrollo)

```bash
cd frontend
npm install
npm run dev
```

## Frontend (Docker)

Desde la raíz del repositorio, `docker compose up` levanta la UI en el puerto 3000 y la conecta al backend del host en el puerto 8080 (`BACKEND_PORT=8080`). El backend hay que ejecutarlo aparte.
