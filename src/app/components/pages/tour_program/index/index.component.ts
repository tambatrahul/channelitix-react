import {Component} from "@angular/core";
import {User} from "../../../../models/user/user";
import {AppConstants} from "../../../../app.constants";
import {AuthService} from "../../../../services/AuthService";
import {Holiday} from "../../../../models/holiday";
import {TourService} from "../../../../services/tour.service";
import {Tour} from "../../../../models/tour_program/tour";
import {BaseMonthlyComponent} from "../../../base/base_monthly.component";
declare let jQuery: any;
declare let d3: any;

@Component({
    templateUrl: 'index.component.html',
    styleUrls: ['index.component.less']
})
export class TourComponent extends BaseMonthlyComponent {

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
}
