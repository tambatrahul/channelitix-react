import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {StatusDirective} from "./directives/status.directive";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {AuthService} from "./services/AuthService";
import {UserService} from "./services/user.service";
import {AttendanceService} from "./services/attendance.service";
import {LoginService} from "./services/login.service";
import {CustomerService} from "./services/customer.service";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    StatusDirective,
  ],
  providers: [
    CookieService,
    AuthService,
    UserService,
    AttendanceService,
    LoginService,
    CustomerService
  ],
  exports: [
    StatusDirective
  ]
})
export class BaseModule {
}
