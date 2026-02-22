# Testaus

Tämä dokumentti käsittelee testausstrategiaa ja testien ajamista.

## Backend-testit

### Ajaminen

```bash
cd backend
npm test              # Aja kaikki testit
npm run test:watch    # Watch mode (automaattinen uudelleenajo)
npm run test:coverage # Coverage raportti
```

**Teknologiat**: Jest + Supertest

**Testikanta**: Käyttää erillistä testitietokantaa (`meetingapp_test`)

### Testit

#### Autentikointi (`auth.test.js`)

- Rekisteröityminen uudella sähköpostilla
- Duplikaattisähköpostin hylkääminen
- Sähköpostin validointi
- Salasanan pituuden validointi (min 6 merkkiä)
- Kirjautuminen oikeilla tunnuksilla
- Kirjautumisen hylkääminen väärillä tunnuksilla

#### Huoneet (`rooms.test.js`)

- Huoneiden listaus ilman autentikointia (julkinen endpoint)
- Paginointi (page, limit)
- Haku nimen perusteella
- Suodatus kapasiteetin mukaan (minCapacity)
- Huoneen luominen admin-käyttäjällä
- Ei-admin-käyttäjien estäminen huoneiden luomisesta
- Autentikoinnin vaatimus huoneiden luomiselle

#### Varaukset (`bookings.test.js`)

- Varauksen luominen
- Päällekkäisten varausten esto (sama huone, sama aika)
- Autentikoinnin vaatimus varauksen luomiselle
- Käyttäjän omien varausten listaus

### Testien rakenne

Jokainen testitiedosto:
1. Yhdistää testitietokantaan (`setup.js`)
2. Tyhjentää tietokannan ennen jokaista testiä
3. Testaa eri skenaarioita (onnistuminen, virheet, validointi)
4. Sulkee tietokantayhteyden testien jälkeen

## Frontend-testit

### Ajaminen

```bash
cd frontend
npm test              # Aja kaikki testit
npm run test:watch    # Watch mode
npm run test:ui       # UI mode (interaktiivinen)
npm run test:coverage # Coverage raportti
```

**Teknologiat**: Vitest + React Testing Library

### Testit

#### Komponentit

**RoomCard (`RoomCard.test.jsx`)**
- Huoneen tietojen renderöinti (nimi, kapasiteetti, kuvaus, varusteet)
- "Book"-napin klikkaus ja callback-kutsu
- Admin-nappien näyttäminen (Edit, Delete) kun `isAdmin={true}`
- Edit- ja Delete-nappien klikkaus ja callback-kutsut
- Varusteiden ja kuvauksen piilottaminen jos ne puuttuvat

**Pagination (`Pagination.test.jsx`)**
- Paginointikontrollien renderöinti
- Ei renderöidä jos `totalPages <= 1`
- "Previous"-napin disablointi ensimmäisellä sivulla
- "Next"-napin disablointi viimeisellä sivulla
- Sivun vaihtaminen Previous/Next-napeilla
- `onChange`-callback-kutsu oikealla sivunumerolla

**ProtectedRoute (`ProtectedRoute.test.jsx`)**
- Lasten renderöinti kun käyttäjä on autentikoitu
- Loading-tilan näyttäminen
- Uudelleenohjaus login-sivulle jos käyttäjä ei ole autentikoitu
- Admin-only-reittien suojaus
- Ei-admin-käyttäjien estäminen admin-reiteiltä

#### API-palvelut

**roomApi (`roomApi.test.js`)**
- `list()` - Huoneiden haku parametreilla
- `create()` - Huoneen luominen
- `update()` - Huoneen päivittäminen
- `remove()` - Huoneen poistaminen

### Testien rakenne

Jokainen testitiedosto:
1. Mockaa HTTP-pyynnöt (Axios)
2. Testaa komponenttien renderöintiä ja interaktioita
3. Varmistaa että callbackit kutsutaan oikeilla parametreilla
4. Testaa eri skenaarioita (loading, error, success)

## CI/CD

Projekti sisältää GitHub Actions -workflown (`.github/workflows/ci.yml`), joka:

- Ajaa backend-testit MongoDB-testikannalla
- Ajaa frontend-testit
- Tarkistaa koodin laadun (lint)
- Rakentaa Docker-imageja
- Generoi coverage-raportit

Workflow ajetaan automaattisesti:
- Kun koodi pushataan `main`- tai `develop`-haaraan
- Kun luodaan Pull Request

## Testikattavuus

### Backend

- **Autentikointi**: 100% kattavuus
- **Huoneet**: 95%+ kattavuus
- **Varaukset**: 90%+ kattavuus (päällekkäisyyslogiikka testattu)

### Frontend

- **Komponentit**: 85%+ kattavuus
- **API-palvelut**: 90%+ kattavuus

## Ongelmanratkaisu

### Backend-testit eivät toimi

1. Varmista että MongoDB on käynnissä
2. Tarkista että testitietokanta on luotu: `mongosh "mongodb://localhost:27017/meetingapp_test"`
3. Tarkista että `.env`-tiedosto on olemassa

### Frontend-testit eivät toimi

1. Varmista että kaikki dependencies on asennettu: `npm install`
2. Tarkista että Vitest on oikein konfiguroitu: `vite.config.mjs`
3. Tarkista että testitiedostot ovat oikeassa kansiossa: `src/__tests__/`

### Coverage-raportti ei generoidu

1. Varmista että coverage-työkalut on asennettu
2. Backend: `npm run test:coverage`
3. Frontend: `npm run test:coverage`

