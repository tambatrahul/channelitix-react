import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {CustomerService} from "../../../../services/customer.service";
import {Customer} from "../../../../models/customer/customer";

@Component({
    selector: 'customer-select',
    templateUrl: 'customer-select.component.html'
})
export class CustomerSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Customer";

    /**
     * First value for
     */
    @Input()
    first_value: string = "Select Customer";

    /**
     * customer type and grade
     */
    private _customer_type_id;
    private _grade_id: number;
    private _synergy: number;

    /**
     * territory filters
     */
    private _country_id: number;
    private _region_id: number;
    private _area_id: number;
    private _headquarter_id: number;

    constructor(private customerService: CustomerService) {
        super();
    }

    /**
     * customer_type_id getter and setters
     *
     * @param customer_type_id
     */
    @Input()
    set customer_type_id(customer_type_id) {
        this._customer_type_id = customer_type_id;
        this.fetch();
    }

    get customer_type_id() {
        return this._customer_type_id;
    }

    /**
     * synergy getter and setters
     *
     * @param synergy
     */
    @Input()
    set synergy(synergy: number) {
        this._synergy = synergy;
        this.fetch();
    }

    get synergy(): number {
        return this._synergy;
    }

    /**
     * grade_id getter and setters
     *
     * @param grade_id
     */
    @Input()
    set grade_id(grade_id: number) {
        this._grade_id = grade_id;
        this.fetch();
    }

    get grade_id(): number {
        return this._grade_id;
    }
    /**
     * country_id getter and setters
     *
     * @param country_id
     */
    @Input()
    set country_id(country_id: number) {
        this._country_id = country_id;
        this.fetch();
    }

    get country_id(): number {
        return this._country_id;
    }

    /**
     * region_id getter and setters
     *
     * @param region_id
     */
    @Input()
    set region_id(region_id: number) {
        this._region_id = region_id;
        this.fetch();
    }

    get region_id(): number {
        return this._region_id;
    }

    /**
     * area_id getter and setters
     *
     * @param area_id
     */
    @Input()
    set area_id(area_id: number) {
        this._area_id = area_id;
        this.fetch();
    }

    get area_id(): number {
        return this._area_id;
    }

    /**
     * headquarter_id getter and setters
     *
     * @param headquarter_id
     */
    @Input()
    set headquarter_id(headquarter_id: number) {
        this._headquarter_id = headquarter_id;
        this.fetch();
    }

    get headquarter_id(): number {
        return this._headquarter_id;
    }

    /**
     * load areas
     */
    fetch() {
        this.loading = true;
        this.customerService.forTypes(this.customer_type_id)
            .subscribe(
                response => {
                    this.loading = false;
                    this.models = response.customers;
                },
                err => {
                    this.loading = false;
                }
            );
    }
}
