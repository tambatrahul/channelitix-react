import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {LoginComponent} from "./components/login.component";
import {BaseModule} from "../base/base.module";
import {LoginService} from "../base/services/login.service";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseModule],
  declarations: [
    LoginComponent
  ],
  providers: [
    LoginService
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule {
}
