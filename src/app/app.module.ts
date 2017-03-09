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
import {CustomerComponent} from "./components/pages/customer.component";
import {CustomerCountComponent} from "./components/pages/section/customer_count.component";
import {AttendanceComponent} from "./components/pages/attendance.component";
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
import {BrickSelectComponent} from "./components/pages/section/brick-select.component";
import {HeadquarterSelectComponent} from "./components/pages/section/headquarter-select.component";
import {TerritorySelectComponent} from "./components/pages/section/territory-select.component";
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
        AttendanceComponent,
        VisitComponent,
        OrderComponent,
        DashBoardComponent,

        // directives
        AttendanceStatusDirective,
        CustomerTypeDirective,
        StatusDirective,
        RoleCheckDirective,
        VisitCountDirective,
        nvD3,
        OrderCountDirective,

        // reusable components
        MonthPickerComponent,
        PaginationComponent,
        RoleSelectComponent,
        UserSelectComponent,
        RegionSelectComponent,
        AreaSelectComponent,
        TerritorySelectComponent,
        HeadquarterSelectComponent,
        BrickSelectComponent,
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
        HighestOrderComponent
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
        OrderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
