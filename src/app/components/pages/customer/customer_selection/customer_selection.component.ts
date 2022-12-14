import {Component, Output, EventEmitter, ViewChild, ElementRef, Input} from "@angular/core";
import {CustomerService} from "../../../../services/customer.service";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {TerritoryService} from "../../../../services/territory.service";
import {Brick} from "../../../../models/territory/brick";
import {Territory} from "../../../../models/territory/territory";
import {Customer} from "../../../../models/customer/customer";
import {VisitService} from "../../../../services/visit.service";
declare let jQuery: any;

@Component({
    selector: 'customer-selection',
    templateUrl: 'customer_selection.component.html',
    styleUrls: ['customer_selection.component.less']
})
export class CustomerSelectionComponent extends ListComponent {

    /**
     * region, area, headquarter
     *
     * @type {number}
     */
    public hq_region_id: number = 0;
    public hq_area_id: number = 0;
    public hq_headquarter_id: number = 0;

    /**
     * loading identifier
     */
    @ViewChild('brick_selection')
    brick_selection: ElementRef;

    /**
     * selected Customers
     *
     * @type {Array}
     */
    public selectedCustomer_ids: Array<number> = [];


    /**
     * selected Bricks
     *
     * @type {Array}
     */
    public selectedBricks: Array<number> = [];

    /**
     * customer list
     *
     * @type {Array}
     */
    public customers = [];

    /**
     * territories
     */
    territories: Territory[] = [];

    /**
     * tour creation selection
     *
     * @type {EventEmitter}
     */
    @Output()
    customers_selected = new EventEmitter();

    /**
     * date of attendance
     */
    _user_ids: Array<number> = [];
    @Input()
    set user_ids(user_ids: Array<number>) {
        this._user_ids = user_ids;
        this.fetch();
    }

    get user_ids() {
        return this._user_ids;
    }

    /**
     * date of attendance
     */
    _attendance_date: string;
    @Input()
    set attendance_date(attendance_date: string) {
        this._attendance_date = attendance_date;
        // brick selection
        jQuery(this.brick_selection.nativeElement).select2({
            placeholder: "Select bricks you worked in.",
            allowClear: true
        });

        this.fetchCustomers();
        this.fetchAlreadySelectedCustomers();
    }

    get attendance_date() {
        return this._attendance_date;
    }

    /**
     * customer selection constructor
     *
     * @param visitService
     * @param customerService
     * @param territoryService
     * @param _authService
     */
    constructor(private visitService: VisitService, private customerService: CustomerService,
                private territoryService: TerritoryService, private _authService: AuthService) {
        super(_authService);
        if (this._authService.user.role_str == this.ROLE_RSM) {
            this.hq_region_id = this._authService.user.hq_region_id;
        }
    }

    /**
     * load customerTypes
     */
    fetch() {
        let self = this;
        this.loading = true;
        this.territoryService.brick(0, 0, this._user_ids).subscribe(
            response => {
                this.loading = false;
                this.formatBricks(response.bricks.map(function (brick) {
                    return new Brick(brick);
                }));
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * Formatting bricks
     *
     * @param bricks
     */
    formatBricks(bricks: Brick[]) {
        let self = this;

        // prepare territories
        let territories: Territory[] = [];
        let territory_ids: Array<number> = [];
        for (let brick of bricks) {
            if (territory_ids.indexOf(brick.hq_territory_id) < 0) {
                territory_ids.push(brick.hq_territory_id);
                territories.push(brick.hq_territory);
            }
            territories[territory_ids.indexOf(brick.hq_territory_id)].hq_bricks.push(brick);
        }
        this.territories = territories;

        // brick selection
        jQuery(this.brick_selection.nativeElement).select2({
            placeholder: "Select bricks you worked in.",
            allowClear: true
        });
        jQuery(this.brick_selection.nativeElement).on("select2:select", function (e) {
            let select_val = jQuery(e.currentTarget).val();
            self.selectedBricks = select_val;
            self.fetchCustomers();
        });
    }

    /**
     * fetch customers for brick
     */
    fetchCustomers() {
        let self = this;
        this.loading = true;
        this.customerService.forBricks(this.selectedBricks).subscribe(
            response => {
                this.loading = false;
                this.customers = response.customers.map(function (customer) {
                    return new Customer(customer);
                });
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * fetch all visit for date
     */
    fetchAlreadySelectedCustomers() {
        this.loading = true;
        this.visitService.for_date(this._attendance_date).subscribe(
            response => {
                this.loading = false;
                this.selectedCustomer_ids = [];
                response.visits.map(visit => {
                    this.selectedCustomer_ids.push(visit.customer_id);
                })
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * select customer
     * @param customer_id
     */
    addCustomer(customer_id: number) {
        this.selectedCustomer_ids.push(customer_id);
    }

    /**
     * remove customer
     *
     * @param customer_id
     */
    removeCustomer(customer_id: number) {
        this.selectedCustomer_ids.splice(this.selectedCustomer_ids.indexOf(customer_id), 1);
    }

    /**
     * save selected customers
     */
    save() {
        this.loading = true;
        this.visitService.customer_select(this.selectedCustomer_ids, this.attendance_date).subscribe(
            response => {
                this.loading = false;
                this.customers_selected.emit();
            },
            err => {
                this.loading = false;
            }
        )
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.hq_area_id = area_id;
        this.fetch();
    }

    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.hq_headquarter_id = headquarter_id;
        this.fetch();
    }
}
