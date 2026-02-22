# Ympäristömuuttujat

Tämä dokumentti käsittelee ympäristömuuttujien konfigurointia ja .env-tiedostojen asetuksia.

## Backend (.env)

Luo `.env`-tiedosto `backend/`-kansioon:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/meetingapp
JWT_ACCESS_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
CLIENT_ORIGIN=http://localhost:5173
LOG_LEVEL=info
NODE_ENV=development
```

### Muuttujien selitykset

**PORT**
- Backend-serverin portti
- Oletus: `4000`
- Vaihtoehtoinen

**MONGO_URI**
- MongoDB-yhteyden URI
- Paikallinen: `mongodb://localhost:27017/meetingapp`
- Docker: `mongodb://mongo:27017/meetingapp`
- Pakollinen

**JWT_ACCESS_SECRET**
- Salainen avain access tokenien allekirjoitukseen
- **Tärkeää**: Vaihda turvalliseksi arvoksi tuotantokäyttöön!
- Pakollinen

**JWT_REFRESH_SECRET**
- Salainen avain refresh tokenien allekirjoitukseen
- **Tärkeää**: Vaihda turvalliseksi arvoksi tuotantokäyttöön!
- Pakollinen

**CLIENT_ORIGIN**
- Frontend-URL CORS-konfiguraatiota varten
- Kehitys: `http://localhost:5173`
- Docker: `http://localhost`
- Vaihtoehtoinen (oletus: `http://localhost:5173`)

**LOG_LEVEL**
- Logituksen taso
- Arvot: `error`, `warn`, `info`, `debug`
- Oletus: `info`
- Vaihtoehtoinen

**NODE_ENV**
- Node.js-ympäristö
- Arvot: `development`, `production`, `test`
- Oletus: `development`
- Vaihtoehtoinen

## Docker (.env)

Docker-käytössä käytä samoja muuttujia, mutta muuta:

```env
PORT=4000
MONGO_URI=mongodb://mongo:27017/meetingapp
JWT_ACCESS_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
CLIENT_ORIGIN=http://localhost
NODE_ENV=production
LOG_LEVEL=info
```

**Huom**: Dockerissa `MONGO_URI` käyttää `mongo`-palvelun nimeä (Docker Compose), ei `localhost`.

## Turvallisuus

### JWT-secretit

**Kehitys:**
- Voit käyttää mitä tahansa merkkijonoa
- Esim: `my-dev-secret-key-123`

**Tuotanto:**
- **Käytä vahvoja, satunnaisia merkkijonoja**
- Vähintään 32 merkkiä
- Generoi esim. komennolla:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- **Älä koskaan commitoi tuotantosecreteja Gitiin!**

### .env-tiedostojen hallinta

1. **Luo `.env.example`-tiedosto** (ilman salaisia arvoja):
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/meetingapp
   JWT_ACCESS_SECRET=your-secret-here
   JWT_REFRESH_SECRET=your-refresh-secret-here
   CLIENT_ORIGIN=http://localhost:5173
   LOG_LEVEL=info
   NODE_ENV=development
   ```

2. **Lisää `.env` `.gitignore`-tiedostoon**:
   ```
   .env
   backend/.env
   ```

3. **Dokumentoi** ympäristömuuttujat README:ssä tai tässä tiedostossa

## Validointi

Backend validoi ympäristömuuttujat käynnistyessään:

- **JWT_ACCESS_SECRET**: Pakollinen
- **JWT_REFRESH_SECRET**: Pakollinen

Jos nämä puuttuvat, sovellus ei käynnisty ja näyttää virheilmoituksen.

## Ongelmanratkaisu

### "Missing required environment variables"

1. Tarkista että `.env`-tiedosto on olemassa `backend/`-kansiossa
2. Tarkista että `JWT_ACCESS_SECRET` ja `JWT_REFRESH_SECRET` on määritelty
3. Tarkista tiedoston syntaksi (ei välilyöntejä `=`-merkin ympärillä)

### CORS-virheet

1. Tarkista että `CLIENT_ORIGIN` vastaa frontendin URL:ia
2. Kehitys: `http://localhost:5173`
3. Docker: `http://localhost`

### MongoDB-yhteys ei toimi

1. Tarkista että `MONGO_URI` on oikein
2. Paikallinen: `mongodb://localhost:27017/meetingapp`
3. Docker: `mongodb://mongo:27017/meetingapp`
4. Varmista että MongoDB on käynnissä

