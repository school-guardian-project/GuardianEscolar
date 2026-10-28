# GuardianEscolar

## Mobile home navigation

The mobile login dismisses the keyboard after successful form validation and
before authentication starts, so the login keyboard is not carried into the
home-screen transition. Invalid credentials fields remain on the form.

The home route card and bottom navigation are anchored to the screen's bottom
edge independently of the floating action overlay. The navigation reserves the
device's bottom safe-area inset while retaining 72 points of tab content; route
loading does not change the dock anchor. Driver actions retain their separation
from the bottom dock. Other screens retain their existing bottom-bar spacing.

From `dvlp-front/dvlp-movil/guardian-escolar`, run `npm test` for component/hook
regressions, including login keyboard dismissal, all four home roles and bottom
insets of 0, 24 and 34 points. These tests do not measure native layout: verify
login with the keyboard open, device rotation, small screens and gesture/button
navigation on Android/iOS before declaring the visual issue resolved on-device.

## Student route assignment visibility

The home and live-tracking screens reload the student's assigned route whenever
navigation focuses them again, and discard responses from the previous focus.
This reflects assignments made while the user was on another screen without
requiring a new login. Routes still resolve through the session's IAM profile,
then its assigned route-stop link, then the route and assigned bus.

Regression checks cover switching focus while an old request is pending.
The mobile suite (113 tests) and Android Hermes export pass locally. Device
behavior and access to deployed services still require runtime verification.
