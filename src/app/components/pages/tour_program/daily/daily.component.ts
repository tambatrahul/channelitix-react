import {Component, Input, EventEmitter, Output} from "@angular/core";
import {Holiday} from "../../../../models/holiday";
import {ListComponent} from "../../../base/list.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../../services/AuthService";
import * as moment from "moment";
import {Tour} from "../../../../models/tour_program/tour";
import {TourService} from "../../../../services/tour.service";

declare let jQuery: any;
declare let swal: any;

@Component({
    selector: 'daily-tour',
    templateUrl: 'daily.component.html',
    styleUrls: ['daily.component.less']
})
export class DailyTourProgramComponent extends ListComponent {


    /**
     * tour deleted selection
     *
     * @type {EventEmitter}
     */
    @Output()
    tourDeleted = new EventEmitter();


    /**
     * Date of tour
     */
    _date: string;
    @Input()
    set tour(tour: Tour) {
        console.log(tour);
        this._date = moment(tour.date, "YYYY-MM-DD").format("DD MMMM YYYY");
        this.tours = tour.tours;
    };

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
     * Fetch all details
     */
    protected fetch() {
    }

    /**
     * delete tour
     *
     * @param tour
     */
    deleteTour(tour: Tour) {
        let self = this;
        swal({
            title: "Are you sure?",
            text: "You will not be able to recover this tour!",
            type: "warning",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            showCancelButton: true,
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                self.tourService.destroy(tour.id).subscribe(
                    response => {
                        self.tours.slice(self.tours.indexOf(tour), 1);
                        self.tourDeleted.emit();
                    }
                );
            }
        });

    }
}
