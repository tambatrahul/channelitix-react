import {Component, Input} from "@angular/core";
import {WorkType} from "../../../../../models/attendance/work_type";
import {BaseSelectComponent} from "../../../section/base-select.component";

@Component({
    selector: 'work-type-select',
    templateUrl: 'work-type-select.component.html'
})
export class WorkTypeSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Work Type";

    /**
     * First value for
     */
    @Input()
    first_value: string = "Select Work Type";

    /**
     * areas list
     *
     * @type {Array}
     */
    @Input()
    public work_types: WorkType[] = [];

    /**
     * Work Type Select Constructor
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
