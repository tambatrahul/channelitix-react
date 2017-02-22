import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AttendanceService} from "../../services/attendance.service";
import {AttendanceComponent} from "./views/index.component";
import {AttendanceStatusDirective} from "../../directives/attendance/status.directive";
import {MonthPickerComponent} from "../../shared/reusables/month_picker.component";
import {RoleSelectComponent} from "../../shared/reusables/role-select.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    MonthPickerComponent,
    AttendanceComponent,
    AttendanceStatusDirective,
    RoleSelectComponent
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
