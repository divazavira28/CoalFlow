// ======================================================
// 🔑 API KEY & URL OPENWEATHER
// ======================================================
export const OPENWEATHER_API_KEY = "24c92b4b4e74700cae1fb30ef82af1fa";
export const OPENWEATHER_WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";
export const OPENWEATHER_FORECAST_URL =
  "https://api.openweathermap.org/data/2.5/forecast";


// ======================================================
// 1️⃣ AUTO-DETECT USER LOCATION (GPS)
// ======================================================
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.log("GPS error:", err);
        reject("Gagal mendapatkan lokasi user.");
      }
    );
  });
}


// ======================================================
// 2️⃣ CUACA SAAT INI
// ======================================================
export async function getWeather(lat, lon) {
  const url = `${OPENWEATHER_WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.log("Weather error:", data);
    throw new Error("Failed to fetch weather");
  }

  return {
    temp: data.main?.temp,
    humidity: data.main?.humidity,
    rain_1h: data.rain?.["1h"] || 0,
    rain_3h: data.rain?.["3h"] || 0,
    wind: data.wind?.speed,
    condition: data.weather?.[0]?.main || "Unknown",
  };
}


// ======================================================
// 3️⃣ FORECAST 3 JAM KE DEPAN
// ======================================================
export async function getRainForecast(lat, lon) {
  const url = `${OPENWEATHER_FORECAST_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    console.log("Forecast error:", data);
    throw new Error("Failed to fetch forecast");
  }

  const list = data.list || [];

  return list.slice(0, 4).map((item) => ({
    time: item.dt_txt,
    rain_mm: item.rain?.["3h"] || 0,
  }));
}


// ======================================================
// 4️⃣ HITUNG RISIKO PRODUKSI BERDASARKAN HUJAN
// ======================================================
export function computeRisk(forecast) {
  if (!forecast || forecast.length === 0) return "Unknown";

  const maxRain = Math.max(...forecast.map((f) => f.rain_mm));

  if (maxRain >= 8) return "Very High";
  if (maxRain >= 5) return "High";
  if (maxRain >= 2) return "Medium";
  return "Low";
}


// ======================================================
// 5️⃣ FUNGSI UTAMA — LANGSUNG AMBIL:
//    - lokasi user
//    - cuaca saat ini
//    - forecast 3 jam
//    - tingkat risiko
// ======================================================
export async function getFullWeatherPack() {
  try {
    // 1. Lokasi user
    const { lat, lon } = await getUserLocation();

    // 2. Current weather
    const current = await getWeather(lat, lon);

    // 3. Forecast 3 jam × 4 (12 jam ke depan)
    const forecast = await getRainForecast(lat, lon);

    // 4. Risiko produksi berdasarkan hujan
    const risk = computeRisk(forecast);

    return {
      lat,
      lon,
      current,
      forecast,
      risk,
    };

  } catch (err) {
    console.log("Weather pack error:", err);
    throw err;
  }
}
