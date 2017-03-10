import {Component, ViewChild, ElementRef} from "@angular/core";
import * as moment from "moment";
import {User} from "../../models/user/user";
import {AppConstants} from "../../app.constants";
import {VisitService} from "../../services/visit.service";
import {Visit} from "../../models/visit/visit";
import {BaseComponent} from "../base/base.component";
import {AuthService} from "../../services/AuthService";
import {Holiday} from "../../models/holiday";
declare let jQuery: any;
declare let d3: any;

@Component({
    templateUrl: '../../templates/pages/visit.component.html',
    styleUrls: ['../../templates/less/visit.component.less']
})
export class VisitComponent extends BaseComponent {

    /**
     * manager and user Role id
     * @type {number}
     */
    public role_id: number = 0;
    public manager_role_id: number = 0;

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
     * User Component Constructor
     *
     */
    constructor(private visitService: VisitService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetchVisits();
    }

    /**
     * Adding visits to skeleton
     *
     * @param visits
     * @param holidays
     */
    addVisitToSkeleton(visits: Visit[], holidays: Holiday[]) {
        let data_skeleton = {};
        let users: User[] = [];

        let skeleton: Array<Visit> = AppConstants.prepareMonthVisitSkeleton(this.month, this.year, holidays);

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

        // add skeleton to user
        for (let user of users) {
            user.visits = data_skeleton[user.id];
        }

        this.users = users;
    }

    /**
     * load attendance for children of logged in user
     */
    fetchVisits() {
        this.loading = true;
        this.visitService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
            response => {
                this.loading = false;
                // convert to visits
                let visits: Visit[] = response.visits.map(function (visit, index) {
                    return new Visit(visit);
                });

                // convert to holidays
                let holidays: Holiday[] = response.visits.map(function (visit, index) {
                    return new Holiday(visit);
                });

                this.addVisitToSkeleton(visits, holidays);
                this.prepareChart(visits, holidays);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * prepare chart for visit counts
     */
    prepareChart(visits: Visit[], holidays: Holiday[]) {
        let counts: Array<number> = AppConstants.prepareSkeletonForMonth(this.month, this.year, holidays);

        // prepare visit skeleton
        for (let visit of visits) {
            if (counts[visit.visit_day - 1] > -1)
                counts[visit.visit_day - 1] += visit.visit_count;
        }

        this.chart_data = counts.map((count, index) => {
            return {
                label: index + 1,
                value: count
            };
        }).filter(count => count.value >= 0);
    }

    /**
     * month and year changed
     *
     * @param date
     */
    monthYearChanged(date) {
        this.month = date.month;
        this.year = date.year;
        this.fetchVisits();
    }

    /**
     * when role is changed filter list of visits
     * @param role_id
     */
    roleChanged(role_id) {
        this.role_id = role_id;
        this.manager_role_id = parseInt(role_id) + 1;
        this.managerChanged(0);
    }

    /**
     * when role is changed filter list of users
     *
     * @param manager_id
     */
    managerChanged(manager_id) {
        this.manager_id = manager_id;
        this.fetchVisits();
    }
}
