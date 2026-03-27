import { Routes } from "@angular/router";
import { ForgotPassword } from "./forgot-password";
import { Email } from "./steps/email/email";
import { Code } from "./steps/code/code";
import { Reset } from "./steps/reset/reset";

export const routes: Routes = [
    {path: "", component: ForgotPassword, 
        children: [
            {path: "email", component: Email},
            {path: "code", component: Code},
            {path: "reset", component: Reset},
            {path: "", redirectTo: "email", pathMatch: "full"}
        ]
    }
]