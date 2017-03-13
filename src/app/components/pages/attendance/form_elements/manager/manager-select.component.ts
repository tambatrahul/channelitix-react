import {Component, Input} from "@angular/core";
import {BaseSelectComponent} from "../../../section/base-select.component";
import {User} from "../../../../../models/user/user";

@Component({
    selector: 'manager-select',
    templateUrl: 'manager-select.component.html'
})
export class ManagerSelectComponent extends BaseSelectComponent {

    /**
     * title for select field
     */
    @Input()
    title: string = "Select Manager";

    /**
     * First value for
     */
    @Input()
    first_value: string = "Select Manager";

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
