# Guardian Escolar

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

Public password recovery (`/api/v1/password/forgot`, `/forgot/verify` and `/reset`)
bypasses automatic Bearer injection and token refresh in the HTTP interceptor.
Login and refresh retain credentialed cookie requests; protected profile changes
and dashboard APIs retain their authenticated retry behavior. When using Kong,
set `API_URL` and `API_FORGOT_INFORMATION_URL` to its HTTPS origin without API path
prefixes, then rebuild the Vercel deployment. Browser preflights are handled by
Kong's shared CORS policy.

The administrator dashboard loads persisted alerts from the notification API in
a searchable card, with filters containing only types already used by persisted
alerts in the authorized school and ten alerts per
page (newest first). It resolves the school from the current IAM profile, not a
stale session value. Loading, empty, missing-school and API-error states are
visible and failures can be retried. Deploy the notification API alongside this
frontend: it enforces the active administrator-school assignment before counting
or paginating and exposes `/notification/api/v1/notifications/alert-types`.
Card controls, status messages and catalog type labels (both filter options and
alert badges) support Spanish, English, French and Portuguese. New catalog names
without a translation retain their database label. Free-text alert descriptions,
student names and route names are displayed as recorded, not machine-translated.

The administrator's three metric cards show registered students, active routes,
and the all-time school alert total. Student and route lists are scoped by the
authenticated administrator's school on their APIs; the route list excludes
inactive routes. Alerts use the unfiltered `totalElements` for the current school,
independently of table search, type filters, and pagination. "Refresh metrics"
reloads all three counts. Failed counts show an unavailable value instead of zero,
with a visible error; successful empty responses show zero. No counts are requested
without an assigned school.

The superadministrator dashboard contains only two live totals: registered
schools and administrators, loaded from their existing list APIs. Each count has
an independent loading/error state and an error-only retry action; failed
requests do not appear as zero. The former comments metric, empty alerts panel,
and placeholder monthly/operating captions have been removed. The unused issue
reporting modal and its administrator-dashboard trigger are retired, including
their component files and translations in all four languages. The administrator's
persisted school alerts remain available.

Administrator management cards and delete confirmations display names and surnames
together; editing keeps both fields separate. Deletion calls
`DELETE /user/api/v1/admins/{personId}` and requires the superadministrator role.
The backend performs a logical deletion of the person and deactivates associated
IAM profiles; failed requests remain visible inside the confirmation dialog.

The signed-in profile page first fetches `/api/v1/auth/profile`, then uses its
`personId` to load personal details from `/user/api/admins/{personId}`.
City and school come from IAM; contact details come from user management.
Loading failures are visible and can be retried. User management must run an
image that maps SQL `BIGINT` phone numbers to .NET `long`.

Student, parent and driver registration automatically selects the school's campus
and hides the campus selector when only one campus is available (including schools
with only their central campus). The campus ID is still submitted and restored
after resetting the form. Schools with multiple campuses require a selection;
missing campuses or loading errors remain visible. Bus registration is unchanged.

The management navbar arrow opens the signed-in role's dashboard (admin or
superadmin), regardless of browser history. Stop forms load city options from
`/route/api/cities`; a failure in another catalog no longer discards the cities
and is reported on the page.

Family editing keeps all existing children and allows selecting additional
children without duplicates or removing individual children. Saving requires a
guardian and at least one child; API errors appear inside the editing modal.

School editing for admin and superadmin includes an "Eliminar sede" action below
each campus address and its optional map. Removal takes effect only when saving;
cancelling leaves the school unchanged. Saved campus IDs are sent through
`removedCampusIds` to deactivate them atomically without deleting related data.
Removing a new, unsaved campus does not send a deactivation request.
Campus removal buttons use a red background and white text. The registration
form uses a gray, labeled add-campus button; both school update modals use white
add-campus buttons. Registration removal appears below the address and optional
map, rather than beside the campus name.

All management record lists show 10 records per page, with synchronized page
numbers and navigation above and below the records. The header retains the
unfiltered total from the latest full load; search results are paginated and
searching resets to page one. Deleting records clamps the current page.
Registration cards keep their natural height independently of the list so the
submit button stays next to the form fields instead of stretching to the footer.
Registration and list cards share the same responsive width (up to 640px)
and align at the top while their heights follow their respective contents.

## Responsive web layouts

At widths up to 1024px, the management toolbar opens a keyboard-accessible
navigation drawer using the existing administrator or superadministrator menus.
It traps focus, restores it on close, and closes on Escape, backdrop click,
menu selection, successful navigation or a resize back to desktop. Desktop
sidebars remain visible. Themed profile-change forms offer the same role menu;
login and public password recovery do not expose management links.
The public menu uses the same drawer; its contact action navigates correctly and
home-section links support routed anchors.

Shared viewport rules in [src/responsive.css](src/responsive.css) cover dashboards,
all management cards, profiles, login and recovery/change steps, six-digit codes,
contact forms, landing sections and modal dialogs. Forms and record actions stack
on small screens; long values wrap, dialogs scroll within the viewport, and touch
controls remain reachable. The existing themes, translations, role guards and
ten-record pagination are preserved. Check at 320, 375, 425, 768, 1024 and 1440px
when changing shared layouts.

The standard `npm run build` uses the existing SPA configuration. The separate
`production` configuration currently exceeds pre-existing bundle/component
budgets (the landing component alone is 13.6kB against an 8kB limit). These
limits are not raised or disabled by the responsive changes. There is currently
no lint script or configured Angular lint target; the legacy `.eslintrc` is not
compatible with the installed ESLint 10, which requires a flat configuration.

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
