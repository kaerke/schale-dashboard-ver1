
import React, { useEffect, useState, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, MapPin, RefreshCw } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { fetchWeather } from '@/services/weatherService';
import { WeatherData } from '@/types';
import { WEATHER_CODES } from '@/constants';

// Default coordinates for "Schale Office" (Tokyo) to ensure real weather data even if Geo fails
const DEFAULT_COORDS = { lat: 35.6895, lon: 139.6917 };

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("Locating...");
  const [loading, setLoading] = useState(true);

  const updateWeather = async (lat: number, lon: number, name: string) => {
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setLocationName(name);
    } catch (e) {
       // Fallback is handled in service, but we can set defaults if needed
       console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = useCallback(() => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateWeather(latitude, longitude, "Local District"); 
        },
        (err) => {
          console.warn("Geolocation permission denied or error", err);
          // Fallback to Schale Office (Tokyo) real weather instead of static dummy data
          updateWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, "Schale Office");
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
       // Browser doesn't support Geo
       updateWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, "Schale Office");
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-orange-400 animate-spin-slow" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-ba-blue animate-rain" />;
    if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-cyan-200 animate-wiggle" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-purple-500 animate-pulse" />;
    return <Cloud className="w-8 h-8 text-gray-400 animate-pulse-slow" />;
  };

  const getWeatherDescription = (code: number) => {
    return WEATHER_CODES[code] || 'Unknown';
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col items-end group select-none transition-transform duration-300 hover:scale-[1.02]">
        <div className="bg-ba-blue text-white text-xs font-bold px-2 py-0.5 rounded-t-md mr-1 transform skew-x-[-10deg] inline-block shadow-md">
          <span className="block transform skew-x-[10deg]">ATMOSPHERE</span>
        </div>
        <GlassCard className="px-5 py-3 min-w-[12.5rem] flex items-center gap-4 relative border-r-4 border-r-ba-blue !bg-white/40 !hover:bg-white/60 backdrop-blur-md transition-all duration-300">
          {/* Halo Ring Decoration */}
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full border-2 border-ba-cyan/20 pointer-events-none animate-float" style={{ animationDelay: '0.5s' }}></div>
          
          {loading ? (
              <div className="w-full flex items-center justify-center py-2 gap-2 text-ba-gray">
                  <RefreshCw className="animate-spin w-5 h-5" />
                  <span className="text-xs font-mono">SYNCING...</span>
              </div>
          ) : (
              <>
                  {/* Animated Icon Container */}
                  <div className="flex items-center justify-center bg-white/30 rounded-full p-2 shadow-sm animate-float">
                  {weather ? getWeatherIcon(weather.weatherCode) : <Sun className="w-8 h-8 text-orange-400 animate-spin-slow" />}
                  </div>
                  
                  <div className="flex flex-col text-right">
                      <div className="flex items-center justify-end gap-2 text-ba-gray text-xs font-bold uppercase tracking-wider">
                          {/* Refresh Button */}
                          <button 
                             onClick={(e) => { e.stopPropagation(); getLocation(); }}
                             className="hover:text-ba-blue transition-colors p-0.5 rounded hover:bg-white/20"
                             title="Retry Location"
                          >
                              <RefreshCw className="w-3 h-3" />
                          </button>
                          
                          <div className="flex items-center gap-1">
                             <MapPin className="w-3 h-3" /> {locationName}
                          </div>
                      </div>
                      <div className="text-3xl font-black text-ba-dark">
                          {weather?.temperature}°C
                      </div>
                      <div className="text-xs font-medium text-ba-blue">
                          {weather ? getWeatherDescription(weather.weatherCode) : 'Clear'}
                      </div>
                  </div>
              </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};
