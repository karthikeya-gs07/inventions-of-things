// Registers the service worker (production builds only, so it never caches
// dev-server modules) and offers a reload when a new version is ready.
export function registerPWA() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
      const offer = (worker) => {
        if (!worker || !navigator.serviceWorker.controller) return; // first install: nothing to update
        showUpdateToast(() => worker.postMessage('skip-waiting'));
      };
      if (reg.waiting) offer(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const worker = reg.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') offer(worker);
        });
      });
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;
        reloading = true;
        window.location.reload();
      });
    } catch (err) {
      console.warn('Service worker registration failed', err);
    }
  });
}

function showUpdateToast(onAccept) {
  if (document.querySelector('.toast')) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span>A new version is ready.</span><button type="button">Reload</button>`;
  toast.querySelector('button').addEventListener('click', onAccept);
  document.getElementById('app').append(toast);
}
