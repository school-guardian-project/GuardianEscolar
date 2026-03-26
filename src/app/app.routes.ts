import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { DashboardSuperadmin } from './features/dashboard-superadmin/dashboard-superadmin';

export const routes: Routes = [
    { path: "", component: Home},
    { path: "login", component: Login},
    { path: "dashboard-superadmin", component: DashboardSuperadmin}
];
