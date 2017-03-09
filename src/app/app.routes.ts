import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {BaseComponent} from "./components/base.component";
// pages
import {LoginComponent} from "./components/pages/login.component";
import {UserComponent} from "./components/pages/user.component";
import {CustomerComponent} from "./components/pages/customer.component";
import {AttendanceComponent} from "./components/pages/attendance.component";
import {CreateUserComponent} from "./components/pages/create_user.component";
import {VisitComponent} from "./components/pages/visit.component";
import {UpdateUserComponent} from "./components/pages/update_user.component";
import {OrderComponent} from "./components/pages/order.component";
import {DashBoardComponent} from "./components/pages/dashboard/dashboard.component";

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [

            // add attendance routes
            {
                path: 'dashboard',
                component: DashBoardComponent
            },

            // add attendance routes
            {
                path: 'attendances',
                component: AttendanceComponent
            },

            // add visit routes
            {
                path: 'visits',
                component: VisitComponent
            },

            // add order routes
            {
                path: 'orders',
                component: OrderComponent
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
        ]
    },

    // Add login route
    {
        path: 'login',
        component: LoginComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
