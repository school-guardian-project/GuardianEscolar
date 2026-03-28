import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { DashboardSuperadmin } from './features/dashboard/dashboard-superadmin/dashboard-superadmin';
import { DashboardAdmin } from './features/dashboard/dashboard-admin/dashboard-admin';
import { routes as forgotPasswordRoutes } from './features/public/auth/forgot-password/forgot-password.routes'


export const routes: Routes = [
  { path: "", component: Home },
  { path: "auth/login", component: Login },
    { path: "auth/forgot-password", component: ForgotPassword, children: forgotPasswordRoutes },
    { path: "login", component: Login },
    { path: "dashboard-superadmin", component: DashboardSuperadmin },
    { path: "dashboard-admin", component: DashboardAdmin },

  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'forgot-password', component: ForgotPassword }
    ]
  },

  {
    path: 'dashboard',
    children: [
      { path: 'admin', component: DashboardAdmin },
      { path: 'super-admin', component: DashboardSuperadmin }
    ]
  },

  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];
