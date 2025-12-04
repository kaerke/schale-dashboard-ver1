const isBrowser = typeof window !== 'undefined';

export const readLocalStorage = (key: string): string | null => {
  if (!isBrowser) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.warn(`Unable to read ${key} from localStorage`, error);
    return null;
  }
};

export const writeLocalStorage = (key: string, value: string): boolean => {
  if (!isBrowser) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Unable to persist ${key} to localStorage`, error);
    return false;
  }
};

export const removeLocalStorage = (key: string): boolean => {
  if (!isBrowser) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Unable to remove ${key} from localStorage`, error);
    return false;
  }
};
