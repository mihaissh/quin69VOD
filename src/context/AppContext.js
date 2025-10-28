import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [cachedVods, setCachedVods] = useState({});
  const [userPreferences, setUserPreferences] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem("userPreferences");
    return saved ? JSON.parse(saved) : {
      theme: "dark",
      chatDelay: 0,
      autoplay: false,
    };
  });

  const updatePreferences = useCallback((newPrefs) => {
    setUserPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem("userPreferences", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const cacheVod = useCallback((vodId, vodData) => {
    setCachedVods((prev) => ({
      ...prev,
      [vodId]: {
        data: vodData,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const getCachedVod = useCallback((vodId) => {
    const cached = cachedVods[vodId];
    if (!cached) return null;
    
    // Cache for 5 minutes
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000;
    return isExpired ? null : cached.data;
  }, [cachedVods]);

  const value = useMemo(
    () => ({
      userPreferences,
      updatePreferences,
      cacheVod,
      getCachedVod,
    }),
    [userPreferences, updatePreferences, cacheVod, getCachedVod]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

