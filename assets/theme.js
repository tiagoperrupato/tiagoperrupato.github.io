// Resolve the theme before the stylesheet paints to avoid a light-theme flash.
(() => {
  function readSaved() {
    try {
      const value = localStorage.getItem('portfolio-theme');
      return value === 'light' || value === 'dark' ? value : null;
    } catch { return null; }
  }
  function resolve() {
    const saved = readSaved();
    if (saved) return saved;
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }
  window.portfolioTheme = { readSaved, resolve };
  document.documentElement.dataset.theme = resolve();
})();
