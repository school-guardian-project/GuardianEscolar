import { Routes } from "@angular/router";
import { Email } from "./steps/email/email";
import { CodeFirst } from "./steps/code-first/code-first";
import { CodeSecond } from "./steps/code-second/code-second";
import { Reset } from "./steps/reset/reset";

export const routes: Routes = [
    
    {path: "email", component: Email},
    {path: "code-first", component: CodeFirst},
    {path: "reset", component: Reset},
    {path: "code-second", component: CodeSecond},
    {path: "", redirectTo: "email", pathMatch: "full"}

]