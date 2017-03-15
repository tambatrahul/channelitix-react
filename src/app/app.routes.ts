import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {BaseComponent} from "./components/pages/base/base/base.component";
// pages
import {LoginComponent} from "./components/pages/auth/login/login.component";
import {UserComponent} from "./components/pages/user/index/index.component";
import {AttendanceTableComponent} from "./components/pages/attendance/index/index.component";
import {CreateUserComponent} from "./components/pages/user/create/create.component";
import {VisitComponent} from "./components/pages/visit/index/index.component";
import {UpdateUserComponent} from "./components/pages/user/update/update.component";
import {OrderComponent} from "./components/pages/order/index/index.component";
import {DashBoardComponent} from "./components/pages/dashboard/index/index.component";
import {MonthlyAttendanceComponent} from "./components/pages/attendance/monthly/monthly.component";
import {MonthlyTourProgramComponent} from "./components/pages/tour_program/monthly/monthly.component";
import {CreateCustomerComponent} from "./components/pages/customer/create/create.component";
import {CustomerComponent} from "./components/pages/customer/index/index.component";
import {UpdateCustomerComponent} from "./components/pages/customer/update/update.component";
import {StpComponent} from "./components/pages/customer/stp/stp.component";

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
                children: [
                    {
                        path: '',
                        component: AttendanceTableComponent
                    },
                    {
                        path: 'monthly',
                        component: MonthlyAttendanceComponent
                    }
                ]
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

            // add tour routes
            {
                path: 'tours',
                component: MonthlyTourProgramComponent
            },

            // add customer routes
            {
                path: 'customers',
                children: [
                    {
                        path: '',
                        component: CustomerComponent
                    },
                    {
                        path: 'stp',
                        component: StpComponent
                    },
                    {
                        path: 'create',
                        component: CreateCustomerComponent
                    },
                    {
                        path: 'update/:id',
                        component: UpdateCustomerComponent
                    },

                ]
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
