export interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: number;
}

export interface MusicTrack {
  title: string;
  artist: string;
  duration: number; // in seconds
}

export enum WidgetPosition {
  TOP_LEFT = 'top-left',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_RIGHT = 'bottom-right',
}