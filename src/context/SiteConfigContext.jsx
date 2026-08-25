import { createContext, useState, useEffect, useContext } from 'react';
import initialConfig from '../data/siteConfig.json';

export const SiteConfigContext = createContext();

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('xm_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure default fallback structure
        return {
          ...initialConfig,
          ...parsed,
          storeInfo: { ...initialConfig.storeInfo, ...(parsed.storeInfo || {}) },
          themeColors: { ...initialConfig.themeColors, ...(parsed.themeColors || {}) },
          pixSettings: { ...initialConfig.pixSettings, ...(parsed.pixSettings || {}) }
        };
      } catch (e) {
        console.error('Erro ao ler configuracoes do site', e);
      }
    }
    return initialConfig;
  });

  // Inject CSS custom variables dynamically on root element for real-time color theme updates
  useEffect(() => {
    if (config.themeColors) {
      document.documentElement.style.setProperty('--color-brand-primary', config.themeColors.primary || '#ff5500');
      document.documentElement.style.setProperty('--color-brand-secondary', config.themeColors.secondary || '#3b4268');
    }
    localStorage.setItem('xm_site_config', JSON.stringify(config));
  }, [config]);

  // Update entire config or sections
  const updateConfig = (newConfig) => {
    setConfig(newConfig);
  };

  const updateStoreInfo = (newStoreInfo) => {
    setConfig((prev) => ({
      ...prev,
      storeInfo: { ...prev.storeInfo, ...newStoreInfo }
    }));
  };

  const updateThemeColors = (newColors) => {
    setConfig((prev) => ({
      ...prev,
      themeColors: { ...prev.themeColors, ...newColors }
    }));
  };

  const updatePixSettings = (newPixSettings) => {
    setConfig((prev) => ({
      ...prev,
      pixSettings: { ...prev.pixSettings, ...newPixSettings }
    }));
  };

  const updateBannerSlides = (newSlides) => {
    setConfig((prev) => ({
      ...prev,
      bannerSlides: newSlides
    }));
  };

  const updateFeaturedCategories = (newCategories) => {
    setConfig((prev) => ({
      ...prev,
      featuredCategories: newCategories
    }));
  };

  const updateHomeSections = (newSections) => {
    setConfig((prev) => ({
      ...prev,
      homeSections: newSections
    }));
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    localStorage.setItem('xm_site_config', JSON.stringify(initialConfig));
  };

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateStoreInfo,
        updateThemeColors,
        updatePixSettings,
        updateBannerSlides,
        updateFeaturedCategories,
        updateHomeSections,
        resetConfig
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig deve ser usado dentro de um SiteConfigProvider');
  }
  return context;
}
