import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {StatusDirective} from "./directives/status.directive";
import {CookieService} from "angular2-cookie/services/cookies.service";
import {AuthService} from "./services/AuthService";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    StatusDirective,
  ],
  providers: [
    CookieService,
    AuthService
  ],
  exports: [
    StatusDirective
  ]
})
export class BaseModule {
}
