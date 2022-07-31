import {ModuleWithProviders} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BaseComponent} from "./components/pages/base/base/base.component";
// pages
import {LoginComponent} from "./components/pages/auth/login/login.component";
import {AttendanceTableComponent} from "./components/pages/attendance/index/index.component";
import {VisitComponent} from "./components/pages/visit/index/index.component";
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
import {SummaryComponent} from "./components/pages/user/summary/index/summary.component";
import {PrimarySaleComponent} from "./components/pages/primary_sale/index/index.component";
import {BrickWiseCustomerComponent} from "./components/pages/territory/brick_wise_customer/index.component";
import {HQWiseVisitComponent} from "./components/pages/visit/hq_wise_visit_count/hq_wise_visit_count.component";
import {VideoComponent} from "./components/pages/video/index.component";
import {StockistWisePobComponent} from "./components/pages/customer/stockist_wise_pob/stockist_wise_pob.component";
import {ExecutiveSummaryComponent} from "./components/pages/user/executive_summary/executive_summary.component";
import {DepartmentExecutiveSummaryComponent} from "./components/pages/user/department_executive_summary/department_executive_summary.component";
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
import {ManagerOrderComponent} from "./components/pages/order/manager_index/index.component";
import {ManagerVisitComponent} from "./components/pages/visit/manager_index/index.component";
import {SapStockistWiseComponent} from "./components/pages/order/sap_stockist_wise/sap_stockist_wise.component";
import {HeadQuarterWiseReportComponent} from "./components/pages/order/headquarter_wise_report/headquarter_wise_report";
import {ReportIconsComponent} from "./components/pages/dashboard/report_icons_ui/report_icons_ui";
import {SalesPlanningComponent} from "./components/pages/sales_planning/sales_planning.component";
import {SecondarySaleHqWiseComponent} from "./components/pages/secondary_sale_hq_wise/index/index.component";
import {ProductWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/product_wise/product_wise.component";
import {UserComponent} from "./v2/pages/users/index/index.component";
import {CreateUserComponent} from "./v2/pages/users/create/create.component";
import {UpdateUserComponent} from "./v2/pages/users/update/update.component";
import {CustomerMissingComponent} from "./components/pages/customer/customer_missing/index.component";
import {ResetPasswordComponent} from "./components/pages/user/reset_password/reset_password.component";
import {LeaveReportComponent} from "./components/pages/visit/leave_report/leave_report.component";
import {ProductComponent} from "./v2/pages/products/index/index.component";
import {InputUtilizationReportComponent} from "./components/pages/visit/input_utilization_report/index.component";
import {HqWiseInputUtilizationReportComponent} from "./components/pages/visit/hq_wise_input_utilization_report/index.component";
import {StockistWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/stockist_wise/stockist_wise.component";
import {ManagerSyncOrderComponent} from "./components/pages/order/manager_sync_index/index.component";
import {StockistProductWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/stockist_wise/product/stockist_product_wise.component";
import {DailyVisitPlanComponent} from "./components/pages/brick/daliy_visit_plan/index.component";
import {BrickBusinessTrackerComponent} from "./components/pages/brick/business_tracker/index.component";
import {UserInputComponent} from "./components/pages/visit/user_input/user_input.component";
import {UserInputAcknowledgementComponent} from "./components/pages/visit/user_input_acknowledgement/user_input_acknowledgement.component";
import {FieldEffortAuditScoreCardComponent} from "./components/pages/user/field_efforts_audit_scorecard/field_efforts_audit_scorecard.component";
import {ZoneComponent} from './components/pages/territory/zone/index.component';
import {ZoneStpComponent} from './components/pages/customer/stp/zone_stp/zone_stp.component';
import {TempMonthlyAttendanceComponent} from './components/pages/attendance/temp_monthly/temp_monthly.component';
import {CustomerListComponent} from "./v2/pages/customers/index/index.component";
import {UserExpenseComponent} from './components/pages/expense/for_user/index/index.component';
import {ExpenseComponent} from './components/pages/expense/admin/index/index.component';
import {SupportComponent} from './components/pages/support/index.component';
import { DownloadComponent } from './components/pages/download/download.component';
import {DailySalesComponent} from './v2/pages/sales/index/index.component';
import { UserLocationComponent } from "./components/pages/attendance/user_location_map/user_location.component";
import {UserLeaveApproval} from './components/pages/attendance/user_leave_approval/user_leave_approval';
import {InputInventoryComponent} from './components/pages/visit/input_inventory/input_inventory.component';

// Route Configuration
export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'business_plan',
        children: [
          {
            path: '',
            component: SalesPlanningComponent
          }
        ]
      },

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
          },
          {
            path: 'leave_approval',
            component: UserLeaveApproval
          },
          {
            path: 'temp_monthly',
            component: TempMonthlyAttendanceComponent
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
            path: 'leave_report',
            component: LeaveReportComponent
          },
          {
            path: 'managers',
            component: ManagerVisitComponent
          },
          {
            path: 'user_input',
            component: UserInputComponent
          },
          {
            path: 'user_input_acknowledgement',
            component: UserInputAcknowledgementComponent
          },
          {
            path: 'input_inventory',
            component: InputInventoryComponent
          },
          {
            path: 'input_utilization',
            children: [
              {
                path: '',
                component: HqWiseInputUtilizationReportComponent
              },
              {
                path: 'hq_wise/:month/:year/:region_id/:area_id/:hq_id',
                component: InputUtilizationReportComponent
              }
            ]
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
          },
          {
            path: 'managers/sync',
            component: ManagerSyncOrderComponent
          }
        ]
      },

      // add user routes
      {
        path: 'users',
        children: [
          {
            path: 'summary',
            component: SummaryComponent
          },
          {
            path: 'reset_password',
            component: ResetPasswordComponent
          },
        ]
      },

      // add user routes
      {
        path: 'expenses',
        children: [
          {
            path: '',
            component: ExpenseComponent
          },
          {
            path: 'for_user',
            component: UserExpenseComponent
          }
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
          {
            path: 'missing',
            component: CustomerMissingComponent
          },

        ]
      },

      // add territories routes
      {
        path: 'territories',
        children: [
          {
            path: 'zones',
            children: [
              {
                path: '',
                component: ZoneComponent,
              },
              {
                path: ':zone_id/regions',
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
          }
        ]
      },

      // add stp routes
      {
        path: 'stps',
        children: [
          {
            path: ':country_id',
            component: ZoneStpComponent,
          },
          {
            path: ':country_id/zones/:zone_id',
            component: RegionStpComponent,
          },
          {
            path: ':country_id/zones/:zone_id/regions/:region_id',
            component: AreaStpComponent,
          },
          {
            path: ':country_id/zones/:zone_id/regions/:region_id/areas/:area_id',
            component: HeadquarterStpComponent,
          },
          {
            path: ':country_id/zones/:zone_id/regions/:region_id/areas/:area_id/headquarters/:headquarter_id',
            component: TerritoryStpComponent,
          },
          {
            path: ':country_id/zones/:zone_id/regions/:region_id/areas/:area_id/headquarters/:headquarter_id/territories/:territory_id',
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
                path: 'create/:month/:year/:id/:department_id',
                component: SecondarySaleCreateComponent
              },
              {
                path: 'region',
                component: SecondarySaleZSMComponent
              },
              {
                path: 'hq_wise',
                component: SecondarySaleHqWiseComponent
              },
              {
                path: 'product_wise/:month/:year/:region_id/:area_id/:hq_id/:department_id',
                component: ProductWiseHqComponent
              },
              {
                path: 'stockist_product_wise/:month/:year/:region_id/:area_id/:hq_id/:customer_id/:department_id',
                component: StockistProductWiseHqComponent
              },
              {
                path: 'stockist_wise/:month/:year/:region_id/:area_id/:hq_id/:department_id',
                component: StockistWiseHqComponent
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
          }, {
            path: 'brick_business_tracker_report',
            component: BrickBusinessTrackerComponent,
          }, {
            path: 'daily_visit_plan',
            component: DailyVisitPlanComponent,
          }, {
            path: 'field_efforts_audit_scorecard',
            component: FieldEffortAuditScoreCardComponent,
          },{
            path: 'department_executive_summary',
            component: DepartmentExecutiveSummaryComponent,
          }
        ]
      },
      //Download Report
      {
        path: 'download',
        component: DownloadComponent
      },
      {
        path: 'videos',
        component: VideoComponent
      },
      {
        path: 'support',
        component: SupportComponent
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
  {
    path: 'v2',
    component: BaseComponent,
    children: [{
      path: 'users',
      children: [{
        path: '',
        component: UserComponent
      }, {
        path: 'create',
        component: CreateUserComponent
      }, {
        path: 'update/:id',
        component: UpdateUserComponent
      }]
    }, {
      path: 'products',
      children: [{
        path: '',
        component: ProductComponent,
      }]
    }, {
      path: 'customers',
      children: [{
        path: '',
        component: CustomerListComponent
      }]
    },{
      path: 'daily_sales',
      children: [{
        path: '',
        component: DailySalesComponent
      }]
    }]
  },

  // Add login route
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'user-locations/:id/:month_year',
    component: UserLocationComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
