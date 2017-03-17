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
import {TourComponent} from "./components/pages/tour_program/index/index.component";
import {BrickComponent} from "./components/pages/territory/brick/index/index.component";
import {CreateBrickComponent} from "./components/pages/territory/brick/create/create.component";
import {UpdateBrickComponent} from "./components/pages/territory/brick/update/update.component";
import {RegionStpComponent} from "./components/pages/customer/stp/region_stp/region_stp.component";
import {AreaStpComponent} from "./components/pages/customer/stp/area_stp/area_stp.component";
import {HeadquarterStpComponent} from "./components/pages/customer/stp/headquarter_stp/headquarter_stp.component";
import {TerritoryStpComponent} from "./components/pages/customer/stp/territory_stp/territory_stp.component";
import {BrickStpComponent} from "./components/pages/customer/stp/brick_stp/brick_stp.component";

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
                children: [
                    {
                        path: '',
                        component: TourComponent
                    },
                    {
                        path: 'monthly',
                        component: MonthlyTourProgramComponent
                    }
                ]
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

            // add brick routes
            {
                path: 'bricks',
                children: [
                    {
                        path: '',
                        component: BrickComponent,
                    },
                    {
                        path: 'create',
                        component: CreateBrickComponent
                    },
                    {
                        path: 'update/:id',
                        component: UpdateBrickComponent
                    },
                ]
            },

            // add stp routes
            {
                path: 'stps',
                children: [
                    {
                        path: ':country_id',
                        component: RegionStpComponent,
                    },
                    {
                        path: ':country_id/regions/:region_id',
                        component: AreaStpComponent,
                    },
                    {
                        path: ':country_id/regions/:region_id/areas/:area_id',
                        component: HeadquarterStpComponent,
                    },
                    {
                        path: ':country_id/regions/:region_id/areas/:area_id/headquarters/:headquarter_id',
                        component: TerritoryStpComponent,
                    },
                    {
                        path: ':country_id/regions/:region_id/areas/:area_id/headquarters/:headquarter_id/territories/:territory_id',
                        component: BrickStpComponent,
                    }
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
