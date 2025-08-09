async function loadJSON(url) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load ${url}:`, error);
    return null;
  }
}

async function loadHTML(url) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    console.warn(`Failed to load ${url}:`, error);
    return null;
  }
}

async function loadPartials() {
  const includeNodes = Array.from(document.querySelectorAll('[data-include]'));
  await Promise.all(
    includeNodes.map(async (node) => {
      const url = node.getAttribute('data-include');
      if (!url) return;
      const html = await loadHTML(url);
      if (html) node.innerHTML = html;
    })
  );
}

function applyConfig(config) {
  if (!config) return;

  // Text content replacements
  document.querySelectorAll('[data-config]').forEach((el) => {
    const key = el.getAttribute('data-config');
    if (!key) return;
    const value = config[key];
    if (value != null) el.textContent = String(value);
  });

  // Href replacements, supports "mailto:key" or direct key
  document.querySelectorAll('[data-config-href]').forEach((el) => {
    const expr = el.getAttribute('data-config-href');
    if (!expr) return;
    let hrefValue = '#';
    if (expr.includes(':')) {
      const [scheme, key] = expr.split(':');
      const v = config[key];
      if (v) hrefValue = `${scheme}:${v}`;
    } else {
      const v = config[expr];
      if (v) hrefValue = v;
    }
    el.setAttribute('href', hrefValue);
    if (/^https?:/i.test(hrefValue)) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });
}

function enhanceFooter() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const updated = document.getElementById('last-updated');
  if (updated) {
    const d = new Date(document.lastModified);
    updated.textContent = isNaN(d.getTime()) ? '' : d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
}

function enhanceNavA11y() {
  const toggle = document.getElementById('nav-toggle');
  const label = document.querySelector('label.nav__hamburger');
  const menu = document.getElementById('nav-menu');
  if (toggle && label && menu) {
    function syncAria() {
      const expanded = toggle.checked ? 'true' : 'false';
      label.setAttribute('aria-expanded', expanded);
      menu.setAttribute('data-open', expanded);
    }
    toggle.addEventListener('change', syncAria);
    label.addEventListener('click', () => setTimeout(syncAria, 0));
    syncAria();
  }
}

(async function init() {
  // Load partials first so config can apply to included nodes as well
  await loadPartials();
  const config = await loadJSON('site.config.json');
  applyConfig(config || {});
  enhanceFooter();
  enhanceNavA11y();
})();


