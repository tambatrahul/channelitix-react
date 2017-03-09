import {Component} from "@angular/core";
import {CustomerService} from "../../services/customer.service";
import {AuthService} from "../../services/AuthService";
import {Customer} from "../../models/customer/customer";
import {ListComponent} from "../base/list.component";
declare let jQuery: any;

@Component({
    templateUrl: '../../templates/pages/customer.component.html',
    styleUrls: ['../../templates/less/customer.component.less']
})
export class CustomerComponent extends ListComponent {

    /**
     * pages number for customer and total customers
     *
     * @type {number}
     */
    public page: number = 1;
    public total: number = 10;

    /**
     * region, territory, area, headquarter & brick id
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public territory_id: number = 0;
    public headquarter_id: number = 0;
    public brick_id: number = 0;

    /**
     * customer type id and grade id
     */
    private customer_type_id: number = 0;
    private grade_id: number = 0;

    /**
     * customer list
     *
     * @type {Array}
     */
    public customers: Customer[] = [];

    /**
     * Customer Component constructor
     *
     * @param customerService
     * @param _service
     */
    constructor(private customerService: CustomerService, public _service: AuthService) {
        super(_service);
    }

    /**
     * load customerTypes
     */
    fetch() {
        this.loading = true;
        this.customerService.all(this.customer_type_id, this.grade_id, this.page, this.region_id,
            this.area_id, this.headquarter_id, this.territory_id, this.brick_id).subscribe(
            response => {
                this.loading = false;
                this.customers = response.customers;
                this.total = response.total;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * customer type changed
     * @param c_t_id
     */
    customerTypeChanged(c_t_id) {
        this.customer_type_id = c_t_id;
        this.fetch();
    }

    /**
     * Page changed
     *
     * @param page
     */
    pageChanged(page) {
        this.page = page;
        this.fetch();
    }

    /**
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.region_id = region_id;
        this.areaChanged(0);
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
    }

    /**
     * when territory is changed filter list of customer
     * @param territory_id
     */
    territoryChanged(territory_id) {
        this.territory_id = territory_id;
        this.brickChanged(0);
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.territoryChanged(0);
    }

    /**
     * when brick is changed filter list of customer
     * @param brick_id
     */
    brickChanged(brick_id) {
        this.brick_id = brick_id;
        this.fetch();
    }
}
