import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { routes as forgotPasswordRoutes } from './features/public/auth/forgot-password/forgot-password.routes'

export const routes: Routes = [
    { path: "", component: Home},
    { path: "auth/login", component: Login},
    { path: "auth/forgot-password", component: ForgotPassword, children: forgotPasswordRoutes}
];
