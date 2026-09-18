# Fintech landing page

Responsive recreation of the supplied Nickel animation reference, deployed at https://fintech.alsuhaibi96.com.

## Run locally

```sh
python3 -m http.server 4173 --directory dist
```

The site is dependency-free HTML, CSS and JavaScript. `dist/` is the complete public website. The supplied reference footage was processed to remove baked-in interface elements, compressed, and paired with real responsive HTML controls.

## Configure links

Set `signup`, `contact`, and `login` in the `destinations` object at the top of `dist/app.js`. By default, the buttons open interactive demos: sample workspace onboarding, a mock booking flow, and a demo account. These use illustrative data only and do not create accounts or book meetings. No authentication, financial processing, or contact submission backend is implemented.

## Deployment

Nginx serves `/var/www/fintech/current`. Versioned releases live under `/var/www/fintech/releases/`. HTTPS is managed by the server's existing Certbot installation. See `deploy/nginx.conf` for the initial HTTP configuration; Certbot adds the certificate directives and HTTPS redirect on the server.

Upload `dist/` into a new timestamped release directory, switch the `current` symlink after validation, and retain earlier releases for rollback. Never deploy the repository or private files as the web root.

## Accessibility

Semantic HTML, keyboard-operable dropdowns, native modal focus management, mobile navigation, visible focus, a skip link, a hidden animation control, and reduced-motion support.

## Reference

Visual reference supplied by the project owner: “Hero for fintech landing — webdesign / 3D animation,” Alex Bender for Fancy. Branding and source artwork are retained to match that reference.
