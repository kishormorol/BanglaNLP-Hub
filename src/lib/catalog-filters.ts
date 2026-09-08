export function initCatalogFilters(
  controls: Record<string, HTMLInputElement | HTMLSelectElement>,
  items: HTMLElement[],
  apply: () => void,
  reveal: (item: HTMLElement) => void,
) {
  const clear = document.getElementById('f-clear') as HTMLButtonElement;
  const entries = Object.entries(controls);

  function writeURL(push = false) {
    const url = new URL(location.href);
    for (const [key, control] of entries) {
      url.searchParams.delete(key);
      if (control.value) url.searchParams.set(key, control.value);
    }
    // A deliberate filtered view can hide the retained hash target on Back.
    const state = { ...history.state, catalogFiltersURL: url.href };
    if (push && url.href !== location.href) history.pushState(state, '', url);
    else history.replaceState(state, '', url);
  }

  function readURL() {
    const params = new URLSearchParams(location.search);
    for (const [key, control] of entries) {
      const value = params.get(key) ?? '';
      if (control instanceof HTMLSelectElement) {
        control.value = [...control.options].some((option) => option.value === value) ? value : '';
      } else {
        // The native input limit counts UTF-16 units; do not split a surrogate pair.
        control.value = value.slice(0, control.maxLength).replace(/[\uD800-\uDBFF]$/, '');
      }
    }
    apply();
  }

  function reset() {
    entries.forEach(([, control]) => { control.value = ''; });
    apply();
  }

  function revealHash() {
    const item = items.find((item) => encodeURIComponent(item.id) === location.hash.slice(1));
    if (!item) return;
    if (item.hidden) reset();
    writeURL();
    reveal(item);
  }

  for (const [, control] of entries) {
    control.addEventListener(control instanceof HTMLInputElement ? 'input' : 'change', () => {
      apply();
      writeURL(control instanceof HTMLSelectElement);
    });
  }
  clear.hidden = false;
  clear.addEventListener('click', () => {
    reset();
    writeURL(true);
  });

  let restoredURL = '';
  window.addEventListener('popstate', (event) => {
    restoredURL = location.href;
    readURL();
    if (event.state?.catalogFiltersURL !== location.href) revealHash();
    writeURL();
  });
  window.addEventListener('hashchange', (event) => {
    // Native traversal emits popstate before hashchange. Do not reveal twice,
    // or override restored filters. PR2's synthetic same-hash event has no newURL.
    const restored = event.newURL && event.newURL === restoredURL;
    restoredURL = '';
    if (!restored) revealHash();
  });

  readURL();
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  // A history return can reload the document when the back/forward cache is off.
  if (navigation?.type !== 'back_forward' || history.state?.catalogFiltersURL !== location.href) {
    revealHash();
  }
  writeURL();
}
