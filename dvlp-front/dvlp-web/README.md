# Guardian Escolar

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.2.

## Development server

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
