import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CustomerComponent} from "./views/index.component";
import {CustomerService} from "../../services/customer.service";
import {CustomerCountComponent} from "./views/count.component";
import {CustomerTypeDirective} from "../../directives/customer/customer_type.directive";
import {CustomerStatusDirective} from "../../directives/customer/status.directive";
import {PaginationComponent} from "../../shared/reusables/pagination.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    CustomerComponent,
    CustomerCountComponent,
    CustomerTypeDirective,
    CustomerStatusDirective,
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
