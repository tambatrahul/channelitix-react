import {BrowserModule} from "@angular/platform-browser";
import {enableProdMode, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
// base
import {BaseComponent} from "./components/pages/base/base/base.component";
import {NavComponent} from "./components/pages/base/nav/nav.component";
import {HeaderComponent} from "./components/pages/base/header/header.component";
// routing
import {routing} from "./app.routes";
// pages
import {LoginComponent} from "./components/pages/auth/login/login.component";
import {CustomerCountComponent} from "./components/pages/customer/customer_count/customer_count.component";
import {AttendanceTableComponent} from "./components/pages/attendance/index/index.component";
import {AuthService} from "./services/AuthService";
import {AttendanceService} from "./services/attendance.service";
import {CustomerService} from "./services/customer.service";
import {LoginService} from "./services/login.service";
import {TerritoryService} from "./services/territory.service";
import {UserService} from "./services/user.service";
import {AttendanceStatusDirective} from "./directives/attendance_status.directive";
import {CustomerTypeDirective} from "./directives/customer_type.directive";
import {StatusDirective} from "./directives/status.directive";
import {MonthPickerComponent} from "./components/form_elements/calendar/month_picker/month_picker.component";
import {PaginationComponent} from "./components/common/pagination/pagination.component";
import {RoleSelectComponent} from "./components/form_elements/user/role_select/role-select.component";
import {UserSelectComponent} from "./components/form_elements/user/user_select/user-select.component";
import {AreaSelectComponent} from "./components/form_elements/territory/area_select/area-select.component";
import {HeadquarterSelectComponent} from "./components/form_elements/territory/headquarter_select/headquarter-select.component";
import {TerritorySelectComponent} from "./components/form_elements/territory/territory_select/territory-select.component";
import {RegionSelectComponent} from "./components/form_elements/territory/region_select/region-select.component";
import {DatePickerComponent} from "./components/form_elements/calendar/date_picker/date_picker.component";
import {RoleCheckDirective} from "./directives/role.directive";
import {OnlyRoleCheckDirective} from "./directives/only_role.directive";
import {VisitService} from "./services/visit.service";
import {VisitComponent} from "./components/pages/visit/index/index.component";
import {VisitCountDirective} from "./directives/visit_count.directive";
import {VisitCountGraphComponent} from "./components/pages/dashboard/visit_count_graph/visit_count_graph.component";
import {OrderService} from "./services/order.service";
import {OrderComponent} from "./components/pages/order/index/index.component";
import {OrderCountDirective} from "./directives/order_count.directive";
import {DashBoardComponent} from "./components/pages/dashboard/index/index.component";
import {DatesSelectComponent} from "./components/form_elements/calendar/dates_select/dates-select.component";
import {MultipleUserSelectComponent} from "./components/form_elements/user/multi_user_select/multiple-user-select.component";
import {MultipleTerritorySelectComponent} from "./components/form_elements/territory/multi_territory_select/multiple-territory-select.component";
import {MultipleHeadquarterSelectComponent} from "./components/form_elements/territory/multi_headquarter_select/multiple-headquarter-select.component";
import {VisitOrderTrendComponent} from "./components/pages/graphs/visit_order_trend_graph/visit_order_trend.component";
import {HighestCallComponent} from "./components/pages/graphs/highest_call_graph/highest_call_graph.component";
import {HighestOrderComponent} from "./components/pages/graphs/highest_order_graph/highest_order_graph.component";
import {CalendarAttendanceComponent} from "./components/pages/attendance/calendar/calendar.component";
import {CalendarAttendanceStatusDirective} from "./components/pages/attendance/directives/calendar_attendance_status.directive";
import {MonthlyAttendanceComponent} from "./components/pages/attendance/monthly/monthly.component";
import {CreateAttendanceComponent} from "./components/pages/attendance/create/create.component";
import {WorkTypeSelectComponent} from "./components/form_elements/attendance/work_type/work-type-select.component";
import {LeaveTypeSelectComponent} from "./components/form_elements/attendance/leave_type/leave-type-select.component";
import {ManagerSelectComponent} from "./components/form_elements/attendance/manager/manager-select.component";
import {UpdateAttendanceComponent} from "./components/pages/attendance/update/update.component";
import {TourService} from "./services/tour.service";
import {V2TourService } from "./services/v2/tour.service";
import {CalendarTourStatusDirective} from "./components/pages/tour_program/directives/calendar_tour_status.directive";
import {CalendarTourComponent} from "./components/pages/tour_program/calendar/calendar.component";
import {MonthlyTourProgramComponent} from "./components/pages/tour_program/monthly/monthly.component";
import {BrickSelectComponent} from "./components/form_elements/territory/brick_select/brick-select.component";
import {TourFormComponent} from "./components/pages/tour_program/tour_form/tour_form.component";
import {DailyTourProgramComponent} from "./components/pages/tour_program/daily/daily.component";
import {CreateCustomerComponent} from "./components/pages/customer/create/create.component";
import {CustomerComponent} from "./components/pages/customer/index/index.component";
import {CustomerTypeSelectComponent} from "./components/form_elements/customer/customer_type_select/customer_type-select.component";
import {DoctorTypeSelectComponent} from "./components/form_elements/customer/doctor_type_select/doctor_type-select.component";
import {UpdateCustomerComponent} from "./components/pages/customer/update/update.component";
import {StpComponent} from "./components/pages/customer/stp/stp.component";
import {GradeSelectComponent} from "./components/form_elements/customer/grade_select/grade-select.component";
import {TourCountDirective} from "./directives/tour_count.directive";
import {TourComponent} from "./components/pages/tour_program/index/index.component";
import {BrickService} from "./services/brick.service";
import {BrickComponent} from "./components/pages/territory/brick/index/index.component";
import {CreateBrickComponent} from "./components/pages/territory/brick/create/create.component";
import {UpdateBrickComponent} from "./components/pages/territory/brick/update/update.component";
import {StpService} from "./services/stp.service";
import {RegionStpComponent} from "./components/pages/customer/stp/region_stp/region_stp.component";
import {AreaStpComponent} from "./components/pages/customer/stp/area_stp/area_stp.component";
import {HeadquarterStpComponent} from "./components/pages/customer/stp/headquarter_stp/headquarter_stp.component";
import {TerritoryStpComponent} from "./components/pages/customer/stp/territory_stp/territory_stp.component";
import {BrickStpComponent} from "./components/pages/customer/stp/brick_stp/brick_stp.component";
import {StationSelectComponent} from "./components/pages/territory/form_elements/station_select/station-select.component";
import {TourTypeSelectComponent} from "./components/pages/tour_program/form_elements/tour_type_select/tour-type-select.component";
import {MessageListComponent} from "./components/pages/message/list/message-list.component";
import {MessageService} from "./services/message.service";
import {MessageViewComponent} from "./components/pages/message/view/message-view.component";
import {MessageCreateComponent} from "./components/pages/message/create/create.component";
import {DashBoardCountComponent} from "./components/pages/dashboard/count/count.component";
import {ReportService} from "./services/report.service";
import {RegionComponent} from "./components/pages/territory/region/index.component";
import {AreaComponent} from "./components/pages/territory/area/index.component";
import {HeadquarterComponent} from "./components/pages/territory/headquarter/index.component";
import {TerritoryComponent} from "./components/pages/territory/territory/index.component";
import {GroupCountTableComponent} from "./components/pages/attendance/count/count.component";
import {BroadcastMessageComponent} from "./components/pages/message/broadcast_message/broadcast_message.component";
import {SecondarySaleComponent} from "./components/pages/secondary_sale/index/index.component";
import {SecondarySaleCreateComponent} from "./components/pages/secondary_sale/create/create.component";
import {SecondarySaleService} from "./services/secondary_sale.service";
import {UserWiseTourProgramComponent} from "./components/pages/tour_program/user_wise/user_wise.component";
import {SalesTrendComponent} from "./components/pages/graphs/sales_trend_graph/sales_trend_graph.component";
import {ProductService} from "./services/product.service";
import {SummaryComponent} from "./components/pages/user/summary/index/summary.component";
import {SummaryDetailComponent} from "./components/pages/user/summary/detail/detail.component";
import {AttendancePobStatusDirective} from "./components/pages/attendance/directives/attendance_pob_status.directive";
import {AttendancePobCombineStatusDirective} from "./components/pages/attendance/directives/attendance_pob_combine_status.directive";
import {SummaryVisitOrderGraphComponent} from "./components/pages/user/summary/summary_visit_order_graph/summary_visit_order_graph.component";
import {OrderComponentComponent} from "./components/pages/order/order_component/order-component.component";
import {CustomerSelectionComponent} from "./components/pages/customer/customer_selection/customer_selection.component";
import {ReportComponent} from "./components/pages/attendance/report/report.component";
import {CustomerSelectComponent} from "./components/form_elements/attendance/customer/customer-select.component";
import {MultiselectDropdownModule} from "angular-2-dropdown-multiselect";
import {PrimarySaleService} from "./services/primary_sale.service";
import {PrimarySaleComponent} from "./components/pages/primary_sale/index/index.component";
import {ProductWiseComponent} from "./components/pages/primary_sale/product_wise/product_wise.component";
import {StockistWiseComponent} from "./components/pages/primary_sale/stockist_wise/stockist_wise.component";
import {StockistProductWiseComponent} from "./components/pages/primary_sale/stockist_product_wise/stockist_product_wise.component";
import {InvoicesComponent} from "./components/pages/primary_sale/invoices/invoices.component";
import {TillMonthChartComponent} from "./components/pages/dashboard/till_month_chart/till_month_chart.component";
import {MonthlyPrimarySecondaryTargetComponent} from "./components/pages/dashboard/monthly_primary_secondary_target/monthly_primary_secondary_target.component";
import {MonthlyPrimarySecondaryTargetBecosuleComponent} from "./components/pages/dashboard/monthly_primary_secondary_target_becosule/monthly_primary_secondary_target_becosule.component";
import {MonthlyPrimarySecondaryTargetGelusilComponent} from "./components/pages/dashboard/monthly_primary_secondary_target_gelusil/monthly_primary_secondary_target_gelusil.component";
import {InvoiceDetailComponent} from "./components/pages/primary_sale/invoice_detail/invoice_detail.component";
import {ProductWiseSaleComponent} from "./components/pages/dashboard/product_wise_sale/product_wise_sale.component";
import {MultipleRegionSelectComponent} from "./components/form_elements/territory/multi_region_select/multiple-region-select.component";
import {MultipleAreaSelectComponent} from "./components/form_elements/territory/multi_area_select/multiple-area-select.component";
import {BrickWiseCustomerComponent} from "./components/pages/territory/brick_wise_customer/index.component";
import {HQWiseVisitComponent} from "./components/pages/visit/hq_wise_visit_count/hq_wise_visit_count.component";
import {UserOrderListComponent} from "./components/pages/order/user_order_list/user_order_list.component";
import {VideoComponent} from "./components/pages/video/index.component";
import {StockistWisePobComponent} from "./components/pages/customer/stockist_wise_pob/stockist_wise_pob.component";
import {UserVisitListComponent} from "./components/pages/visit/user_visit_list/user_visit_list.component";
import {ExecutiveSummaryComponent} from "./components/pages/user/executive_summary/executive_summary.component";
import {ProductSelectComponent} from "./components/form_elements/order/product_select/product-select.component";
import {SynergyStockistWisePobComponent} from "./components/pages/customer/synergy_stockist_wise_pob/synergy_stockist_wise_pob.component";
import {ProductivityAnalysisReportComponent} from "./components/pages/order/productivity_analysis_report/productivity_analysis_report.component";
import {CustomerTypeService} from "./services/customer_type.service";
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
import {CustomerDataComponent} from "./components/pages/dashboard/report/customer_data/customer_data.component";
import {SalesComponent} from "./components/pages/dashboard/report/report_component/sales/sales.component";
import {VacancyDataComponent} from "./components/pages/dashboard/report/report_component/vacancy/vacancy.component";
import {FFEffortMetricsComponent} from "./components/pages/dashboard/report/report_component/ff_effort_metrics/ff_effort_metrics.component";
import {ManagerActivitiesComponent} from "./components/pages/dashboard/report/report_component/manager_activities/manager_activities.component";
import {CustomerBrickCoverageComponent} from "./components/pages/customer_brick_coverage/index.component";
import {StockistSalesGraphComponent} from "./components/pages/dashboard/stockist_sales_graph/stockist_sales_graph";
import {SecondarySaleZSMComponent} from "./components/pages/secondary_sale/zsm_index/index.component";
import {CustomerSelectDashboardComponent} from "./components/form_elements/customer/customer_select/customer_select.component";
import {ManagerOrderComponent} from "./components/pages/order/manager_index/index.component";
import {ManagerVisitComponent} from "./components/pages/visit/manager_index/index.component";
import {ManagerOrderCountDirective} from "./directives/mg_order_count.directive";
import {ManagerVisitCountDirective} from "./directives/mg_visit_count.directive";
import {SapStockistWiseComponent} from "./components/pages/order/sap_stockist_wise/sap_stockist_wise.component";
import {ProductWiseSaleForSKComponent} from "./components/pages/dashboard/product_wise_sale_for_sk/product_wise_sale_for_sk.component";
import {HeadQuarterWiseReportComponent} from "./components/pages/order/headquarter_wise_report/headquarter_wise_report";
import {ReportIconsComponent} from "./components/pages/dashboard/report_icons_ui/report_icons_ui";
import {SalesPlanningComponent} from "./components/pages/sales_planning/sales_planning.component";
import {SalesPlanningService} from "./services/sales_planning.service";
import {SalePlanComponent} from "./components/pages/sales_planning/sale_plan_component/sale_plan_component.component";
import {ProductSalePlanComponent} from "./components/pages/sales_planning/product_sale_plan_component/product_sale_plan_component.component";
import {PrimarySaleAboveComponent} from "./components/pages/sales_planning/primary_sale_above_component/primary_sale_above_component.component";
import {SecondarySaleHqWiseComponent} from "./components/pages/secondary_sale_hq_wise/index/index.component";
import {ProductWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/product_wise/product_wise.component";
import {CustomerMissingComponent} from "./components/pages/customer/customer_missing/index.component";
import {ResetPasswordComponent} from "./components/pages/user/reset_password/reset_password.component";
import {UserComponent} from "./v2/pages/users/index/index.component";
import {V2UserService} from "./services/v2/user.service";
import {RoleButtonComponent} from "./v2/components/form_elements/user/role_button/role_button.component";
import {DeactivateUserComponent} from "./v2/components/users/deactivate_user/deactivate_user.component";
import {PasswordResetComponent} from "./v2/components/users/password_reset/password_reset.component";
import {CreateUserComponent} from "./v2/pages/users/create/create.component";
import {UpdateUserComponent} from "./v2/pages/users/update/update.component";
import {LeaveReportComponent} from "./components/pages/visit/leave_report/leave_report.component";
import {DeviationReportComponent} from "./components/pages/user/summary/deviation_report/deviation_report.component";
import {ProductComponent} from "./v2/pages/products/index/index.component";
import {MonthWiseReportComponent} from "./components/pages/user/summary/month_wise/month_wise.component";
import {InputUtilizationReportComponent} from "./components/pages/visit/input_utilization_report/index.component";
import {HqWiseInputUtilizationReportComponent} from "./components/pages/visit/hq_wise_input_utilization_report/index.component";
import {StockistWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/stockist_wise/stockist_wise.component";
import {MissingCustomerListComponent} from "./components/pages/secondary_sale/missing_customer_list/missing_customer_list.component";
import {ManagerSyncOrderComponent} from "./components/pages/order/manager_sync_index/index.component";
import {StockistProductWiseHqComponent} from "./components/pages/secondary_sale_hq_wise/stockist_wise/product/stockist_product_wise.component";
import {DailyVisitPlanComponent} from "./components/pages/brick/daliy_visit_plan/index.component";
import {BrickBusinessTrackerComponent} from "./components/pages/brick/business_tracker/index.component";
import {MilestoneSaleTrackingGraphComponent} from "./components/pages/dashboard/milestone_sales_tracking/milestone_sales_tracking_graph.component";
import {SkinliteSaleAnalysisGraphComponent} from "./components/pages/dashboard/skinlite_sales_analysis_graph/skinlite_sales_analysis_graph.component";
import {BrandService} from "./services/brand.service";
import {DepartmentService} from "./services/department.service";
import {BrandSelectComponent} from "./components/form_elements/order/brand_select/brand-select.component";
import {UserInputComponent} from "./components/pages/visit/user_input/user_input.component";
import {UserInputAcknowledgementComponent} from "./components/pages/visit/user_input_acknowledgement/user_input_acknowledgement.component";
import {InputPosComponent} from "./components/pages/visit/input_pos/input_pos.component";
import {InputSelectComponent} from "./components/form_elements/visit/input_select/input-select.component";
import {PriorityBrandSelectComponent} from "./components/form_elements/visit/priority_brand_select/priority-brand-select.component";
import {FieldEffortAuditScoreCardComponent} from "./components/pages/user/field_efforts_audit_scorecard/field_efforts_audit_scorecard.component";
import {CSEFieldEffortsAuditScorecard} from "./components/pages/user/field_efforts_audit_scorecard/cse_field_efforts_data/cse_field_efforts_audit_scorecard.component";
import {CSMFieldEffortsAuditScorecard} from "./components/pages/user/field_efforts_audit_scorecard/csm_field_efforts_data/csm_field_efforts_audit_scorecard.component";
import {ZSMFieldEffortsAuditScorecard} from "./components/pages/user/field_efforts_audit_scorecard/zsm_field_efforts_data/zsm_field_efforts_audit_scorecard.component";
import {HeadquarterListComponent} from "./components/pages/user/field_efforts_audit_scorecard/cse_field_efforts_data/components/headquarter/headquarter_list.component";
import {BrickListComponent} from "./components/pages/user/field_efforts_audit_scorecard/cse_field_efforts_data/components/brick/brick_list.component";
import {AreaListComponent} from "./components/pages/user/field_efforts_audit_scorecard/csm_field_efforts_data/components/area/area_list.component";
import {RegionListComponent} from "./components/pages/user/field_efforts_audit_scorecard/zsm_field_efforts_data/components/region/region_list.component";
import {MonthSummaryComponent} from "./components/pages/user/summary/month_summary/month_summary.component";
import {ZoneSelectComponent} from './components/form_elements/territory/zone_select/zone-select.component';
import {ZoneComponent} from './components/pages/territory/zone/index.component';
import {MultipleZoneSelectComponent} from './components/form_elements/territory/multi_zone_select/multiple-zone-select.component';
import {ZoneStpComponent} from './components/pages/customer/stp/zone_stp/zone_stp.component';
import {AttendanceBrandComponent} from './components/pages/attendance/brand/brand-att.component';
import {DeleteReportComponent} from './v2/components/users/delete_report/delete_report.component';
import {TempMonthlyAttendanceComponent} from './components/pages/attendance/temp_monthly/temp_monthly.component';
import {TempCreateAttendanceComponent} from './components/pages/attendance/temp_create/temp_create.component';
import {TempUpdateAttendanceComponent} from './components/pages/attendance/temp_update/temp_update.component';
import { CustomerListComponent } from "./v2/pages/customers/index/index.component";
import {UserExpenseComponent} from './components/pages/expense/for_user/index/index.component';
import {ExpenseService} from './services/expense.service';
import {CommonModule} from '@angular/common';
import {ExpenseComponent} from './components/pages/expense/admin/index/index.component';
import {FirstFortnightComponent} from './components/pages/expense/admin/first_fortnight_expense/first_fortnight_expense.component';
import {SecondFortnightComponent} from './components/pages/expense/admin/second_fortnight_expense/second_fortnight_expense.component';
import {ViewExpenseModalComponent} from './components/pages/expense/admin/components/view_expense_modal/view_expense_modal.component';
import {DepartmentSelectComponent} from "./components/form_elements/user/department_select/department-select.component";
import {SupportComponent} from "./components/pages/support/index.component";
import {RequestToEditExpenseComponent} from './components/pages/expense/for_user/components/request_to_edit_expense/request_to_edit_expense.component';
import { DownloadComponent } from './components/pages/download/download.component';
import {DownloadService} from "./services/download.service";
import {StockistReportSelectComponent} from "./components/form_elements/download/stockist_report_select/stockist_report_select.component";
import {BrickReportSelectComponent} from "./components/form_elements/download/brick_report_select/brick_report_select.component";
import {HeadquaterReportSelectComponent} from "./components/form_elements/download/headquater_report_select/headquater_report_select.component";
import {PrimaryReportSelectComponent} from "./components/form_elements/download/primary_report_select/primary_report_select.component";
import {InputReportSelectComponent} from "./components/form_elements/download/input_report_select/input_report_select.component";
import {PriorityReportSelectComponent} from "./components/form_elements/download/priority_report_select/priority_report_select.component";
import {CustomerReportSelectComponent} from "./components/form_elements/download/customer_report_select/customer_report_select.component";
import {TargetReportSelectComponent} from "./components/form_elements/download/target_report_select/target_report_select.component";
import {ListComponent} from './components/base/list.component';
import {DailySalesComponent} from './v2/pages/sales/index/index.component';
import {SaleService} from './services/v2/sale.service';
import {SubNameSelectComponent} from './components/form_elements/order/subname_select/subname-select-component';
import {SubNameService} from './services/subname_service';
import {SampleReportSelectComponent} from './components/form_elements/download/sample_report_select/sample_report_select.component';

import {UserTrainingSelectComponent} from './components/form_elements/user/user-training-select/user-training-select.component';
import { TrainingReportComponent } from "./v2/components/users/training_report/training_report.component";
import {SalesDirective} from './directives/sales.directive';
import {UserLocationComponent} from './components/pages/attendance/user_location_map/user_location.component';
import { UserLocationService } from "./services/v3/user_location.service";
import {UnlockReportComponent} from './v3/components/users/unlock_report/unlock_report.component';
import { V2ReportService } from "./services/v2/report.service";

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,

    // base components
    BaseComponent,
    NavComponent,
    HeaderComponent,

    // pages
    LoginComponent,
    UserComponent,
    BrickComponent,
    CreateBrickComponent,
    UpdateBrickComponent,
    CreateUserComponent,
    UpdateUserComponent,
    CustomerComponent,
    CustomerCountComponent,
    AttendanceTableComponent,
    VisitComponent,
    OrderComponent,
    DashBoardComponent,
    CalendarAttendanceComponent,
    MonthlyAttendanceComponent,
    CreateAttendanceComponent,
    UpdateAttendanceComponent,
    CalendarTourComponent,
    MonthlyTourProgramComponent,
    TourFormComponent,
    UserWiseTourProgramComponent,
    DailyTourProgramComponent,
    CreateCustomerComponent,
    UpdateCustomerComponent,
    StpComponent,
    TourComponent,
    ZoneStpComponent,
    RegionStpComponent,
    AreaStpComponent,
    HeadquarterStpComponent,
    TerritoryStpComponent,
    BrickStpComponent,
    MessageListComponent,
    MessageViewComponent,
    MessageCreateComponent,
    BroadcastMessageComponent,
    DashBoardCountComponent,
    DashBoardReportComponent,
    ZoneComponent,
    RegionComponent,
    AreaComponent,
    HeadquarterComponent,
    TerritoryComponent,
    GroupCountTableComponent,
    SecondarySaleComponent,
    SecondarySaleCreateComponent,
    ProductComponent,
    SummaryComponent,
    SummaryDetailComponent,
    ProductWiseComponent,
    StockistWiseComponent,
    StockistProductWiseComponent,
    StockistProductWiseHqComponent,
    InvoicesComponent,
    InvoiceDetailComponent,
    ProductWiseSaleComponent,
    HQWiseVisitComponent,
    UserOrderListComponent,
    VideoComponent,
    StockistWisePobComponent,
    UserVisitListComponent,
    ExecutiveSummaryComponent,
    SynergyStockistWisePobComponent,
    ProductivityAnalysisReportComponent,
    VacancyDataComponent,
    SecondarySaleZSMComponent,
    ManagerOrderComponent,
    ManagerVisitComponent,
    SapStockistWiseComponent,
    ProductWiseSaleForSKComponent,
    CustomerMissingComponent,
    LeaveReportComponent,
    UserInputComponent,
    UserInputAcknowledgementComponent,
    InputPosComponent,
    DeviationReportComponent,
    HqWiseInputUtilizationReportComponent,
    InputUtilizationReportComponent,
    MissingCustomerListComponent,
    BrickBusinessTrackerComponent,
    DailyVisitPlanComponent,
    SupportComponent,
    //dashboard report Component
    SalesComponent,
    FFEffortMetricsComponent,
    ManagerActivitiesComponent,
    DailySalesComponent,

    // dashboard stockist sales graph
    StockistSalesGraphComponent,

    // customer brick component
    CustomerBrickCoverageComponent,

    // directives
    AttendanceStatusDirective,
    CustomerTypeDirective,
    StatusDirective,
    RoleCheckDirective,
    OnlyRoleCheckDirective,
    VisitCountDirective,
    ManagerVisitCountDirective,
    OrderCountDirective,
    ManagerOrderCountDirective,
    CalendarAttendanceStatusDirective,
    CalendarTourStatusDirective,
    TourCountDirective,
    AttendancePobStatusDirective,
    AttendancePobCombineStatusDirective,
    SalesDirective,
    PrimarySaleComponent,
    TillMonthChartComponent,
    MonthlyPrimarySecondaryTargetComponent,
    MonthlyPrimarySecondaryTargetBecosuleComponent,
    MonthlyPrimarySecondaryTargetGelusilComponent,
    BrickWiseCustomerComponent,
    CustomerDataComponent,
    CustomerSelectDashboardComponent,
    HeadQuarterWiseReportComponent,
    ReportIconsComponent,

    // reusable components
    MonthPickerComponent,
    PaginationComponent,
    RoleSelectComponent,
    UserSelectComponent,
    ZoneSelectComponent,
    RegionSelectComponent,
    AreaSelectComponent,
    TerritorySelectComponent,
    HeadquarterSelectComponent,
    DatePickerComponent,
    PasswordResetComponent,
    ResetPasswordComponent,
    VisitCountGraphComponent,
    MilestoneSaleTrackingGraphComponent,
    SkinliteSaleAnalysisGraphComponent,
    SummaryVisitOrderGraphComponent,
    DatesSelectComponent,
    MultipleUserSelectComponent,
    MultipleTerritorySelectComponent,
    MultipleHeadquarterSelectComponent,
    MultipleRegionSelectComponent,
    MultipleZoneSelectComponent,
    MultipleAreaSelectComponent,
    VisitOrderTrendComponent,
    HighestCallComponent,
    HighestOrderComponent,
    SalesTrendComponent,
    WorkTypeSelectComponent,
    LeaveTypeSelectComponent,
    ManagerSelectComponent,
    BrickSelectComponent,
    CustomerTypeSelectComponent,
    DoctorTypeSelectComponent,
    GradeSelectComponent,
    StationSelectComponent,
    TourTypeSelectComponent,
    ReportComponent,
    OrderComponentComponent,
    CustomerSelectionComponent,
    CustomerSelectComponent,
    ProductSelectComponent,
    BrandSelectComponent,
    SubNameSelectComponent,
    SalesPlanningComponent,
    SalePlanComponent,
    ProductSalePlanComponent,
    PrimarySaleAboveComponent,
    SecondarySaleHqWiseComponent,
    ProductWiseHqComponent,
    StockistWiseHqComponent,
    MonthWiseReportComponent,
    ManagerSyncOrderComponent,
    InputSelectComponent,
    PriorityBrandSelectComponent,
    DepartmentSelectComponent,
    StockistReportSelectComponent,
    BrickReportSelectComponent,
    HeadquaterReportSelectComponent,
    PrimaryReportSelectComponent,
    InputReportSelectComponent,
    PriorityReportSelectComponent,
    CustomerReportSelectComponent,
    TargetReportSelectComponent,
    SampleReportSelectComponent,

    // Abbott Stp Component
    AbbottStpComponent,
    AgraHQComponent,
    BalliaHQComponent,
    BareillyHQComponent,
    DehradunHQComponent,
    GhaziabadHQComponent,
    KanpurHQComponent,
    LucknowHQComponent,
    MeerutHQComponent,
    MoradabadHQComponent,
    PadraunaHQComponent,
    SitapurHQComponent,

    // Version 2 Models
    RoleButtonComponent,
    DeactivateUserComponent,
    DeleteReportComponent,

    // Field Efforts Audit Scorecard
    FieldEffortAuditScoreCardComponent,
    CSEFieldEffortsAuditScorecard,
    CSMFieldEffortsAuditScorecard,
    ZSMFieldEffortsAuditScorecard,

    //
    HeadquarterListComponent,
    BrickListComponent,
    AreaListComponent,
    RegionListComponent,
    MonthSummaryComponent,
    TempMonthlyAttendanceComponent,
    TempCreateAttendanceComponent,
    TempUpdateAttendanceComponent,

    AttendanceBrandComponent,
    CustomerListComponent,

    UserExpenseComponent,
    ExpenseComponent,
    FirstFortnightComponent,
    SecondFortnightComponent,
    ViewExpenseModalComponent,
    RequestToEditExpenseComponent,
    DownloadComponent,

    UserTrainingSelectComponent,
    TrainingReportComponent,
    UnlockReportComponent,
    UserLocationComponent
  ],
  imports: [
    BrowserModule,
    MultiselectDropdownModule,
    ReactiveFormsModule,
    FormsModule,
    HttpModule,
    routing,
    CommonModule
  ],
  providers: [
    AuthService,
    AttendanceService,
    CustomerService,
    VisitService,
    LoginService,
    TerritoryService,
    UserService,
    BrickService,
    OrderService,
    TourService,
    V2TourService,
    MessageService,
    ReportService,
    V2ReportService,
    StpService,
    SecondarySaleService,
    SalesPlanningService,
    PrimarySaleService,
    ProductService,
    BrandService,
    SubNameService,
    DepartmentService,
    CustomerTypeService,
    ExpenseService,
    DownloadService,

    // Version 2 Service
    V2UserService,
    SaleService,

    UserLocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
