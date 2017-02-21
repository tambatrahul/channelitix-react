import {ModuleWithProviders}  from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {loginRoutes}    from './login/login.routes';

import {BaseComponent} from './shared/components/base.component';

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: []
  },

  // Add login route
  ...loginRoutes
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
