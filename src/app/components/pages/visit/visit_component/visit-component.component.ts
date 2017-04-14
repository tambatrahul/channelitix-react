import {Component, Input} from "@angular/core";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {CustomerService} from "../../../../services/customer.service";

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
     * form fields
     */
    _date: string;
    /**
     * Input attendance
     *
     * @param attendance
     */
    @Input()
    set attendance(attendance: Attendance) {
        this._date = moment(attendance.date, "YYYY-MM-DD").format("DD MMMM YYYY");
    }

    constructor(private customerService: CustomerService, public _router: Router,
                public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
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
