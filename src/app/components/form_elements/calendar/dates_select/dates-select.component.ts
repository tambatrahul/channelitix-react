import {Component, Input} from "@angular/core";
import {AppConstants} from "../../../../app.constants";
import * as moment from "moment";

@Component({
    selector: 'dates-select',
    templateUrl: 'dates-select.component.html',
    styleUrls: ['../../../pages/dashboard/index/index.component.less']
})
export class DatesSelectComponent {

    /**
     * type
     */
    @Input()
    type: string = AppConstants.DAILY;
    types: Array<string> = AppConstants.date_types;

    /**
     * daily variables
     */
    from_date: string = "";
    to_date: string = "";

    /**
     * on load set from and to dates
     */
    ngOnInit() {
        // get date
        let date = moment();

        // get start date and end date of month
        this.fromDateChanged(date.startOf('month').format("DD MMM YY"));
        this.toDateChanged(date.endOf('month').format("DD MMM YY"));
    }

    /**
     * on change in type of date
     *
     * @param type
     */
    onTypeChanged(type: string) {
        this.type = type;
        if (this.type == this.types[0]) {
            // get date
            let date = moment();

            // get start date and end date of month
            this.fromDateChanged(date.startOf('month').format("DD MMM YY"));
            this.toDateChanged(date.endOf('month').format("DD MMM YY"));
        } else if (this.type == this.types[1]) {
            this.fromDateChanged("");
            this.toDateChanged("");
        }
    }

    /**
     * on from date changed
     */
    fromDateChanged(date) {
        this.from_date = date;
    }

    /**
     * on to date changed
     */
    toDateChanged(date) {
        this.to_date = date;
    }
}
