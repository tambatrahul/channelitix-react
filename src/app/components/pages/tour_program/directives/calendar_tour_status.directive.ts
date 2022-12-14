import {Directive, ElementRef} from "@angular/core";
import {Tour} from "../../../../models/tour_program/tour";


@Directive({
    selector: '[calendarTourStatus]',
    inputs: ['tour']
})
export class CalendarTourStatusDirective {

    marked: string = "#2ecc71";
    not_marked: string = "#e67e22";
    holiday: string = "#bdc3c7";

    /**
     * Tour Status Directive
     *
     * @param el
     */
    constructor(private el: ElementRef) {
        this.el = el;
    }

    /**
     * on change of status change background color or cell
     *
     * @param tour
     */
    set tour(tour: Tour) {
        if (tour) {
            this.el.nativeElement.style.backgroundColor = this.not_marked;
        }

        if (tour && tour.isSunday) {
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }

        if (tour && tour.tours && tour.tours.length > 0) {
            // set background color
            this.el.nativeElement.style.backgroundColor = this.marked;
        }

        if (tour && tour.isHoliday) {
            this.el.nativeElement.style.backgroundColor = this.holiday;
        }
    }
}
