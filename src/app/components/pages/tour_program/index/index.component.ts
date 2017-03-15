import {Component} from "@angular/core";
import * as moment from "moment";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {BaseAuthComponent} from "../../../base/base.component";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {TourService} from "../../../../services/tour.service";
import {Tour} from "../../../../models/tour_program/tour";
declare let jQuery: any;
declare let d3: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class TourComponent extends BaseAuthComponent {

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
     * @param tourService
     * @param _service
     */
    constructor(private tourService: TourService, public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of component load customer types
     */
    ngOnInit() {
        super.ngOnInit();
        this.month = moment().month();
        this.year = moment().year();
        this.fetchTours();
    }

    /**
     * Adding tours to skeleton
     *
     * @param tours
     * @param holidays
     */
    addTourToSkeleton(tours: Tour[], holidays: Holiday[]) {
        let data_skeleton = {};
        let users: User[] = [];

        let skeleton: Array<Tour> = AppConstants.prepareMonthTourSkeleton(this.month, this.year, holidays);

        // prepare tour skeleton
        for (let tour of tours) {

            // add user if not present
            if (!data_skeleton.hasOwnProperty(tour.user_id)) {
                data_skeleton[tour.user_id] = skeleton.map(tour => Object.assign(new Tour({}), tour));
                users.push(tour.user);
            }

            // set tour details
            data_skeleton[tour.user_id][tour.tour_day - 1].tour_count = tour.tour_count;
        }

        // add skeleton to user
        for (let user of users) {
            user.tours = data_skeleton[user.id];
        }

        this.users = users;
    }

    /**
     * load tour for children of logged in user
     */
    fetchTours() {
        this.loading = true;
        this.tourService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
            response => {
                this.loading = false;
                // convert to tours
                let tours: Tour[] = response.tours.map(function (tour, index) {
                    return new Tour(tour);
                });

                // convert to holidays
                let holidays: Holiday[] = response.tours.map(function (tour, index) {
                    return new Holiday(tour);
                });

                this.addTourToSkeleton(tours, holidays);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * prepare chart for tour counts
     */
    prepareChart(tours: Tour[], holidays: Holiday[]) {
        let counts: Array<number> = AppConstants.prepareSkeletonForMonth(this.month, this.year, holidays);

        // prepare tour skeleton
        for (let tour of tours) {
            if (counts[tour.tour_day - 1] > -1)
                counts[tour.tour_day - 1] += tour.tour_day;
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
        this.fetchTours();
    }

    /**
     * when role is changed filter list of tours
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
        this.fetchTours();
    }
}
