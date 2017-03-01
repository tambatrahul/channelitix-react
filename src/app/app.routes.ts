import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {BaseComponent} from "./components/base.component";
// pages
import {LoginComponent} from "./components/page/login.component";
import {UserComponent} from "./components/page/user.component";
import {CustomerComponent} from "./components/page/customer.component";
import {AttendanceComponent} from "./components/page/attendance.component";
import {CreateUserComponent} from "./components/page/create_user.component";
import {VisitComponent} from "./components/page/visit.component";
import {UpdateUserComponent} from "./components/page/update_user.component";

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

      {
        path: 'visits',
        component: VisitComponent
      },

      // add user routes
      {
        path: 'users',
        children: [
          {
            path: '',
            component: UserComponent,
          },
          {
            path: 'create',
            component: CreateUserComponent
          },
          {
            path: 'update/:id',
            component: UpdateUserComponent
          },

        ]
      },

      // add customer routes
      {
        path: 'customers',
        component: CustomerComponent
      },

      // add visit routes
      {
        path: 'visits',
        component: VisitComponent
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
