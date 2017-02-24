import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CustomerComponent} from "./views/index.component";
import {CustomerService} from "../../base/services/customer.service";
import {CustomerCountComponent} from "./views/count.component";
import {CustomerTypeDirective} from "../../directives/customer/customer_type.directive";
import {PaginationComponent} from "../../shared/reusables/pagination.component";
import {BaseModule} from "../../base/base.module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, BaseModule],
  declarations: [
    CustomerComponent,
    CustomerCountComponent,
    CustomerTypeDirective,
    PaginationComponent
  ],
  providers: [
    CustomerService,
  ],
  exports: [
    CustomerComponent,
  ]
})
export class CustomerModule {
}
