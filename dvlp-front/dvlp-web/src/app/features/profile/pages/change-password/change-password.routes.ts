import { Routes } from "@angular/router";
import { Email } from "./steps/email/email";
import { Reset } from "./steps/reset/reset";
import { Code } from "./steps/code/code";
import { ChangePassword } from "./change-password";

export const routes: Routes = [
    { path: "email", component: Email },
    { path: "code", component: Code },
    { path: "reset", component: Reset },
    { path: "", redirectTo: "email", pathMatch: "full" }
]