(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  let manualTheme = window.portfolioTheme.readSaved();
  function setTheme(theme) {
    root.dataset.theme = theme;
    if (!toggle) return;
    const dark = theme === 'dark';
    toggle.querySelector('[data-theme-label]').textContent = dark ? 'Light' : 'Dark';
    toggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#101923' : '#f7f8fa');
  }
  setTheme(window.portfolioTheme.resolve());
  const updateSystemTheme = () => { if (!manualTheme) setTheme(window.portfolioTheme.resolve()); };
  for (const query of ['(prefers-color-scheme: light)', '(prefers-color-scheme: dark)']) {
    const media = window.matchMedia?.(query);
    if (media?.addEventListener) media.addEventListener('change', updateSystemTheme);
    else if (media?.addListener) media.addListener(updateSystemTheme);
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      manualTheme = theme;
      setTheme(theme);
      try { localStorage.setItem('portfolio-theme', theme); } catch {}
    });
  }
  const filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    const cards = [...document.querySelectorAll('.projectcard')];
    filters.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      cards.forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) count++;
      });
      document.querySelector('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
    });
  }
  const nav = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('section[id]')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      nav.forEach(link => {
        if (link.dataset.nav === visible.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-15% 0px -40% 0px', threshold: [0, .1, .3, .6] });
    sections.forEach(section => observer.observe(section));
  }
  const copy = document.querySelector('.copy-email');
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const status = document.querySelector('.copy-status');
      try { await navigator.clipboard.writeText('tiagoperrupato@gmail.com'); status.textContent = 'Email address copied.'; }
      catch { status.textContent = 'You can use the email link above.'; }
    });
  }
})();
