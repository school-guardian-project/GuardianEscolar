import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { DashboardAdmin } from './features/dashboard-admin/dashboard-admin';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "login", component: Login },
    { path: "dashboard-admin", component: DashboardAdmin }
];