import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
import {ListComponent} from "../../../base/list.component";
import {SecondarySale} from "../../../../models/sale/secondary_sale";
import {SecondarySaleService} from "../../../../services/sale.service";
import {Product} from "../../../../models/order/product";
import {ProductService} from "../../../../services/product.service";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class ProductComponent extends ListComponent {

    /**
     * products
     *
     * @type {Array}
     */
    public products: Product[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private productService: ProductService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.fetch();
    }

    /**
     * fetch products from server
     */
    fetch() {
        this.loading = true;
        this.productService.all().subscribe(
            response => {
                this.loading = false;
                // convert to models
                this.products = response.products.map(function (product, index) {
                    return new Product(product);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }
}
