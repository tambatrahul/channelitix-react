import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../base-select.component";
import {LeaveType} from "../../../../models/attendance/leave_type";

@Component({
    selector: 'leave-type-select',
    templateUrl: 'leave-type-select.component.html'
})
export class LeaveTypeSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Leave Type";

    /**
     * First value for
     */
    @Input()
    first_value: string = "Select Leave Type";

    /**
     * leave type list
     *
     * @type {Array}
     */
    @Input()
    public leave_types: LeaveType[] = [];

    /**
     * Leave Type Select Constructor
     */
    constructor() {
        super();
    }

    /**
     * load areas
     */
    fetch() {
    }
}
