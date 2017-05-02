import {Component, Input, Output, EventEmitter} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
@Component({
    selector: 'product-wise-sale',
    styleUrls: ['../../product_wise_sale/index/index.component.less'],
    templateUrl: 'product_wise_sale.component.html',
})
export class ProductWiseSaleComponent extends ListComponent {

    constructor(public _service: AuthService) {
        super(_service);
    }

    protected fetch() {
    }

}
