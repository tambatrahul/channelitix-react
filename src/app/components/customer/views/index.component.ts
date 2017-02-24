import {Component, ViewChild, ElementRef} from "@angular/core";
import {Customer} from "../../../models/customer/customer";
import {CustomerService} from "../../../base/services/customer.service";
declare let jQuery: any;

@Component({
    templateUrl: 'templates/index.component.html',
    styleUrls: ['templates/less/index.component.less']
})
export class CustomerComponent {

    /**
     * loading identifier
     */
    @ViewChild('loading_table')
    loading_table: ElementRef;

    /**
     * page number for customer and total customers
     *
     * @type {number}
     */
    public page: number = 1;
    public total: number = 10;

    /**
     * territory, area, headquarter & brick id
     */
    public territory_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;
    public brick_id: number = 0;

    /**
     * customer type id
     */
    private customer_type_id: number = 0;

    /**
     * on load of component load users
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * Set loading variable
     * @param loading
     */
    set loading(loading) {
        if (loading)
            jQuery(this.loading_table.nativeElement).mask('loading');
        else
            jQuery(this.loading_table.nativeElement).unmask();
    }

    /**
     * customer list
     *
     * @type {Array}
     */
    public customers: Customer[] = [];

    constructor(private customerService: CustomerService) {
    }

    /**
     * load customerTypes
     */
    fetch() {
        this.loading = true;
        this.customerService.all(this.customer_type_id, 0, this.page, this.area_id, this.territory_id, this.headquarter_id,
            this.brick_id).subscribe(
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
     * when territory is changed filter list of customer
     * @param territory_id
     */
    territoryChanged(territory_id) {
        this.territory_id = territory_id;
        this.fetch();
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.fetch();
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.fetch();
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
