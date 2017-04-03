import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {OrderService} from "../../../../services/order.service";
import {Order} from "../../../../models/order/order";
declare let jQuery: any;

@Component({
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})
export class SecondarySaleCreateComponent extends BaseAuthComponent {

    /**
     * User Component Constructor
     *
     */
    constructor(private orderService: OrderService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }
}
