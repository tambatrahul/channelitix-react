import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AttendanceService} from "../../base/services/attendance.service";
import {AttendanceComponent} from "./views/index.component";
import {AttendanceStatusDirective} from "../../directives/attendance/status.directive";
import {MonthPickerComponent} from "../../shared/reusables/month_picker.component";
import {RoleSelectComponent} from "../../shared/reusables/role-select.component";
import {UserSelectComponent} from "../../shared/reusables/user-select.component";
import {BaseModule} from "../../base/base.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseModule],
  declarations: [
    MonthPickerComponent,
    AttendanceComponent,
    AttendanceStatusDirective,
    RoleSelectComponent,
    UserSelectComponent
  ],
  providers: [
    AttendanceService,
  ],
  exports: [
    MonthPickerComponent,
    AttendanceComponent,
    AttendanceStatusDirective
  ]
})
export class AttendanceModule {
}
