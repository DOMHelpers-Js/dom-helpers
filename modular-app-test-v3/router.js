export function initRouter(store, Router) {
  Router.define([
    {
      path: '/',
      view: '#home',
      title: 'Home',
      onEnter(_params, _query, onCleanup) {
        const display = document.getElementById('count-display');
        if (display) display.textContent = store.count;

        const unwatch = store.$watch('count', (val) => {
          const el = document.getElementById('count-display');
          if (el) el.textContent = val;
        });

        const btnInc   = document.getElementById('btn-inc');
        const btnDec   = document.getElementById('btn-dec');
        const btnReset = document.getElementById('btn-reset');

        const onInc   = () => store.increment();
        const onDec   = () => store.decrement();
        const onReset = () => store.reset();

        btnInc?.addEventListener('click', onInc);
        btnDec?.addEventListener('click', onDec);
        btnReset?.addEventListener('click', onReset);

        onCleanup(() => {
          unwatch?.();
          btnInc?.removeEventListener('click', onInc);
          btnDec?.removeEventListener('click', onDec);
          btnReset?.removeEventListener('click', onReset);
        });
      }
    },
    {
      path: '/about',
      view: '#about',
      title: 'About',
      onEnter(_params, _query, onCleanup) {
        const statusEl  = document.getElementById('login-status');
        const userEl    = document.getElementById('login-user');
        const btnLogin  = document.getElementById('btn-login');
        const btnLogout = document.getElementById('btn-logout');

        function syncUI() {
          if (store.user) {
            statusEl.textContent    = 'Logged in';
            userEl.textContent      = store.user;
            btnLogin.style.display  = 'none';
            btnLogout.style.display = 'inline-block';
          } else {
            statusEl.textContent    = 'Logged out';
            userEl.textContent      = '—';
            btnLogin.style.display  = 'inline-block';
            btnLogout.style.display = 'none';
          }
        }

        syncUI();

        const unwatch  = store.$watch('user', syncUI);
        const onLogin  = () => store.login('Alice');
        const onLogout = () => store.logout();

        btnLogin?.addEventListener('click', onLogin);
        btnLogout?.addEventListener('click', onLogout);

        onCleanup(() => {
          unwatch?.();
          btnLogin?.removeEventListener('click', onLogin);
          btnLogout?.removeEventListener('click', onLogout);
        });
      }
    },
    {
      path: '*',
      view: '#404',
      title: '404',
      onEnter(_params, _query, onCleanup) {
        const btnHome = document.getElementById('btn-home');
        const onClick = () => Router.go('/');
        btnHome?.addEventListener('click', onClick);
        onCleanup(() => btnHome?.removeEventListener('click', onClick));
      }
    }
  ]);

  Router.mount('#app').start({ mode: 'hash' });
}
