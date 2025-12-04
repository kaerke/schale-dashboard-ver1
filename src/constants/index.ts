

export const DEFAULT_BACKGROUND_URL = "/wallpaper/bg1.jpeg";

export const DEFAULT_WALLPAPERS = [
  DEFAULT_BACKGROUND_URL,
  "/wallpaper/bg2.jpg",
  "/wallpaper/bg3.jpg"
];

export const WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast";

// Mapping WMO Weather interpretation codes (WW)
export const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Drizzle: Light',
  53: 'Drizzle: Moderate',
  55: 'Drizzle: Dense intensity',
  61: 'Rain: Slight',
  63: 'Rain: Moderate',
  65: 'Rain: Heavy',
  71: 'Snow: Slight',
  73: 'Snow: Moderate',
  75: 'Snow: Heavy',
  80: 'Rain showers: Slight',
  81: 'Rain showers: Moderate',
  82: 'Rain showers: Violent',
  95: 'Thunderstorm: Slight or moderate',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

// Keep structure for type safety, though we primarily use single track logic now
export const MOCK_TRACKS = [
  { title: "System BGM", artist: "Schale Database", duration: 0 },
];