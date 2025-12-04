import { useCallback, useEffect, useState } from 'react';

const INTRO_DURATION_MS = 3000;
const UI_SHOW_DELAY_MS = 500;

export const useDashboardIntro = () => {
  const [uiVisible, setUiVisible] = useState(false);
  const [introActive, setIntroActive] = useState(true);

  useEffect(() => {
    let uiTimer: number | undefined;
    const introTimer = window.setTimeout(() => {
      setIntroActive(false);
      uiTimer = window.setTimeout(() => setUiVisible(true), UI_SHOW_DELAY_MS);
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(introTimer);
      if (uiTimer) {
        window.clearTimeout(uiTimer);
      }
    };
  }, []);

  const toggleUi = useCallback(() => {
    setUiVisible((prev) => !prev);
  }, []);

  const handleGlobalClick = useCallback(() => {
    setUiVisible(true);
  }, []);

  return {
    uiVisible,
    introActive,
    toggleUi,
    handleGlobalClick,
  };
};
