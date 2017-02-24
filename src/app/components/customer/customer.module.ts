import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {CustomerComponent} from "./views/index.component";
import {CustomerService} from "../../services/customer.service";
import {CustomerCountComponent} from "./views/count.component";
import {CustomerTypeDirective} from "../../directives/customer/customer_type.directive";
import {CustomerStatusDirective} from "../../directives/customer/status.directive";
import {PaginationComponent} from "../../shared/reusables/pagination.component";
import {TerritorySelectComponent} from "../../shared/reusables/territory/territory-select.component";
import {TerritoryService} from "../../services/territory.service";
import {AreaSelectComponent} from "../../shared/reusables/territory/area-select.component";
import {HeadquarterSelectComponent} from "../../shared/reusables/territory/headquarter-select.component";
import {BrickSelectComponent} from "../../shared/reusables/territory/brick-select.component";

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    declarations: [
        CustomerComponent,
        CustomerCountComponent,
        TerritorySelectComponent,
        AreaSelectComponent,
        HeadquarterSelectComponent,
        BrickSelectComponent,
        CustomerTypeDirective,
        CustomerStatusDirective,
        PaginationComponent
    ],
    providers: [
        CustomerService,
        TerritoryService,
    ],
    exports: [
        CustomerComponent,
    ]
})
export class CustomerModule {
}
