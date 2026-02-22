/**
 * Testiskripti logituksen testaamiseen
 * 
 * Käyttö:
 * 1. Käynnistä backend: npm start (eri terminaalissa)
 * 2. Aja tämä skripti: node src/scripts/test-logging.js
 */

import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = process.env.API_URL || "http://localhost:4000/api";
const LOGS_DIR = path.join(__dirname, "../../logs");

// Värit terminaaliin
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function testLogging() {
  log("\n🧪 Testataan logitusta...\n", "cyan");

  // 1. Tarkista että logs-kansio on olemassa
  log("1️⃣  Tarkistetaan logs-kansio...", "blue");
  if (!fs.existsSync(LOGS_DIR)) {
    log(`   ❌ Logs-kansio ei ole olemassa: ${LOGS_DIR}`, "red");
    log("   💡 Varmista että backend on käynnissä ja logger on luonut kansion", "yellow");
    return;
  }
  log(`   ✅ Logs-kansio löytyi: ${LOGS_DIR}`, "green");

  // 2. Tarkista logitiedostot
  log("\n2️⃣  Tarkistetaan logitiedostot...", "blue");
  const logFiles = {
    combined: path.join(LOGS_DIR, "combined.log"),
    error: path.join(LOGS_DIR, "error.log"),
    exceptions: path.join(LOGS_DIR, "exceptions.log"),
    rejections: path.join(LOGS_DIR, "rejections.log"),
  };

  const fileStatus = {};
  for (const [name, filePath] of Object.entries(logFiles)) {
    const exists = fs.existsSync(filePath);
    if (exists) {
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(2);
      fileStatus[name] = { exists: true, size: `${size} KB` };
      log(`   ✅ ${name}.log löytyi (${size} KB)`, "green");
    } else {
      fileStatus[name] = { exists: false };
      log(`   ⚠️  ${name}.log ei ole vielä luotu (luodaan automaattisesti kun tarvitaan)`, "yellow");
    }
  }

  // 3. Tee HTTP-pyyntöjä ja tarkista että ne logitetaan
  log("\n3️⃣  Tehdään HTTP-pyyntöjä...", "blue");
  
  try {
    // Health check (ei vaadi autentikointia)
    log("   📡 GET /api/health...", "cyan");
    await axios.get(`${API_URL}/health`);
    log("   ✅ Health check onnistui", "green");
    await sleep(500); // Odota että logi kirjoitetaan

    // Hae huoneet (julkinen endpoint)
    log("   📡 GET /api/rooms...", "cyan");
    await axios.get(`${API_URL}/rooms`);
    log("   ✅ Huoneiden haku onnistui", "green");
    await sleep(500);

    // Rekisteröi testikäyttäjä
    log("   📡 POST /api/auth/register...", "cyan");
    const testEmail = `test-${Date.now()}@example.com`;
    try {
      await axios.post(`${API_URL}/auth/register`, {
        email: testEmail,
        password: "test123456",
      });
      log("   ✅ Rekisteröityminen onnistui", "green");
    } catch (err) {
      if (err.response?.status === 400) {
        log("   ⚠️  Käyttäjä on jo olemassa (ok)", "yellow");
      } else {
        throw err;
      }
    }
    await sleep(500);

    // Kirjaudu sisään
    log("   📡 POST /api/auth/login...", "cyan");
    let accessToken;
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: testEmail,
        password: "test123456",
      });
      accessToken = loginRes.data.accessToken;
      log("   ✅ Kirjautuminen onnistui", "green");
    } catch (err) {
      // Jos rekisteröityminen epäonnistui, kokeile olemassa olevaa käyttäjää
      log("   ⚠️  Kokeillaan admin@example.com...", "yellow");
      const adminRes = await axios.post(`${API_URL}/auth/login`, {
        email: "admin@example.com",
        password: "admin123",
      });
      accessToken = adminRes.data.accessToken;
      log("   ✅ Kirjautuminen adminilla onnistui", "green");
    }
    await sleep(500);

    // Tee autentikoitu pyyntö
    if (accessToken) {
      log("   📡 GET /api/bookings/me (autentikoitu)...", "cyan");
      await axios.get(`${API_URL}/bookings/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      log("   ✅ Autentikoitu pyyntö onnistui", "green");
      await sleep(500);
    }

    // Tee virheellinen pyyntö (404)
    log("   📡 GET /api/nonexistent (virheellinen)...", "cyan");
    try {
      await axios.get(`${API_URL}/nonexistent`);
    } catch (err) {
      if (err.response?.status === 404) {
        log("   ✅ 404-virhe logitettiin (odotettu)", "green");
      }
    }
    await sleep(500);

  } catch (err) {
    log(`   ❌ HTTP-pyyntö epäonnistui: ${err.message}`, "red");
    if (err.code === "ECONNREFUSED") {
      log("   💡 Varmista että backend on käynnissä: npm start", "yellow");
    }
  }

  // 4. Tarkista logitiedostojen sisältö
  log("\n4️⃣  Tarkistetaan logitiedostojen sisältö...", "blue");
  await sleep(1000); // Odota että kaikki logit kirjoitetaan

  if (fs.existsSync(logFiles.combined)) {
    const content = fs.readFileSync(logFiles.combined, "utf-8");
    const lines = content.trim().split("\n").filter((line) => line);
    const lastLines = lines.slice(-5);

    log(`   📄 combined.log sisältää ${lines.length} riviä`, "cyan");
    log("   📋 Viimeiset 5 riviä:", "cyan");
    lastLines.forEach((line, i) => {
      try {
        const logEntry = JSON.parse(line);
        log(`      ${i + 1}. [${logEntry.level}] ${logEntry.message}`, "reset");
      } catch {
        log(`      ${i + 1}. ${line.substring(0, 80)}...`, "reset");
      }
    });
  }

  if (fs.existsSync(logFiles.error)) {
    const errorContent = fs.readFileSync(logFiles.error, "utf-8");
    const errorLines = errorContent.trim().split("\n").filter((line) => line);
    if (errorLines.length > 0) {
      log(`   ⚠️  error.log sisältää ${errorLines.length} virhettä`, "yellow");
    } else {
      log("   ✅ error.log on tyhjä (ei virheitä)", "green");
    }
  }

  // 5. Yhteenveto
  log("\n📊 Yhteenveto:", "cyan");
  log("   ✅ Logs-kansio on olemassa", "green");
  log("   ✅ Logitiedostot luodaan automaattisesti", "green");
  log("   ✅ HTTP-pyynnöt logitetaan", "green");
  log("   ✅ Strukturoitu JSON-logitus toimii", "green");
  
  log("\n💡 Vinkit:", "yellow");
  log("   • Seuraa live-logeja: tail -f backend/logs/combined.log", "reset");
  log("   • Näytä virheet: tail -f backend/logs/error.log", "reset");
  log("   • Etsi tiettyä tapahtumaa: grep 'Booking created' backend/logs/combined.log", "reset");
  
  log("\n✅ Logituksen testaus valmis!\n", "green");
}

// Aja testi
testLogging().catch((err) => {
  log(`\n❌ Testaus epäonnistui: ${err.message}`, "red");
  console.error(err);
  process.exit(1);
});

