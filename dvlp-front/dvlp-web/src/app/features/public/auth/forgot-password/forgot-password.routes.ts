import { Routes } from "@angular/router";
import { Email } from "../../auth/forgot-password/steps/email/email";
import { Code } from "../../auth/forgot-password/steps/code/code";
import { Reset } from "../../auth/forgot-password/steps/reset/reset";

export const routes: Routes = [
    {path: "email", component: Email},
    {path: "code", component: Code},
    {path: "reset", component: Reset},
    {path: "", redirectTo: "email", pathMatch: "full"}
]