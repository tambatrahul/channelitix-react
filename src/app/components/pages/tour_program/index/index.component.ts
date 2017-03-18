import {Component, ViewChild, ElementRef} from "@angular/core";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {TourService} from "../../../../services/tour.service";
import {Tour} from "../../../../models/tour_program/tour";
import {BaseMonthlyComponent} from "../../../base/base_monthly.component";
import * as moment from "moment";
declare let jQuery: any;
declare let d3: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class TourComponent extends BaseMonthlyComponent {

    /**
     * loading identifier
     */
    @ViewChild('tour_program_modal')
    tour_program_modal: ElementRef;

    /**
     * users
     *
     * @type {{}}
     */
    public users: User[] = [];

    /**
     * Tours
     */
    tour: Tour;
    tours: Tour[] = [];

    /**
     * user id
     *
     * @type {number}
     */
    public user_id: number = 0;

    /**
     * User Component Constructor
     *
     * @param tourService
     * @param _service
     */
    constructor(private tourService: TourService, public _service: AuthService) {
        super(_service);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    /**
     * Adding tours to skeleton
     *
     * @param children
     * @param tours
     * @param holidays
     */
    addTourToSkeleton(children: User[], tours: Tour[], holidays: Holiday[]) {
        let data_skeleton = {};
        let users: User[] = [];

        let skeleton: Array<Tour> = AppConstants.prepareMonthTourSkeleton(this.month, this.year, holidays);

        // add active children
        for (let user of children) {
            users.push(user);
            data_skeleton[user.id] = skeleton.map(tour => Object.assign(new Tour({}), tour));
        }

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
    fetch() {
        this.loading = true;
        this.tourService.monthlyCountForChildren(this.month + 1, this.year, this.role_id, this.manager_id).subscribe(
            response => {
                this.loading = false;
                // convert to tours
                let tours: Tour[] = response.tours.map(function (tour, index) {
                    return new Tour(tour);
                });

                // convert to holidays
                let holidays: Holiday[] = response.holidays.map(function (holiday, index) {
                    return new Holiday(holiday);
                });

                // convert to users
                let children = response.children.map(function (user, index) {
                    return new User(user);
                });

                this.addTourToSkeleton(children, tours, holidays);
            },
            err => {
                this.loading = false;
            }
        );
    }

    /**
     * fetch tours for month year and date
     *
     * @param user
     * @param date
     */
    fetchTours(user: User, date: number) {
        let tour_date = moment();
        tour_date.month(this.month);
        tour_date.year(this.year);
        tour_date.date(date);
        this.tourService.forChildren(this.month + 1, this.year, user.id, date).subscribe(
            response => {
                this.tour = new Tour({
                    user: user,
                    date: tour_date.format('YYYY-MM-DD'),
                    tours: response.tours
                });
            },
            err => {

            }
        )
    }

    /**
     * show tour popup
     *
     * @param tour
     * @param user
     */
    showTours(tour, user) {
        this.user_id = user.id;
        let date = moment(tour.date, "YYYY-MM-DD").date();
        this.fetchTours(user, date);
        jQuery(this.tour_program_modal.nativeElement).modal();
    }

    /**
     * tour created refresh tour list
     */
    tourCreated() {
        let date = moment(this.tour.date, "YYYY-MM-DD").date();
        this.fetchTours(this.tour.user, date);
        this.fetch();
    }

    /**
     * tour deleted refresh tour list
     */
    tourDeleted() {
        let date = moment(this.tour.date, "YYYY-MM-DD").date();
        this.fetchTours(this.tour.user, date);
        this.fetch();
    }
}
