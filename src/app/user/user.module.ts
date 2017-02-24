import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {UserComponent} from "./components/index.component";
import {UserService} from "../base/services/user.service";
import {BaseModule} from "../base/base.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseModule],
  declarations: [
    UserComponent
  ],
  providers: [

  ],
  exports: [
    UserComponent
  ]
})
export class UserModule {
}
