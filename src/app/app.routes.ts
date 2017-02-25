import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {BaseComponent} from "./components/base.component";
// pages
import {LoginComponent} from "./components/page/login.component";
import {UserComponent} from "./components/page/user.component";
import {CustomerComponent} from "./components/page/customer.component";
import {AttendanceComponent} from "./components/page/attendance.component";

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [

      // add attendance routes
      {
        path: 'attendances',
        component: AttendanceComponent
      },

      // add user routes
      {
        path: 'users',
        component: UserComponent
      },

      // add customer routes
      {
        path: 'customers',
        component: CustomerComponent
      },
    ]
  },

  // Add login route
  {
    path: 'login',
    component: LoginComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
