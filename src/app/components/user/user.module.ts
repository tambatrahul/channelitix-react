import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {UserComponent} from "./views/index.component";
import {BaseModule} from "../../base/base.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseModule],
  declarations: [
    UserComponent,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserComponent,
  ]
})
export class UserModule {
}
