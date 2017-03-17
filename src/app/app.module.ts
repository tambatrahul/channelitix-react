import {BrowserModule} from "@angular/platform-browser";
import {NgModule, enableProdMode} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {nvD3} from "ng2-nvd3";
// base
import {BaseComponent} from "./components/pages/base/base/base.component";
import {NavComponent} from "./components/pages/base/nav/nav.component";
import {HeaderComponent} from "./components/pages/base/header/header.component";
// routing
import {routing} from "./app.routes";
// pages
import {LoginComponent} from "./components/pages/auth/login/login.component";
import {UserComponent} from "./components/pages/user/index/index.component";
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
import {CookieService} from "angular2-cookie/services/cookies.service";
import {RegionSelectComponent} from "./components/form_elements/territory/region_select/region-select.component";
import {DatePickerComponent} from "./components/form_elements/calendar/date_picker/date_picker.component";
import {CreateUserComponent} from "./components/pages/user/create/create.component";
import {UpdateUserComponent} from "./components/pages/user/update/update.component";
import {RoleCheckDirective} from "./directives/role.directive";
import {VisitService} from "./services/visit.service";
import {VisitComponent} from "./components/pages/visit/index/index.component";
import {VisitCountDirective} from "./directives/visit_count.directive";
import {DeactivateUserComponent} from "./components/pages/user/deactivate_user/deactivate_user.component";
import {VisitCountGraphComponent} from "./components/pages/dashboard/visit_count_graph/visit_count_graph.component";
import {OrderService} from "./services/order.service";
import {OrderComponent} from "./components/pages/order/index/index.component";
import {OrderCountDirective} from "./directives/order_count.directive";
import {PasswordResetComponent} from "./components/pages/user/password_reset/password_reset.component";
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
import {CalendarTourStatusDirective} from "./components/pages/tour_program/directives/calendar_tour_status.directive";
import {CalendarTourComponent} from "./components/pages/tour_program/calendar/calendar.component";
import {MonthlyTourProgramComponent} from "./components/pages/tour_program/monthly/monthly.component";
import {BrickSelectComponent} from "./components/form_elements/territory/brick_select/brick-select.component";
import {TourFormComponent} from "./components/pages/tour_program/tour_form/tour_form.component";
import {DailyTourProgramComponent} from "./components/pages/tour_program/daily/daily.component";
import {CreateCustomerComponent} from "./components/pages/customer/create/create.component";
import {CustomerComponent} from "./components/pages/customer/index/index.component";
import {CustomerTypeSelectComponent} from "./components/form_elements/customer/customer_type_select/customer_type-select.component";
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
        DailyTourProgramComponent,
        CreateCustomerComponent,
        UpdateCustomerComponent,
        StpComponent,
        TourComponent,
        RegionStpComponent,
        AreaStpComponent,
        HeadquarterStpComponent,
        TerritoryStpComponent,
        BrickStpComponent,

        // directives
        AttendanceStatusDirective,
        CustomerTypeDirective,
        StatusDirective,
        RoleCheckDirective,
        VisitCountDirective,
        nvD3,
        OrderCountDirective,
        CalendarAttendanceStatusDirective,
        CalendarTourStatusDirective,
        TourCountDirective,

        // reusable components
        MonthPickerComponent,
        PaginationComponent,
        RoleSelectComponent,
        UserSelectComponent,
        RegionSelectComponent,
        AreaSelectComponent,
        TerritorySelectComponent,
        HeadquarterSelectComponent,
        DatePickerComponent,
        DeactivateUserComponent,
        PasswordResetComponent,
        VisitCountGraphComponent,
        DatesSelectComponent,
        MultipleUserSelectComponent,
        MultipleTerritorySelectComponent,
        MultipleHeadquarterSelectComponent,
        VisitOrderTrendComponent,
        HighestCallComponent,
        HighestOrderComponent,
        WorkTypeSelectComponent,
        LeaveTypeSelectComponent,
        ManagerSelectComponent,
        BrickSelectComponent,
        CustomerTypeSelectComponent,
        GradeSelectComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpModule,
        routing
    ],
    providers: [
        CookieService,
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
        StpService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
