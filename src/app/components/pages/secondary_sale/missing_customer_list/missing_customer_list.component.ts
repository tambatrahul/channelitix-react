import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {SecondarySaleService} from "../../../../services/secondary_sale.service";
declare let jQuery: any;

@Component({
    selector: 'missing-customer-list',
    templateUrl: 'missing_customer_list.component.html',
    styleUrls: ['missing_customer_list.component.less']
})
export class MissingCustomerListComponent extends BaseAuthComponent {

    /**
     * month for report
     */
    _month: number;
    @Input()
    set month(month: number) {
        this._month = month;
        this.fetch();
    }

    /**
     * year for report
     */
    @Input()
    year: number;

    /**
     * Region Id
     */
    _region_id: number;
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
    }

    /**
     * Area Id
     */
    _area_id: number;
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
    }

    /**
     * Headquarter Id
     */
    _headquarter_id: number;
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return "Customer List";
    }

    /**
     * Customers
     *
     * @type {{}}
     */
    public customers: Customer[] = [];

    /**
     * Visit
     *
     * @param secondarySaleService
     * @param _service
     */
    constructor(private secondarySaleService: SecondarySaleService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * fetch server data for visits
     */
    fetch() {
        if (this._month && this.year && this._headquarter_id) {
            this.loading = true;
            this.secondarySaleService.missing_customers(this._month + 1, this.year, this._headquarter_id, this._area_id, this._region_id).subscribe(
                response => {
                    this.customers = response.customers.map(cus => new Customer(cus));
                    this.loading = false;
                },
                err => {
                    this.loading = false;
                }
            )
        }
    }
}
