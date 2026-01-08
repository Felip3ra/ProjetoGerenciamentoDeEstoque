import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayout } from './layouts/main-layout/main-layout';
import { DashboardPage } from './pages/dashboard/dashboard';
import { ItemsPage } from './pages/items/items';
import { UsersPage } from './pages/users/users';
import { MovementsPage } from './pages/movements/movements';
import { ReportsPage } from './pages/reports/reports';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'items', component: ItemsPage },
      { path: 'users', component: UsersPage },
      { path: 'movements', component: MovementsPage },
      { path: 'reports', component: ReportsPage },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
