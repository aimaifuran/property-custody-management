# TODO - Property Custody System Improvements

## 1) Admin login allowed on other devices
- [ ] Inspect auth/session implementation (server/middleware/auth.js, server auth routes, backend login/logout)
- [ ] Remove/relax any single-device/session restriction for admin
- [ ] Ensure logout only clears current session
- [ ] Validate admin can login from 2 browsers concurrently

## 2) Theme update to Elegant Burgundy & Beige Gradient
- [ ] Update CSS variables in css/style.css (#59171b, #fed7b8)
- [ ] Adjust gradients (page, sidebar, buttons)
- [ ] Ensure text contrast/readability
- [ ] Verify all pages use updated theme

## 3) Three-dots dropdown CRUD actions
- [ ] Locate kebab/three-dots implementation (likely js/formPages.js and/or specific form pages)
- [ ] Implement working dropdown toggle
- [ ] Add/wire actions: Download PDF, Print, View, Edit, Delete
- [ ] Validate actions work for dynamically generated rows/forms

## 4) Consistent small-square icon size on buttons
- [ ] Standardize icon pseudo-element sizing for all buttons in css/style.css
- [ ] Ensure kebab + CRUD buttons also match
- [ ] Visual check across all forms

