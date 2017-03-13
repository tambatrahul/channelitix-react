import {Component, Input} from "@angular/core";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Tour} from "../../../../models/tour_program/tour";
import {TourService} from "../../../../services/tour.service";
declare let jQuery: any;

@Component({
    selector: 'daily-tour',
    templateUrl: 'daily.component.html',
    styleUrls: ['daily.component.less']
})
export class DailyTourProgramComponent extends ListComponent {

    /**
     * Date of tour
     */
    @Input()
    date: string;

    /**
     * Tours
     */
    @Input()
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
     * Fetch all details
     */
    protected fetch() {
    }

    deleteTour(id: number) {

    }
}
