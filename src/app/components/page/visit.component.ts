import {Component, ViewChild, ElementRef} from "@angular/core";
import * as moment from "moment";
import {User} from "../../models/user/user";
import {AppConstants} from "../../app.constants";
import {VisitService} from "../../services/visit.service";
import {Visit} from "../../models/visit/visit";
declare let jQuery: any;

@Component({
    selector: 'app-root',
    templateUrl: '../../templates/page/visit.component.html',
    styleUrls: ['../../templates/less/visit.component.less']
})
export class VisitComponent {

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

    /**
     * year and month for calendar
     * @type {number}
     */
    public month: number;
    public year: number;

    /**
     * loading identifier
     */
    @ViewChild('loading_table')
    loading_table: ElementRef;

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
     * Set loading variable
     * @param loading
     */
    set loading(loading) {
        if (loading)
            jQuery(this.loading_table.nativeElement).mask('loading');
        else
            jQuery(this.loading_table.nativeElement).unmask();
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
    constructor(private visitService: VisitService) {
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        this.month = moment().month();
        this.year = moment().year();
        this.fetchVisits();
    }

    /**
     * Adding visits to skeleton
     *
     * @param users
     * @param visits
     */
    addVisitToSkeleton(users: User[], visits: Visit[]) {
        let data_skeleton = {};

        // prepare visit skeleton
        for (let visit of visits) {
            // add user if not present
            if (!data_skeleton.hasOwnProperty(visit.created_by)) {
                data_skeleton[visit.created_by] = AppConstants.prepareMonthSkeleton(this.month, this.year);
            }

            // set visit details
            data_skeleton[visit.created_by][moment(visit.visit_date, "YYYY-MM-DD").date() - 1] = visit;
        }

        // add skeleton to user
        for (let user of users) {
            if (data_skeleton.hasOwnProperty(user.id))
                user.visits = data_skeleton[user.id];
            else
                user.visits = AppConstants.prepareMonthSkeleton(this.month, this.year);
        }

        this.users = users;
    }

    /**
     * load attendance for children of logged in user
     */
    fetchVisits() {
        this.loading = true;
        this.visitService.monthlyVisits(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;
                this.addVisitToSkeleton(response.children, response.visits);
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
        this.fetchVisits();
    }

    /**
     * when role is changed filter list of visits
     * @param role_id
     */
    roleChanged(role_id) {
        this.role_id = role_id;
        this.manager_role_id = parseInt(role_id) + 1;
        this.fetchVisits();
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
