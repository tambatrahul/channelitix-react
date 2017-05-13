import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {VisitService} from "../../../../services/visit.service";
import {Visit} from "../../../../models/visit/visit";
import {BaseAuthComponent} from "../../../base/base_auth.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {AttendanceService} from "../../../../services/attendance.service";
import {Attendance} from "../../../../models/attendance/attendance";
import {Observable} from "rxjs/Rx";
declare let jQuery: any;
declare let d3: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class VisitComponent extends BaseAuthComponent {

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;
    public manager_role_id: number = 0;

    /**
     * abbott check
     *
     * @type {boolean}
     */
    public abbott: boolean = false;

    /**
     * manager_id
     */
    public manager_id: number = 0;

    public options: {};
    public chart_data = [];

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * get date range
     *
     * @returns {Array<number>}
     */
    get dates(): Array<number> {
        let dates = [];
        for (let d = 1; d <= moment().month(this.month).year(this.year).endOf('month').date(); d++) {
            dates.push(d);
        }
        return dates;
    }

    /**
     * get title of table
     * @returns {string}
     */
    get title(): string {
        return moment().year(this.year).month(this.month).format("MMMM, YYYY");
    }

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * list of attendances
     * @type {Array}
     */
    public attendances: Attendance[] = [];

    /**
     * users
     *
     * @type {{}}
     */
    public managers: User[] = [];

    /**
     * User Component Constructor
     *
     */
    constructor(private visitService: VisitService, private attendanceService: AttendanceService,
                public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetchData();
    }

    /**
     * Adding visits to skeleton
     *
     * @param users
     * @param visits
     * @param holidays
     * @param attendances
     */
    addVisitToSkeleton(users: User[], visits: Visit[], holidays: Holiday[], attendances: Attendance[]) {
        let data_skeleton = {};
        let managers: User[] = [];
        let zone_managers: User[] = [];

        let skeleton: Array<Visit> = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);

        // get skeleton
        for (let user of users) {
            data_skeleton[user.id] = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
        }

        // prepare visit skeleton
        for (let visit of visits) {
            // add user if not present
            if (!data_skeleton.hasOwnProperty(visit.created_by)) {
                data_skeleton[visit.created_by] = skeleton.map(visit => Object.assign(new Visit({}), visit));
                users.push(visit.creator);
            }

            // set visit details
            data_skeleton[visit.created_by][visit.visit_day - 1].visit_count = visit.visit_count;
        }

        // add attendance to visit skeleton
        for (let att of attendances) {
            if (data_skeleton.hasOwnProperty(att.created_by))
                data_skeleton[att.created_by][moment(att.date, "YYYY-MM-DD").date() - 1].attendance = att;
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.id))
                user.visits = data_skeleton[user.id];
            else
                user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.id))
                user.visits = data_skeleton[user.id];
            else
                user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);

            // separate csm and zsm
            if (user.role_str == this.ROLE_CSM) {
                managers.push(user);
            } else if (user.role_str == this.ROLE_ZSM) {
                zone_managers.push(user);
            }
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_ZSM) {
            this._service.user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
            this._service.user.children = [];
            this._service.user.cse_count = 0;
            zone_managers.push(this._service.user)
        }

        // if user is zone manager add it to list
        if (this._service.user.role_str == this.ROLE_CSM) {
            this._service.user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
            this._service.user.children = [];
            managers.push(this._service.user)
        }

        // add children to managers
        for (let u of users) {
            for (let m of managers) {
                if (u.manager_id == m.id) {
                    m.children.push(u);
                    u.visits.forEach(function (att, index) {
                        if (att.id) {
                            m.visits[index].visit_count += 1;
                        }
                    });
                }
            }
        }

        // add to zone manager
        for (let z of zone_managers) {
            for (let m of managers) {
                if (m.manager_id == z.id) {
                    z.children.push(m);
                    m.visits.forEach(function (att, index) {
                        z.visits[index].visit_count += att.visit_count;
                    });
                    z.cse_count += m.children.length
                }
            }
        }

        if (this.environment.envName == 'sk_group' && this.abbott) {
            let abbott_user = new User({full_name: 'Abbott'});
            abbott_user.visits = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);
            abbott_user.children = [];
            abbott_user.cse_count = 0;
            zone_managers.push(abbott_user);
            for (let m of managers) {
                zone_managers[0].children.push(m);
                m.visits.forEach(function (att, index) {
                    zone_managers[0].visits[index].visit_count += att.visit_count;
                });
                zone_managers[0].cse_count += m.children.length

            }
        }

        // depending on list show view
        if (zone_managers.length > 0)
            this.managers = zone_managers;
        else
            this.managers = managers;
    }

    /**
     * fetch server data for visits
     */
    fetchData() {
        this.loading = true;
        let synergy;
        if (this.environment.envName == 'sk_group')
            synergy = this.abbott ? 1 : 0;

        Observable.forkJoin(
            this.attendanceService.forChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy),
            this.visitService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id, synergy)
        ).subscribe(data => {

            this.loading = false;

            // convert to visits
            let visits: Visit[] = data[1].visits.map(function (visit, index) {
                return new Visit(visit);
            });

            // convert to holidays
            let holidays: Holiday[] = data[1].holidays.map(function (visit, index) {
                return new Holiday(visit);
            });

            // convert to models
            let children = data[1].children.map(function (user, index) {
                return new User(user);
            });

            this.addVisitToSkeleton(children, visits, holidays, data[0].attendances);
        }, err => {
            this.loading = false;
        });
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchData();
    }

    /**
     * switch to abbott
     */
    switchToAbbott() {
        this.abbott = !this.abbott;
        this.fetchData();
    }
}
