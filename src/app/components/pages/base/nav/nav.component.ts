import {Component} from "@angular/core";
import {AuthService} from "../../../../services/AuthService";
import {BaseComponent} from "../../../base/base.component";
import * as moment from "moment";
declare let jQuery: any;

@Component({
    selector: 'nav-comp',
    templateUrl: 'nav.component.html',
    styleUrls: ['nav.component.less']
})
export class NavComponent extends BaseComponent {

    public month: number;
    public year: number;

    /**
     * Nav Component Constructor
     * @param _auth_service
     */
    constructor(public _auth_service: AuthService) {
        super();
    }

    /**
     * reload navigation on view initialization
     */
    ngAfterViewInit() {
        jQuery('.list-accordion').each(function () {
            jQuery(this).dcAccordion({
                eventType: 'click',
                hoverDelay: 100,
                autoClose: true,
                saveState: false,
                disableLink: true,
                speed: 'fast',
                showCount: false,
                autoExpand: true,
                cookie: 'dcjq-accordion-1',
                classExpand: 'dcjq-current-parent'
            });
        });
        this.month = moment().month();
        this.year = moment().year();
    }
}
