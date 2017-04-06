import {Component, Input} from "@angular/core";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Tour} from "../../../../models/tour_program/tour";
import {TourService} from "../../../../services/tour.service";
import {AppConstants} from "../../../../app.constants";
import {User} from "../../../../models/user/user";

declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'user-wise-tour',
    templateUrl: 'user_wise.component.html',
    styleUrls: ['user_wise.component.less']
})
export class UserWiseTourProgramComponent extends ListComponent {

    /**
     * title for form
     *
     * @type {string}
     */
    title: string = "";

    /**
     * month & year
     */
    @Input()
    month: number;
    @Input()
    year: number;

    /**
     * user_id
     */
    _user_id: number;

    @Input()
    set user(user: User) {
        this._user_id = user.id;
        this.title = user.full_name;
        this.tours = [];
        this.fetch();
    }

    /**
     * Tours
     */
    tours: Tour[] = [];

    /**
     * Monthly Tour Program Constructor
     *
     * @param tourService
     * @param _router
     * @param _service
     */
    constructor(private tourService: TourService, public _router: Router, public _service: AuthService) {
        super(_service);
    }

    /**
     * format tours by date
     */
    protected formatTours(tours: Tour[]) {
        let skeleton: Array<Tour> = AppConstants.prepareMonthTourSkeleton(this.month, this.year, []);

        // prepare tour skeleton
        for (let tour of tours) {

            // set tour details
            skeleton[moment(tour.date, "YYYY-MM-DD").date() - 1].tours.push(tour);
        }

        // set tours
        this.tours = skeleton;
    }

    /**
     * Fetch all details
     */
    protected fetch() {
        if (this._user_id) {
            this.loading = true;
            this.tourService.forChildren(this.month + 1, this.year, this._user_id).subscribe(
                response => {
                    this.loading = false;
                    // convert to tours
                    let tours: Tour[] = response.tours.map(function (tour, index) {
                        return new Tour(tour);
                    });
                    this.formatTours(tours);
                },
                err => {
                    this.loading = false;
                }
            );
        }
    }

    /**
     * Download Excel For Bricks
     */
    excel_download() {
        this.tourService.tour_excel_download(this.month + 1, this.year, this._user_id).subscribe(
            response => {
                let blob: Blob = response.blob();
                window.open(window.URL.createObjectURL(blob), 'test.xls');
            },
            err => {
            }
        );
    }
}
