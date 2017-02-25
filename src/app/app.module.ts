import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";

// base
import {BaseComponent} from "./components/base.component";
import {NavComponent} from "./components/nav.component";
import {HeaderComponent} from "./components/header.component";

// routing
import {routing} from "./app.routes";

// pages
import {LoginComponent} from "./components/page/login.component";
import {UserComponent} from "./components/page/user.component";
import {CustomerComponent} from "./components/page/customer.component";
import {CustomerCountComponent} from "./components/page/section/customer_count.component";
import {AttendanceComponent} from "./components/page/attendance.component";
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
import {AreaSelectComponent} from "./components/page/section/area-select.component";
import {BrickSelectComponent} from "./components/page/section/brick-select.component";
import {HeadquarterSelectComponent} from "./components/page/section/headquarter-select.component";
import {TerritorySelectComponent} from "./components/page/section/territory-select.component";
import {CookieService} from "angular2-cookie/services/cookies.service";

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    NavComponent,
    HeaderComponent,
    LoginComponent,
    UserComponent,
    CustomerComponent,
    CustomerCountComponent,
    AttendanceComponent,
    AttendanceStatusDirective,
    CustomerTypeDirective,
    StatusDirective,
    MonthPickerComponent,
    PaginationComponent,
    RoleSelectComponent,
    UserSelectComponent,
    AreaSelectComponent,
    BrickSelectComponent,
    HeadquarterSelectComponent,
    TerritorySelectComponent
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
    LoginService,
    TerritoryService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
