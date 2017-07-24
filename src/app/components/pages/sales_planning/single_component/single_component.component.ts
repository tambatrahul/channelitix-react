import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {Plan} from "../../../../models/plan";

@Component({
    styleUrls: ['single_component.component.less'],
    templateUrl: 'single_component.component.html',
    inputs: ['refresh']
})
export class SingleComponent extends ListComponent {

    _customer: Customer;
    @Input()
    set customer(customer: Customer) {
        this._customer = customer;
    }

    constructor(public _service: AuthService) {
        super(_service);
    }

    /**
     * initialize data
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
    }

    /**
     * format performance data
     */
    protected formatData() {
    }
}
