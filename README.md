# Meeting Room Booking App

Production-ready fullstack MERN-sovellus kokoushuoneiden varausjärjestelmälle. Sovellus tarjoaa täydellisen ratkaisun kokoushuoneiden hallintaan ja varaamiseen, mukaan lukien käyttäjähallinnan, roolipohjaisen käyttöoikeuksien hallinnan, automaattisen päällekkäisten varausten eston ja kattavan logituksen.

<div align="center">

<img src="https://github.com/user-attachments/assets/0dd7ed44-b2f0-4b3f-832a-d47a05d00ed9" width="800" alt="Dashboard screenshot" />

<img src="https://github.com/user-attachments/assets/3e2565d4-5994-4930-aa48-e97503428aa9" width="400" alt="Room booking screenshot" />

<img src="https://github.com/user-attachments/assets/8fc422d7-f7d6-4cd7-a0dd-df85740662e0" width="800" alt="Booking calendar screenshot" />

</div>



## Yleiskuvaus

Tämä on täysin toiminnallinen, production-valmis kokoushuoneiden varausjärjestelmä, joka on rakennettu modernilla tech stackilla. Sovellus tukee sekä tavallisia käyttäjiä että ylläpitäjiä, tarjoten erilaiset käyttöoikeudet ja ominaisuudet kullekin roolille.

## Pääominaisuudet

- **Käyttäjähallinta**: Rekisteröityminen, kirjautuminen, JWT-autentikointi
- **Roolipohjainen käyttöoikeuksien hallinta**: USER ja ADMIN -roolit
- **Huoneiden hallinta**: Luominen, muokkaaminen, poistaminen (ADMIN)
- **Varausjärjestelmä**: Varauksien luominen, tarkistelu ja peruuttaminen
- **Päällekkäisten varausten esto**: Automaattinen tarkistus ja estäminen
- **Paginointi ja haku**: Tehokas huoneiden listaus ja suodatus
- **Automaattinen siivous**: Vanhentuneiden varausten poisto
- **Strukturoitu logitus**: Winston-kirjastolla tiedostoon
- **Tietokanta-indeksointi**: Optimoidut kyselyt nopeaan suorituskykyyn
- **API-dokumentaatio**: Swagger/OpenAPI
- **Docker-tuki**: Valmis production-deploymentiin
- **Testaus**: Kattavat yksikkö- ja integraatiotestit

## Tech Stack

### Frontend
- **React 18** - Moderni UI-kirjasto
- **Vite** - Nopea build-työkalu
- **React Router** - Sivujen reititys
- **Axios** - HTTP-client token refresh -logiikalla
- **TailwindCSS** - Utility-first CSS-framework
- **Vitest** - Testausframework
- **React Testing Library** - Komponenttitestit

### Backend
- **Node.js** - JavaScript-runtime
- **Express.js** - Web-framework
- **MongoDB** - NoSQL-tietokanta
- **Mongoose** - ODM (Object Document Mapper)
- **JWT** - Autentikointi (access + refresh tokens)
- **Joi** - Input-validointi
- **Winston** - Strukturoitu logitus
- **Jest** - Testausframework
- **Supertest** - API-testit

### DevOps & Tools
- **Docker** - Kontainerointi
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Web-server frontendissä
- **GitHub Actions** - CI/CD
- **Swagger/OpenAPI** - API-dokumentaatio

## Projektin rakenne

```
MeetingApp/
├── backend/
│   ├── src/
│   │   ├── controllers/      # HTTP-request handlers
│   │   ├── services/         # Business logic layer
│   │   ├── models/           # Mongoose schemas (User, Room, Booking)
│   │   ├── routes/           # API routes ja Swagger-dokumentaatio
│   │   ├── middlewares/      # Auth, validation, error handling, rate limiting
│   │   ├── utils/            # Helpers (JWT, Swagger, Logger)
│   │   ├── scripts/          # Seed-scripti testidatalle
│   │   ├── __tests__/        # Backend-testit (Jest + Supertest)
│   │   ├── app.js            # Express app setup
│   │   └── server.js         # Server entry point
│   ├── logs/                 # Logitiedostot (luodaan automaattisesti)
│   ├── Dockerfile
│   ├── docker-entrypoint.sh
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Uudelleenkäytettävät komponentit
│   │   ├── pages/            # Sivukomponentit
│   │   ├── services/         # API-client (Axios)
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── __tests__/        # Frontend-testit (Vitest)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml            # CI/CD workflow
├── docker-compose.yml
├── README.md
├── DOCKER.md
├── TESTS.md
├── LOGGING.md
├── API.md
├── ENV.md
└── IMPROVEMENTS.md
```

## Arkkitehtuuri

### Backend (Clean Architecture)

Sovellus noudattaa clean architecture -periaatteita, jossa kerrokset on selkeästi eroteltu:

1. **Controllers** (`controllers/`)
   - Käsittelevät HTTP-pyynnöt
   - Validoivat inputit middlewarejen avulla
   - Kutsuvat service-kerrosta
   - Palauttavat HTTP-vastaukset

2. **Services** (`services/`)
   - Sisältävät business logiikan
   - Päällekkäisten varausten tarkistus
   - Automaattinen vanhentuneiden varausten poisto
   - Ei riipu HTTP:stä

3. **Models** (`models/`)
   - Mongoose-schemat (User, Room, Booking)
   - Tietokanta-indeksit suorituskyvyn optimointiin
   - Validointi ja middlewaret (esim. päällekkäisyystarkistus)

4. **Routes** (`routes/`)
   - API-reitit ja endpointit
   - Middleware-ketjut (auth, validation, rate limiting)
   - Swagger-dokumentaatio

5. **Middlewares** (`middlewares/`)
   - `auth.js`: JWT-tokenin validointi ja käyttäjätietojen asettaminen
   - `validate.js`: Input-validointi Joi-skeemojen avulla
   - `errorHandler.js`: Keskitetty virheenkäsittely ja logitus
   - `rateLimiter.js`: Rate limiting login-endpointille (5 yritystä / 15 min)

6. **Utils** (`utils/`)
   - `jwt.js`: JWT-tokenien generointi ja validointi
   - `logger.js`: Winston-logger strukturoituun logitukseen
   - `swaggerSpec.js`: Swagger/OpenAPI konfiguraatio

### Frontend

- **React Router**: Sivujen reititys ja suojatut reitit
- **AuthContext**: Globaali autentikointitila ja token refresh
- **ProtectedRoute**: Suojatut reitit käyttäjille/adminille
- **Axios**: HTTP-client automaattisella token refresh -logiikalla
- **TailwindCSS**: Utility-first CSS responsive-designille

## Nopea aloitus

### Vaatimukset

- Node.js (v18+)
- MongoDB (paikallinen tai Docker)
- npm tai yarn
- Docker & Docker Compose (vapaaehtoinen, mutta suositeltu)

### 1. Kloonaa projekti

```bash
git clone <repository-url>
cd MeetingApp
```

### 2. Backend setup

```bash
cd backend
npm install
```

Luo `.env`-tiedosto `backend/`-kansioon. Katso [ENV.md](./ENV.md) ympäristömuuttujien määrittelystä.

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Seed-tietokanta (vapaaehtoinen)

Luo testidataa (admin-käyttäjä + 10 huonetta):

```bash
cd backend
npm run seed
```

Tämä luo:
- **Admin-käyttäjä**: `admin@example.com` / `admin123`
- **Käyttäjä**: `user@example.com` / `user123`
- **10 huonetta** eri kapasiteeteilla ja varusteilla

**Huom**: Seed-scripti tyhjentää tietokannan. Jos haluat säilyttää olemassa olevat tiedot, kommentoi pois `deleteMany`-kutsut `backend/src/scripts/seed.js`-tiedostosta.

### 5. Käynnistä MongoDB

**Vaihtoehto 1: Paikallinen MongoDB**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Käynnistä MongoDB-palvelu Services-ikkunasta
```

**Vaihtoehto 2: Docker Compose**

```bash
# Projektin juuresta
docker-compose up -d mongo
```

### 6. Käynnistä sovellus

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# tai kehityksessä:
npm run dev
```

Backend käynnistyy porttiin 4000.

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend käynnistyy porttiin 5173.

### 7. Avaa selain

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Swagger docs**: http://localhost:4000/api/docs

## Käyttäjät ja roolit

### USER (oletusrooli)

- Rekisteröityä ja kirjautua
- Nähdä kaikki huoneet (paginointi, haku, suodatus)
- Tehdä varauksen
- Nähdä omat varaukset
- Perua oman varauksen

### ADMIN

- Kaikki USER-ominaisuudet +
- Luoda, muokata ja poistaa huoneita
- Nähdä kaikki varaukset (kaikilta käyttäjiltä)
- Poistaa minkä tahansa varauksen

**Admin-käyttäjän luominen:**

Helpoin tapa on käyttää seed-scriptiä:
```bash
cd backend
npm run seed
```

Tämä luo admin-käyttäjän: `admin@example.com` / `admin123`

## Autentikointi

### JWT Token -arkkitehtuuri

Sovellus käyttää kaksiosaisia JWT-tokeneita:

- **Access Token**: 
  - Voimassa 15 minuuttia
  - Lähetetään `Authorization: Bearer <token>` headerissa
  - Sisältää käyttäjän ID:n ja roolin

- **Refresh Token**: 
  - Voimassa 7 päivää
  - Lähetetään httpOnly-cookiena (turvallisempi)
  - Käytetään uuden access tokenin hakemiseen

### Token Refresh

Frontend päivittää automaattisesti access tokenin refresh tokenilla, kun se vanhenee. Tämä tapahtuu automaattisesti Axios-interceptorin avulla.

### Turvallisuus

- **Password hashing**: bcrypt (salt rounds: 10)
- **Rate limiting**: Login-endpoint (5 yritystä / 15 min)
- **Input validation**: Joi-skeemat kaikille inputeille
- **CORS**: Konfiguroitu frontend-origineille
- **Helmet**: Security headers (XSS, clickjacking, jne.)
- **httpOnly cookies**: Refresh token ei ole saatavilla JavaScriptistä

## Lisädokumentaatio

- **[DOCKER.md](./DOCKER.md)** - Docker deployment ja container-asetukset
- **[TESTS.md](./TESTS.md)** - Testausohjeet backend- ja frontend-testeille
- **[LOGGING.md](./LOGGING.md)** - Logitus, tietokanta-indeksointi ja suorituskyky
- **[API.md](./API.md)** - API-dokumentaatio, Swagger ja curl-esimerkit
- **[ENV.md](./ENV.md)** - Ympäristömuuttujat ja .env-konfiguraatio
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Tulevat parannukset ja lisäominaisuudet

## Lisenssi

MIT

## Kehittäjä

©2026 Niko Lepistö
