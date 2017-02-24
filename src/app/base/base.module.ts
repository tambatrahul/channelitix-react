import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {StatusDirective} from "./directives/status.directive";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    StatusDirective,
  ],
  providers: [],
  exports: [
    StatusDirective
  ]
})
export class BaseModule {
}
