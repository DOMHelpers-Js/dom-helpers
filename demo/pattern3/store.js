// Classic script — no import/export syntax
// Exposes createStore on window so other scripts can use it
window.createStore = function() {
  return ReactiveUtils.store(
    {
      count: 0,
      user: null
    },
    {
      actions: {
        increment(state)      { state.count++; },
        decrement(state)      { state.count--; },
        reset(state)          { state.count = 0; },
        login(state, name)    { state.user = name; },
        logout(state)         { state.user = null; }
      }
    }
  );
};
