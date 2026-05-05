import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { DashboardSuperadmin } from './features/dashboard/dashboard-superadmin/dashboard-superadmin';
import { DashboardAdmin } from './features/dashboard/dashboard-admin/dashboard-admin';
import { InformationAdmin } from './features/profile/pages/information-admin/information-admin';
import { Estudiantes } from './features/admin/users/pages/estudiantes/estudiantes';
import { Padres } from './features/admin/users/pages/padres/padres';
import { Conductores } from './features/admin/users/pages/conductores/conductores';
import { Familia } from './features/admin/users/pages/familias/familia';
import { Buses } from './features/admin/routes-buses/pages/buses/buses';
import { Paradas } from './features/admin/routes-buses/pages/paradas/paradas';
import { Rutas } from './features/admin/routes-buses/pages/rutas/rutas';
import { routes as forgotPasswordRoutes } from './features/public/auth/forgot-password/forgot-password.routes';
import { ChangeEmail } from './features/profile/pages/change-email/change-email';
import { routes as changeEmailRoutes } from './features/profile/pages/change-email/change-email.routes';
import { Admins } from './features/superadmin/admins/pages/admins/admins';
import { Schools } from './features/superadmin/schools/pages/schools/schools';
import { ChangePassword } from './features/profile/pages/change-password/change-password';
import { routes as changePasswordRoutes } from './features/profile/pages/change-password/change-password.routes';
import {routes as changeContactRoutes } from './features/profile/pages/change-contact/change-contact.routes'
import { ChangeContact } from './features/profile/pages/change-contact/change-contact';
import { Contact } from './features/public/contact/contact';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },

  {
    path: 'auth',
    children: [
      { path: 'login', component: Login },
      { path: 'forgot-password', component: ForgotPassword, children: forgotPasswordRoutes }
    ]
  },

  { path: 'dashboard-admin', component: DashboardAdmin },
  { path: 'dashboard-superadmin', component: DashboardSuperadmin },

  /* ADMIN */
  { path: 'admin/usuarios', component: Estudiantes },
  { path: 'admin/padres', component: Padres },
  { path: 'admin/conductores', component: Conductores },
  { path: 'admin/familias', component: Familia },
  { path: 'admin/buses', component: Buses },
  { path: 'admin/paradas', component: Paradas },
  { path: 'admin/rutas', component: Rutas },

  /* INFORMATION */
  { path: 'admin/informacion', component: InformationAdmin },

  /* PROFILE CHANGES */
  { path: 'admin/change-email', component: ChangeEmail, children: changeEmailRoutes },
  { path: 'admin/change-password', component: ChangePassword, children: changePasswordRoutes },
  { path: 'admin/change-contact', component: ChangeContact, children: changeContactRoutes },
  /* SUPERADMIN */
  { path: 'superadmin/admins', component: Admins },
  { path: 'superadmin/schools', component: Schools },

  { path: 'contact', component: Contact},

  /* fallback */
  { path: '**', redirectTo: 'home' }
];