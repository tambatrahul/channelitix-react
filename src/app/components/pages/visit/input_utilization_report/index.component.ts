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
    month: number;


    /**
     * year
     */
    year: number;

    /**
     * title of page
     *
     * @returns {string}
     */
    public get title() {
        return moment().month(this.month).format('MMMM') + ", " + this.year;
    }

    /**
     * headquarter id
     */
    public _hq_id: number;
    public _area_id: number;
    public _region_id: number;
    public headquarter: Headquarter;

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
    }

    /**
     * fetch customer secondary sales from server
     */
    fetch() {
        this.route.params.subscribe(params => {
            this._hq_id = params['hq_id'];
            this._area_id = params['area_id'];
            this._region_id = params['region_id'];
            this.month = parseInt(params['month']);
            this.year = parseInt(params['year']);
            this.fetchData();
        });
    }

    /**
     * load users for logged in user
     */
    fetchData() {
        this.loading = true;
        this.visitService.input_utilization(this._region_id, this._area_id, this._hq_id, this.month + 1, this.year).subscribe(
            response => {
                // get inputs
                this.inputs = response.inputs.map(input => new Input(input));

                // get visit
                let visits = response.visits.map(visit => new Visit(visit));

                // prepare data for display
                this.prepareData(this.inputs, visits);

                this.loading = false;
            }
        );

        this.loading = false;
    }

    // Prepare Data For Display
    prepareData(inputs: Input[], visits: Visit[]) {
        let dates = {};
        let totals = [];
        let all_total = 0;

        inputs.map(function (input) {
            totals.push({
                'input_id': input.id,
                'total_value': 0
            });
        });

        visits.map(function (visit) {
            let d = new Date(visit.visit_date);
            let visit_date = moment(d).format('YYYY/MM/DD');

            // Set Date In Array
            if (!dates.hasOwnProperty(visit_date)) {
                dates[visit_date] = {};
            }

            // Initialize All Variables
            if (!dates[visit_date].hasOwnProperty(visit.customer_id)) {
                dates[visit_date][visit.customer_id] = {};
                dates[visit_date][visit.customer_id]['customer'] = {};
                dates[visit_date][visit.customer_id]['total_input'] = 0;
                dates[visit_date][visit.customer_id]['inputs'] = [];

                inputs.map(function (input) {
                    dates[visit_date][visit.customer_id]['inputs'].push({
                        'input_id': input.id,
                        'input_value': 0
                    });
                })
            }

            // Set Customer data
            if (dates[visit_date][visit.customer_id]['customer']) {
                dates[visit_date][visit.customer_id]['customer'] = visit.customer;
            }

            // Set Input Data
            for (let inp of dates[visit_date][visit.customer_id]['inputs']) {
                if (inp.input_id == visit.input_id) {
                    inp.input_value = visit.visit_input_count;
                }
            }

            // Set Total Of All inputs
            dates[visit_date][visit.customer_id]['total_input'] += +visit.visit_input_count;

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
}
