import {Component, Input, Output, EventEmitter} from "@angular/core";
import {AttendanceService} from "../../../../services/attendance.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import {FormComponent} from "../../../base/form.component";
import {AppConstants} from "../../../../app.constants";
import {WorkType} from "../../../../models/attendance/work_type";
import {LeaveType} from "../../../../models/attendance/leave_type";
import {FormBuilder} from "@angular/forms";
import {UserService} from "../../../../services/user.service";
import {User} from "../../../../models/user/user";
import * as moment from "moment";
import {Attendance} from "../../../../models/attendance/attendance";
import {IMultiSelectOption} from 'angular-2-dropdown-multiselect';
declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'create-attendance',
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})
export class CreateAttendanceComponent extends FormComponent {

    /**
     * settings
     */
    settings = {
        buttonClasses: "btn btn-default btn-secondary btn-block"
    };

    /**
     * active tab string
     * @type {string}
     */
    active_str: string = AppConstants.WORKING;

    /**
     * work type and leave type array
     *
     * @type {Array}
     */
    work_types: WorkType[] = [];
    leave_types: LeaveType[] = [];

    /**
     * user managers
     */
    managers: User[] = [];
    reps: User[] = [];
    manager_options: IMultiSelectOption[] = [];
    rep_options: IMultiSelectOption[] = [];
    working_with_ids: Array<number> = [];

    /**
     * event Date selection
     *
     * @type {EventEmitter}
     */
    @Output()
    attendanceCreated = new EventEmitter();

    /**
     * form fields
     */
    _date: string;
    public work_type_id: number = 0;
    public leave_type_id: number = 0;
    public working_with_id: number = 0;
    public no_of_calls: number = 0;
    public pob_amount: number = 0;
    public isSunday: boolean = false;
    public form = this._fb.group({
        work_type_id: [""],
        leave_type_id: [""],
        working_with_id: [""],
        date: [""],
        status: [""],
        no_of_calls: [""],
        pob_amount: [""],
        working_with_other: [""]
    });

    /**
     * Input attendance
     *
     * @param attendance
     */
    @Input()
    set attendance(attendance: Attendance) {

        // default status to working
        let status = AppConstants.WORKING;
        if (attendance.status) {
            status = attendance.status;
        }

        this.workTypeChanged(attendance.work_type_id);
        this.leaveTypeChanged(attendance.leave_type_id);
        this.managerChanged(attendance.working_with_id);
        this.form.patchValue({
            work_type_id: attendance.work_type_id,
            leave_type_id: attendance.leave_type_id,
            working_with_id: attendance.working_with_id,
            no_of_calls: attendance.no_of_calls,
            pob_amount: attendance.pob_amount,
            status: status,
            working_with_other: attendance.working_with_other
        });
        this.isSunday = attendance.isSunday;
        this.active_str = status;
        this.errors = {};

        this._date = moment(attendance.date, "YYYY-MM-DD").format("DD MMMM YYYY");
        this.form.patchValue({date: this._date});
    }

    /**
     * User Component Constructor
     *
     * @param attendanceService
     * @param userService
     * @param _router
     * @param _fb
     * @param _service
     */
    constructor(private attendanceService: AttendanceService, private userService: UserService,
                public _router: Router, public _fb: FormBuilder, public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        this.fetchMasters();
        this.fetchManager();
        this.fetchReps();
        this.form.patchValue({status: AppConstants.WORKING});
    }

    /**
     * reset form
     */
    reset() {
        this.work_type_id = 0;
        this.leave_type_id = 0;
        this.working_with_id = 0;
        this.no_of_calls = 0;
        this.pob_amount = 0;
        this.form.patchValue({
            work_type_id: 0,
            leave_type_id: 0,
            working_with_id: 0,
            no_of_calls: 0,
            pob_amount: 0,
            status: AppConstants.WORKING,
            working_with_other: false
        });
        this.active_str = AppConstants.WORKING;
        this.errors = {};
    }

    /**
     * Fetch all details
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.loading = true;
            let data = Object.assign({}, this.form.value);
            data.no_of_calls = this.no_of_calls;
            data.pob_amount = this.pob_amount;
            data.working_with_ids = this.working_with_ids;

            // format joining date
            if (data.date)
                data.date = moment(data.date, "DD MMMM YYYY").format('YYYY-MM-DD');

            this.attendanceService.create(data).subscribe(
                response => {
                    this.loading = false;
                    this.reset();
                    this.attendanceCreated.emit(new Attendance(response.attendance));
                },
                err => {
                    this.loading = false;
                    this.errors = err.errors.error;
                  swal({
                    title: this.errors,
                    type: 'warning',
                    showClass: {
                      popup: 'animated fadeInDown faster'
                    },
                    hideClass: {
                      popup: 'animated fadeOutUp faster'
                    }
                  });
                }
            );
        }
    }

    /**
     * mark tab as active
     *
     * @param active
     */
    selectTab(active) {
        this.active_str = active;
        this.form.patchValue({status: active});

    }

    /**
     * load masters from server
     */
    fetchMasters() {
        this.loading = true;
        this.attendanceService.masters().subscribe(
            response => {
                this.loading = false;
                this.work_types = response.work_types;
                this.leave_types = response.leave_types;
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * fetch managers from server
     */
    fetchManager() {
        this.userService.manager().subscribe(
            response => {
                this.managers = [];
                let manager = response.manager;
                while (manager) {
                    this.managers.push(manager);
                    manager = manager.manager;
                }
                this.manager_options = this.managers.map(function (manager) {
                    return {
                        id: manager.id, name: manager.full_name
                    };
                });
                this.manager_options.push({
                    id: 0, name: "Others"
                });
            },
            err => {

            }
        );
    }

    /**
     * fetch Reps from server
     */
    fetchReps() {
        this.userService.children(null, null, 'active').subscribe(
            response => {
                this.reps = response.users;
                this.rep_options = this.reps.map(function (rep) {
                    return {
                        id: rep.id, name: rep.full_name
                    };

                });
                this.rep_options.push({
                    id: 0, name: "Others"
                });
            },
            err => {

            }
        );
    }

    /**
     * when work type is changed
     *
     * @param work_type_id
     */
    workTypeChanged(work_type_id) {
        this.work_type_id = work_type_id;
        this.form.patchValue({work_type_id: work_type_id});
    }

    /**
     * when leave type is changed
     *
     * @param leave_type_id
     */
    leaveTypeChanged(leave_type_id) {
        this.leave_type_id = leave_type_id;
        this.form.patchValue({leave_type_id: leave_type_id});
    }

    /**
     * manager is changed
     *
     * @param working_with_id
     */
    managerChanged(working_with_id) {
        this.working_with_id = working_with_id;
        this.form.patchValue({working_with_id: working_with_id});
    }

    /**
     * toggle sunday
     */
    toggleSunday() {
        this.isSunday = !this.isSunday;
    }

    /**
     * working with changed
     */
    onWorkingWithChanged() {
        if (this.working_with_ids.filter(id => id == 0).length > 0)
            this.form.patchValue({working_with_other: true});
        else
            this.form.patchValue({working_with_other: false});
    }
}
