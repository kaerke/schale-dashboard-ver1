import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_WALLPAPERS } from '@/constants';
import { readLocalStorage, removeLocalStorage, writeLocalStorage } from '@/utils/storage';

const STORAGE_KEY = 'schale_dashboard_bg';
const WALLPAPER_INTERVAL_MS = 10000;

export const useDashboardBackground = () => {
  const [customBg, setCustomBg] = useState<string | null>(null);
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedBg = readLocalStorage(STORAGE_KEY);
    if (savedBg) {
      setCustomBg(savedBg);
    }

    const preloadTarget = savedBg || DEFAULT_WALLPAPERS[0];
    const img = new Image();
    img.src = preloadTarget;
    img.onload = () => setLoaded(true);
  }, []);

  useEffect(() => {
    if (customBg) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setWallpaperIndex((prev) => (prev + 1) % DEFAULT_WALLPAPERS.length);
    }, WALLPAPER_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [customBg]);

  const handleBackgroundChange = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCustomBg(result);
      const saved = writeLocalStorage(STORAGE_KEY, result);
      if (!saved) {
        alert('Image is too large to save for next visit, but will persist for this session.');
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleResetBackground = useCallback(() => {
    setCustomBg(null);
    setWallpaperIndex(0);
    removeLocalStorage(STORAGE_KEY);
  }, []);

  return {
    customBg,
    wallpaperIndex,
    loaded,
    handleBackgroundChange,
    handleResetBackground,
  };
};
