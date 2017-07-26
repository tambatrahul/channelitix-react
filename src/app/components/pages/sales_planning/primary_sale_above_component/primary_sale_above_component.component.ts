import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Customer} from "../../../../models/customer/customer";
import {forEach} from "@angular/router/src/utils/collection";

@Component({
    selector: 'primary-sale-above',
    styleUrls: ['primary_sale_above_component.component.less'],
    templateUrl: 'primary_sale_above_component.component.html',
    inputs: ['refresh']
})
export class PrimarySaleAboveComponent extends ListComponent {

    /**
     * customer with planning details
     */
    _customers: Customer[];

    /**
     * Total customer object
     */
    _customer: Customer;

    /**
     * customers input details
     *
     * @param customers
     */
    @Input()
    set customers(customers: Customer[]) {
        this._customers = customers;
        this.format_data();
    }

    /**
     * customers input details
     *
     * @param customer
     */
    @Input()
    set total_customer(customer: Customer) {
        this._customer = customer;
        this.format_data();
    }

    /**
     * constructor for Sale plan component
     *
     * @param _service
     */
    constructor(public _service: AuthService) {
        super(_service);
    }

    /**
     * fetch counts from server
     */
    protected fetch() {
    }

    /**
     * format data for display
     */
    protected format_data() {
        if (this._customers) {
            let total = PrimarySaleAboveComponent.total_avg_primary_previous_year(this._customer);

            if (total > 0)
                total = total * 0.8;

            this._customers.map(cus => {
                cus.total_avg_previous_year = PrimarySaleAboveComponent.total_avg_primary_previous_year(cus);

            });

            let customers: Customer[] = [];

            customers = this._customers.sort((a, b) =>
                b.total_avg_previous_year -
                a.total_avg_previous_year
            );

            customers = customers.filter(cus => cus.total_avg_previous_year > 0);

            let key = this.calculateIfTotalIsGreater(customers, total);

            customers = customers.slice(0, key);
        }
    }

    /**
     * get total average primary for previous year
     *
     * @returns {any}
     */
    static total_avg_primary_previous_year(customer: Customer) {
        if (customer) {
            return customer.plans[5].avg_primary_previous_year
                + customer.plans[2].avg_primary_previous_year
                + customer.plans[7].avg_primary_previous_year
                + customer.plans[0].avg_primary_previous_year;
        }
        else
            return 0;
    }

    /**
     * Calculate if total is greater than the value
     * @param customers
     * @param total
     * @returns {Customer[]}
     */
    calculateIfTotalIsGreater(customers: Customer[], total: number): number {
        let cus_total = 0;
        let index;
        customers.map((cus, key) => {
            cus_total += cus.total_avg_previous_year;

            if (cus_total >= total && !index)
                index = key;
        });

        return index;
    }
}
