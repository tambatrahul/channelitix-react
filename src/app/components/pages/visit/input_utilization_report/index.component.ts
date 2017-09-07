import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {ListComponent} from "../../../base/list.component";
import {Headquarter} from "../../../../models/territory/headquarter";
import {AuthService} from "../../../../services/AuthService";
import {environment} from "../../../../../environments/environment";
import {VisitService} from "../../../../services/visit.service";
import {Input} from "../../../../models/visit/input";
import {Visit} from "../../../../models/visit/visit";
import {Customer} from "../../../../models/customer/customer";
declare let jQuery: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class InputUtilizationReportComponent extends ListComponent {

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;
    btn_loading: boolean = false;

    /**
     * region, territory, area, headquarter & brick id
     */
    public region_id: number = 0;
    public area_id: number = 0;
    public headquarter_id: number = 0;
    public _headquarters: Headquarter[] = [];
    public inputs: Input[] = [];
    public dates = [];
    public totals = [];
    public total = 0;

    /**
     * User Component Cons3tructor
     */
    constructor(public _service: AuthService, public route: ActivatedRoute, public visitService: VisitService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();

        if (environment.envName == 'geo') {
            if (this._service.user.role_id == 4) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
            }
            else if (this._service.user.role_id == 5) {
                this.region_id = this._service.user.hq_region_id;
            }
            else if (this._service.user.role_id == 3) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
                this.headquarter_id = this._service.user.hq_headquarter_id;
            }
        }
        else {
            if (this._service.user.role_id == 4) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
            }
            else if (this._service.user.role_id == 5) {
                this.region_id = this._service.user.hq_region_id;
            }
            else if (this._service.user.role_id == 3) {
                this.region_id = this._service.user.hq_region_id;
                this.area_id = this._service.user.hq_area_id;
                this.headquarter_id = this._service.user.hq_headquarter_id;
            }
        }
    }

    /**
     * load users for logged in user
     */
    fetch() {
        this.loading = true;
        this.btn_loading = true;
        this.visitService.input_utilizaiton(this.region_id, this.area_id, this.headquarter_id, this.month + 1, this.year).subscribe(
            response => {
                // get inputs
                this.inputs = response.inputs.map(input => new Input(input));

                // get visit
                let visits = response.visits.map(visit => new Visit(visit));

                // get customers
                let customers = response.customers.map(cus => new Customer(cus));

                // prepare data for display
                this.prepareData(this.inputs, visits, customers);

                this.loading = false;
                this.btn_loading = false;
            }
        );

        this.loading = false;
    }

    // Prepare Data For Display
    prepareData(inputs: Input[], visits: Visit[], customers: Customer[]) {
        let dates = {};
        let totals = [];
        let all_total = 0;

        inputs.map(function (input) {
            totals.push({
                'input_id': input.id,
                'total_value': 0
            });
        })

        visits.map(function (visit) {
            // Set Date In Array
            if (!dates.hasOwnProperty(visit.visit_date)) {
                dates[visit.visit_date] = {};
            }

            // Initialize All Variables
            if (!dates[visit.visit_date].hasOwnProperty(visit.customer_id)) {
                dates[visit.visit_date][visit.customer_id] = {};
                dates[visit.visit_date][visit.customer_id]['customer'] = {};
                dates[visit.visit_date][visit.customer_id]['total_input'] = 0;
                dates[visit.visit_date][visit.customer_id]['inputs'] = [];

                inputs.map(function (input) {
                    dates[visit.visit_date][visit.customer_id]['inputs'].push({
                        'input_id': input.id,
                        'input_value': 0
                    });
                })
            }

            // Set Customer data
            if (dates[visit.visit_date][visit.customer_id]['customer']) {
                dates[visit.visit_date][visit.customer_id]['customer'] = visit.customer;
            }

            // Set Input Data
            for (let inp of dates[visit.visit_date][visit.customer_id]['inputs']) {
                if (inp.input_id == visit.input_id) {
                    inp.input_value = visit.visit_input_count;
                }
            }

            // Set Total Of All inputs
            dates[visit.visit_date][visit.customer_id]['total_input'] += +visit.visit_input_count;

            totals.map(function (total) {
                if (total.input_id == visit.input_id)
                    total.total_value += +visit.visit_input_count;

            });

            all_total += +visit.visit_input_count;
        });

        this.total = all_total;
        this.totals = totals;

        let new_dates = [];
        Object.keys(dates).map(function (date) {
            new_dates.push([
                date,
                dates[date]
            ]);
        });

        this.dates = new_dates;
    }

    // Generate Object To Array
    generateArray(obj) {
        return Object.keys(obj).map((key) => {
            return obj[key]
        });
    }

    /**
     * get headquarters
     */
    headquarters(data) {
        this._headquarters = data.headquarters;
    }

    /**
     * when region is changed filter list of customer
     * @param region_id
     */
    regionChanged(region_id) {
        this.region_id = region_id;
        this.areaChanged(0);
        this.dates = [];
    }

    /**
     * when area is changed filter list of customer
     * @param area_id
     */
    areaChanged(area_id) {
        this.area_id = area_id;
        this.headquarterChanged(0);
        this.dates = [];
    }


    /**
     * when headquarter is changed filter list of customer
     * @param headquarter_id
     */
    headquarterChanged(headquarter_id) {
        this.headquarter_id = headquarter_id;
        this.dates = [];
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
    }
}
