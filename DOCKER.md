# Docker Deployment

Tämä dokumentti käsittelee Docker-kontainerointia ja production-deploymentia.

## Nopea aloitus

1. **Luo backend/.env-tiedosto** (katso [ENV.md](./ENV.md))

2. **Käynnistä Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Avaa selain**: http://localhost

4. **Seed-tietokanta** (vapaaehtoinen):
   ```bash
   docker-compose exec api npm run seed
   ```

## Mitä käynnistyy

- **MongoDB** (portti 27017, volume-persistenssi)
- **Backend API** (portti 4000, health checks)
- **Frontend** (portti 80, Nginx)

## Docker Compose -konfiguraatio

### MongoDB

- **Image**: `mongo:7`
- **Port**: `27017:27017`
- **Volume**: `mongo_data:/data/db` (persistenssi)
- **Health check**: MongoDB ping-komento

### Backend API

- **Build**: `./backend/Dockerfile`
- **Port**: `4000:4000`
- **Environment**: `.env`-tiedosto `backend/`-kansiosta
- **Volume**: `./backend/logs:/app/logs` (logitiedostot hostissa)
- **Health check**: HTTP GET `/api/health`
- **Depends on**: MongoDB (odottaa health checkia)

### Frontend

- **Build**: `./frontend/Dockerfile`
- **Port**: `80:80`
- **Nginx**: Proxy `/api`-pyynnöt backendille
- **Depends on**: Backend API

## Logitiedostot Dockerissa

Logitiedostot ovat saatavilla hostissa `backend/logs/`-kansiossa:

```bash
# Näytä logitiedostot
ls -la backend/logs/

# Seuraa live-logeja
tail -f backend/logs/combined.log

# Näytä virheet
tail -f backend/logs/error.log
```

## Backend Dockerfile

### Rakenne

1. **Base image**: `node:20-alpine` (kevyt)
2. **Dependencies**: Production-dependencies (`npm install --omit=dev`)
3. **Source code**: Kopioidaan `src/`-kansio
4. **Logs directory**: Luodaan `/app/logs` ja asetetaan oikeudet
5. **Non-root user**: `nodejs` (uid 1001)
6. **Health check**: Wget-komento `/api/health`-endpointiin
7. **Entrypoint**: `docker-entrypoint.sh` (MongoDB-yhteyden tarkistus + seed)

### Entrypoint-scripti

`docker-entrypoint.sh` suorittaa:

1. Tarkistaa MongoDB-yhteyden (Node.js-scriptillä)
2. Ajaa `npm run seed` jos tietokanta on tyhjä (vapaaehtoinen)
3. Käynnistää Node.js-serverin

## Frontend Dockerfile

### Rakenne

1. **Build stage**: 
   - `node:20-alpine`
   - Kopioi `package.json` ja asentaa dependencies
   - Kopioi source code ja buildaa Vite-projektin

2. **Production stage**:
   - `nginx:alpine`
   - Kopioi buildatut tiedostot Nginxille
   - Kopioi `nginx.conf`-konfiguraation

### Nginx-konfiguraatio

- **Root**: `/usr/share/nginx/html` (Vite build)
- **API proxy**: `/api` → `http://api:4000/api`
- **SPA routing**: Kaikki pyynnöt → `index.html`
- **Gzip**: Kompressio käytössä
- **Security headers**: XSS, clickjacking, jne.

## Production-ominaisuudet

- **Health checks**: Kaikille palveluille
- **Non-root käyttäjä**: Backendissä turvallisuuden vuoksi
- **Volume-persistenssi**: MongoDB-data ja logitiedostot
- **Automaattinen uudelleenkäynnistys**: `restart: always`
- **Environment variables**: `.env`-tiedostosta
- **Log rotation**: Winston-loggerissa (max 5MB, 5 tiedostoa)

## Komentoja

```bash
# Käynnistä kaikki palvelut
docker-compose up -d

# Pysäytä kaikki palvelut
docker-compose down

# Näytä logit
docker-compose logs -f

# Näytä backend-logit
docker-compose logs -f api

# Käynnistä uudelleen backend
docker-compose restart api

# Aja komento backend-kontainerissa
docker-compose exec api npm run seed

# Rakenna uudelleen
docker-compose build

# Rakenna ja käynnistä
docker-compose up -d --build
```

## Ongelmanratkaisu

### MongoDB-yhteys ei toimi

1. Tarkista että MongoDB-kontaineri on käynnissä: `docker-compose ps`
2. Tarkista `.env`-tiedoston `MONGO_URI` (pitää olla `mongodb://mongo:27017/meetingapp`)
3. Tarkista MongoDB-lokit: `docker-compose logs mongo`

### Backend ei käynnisty

1. Tarkista backend-lokit: `docker-compose logs api`
2. Tarkista että `.env`-tiedosto on olemassa ja oikein konfiguroitu
3. Tarkista health check: `curl http://localhost:4000/api/health`

### Frontend ei näy

1. Tarkista frontend-lokit: `docker-compose logs frontend`
2. Tarkista että backend on käynnissä: `docker-compose ps`
3. Tarkista Nginx-konfiguraatio: `docker-compose exec frontend cat /etc/nginx/nginx.conf`

### Logitiedostot eivät luotu

1. Tarkista että `backend/logs/`-kansio on olemassa hostissa
2. Tarkista volume-määritys `docker-compose.yml`:ssä
3. Tarkista tiedostojen oikeudet: `ls -la backend/logs/`

