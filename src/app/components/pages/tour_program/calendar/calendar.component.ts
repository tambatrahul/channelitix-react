import {Component, Input, EventEmitter, Output} from "@angular/core";
import * as moment from "moment";
import {AppConstants} from "../../../../app.constants";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {AuthService} from "../../../../services/AuthService";
import {Tour} from "../../../../models/tour_program/tour";
declare let jQuery: any;

@Component({
    selector: 'tour-calendar-select',
    templateUrl: 'calendar.component.html',
    styleUrls: ['calendar.component.less']
})
export class CalendarTourComponent extends ListComponent {

    /**
     * get week days for header
     *
     * @type {Array<string>}
     */
    week_days = AppConstants.week_days;

    /**
     * event Date selection
     *
     * @type {EventEmitter}
     */
    @Output()
    onTourSelected = new EventEmitter();

    /**
     * month and year input
     */
    @Input()
    month: number;
    @Input()
    year: number;

    /**
     * Tours
     */
    _tours: Tour[] = [];
    @Input()
    set tours(tours: Tour[]) {
        this._tours = tours;
        this.fetch();
    }

    /**
     * get holidays from input
     *
     * @type {Array}
     */
    _holidays: Holiday[] = [];
    @Input()
    set holidays(holidays: Holiday[]) {
        this._holidays = holidays;
        this.fetch();
    }

    /**
     * formatted tours
     */
    formatted_array: Tour[] = [];

    /**
     * Customer Component constructor
     *
     * @param _service
     */
    constructor(public _service: AuthService) {
        super(_service);
    }

    /**
     * on load of call fetch
     */
    ngOnInit() {
        this.fetch();
    }

    /**
     * Fetch attendances from server
     */
    protected fetch() {
        // get skeleton
        let skeleton: Tour[] = AppConstants.prepareMonthTourSkeleton(this.month, this.year, this._holidays);

        // get date
        let date = moment().year(this.year).month(this.month);

        // get start date and end date of month
        let start_day = date.startOf('month').weekday();
        let end_day = date.endOf('month').weekday();

        // adding attendance to skeleton
        for (let tour of this._tours) {
            skeleton[moment(tour.date, "YYYY-MM-DD").date() - 1].tours.push(tour);
        }

        // add buffer at start
        for (let i = 0; i < start_day; i++) {
            skeleton.unshift(null);
        }

        // add buffer at end
        for (let i = 1; i < 7 - end_day; i++) {
            skeleton.push(null);
        }

        // assign to formatted array for display
        this.formatted_array = skeleton;
    }

    /**
     * on tour select changed
     *
     * @param tour
     */
    selectTour(tour: Tour) {
        this.onTourSelected.emit(tour);
    }
}
