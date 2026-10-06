import { Routes } from "@angular/router";
import { CurrentPassword } from "./steps/current-password/current-password";
import { Reset } from "./steps/reset/reset";
import { ChangePassword } from "./change-password";

export const routes: Routes = [
    // El contrato real (POST /api/v1/auth/change-password) solo pide la
    // contraseña actual + la nueva: no hay paso de código de verificación.
    { path: "current-password", component: CurrentPassword },
    { path: "reset", component: Reset },
    { path: "", redirectTo: "current-password", pathMatch: "full" }
]