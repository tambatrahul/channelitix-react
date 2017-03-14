import {BrowserModule} from "@angular/platform-browser";
import {NgModule, enableProdMode} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {nvD3} from "ng2-nvd3";
// base
import {BaseComponent} from "./components/base.component";
import {NavComponent} from "./components/nav.component";
import {HeaderComponent} from "./components/header.component";
// routing
import {routing} from "./app.routes";
// pages
import {LoginComponent} from "./components/pages/login.component";
import {UserComponent} from "./components/pages/user.component";
import {CustomerCountComponent} from "./components/pages/section/customer_count.component";
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
import {MonthPickerComponent} from "./components/common/month_picker.component";
import {PaginationComponent} from "./components/common/pagination.component";
import {RoleSelectComponent} from "./components/common/role-select.component";
import {UserSelectComponent} from "./components/common/user-select.component";
import {AreaSelectComponent} from "./components/pages/section/area-select.component";
import {HeadquarterSelectComponent} from "./components/pages/section/headquarter-select.component";
import {TerritorySelectComponent} from "./components/pages/territory/form_elements/territory_select/territory-select.component";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {RegionSelectComponent} from "./components/pages/section/region-select.component";
import {DatePickerComponent} from "./components/common/date_picker.component";
import {CreateUserComponent} from "./components/pages/create_user.component";
import {UpdateUserComponent} from "./components/pages/update_user.component";
import {RoleCheckDirective} from "./directives/role.directive";
import {VisitService} from "./services/visit.service";
import {VisitComponent} from "./components/pages/visit.component";
import {VisitCountDirective} from "./directives/visit_count.directive";
import {DeactivateUserComponent} from "./components/pages/section/deactivate_user.component";
import {VisitCountGraphComponent} from "./components/pages/section/visit_count_graph.component";
import {OrderService} from "./services/order.service";
import {OrderComponent} from "./components/pages/order.component";
import {OrderCountDirective} from "./directives/order_count.directive";
import {PasswordResetComponent} from "./components/pages/section/password_reset.component";
import {DashBoardComponent} from "./components/pages/dashboard/dashboard.component";
import {DatesSelectComponent} from "./components/pages/form_elements/dates-select.component";
import {MultipleUserSelectComponent} from "./components/pages/form_elements/multiple-user-select.component";
import {MultipleTerritorySelectComponent} from "./components/pages/form_elements/multiple-territory-select.component";
import {MultipleHeadquarterSelectComponent} from "./components/pages/form_elements/multiple-headquarter-select.component";
import {VisitOrderTrendComponent} from "./components/pages/graphs/visit_order_trend_graph.component";
import {HighestCallComponent} from "./components/pages/graphs/highest_call_graph.component";
import {HighestOrderComponent} from "./components/pages/graphs/highest_order_graph.component";
import {CalendarAttendanceComponent} from "./components/pages/attendance/calendar/calendar.component";
import {CalendarAttendanceStatusDirective} from "./components/pages/attendance/directives/calendar_attendance_status.directive";
import {MonthlyAttendanceComponent} from "./components/pages/attendance/monthly/monthly.component";
import {CreateAttendanceComponent} from "./components/pages/attendance/create/create.component";
import {WorkTypeSelectComponent} from "./components/pages/attendance/form_elements/work_type/work-type-select.component";
import {LeaveTypeSelectComponent} from "./components/pages/attendance/form_elements/leave_type/leave-type-select.component";
import {ManagerSelectComponent} from "./components/pages/attendance/form_elements/manager/manager-select.component";
import {UpdateAttendanceComponent} from "./components/pages/attendance/update/update.component";
import {TourService} from "./services/tour.service";
import {CalendarTourStatusDirective} from "./components/pages/tour_program/directives/calendar_tour_status.directive";
import {CalendarTourComponent} from "./components/pages/tour_program/calendar/calendar.component";
import {MonthlyTourProgramComponent} from "./components/pages/tour_program/monthly/monthly.component";
import {BrickSelectComponent} from "./components/pages/territory/form_elements/brick_select/brick-select.component";
import {TourFormComponent} from "./components/pages/tour_program/tour_form/tour_form.component";
import {DailyTourProgramComponent} from "./components/pages/tour_program/daily/daily.component";
import {CreateCustomerComponent} from "./components/pages/customer/create/create.component";
import {CustomerComponent} from "./components/pages/customer/index/index.component";
import {CustomerTypeSelectComponent} from "./components/common/customer_type-select.component";
import {CustomerGradeSelectComponent} from "./components/common/customer_grade-select.component";
import {UpdateCustomerComponent} from "./components/pages/customer/update/update.component";

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
        CustomerGradeSelectComponent
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
        OrderService,
        TourService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
