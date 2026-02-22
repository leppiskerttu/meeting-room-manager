# Tulevat parannukset

Tämä dokumentti listaa mahdollisia tulevia parannuksia ja lisäominaisuuksia.

## Suunnitellut ominaisuudet

### Käyttöliittymä

- **Kalenterinäkymä**: Varaukset kalenterimuodossa
- **Varausmuistutukset**: Sähköposti- tai push-ilmoitukset ennen varauksen alkua
- **Toistuvat varaukset**: Mahdollisuus luoda toistuvia varauksia (päivittäin, viikoittain, jne.)
- **Varausvahvistus**: Sähköpostivahvistus varauksen luonnista
- **Varausmuokkaus**: Mahdollisuus muokata olemassa olevaa varausta
- **Huoneiden kuvat**: Kuvien lisääminen huoneisiin
- **Huoneiden sijainti**: Kartta tai kerros/sijaintitiedot

### Backend

- **Sähköpostipohjaiset ilmoitukset**: Nodemailer tai vastaava
- **Push-ilmoitukset**: Web Push API
- **Varaushistoria**: Arkistoidut varaukset (ei vain tulevat)
- **Raportointi**: Varausstatistiikat ja raportit
- **API-rate limiting**: Yleisempi rate limiting kaikille endpointeille
- **Caching**: Redis-cache suorituskyvyn parantamiseksi
- **WebSocket**: Reaaliaikaiset päivitykset (uudet varaukset, jne.)

### Tietoturva

- **2FA**: Kaksivaiheinen autentikointi
- **Salasanan resetointi**: Sähköpostipohjainen salasanan palautus
- **Sessiohallinta**: Aktiivisten sessioiden hallinta
- **Audit log**: Yksityiskohtaiset lokit kaikista toiminnoista

### Suorituskyky

- **Database connection pooling**: Optimoidut tietokantayhteydet
- **Query optimization**: Lisää indeksejä ja optimoituja kyselyitä
- **CDN**: Staattisten tiedostojen CDN-käyttö
- **Image optimization**: Kuvien optimointi ja kompressio

### DevOps

- **Kubernetes**: Kubernetes-deployment
- **Monitoring**: Prometheus + Grafana
- **Error tracking**: Sentry tai vastaava
- **Automated backups**: Automaattiset tietokantavarmuuskopiot

## Teknisiä parannuksia

### Koodin laatu

- **TypeScript**: TypeScript-migraatio parempaa tyyppiturvallisuutta varten
- **ESLint säännöt**: Tiukemmat lint-säännöt
- **Prettier**: Automaattinen koodin muotoilu
- **Husky**: Git-hookit ennen committia

### Testaus

- **E2E-testit**: Playwright tai Cypress
- **Load testing**: K6 tai Artillery
- **Visual regression testing**: Percy tai Chromatic

### Dokumentaatio

- **API-versionointi**: API-versionointi (`/api/v1/`, `/api/v2/`)
- **OpenAPI-spec**: Täydellinen OpenAPI 3.0 -spesifikaatio
- **Postman collection**: Postman-kokoelma API-testausta varten

## Toteutettuja parannuksia

- ✅ Strukturoitu logitus (Winston)
- ✅ Tietokanta-indeksointi
- ✅ Automaattinen vanhentuneiden varausten poisto
- ✅ Docker-deployment
- ✅ CI/CD (GitHub Actions)
- ✅ Kattavat testit (backend + frontend)
- ✅ Swagger API-dokumentaatio
- ✅ Rate limiting login-endpointille
- ✅ Clean architecture
- ✅ Apple-luxury design

## Priorisointi

### Korkea prioriteetti

1. Sähköpostipohjaiset ilmoitukset
2. Varaushistoria
3. TypeScript-migraatio
4. E2E-testit

### Keskiarvoinen prioriteetti

1. Kalenterinäkymä
2. Toistuvat varaukset
3. Monitoring ja error tracking
4. API-versionointi

### Matala prioriteetti

1. Push-ilmoitukset
2. 2FA
3. Kubernetes-deployment
4. CDN

## Huomioita

Nämä ovat suunnitelmia ja ideoita. Prioriteetit voivat muuttua projektin kehityksen myötä. Jos haluat toteuttaa jonkin näistä ominaisuuksista, kannattaa aloittaa korkean prioriteetin kohteista.

