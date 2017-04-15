import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {CustomerService} from "../../../../services/customer.service";
import {Customer} from "../../../../models/customer/customer";
import {Visit} from "../../../../models/visit/visit";
import {VisitService} from "../../../../services/visit.service";
import {VisitInput} from "../../../../models/visit/visit_input";

@Component({
    selector: 'visit-component',
    templateUrl: 'visit-component.component.html',
    styleUrls: ['visit-component.component.less']
})
export class VisitComponentComponent extends BaseAuthComponent {

    /**
     * month and year input
     */
    month: number;
    year: number;

    /**
     * pages number for customer and total customers
     *
     * @type {number}
     */
    public page: number = 1;

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
    private value: number = 0;

    /**
     * form fields
     */
    _visit_date: string;

    /**
     * customer list
     *
     * @type {Array}
     */
    public customers: Customer[] = [];
    public inputs: VisitInput[] = [];

    /**
     * Input attendance
     *
     * @param attendance
     */
    @Input()
    set attendance(attendance: Attendance) {
        this._visit_date = moment(attendance.date, "YYYY-MM-DD").format("DD MMMM YYYY");
    }

    constructor(private customerService: CustomerService, private visitService: VisitService, public _router: Router,
                public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        this.region_id = this._service.user.hq_region_id;
        this.area_id = this._service.user.hq_area_id;
        this.headquarter_id = this._service.user.hq_headquarter_id;
        this.territory_id = this._service.user.hq_territory_id;
        this.brick_id = this._service.user.hq_brick_id;
        this.fetch();
        this.fetchMasters();
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
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * load masters
     */
    fetchMasters() {
        this.loading = true;
        this.visitService.masters().subscribe(
            response => {
                this.loading = false;
                this.inputs = response.inputs;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * Save Visit
     */
    save(){
        this.loading = true;

    }
}
