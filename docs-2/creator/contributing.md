[![Sponsor](https://img.shields.io/badge/Sponsor-💖-pink)](https://github.com/sponsors/giovanni1707)

[![Sponsor](https://img.shields.io/badge/Sponsor-PayPal-blue?logo=paypal)](https://paypal.me/GiovanniSylvain)

# Contributing Guidelines

Thank you for your interest in contributing to DOM Helpers! Every contribution — whether it's a bug report, a documentation fix, or a new feature — helps make the library better for everyone.

---

## Ways to Contribute

### Report a Bug

If you found something that isn't working as expected:

1. Check the [existing issues](https://github.com/giovanni1707/DOMHelpers-Core/issues) to see if it's already reported
2. If not, open a new issue with:
   - A clear title describing the problem
   - The module and method involved (e.g. `Elements.update()`)
   - A minimal code snippet that reproduces the bug
   - What you expected to happen vs. what actually happened
   - Your browser and environment

### Suggest a Feature

Have an idea that would make DOM Helpers more useful?

1. Open an issue with the label `enhancement`
2. Describe the use case — what problem does this solve?
3. Show what the API might look like with a code example

### Improve the Documentation

Documentation contributions are especially welcome. If a page is unclear, missing an example, or contains a typo:

1. Fork the repository
2. Edit the relevant `.md` file inside the `docs/` folder
3. Submit a pull request with a short description of what you changed and why

### Submit a Pull Request

For code changes:

1. Fork the repository and create a branch from `main`
2. Name your branch descriptively: `fix/collections-update-bug` or `feat/selector-waitfor`
3. Make your changes in the `src/` folder
4. Keep each pull request focused on a single change — avoid bundling unrelated fixes
5. Write a clear PR description explaining what changed and why
6. Submit the pull request against the `main` branch

---

## Code Style

- Use plain JavaScript — no TypeScript, no build-step dependencies
- Follow the IIFE module pattern used in existing files: `(function(global) { ... })(window)`
- Keep each module self-contained — avoid cross-module dependencies unless intentional
- Add JSDoc comments for any new public methods following the existing style
- Do not introduce external dependencies

---

## Commit Messages

Use short, descriptive commit messages in the imperative mood:

```
fix: resolve Collections.update null reference on empty selector
feat: add Router.enableScrollMemory to guards module
docs: clarify onCleanup usage in SPA Router page
```

---

## Questions

If you're unsure about anything before opening a PR, open an issue first and describe what you're planning. It's easier to align early than to review a large change that goes in the wrong direction.

---

Thank you for using DOM Helpers!
Your feedback and support help make this library better for everyone.
