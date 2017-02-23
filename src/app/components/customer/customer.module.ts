import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CustomerComponent} from "./views/index.component";
import {CustomerService} from "../../services/customer.service";
import {CustomerCountComponent} from "./views/count.component";
import {CustomerTypeDirective} from "../../directives/customer/customer_type.directive";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [
    CustomerComponent,
    CustomerCountComponent,
    CustomerTypeDirective
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
