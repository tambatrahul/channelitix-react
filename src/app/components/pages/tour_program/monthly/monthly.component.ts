import {Component} from "@angular/core";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Tour} from "../../../../models/tour_program/tour";
import {TourService} from "../../../../services/tour.service";
declare let jQuery: any;

@Component({
    templateUrl: 'monthly.component.html',
    styleUrls: ['monthly.component.less']
})
export class MonthlyTourProgramComponent extends ListComponent {

    /**
     * month and year input
     */
    month: number;
    year: number;

    /**
     * Tours
     */
    tour: Tour;
    tours: Tour[] = [];

    /**
     * get holidays from input
     *
     * @type {Array}
     */
    holidays: Holiday[] = [];

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
        this.fetchTours();
    }

    /**
     * Fetch tour from server
     */
    fetchTours() {
        this.loading = true;
        this.tourService.monthly(this.month + 1, this.year).subscribe(
            response => {
                this.loading = false;
                this.tours = response.tours;
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
        this.fetchTours();
    }

    /**
     * on date selection
     *
     * @param tour
     */
    onTourSelected(tour: Tour) {
        this.tour = tour;
    }

    /**
     * tour created refresh tour list
     */
    tourCreated() {
        this.tour = null;
        this.fetchTours();
    }

    /**
     * tour deleted refresh tour list
     */
    tourDeleted() {
        this.tour = null;
        this.fetchTours();
    }
}
