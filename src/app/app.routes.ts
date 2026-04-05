import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { DashboardSuperadmin } from './features/dashboard/dashboard-superadmin/dashboard-superadmin';
import { DashboardAdmin } from './features/dashboard/dashboard-admin/dashboard-admin';
import { Estudiantes } from './features/admin/users/pages/estudiantes/estudiantes';
import { Padres } from './features/admin/users/pages/padres/padres';
import { Conductores } from './features/admin/users/pages/conductores/conductores';
import { Familia } from './features/admin/users/pages/familias/familia';
import { Buses } from './features/admin/routes-buses/pages/buses/buses';
import { Paradas } from './features/admin/routes-buses/pages/paradas/paradas';
import { Rutas } from './features/admin/routes-buses/pages/rutas/rutas';
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
  { path: 'admin/padres', component: Padres },
  { path: 'admin/conductores', component: Conductores },
  { path: 'admin/familias',    component: Familia },    
  { path: 'admin/buses',       component: Buses },
  { path: 'admin/paradas',     component: Paradas },
  { path: 'admin/rutas',       component: Rutas }, 


  {
    path: 'dashboard-superadmin',
    component: DashboardSuperadmin
  },
  { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];