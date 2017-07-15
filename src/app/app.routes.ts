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
import {MessageListComponent} from "./components/pages/message/list/message-list.component";
import {RegionComponent} from "./components/pages/territory/region/index.component";
import {AreaComponent} from "./components/pages/territory/area/index.component";
import {HeadquarterComponent} from "./components/pages/territory/headquarter/index.component";
import {TerritoryComponent} from "./components/pages/territory/territory/index.component";
import {SecondarySaleComponent} from "./components/pages/secondary_sale/index/index.component";
import {SecondarySaleCreateComponent} from "./components/pages/secondary_sale/create/create.component";
import {ProductComponent} from "./components/pages/product/index/index.component";
import {SummaryComponent} from "./components/pages/user/summary/index/summary.component";
import {PrimarySaleComponent} from "./components/pages/primary_sale/index/index.component";
import {BrickWiseCustomerComponent} from "./components/pages/territory/brick_wise_customer/index.component";
import {HQWiseVisitComponent} from "./components/pages/visit/hq_wise_visit_count/hq_wise_visit_count.component";
import {VideoComponent} from "./components/pages/video/index.component";
import {StockistWisePobComponent} from "./components/pages/customer/stockist_wise_pob/stockist_wise_pob.component";
import {ExecutiveSummaryComponent} from "./components/pages/user/executive_summary/executive_summary.component";
import {SynergyStockistWisePobComponent} from "./components/pages/customer/synergy_stockist_wise_pob/synergy_stockist_wise_pob.component";
import {ProductivityAnalysisReportComponent} from "./components/pages/order/productivity_analysis_report/productivity_analysis_report.component";
import {AbbottStpComponent} from "./components/pages/standard_tour_program_pages/index/index.component";
import {AgraHQComponent} from "./components/pages/standard_tour_program_pages/agrahq/index.component";
import {BalliaHQComponent} from "./components/pages/standard_tour_program_pages/balliahq/index.component";
import {BareillyHQComponent} from "./components/pages/standard_tour_program_pages/bareillyhq/index.component";
import {DehradunHQComponent} from "./components/pages/standard_tour_program_pages/dehradunhq/index.component";
import {GhaziabadHQComponent} from "./components/pages/standard_tour_program_pages/ghaziabadhq/index.component";
import {KanpurHQComponent} from "./components/pages/standard_tour_program_pages/kanpurhq/index.component";
import {LucknowHQComponent} from "./components/pages/standard_tour_program_pages/lucknowhq/index.component";
import {MeerutHQComponent} from "./components/pages/standard_tour_program_pages/meeruthq/index.component";
import {MoradabadHQComponent} from "./components/pages/standard_tour_program_pages/moradabadhq/index.component";
import {PadraunaHQComponent} from "./components/pages/standard_tour_program_pages/padraunahq/index.component";
import {SitapurHQComponent} from "./components/pages/standard_tour_program_pages/sitapurhq/index.component";
import {DashBoardReportComponent} from "./components/pages/dashboard/report/index.component";
import {CustomerBrickCoverageComponent} from "./components/pages/customer_brick_coverage/index.component";
import {SecondarySaleZSMComponent} from "./components/pages/secondary_sale/zsm_index/index.component";
import {StockistSalesGraphComponent} from "./components/pages/dashboard/stockist_sales_graph/stockist_sales_graph";
import {ManagerOrderComponent} from "./components/pages/order/manager_index/index.component";
import {ManagerVisitComponent} from "./components/pages/visit/manager_index/index.component";
import {SapStockistWiseComponent} from "./components/pages/order/sap_stockist_wise/sap_stockist_wise.component";
import {HeadQuarterWiseReportComponent} from "./components/pages/order/headquarter_wise_report/headquarter_wise_report";
import {ReportIconsComponent} from "./components/pages/dashboard/report_icons_ui/report_icons_ui";

// Route Configuration
export const routes: Routes = [
    {
        path: '',
        component: BaseComponent,
        children: [

            // add attendance routes
            {
                path: 'dashboard',
                children: [
                    {
                        path: '',
                        component: DashBoardComponent
                    },
                    {
                        path: 'report',
                        component: DashBoardReportComponent
                    },
                    {
                        path: 'brick_coverage',
                        component: CustomerBrickCoverageComponent
                    },
                    {
                        path: 'reports_icons',
                        component: ReportIconsComponent
                    }
                ]
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
                children: [
                    {
                        path: '',
                        component: VisitComponent
                    },
                    {
                        path: 'managers',
                        component: ManagerVisitComponent
                    }
                ]
            },

            // add order routes
            {
                path: 'orders',
                children: [
                    {
                        path: '',
                        component: OrderComponent
                    },
                    {
                        path: 'managers',
                        component: ManagerOrderComponent
                    }
                ]
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
                    {
                        path: 'summary',
                        component: SummaryComponent
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

            // add territories routes
            {
                path: 'territories',
                children: [
                    {
                        path: 'regions',
                        children: [
                            {
                                path: '',
                                component: RegionComponent,
                            },
                            {
                                path: ':region_id/areas',
                                children: [
                                    {
                                        path: '',
                                        component: AreaComponent,
                                    },
                                    {
                                        path: ':area_id/headquarters',
                                        children: [
                                            {
                                                path: '',
                                                component: HeadquarterComponent,
                                            },
                                            {
                                                path: ':headquarter_id/territories',
                                                children: [
                                                    {
                                                        path: '',
                                                        component: TerritoryComponent,
                                                    },
                                                    {
                                                        path: ':territory_id/bricks',
                                                        children: [
                                                            {
                                                                path: '',
                                                                component: BrickComponent
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
                                                ]
                                            },
                                        ]
                                    },
                                ]
                            },
                        ]
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
            {
                path: 'messages',
                children: [
                    {
                        path: '',
                        component: MessageListComponent,
                    },
                ]
            },
            {
                path: 'sales',
                children: [
                    {
                        path: 'secondary',
                        children: [
                            {
                                path: '',
                                component: SecondarySaleComponent
                            },
                            {
                                path: 'create/:month/:year/:id',
                                component: SecondarySaleCreateComponent
                            },
                            {
                                path: 'region',
                                component: SecondarySaleZSMComponent
                            },
                        ]
                    },
                ]
            },
            {
                path: 'primary',
                children: [
                    {
                        path: 'invoices',
                        children: [
                            {
                                path: '',
                                component: PrimarySaleComponent
                            }
                        ]
                    },
                ]
            },
            {
                path: 'products',
                children: [
                    {
                        path: '',
                        component: ProductComponent,
                    },
                ]
            },
            {
                path: 'reports',
                children: [
                    {
                        path: 'brick_wise_customers',
                        component: BrickWiseCustomerComponent,
                    }, {
                        path: 'hq_wise_visits',
                        component: HQWiseVisitComponent,
                    }, {
                        path: 'stockist_wise_pob',
                        component: StockistWisePobComponent,
                    }, {
                        path: 'synergy_stockist_wise_pob',
                        component: SynergyStockistWisePobComponent,
                    }, {
                        path: 'executive_summary',
                        component: ExecutiveSummaryComponent,
                    }, {
                        path: 'productivity_analysis',
                        component: ProductivityAnalysisReportComponent,
                    }, {
                        path: 'sap_stockist_wise',
                        component: SapStockistWiseComponent,
                    }, {
                        path: 'headquarter_wise_report',
                        component: HeadQuarterWiseReportComponent,
                    }
                ]
            },

            {
                path: 'videos',
                component: VideoComponent
            },

            // Abbott STP
            {
                path: 'abbott',
                children: [
                    {
                        path: 'stps',
                        children: [
                            {
                                path: '',
                                component: AbbottStpComponent
                            },
                            {
                                path: 'agra',
                                component: AgraHQComponent
                            },
                            {
                                path: 'ballia',
                                component: BalliaHQComponent
                            },
                            {
                                path: 'bareilly',
                                component: BareillyHQComponent
                            },
                            {
                                path: 'dehradun',
                                component: DehradunHQComponent
                            },
                            {
                                path: 'ghaziabad',
                                component: GhaziabadHQComponent
                            },
                            {
                                path: 'kanpur',
                                component: KanpurHQComponent
                            },
                            {
                                path: 'lucknow',
                                component: LucknowHQComponent
                            },
                            {
                                path: 'meerut',
                                component: MeerutHQComponent
                            },
                            {
                                path: 'moradabad',
                                component: MoradabadHQComponent
                            },
                            {
                                path: 'padrauna',
                                component: PadraunaHQComponent
                            },
                            {
                                path: 'sitapur',
                                component: SitapurHQComponent
                            },
                        ]
                    },
                ]
            }
        ]
    },

    // Add login route
    {
        path: 'login',
        component: LoginComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
