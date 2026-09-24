import { Routes } from '@angular/router';
import { Login } from './features/public/auth/login/login';
import { Home } from './features/public/home/home';
import { ForgotPassword } from './features/public/auth/forgot-password/forgot-password';
import { DashboardSuperadmin } from './features/dashboard/dashboard-superadmin/dashboard-superadmin';
import { DashboardAdmin } from './features/dashboard/dashboard-admin/dashboard-admin';
import { InformationAdmin } from './features/profile/pages/information-admin/information-admin';
import { Students } from './features/admin/users/pages/students/students';
import { Guardians } from './features/admin/users/pages/guardians/guardians';
import { Drivers } from './features/admin/users/pages/drivers/drivers';
import { Families } from './features/admin/users/pages/families/families';
import { Buses } from './features/admin/routes-buses/pages/buses/buses';
import { Stops } from './features/admin/routes-buses/pages/stops/stops';
import { RoutesPage } from './features/admin/routes-buses/pages/routes/routes';
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
  { path: 'admin/users', component: Students },
  { path: 'admin/guardians', component: Guardians },
  { path: 'admin/drivers', component: Drivers },
  { path: 'admin/families', component: Families },
  { path: 'admin/buses', component: Buses },
  { path: 'admin/stops', component: Stops },
  { path: 'admin/routes', component: RoutesPage },

  /* INFORMATION */
  { path: 'admin/profile', component: InformationAdmin },

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