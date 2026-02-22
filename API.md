# API-dokumentaatio

Tämä dokumentti käsittelee API-endpointteja, Swagger-dokumentaatiota ja curl-esimerkkejä.

## API Endpointit

### Autentikointi

- `POST /api/auth/register` - Rekisteröityminen
- `POST /api/auth/login` - Kirjautuminen (rate limited: 5/15min)
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - Kirjautuminen ulos

### Huoneet

- `GET /api/rooms` - Listaa huoneet (pagination, search, filter)
  - Query params: `page`, `limit`, `search`, `minCapacity`
- `GET /api/rooms/:id` - Hae yksi huone
- `POST /api/rooms` - Luo huone (ADMIN only)
- `PUT /api/rooms/:id` - Päivitä huone (ADMIN only)
- `DELETE /api/rooms/:id` - Poista huone (ADMIN only)

### Varaukset

- `GET /api/bookings` - Listaa kaikki varaukset (ADMIN only)
- `GET /api/bookings/me` - Listaa omat varaukset (USER)
- `POST /api/bookings` - Luo varaus (USER)
  - Body: `{ roomId, startTime, endTime }`
- `DELETE /api/bookings/:id` - Poista varaus (USER: oma, ADMIN: mikä tahansa)

**Täydellinen API-dokumentaatio**: http://localhost:4000/api/docs

## Swagger UI

Swagger-dokumentaatio: http://localhost:4000/api/docs

### Kuinka käyttää Bearer tokenia Swaggerissa

1. **Hae access token:**
   - Avaa Swagger UI: http://localhost:4000/api/docs
   - Kokeile `POST /api/auth/login` endpointia:
     ```json
     {
       "email": "admin@example.com",
       "password": "admin123"
     }
     ```
   - Kopioi vastauksesta `accessToken`-kentän arvo

2. **Aseta token Swaggerissa:**
   - Klikkaa "Authorize" -painiketta Swagger UI:n yläosassa
   - Syötä token-kenttään: `Bearer YOUR_ACCESS_TOKEN_HERE`
   - Tai pelkkä token: `YOUR_ACCESS_TOKEN_HERE` (Bearer lisätään automaattisesti)
   - Klikkaa "Authorize" ja sitten "Close"

3. **Testaa suojattuja endpointteja:**
   - Nyt voit kokeilla esim. `POST /api/rooms` tai `GET /api/bookings/me`
   - Token lähetetään automaattisesti Authorization-headerissa

**Huom:** Access token vanhenee 15 minuutissa. Jos saat 401-virheen, hae uusi token login-endpointista.

## Curl-esimerkit

### Rekisteröityminen

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Kirjautuminen

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Vastaus:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Hae huoneet

```bash
curl http://localhost:4000/api/rooms
```

### Hae huoneet (paginointi ja haku)

```bash
# Sivu 1, 10 huonetta per sivu
curl "http://localhost:4000/api/rooms?page=1&limit=10"

# Hae huoneita nimen perusteella
curl "http://localhost:4000/api/rooms?search=conference"

# Suodata kapasiteetin mukaan (min 10 henkilöä)
curl "http://localhost:4000/api/rooms?minCapacity=10"
```

### Luo varaus

```bash
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "roomId": "ROOM_ID",
    "startTime": "2024-02-23T10:00:00.000Z",
    "endTime": "2024-02-23T11:00:00.000Z"
  }'
```

### Hae omat varaukset

```bash
curl http://localhost:4000/api/bookings/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Peruuta varaus

```bash
curl -X DELETE http://localhost:4000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Admin: Luo huone

```bash
curl -X POST http://localhost:4000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "name": "Conference Room A",
    "capacity": 10,
    "description": "Large conference room with projector",
    "equipment": "Projector, Whiteboard, TV"
  }'
```

### Admin: Päivitä huone

```bash
curl -X PUT http://localhost:4000/api/rooms/ROOM_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN" \
  -d '{
    "name": "Conference Room A (Updated)",
    "capacity": 15,
    "description": "Updated description",
    "equipment": "Projector, Whiteboard"
  }'
```

### Admin: Poista huone

```bash
curl -X DELETE http://localhost:4000/api/rooms/ROOM_ID \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

### Admin: Hae kaikki varaukset

```bash
curl http://localhost:4000/api/bookings \
  -H "Authorization: Bearer ADMIN_ACCESS_TOKEN"
```

## Päällekkäisten varausten esto

Sovellus estää päällekkäiset varaukset samalle huoneelle käyttäen logiikkaa:

```
newStart < existingEnd AND newEnd > existingStart
```

Tämä tarkistaa, että uusi varaus ei päällekkäin minkään olemassa olevan varauksen kanssa.

**Esimerkki:**
- Olemassa oleva varaus: 10:00 - 11:00
- Uusi varaus: 10:30 - 11:30 → **Hylätään** (päällekkäisyys)
- Uusi varaus: 11:00 - 12:00 → **Hyväksytään** (ei päällekkäisyyttä)

Jos päällekkäisyys löytyy, palautetaan **400 Bad Request** -virhe.

Tarkistus tehdään Mongoose `pre('save')` middlewaren avulla ennen varauksen tallennusta tietokantaan.

## Virhekoodit

- **200 OK**: Onnistunut pyyntö
- **201 Created**: Resurssi luotu onnistuneesti
- **400 Bad Request**: Virheellinen input (validointi, päällekkäisyys)
- **401 Unauthorized**: Autentikointi vaaditaan tai token on vanhentunut
- **403 Forbidden**: Ei oikeuksia (esim. ei-admin yrittää luoda huonetta)
- **404 Not Found**: Resurssia ei löydy
- **500 Internal Server Error**: Server-virhe

## Response-muodot

### Onnistunut vastaus

```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### Virhe-vastaus

```json
{
  "message": "Error message here"
}
```

### Autentikointi-vastaus

```json
{
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "USER"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

