import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {loginRoutes}    from './login/login.routes';

import {BaseComponent} from './shared/base/base.component';

// external routes
import {attendanceRoutes} from "./components/attendance/attendance.routes";

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      // add attendance routes
      {
        path: 'attendances',
        children: [
          ...attendanceRoutes
        ]
      },
    ]
  },

  // Add login route
  ...loginRoutes
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
