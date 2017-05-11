import {Component, ViewChild, ElementRef} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
import {Attendance} from "../../../../models/attendance/attendance";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Visit} from "../../../../models/visit/visit";
import {VisitService} from "../../../../services/visit.service";
import {AppConstants} from "../../../../app.constants";
declare let jQuery: any;
declare let swal: any;

@Component({
    templateUrl: 'monthly.component.html',
    styleUrls: ['monthly.component.less']
})
export class MonthlyAttendanceComponent extends ListComponent {

    refresh: boolean = false;

    /**
     * loading identifier
     */
    @ViewChild('attendance_reporting')
    attendance_reporting: ElementRef;

    /**
     * loading identifier
     */
    @ViewChild('customer_selection')
    customer_selection: ElementRef;

    /**
     * month and year input
     */
    month: number;
    year: number;

    today: boolean = false;

    /**
     * Attendances
     */
    attendance: Attendance;
    visit: Visit;
    attendances: Attendance[] = [];

    /**
     * get holidays from input
     *
     * @type {Array}
     */
    holidays: Holiday[] = [];

    /**
     * User Component Constructor
     *
     * @param visitService
     * @param attendanceService
     * @param _router
     * @param _service
     */
    constructor(private visitService: VisitService, private attendanceService: AttendanceService,
                public _router: Router, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        this.fetch();
    }

    /**
     * Fetch all details
     */
    protected fetch() {
        this.fetchAttendances();
    }

    /**
     * Fetch attendance from server
     */
    fetchAttendances() {
        this.loading = true;
        this.attendanceService.monthly(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;
                this.attendances = response.attendances.map(function(att) {
                    return new Attendance(att);
                });
                this.holidays = response.holidays;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchAttendances();
    }

    /**
     * on date selection
     *
     * @param att
     */
    onAttendanceSelected(att: Attendance) {
        this.today = moment(att.date, "YYYY-MM-DD") > moment();
        this.attendance = att;
        if (this.attendance.reporting_status == 'open') {
            this.loading = true;
            this.visitService.for_date(att.date).subscribe(
                response => {
                    this.loading = false;
                    if (response.visits.length > 0) {
                        jQuery(this.attendance_reporting.nativeElement).modal();
                    } else {
                        jQuery(this.customer_selection.nativeElement).modal();
                    }
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * attendance created refresh attendance list
     */
    attendanceCreated(attendance) {
        this.attendance = attendance;
        this.fetchAttendances();
        this.refresh = !this.refresh;
        if (attendance.work_type.name == AppConstants.FIELD_WORK)
            jQuery(this.customer_selection.nativeElement).modal();
    }

    /**
     * attendance updated refresh attendance list
     */
    attendanceUpdated() {
        this.attendance = null;
        this.fetchAttendances();
    }

    /**
     * on selection of customers
     */
    onCustomerSelection() {
        this.refresh = !this.refresh;
        jQuery(this.customer_selection.nativeElement).modal('hide');
        jQuery(this.attendance_reporting.nativeElement).modal();
    }

    /**
     * report submitted
     */
    reportSubmitted() {
        jQuery(this.attendance_reporting.nativeElement).modal('hide');
        swal({
            title: "Attendance Report Submitted Successfully",
            text: "I will close in 2 sec.",
            type: "success",
            timer: 1500,
            showConfirmButton: false
        });
        this.fetchAttendances();
        this.attendance = null;
    }

    /**
     * view attendance report
     */
    viewReport() {
        jQuery(this.attendance_reporting.nativeElement).modal();
    }

    /**
     * Add more customers
     */
    addMoreCustomer() {
        jQuery(this.attendance_reporting.nativeElement).modal('hide');
        jQuery(this.customer_selection.nativeElement).modal();
    }
}
