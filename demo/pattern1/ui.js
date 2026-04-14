// Handles all DOM updates and button wiring for the app.
// Receives the store as an argument — no direct dependency on globals here.

export function initUI(store) {

  // ReactiveUtils.effect() re-runs automatically whenever
  // store.count or store.user is read and later changes
  ReactiveUtils.effect(() => {
    document.getElementById('count').textContent = store.count;
    document.getElementById('user').textContent  = store.user ?? '—';
  });

  document.getElementById('btn-inc').onclick    = () => store.increment();
  document.getElementById('btn-dec').onclick    = () => store.decrement();
  document.getElementById('btn-reset').onclick  = () => store.reset();
  document.getElementById('btn-login').onclick  = () => store.login('Alice');
  document.getElementById('btn-logout').onclick = () => store.logout();

}
