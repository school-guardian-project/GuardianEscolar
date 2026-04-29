import { Routes } from "@angular/router";
import { Telephone } from "./steps/telephone/telephone";
import { CodeFirst } from "./steps/code-first/code-first";
import { CodeSecond } from "./steps/code-second/code-second";
import { ChangeContact } from "./change-contact";
import { Reset } from "./steps/reset/reset";

export const routes: Routes = [
    { path: "telephone", component: Telephone },
    { path: "code-first", component: CodeFirst },
    { path: "reset", component: Reset },
    { path: "code-second", component: CodeSecond },
    { path: "", redirectTo: "telephone", pathMatch: "full" }
]