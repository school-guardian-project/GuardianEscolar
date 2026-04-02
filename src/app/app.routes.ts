import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { DashboardSuperadmin } from './features/dashboard/dashboard-superadmin/dashboard-superadmin';
import { DashboardAdmin } from './features/dashboard/dashboard-admin/dashboard-admin';
import { Estudiantes } from './features/admin/users/pages/estudiantes/estudiantes';
import { routes as forgotPasswordRoutes } from './features/public/auth/forgot-password/forgot-password.routes';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'forgot-password', component: ForgotPassword, children: forgotPasswordRoutes }
    ]
  },

  { path: 'dashboard-admin', component: DashboardAdmin },
  { path: 'admin/usuarios', component: Estudiantes }, 

  {
    path: 'dashboard-superadmin',
    component: DashboardSuperadmin
  },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];